var p=(t,n,e)=>new Promise((m,o)=>{var d=s=>{try{a(e.next(s))}catch(l){o(l)}},i=s=>{try{a(e.throw(s))}catch(l){o(l)}},a=s=>s.done?m(s.value):Promise.resolve(s.value).then(d,i);a((e=e.apply(t,n)).next())});import{b as c,r as f,j as r,V as u}from"./react-vendor-QWuLYCV5.js";import{c as b}from"./components-DUxgLBbL.js";import"./vendor-CJchTyIO.js";import"./utils-CyCRfmWG.js";import"./supabase-vendor-DEo8APS7.js";const D=()=>{const t=c(),[n,e]=f.useState(!1),m=(d,i=!1)=>p(null,null,function*(){e(!0);try{const a=i?"saved as draft":"published";u.success(`Post ${a} successfully!`),i||t("/admin/posts")}catch(a){u.error("Failed to save post. Please try again.")}finally{e(!1)}}),o=()=>{t("/admin/posts")};return r.jsxDEV("div",{className:"create-post-page",children:[r.jsxDEV("div",{className:"page-header",children:[r.jsxDEV("h1",{children:"Create New Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/CreatePost.jsx",lineNumber:35,columnNumber:9},void 0),r.jsxDEV("p",{children:"Write and publish a new blog post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/CreatePost.jsx",lineNumber:36,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/CreatePost.jsx",lineNumber:34,columnNumber:7},void 0),r.jsxDEV(b,{onSave:m,onCancel:o,loading:n,isEditing:!1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/CreatePost.jsx",lineNumber:39,columnNumber:7},void 0),r.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/CreatePost.jsx",lineNumber:46,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/CreatePost.jsx",lineNumber:33,columnNumber:5},void 0)};export{D as default};
