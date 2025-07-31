var N=(d,x,u)=>new Promise((b,n)=>{var h=i=>{try{c(u.next(i))}catch(r){n(r)}},o=i=>{try{c(u.throw(i))}catch(r){n(r)}},c=i=>i.done?b(i.value):Promise.resolve(i.value).then(h,o);c((u=u.apply(d,x)).next())});import{r as l,V as m,j as e,L as p}from"./react-vendor-QWuLYCV5.js";import{E as S,s as C,k as A}from"./utils-BwPHgDBd.js";import{B as z}from"./components--My5jaPA.js";import"./vendor-CJchTyIO.js";import"./supabase-vendor-DEo8APS7.js";const G=()=>{const[d,x]=l.useState([]),[u,b]=l.useState(!0),[n,h]=l.useState(""),[o,c]=l.useState("all"),[i,r]=l.useState([]),[k,g]=l.useState(!1);l.useEffect(()=>{f()},[n,o]);const f=()=>N(null,null,function*(){try{b(!0);const s=yield S({search:n,status:o==="all"?null:o,limit:50});x(s.posts||[]),r([]),g(!1)}catch(s){m.error("Failed to load posts")}finally{b(!1)}}),P=(s,t)=>N(null,null,function*(){if(confirm(`Are you sure you want to delete "${t}"?`))try{yield A(s),m.success("Post deleted successfully"),f()}catch(a){m.error("Failed to delete post")}}),D=(s,t)=>N(null,null,function*(){var a;try{const v={status:t};t==="published"&&!((a=d.find(w=>w.id===s))!=null&&a.published_at)&&(v.published_at=new Date().toISOString());const{error:y}=yield C.from("posts").update(v).eq("id",s);if(y)throw y;m.success(`Post ${t} successfully`),f()}catch(v){m.error("Failed to update post status")}}),j=s=>new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),L=s=>{const a={published:{class:"status-published",text:"Published"},draft:{class:"status-draft",text:"Draft"},private:{class:"status-private",text:"Private"}}[s]||{class:"status-unknown",text:s};return e.jsxDEV("span",{className:`status-badge ${a.class}`,children:a.text},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:96,columnNumber:12},void 0)},_=s=>{r(t=>t.includes(s)?t.filter(a=>a!==s):[...t,s])},E=()=>{r(k?[]:d.map(s=>s.id)),g(!k)},U=()=>{f()},V=()=>{r([]),g(!1)};return e.jsxDEV("div",{className:"posts-list-page",children:[e.jsxDEV("div",{className:"page-header",children:e.jsxDEV("div",{className:"header-content",children:[e.jsxDEV("h1",{children:"All Posts"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:129,columnNumber:11},void 0),e.jsxDEV(p,{to:"/admin/create",className:"btn btn-primary",children:"Create New Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:130,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:128,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:127,columnNumber:7},void 0),e.jsxDEV("div",{className:"filters",children:[e.jsxDEV("div",{className:"search-box",children:e.jsxDEV("input",{type:"text",placeholder:"Search posts...",value:n,onChange:s=>h(s.target.value),className:"search-input"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:138,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:137,columnNumber:9},void 0),e.jsxDEV("select",{value:o,onChange:s=>c(s.target.value),className:"status-filter",children:[e.jsxDEV("option",{value:"all",children:"All Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:151,columnNumber:11},void 0),e.jsxDEV("option",{value:"published",children:"Published"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:152,columnNumber:11},void 0),e.jsxDEV("option",{value:"draft",children:"Draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:153,columnNumber:11},void 0),e.jsxDEV("option",{value:"private",children:"Private"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:154,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:146,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:136,columnNumber:7},void 0),e.jsxDEV(z,{selectedPosts:i,onActionComplete:U,onClearSelection:V},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:158,columnNumber:7},void 0),u?e.jsxDEV("div",{className:"loading-state",children:[e.jsxDEV("div",{className:"spinner"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:166,columnNumber:11},void 0),e.jsxDEV("p",{children:"Loading posts..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:167,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:165,columnNumber:9},void 0):d.length===0?e.jsxDEV("div",{className:"empty-state",children:[e.jsxDEV("h3",{children:"No posts found"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:171,columnNumber:11},void 0),e.jsxDEV("p",{children:n||o!=="all"?"Try adjusting your search or filter criteria.":"Get started by creating your first post."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:172,columnNumber:11},void 0),e.jsxDEV(p,{to:"/admin/create",className:"btn btn-primary",children:"Create New Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:178,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:170,columnNumber:9},void 0):e.jsxDEV("div",{className:"posts-table-container",children:e.jsxDEV("table",{className:"posts-table",children:[e.jsxDEV("thead",{children:e.jsxDEV("tr",{children:[e.jsxDEV("th",{children:e.jsxDEV("input",{type:"checkbox",checked:k,onChange:E,className:"select-checkbox"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:188,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:187,columnNumber:17},void 0),e.jsxDEV("th",{children:"Title"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:195,columnNumber:17},void 0),e.jsxDEV("th",{children:"Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:196,columnNumber:17},void 0),e.jsxDEV("th",{children:"Published"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:197,columnNumber:17},void 0),e.jsxDEV("th",{children:"Updated"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:198,columnNumber:17},void 0),e.jsxDEV("th",{children:"Actions"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:199,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:186,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:185,columnNumber:13},void 0),e.jsxDEV("tbody",{children:d.map(s=>e.jsxDEV("tr",{children:[e.jsxDEV("td",{children:e.jsxDEV("input",{type:"checkbox",checked:i.includes(s.id),onChange:()=>_(s.id),className:"select-checkbox"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:206,columnNumber:21},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:205,columnNumber:19},void 0),e.jsxDEV("td",{children:e.jsxDEV("div",{className:"post-title",children:[e.jsxDEV(p,{to:`/admin/edit/${s.id}`,className:"title-link",children:s.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:215,columnNumber:23},void 0),e.jsxDEV("div",{className:"post-slug",children:["/",s.slug]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:218,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:214,columnNumber:21},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:213,columnNumber:19},void 0),e.jsxDEV("td",{children:L(s.status)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:221,columnNumber:19},void 0),e.jsxDEV("td",{children:s.published_at?j(s.published_at):"—"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:222,columnNumber:19},void 0),e.jsxDEV("td",{children:j(s.updated_at)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:225,columnNumber:19},void 0),e.jsxDEV("td",{children:e.jsxDEV("div",{className:"actions",children:[e.jsxDEV(p,{to:`/admin/edit/${s.id}`,className:"btn btn-sm btn-secondary",children:"Edit"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:228,columnNumber:23},void 0),e.jsxDEV(p,{to:`/${s.slug}`,className:"btn btn-sm btn-outline",target:"_blank",children:"View"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:231,columnNumber:23},void 0),s.status==="draft"?e.jsxDEV("button",{onClick:()=>D(s.id,"published"),className:"btn btn-sm btn-success",children:"Publish"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:235,columnNumber:25},void 0):e.jsxDEV("button",{onClick:()=>D(s.id,"draft"),className:"btn btn-sm btn-warning",children:"Unpublish"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:242,columnNumber:25},void 0),e.jsxDEV("button",{onClick:()=>P(s.id,s.title),className:"btn btn-sm btn-danger",children:"Delete"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:249,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:227,columnNumber:21},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:226,columnNumber:19},void 0)]},s.id,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:204,columnNumber:17},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:202,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:184,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:183,columnNumber:9},void 0),e.jsxDEV("style",{jsx:"true",children:`
        .posts-list-page {
          max-width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h1 {
          margin: 0;
          color: #212529;
          font-size: 2rem;
          font-weight: 600;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-input, .status-filter {
          padding: 0.5rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
        }

        .status-filter {
          min-width: 120px;
        }

        .loading-state, .empty-state {
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

        .posts-table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .posts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .posts-table th,
        .posts-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .posts-table th:first-child,
        .posts-table td:first-child {
          width: 40px;
          padding: 1rem 0.5rem;
          text-align: center;
        }

        .select-checkbox {
          cursor: pointer;
          transform: scale(1.2);
        }

        .posts-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .post-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title-link {
          color: #212529;
          text-decoration: none;
          font-weight: 500;
        }

        .title-link:hover {
          color: #1976d2;
        }

        .post-slug {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-private {
          background: #f8d7da;
          color: #721c24;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.375rem 0.75rem;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          text-align: center;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .btn-primary:hover {
          background: #1565c0;
          border-color: #1565c0;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover {
          background: #5a6268;
          border-color: #5a6268;
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border-color: #6c757d;
        }

        .btn-outline:hover {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .btn-success:hover {
          background: #218838;
          border-color: #218838;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }

        .btn-warning:hover {
          background: #e0a800;
          border-color: #e0a800;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .btn-danger:hover {
          background: #c82333;
          border-color: #c82333;
        }

        @media (max-width: 768px) {
          .posts-table-container {
            overflow-x: auto;
          }

          .posts-table {
            min-width: 600px;
          }

          .actions {
            flex-direction: column;
            min-width: 100px;
          }
        }
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:264,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/pages/admin/PostsList.jsx",lineNumber:126,columnNumber:5},void 0)};export{G as default};
