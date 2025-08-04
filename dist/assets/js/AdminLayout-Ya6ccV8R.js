var u=(m,a,n)=>new Promise((s,o)=>{var r=i=>{try{t(n.next(i))}catch(l){o(l)}},c=i=>{try{t(n.throw(i))}catch(l){o(l)}},t=i=>i.done?s(i.value):Promise.resolve(i.value).then(r,c);t((n=n.apply(m,a)).next())});import{r as p,u as b,j as e,L as d,l as f}from"./react-vendor-DV45Ikwi.js";import{u as N}from"./components-BN_Ihx4k.js";import"./vendor-B0T_4ch3.js";import"./utils-9Fb_5NIc.js";import"./supabase-vendor-CPNJAKHt.js";const g=p.memo(()=>{const m=b(),{user:a,signOut:n}=N(),s=r=>m.pathname===r||m.pathname.startsWith(r+"/"),o=()=>u(null,null,function*(){yield n()});return e.jsxDEV("div",{className:"admin-layout",children:[e.jsxDEV("div",{className:"admin-header",children:e.jsxDEV("div",{className:"admin-nav",children:[e.jsxDEV(d,{to:"/",className:"admin-logo",children:"← Back to Blog"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:21,columnNumber:11},void 0),e.jsxDEV("h1",{children:"Admin Panel"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:24,columnNumber:11},void 0),e.jsxDEV("div",{className:"admin-user",children:[e.jsxDEV("span",{children:["Welcome, ",a==null?void 0:a.email]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:26,columnNumber:13},void 0),e.jsxDEV("button",{onClick:o,className:"logout-btn",children:"Logout"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:27,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:25,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:20,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:19,columnNumber:7},void 0),e.jsxDEV("div",{className:"admin-container",children:[e.jsxDEV("nav",{className:"admin-sidebar",children:e.jsxDEV("ul",{className:"admin-menu",children:[e.jsxDEV("li",{children:e.jsxDEV(d,{to:"/admin/posts",className:s("/admin/posts")?"active":"",children:"📝 All Posts"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:38,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:37,columnNumber:13},void 0),e.jsxDEV("li",{children:e.jsxDEV(d,{to:"/admin/create",className:s("/admin/create")?"active":"",children:"➕ Create New Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:46,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:45,columnNumber:13},void 0),e.jsxDEV("li",{children:e.jsxDEV(d,{to:"/admin/storage-settings",className:s("/admin/storage-settings")?"active":"",children:"🗄️ Storage Settings"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:54,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:53,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:36,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:35,columnNumber:9},void 0),e.jsxDEV("main",{className:"admin-content",children:e.jsxDEV(f,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:65,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:64,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:34,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:69,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/AdminLayout.jsx",lineNumber:18,columnNumber:5},void 0)});g.displayName="AdminLayout";export{g as default};
