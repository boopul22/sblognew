const fs = require('fs-extra');
const path = require('path');
const he = require('he');

class WordPressDataExtractor {
  constructor(sqlFilePath) {
    this.sqlFilePath = sqlFilePath;
    this.data = {
      users: [],
      categories: [],
      tags: [],
      posts: [],
      attachments: [],
      postMeta: [],
      postCategories: [],
      postTags: []
    };
  }

  async extractData() {
    console.log('Reading WordPress SQL file...');
    const sqlContent = await fs.readFile(this.sqlFilePath, 'utf8');
    
    console.log('Extracting users...');
    this.extractUsers(sqlContent);
    
    console.log('Extracting terms (categories and tags)...');
    this.extractTerms(sqlContent);
    
    console.log('Extracting posts...');
    this.extractPosts(sqlContent);

    console.log('Extracting attachments...');
    this.extractAttachments(sqlContent);

    console.log('Extracting post metadata...');
    this.extractPostMeta(sqlContent);

    console.log('Extracting term relationships...');
    this.extractTermRelationships(sqlContent);
    
    await this.saveExtractedData();
    
    console.log('Data extraction completed!');
    console.log(`Extracted: ${this.data.users.length} users, ${this.data.categories.length} categories, ${this.data.tags.length} tags, ${this.data.posts.length} posts, ${this.data.attachments.length} attachments`);
  }

  extractUsers(sqlContent) {
    const userInsertMatch = sqlContent.match(/INSERT INTO `wp_users` VALUES\s*(.*?);/s);
    if (!userInsertMatch) return;

    const userValues = this.parseInsertValues(userInsertMatch[1]);
    
    userValues.forEach(values => {
      if (values.length >= 10) {
        this.data.users.push({
          wp_id: parseInt(values[0]),
          username: this.cleanString(values[1]),
          email: this.cleanString(values[4]),
          display_name: this.cleanString(values[9]),
          user_url: this.cleanString(values[5]),
          registered_at: this.parseDate(values[6])
        });
      }
    });
  }

  extractTerms(sqlContent) {
    // Extract terms
    const termsInsertMatch = sqlContent.match(/INSERT INTO `wp_terms` VALUES\s*(.*?);/s);
    if (!termsInsertMatch) return;

    const termValues = this.parseInsertValues(termsInsertMatch[1]);
    const terms = {};
    
    termValues.forEach(values => {
      if (values.length >= 4) {
        terms[values[0]] = {
          wp_id: parseInt(values[0]),
          name: this.cleanString(values[1]),
          slug: this.cleanString(values[2])
        };
      }
    });

    // Extract term taxonomy to categorize terms
    const taxonomyInsertMatch = sqlContent.match(/INSERT INTO `wp_term_taxonomy` VALUES\s*(.*?);/s);
    if (taxonomyInsertMatch) {
      const taxonomyValues = this.parseInsertValues(taxonomyInsertMatch[1]);
      
      taxonomyValues.forEach(values => {
        if (values.length >= 6) {
          const termId = values[1];
          const taxonomy = this.cleanString(values[2]);
          const description = this.cleanString(values[3]);
          const parentId = parseInt(values[4]) || null;
          
          if (terms[termId]) {
            const termData = {
              ...terms[termId],
              description,
              parent_wp_id: parentId
            };
            
            if (taxonomy === 'category') {
              this.data.categories.push(termData);
            } else if (taxonomy === 'post_tag') {
              this.data.tags.push(termData);
            }
          }
        }
      });
    }
  }

  extractPosts(sqlContent) {
    console.log('Looking for wp_posts INSERT statements...');

    // Split the content into lines and find INSERT INTO wp_posts statements
    const lines = sqlContent.split('\n');
    let currentInsert = '';
    let inPostsInsert = false;
    let insertStatements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.includes('INSERT INTO `wp_posts` VALUES')) {
        inPostsInsert = true;
        currentInsert = line;
        continue;
      }

