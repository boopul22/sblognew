# Supabase Posts Data Extraction Scripts

This directory contains scripts to extract and analyze data from your Supabase database.

## Scripts Overview

### 1. `extract_posts_data.js`
**Purpose**: Extracts posts data from Supabase and generates a CSV file with detailed information.

**Output**: Creates a CSV file named `supabase_posts_analysis_[date].csv` with the following columns:
- Post ID (unique identifier)
- Post Title
- Number of images used in that post
- Main keyword/primary keyword for the post
- Status (published/private)
- Created Date
- Has Featured Image (Yes/No)
- Summary row with totals

**Usage**:
```bash
node scripts/extract_posts_data.js
```

### 2. `analyze_posts_data.js`
**Purpose**: Provides detailed analysis of the extracted CSV data with insights and recommendations.

**Features**:
- Post status distribution
- Image usage analysis
- Top posts by image count
- Keyword frequency analysis
- Monthly posting activity
- Content quality insights
- Actionable recommendations

**Usage**:
```bash
node scripts/analyze_posts_data.js
```

## Requirements

- Node.js installed
- Supabase environment variables configured in `.env.local`:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`

## Data Extraction Logic

### Image Counting
The script counts images in post content by:
1. Counting `<img>` tags in HTML content
2. Counting WordPress image blocks (`wp-block-image`)
3. Counting images within `<figure>` tags
4. Returns the maximum count to avoid double counting

### Keyword Extraction
Primary keywords are extracted using this priority:
1. **Meta Title** (first 3 words) - highest priority
2. **First Tag** from post_tags relationship
3. **Title Analysis** (meaningful words, excluding common words)
4. Fallback: "No keyword found"

### Error Handling
- Handles missing environment variables
- Graceful handling of missing tags or metadata
- Continues processing even if some data is unavailable
- Provides warnings for non-critical errors

## Sample Output

### CSV File Structure
```csv
Post ID,Post Title,Number of Images,Primary Keyword,Status,Created Date,Has Featured Image
"abc-123","Love Shayari in Hindi",25,"love shayari","published","2025-05-20T10:30:00Z","Yes"
...
"SUMMARY","Total Posts: 151","Total Images: 3104","Average Images per Post: 20.56","","",""
```

### Analysis Output
```
📊 EXTRACTION SUMMARY
==================================================
✅ Total posts processed: 151
🖼️ Total images found: 3104
📊 Average images per post: 20.56
📁 CSV file saved: supabase_posts_analysis_2025-08-11.csv

🔝 TOP 10 KEYWORDS:
1. love shayari (2 posts)
2. attitude status (2 posts)
...

🎯 RECOMMENDATIONS:
⚠️ 12 posts have no images - consider adding visual content
📝 You have more private posts (143) than published (8)
```

## Database Schema Used

The scripts query these Supabase tables:
- `posts` - Main posts data
- `post_tags` - Post-tag relationships
- `tags` - Tag information

## Troubleshooting

### Common Issues:
1. **Missing environment variables**: Ensure `.env.local` has correct Supabase credentials
2. **Permission errors**: Make sure the service key has read access to all tables
3. **Empty results**: Check if posts exist in the database

### Debug Mode:
Add console.log statements in the scripts to debug specific issues.

## Future Enhancements

Potential improvements:
- Export to multiple formats (JSON, Excel)
- Filter by date range or status
- Include author information
- Add category analysis
- Generate visual charts
- Automated scheduling

## Files Generated

- `supabase_posts_analysis_[date].csv` - Main data export
- Console output with summary statistics and insights

---

**Last Updated**: August 11, 2025
**Version**: 1.0
