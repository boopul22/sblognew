var x=(c,f,d)=>new Promise((p,o)=>{var g=s=>{try{h(d.next(s))}catch(a){o(a)}},i=s=>{try{h(d.throw(s))}catch(a){o(a)}},h=s=>s.done?p(s.value):Promise.resolve(s.value).then(g,i);h((d=d.apply(c,f)).next())});import{r as l,V as u,j as e,L as b}from"./react-vendor-seMyx5IZ.js";import{F as L,s as _,k as $}from"./utils-BWmz-sOC.js";import{B}from"./components-BFPYROii.js";import"./vendor-Dxve-ft9.js";import"./supabase-vendor-DJ5DSPXj.js";const G=()=>{const[c,f]=l.useState([]),[d,p]=l.useState(!0),[o,g]=l.useState(""),[i,h]=l.useState("all"),[s,a]=l.useState([]),[j,w]=l.useState(!1);l.useEffect(()=>{m()},[o,i]);const m=()=>x(null,null,function*(){try{p(!0);const t=yield L({search:o,status:i==="all"?null:i,limit:50});f(t.posts||[]),a([]),w(!1)}catch(t){u.error("Failed to load posts")}finally{p(!1)}}),S=(t,r)=>x(null,null,function*(){if(confirm(`Are you sure you want to delete "${r}"?`))try{yield $(t),u.success("Post deleted successfully"),m()}catch(n){u.error("Failed to delete post")}}),k=(t,r)=>x(null,null,function*(){var n;try{const y={status:r};r==="published"&&!((n=c.find(F=>F.id===t))!=null&&n.published_at)&&(y.published_at=new Date().toISOString());const{error:N}=yield _.from("posts").update(y).eq("id",t);if(N)throw N;u.success(`Post ${r} successfully`),m()}catch(y){u.error("Failed to update post status")}}),v=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),P=t=>{const n={published:{class:"status-published",text:"Published"},draft:{class:"status-draft",text:"Draft"},private:{class:"status-private",text:"Private"}}[t]||{class:"status-unknown",text:t};return e.jsx("span",{className:`status-badge ${n.class}`,children:n.text})},C=t=>{a(r=>r.includes(t)?r.filter(n=>n!==t):[...r,t])},A=()=>{a(j?[]:c.map(t=>t.id)),w(!j)},D=()=>{m()},z=()=>{a([]),w(!1)};return e.jsxs("div",{className:"posts-list-page",children:[e.jsx("div",{className:"page-header",children:e.jsxs("div",{className:"header-content",children:[e.jsx("h1",{children:"All Posts"}),e.jsx(b,{to:"/admin/create",className:"btn btn-primary",children:"Create New Post"})]})}),e.jsxs("div",{className:"filters",children:[e.jsx("div",{className:"search-box",children:e.jsx("input",{type:"text",placeholder:"Search posts...",value:o,onChange:t=>g(t.target.value),className:"search-input"})}),e.jsxs("select",{value:i,onChange:t=>h(t.target.value),className:"status-filter",children:[e.jsx("option",{value:"all",children:"All Status"}),e.jsx("option",{value:"published",children:"Published"}),e.jsx("option",{value:"draft",children:"Draft"}),e.jsx("option",{value:"private",children:"Private"})]})]}),e.jsx(B,{selectedPosts:s,onActionComplete:D,onClearSelection:z}),d?e.jsxs("div",{className:"loading-state",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"Loading posts..."})]}):c.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("h3",{children:"No posts found"}),e.jsx("p",{children:o||i!=="all"?"Try adjusting your search or filter criteria.":"Get started by creating your first post."}),e.jsx(b,{to:"/admin/create",className:"btn btn-primary",children:"Create New Post"})]}):e.jsx("div",{className:"posts-table-container",children:e.jsxs("table",{className:"posts-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:e.jsx("input",{type:"checkbox",checked:j,onChange:A,className:"select-checkbox"})}),e.jsx("th",{children:"Title"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Published"}),e.jsx("th",{children:"Updated"}),e.jsx("th",{children:"Actions"})]})}),e.jsx("tbody",{children:c.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("input",{type:"checkbox",checked:s.includes(t.id),onChange:()=>C(t.id),className:"select-checkbox"})}),e.jsx("td",{children:e.jsxs("div",{className:"post-title",children:[e.jsx(b,{to:`/admin/edit/${t.id}`,className:"title-link",children:t.title}),e.jsxs("div",{className:"post-slug",children:["/",t.slug]})]})}),e.jsx("td",{children:P(t.status)}),e.jsx("td",{children:t.published_at?v(t.published_at):"—"}),e.jsx("td",{children:v(t.updated_at)}),e.jsx("td",{children:e.jsxs("div",{className:"actions",children:[e.jsx(b,{to:`/admin/edit/${t.id}`,className:"btn btn-sm btn-secondary",children:"Edit"}),e.jsx(b,{to:`/${t.slug}`,className:"btn btn-sm btn-outline",target:"_blank",children:"View"}),t.status==="draft"?e.jsx("button",{onClick:()=>k(t.id,"published"),className:"btn btn-sm btn-success",children:"Publish"}):e.jsx("button",{onClick:()=>k(t.id,"draft"),className:"btn btn-sm btn-warning",children:"Unpublish"}),e.jsx("button",{onClick:()=>S(t.id,t.title),className:"btn btn-sm btn-danger",children:"Delete"})]})})]},t.id))})]})}),e.jsx("style",{jsx:"true",children:`
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
      `})]})};export{G as default};
