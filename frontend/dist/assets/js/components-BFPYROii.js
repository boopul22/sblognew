var D=Object.defineProperty,ee=Object.defineProperties;var re=Object.getOwnPropertyDescriptors;var W=Object.getOwnPropertySymbols;var te=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var K=(r,o,s)=>o in r?D(r,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[o]=s,v=(r,o)=>{for(var s in o||(o={}))te.call(o,s)&&K(r,s,o[s]);if(W)for(var s of W(o))se.call(o,s)&&K(r,s,o[s]);return r},y=(r,o)=>ee(r,re(o));var k=(r,o,s)=>new Promise((i,t)=>{var n=c=>{try{x(s.next(c))}catch(u){t(u)}},g=c=>{try{x(s.throw(c))}catch(u){t(u)}},x=c=>c.done?i(c.value):Promise.resolve(c.value).then(n,g);x((s=s.apply(r,o)).next())});import{r as a,V as S,j as e,u as H,L as U,R as oe,a as ne,b as ie,N as ae}from"./react-vendor-seMyx5IZ.js";import{s as A,d as le,g as de,n as ce,a as M,b as G,f as ue,c as me,u as pe,e as he,h as Y,i as Q,v as ge,j as O,k as xe,l as fe,m as be,o as ve,p as je}from"./utils-BWmz-sOC.js";const J=a.createContext({}),X=()=>{const r=a.useContext(J);if(!r)throw new Error("useAuth must be used within an AuthProvider");return r},Re=({children:r})=>{const[o,s]=a.useState(null),[i,t]=a.useState(!0),[n,g]=a.useState(null);a.useEffect(()=>{A.auth.getSession().then(({data:{session:m}})=>{var l;g(m),s((l=m==null?void 0:m.user)!=null?l:null),t(!1)});const{data:{subscription:d}}=A.auth.onAuthStateChange((m,l)=>k(null,null,function*(){var j;g(l),s((j=l==null?void 0:l.user)!=null?j:null),t(!1),m==="SIGNED_IN"?S.success("Successfully signed in!"):m==="SIGNED_OUT"&&S.success("Successfully signed out!")}));return()=>d.unsubscribe()},[]);const x=(d,m)=>k(null,null,function*(){try{t(!0);const{data:l,error:j}=yield A.auth.signInWithPassword({email:d,password:m});if(j)throw j;return{data:l,error:null}}catch(l){return S.error(l.message||"Failed to sign in"),{data:null,error:l}}finally{t(!1)}}),c=()=>k(null,null,function*(){try{t(!0);const{error:d}=yield A.auth.signOut();if(d)throw d}catch(d){S.error(d.message||"Failed to sign out")}finally{t(!1)}}),u=(j,F,...I)=>k(null,[j,F,...I],function*(d,m,l={}){try{t(!0);const{data:_,error:w}=yield A.auth.signUp({email:d,password:m,options:{data:l}});if(w)throw w;return{data:_,error:null}}catch(_){return S.error(_.message||"Failed to sign up"),{data:null,error:_}}finally{t(!1)}}),p=d=>k(null,null,function*(){try{const{data:m,error:l}=yield A.auth.resetPasswordForEmail(d,{redirectTo:`${window.location.origin}/admin/reset-password`});if(l)throw l;return S.success("Password reset email sent!"),{data:m,error:null}}catch(m){return S.error(m.message||"Failed to send reset email"),{data:null,error:m}}}),z=d=>k(null,null,function*(){try{const{data:m,error:l}=yield A.auth.updateUser({password:d});if(l)throw l;return S.success("Password updated successfully!"),{data:m,error:null}}catch(m){return S.error(m.message||"Failed to update password"),{data:null,error:m}}}),b=()=>k(null,null,function*(){if(!o)return null;try{const{data:d,error:m}=yield A.from("users").select("*").eq("id",o.id).single();if(m)throw m;return d}catch(d){return null}}),f={user:o,session:n,loading:i,signIn:x,signOut:c,signUp:u,resetPassword:p,updatePassword:z,getUserProfile:b,isAdmin:()=>k(null,null,function*(){const d=yield b();return(d==null?void 0:d.role)==="admin"}),isEditor:()=>k(null,null,function*(){const d=yield b();return(d==null?void 0:d.role)==="editor"||(d==null?void 0:d.role)==="admin"})};return e.jsx(J.Provider,{value:f,children:r})},ye=a.memo(({onSearch:r,searchQuery:o,setSearchQuery:s})=>{const i=H(),t=c=>!!(c==="/"&&i.pathname==="/"||c!=="/"&&i.pathname.startsWith(c)),n=a.useCallback(le(c=>{r&&r(c)},300),[r]),g=c=>{const u=c.target.value;s(u),n(u)},x=()=>i.pathname.startsWith("/authors")?"Search Authors...":"Search...";return e.jsxs("div",{className:"header",children:[e.jsx(U,{to:"/",className:"logo",children:"SAYARI"}),e.jsxs("nav",{className:"nav",children:[e.jsx(U,{to:"/",className:`nav-item ${t("/")?"active":""}`,children:"All"}),e.jsx(U,{to:"/category/shayari",className:`nav-item ${t("/category/shayari")?"active":""}`,children:"Shayari"}),e.jsx(U,{to:"/category/quotes",className:`nav-item ${t("/category/quotes")?"active":""}`,children:"Quotes"}),e.jsx(U,{to:"/category/wishes",className:`nav-item ${t("/category/wishes")?"active":""}`,children:"Wishes"}),e.jsx(U,{to:"/authors",className:`nav-item ${t("/authors")?"active":""}`,children:"Authors"})]}),e.jsx("div",{className:"search-container",children:e.jsx("input",{type:"text",className:"search",placeholder:x(),value:o,onChange:g,autoComplete:"off",spellCheck:"false"})})]})});ye.displayName="Header";const Te=()=>e.jsx("div",{className:"footer",children:e.jsxs("div",{className:"footer-content",children:[e.jsx("p",{children:"© 2025 Sayari Blog. All rights reserved."}),e.jsx("p",{style:{marginTop:"10px",fontSize:"12px",color:"#999"},children:"A collection of beautiful Hindi Shayari, Quotes, and Wishes"})]})}),$=a.memo(({type:r="post",count:o=1,className:s="",style:i={}})=>{const t=v({backgroundColor:"#f0f0f0",borderRadius:"4px",position:"relative",overflow:"hidden"},i),n={position:"absolute",top:0,left:"-100%",width:"100%",height:"100%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",animation:"shimmer 1.5s infinite"},g=()=>e.jsxs("div",{className:`skeleton-post ${s}`,style:{marginBottom:"20px"},children:[e.jsx("div",{style:y(v({},t),{width:"100%",height:"200px",marginBottom:"15px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:y(v({},t),{width:"80%",height:"24px",marginBottom:"10px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:y(v({},t),{width:"100%",height:"16px",marginBottom:"8px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:y(v({},t),{width:"90%",height:"16px",marginBottom:"8px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:y(v({},t),{width:"70%",height:"16px",marginBottom:"15px"}),children:e.jsx("div",{style:n})}),e.jsxs("div",{style:{display:"flex",gap:"15px"},children:[e.jsx("div",{style:y(v({},t),{width:"80px",height:"14px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:y(v({},t),{width:"100px",height:"14px"}),children:e.jsx("div",{style:n})})]})]}),x=()=>e.jsx("div",{className:`skeleton-author ${s}`,style:{marginBottom:"15px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px"},children:[e.jsx("div",{style:y(v({},t),{width:"50px",height:"50px",borderRadius:"50%"}),children:e.jsx("div",{style:n})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:y(v({},t),{width:"150px",height:"18px",marginBottom:"5px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:y(v({},t),{width:"200px",height:"14px"}),children:e.jsx("div",{style:n})})]})]})}),c=()=>e.jsx("div",{className:`skeleton-header ${s}`,style:{marginBottom:"30px"},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:y(v({},t),{width:"120px",height:"32px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:{display:"flex",gap:"20px"},children:[1,2,3,4,5].map(b=>e.jsx("div",{style:y(v({},t),{width:"60px",height:"20px"}),children:e.jsx("div",{style:n})},b))}),e.jsx("div",{style:y(v({},t),{width:"200px",height:"36px"}),children:e.jsx("div",{style:n})})]})}),u=({lines:b=3,width:N="100%"})=>e.jsx("div",{className:`skeleton-text ${s}`,children:Array.from({length:b}).map((h,f)=>e.jsx("div",{style:y(v({},t),{width:f===b-1?"70%":N,height:"16px",marginBottom:"8px"}),children:e.jsx("div",{style:n})},f))}),p=({width:b="100%",height:N="200px"})=>e.jsx("div",{className:`skeleton-image ${s}`,style:y(v({},t),{width:b,height:N}),children:e.jsx("div",{style:n})}),z=()=>{switch(r){case"post":return e.jsx(g,{});case"author":return e.jsx(x,{});case"header":return e.jsx(c,{});case"text":return e.jsx(u,{});case"image":return e.jsx(p,{});default:return e.jsx(g,{})}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}),e.jsx("div",{className:`skeleton-loader ${s}`,children:Array.from({length:o}).map((b,N)=>e.jsx("div",{children:z()},N))})]})});$.displayName="SkeletonLoader";a.memo(()=>e.jsx($,{type:"post",count:1}));a.memo(()=>e.jsx($,{type:"author",count:1}));a.memo(()=>e.jsx($,{type:"header",count:1}));a.memo(({lines:r=3})=>e.jsx($,{type:"text",lines:r}));a.memo(({width:r,height:o})=>e.jsx($,{type:"image",width:r,height:o}));const V=a.memo(({src:r,alt:o,width:s,height:i,className:t="",style:n={},lazy:g=!0,priority:x=!1,sizes:c="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",aspectRatio:u=null})=>{const[p,z]=a.useState(!1),[b,N]=a.useState(!g||x),[h,f]=a.useState(!1),d=a.useRef(null),m=a.useRef(null);a.useEffect(()=>{if(!g||x||b)return;const w=new IntersectionObserver(q=>{q.forEach(R=>{R.isIntersecting&&(N(!0),w.disconnect())})},{rootMargin:"50px",threshold:.1});return d.current&&(w.observe(d.current),m.current=w),()=>{m.current&&m.current.disconnect()}},[g,x,b]);const l=(w,q,R=80)=>{if(!w)return null;if(de(),w.includes("supabase.co/storage/v1/object/public/"))try{const T=new URL(w);return T.searchParams.set("width",q.toString()),T.searchParams.set("quality",R.toString()),T.searchParams.set("format","webp"),T.toString()}catch(T){return w}return w.includes(".r2.dev")||w.includes("r2.cloudflarestorage.com"),w},j=(w,q="original")=>w?[320,480,640,768,1024,1280,1920].filter(L=>!s||L<=s*2).map(L=>{let E=l(w,L);if(q==="webp")if(E.includes("supabase.co/storage/v1/object/public/"))try{const B=new URL(E);B.searchParams.set("format","webp"),E=B.toString()}catch(B){}else E.includes(".r2.dev")||E.includes("r2.cloudflarestorage.com")?E=E:E=E.replace(/\.(jpg|jpeg|png)$/i,".webp");return`${E} ${L}w`}).join(", "):"",F=()=>{z(!0)},I=w=>{f(!0)},_=e.jsx("div",{className:`image-placeholder ${t}`,style:y(v({},n),{backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"}),ref:d,children:h?"Failed to load":"Loading..."});return!b||h?_:e.jsxs("div",{className:`optimized-image-container ${t}`,style:n,ref:d,children:[e.jsxs("picture",{children:[e.jsx("source",{srcSet:j(r,"webp"),sizes:c,type:"image/webp"}),e.jsx("img",{src:l(r,s),srcSet:j(r),sizes:c,alt:o,width:s,height:i,loading:g&&!x?"lazy":"eager",fetchpriority:x?"high":"auto",decoding:"async",onLoad:F,onError:I,style:{width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.3s ease",opacity:p?1:0,display:"block"}})]}),!p&&e.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"},children:e.jsx("div",{style:{width:"16px",height:"16px",border:"2px solid #f3f3f3",borderTop:"2px solid #333",borderRadius:"50%",animation:"spin 1s linear infinite"}})})]})},(r,o)=>r.src===o.src&&r.width===o.width&&r.height===o.height&&r.lazy===o.lazy&&r.priority===o.priority);V.displayName="OptimizedImage";const we=({post:r,showDebug:o=!1})=>{const[s,i]=a.useState(null);return a.useEffect(()=>{if(!o||!r)return;const t=r.featured_image_url,n=ce(t),g=M(r.content,r.featured_image_url);i({originalUrl:t,normalizedUrl:n,thumbnailUrl:g,isSupabaseUrl:t==null?void 0:t.includes("supabase.co"),isExternalUrl:t&&!t.includes("supabase.co"),hasImage:!!t})},[r,o]),!o||!s?null:e.jsxs("div",{style:{position:"fixed",top:"10px",right:"10px",background:"rgba(0, 0, 0, 0.9)",color:"white",padding:"15px",borderRadius:"8px",fontSize:"12px",maxWidth:"400px",zIndex:9999,fontFamily:"monospace"},children:[e.jsx("h4",{style:{margin:"0 0 10px 0",color:"#4CAF50"},children:"🐛 Image Debug Info"}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"Post:"})," ",r.title]}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"Storage:"}),e.jsx("span",{style:{color:"#4CAF50"},children:"✅ Supabase Storage"})]}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"Image URL:"}),e.jsx("div",{style:{background:"rgba(255, 255, 255, 0.1)",padding:"4px",borderRadius:"4px",wordBreak:"break-all",fontSize:"10px"},children:s.originalUrl||"None"})]}),e.jsxs("div",{style:{marginBottom:"8px"},children:[e.jsx("strong",{children:"Status:"}),!s.hasImage&&e.jsx("span",{style:{color:"#9e9e9e"},children:" ℹ️ No featured image"}),s.isSupabaseUrl&&e.jsx("span",{style:{color:"#4CAF50"},children:" ✅ Supabase Storage URL"}),s.isExternalUrl&&e.jsx("span",{style:{color:"#2196F3"},children:" ℹ️ External URL"})]}),s.thumbnailUrl&&e.jsxs("div",{style:{marginTop:"10px"},children:[e.jsx("strong",{children:"Image Test:"}),e.jsx("img",{src:s.thumbnailUrl,alt:"Debug test",style:{width:"100px",height:"60px",objectFit:"cover",border:"1px solid #ccc",borderRadius:"4px",display:"block",marginTop:"5px"},onLoad:()=>{},onError:()=>{}})]})]})},Ne=a.memo(({post:r,featured:o=!1,priority:s=!1,showDebug:i=!1})=>{const t=()=>"Admin";if(o){const g=M(r.content,r.featured_image_url);return e.jsxs(U,{to:`/${r.slug}`,className:"featured",children:[g&&e.jsx("div",{className:"featured-image",children:e.jsx(V,{src:g,alt:r.title,width:800,height:200,priority:s||o,style:{borderRadius:"8px",marginBottom:"15px"}})}),e.jsx("div",{className:"featured-title",children:r.title}),e.jsx("div",{className:"featured-content",children:G(r.content,200)}),e.jsxs("div",{className:"featured-author",children:["By ",t()]})]})}const n=M(r.content,r.featured_image_url);return e.jsxs(e.Fragment,{children:[e.jsxs(U,{to:`/${r.slug}`,className:"poem-card",children:[n&&e.jsx("div",{className:"poem-image",children:e.jsx(V,{src:n,alt:r.title,width:400,height:150,lazy:!s,priority:s,style:{borderRadius:"8px",marginBottom:"10px"}})}),e.jsx("div",{className:"poem-title",children:r.title}),e.jsx("div",{className:"poem-preview",children:G(r.content)}),e.jsxs("div",{className:"poem-meta",children:[e.jsxs("div",{className:"author",children:["By ",t()]}),e.jsx("div",{className:"date",children:ue(r.published_at)})]})]}),i&&e.jsx(we,{post:r,showDebug:i})]})},(r,o)=>r.post.id===o.post.id&&r.featured===o.featured&&r.priority===o.priority);Ne.displayName="PostCard";const ke=({value:r,onChange:o,placeholder:s="Start writing..."})=>{const i=a.useRef(null),[t,n]=a.useState(r||"");a.useEffect(()=>{n(r||"")},[r]);const g=(p,z,b,N)=>{n(p),o(p)},x={toolbar:{container:[[{header:[1,2,3,!1]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{align:[]}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],["blockquote","code-block"],["link","image"],["clean"],["center-text","hindi-format"]],handlers:{"center-text":function(){this.quill.getSelection()&&this.quill.format("align","center")},"hindi-format":function(){this.quill.getSelection()&&(this.quill.format("align","center"),this.quill.format("size","large"))}}},clipboard:{matchVisual:!1}},c=["header","font","size","bold","italic","underline","strike","blockquote","list","bullet","indent","link","image","video","align","color","background","code-block"],u={minHeight:"400px",fontFamily:'"Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif'};return e.jsxs("div",{className:"rich-text-editor",children:[e.jsx(oe,{ref:i,theme:"snow",value:t,onChange:g,modules:x,formats:c,placeholder:s,style:u}),e.jsx("div",{className:"editor-help",children:e.jsxs("details",{children:[e.jsx("summary",{children:"Formatting Tips"}),e.jsxs("div",{className:"help-content",children:[e.jsx("h4",{children:"For Hindi Shayari:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Center Text:"})," Use the center alignment button for verses"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Line Breaks:"})," Press Shift+Enter for line breaks within verses"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Stanza Breaks:"})," Press Enter twice for stanza separation"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Emphasis:"})," Use bold or italic for emphasis"]})]}),e.jsx("h4",{children:"Keyboard Shortcuts:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+B"})," - Bold"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+I"})," - Italic"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+U"})," - Underline"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+Shift+C"})," - Center align"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+Z"})," - Undo"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+Y"})," - Redo"]})]})]})]})}),e.jsx("style",{jsx:"true",global:"true",children:`
        .rich-text-editor {
          position: relative;
        }

        .rich-text-editor .ql-editor {
          min-height: 400px;
          font-family: "Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: italic;
          color: #adb5bd;
        }

        /* Hindi text specific styles */
        .rich-text-editor .ql-editor p {
          margin-bottom: 1em;
        }

        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #1976d2;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
        }

        /* Custom toolbar styling */
        .rich-text-editor .ql-toolbar {
          border: 1px solid #ced4da;
          border-bottom: none;
          background: #f8f9fa;
        }

        .rich-text-editor .ql-container {
          border: 1px solid #ced4da;
          border-radius: 0 0 4px 4px;
        }

        .rich-text-editor .ql-toolbar .ql-formats {
          margin-right: 15px;
        }

        .rich-text-editor .ql-toolbar button {
          padding: 5px;
          margin: 2px;
        }

        .rich-text-editor .ql-toolbar button:hover {
          background: #e9ecef;
          border-radius: 3px;
        }

        .rich-text-editor .ql-toolbar button.ql-active {
          background: #1976d2;
          color: white;
          border-radius: 3px;
        }

        /* Custom button styles */
        .rich-text-editor .ql-toolbar button.ql-center-text::before {
          content: "⌘";
          font-weight: bold;
        }

        .rich-text-editor .ql-toolbar button.ql-hindi-format::before {
          content: "हि";
          font-weight: bold;
          font-family: "Noto Sans Devanagari", "Mangal", sans-serif;
        }

        /* Focus styles */
        .rich-text-editor .ql-container.ql-snow {
          border-color: #ced4da;
        }

        .rich-text-editor .ql-editor:focus {
          outline: none;
        }

        .rich-text-editor:focus-within .ql-container {
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .rich-text-editor .ql-toolbar {
            padding: 8px;
          }

          .rich-text-editor .ql-toolbar .ql-formats {
            margin-right: 10px;
          }

          .rich-text-editor .ql-editor {
            min-height: 300px;
            font-size: 14px;
          }
        }

        /* Help section styling */
        .editor-help {
          margin-top: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          background: #f8f9fa;
        }

        .editor-help summary {
          padding: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
          user-select: none;
        }

        .editor-help summary:hover {
          background: #e9ecef;
        }

        .help-content {
          padding: 0 0.75rem 0.75rem;
          border-top: 1px solid #e9ecef;
        }

        .help-content h4 {
          margin: 1rem 0 0.5rem 0;
          color: #212529;
          font-size: 0.9rem;
        }

        .help-content ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .help-content li {
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .help-content kbd {
          background: #e9ecef;
          border: 1px solid #adb5bd;
          border-radius: 3px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-family: monospace;
        }

        /* Print styles */
        @media print {
          .rich-text-editor .ql-toolbar,
          .editor-help {
            display: none;
          }

          .rich-text-editor .ql-container {
            border: none;
          }
        }
      `})]})},Se=({currentImage:r,onImageUpload:o,maxSize:s=5*1024*1024})=>{const[i,t]=a.useState(!1),[n,g]=a.useState(!1),[x,c]=a.useState(0),u=a.useRef(null),p=a.useCallback(l=>k(null,null,function*(){if(!l||l.length===0)return;const j=l[0];if(!j.type.startsWith("image/")){S.error("Please select an image file");return}if(j.size>s){S.error(`Image size must be less than ${Math.round(s/1024/1024)}MB`);return}yield z(j)}),[s]),z=l=>k(null,null,function*(){t(!0),c(0);try{const j=yield me(l,{maxWidth:1200,maxHeight:800,quality:.8}),F=yield pe(j,{onProgress:I=>{c(Math.round(I))}});if(!F.success)throw new Error(F.error||"Upload failed");o(F.url),S.success("Image uploaded successfully!")}catch(j){S.error(j.message||"Failed to upload image. Please try again.")}finally{t(!1),c(0)}}),b=l=>{l.preventDefault(),g(!0)},N=l=>{l.preventDefault(),g(!1)},h=l=>{l.preventDefault(),g(!1);const j=Array.from(l.dataTransfer.files);p(j)},f=l=>{const j=Array.from(l.target.files);p(j)},d=()=>{o(""),u.current&&(u.current.value="")},m=()=>{var l;(l=u.current)==null||l.click()};return e.jsxs("div",{className:"image-uploader",children:[r?e.jsxs("div",{className:"current-image",children:[e.jsxs("div",{className:"image-preview",children:[e.jsx("img",{src:r,alt:"Featured"}),e.jsxs("div",{className:"image-overlay",children:[e.jsx("button",{type:"button",onClick:m,className:"btn btn-sm btn-primary",disabled:i,children:"Change"}),e.jsx("button",{type:"button",onClick:d,className:"btn btn-sm btn-danger",disabled:i,children:"Remove"})]})]}),e.jsx("div",{className:"image-info",children:e.jsx("p",{className:"image-url",children:r})})]}):e.jsx("div",{className:`upload-area ${n?"drag-over":""} ${i?"uploading":""}`,onDragOver:b,onDragLeave:N,onDrop:h,onClick:m,children:i?e.jsxs("div",{className:"upload-progress",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${x}%`}})}),e.jsxs("p",{children:["Uploading... ",x,"%"]})]}):e.jsxs("div",{className:"upload-content",children:[e.jsx("div",{className:"upload-icon",children:"📷"}),e.jsx("h3",{children:"Upload Featured Image"}),e.jsx("p",{children:"Drag and drop an image here, or click to browse"}),e.jsxs("p",{className:"upload-hint",children:["Supports JPG, PNG, WebP • Max ",Math.round(s/1024/1024),"MB"]})]})}),e.jsx("input",{ref:u,type:"file",accept:"image/*",onChange:f,style:{display:"none"}}),e.jsx("style",{jsx:"true",children:`
        .image-uploader {
          width: 100%;
        }

        .upload-area {
          border: 2px dashed #ced4da;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f8f9fa;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-area:hover {
          border-color: #1976d2;
          background: #f0f8ff;
        }

        .upload-area.drag-over {
          border-color: #1976d2;
          background: #e3f2fd;
          transform: scale(1.02);
        }

        .upload-area.uploading {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-content h3 {
          margin: 0;
          color: #212529;
          font-size: 1.25rem;
        }

        .upload-content p {
          margin: 0;
          color: #6c757d;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #adb5bd;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 300px;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #1976d2;
          transition: width 0.3s ease;
        }

        .current-image {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }

        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-preview:hover .image-overlay {
          opacity: 1;
        }

        .image-info {
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .image-url {
          margin: 0;
          font-size: 0.75rem;
          color: #6c757d;
          word-break: break-all;
          font-family: monospace;
        }

        .btn {
          padding: 0.375rem 0.75rem;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .btn-primary:hover:not(:disabled) {
          background: #1565c0;
          border-color: #1565c0;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
          border-color: #c82333;
        }

        @media (max-width: 768px) {
          .upload-area {
            padding: 1.5rem;
            min-height: 150px;
          }

          .upload-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }

          .upload-content h3 {
            font-size: 1rem;
          }

          .upload-content p {
            font-size: 0.875rem;
          }

          .image-preview img {
            height: 150px;
          }

          .image-overlay {
            flex-direction: column;
          }
        }
      `})]})},Ce=({data:r})=>{const o=t=>{if(!t)return"Not published";try{return new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}catch(n){return"Invalid date"}},s=a.useMemo(()=>{if(!r.content)return"";const t=document.createElement("div");return t.innerHTML=r.content,t.innerHTML},[r.content]),i=a.useMemo(()=>{if(r.excerpt)return r.excerpt;if(r.content){const t=document.createElement("div");t.innerHTML=r.content;const n=t.textContent||t.innerText||"";return n.substring(0,150)+(n.length>150?"...":"")}return"No excerpt available"},[r.content,r.excerpt]);return e.jsxs("div",{className:"post-preview",children:[e.jsxs("div",{className:"preview-header",children:[e.jsx("h1",{children:"Preview Mode"}),e.jsx("div",{className:"preview-status",children:e.jsx("span",{className:`status-badge status-${r.status||"draft"}`,children:r.status||"draft"})})]}),e.jsxs("article",{className:"preview-article",children:[r.featured_image_url&&e.jsx("div",{className:"featured-image",children:e.jsx("img",{src:r.featured_image_url,alt:r.title||"Featured image"})}),e.jsxs("header",{className:"post-header",children:[e.jsx("h1",{className:"post-title",children:r.title||"Untitled Post"}),e.jsxs("div",{className:"post-meta",children:[e.jsx("time",{className:"post-date",children:o(r.published_at||r.created_at)}),r.slug&&e.jsxs("div",{className:"post-url",children:[e.jsx("strong",{children:"URL:"})," /",r.slug]})]}),i&&e.jsx("div",{className:"post-excerpt",children:i})]}),e.jsx("div",{className:"post-content",children:s?e.jsx("div",{dangerouslySetInnerHTML:{__html:s}}):e.jsx("p",{className:"no-content",children:"No content available"})}),(r.meta_title||r.meta_description)&&e.jsxs("div",{className:"seo-preview",children:[e.jsx("h3",{children:"SEO Preview"}),e.jsxs("div",{className:"search-result-preview",children:[e.jsx("div",{className:"search-title",children:r.meta_title||r.title||"Untitled Post"}),e.jsxs("div",{className:"search-url",children:[window.location.origin,"/",r.slug||"untitled-post"]}),e.jsx("div",{className:"search-description",children:r.meta_description||i})]})]})]}),e.jsx("style",{jsx:"true",children:`
        .post-preview {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .preview-header h1 {
          margin: 0;
          color: #6c757d;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-published {
          background: #d4edda;
          color: #155724;
        }

        .status-private {
          background: #f8d7da;
          color: #721c24;
        }

        .preview-article {
          line-height: 1.6;
        }

        .featured-image {
          margin-bottom: 2rem;
          border-radius: 8px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .post-header {
          margin-bottom: 2rem;
        }

        .post-title {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: #212529;
        }

        .post-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .post-date {
          font-weight: 500;
        }

        .post-url {
          font-family: monospace;
          background: #f8f9fa;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .post-excerpt {
          font-size: 1.125rem;
          color: #6c757d;
          font-style: italic;
          margin-top: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-left: 4px solid #1976d2;
          border-radius: 4px;
        }

        .post-content {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #212529;
        }

        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4,
        .post-content h5,
        .post-content h6 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          line-height: 1.3;
        }

        .post-content h1 { font-size: 2rem; }
        .post-content h2 { font-size: 1.75rem; }
        .post-content h3 { font-size: 1.5rem; }
        .post-content h4 { font-size: 1.25rem; }
        .post-content h5 { font-size: 1.125rem; }
        .post-content h6 { font-size: 1rem; }

        .post-content p {
          margin-bottom: 1.5rem;
        }

        .post-content blockquote {
          margin: 2rem 0;
          padding: 1rem 2rem;
          border-left: 4px solid #1976d2;
          background: #f8f9fa;
          font-style: italic;
          border-radius: 4px;
        }

        .post-content ul,
        .post-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .post-content li {
          margin-bottom: 0.5rem;
        }

        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1rem 0;
        }

        .post-content code {
          background: #f8f9fa;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .post-content pre {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .post-content pre code {
          background: none;
          padding: 0;
        }

        .no-content {
          color: #6c757d;
          font-style: italic;
          text-align: center;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .seo-preview {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #e9ecef;
        }

        .seo-preview h3 {
          margin: 0 0 1rem 0;
          color: #495057;
          font-size: 1.125rem;
        }

        .search-result-preview {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .search-title {
          color: #1a0dab;
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
          text-decoration: underline;
        }

        .search-url {
          color: #006621;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .search-description {
          color: #545454;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* Hindi text support */
        .post-content,
        .post-title,
        .post-excerpt {
          font-family: "Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .post-preview {
            padding: 1rem;
          }

          .preview-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .post-title {
            font-size: 2rem;
          }

          .post-meta {
            font-size: 0.8rem;
          }

          .post-content {
            font-size: 1rem;
          }

          .post-content h1 { font-size: 1.75rem; }
          .post-content h2 { font-size: 1.5rem; }
          .post-content h3 { font-size: 1.25rem; }
        }

        /* Print styles */
        @media print {
          .preview-header {
            display: none;
          }

          .seo-preview {
            display: none;
          }

          .post-preview {
            padding: 0;
          }
        }
      `})]})},Ae=({initialData:r=null,onSave:o,onCancel:s,loading:i=!1,isEditing:t=!1})=>{const[n,g]=a.useState(!1),[x,c]=a.useState(!1),[u,p]=a.useState(null),[z,b]=a.useState(!1),{register:N,handleSubmit:h,watch:f,setValue:d,getValues:m,formState:{errors:l,isDirty:j},reset:F}=ne({defaultValues:{title:(r==null?void 0:r.title)||"",slug:(r==null?void 0:r.slug)||"",content:(r==null?void 0:r.content)||"",excerpt:(r==null?void 0:r.excerpt)||"",featured_image_url:(r==null?void 0:r.featured_image_url)||"",meta_title:(r==null?void 0:r.meta_title)||"",meta_description:(r==null?void 0:r.meta_description)||"",status:(r==null?void 0:r.status)||"draft"}}),I=f("title"),_=f("slug"),w=f("content");a.useEffect(()=>{if(I&&!t){const C=he(I);d("slug",C)}},[I,d,t]),a.useEffect(()=>{const P=setTimeout(()=>k(null,null,function*(){if(_&&_!==(r==null?void 0:r.slug)){b(!0);try{(yield ge(_,r==null?void 0:r.id))||S.error("This slug is already taken. Please choose a different one.")}catch(Z){}finally{b(!1)}}}),500);return()=>clearTimeout(P)},[_,r==null?void 0:r.slug,r==null?void 0:r.id]),a.useEffect(()=>{if(j&&(I||w)){const C=setTimeout(()=>k(null,null,function*(){yield q()}),3e4);return()=>clearTimeout(C)}},[j,I,w]);const q=()=>k(null,null,function*(){if(j){c(!0);try{const C=f();if(t&&(r!=null&&r.id))yield Y(r.id,y(v({},C),{status:"draft"}));else if(C.title||C.content){const P=yield Q(y(v({},C),{status:"draft"}));P&&!r&&window.history.replaceState(null,"",`/admin/edit/${P.id}`)}p(new Date)}catch(C){}finally{c(!1)}}}),R=C=>k(null,null,function*(){try{let P;return t?P=yield Y(r.id,C):P=yield Q(C),o(C,C.status==="draft"),P}catch(P){throw S.error("Failed to save post. Please try again."),P}}),T=()=>{d("status","draft"),h(R)()},L=()=>{d("status","published"),d("published_at",new Date().toISOString()),h(R)()},E=a.useCallback(C=>{d("content",C,{shouldDirty:!0})},[d]),B=a.useCallback(C=>{d("featured_image_url",C,{shouldDirty:!0})},[d]);return e.jsxs("div",{className:"post-editor",children:[e.jsxs("div",{className:"editor-header",children:[e.jsxs("div",{className:"editor-actions",children:[e.jsx("button",{type:"button",onClick:()=>g(!n),className:"btn btn-outline",children:n?"📝 Edit":"👁️ Preview"}),e.jsxs("div",{className:"save-status",children:[x&&e.jsx("span",{className:"auto-saving",children:"Auto-saving..."}),u&&!x&&e.jsxs("span",{className:"last-saved",children:["Saved ",u.toLocaleTimeString()]})]})]}),e.jsxs("div",{className:"primary-actions",children:[e.jsx("button",{type:"button",onClick:s,className:"btn btn-secondary",disabled:i,children:"Cancel"}),e.jsx("button",{type:"button",onClick:T,className:"btn btn-outline",disabled:i,children:i?"Saving...":"Save Draft"}),e.jsx("button",{type:"button",onClick:L,className:"btn btn-primary",disabled:i||!I,children:i?"Publishing...":"Publish"})]})]}),e.jsx("div",{className:"editor-content",children:n?e.jsx(Ce,{data:f()}):e.jsxs("form",{onSubmit:h(R),className:"post-form",children:[e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"title",children:"Title *"}),e.jsx("input",y(v({id:"title",type:"text"},N("title",{required:"Title is required",minLength:{value:3,message:"Title must be at least 3 characters"}})),{className:`form-control ${l.title?"error":""}`,placeholder:"Enter post title..."})),l.title&&e.jsx("span",{className:"error-message",children:l.title.message})]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"slug",children:["URL Slug *",z&&e.jsx("span",{className:"checking",children:"Checking..."})]}),e.jsxs("div",{className:"slug-input",children:[e.jsxs("span",{className:"slug-prefix",children:["/",window.location.host,"/"]}),e.jsx("input",y(v({id:"slug",type:"text"},N("slug",{required:"Slug is required",pattern:{value:/^[a-z0-9-]+$/,message:"Slug can only contain lowercase letters, numbers, and hyphens"}})),{className:`form-control ${l.slug?"error":""}`,placeholder:"post-url-slug"}))]}),l.slug&&e.jsx("span",{className:"error-message",children:l.slug.message})]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"excerpt",children:"Excerpt"}),e.jsx("textarea",y(v({id:"excerpt"},N("excerpt")),{className:"form-control",rows:"3",placeholder:"Brief description of the post..."}))]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Featured Image"}),e.jsx(Se,{currentImage:f("featured_image_url"),onImageUpload:B})]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"content",children:"Content"}),e.jsx(ke,{value:w,onChange:E,placeholder:"Write your post content here..."})]})}),e.jsxs("details",{className:"seo-section",children:[e.jsx("summary",{children:"SEO Settings"}),e.jsxs("div",{className:"seo-fields",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"meta_title",children:"Meta Title"}),e.jsx("input",y(v({id:"meta_title",type:"text"},N("meta_title")),{className:"form-control",placeholder:"SEO title (leave empty to use post title)"}))]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"meta_description",children:"Meta Description"}),e.jsx("textarea",y(v({id:"meta_description"},N("meta_description")),{className:"form-control",rows:"2",placeholder:"SEO description (leave empty to use excerpt)"}))]})]})]})]})}),e.jsx("style",{jsx:"true",children:`
        .post-editor {
          max-width: 100%;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px 8px 0 0;
          margin-bottom: 0;
        }

        .editor-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .save-status {
          font-size: 0.875rem;
          color: #6c757d;
        }

        .auto-saving {
          color: #ffc107;
        }

        .last-saved {
          color: #28a745;
        }

        .primary-actions {
          display: flex;
          gap: 0.5rem;
        }

        .editor-content {
          background: white;
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 600px;
        }

        .post-form {
          padding: 2rem;
        }

        .form-row {
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #212529;
        }

        .checking {
          color: #ffc107;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .form-control {
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-control:focus {
          outline: none;
          border-color: #1976d2;
          box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
        }

        .form-control.error {
          border-color: #dc3545;
        }

        .slug-input {
          display: flex;
          align-items: center;
          border: 1px solid #ced4da;
          border-radius: 4px;
          overflow: hidden;
        }

        .slug-prefix {
          background: #f8f9fa;
          padding: 0.75rem;
          color: #6c757d;
          font-size: 0.875rem;
          border-right: 1px solid #ced4da;
        }

        .slug-input input {
          border: none;
          flex: 1;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .seo-section {
          margin-top: 2rem;
          border: 1px solid #e9ecef;
          border-radius: 4px;
        }

        .seo-section summary {
          padding: 1rem;
          cursor: pointer;
          background: #f8f9fa;
          font-weight: 500;
        }

        .seo-fields {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1565c0;
          border-color: #1565c0;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
          border-color: #5a6268;
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border-color: #6c757d;
        }

        .btn-outline:hover:not(:disabled) {
          background: #6c757d;
          color: white;
        }

        @media (max-width: 768px) {
          .editor-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .primary-actions {
            justify-content: center;
          }

          .post-form {
            padding: 1rem;
          }

          .slug-input {
            flex-direction: column;
          }

          .slug-prefix {
            border-right: none;
            border-bottom: 1px solid #ced4da;
          }
        }
      `})]})},Ue=({selectedPosts:r,onActionComplete:o,onClearSelection:s})=>{const[i,t]=a.useState(!1),n=c=>k(null,null,function*(){if(r.length===0){S.error("Please select posts to perform bulk action");return}const u=x(c,r.length);if(confirm(u)){t(!0);try{let p;switch(c){case"publish":p=yield O(r,"published"),S.success(`${p} posts published successfully`);break;case"draft":p=yield O(r,"draft"),S.success(`${p} posts moved to draft`);break;case"private":p=yield O(r,"private"),S.success(`${p} posts made private`);break;case"delete":p=yield g(r),S.success(`${p} posts deleted successfully`);break;default:throw new Error("Invalid bulk action")}o(),s()}catch(p){S.error(`Failed to ${c} posts. Please try again.`)}finally{t(!1)}}}),g=c=>k(null,null,function*(){let u=0;for(const p of c)try{yield xe(p),u++}catch(z){}return u}),x=(c,u)=>{const p=u===1?"post":"posts";switch(c){case"publish":return`Are you sure you want to publish ${u} ${p}?`;case"draft":return`Are you sure you want to move ${u} ${p} to draft?`;case"private":return`Are you sure you want to make ${u} ${p} private?`;case"delete":return`Are you sure you want to delete ${u} ${p}? This action cannot be undone.`;default:return`Are you sure you want to perform this action on ${u} ${p}?`}};return r.length===0?null:e.jsxs("div",{className:"bulk-actions",children:[e.jsxs("div",{className:"bulk-info",children:[e.jsxs("span",{className:"selected-count",children:[r.length," post",r.length!==1?"s":""," selected"]}),e.jsx("button",{type:"button",onClick:s,className:"clear-selection",disabled:i,children:"Clear Selection"})]}),e.jsxs("div",{className:"bulk-buttons",children:[e.jsx("button",{type:"button",onClick:()=>n("publish"),className:"btn btn-sm btn-success",disabled:i,children:i?"Processing...":"Publish"}),e.jsx("button",{type:"button",onClick:()=>n("draft"),className:"btn btn-sm btn-warning",disabled:i,children:i?"Processing...":"Move to Draft"}),e.jsx("button",{type:"button",onClick:()=>n("private"),className:"btn btn-sm btn-secondary",disabled:i,children:i?"Processing...":"Make Private"}),e.jsx("button",{type:"button",onClick:()=>n("delete"),className:"btn btn-sm btn-danger",disabled:i,children:i?"Processing...":"Delete"})]}),e.jsx("style",{jsx:"true",children:`
        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .bulk-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .selected-count {
          font-weight: 500;
          color: #495057;
        }

        .clear-selection {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          text-decoration: underline;
          font-size: 0.875rem;
        }

        .clear-selection:hover:not(:disabled) {
          color: #495057;
        }

        .clear-selection:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bulk-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.375rem 0.75rem;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .btn-success {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .btn-success:hover:not(:disabled) {
          background: #218838;
          border-color: #218838;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
          border-color: #ffc107;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
          border-color: #e0a800;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
          border-color: #5a6268;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
          border-color: #c82333;
        }

        @media (max-width: 768px) {
          .bulk-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .bulk-info {
            justify-content: space-between;
          }

          .bulk-buttons {
            justify-content: center;
          }
        }
      `})]})},qe=({isVisible:r=!1})=>{const[o,s]=a.useState(null),[i,t]=a.useState(null),[n,g]=a.useState(null),[x,c]=a.useState(!1),[u,p]=a.useState("status");a.useEffect(()=>{r&&z()},[r]);const z=()=>{const h=fe(),f=be();s(h),t(f)},b=()=>k(null,null,function*(){c(!0);try{const h=yield je({includeUploadTest:!1,testImageUrl:null});g(h),p("tests")}catch(h){}finally{c(!1)}}),N=h=>{ve.switchProvider(h)&&z()};return r?e.jsxs("div",{className:"storage-debugger",children:[e.jsxs("div",{className:"debugger-header",children:[e.jsx("h3",{children:"🔧 Storage System Debugger"}),e.jsxs("div",{className:"debugger-tabs",children:[e.jsx("button",{className:u==="status"?"active":"",onClick:()=>p("status"),children:"Status"}),e.jsx("button",{className:u==="config"?"active":"",onClick:()=>p("config"),children:"Config"}),e.jsx("button",{className:u==="tests"?"active":"",onClick:()=>p("tests"),children:"Tests"})]})]}),e.jsxs("div",{className:"debugger-content",children:[u==="status"&&e.jsxs("div",{className:"status-tab",children:[e.jsxs("div",{className:"status-section",children:[e.jsx("h4",{children:"Current Status"}),o&&e.jsxs("div",{className:"status-info",children:[e.jsxs("div",{className:"status-item",children:[e.jsx("strong",{children:"Active Provider:"}),e.jsx("span",{className:`provider-badge ${o.current}`,children:o.current||"None"})]}),e.jsxs("div",{className:"status-item",children:[e.jsx("strong",{children:"Fallback Provider:"}),e.jsx("span",{className:"provider-badge",children:o.fallback||"None"})]})]})]}),e.jsxs("div",{className:"providers-section",children:[e.jsx("h4",{children:"Available Providers"}),o&&e.jsx("div",{className:"providers-list",children:Object.entries(o.providers).map(([h,f])=>e.jsxs("div",{className:`provider-item ${f.configured?"configured":"not-configured"}`,children:[e.jsxs("div",{className:"provider-info",children:[e.jsx("span",{className:"provider-name",children:h}),e.jsx("span",{className:`status-indicator ${f.configured?"configured":"not-configured"}`,children:f.configured?"✅ Configured":"❌ Not Configured"})]}),f.configured&&h!==o.current&&e.jsxs("button",{className:"switch-btn",onClick:()=>N(h),children:["Switch to ",h]})]},h))})]}),e.jsxs("div",{className:"actions-section",children:[e.jsx("button",{onClick:z,className:"refresh-btn",children:"🔄 Refresh Status"}),e.jsx("button",{onClick:b,className:"test-btn",disabled:x,children:x?"🧪 Running Tests...":"🧪 Run Tests"})]})]}),u==="config"&&e.jsxs("div",{className:"config-tab",children:[e.jsxs("div",{className:"validation-section",children:[e.jsx("h4",{children:"Configuration Validation"}),i&&e.jsxs("div",{className:`validation-result ${i.valid?"valid":"invalid"}`,children:[e.jsx("div",{className:"validation-status",children:i.valid?"✅ Valid Configuration":"❌ Configuration Issues"}),i.errors.length>0&&e.jsxs("div",{className:"validation-errors",children:[e.jsx("strong",{children:"Errors:"}),e.jsx("ul",{children:i.errors.map((h,f)=>e.jsx("li",{className:"error",children:h},f))})]}),i.warnings.length>0&&e.jsxs("div",{className:"validation-warnings",children:[e.jsx("strong",{children:"Warnings:"}),e.jsx("ul",{children:i.warnings.map((h,f)=>e.jsx("li",{className:"warning",children:h},f))})]}),e.jsx("div",{className:"validation-stats",children:e.jsxs("span",{children:["Configured Providers: ",i.configuredProviders,"/",i.totalProviders]})})]})]}),e.jsxs("div",{className:"env-vars-section",children:[e.jsx("h4",{children:"Environment Variables"}),e.jsxs("div",{className:"env-vars-info",children:[e.jsx("p",{children:"Check your environment variables for each provider:"}),e.jsxs("div",{className:"env-vars-list",children:[e.jsxs("div",{className:"env-var-group",children:[e.jsx("strong",{children:"Supabase:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"VITE_SUPABASE_URL"}),e.jsx("li",{children:"VITE_SUPABASE_ANON_KEY"})]})]}),e.jsxs("div",{className:"env-var-group",children:[e.jsx("strong",{children:"Cloudflare R2:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"VITE_CLOUDFLARE_ACCOUNT_ID"}),e.jsx("li",{children:"VITE_CLOUDFLARE_R2_ACCESS_KEY_ID"}),e.jsx("li",{children:"VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY"}),e.jsx("li",{children:"VITE_CLOUDFLARE_R2_BUCKET_NAME"}),e.jsx("li",{children:"VITE_CLOUDFLARE_R2_PUBLIC_URL"}),e.jsx("li",{children:"VITE_CLOUDFLARE_R2_ENDPOINT"})]})]}),e.jsxs("div",{className:"env-var-group",children:[e.jsx("strong",{children:"General:"}),e.jsx("ul",{children:e.jsx("li",{children:"VITE_STORAGE_PROVIDER (optional, defaults to 'supabase')"})})]})]})]})]})]}),u==="tests"&&e.jsxs("div",{className:"tests-tab",children:[e.jsxs("div",{className:"tests-header",children:[e.jsx("h4",{children:"Validation Tests"}),n&&e.jsxs("div",{className:`test-summary ${n.success?"success":"failure"}`,children:[n.passedTests,"/",n.totalTests," tests passed (",n.passRate,"%)"]})]}),n&&e.jsx("div",{className:"test-results",children:n.results.map((h,f)=>e.jsxs("div",{className:`test-result ${h.passed?"passed":"failed"}`,children:[e.jsxs("div",{className:"test-header",children:[e.jsx("span",{className:"test-status",children:h.passed?"✅":"❌"}),e.jsx("span",{className:"test-name",children:h.name})]}),e.jsx("div",{className:"test-message",children:h.message}),h.error&&e.jsxs("div",{className:"test-error",children:["Error: ",h.error]}),h.details&&e.jsxs("details",{className:"test-details",children:[e.jsx("summary",{children:"Details"}),e.jsx("pre",{children:JSON.stringify(h.details,null,2)})]})]},f))}),!n&&!x&&e.jsx("div",{className:"no-tests",children:e.jsx("p",{children:'No test results available. Click "Run Tests" to validate your storage setup.'})})]})]}),e.jsx("style",{jsx:"true",children:`
        .storage-debugger {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 400px;
          max-height: 80vh;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-size: 14px;
          overflow: hidden;
        }

        .debugger-header {
          background: #f8f9fa;
          padding: 12px 16px;
          border-bottom: 1px solid #ddd;
        }

        .debugger-header h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .debugger-tabs {
          display: flex;
          gap: 4px;
        }

        .debugger-tabs button {
          padding: 4px 8px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .debugger-tabs button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .debugger-content {
          padding: 16px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .status-section, .providers-section, .validation-section, .env-vars-section, .tests-header {
          margin-bottom: 16px;
        }

        .status-section h4, .providers-section h4, .validation-section h4, .env-vars-section h4, .tests-header h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #333;
        }

        .provider-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: bold;
          margin-left: 8px;
        }

        .provider-badge.supabase {
          background: #3ecf8e;
          color: white;
        }

        .provider-badge.cloudflare-r2 {
          background: #f38020;
          color: white;
        }

        .provider-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .provider-item.configured {
          background: #f8fff8;
          border-color: #d4edda;
        }

        .provider-item.not-configured {
          background: #fff8f8;
          border-color: #f5c6cb;
        }

        .status-indicator.configured {
          color: #28a745;
        }

        .status-indicator.not-configured {
          color: #dc3545;
        }

        .switch-btn {
          padding: 4px 8px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        }

        .actions-section {
          display: flex;
          gap: 8px;
        }

        .refresh-btn, .test-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .test-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .validation-result.valid {
          background: #f8fff8;
          border: 1px solid #d4edda;
          padding: 12px;
          border-radius: 4px;
        }

        .validation-result.invalid {
          background: #fff8f8;
          border: 1px solid #f5c6cb;
          padding: 12px;
          border-radius: 4px;
        }

        .validation-errors ul, .validation-warnings ul {
          margin: 4px 0;
          padding-left: 16px;
        }

        .validation-errors .error {
          color: #dc3545;
        }

        .validation-warnings .warning {
          color: #856404;
        }

        .env-vars-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .env-var-group ul {
          margin: 4px 0;
          padding-left: 16px;
          font-family: monospace;
          font-size: 11px;
        }

        .test-summary.success {
          color: #28a745;
          font-weight: bold;
        }

        .test-summary.failure {
          color: #dc3545;
          font-weight: bold;
        }

        .test-result {
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 8px;
        }

        .test-result.passed {
          background: #f8fff8;
          border-color: #d4edda;
        }

        .test-result.failed {
          background: #fff8f8;
          border-color: #f5c6cb;
        }

        .test-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .test-name {
          font-weight: bold;
        }

        .test-error {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
        }

        .test-details pre {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 3px;
          font-size: 10px;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .storage-debugger {
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            width: auto;
          }
        }
      `})]}):null},ze=()=>{var f,d;const[r,o]=a.useState(""),[s,i]=a.useState(""),[t,n]=a.useState(!1),[g,x]=a.useState(!1),{signIn:c,resetPassword:u}=X(),p=ie(),b=((d=(f=H().state)==null?void 0:f.from)==null?void 0:d.pathname)||"/admin/posts",N=m=>k(null,null,function*(){if(m.preventDefault(),!r||!s)return;n(!0);const{error:l}=yield c(r,s);l||p(b,{replace:!0}),n(!1)}),h=m=>k(null,null,function*(){if(m.preventDefault(),!r){alert("Please enter your email address first");return}yield u(r),x(!1)});return e.jsxs("div",{className:"login-container",children:[e.jsxs("div",{className:"login-card",children:[e.jsxs("div",{className:"login-header",children:[e.jsx("h1",{children:"Admin Login"}),e.jsx("p",{children:"Sign in to manage your blog"})]}),g?e.jsxs("form",{onSubmit:h,className:"login-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"reset-email",children:"Email"}),e.jsx("input",{id:"reset-email",type:"email",value:r,onChange:m=>o(m.target.value),placeholder:"Enter your email",required:!0})]}),e.jsx("button",{type:"submit",className:"login-button",disabled:!r,children:"Send Reset Email"}),e.jsx("button",{type:"button",className:"forgot-password-link",onClick:()=>x(!1),children:"Back to Login"})]}):e.jsxs("form",{onSubmit:N,className:"login-form",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsx("input",{id:"email",type:"email",value:r,onChange:m=>o(m.target.value),placeholder:"Enter your email",required:!0,disabled:t})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"password",children:"Password"}),e.jsx("input",{id:"password",type:"password",value:s,onChange:m=>i(m.target.value),placeholder:"Enter your password",required:!0,disabled:t})]}),e.jsx("button",{type:"submit",className:"login-button",disabled:t||!r||!s,children:t?"Signing in...":"Sign In"}),e.jsx("button",{type:"button",className:"forgot-password-link",onClick:()=>x(!0),disabled:t,children:"Forgot your password?"})]})]}),e.jsx("style",{jsx:!0,children:`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          margin: 0 0 0.5rem 0;
          color: #212529;
          font-size: 2rem;
          font-weight: 600;
        }

        .login-header p {
          margin: 0;
          color: #6c757d;
          font-size: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #212529;
          font-size: 0.9rem;
        }

        .form-group input {
          padding: 0.75rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .login-button {
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .forgot-password-link {
          background: none;
          border: none;
          color: #667eea;
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 0.5rem;
        }

        .forgot-password-link:hover:not(:disabled) {
          color: #764ba2;
        }

        .forgot-password-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `})]})},Fe=Object.freeze(Object.defineProperty({__proto__:null,default:ze},Symbol.toStringTag,{value:"Module"})),_e=({children:r})=>{const{user:o,loading:s}=X(),i=H();return s?e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"spinner"}),e.jsx("p",{children:"Checking authentication..."}),e.jsx("style",{jsx:!0,children:`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: #f8f9fa;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e9ecef;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          p {
            color: #6c757d;
            font-size: 1rem;
            margin: 0;
          }
        `})]}):o?r:e.jsx(ae,{to:"/admin/login",state:{from:i},replace:!0})},Le=Object.freeze(Object.defineProperty({__proto__:null,default:_e},Symbol.toStringTag,{value:"Module"}));export{Re as A,Ue as B,Te as F,ye as H,Fe as L,Ne as P,$ as S,Ae as a,qe as b,Le as c,X as u};
