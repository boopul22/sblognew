var u=(t,n,e)=>new Promise((m,o)=>{var d=s=>{try{a(e.next(s))}catch(l){o(l)}},i=s=>{try{a(e.throw(s))}catch(l){o(l)}},a=s=>s.done?m(s.value):Promise.resolve(s.value).then(d,i);a((e=e.apply(t,n)).next())});import{c,r as f,j as r,V as p}from"./react-vendor-DV45Ikwi.js";import{d as b}from"./components-BPkeUS7W.js";import"./vendor-B0T_4ch3.js";import"./utils-BE2o5J05.js";import"./supabase-vendor-CPNJAKHt.js";const D=()=>{const t=c(),[n,e]=f.useState(!1),m=(d,i=!1)=>u(null,null,function*(){e(!0);try{const a=i?"saved as draft":"published";p.success(`Post ${a} successfully!`),i||t("/admin/posts")}catch(a){p.error("Failed to save post. Please try again.")}finally{e(!1)}}),o=()=>{t("/admin/posts")};return r.jsxDEV("div",{className:"create-post-page",children:[r.jsxDEV("div",{className:"page-header",children:[r.jsxDEV("h1",{children:"Create New Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/CreatePost.jsx",lineNumber:35,columnNumber:9},void 0),r.jsxDEV("p",{children:"Write and publish a new blog post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/CreatePost.jsx",lineNumber:36,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/CreatePost.jsx",lineNumber:34,columnNumber:7},void 0),r.jsxDEV(b,{onSave:m,onCancel:o,loading:n,isEditing:!1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/CreatePost.jsx",lineNumber:39,columnNumber:7},void 0),r.jsxDEV("style",{jsx:"true",children:`
        .create-post-page {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .page-header h1 {
          margin: 0 0 0.5rem 0;
          color: #212529;
          font-size: 2rem;
          font-weight: 600;
        }

        .page-header p {
          margin: 0;
          color: #6c757d;
          font-size: 1rem;
        }
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/CreatePost.jsx",lineNumber:46,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/CreatePost.jsx",lineNumber:33,columnNumber:5},void 0)};export{D as default};
