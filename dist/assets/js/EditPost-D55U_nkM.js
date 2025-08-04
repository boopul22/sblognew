var f=(m,t,i)=>new Promise((c,l)=>{var u=s=>{try{r(i.next(s))}catch(a){l(a)}},p=s=>{try{r(i.throw(s))}catch(a){l(a)}},r=s=>s.done?c(s.value):Promise.resolve(s.value).then(u,p);r((i=i.apply(m,t)).next())});import{c as E,b as h,r as d,V as b,j as e}from"./react-vendor-QWuLYCV5.js";import{c as k}from"./components-DUxgLBbL.js";import{s as j}from"./utils-CyCRfmWG.js";import"./vendor-CJchTyIO.js";import"./supabase-vendor-DEo8APS7.js";const w=()=>{const{id:m}=E(),t=h(),[i,c]=d.useState(null),[l,u]=d.useState(!0),[p,r]=d.useState(!1),[s,a]=d.useState(null);d.useEffect(()=>{N()},[m]);const N=()=>f(null,null,function*(){try{u(!0);const{data:o,error:n}=yield j.from("posts").select("*").eq("id",m).single();if(n)throw n;if(!o)throw new Error("Post not found");c(o)}catch(o){a(o.message),b.error("Failed to load post")}finally{u(!1)}}),v=(o,n=!1)=>f(null,null,function*(){r(!0);try{const g=n?"saved as draft":"updated";b.success(`Post ${g} successfully!`),n||t("/admin/posts")}catch(g){b.error("Failed to save post. Please try again.")}finally{r(!1)}}),x=()=>{t("/admin/posts")};return l?e.jsxDEV("div",{className:"edit-post-page",children:e.jsxDEV("div",{className:"loading-state",children:[e.jsxDEV("div",{className:"spinner"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:72,columnNumber:11},void 0),e.jsxDEV("p",{children:"Loading post..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:73,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:71,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:70,columnNumber:7},void 0):s||!i?e.jsxDEV("div",{className:"edit-post-page",children:e.jsxDEV("div",{className:"error-state",children:[e.jsxDEV("h2",{children:"Error"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:83,columnNumber:11},void 0),e.jsxDEV("p",{children:s||"Post not found"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:84,columnNumber:11},void 0),e.jsxDEV("button",{onClick:()=>t("/admin/posts"),className:"btn btn-primary",children:"Back to Posts"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:85,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:82,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:81,columnNumber:7},void 0):e.jsxDEV("div",{className:"edit-post-page",children:[e.jsxDEV("div",{className:"page-header",children:[e.jsxDEV("h1",{children:"Edit Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:96,columnNumber:9},void 0),e.jsxDEV("p",{children:['Make changes to "',i.title,'"']},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:97,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:95,columnNumber:7},void 0),e.jsxDEV(k,{initialData:i,onSave:v,onCancel:x,loading:p,isEditing:!0},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:100,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
        .edit-post-page {
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

        .loading-state, .error-state {
          text-align: center;
          padding: 3rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state h2 {
          color: #dc3545;
          margin-bottom: 1rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
        }

        .btn-primary:hover {
          background: #1565c0;
        }
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:108,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/EditPost.jsx",lineNumber:94,columnNumber:5},void 0)};export{w as default};
