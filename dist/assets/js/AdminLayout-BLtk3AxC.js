import{r as o,u as r,j as a,L as e,i as t}from"./react-vendor-Ba7ko1lq.js";import"./vendor-CRi0sl0h.js";const m=o.memo(()=>{const n=r(),i=d=>n.pathname===d||n.pathname.startsWith(d+"/");return a.jsxs("div",{className:"admin-layout",children:[a.jsx("div",{className:"admin-header",children:a.jsxs("div",{className:"admin-nav",children:[a.jsx(e,{to:"/",className:"admin-logo",children:"← Back to Blog"}),a.jsx("h1",{children:"Admin Panel"})]})}),a.jsxs("div",{className:"admin-container",children:[a.jsx("nav",{className:"admin-sidebar",children:a.jsxs("ul",{className:"admin-menu",children:[a.jsx("li",{children:a.jsx(e,{to:"/admin/posts",className:i("/admin/posts")?"active":"",children:"📝 All Posts"})}),a.jsx("li",{children:a.jsx(e,{to:"/admin/create",className:i("/admin/create")?"active":"",children:"➕ Create New Post"})})]})}),a.jsx("main",{className:"admin-content",children:a.jsx(t,{})})]}),a.jsx("style",{jsx:!0,children:`
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
          gap: 2rem;
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
      `})]})});m.displayName="AdminLayout";export{m as default};
