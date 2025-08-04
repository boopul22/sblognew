var h=(c,a,s)=>new Promise((m,l)=>{var p=t=>{try{r(s.next(t))}catch(o){l(o)}},g=t=>{try{r(s.throw(t))}catch(o){l(o)}},r=t=>t.done?m(t.value):Promise.resolve(t.value).then(p,g);r((s=s.apply(c,a)).next())});import{c as v,b as y,r as d,V as f,j as e}from"./react-vendor-seMyx5IZ.js";import{a as P}from"./components-BFPYROii.js";import{s as E}from"./utils-BWmz-sOC.js";import"./vendor-Dxve-ft9.js";import"./supabase-vendor-DJ5DSPXj.js";const F=()=>{const{id:c}=v(),a=y(),[s,m]=d.useState(null),[l,p]=d.useState(!0),[g,r]=d.useState(!1),[t,o]=d.useState(null);d.useEffect(()=>{x()},[c]);const x=()=>h(null,null,function*(){try{p(!0);const{data:i,error:n}=yield E.from("posts").select("*").eq("id",c).single();if(n)throw n;if(!i)throw new Error("Post not found");m(i)}catch(i){o(i.message),f.error("Failed to load post")}finally{p(!1)}}),b=(i,n=!1)=>h(null,null,function*(){r(!0);try{const u=n?"saved as draft":"updated";f.success(`Post ${u} successfully!`),n||a("/admin/posts")}catch(u){f.error("Failed to save post. Please try again.")}finally{r(!1)}}),j=()=>{a("/admin/posts")};return l?e.jsx("div",{className:"edit-post-page",children:e.jsxs("div",{className:"loading-state",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"Loading post..."})]})}):t||!s?e.jsx("div",{className:"edit-post-page",children:e.jsxs("div",{className:"error-state",children:[e.jsx("h2",{children:"Error"}),e.jsx("p",{children:t||"Post not found"}),e.jsx("button",{onClick:()=>a("/admin/posts"),className:"btn btn-primary",children:"Back to Posts"})]})}):e.jsxs("div",{className:"edit-post-page",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("h1",{children:"Edit Post"}),e.jsxs("p",{children:['Make changes to "',s.title,'"']})]}),e.jsx(P,{initialData:s,onSave:b,onCancel:j,loading:g,isEditing:!0}),e.jsx("style",{jsx:"true",children:`
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
      `})]})};export{F as default};
