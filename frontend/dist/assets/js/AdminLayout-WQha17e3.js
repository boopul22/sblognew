var c=(t,i,a)=>new Promise((o,r)=>{var d=n=>{try{m(a.next(n))}catch(l){r(l)}},h=n=>{try{m(a.throw(n))}catch(l){r(l)}},m=n=>n.done?o(n.value):Promise.resolve(n.value).then(d,h);m((a=a.apply(t,i)).next())});import{r as u,u as g,j as e,L as s,k as x}from"./react-vendor-seMyx5IZ.js";import{u as p}from"./components-BFPYROii.js";import"./vendor-Dxve-ft9.js";import"./utils-BWmz-sOC.js";import"./supabase-vendor-DJ5DSPXj.js";const f=u.memo(()=>{const t=g(),{user:i,signOut:a}=p(),o=d=>t.pathname===d||t.pathname.startsWith(d+"/"),r=()=>c(null,null,function*(){yield a()});return e.jsxs("div",{className:"admin-layout",children:[e.jsx("div",{className:"admin-header",children:e.jsxs("div",{className:"admin-nav",children:[e.jsx(s,{to:"/",className:"admin-logo",children:"← Back to Blog"}),e.jsx("h1",{children:"Admin Panel"}),e.jsxs("div",{className:"admin-user",children:[e.jsxs("span",{children:["Welcome, ",i==null?void 0:i.email]}),e.jsx("button",{onClick:r,className:"logout-btn",children:"Logout"})]})]})}),e.jsxs("div",{className:"admin-container",children:[e.jsx("nav",{className:"admin-sidebar",children:e.jsxs("ul",{className:"admin-menu",children:[e.jsx("li",{children:e.jsx(s,{to:"/admin/posts",className:o("/admin/posts")?"active":"",children:"📝 All Posts"})}),e.jsx("li",{children:e.jsx(s,{to:"/admin/create",className:o("/admin/create")?"active":"",children:"➕ Create New Post"})}),e.jsx("li",{children:e.jsx(s,{to:"/admin/storage-settings",className:o("/admin/storage-settings")?"active":"",children:"🗄️ Storage Settings"})})]})}),e.jsx("main",{className:"admin-content",children:e.jsx(x,{})})]}),e.jsx("style",{jsx:"true",children:`
        .admin-layout {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e9ecef;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .admin-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .admin-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .logout-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .admin-logo {
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .admin-logo:hover {
          color: #495057;
        }

        .admin-nav h1 {
          margin: 0;
          color: #212529;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .admin-container {
          display: flex;
          min-height: calc(100vh - 80px);
        }

        .admin-sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #e9ecef;
          padding: 2rem 0;
        }

        .admin-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-menu li {
          margin: 0;
        }

        .admin-menu a {
          display: block;
          padding: 0.75rem 2rem;
          color: #6c757d;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .admin-menu a:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .admin-menu a.active {
          background: #e3f2fd;
          color: #1976d2;
          border-left-color: #1976d2;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-container {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
            padding: 1rem 0;
          }

          .admin-menu {
            display: flex;
            overflow-x: auto;
          }

          .admin-menu li {
            flex-shrink: 0;
          }

          .admin-menu a {
            padding: 0.5rem 1rem;
            border-left: none;
            border-bottom: 3px solid transparent;
          }

          .admin-menu a.active {
            border-left: none;
            border-bottom-color: #1976d2;
          }

          .admin-content {
            padding: 1rem;
          }
        }
      `})]})});f.displayName="AdminLayout";export{f as default};
