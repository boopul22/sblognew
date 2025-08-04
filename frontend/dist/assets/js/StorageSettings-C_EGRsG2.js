var h=(n,m,a)=>new Promise((b,o)=>{var c=t=>{try{p(a.next(t))}catch(x){o(x)}},g=t=>{try{p(a.throw(t))}catch(x){o(x)}},p=t=>t.done?b(t.value):Promise.resolve(t.value).then(c,g);p((a=a.apply(n,m)).next())});import{r as l,j as s,V as d}from"./react-vendor-seMyx5IZ.js";import{l as E,m as R,p as _,o as $,G as A}from"./utils-BWmz-sOC.js";import{b as I}from"./components-BFPYROii.js";import"./vendor-Dxve-ft9.js";import"./supabase-vendor-DJ5DSPXj.js";const F=()=>{const[n,m]=l.useState(null),[a,b]=l.useState(null),[o,c]=l.useState("overview"),[g,p]=l.useState(!1),[t,x]=l.useState(null),[f,y]=l.useState(!1),[u,j]=l.useState(null),[v,k]=l.useState(!1);l.useEffect(()=>{N()},[]);const N=()=>{const e=E(),r=R();m(e),b(r)},C=e=>h(null,null,function*(){try{$.switchProvider(e)?(N(),d.success(`Switched to ${e}`)):d.error(`Failed to switch to ${e}. Check configuration.`)}catch(r){d.error(`Switch failed: ${r.message}`)}}),S=()=>h(null,null,function*(){p(!0);try{const e=yield _({includeUploadTest:!1,testImageUrl:null});x(e),e.success?d.success(`All tests passed! (${e.passedTests}/${e.totalTests})`):d.error(`Some tests failed (${e.passedTests}/${e.totalTests})`)}catch(e){d.error(`Test failed: ${e.message}`)}finally{p(!1)}}),T=(e,r)=>h(null,null,function*(){if(confirm(`Are you sure you want to migrate all images from ${e} to ${r}? This cannot be undone.`)){y(!0),j({total:0,migrated:0,errors:0,progress:0});try{const i=yield A(e,r,{batchSize:5,dryRun:!1,onProgress:w=>{j(w)}});i.success?(d.success(`Migration completed! ${i.migratedCount}/${i.totalImages} images migrated`),i.errorCount>0&&d.error(`${i.errorCount} images failed to migrate`)):d.error(`Migration failed: ${i.error}`)}catch(i){d.error(`Migration error: ${i.message}`)}finally{y(!1),j(null)}}});return n?s.jsxs("div",{className:"storage-settings",children:[s.jsxs("div",{className:"settings-header",children:[s.jsx("h1",{children:"Storage Settings"}),s.jsx("p",{children:"Manage your image storage configuration and providers"})]}),s.jsxs("div",{className:"settings-tabs",children:[s.jsx("button",{className:o==="overview"?"active":"",onClick:()=>c("overview"),children:"Overview"}),s.jsx("button",{className:o==="providers"?"active":"",onClick:()=>c("providers"),children:"Providers"}),s.jsx("button",{className:o==="migration"?"active":"",onClick:()=>c("migration"),children:"Migration"}),s.jsx("button",{className:o==="testing"?"active":"",onClick:()=>c("testing"),children:"Testing"})]}),s.jsxs("div",{className:"settings-content",children:[o==="overview"&&s.jsxs("div",{className:"overview-tab",children:[s.jsxs("div",{className:"current-status",children:[s.jsx("h2",{children:"Current Status"}),s.jsxs("div",{className:"status-card",children:[s.jsxs("div",{className:"status-item",children:[s.jsx("label",{children:"Active Provider:"}),s.jsx("span",{className:`provider-badge ${n.current}`,children:n.current||"None"})]}),s.jsxs("div",{className:"status-item",children:[s.jsx("label",{children:"Fallback Provider:"}),s.jsx("span",{className:"provider-badge",children:n.fallback||"None"})]}),s.jsxs("div",{className:"status-item",children:[s.jsx("label",{children:"Configuration Status:"}),s.jsx("span",{className:`status-badge ${a.valid?"valid":"invalid"}`,children:a.valid?"✅ Valid":"❌ Issues Found"})]})]})]}),!a.valid&&s.jsxs("div",{className:"validation-issues",children:[s.jsx("h3",{children:"Configuration Issues"}),a.errors.length>0&&s.jsxs("div",{className:"errors",children:[s.jsx("h4",{children:"Errors:"}),s.jsx("ul",{children:a.errors.map((e,r)=>s.jsx("li",{className:"error",children:e},r))})]}),a.warnings.length>0&&s.jsxs("div",{className:"warnings",children:[s.jsx("h4",{children:"Warnings:"}),s.jsx("ul",{children:a.warnings.map((e,r)=>s.jsx("li",{className:"warning",children:e},r))})]})]}),s.jsxs("div",{className:"quick-actions",children:[s.jsx("h3",{children:"Quick Actions"}),s.jsxs("div",{className:"action-buttons",children:[s.jsx("button",{onClick:N,className:"btn btn-secondary",children:"🔄 Refresh Status"}),s.jsx("button",{onClick:S,className:"btn btn-primary",disabled:g,children:g?"🧪 Running Tests...":"🧪 Run Tests"}),s.jsxs("button",{onClick:()=>k(!v),className:"btn btn-secondary",children:["🔧 ",v?"Hide":"Show"," Debugger"]})]})]})]}),o==="providers"&&s.jsxs("div",{className:"providers-tab",children:[s.jsx("h2",{children:"Storage Providers"}),s.jsx("p",{children:"Switch between different storage providers for your images."}),s.jsx("div",{className:"providers-grid",children:Object.entries(n.providers).map(([e,r])=>s.jsxs("div",{className:`provider-card ${r.configured?"configured":"not-configured"} ${e===n.current?"active":""}`,children:[s.jsxs("div",{className:"provider-header",children:[s.jsx("h3",{children:e}),s.jsx("span",{className:`status-indicator ${r.configured?"configured":"not-configured"}`,children:r.configured?"✅ Configured":"❌ Not Configured"})]}),s.jsxs("div",{className:"provider-info",children:[e==="supabase"&&s.jsxs("div",{children:[s.jsx("p",{children:s.jsx("strong",{children:"Features:"})}),s.jsxs("ul",{children:[s.jsx("li",{children:"Built-in image optimization"}),s.jsx("li",{children:"Automatic WebP conversion"}),s.jsx("li",{children:"CDN delivery"}),s.jsx("li",{children:"Direct client uploads"})]}),!r.configured&&s.jsxs("div",{className:"config-help",children:[s.jsx("p",{children:s.jsx("strong",{children:"Required:"})}),s.jsxs("ul",{children:[s.jsx("li",{children:"VITE_SUPABASE_URL"}),s.jsx("li",{children:"VITE_SUPABASE_ANON_KEY"})]})]})]}),e==="cloudflare-r2"&&s.jsxs("div",{children:[s.jsx("p",{children:s.jsx("strong",{children:"Features:"})}),s.jsxs("ul",{children:[s.jsx("li",{children:"S3-compatible API"}),s.jsx("li",{children:"Global CDN"}),s.jsx("li",{children:"Cost-effective storage"}),s.jsx("li",{children:"High performance"})]}),!r.configured&&s.jsxs("div",{className:"config-help",children:[s.jsx("p",{children:s.jsx("strong",{children:"Required:"})}),s.jsxs("ul",{children:[s.jsx("li",{children:"VITE_CLOUDFLARE_ACCOUNT_ID"}),s.jsx("li",{children:"VITE_CLOUDFLARE_R2_ACCESS_KEY_ID"}),s.jsx("li",{children:"VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY"}),s.jsx("li",{children:"VITE_CLOUDFLARE_R2_BUCKET_NAME"}),s.jsx("li",{children:"VITE_CLOUDFLARE_R2_PUBLIC_URL"}),s.jsx("li",{children:"VITE_CLOUDFLARE_R2_ENDPOINT"})]})]})]})]}),s.jsx("div",{className:"provider-actions",children:e===n.current?s.jsx("span",{className:"current-badge",children:"Current Provider"}):r.configured?s.jsxs("button",{onClick:()=>C(e),className:"btn btn-primary",children:["Switch to ",e]}):s.jsx("span",{className:"not-configured-text",children:"Configure in environment variables"})})]},e))})]}),o==="migration"&&s.jsxs("div",{className:"migration-tab",children:[s.jsx("h2",{children:"Storage Migration"}),s.jsx("p",{children:"Migrate your images between different storage providers."}),f&&u&&s.jsxs("div",{className:"migration-progress",children:[s.jsx("h3",{children:"Migration in Progress"}),s.jsx("div",{className:"progress-bar",children:s.jsx("div",{className:"progress-fill",style:{width:`${u.progress}%`}})}),s.jsxs("div",{className:"progress-stats",children:[s.jsxs("span",{children:["Progress: ",u.progress,"%"]}),s.jsxs("span",{children:["Migrated: ",u.migrated,"/",u.total]}),s.jsxs("span",{children:["Errors: ",u.errors]})]})]}),s.jsxs("div",{className:"migration-options",children:[s.jsx("h3",{children:"Available Migrations"}),Object.entries(n.providers).map(([e,r])=>r.configured&&Object.entries(n.providers).map(([i,w])=>e!==i&&w.configured&&s.jsxs("div",{className:"migration-option",children:[s.jsxs("div",{className:"migration-info",children:[s.jsxs("h4",{children:["Migrate from ",e," to ",i]}),s.jsxs("p",{children:["This will copy all images from ",e," to ",i,"."]})]}),s.jsx("button",{onClick:()=>T(e,i),className:"btn btn-warning",disabled:f,children:f?"Migration in Progress...":`Migrate to ${i}`})]},`${e}-${i}`)))]}),s.jsxs("div",{className:"migration-warning",children:[s.jsx("h3",{children:"⚠️ Important Notes"}),s.jsxs("ul",{children:[s.jsx("li",{children:"Migration copies images to the new provider but doesn't delete from the old one"}),s.jsx("li",{children:"Large migrations may take time - don't close this page during migration"}),s.jsx("li",{children:"Test with a few images first before migrating everything"}),s.jsx("li",{children:"Make sure both providers are properly configured before starting"})]})]})]}),o==="testing"&&s.jsxs("div",{className:"testing-tab",children:[s.jsx("h2",{children:"Storage Testing"}),s.jsx("p",{children:"Validate your storage configuration and test functionality."}),s.jsx("div",{className:"test-actions",children:s.jsx("button",{onClick:S,className:"btn btn-primary",disabled:g,children:g?"🧪 Running Tests...":"🧪 Run Validation Tests"})}),t&&s.jsxs("div",{className:"test-results",children:[s.jsxs("div",{className:`test-summary ${t.success?"success":"failure"}`,children:[s.jsx("h3",{children:"Test Results"}),s.jsxs("p",{children:[t.passedTests,"/",t.totalTests," tests passed (",t.passRate,"%)"]})]}),s.jsx("div",{className:"test-details",children:t.results.map((e,r)=>s.jsxs("div",{className:`test-result ${e.passed?"passed":"failed"}`,children:[s.jsxs("div",{className:"test-header",children:[s.jsx("span",{className:"test-status",children:e.passed?"✅":"❌"}),s.jsx("span",{className:"test-name",children:e.name})]}),s.jsx("div",{className:"test-message",children:e.message}),e.error&&s.jsxs("div",{className:"test-error",children:["Error: ",e.error]})]},r))})]})]})]}),s.jsx(I,{isVisible:v}),s.jsx("style",{jsx:"true",children:`
        .storage-settings {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .settings-header {
          margin-bottom: 30px;
        }

        .settings-header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .settings-header p {
          margin: 0;
          color: #666;
        }

        .settings-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 30px;
          border-bottom: 1px solid #ddd;
        }

        .settings-tabs button {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-weight: 500;
        }

        .settings-tabs button.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }

        .settings-tabs button:hover {
          background: #f8f9fa;
        }

        .current-status {
          margin-bottom: 30px;
        }

        .status-card {
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-item label {
          font-weight: 500;
          color: #333;
        }

        .provider-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .provider-badge.supabase {
          background: #3ecf8e;
          color: white;
        }

        .provider-badge.cloudflare-r2 {
          background: #f38020;
          color: white;
        }

        .status-badge.valid {
          color: #28a745;
        }

        .status-badge.invalid {
          color: #dc3545;
        }

        .validation-issues {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .validation-issues .errors ul {
          color: #dc3545;
        }

        .validation-issues .warnings ul {
          color: #856404;
        }

        .quick-actions h3 {
          margin-bottom: 15px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .providers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }

        .provider-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          background: white;
        }

        .provider-card.configured {
          border-color: #28a745;
        }

        .provider-card.not-configured {
          border-color: #dc3545;
          opacity: 0.7;
        }

        .provider-card.active {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .provider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .provider-header h3 {
          margin: 0;
          text-transform: capitalize;
        }

        .status-indicator.configured {
          color: #28a745;
        }

        .status-indicator.not-configured {
          color: #dc3545;
        }

        .provider-info ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .config-help {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin-top: 10px;
        }

        .config-help ul {
          font-family: monospace;
          font-size: 12px;
        }

        .provider-actions {
          margin-top: 15px;
        }

        .current-badge {
          background: #007bff;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
        }

        .not-configured-text {
          color: #666;
          font-style: italic;
        }

        .migration-progress {
          background: #e3f2fd;
          border: 1px solid #2196f3;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .progress-bar {
          width: 100%;
          height: 20px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 10px 0;
        }

        .progress-fill {
          height: 100%;
          background: #2196f3;
          transition: width 0.3s ease;
        }

        .progress-stats {
          display: flex;
          gap: 20px;
          font-size: 14px;
        }

        .migration-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .migration-warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }

        .test-summary.success {
          color: #28a745;
        }

        .test-summary.failure {
          color: #dc3545;
        }

        .test-result {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 15px;
          margin-bottom: 10px;
        }

        .test-result.passed {
          background: #f8fff8;
          border-color: #28a745;
        }

        .test-result.failed {
          background: #fff8f8;
          border-color: #dc3545;
        }

        .test-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }

        .test-name {
          font-weight: bold;
        }

        .test-error {
          color: #dc3545;
          font-size: 14px;
          margin-top: 5px;
        }

        .btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
          border-color: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
          border-color: #545b62;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
          border-color: #e0a800;
        }

        .loading {
          text-align: center;
          padding: 50px;
          color: #666;
        }

        @media (max-width: 768px) {
          .storage-settings {
            padding: 10px;
          }

          .providers-grid {
            grid-template-columns: 1fr;
          }

          .settings-tabs {
            flex-wrap: wrap;
          }

          .action-buttons {
            flex-direction: column;
          }

          .migration-option {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .status-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `})]}):s.jsx("div",{className:"loading",children:"Loading storage settings..."})};export{F as default};
