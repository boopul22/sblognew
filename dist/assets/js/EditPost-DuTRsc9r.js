var f=(u,i,r)=>new Promise((p,m)=>{var l=s=>{try{t(r.next(s))}catch(a){m(a)}},c=s=>{try{t(r.throw(s))}catch(a){m(a)}},t=s=>s.done?p(s.value):Promise.resolve(s.value).then(l,c);t((r=r.apply(u,i)).next())});import{d as E,c as h,r as d,V as b,j as e}from"./react-vendor-DV45Ikwi.js";import{d as k}from"./components-BPkeUS7W.js";import{s as j}from"./utils-BE2o5J05.js";import"./vendor-B0T_4ch3.js";import"./supabase-vendor-CPNJAKHt.js";const w=()=>{const{id:u}=E(),i=h(),[r,p]=d.useState(null),[m,l]=d.useState(!0),[c,t]=d.useState(!1),[s,a]=d.useState(null);d.useEffect(()=>{N()},[u]);const N=()=>f(null,null,function*(){try{l(!0);const{data:o,error:n}=yield j.from("posts").select("*").eq("id",u).single();if(n)throw n;if(!o)throw new Error("Post not found");p(o)}catch(o){a(o.message),b.error("Failed to load post")}finally{l(!1)}}),v=(o,n=!1)=>f(null,null,function*(){t(!0);try{const g=n?"saved as draft":"updated";b.success(`Post ${g} successfully!`),n||i("/admin/posts")}catch(g){b.error("Failed to save post. Please try again.")}finally{t(!1)}}),x=()=>{i("/admin/posts")};return m?e.jsxDEV("div",{className:"edit-post-page",children:e.jsxDEV("div",{className:"loading-state",children:[e.jsxDEV("div",{className:"spinner"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:72,columnNumber:11},void 0),e.jsxDEV("p",{children:"Loading post..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:73,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:71,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:70,columnNumber:7},void 0):s||!r?e.jsxDEV("div",{className:"edit-post-page",children:e.jsxDEV("div",{className:"error-state",children:[e.jsxDEV("h2",{children:"Error"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:83,columnNumber:11},void 0),e.jsxDEV("p",{children:s||"Post not found"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:84,columnNumber:11},void 0),e.jsxDEV("button",{onClick:()=>i("/admin/posts"),className:"btn btn-primary",children:"Back to Posts"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:85,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:82,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:81,columnNumber:7},void 0):e.jsxDEV("div",{className:"edit-post-page",children:[e.jsxDEV("div",{className:"page-header",children:[e.jsxDEV("h1",{children:"Edit Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:96,columnNumber:9},void 0),e.jsxDEV("p",{children:['Make changes to "',r.title,'"']},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:97,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:95,columnNumber:7},void 0),e.jsxDEV(k,{initialData:r,onSave:v,onCancel:x,loading:c,isEditing:!0},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:100,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:108,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/features/admin/pages/EditPost.jsx",lineNumber:94,columnNumber:5},void 0)};export{w as default};
