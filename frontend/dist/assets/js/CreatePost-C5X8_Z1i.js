var p=(o,n,e)=>new Promise((d,r)=>{var l=a=>{try{s(e.next(a))}catch(c){r(c)}},i=a=>{try{s(e.throw(a))}catch(c){r(c)}},s=a=>a.done?d(a.value):Promise.resolve(a.value).then(l,i);s((e=e.apply(o,n)).next())});import{b as g,r as h,j as t,V as m}from"./react-vendor-seMyx5IZ.js";import{a as f}from"./components-BFPYROii.js";import"./vendor-Dxve-ft9.js";import"./utils-BWmz-sOC.js";import"./supabase-vendor-DJ5DSPXj.js";const P=()=>{const o=g(),[n,e]=h.useState(!1),d=(l,i=!1)=>p(null,null,function*(){e(!0);try{const s=i?"saved as draft":"published";m.success(`Post ${s} successfully!`),i||o("/admin/posts")}catch(s){m.error("Failed to save post. Please try again.")}finally{e(!1)}}),r=()=>{o("/admin/posts")};return t.jsxs("div",{className:"create-post-page",children:[t.jsxs("div",{className:"page-header",children:[t.jsx("h1",{children:"Create New Post"}),t.jsx("p",{children:"Write and publish a new blog post"})]}),t.jsx(f,{onSave:d,onCancel:r,loading:n,isEditing:!1}),t.jsx("style",{jsx:"true",children:`
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
      `})]})};export{P as default};