      if (inPostsInsert) {
        currentInsert += '\n' + line;

        // Check if this line ends the INSERT statement
        if (line.endsWith(';') || (i + 1 < lines.length && lines[i + 1].trim().startsWith('INSERT INTO'))) {
          insertStatements.push(currentInsert);
          currentInsert = '';
          inPostsInsert = false;
        }
      }
    }

    if (!insertStatements.length) {
      console.log('No wp_posts INSERT statements found');
      return;
    }

    console.log(`Found ${insertStatements.length} wp_posts INSERT statements`);

    insertStatements.forEach((insertStatement, index) => {
      console.log(`Processing INSERT statement ${index + 1}...`);

      // Extract the values part - everything after VALUES
      const valuesIndex = insertStatement.indexOf('VALUES');
      if (valuesIndex === -1) {
        console.log(`No VALUES found in statement ${index + 1}`);
        return;
      }

      const valuesString = insertStatement.substring(valuesIndex + 6).replace(/;$/, '').trim();

      console.log(`Parsing values for statement ${index + 1}...`);
      const postValues = this.parseInsertValues(valuesString);
      console.log(`Found ${postValues.length} rows in statement ${index + 1}`);

      postValues.forEach((values, rowIndex) => {
        if (values.length >= 23) {
          const postType = this.cleanString(values[20]); // Fixed: post_type is at index 20
          const status = this.cleanString(values[7]);

          console.log(`Row ${rowIndex + 1}: type=${postType}, status=${status}, title=${this.cleanString(values[5])}`); // Fixed: post_title is at index 5

          // Only extract posts and pages that are published
          if ((postType === 'post' || postType === 'page') && status === 'publish') {
            console.log(`Adding post: ${this.cleanString(values[5])}`); // Fixed: post_title is at index 5
            this.data.posts.push({
              wp_id: parseInt(values[0]),
              title: this.cleanString(values[5]), // Fixed: post_title is at index 5
              slug: this.cleanString(values[11]), // post_name is at index 11
              content: this.cleanContent(values[4]), // Fixed: post_content is at index 4
              excerpt: this.cleanString(values[6]), // post_excerpt is at index 6
              post_type: postType,
              status: 'published',
              author_wp_id: parseInt(values[1]),
              published_at: this.parseDate(values[2]),
              updated_at: this.parseDate(values[14])
            });
          }
        } else {
          console.log(`Row ${rowIndex + 1}: insufficient columns (${values.length})`);
        }
      });
    });
  }

  extractAttachments(sqlContent) {
    console.log('Looking for wp_posts INSERT statements for attachments...');

    // Split the content into lines and find INSERT INTO wp_posts statements
    const lines = sqlContent.split('\n');
    let currentInsert = '';
    let inPostsInsert = false;
    let insertStatements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.includes('INSERT INTO `wp_posts` VALUES')) {
        inPostsInsert = true;
        currentInsert = line;
        continue;
      }

      if (inPostsInsert) {
        currentInsert += '\n' + line;

        // Check if this line ends the INSERT statement
        if (line.endsWith(';') || (i + 1 < lines.length && lines[i + 1].trim().startsWith('INSERT INTO'))) {
          insertStatements.push(currentInsert);
          currentInsert = '';
          inPostsInsert = false;
        }
      }
    }

    if (!insertStatements.length) {
      console.log('No wp_posts INSERT statements found for attachments');
      return;
    }

    console.log(`Found ${insertStatements.length} wp_posts INSERT statements, checking for attachments...`);

    insertStatements.forEach((insertStatement, index) => {
      // Extract the values part - everything after VALUES
      const valuesIndex = insertStatement.indexOf('VALUES');
      if (valuesIndex === -1) {
        return;
      }

      const valuesString = insertStatement.substring(valuesIndex + 6).replace(/;$/, '').trim();
      const postValues = this.parseInsertValues(valuesString);

      postValues.forEach((values, rowIndex) => {
        if (values.length >= 23) {
          const postType = this.cleanString(values[20]); // post_type is at index 20
          const status = this.cleanString(values[7]);
          const mimeType = this.cleanString(values[21]); // post_mime_type is at index 21

          // Extract attachments (images and other media)
          if (postType === 'attachment' && (status === 'inherit' || status === 'publish')) {
            const title = this.cleanString(values[5]);
            const content = this.cleanString(values[4]);
            const excerpt = this.cleanString(values[6]);

            console.log(`Adding attachment: ${title} (${mimeType})`);

            this.data.attachments.push({
              wp_id: parseInt(values[0]),
              title: title,
              slug: this.cleanString(values[11]), // post_name is at index 11
              content: content, // Often contains alt text or description
              excerpt: excerpt, // Often contains caption
              mime_type: mimeType,
              status: status,
              author_wp_id: parseInt(values[1]),
              parent_wp_id: parseInt(values[10]) || null, // post_parent - which post this is attached to
              created_at: this.parseDate(values[2]),
              updated_at: this.parseDate(values[14])
            });
          }
        }
      });
    });

    console.log(`Extracted ${this.data.attachments.length} attachments`);
  }

  extractPostMeta(sqlContent) {
    const metaInsertMatch = sqlContent.match(/INSERT INTO `wp_postmeta` VALUES\s*(.*?);/s);
    if (!metaInsertMatch) return;

    const metaValues = this.parseInsertValues(metaInsertMatch[1]);
    
    metaValues.forEach(values => {
      if (values.length >= 4) {
        const metaKey = this.cleanString(values[2]);
        
        // Extract useful meta keys including image-related ones
        if (['_wp_attached_file', '_thumbnail_id', '_yoast_wpseo_title', '_yoast_wpseo_metadesc',
             '_wp_attachment_metadata', '_wp_attachment_image_alt'].includes(metaKey)) {
          this.data.postMeta.push({
            post_wp_id: parseInt(values[1]),
            meta_key: metaKey,
            meta_value: this.cleanString(values[3])
          });
        }
      }
    });
  }

  extractTermRelationships(sqlContent) {
    // First, get term taxonomy mapping
    const taxonomyInsertMatch = sqlContent.match(/INSERT INTO `wp_term_taxonomy` VALUES\s*(.*?);/s);
    const termTaxonomyMap = {};

    if (taxonomyInsertMatch) {
      const taxonomyValues = this.parseInsertValues(taxonomyInsertMatch[1]);
      taxonomyValues.forEach(values => {
        if (values.length >= 6) {
          termTaxonomyMap[values[0]] = {
            term_id: parseInt(values[1]),
            taxonomy: this.cleanString(values[2])
          };
        }
      });
    }

    // Now extract relationships
    const relationshipsMatch = sqlContent.match(/INSERT INTO `wp_term_relationships` VALUES\s*(.*?);/s);
    if (!relationshipsMatch) return;

    const relationshipValues = this.parseInsertValues(relationshipsMatch[1]);

    relationshipValues.forEach(values => {
      if (values.length >= 3) {
        const postId = parseInt(values[0]);
        const termTaxonomyId = parseInt(values[1]);

        if (termTaxonomyMap[termTaxonomyId]) {
          const { term_id, taxonomy } = termTaxonomyMap[termTaxonomyId];

          if (taxonomy === 'category') {
            this.data.postCategories.push({
              post_wp_id: postId,
              category_wp_id: term_id
            });
          } else if (taxonomy === 'post_tag') {
            this.data.postTags.push({
              post_wp_id: postId,
              tag_wp_id: term_id
            });
          }
        }
      }
    });
  }

  parseInsertValues(valuesString) {
    const rows = [];
    let i = 0;

    // Clean up the values string
    valuesString = valuesString.trim();

    while (i < valuesString.length) {
      // Find start of row
      const openParen = valuesString.indexOf('(', i);
      if (openParen === -1) break;

      // Find matching closing parenthesis, accounting for nested quotes
      let closeParen = -1;
      let parenCount = 0;
      let inQuotes = false;
      let quoteChar = '';

      for (let j = openParen; j < valuesString.length; j++) {
        const char = valuesString[j];
        const nextChar = valuesString[j + 1];

        if (!inQuotes) {
          if (char === "'" || char === '"') {
            inQuotes = true;
            quoteChar = char;
          } else if (char === '(') {
            parenCount++;
          } else if (char === ')') {
            parenCount--;
            if (parenCount === 0) {
              closeParen = j;
              break;
            }
          }
        } else {
          if (char === '\\' && nextChar) {
            j++; // Skip escaped character
          } else if (char === quoteChar) {
            if (nextChar === quoteChar) {
              j++; // Skip escaped quote
            } else {
              inQuotes = false;
              quoteChar = '';
            }
          }
        }
      }

      if (closeParen === -1) break;

      // Extract row content
      const rowContent = valuesString.substring(openParen + 1, closeParen);
      const values = this.parseRowValues(rowContent);

      if (values.length > 0) {
        rows.push(values);
      }

      i = closeParen + 1;
    }

    return rows;
  }

  parseRowValues(rowContent) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    let quoteChar = '';
    let i = 0;

    while (i < rowContent.length) {
      const char = rowContent[i];
      const nextChar = rowContent[i + 1];

      if (!inQuotes) {
        if (char === "'" || char === '"') {
          inQuotes = true;
          quoteChar = char;
          currentValue = '';
        } else if (char === ',' && !inQuotes) {
          // End of value
          const trimmed = currentValue.trim();
          values.push(trimmed === 'NULL' ? null : trimmed);
          currentValue = '';
        } else if (char.match(/\s/) && currentValue === '') {
          // Skip whitespace at start
        } else {
          currentValue += char;
        }
      } else {
        if (char === '\\' && nextChar) {
          // Handle escaped characters
          if (nextChar === 'n') {
            currentValue += '\n';
          } else if (nextChar === 't') {
            currentValue += '\t';
          } else if (nextChar === 'r') {
            currentValue += '\r';
          } else {
            currentValue += nextChar;
          }
          i++; // Skip next char
        } else if (char === quoteChar) {
          if (nextChar === quoteChar) {
            // Escaped quote
            currentValue += char;
            i++; // Skip next char
          } else {
            // End of quoted string
            inQuotes = false;
            quoteChar = '';
          }
        } else {
          currentValue += char;
        }
      }

      i++;
    }

    // Add last value
    const trimmed = currentValue.trim();
    values.push(trimmed === 'NULL' ? null : trimmed);

    return values;
  }

  cleanString(str) {
    if (!str || str === 'NULL') return '';
    return he.decode(str.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
  }

  cleanContent(content) {
    if (!content || content === 'NULL') return '';
    
    // Decode HTML entities and clean up WordPress block comments
    let cleaned = he.decode(content);
    
    // Remove WordPress block comments but keep the content
    cleaned = cleaned.replace(/<!-- wp:[\s\S]*? -->/g, '');
    cleaned = cleaned.replace(/<!-- \/wp:[\s\S]*? -->/g, '');
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n\s*\n/g, '\n\n').trim();
    
    return cleaned;
  }

  parseDate(dateStr) {
    if (!dateStr || dateStr === 'NULL' || dateStr === '0000-00-00 00:00:00') {
      return new Date().toISOString();
    }
    return new Date(dateStr).toISOString();
  }

  async saveExtractedData() {
    const outputDir = path.join(__dirname, 'extracted-data');
    await fs.ensureDir(outputDir);

    console.log(`About to save data: posts array has ${this.data.posts.length} items`);

    for (const [key, data] of Object.entries(this.data)) {
      console.log(`Saving ${key}: ${data.length} items`);
      await fs.writeJson(path.join(outputDir, `${key}.json`), data, { spaces: 2 });
    }

    console.log(`Extracted data saved to ${outputDir}/`);
  }
}

// Run the extraction
async function main() {
  const sqlFilePath = process.env.WP_SQL_FILE || '../u957990218_GpBKT.sql';
  
  if (!await fs.pathExists(sqlFilePath)) {
    console.error(`SQL file not found: ${sqlFilePath}`);
    process.exit(1);
  }
  
  const extractor = new WordPressDataExtractor(sqlFilePath);
  await extractor.extractData();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = WordPressDataExtractor;
