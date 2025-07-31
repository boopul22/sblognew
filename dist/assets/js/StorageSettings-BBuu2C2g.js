var b=(t,f,n)=>new Promise((N,o)=>{var d=a=>{try{c(n.next(a))}catch(g){o(g)}},m=a=>{try{c(n.throw(a))}catch(g){o(g)}},c=a=>a.done?N(a.value):Promise.resolve(a.value).then(d,m);c((n=n.apply(t,f)).next())});import{r as u,j as e,V as l}from"./react-vendor-QWuLYCV5.js";import{l as V,m as U,p as w,o as C,F as T}from"./utils-CoXWpX9N.js";import{b as R}from"./components-Bw11mkoO.js";import"./vendor-CJchTyIO.js";import"./supabase-vendor-DEo8APS7.js";const F=()=>{const[t,f]=u.useState(null),[n,N]=u.useState(null),[o,d]=u.useState("overview"),[m,c]=u.useState(!1),[a,g]=u.useState(null),[v,j]=u.useState(!1),[p,x]=u.useState(null),[S,y]=u.useState(!1);u.useEffect(()=>{k()},[]);const k=()=>{const s=V(),i=U();f(s),N(i)},E=s=>b(null,null,function*(){try{C.switchProvider(s)?(k(),l.success(`Switched to ${s}`)):l.error(`Failed to switch to ${s}. Check configuration.`)}catch(i){l.error(`Switch failed: ${i.message}`)}}),h=()=>b(null,null,function*(){c(!0);try{const s=yield w({includeUploadTest:!1,testImageUrl:null});g(s),s.success?l.success(`All tests passed! (${s.passedTests}/${s.totalTests})`):l.error(`Some tests failed (${s.passedTests}/${s.totalTests})`)}catch(s){l.error(`Test failed: ${s.message}`)}finally{c(!1)}}),_=(s,i)=>b(null,null,function*(){if(confirm(`Are you sure you want to migrate all images from ${s} to ${i}? This cannot be undone.`)){j(!0),x({total:0,migrated:0,errors:0,progress:0});try{const r=yield T(s,i,{batchSize:5,dryRun:!1,onProgress:D=>{x(D)}});r.success?(l.success(`Migration completed! ${r.migratedCount}/${r.totalImages} images migrated`),r.errorCount>0&&l.error(`${r.errorCount} images failed to migrate`)):l.error(`Migration failed: ${r.error}`)}catch(r){l.error(`Migration error: ${r.message}`)}finally{j(!1),x(null)}}});return t?e.jsxDEV("div",{className:"storage-settings",children:[e.jsxDEV("div",{className:"settings-header",children:[e.jsxDEV("h1",{children:"Storage Settings"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:111,columnNumber:9},void 0),e.jsxDEV("p",{children:"Manage your image storage configuration and providers"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:112,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:110,columnNumber:7},void 0),e.jsxDEV("div",{className:"settings-tabs",children:[e.jsxDEV("button",{className:o==="overview"?"active":"",onClick:()=>d("overview"),children:"Overview"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:116,columnNumber:9},void 0),e.jsxDEV("button",{className:o==="providers"?"active":"",onClick:()=>d("providers"),children:"Providers"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:122,columnNumber:9},void 0),e.jsxDEV("button",{className:o==="migration"?"active":"",onClick:()=>d("migration"),children:"Migration"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:128,columnNumber:9},void 0),e.jsxDEV("button",{className:o==="testing"?"active":"",onClick:()=>d("testing"),children:"Testing"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:134,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:115,columnNumber:7},void 0),e.jsxDEV("div",{className:"settings-content",children:[o==="overview"&&e.jsxDEV("div",{className:"overview-tab",children:[e.jsxDEV("div",{className:"current-status",children:[e.jsxDEV("h2",{children:"Current Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:146,columnNumber:15},void 0),e.jsxDEV("div",{className:"status-card",children:[e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("label",{children:"Active Provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:149,columnNumber:19},void 0),e.jsxDEV("span",{className:`provider-badge ${t.current}`,children:t.current||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:150,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:148,columnNumber:17},void 0),e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("label",{children:"Fallback Provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:155,columnNumber:19},void 0),e.jsxDEV("span",{className:"provider-badge",children:t.fallback||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:156,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:154,columnNumber:17},void 0),e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("label",{children:"Configuration Status:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:161,columnNumber:19},void 0),e.jsxDEV("span",{className:`status-badge ${n.valid?"valid":"invalid"}`,children:n.valid?"✅ Valid":"❌ Issues Found"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:162,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:160,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:147,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:145,columnNumber:13},void 0),!n.valid&&e.jsxDEV("div",{className:"validation-issues",children:[e.jsxDEV("h3",{children:"Configuration Issues"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:171,columnNumber:17},void 0),n.errors.length>0&&e.jsxDEV("div",{className:"errors",children:[e.jsxDEV("h4",{children:"Errors:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:174,columnNumber:21},void 0),e.jsxDEV("ul",{children:n.errors.map((s,i)=>e.jsxDEV("li",{className:"error",children:s},i,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:177,columnNumber:25},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:175,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:173,columnNumber:19},void 0),n.warnings.length>0&&e.jsxDEV("div",{className:"warnings",children:[e.jsxDEV("h4",{children:"Warnings:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:184,columnNumber:21},void 0),e.jsxDEV("ul",{children:n.warnings.map((s,i)=>e.jsxDEV("li",{className:"warning",children:s},i,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:187,columnNumber:25},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:185,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:183,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:170,columnNumber:15},void 0),e.jsxDEV("div",{className:"quick-actions",children:[e.jsxDEV("h3",{children:"Quick Actions"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:196,columnNumber:15},void 0),e.jsxDEV("div",{className:"action-buttons",children:[e.jsxDEV("button",{onClick:k,className:"btn btn-secondary",children:"🔄 Refresh Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:198,columnNumber:17},void 0),e.jsxDEV("button",{onClick:h,className:"btn btn-primary",disabled:m,children:m?"🧪 Running Tests...":"🧪 Run Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:201,columnNumber:17},void 0),e.jsxDEV("button",{onClick:()=>y(!S),className:"btn btn-secondary",children:["🔧 ",S?"Hide":"Show"," Debugger"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:208,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:197,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:195,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:144,columnNumber:11},void 0),o==="providers"&&e.jsxDEV("div",{className:"providers-tab",children:[e.jsxDEV("h2",{children:"Storage Providers"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:221,columnNumber:13},void 0),e.jsxDEV("p",{children:"Switch between different storage providers for your images."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:222,columnNumber:13},void 0),e.jsxDEV("div",{className:"providers-grid",children:Object.entries(t.providers).map(([s,i])=>e.jsxDEV("div",{className:`provider-card ${i.configured?"configured":"not-configured"} ${s===t.current?"active":""}`,children:[e.jsxDEV("div",{className:"provider-header",children:[e.jsxDEV("h3",{children:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:228,columnNumber:21},void 0),e.jsxDEV("span",{className:`status-indicator ${i.configured?"configured":"not-configured"}`,children:i.configured?"✅ Configured":"❌ Not Configured"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:229,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:227,columnNumber:19},void 0),e.jsxDEV("div",{className:"provider-info",children:[s==="supabase"&&e.jsxDEV("div",{children:[e.jsxDEV("p",{children:e.jsxDEV("strong",{children:"Features:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:237,columnNumber:28},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:237,columnNumber:25},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"Built-in image optimization"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:239,columnNumber:27},void 0),e.jsxDEV("li",{children:"Automatic WebP conversion"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:240,columnNumber:27},void 0),e.jsxDEV("li",{children:"CDN delivery"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:241,columnNumber:27},void 0),e.jsxDEV("li",{children:"Direct client uploads"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:242,columnNumber:27},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:238,columnNumber:25},void 0),!i.configured&&e.jsxDEV("div",{className:"config-help",children:[e.jsxDEV("p",{children:e.jsxDEV("strong",{children:"Required:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:246,columnNumber:32},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:246,columnNumber:29},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"VITE_SUPABASE_URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:248,columnNumber:31},void 0),e.jsxDEV("li",{children:"VITE_SUPABASE_ANON_KEY"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:249,columnNumber:31},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:247,columnNumber:29},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:245,columnNumber:27},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:236,columnNumber:23},void 0),s==="cloudflare-r2"&&e.jsxDEV("div",{children:[e.jsxDEV("p",{children:e.jsxDEV("strong",{children:"Features:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:258,columnNumber:28},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:258,columnNumber:25},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"S3-compatible API"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:260,columnNumber:27},void 0),e.jsxDEV("li",{children:"Global CDN"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:261,columnNumber:27},void 0),e.jsxDEV("li",{children:"Cost-effective storage"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:262,columnNumber:27},void 0),e.jsxDEV("li",{children:"High performance"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:263,columnNumber:27},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:259,columnNumber:25},void 0),!i.configured&&e.jsxDEV("div",{className:"config-help",children:[e.jsxDEV("p",{children:e.jsxDEV("strong",{children:"Required:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:267,columnNumber:32},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:267,columnNumber:29},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"VITE_CLOUDFLARE_ACCOUNT_ID"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:269,columnNumber:31},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_ACCESS_KEY_ID"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:270,columnNumber:31},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:271,columnNumber:31},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_BUCKET_NAME"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:272,columnNumber:31},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_PUBLIC_URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:273,columnNumber:31},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_ENDPOINT"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:274,columnNumber:31},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:268,columnNumber:29},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:266,columnNumber:27},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:257,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:234,columnNumber:19},void 0),e.jsxDEV("div",{className:"provider-actions",children:s===t.current?e.jsxDEV("span",{className:"current-badge",children:"Current Provider"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:284,columnNumber:23},void 0):i.configured?e.jsxDEV("button",{onClick:()=>E(s),className:"btn btn-primary",children:["Switch to ",s]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:286,columnNumber:23},void 0):e.jsxDEV("span",{className:"not-configured-text",children:"Configure in environment variables"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:293,columnNumber:23},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:282,columnNumber:19},void 0)]},s,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:226,columnNumber:17},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:224,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:220,columnNumber:11},void 0),o==="migration"&&e.jsxDEV("div",{className:"migration-tab",children:[e.jsxDEV("h2",{children:"Storage Migration"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:304,columnNumber:13},void 0),e.jsxDEV("p",{children:"Migrate your images between different storage providers."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:305,columnNumber:13},void 0),v&&p&&e.jsxDEV("div",{className:"migration-progress",children:[e.jsxDEV("h3",{children:"Migration in Progress"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:309,columnNumber:17},void 0),e.jsxDEV("div",{className:"progress-bar",children:e.jsxDEV("div",{className:"progress-fill",style:{width:`${p.progress}%`}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:311,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:310,columnNumber:17},void 0),e.jsxDEV("div",{className:"progress-stats",children:[e.jsxDEV("span",{children:["Progress: ",p.progress,"%"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:317,columnNumber:19},void 0),e.jsxDEV("span",{children:["Migrated: ",p.migrated,"/",p.total]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:318,columnNumber:19},void 0),e.jsxDEV("span",{children:["Errors: ",p.errors]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:319,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:316,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:308,columnNumber:15},void 0),e.jsxDEV("div",{className:"migration-options",children:[e.jsxDEV("h3",{children:"Available Migrations"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:325,columnNumber:15},void 0),Object.entries(t.providers).map(([s,i])=>i.configured&&Object.entries(t.providers).map(([r,D])=>s!==r&&D.configured&&e.jsxDEV("div",{className:"migration-option",children:[e.jsxDEV("div",{className:"migration-info",children:[e.jsxDEV("h4",{children:["Migrate from ",s," to ",r]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:331,columnNumber:25},void 0),e.jsxDEV("p",{children:["This will copy all images from ",s," to ",r,"."]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:332,columnNumber:25},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:330,columnNumber:23},void 0),e.jsxDEV("button",{onClick:()=>_(s,r),className:"btn btn-warning",disabled:v,children:v?"Migration in Progress...":`Migrate to ${r}`},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:334,columnNumber:23},void 0)]},`${s}-${r}`,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:329,columnNumber:21},void 0)))]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:324,columnNumber:13},void 0),e.jsxDEV("div",{className:"migration-warning",children:[e.jsxDEV("h3",{children:"⚠️ Important Notes"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:348,columnNumber:15},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"Migration copies images to the new provider but doesn't delete from the old one"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:350,columnNumber:17},void 0),e.jsxDEV("li",{children:"Large migrations may take time - don't close this page during migration"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:351,columnNumber:17},void 0),e.jsxDEV("li",{children:"Test with a few images first before migrating everything"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:352,columnNumber:17},void 0),e.jsxDEV("li",{children:"Make sure both providers are properly configured before starting"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:353,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:349,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:347,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:303,columnNumber:11},void 0),o==="testing"&&e.jsxDEV("div",{className:"testing-tab",children:[e.jsxDEV("h2",{children:"Storage Testing"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:361,columnNumber:13},void 0),e.jsxDEV("p",{children:"Validate your storage configuration and test functionality."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:362,columnNumber:13},void 0),e.jsxDEV("div",{className:"test-actions",children:e.jsxDEV("button",{onClick:h,className:"btn btn-primary",disabled:m,children:m?"🧪 Running Tests...":"🧪 Run Validation Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:365,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:364,columnNumber:13},void 0),a&&e.jsxDEV("div",{className:"test-results",children:[e.jsxDEV("div",{className:`test-summary ${a.success?"success":"failure"}`,children:[e.jsxDEV("h3",{children:"Test Results"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:377,columnNumber:19},void 0),e.jsxDEV("p",{children:[a.passedTests,"/",a.totalTests," tests passed (",a.passRate,"%)"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:378,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:376,columnNumber:17},void 0),e.jsxDEV("div",{className:"test-details",children:a.results.map((s,i)=>e.jsxDEV("div",{className:`test-result ${s.passed?"passed":"failed"}`,children:[e.jsxDEV("div",{className:"test-header",children:[e.jsxDEV("span",{className:"test-status",children:s.passed?"✅":"❌"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:385,columnNumber:25},void 0),e.jsxDEV("span",{className:"test-name",children:s.name},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:388,columnNumber:25},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:384,columnNumber:23},void 0),e.jsxDEV("div",{className:"test-message",children:s.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:390,columnNumber:23},void 0),s.error&&e.jsxDEV("div",{className:"test-error",children:["Error: ",s.error]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:392,columnNumber:25},void 0)]},i,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:383,columnNumber:21},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:381,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:375,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:360,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:142,columnNumber:7},void 0),e.jsxDEV(R,{isVisible:S},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:403,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:405,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:109,columnNumber:5},void 0):e.jsxDEV("div",{className:"loading",children:"Loading storage settings..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/StorageSettings.jsx",lineNumber:105,columnNumber:12},void 0)};export{F as default};
