var Y=Object.defineProperty,J=Object.defineProperties;var Z=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,ee=Object.prototype.propertyIsEnumerable;var O=(t,o,s)=>o in t?Y(t,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[o]=s,u=(t,o)=>{for(var s in o||(o={}))D.call(o,s)&&O(t,s,o[s]);if(H)for(var s of H(o))ee.call(o,s)&&O(t,s,o[s]);return t},h=(t,o)=>J(t,Z(o));var P=(t,o,s)=>new Promise((i,r)=>{var n=a=>{try{p(s.next(a))}catch(c){r(c)}},g=a=>{try{p(s.throw(a))}catch(c){r(c)}},p=a=>a.done?i(a.value):Promise.resolve(a.value).then(n,g);p((s=s.apply(t,o)).next())});import{r as l,u as te,j as e,L as R,R as re,V as k,a as se}from"./react-vendor-Ba7ko1lq.js";import{d as oe,g as V,a as W,f as ne,c as ie,s as K,b as ae,u as Q,e as G,v as le,h as M,i as de}from"./utils-BSH-sDAu.js";const ce=l.memo(({onSearch:t,searchQuery:o,setSearchQuery:s})=>{const i=te(),r=a=>!!(a==="/"&&i.pathname==="/"||a!=="/"&&i.pathname.startsWith(a)),n=l.useCallback(oe(a=>{t&&t(a)},300),[t]),g=a=>{const c=a.target.value;s(c),n(c)},p=()=>i.pathname.startsWith("/authors")?"Search Authors...":"Search...";return e.jsxs("div",{className:"header",children:[e.jsx(R,{to:"/",className:"logo",children:"SAYARI"}),e.jsxs("nav",{className:"nav",children:[e.jsx(R,{to:"/",className:`nav-item ${r("/")?"active":""}`,children:"All"}),e.jsx(R,{to:"/category/shayari",className:`nav-item ${r("/category/shayari")?"active":""}`,children:"Shayari"}),e.jsx(R,{to:"/category/quotes",className:`nav-item ${r("/category/quotes")?"active":""}`,children:"Quotes"}),e.jsx(R,{to:"/category/wishes",className:`nav-item ${r("/category/wishes")?"active":""}`,children:"Wishes"}),e.jsx(R,{to:"/authors",className:`nav-item ${r("/authors")?"active":""}`,children:"Authors"})]}),e.jsx("div",{className:"search-container",children:e.jsx("input",{type:"text",className:"search",placeholder:p(),value:o,onChange:g,autoComplete:"off",spellCheck:"false"})})]})});ce.displayName="Header";const be=()=>e.jsx("div",{className:"footer",children:e.jsxs("div",{className:"footer-content",children:[e.jsx("p",{children:"© 2025 Sayari Blog. All rights reserved."}),e.jsx("p",{style:{marginTop:"10px",fontSize:"12px",color:"#999"},children:"A collection of beautiful Hindi Shayari, Quotes, and Wishes"})]})}),T=l.memo(({type:t="post",count:o=1,className:s="",style:i={}})=>{const r=u({backgroundColor:"#f0f0f0",borderRadius:"4px",position:"relative",overflow:"hidden"},i),n={position:"absolute",top:0,left:"-100%",width:"100%",height:"100%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",animation:"shimmer 1.5s infinite"},g=()=>e.jsxs("div",{className:`skeleton-post ${s}`,style:{marginBottom:"20px"},children:[e.jsx("div",{style:h(u({},r),{width:"100%",height:"200px",marginBottom:"15px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:h(u({},r),{width:"80%",height:"24px",marginBottom:"10px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:h(u({},r),{width:"100%",height:"16px",marginBottom:"8px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:h(u({},r),{width:"90%",height:"16px",marginBottom:"8px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:h(u({},r),{width:"70%",height:"16px",marginBottom:"15px"}),children:e.jsx("div",{style:n})}),e.jsxs("div",{style:{display:"flex",gap:"15px"},children:[e.jsx("div",{style:h(u({},r),{width:"80px",height:"14px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:h(u({},r),{width:"100px",height:"14px"}),children:e.jsx("div",{style:n})})]})]}),p=()=>e.jsx("div",{className:`skeleton-author ${s}`,style:{marginBottom:"15px"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"15px"},children:[e.jsx("div",{style:h(u({},r),{width:"50px",height:"50px",borderRadius:"50%"}),children:e.jsx("div",{style:n})}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:h(u({},r),{width:"150px",height:"18px",marginBottom:"5px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:h(u({},r),{width:"200px",height:"14px"}),children:e.jsx("div",{style:n})})]})]})}),a=()=>e.jsx("div",{className:`skeleton-header ${s}`,style:{marginBottom:"30px"},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("div",{style:h(u({},r),{width:"120px",height:"32px"}),children:e.jsx("div",{style:n})}),e.jsx("div",{style:{display:"flex",gap:"20px"},children:[1,2,3,4,5].map(x=>e.jsx("div",{style:h(u({},r),{width:"60px",height:"20px"}),children:e.jsx("div",{style:n})},x))}),e.jsx("div",{style:h(u({},r),{width:"200px",height:"36px"}),children:e.jsx("div",{style:n})})]})}),c=({lines:x=3,width:y="100%"})=>e.jsx("div",{className:`skeleton-text ${s}`,children:Array.from({length:x}).map((_,w)=>e.jsx("div",{style:h(u({},r),{width:w===x-1?"70%":y,height:"16px",marginBottom:"8px"}),children:e.jsx("div",{style:n})},w))}),d=({width:x="100%",height:y="200px"})=>e.jsx("div",{className:`skeleton-image ${s}`,style:h(u({},r),{width:x,height:y}),children:e.jsx("div",{style:n})}),$=()=>{switch(t){case"post":return e.jsx(g,{});case"author":return e.jsx(p,{});case"header":return e.jsx(a,{});case"text":return e.jsx(c,{});case"image":return e.jsx(d,{});default:return e.jsx(g,{})}};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}),e.jsx("div",{className:`skeleton-loader ${s}`,children:Array.from({length:o}).map((x,y)=>e.jsx("div",{children:$()},y))})]})});T.displayName="SkeletonLoader";l.memo(()=>e.jsx(T,{type:"post",count:1}));l.memo(()=>e.jsx(T,{type:"author",count:1}));l.memo(()=>e.jsx(T,{type:"header",count:1}));l.memo(({lines:t=3})=>e.jsx(T,{type:"text",lines:t}));l.memo(({width:t,height:o})=>e.jsx(T,{type:"image",width:t,height:o}));const U=l.memo(({src:t,alt:o,width:s,height:i,className:r="",style:n={},lazy:g=!0,priority:p=!1,sizes:a="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",aspectRatio:c=null})=>{const[d,$]=l.useState(!1),[x,y]=l.useState(!g||p),[_,w]=l.useState(!1),j=l.useRef(null),B=l.useRef(null);l.useEffect(()=>{if(!g||p||x)return;const v=new IntersectionObserver(C=>{C.forEach(z=>{z.isIntersecting&&(y(!0),v.disconnect())})},{rootMargin:"50px",threshold:.1});return j.current&&(v.observe(j.current),B.current=v),()=>{B.current&&B.current.disconnect()}},[g,p,x]);const m=(v,C,z=80)=>{if(!v)return null;if(v.includes("supabase.co/storage/v1/object/public/"))try{const N=new URL(v);return N.searchParams.set("width",C.toString()),N.searchParams.set("quality",z.toString()),N.searchParams.set("format","webp"),N.toString()}catch(N){return v}return v},b=(v,C="original")=>v?[320,480,640,768,1024,1280,1920].filter(E=>!s||E<=s*2).map(E=>{let A=m(v,E);if(C==="webp")if(A.includes("supabase.co/storage/v1/object/public/"))try{const F=new URL(A);F.searchParams.set("format","webp"),A=F.toString()}catch(F){}else A=A.replace(/\.(jpg|jpeg|png)$/i,".webp");return`${A} ${E}w`}).join(", "):"",L=()=>{$(!0)},I=()=>{w(!0)},S=e.jsx("div",{className:`image-placeholder ${r}`,style:h(u({},n),{backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"}),ref:j,children:_?"Failed to load":"Loading..."});return!x||_?S:e.jsxs("div",{className:`optimized-image-container ${r}`,style:n,ref:j,children:[e.jsxs("picture",{children:[e.jsx("source",{srcSet:b(t,"webp"),sizes:a,type:"image/webp"}),e.jsx("img",{src:m(t,s),srcSet:b(t),sizes:a,alt:o,width:s,height:i,loading:g&&!p?"lazy":"eager",fetchPriority:p?"high":"auto",decoding:"async",onLoad:L,onError:I,style:{width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.3s ease",opacity:d?1:0,display:"block"}})]}),!d&&e.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"},children:e.jsx("div",{style:{width:"16px",height:"16px",border:"2px solid #f3f3f3",borderTop:"2px solid #333",borderRadius:"50%",animation:"spin 1s linear infinite"}})})]})},(t,o)=>t.src===o.src&&t.width===o.width&&t.height===o.height&&t.lazy===o.lazy&&t.priority===o.priority);U.displayName="OptimizedImage";const me=l.memo(({post:t,featured:o=!1,priority:s=!1})=>{const i=()=>"Admin";if(o){const n=V(t.content,t.featured_image_url);return e.jsxs(R,{to:`/${t.slug}`,className:"featured",children:[n&&e.jsx("div",{className:"featured-image",children:e.jsx(U,{src:n,alt:t.title,width:800,height:200,priority:s||o,style:{borderRadius:"8px",marginBottom:"15px"}})}),e.jsx("div",{className:"featured-title",children:t.title}),e.jsx("div",{className:"featured-content",children:W(t.content,200)}),e.jsxs("div",{className:"featured-author",children:["By ",i()]})]})}const r=V(t.content,t.featured_image_url);return e.jsxs(R,{to:`/${t.slug}`,className:"poem-card",children:[r&&e.jsx("div",{className:"poem-image",children:e.jsx(U,{src:r,alt:t.title,width:400,height:150,lazy:!s,priority:s,style:{borderRadius:"8px",marginBottom:"10px"}})}),e.jsx("div",{className:"poem-title",children:t.title}),e.jsx("div",{className:"poem-preview",children:W(t.content)}),e.jsxs("div",{className:"poem-meta",children:[e.jsxs("div",{className:"author",children:["By ",i()]}),e.jsx("div",{className:"date",children:ne(t.published_at)})]})]})},(t,o)=>t.post.id===o.post.id&&t.featured===o.featured&&t.priority===o.priority);me.displayName="PostCard";const ue=({value:t,onChange:o,placeholder:s="Start writing..."})=>{const i=l.useRef(null),[r,n]=l.useState(t||"");l.useEffect(()=>{n(t||"")},[t]);const g=(d,$,x,y)=>{n(d),o(d)},p={toolbar:{container:[[{header:[1,2,3,!1]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{align:[]}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],["blockquote","code-block"],["link","image"],["clean"],["center-text","hindi-format"]],handlers:{"center-text":function(){this.quill.getSelection()&&this.quill.format("align","center")},"hindi-format":function(){this.quill.getSelection()&&(this.quill.format("align","center"),this.quill.format("size","large"))}}},clipboard:{matchVisual:!1}},a=["header","font","size","bold","italic","underline","strike","blockquote","list","bullet","indent","link","image","video","align","color","background","code-block"],c={minHeight:"400px",fontFamily:'"Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif'};return e.jsxs("div",{className:"rich-text-editor",children:[e.jsx(re,{ref:i,theme:"snow",value:r,onChange:g,modules:p,formats:a,placeholder:s,style:c}),e.jsx("div",{className:"editor-help",children:e.jsxs("details",{children:[e.jsx("summary",{children:"Formatting Tips"}),e.jsxs("div",{className:"help-content",children:[e.jsx("h4",{children:"For Hindi Shayari:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Center Text:"})," Use the center alignment button for verses"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Line Breaks:"})," Press Shift+Enter for line breaks within verses"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Stanza Breaks:"})," Press Enter twice for stanza separation"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Emphasis:"})," Use bold or italic for emphasis"]})]}),e.jsx("h4",{children:"Keyboard Shortcuts:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+B"})," - Bold"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+I"})," - Italic"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+U"})," - Underline"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+Shift+C"})," - Center align"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+Z"})," - Undo"]}),e.jsxs("li",{children:[e.jsx("kbd",{children:"Ctrl+Y"})," - Redo"]})]})]})]})}),e.jsx("style",{jsx:!0,global:!0,children:`
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
      `})]})},he=({currentImage:t,onImageUpload:o,maxSize:s=5*1024*1024})=>{const[i,r]=l.useState(!1),[n,g]=l.useState(!1),[p,a]=l.useState(0),c=l.useRef(null),d=l.useCallback(m=>P(null,null,function*(){if(!m||m.length===0)return;const b=m[0];if(!b.type.startsWith("image/")){k.error("Please select an image file");return}if(b.size>s){k.error(`Image size must be less than ${Math.round(s/1024/1024)}MB`);return}yield $(b)}),[s]),$=m=>P(null,null,function*(){r(!0),a(0);try{const b=yield ie(m,{maxWidth:1200,maxHeight:800,quality:.8}),L=m.name.split(".").pop(),S=`blog-images/${`${Date.now()}-${Math.random().toString(36).substring(2)}.${L}`}`,{data:v,error:C}=yield K.storage.from("images").upload(S,b,{cacheControl:"3600",upsert:!1,onUploadProgress:N=>{a(Math.round(N.loaded/N.total*100))}});if(C)throw C;const{data:{publicUrl:z}}=K.storage.from("images").getPublicUrl(S);o(z),k.success("Image uploaded successfully!")}catch(b){k.error("Failed to upload image. Please try again.")}finally{r(!1),a(0)}}),x=m=>{m.preventDefault(),g(!0)},y=m=>{m.preventDefault(),g(!1)},_=m=>{m.preventDefault(),g(!1);const b=Array.from(m.dataTransfer.files);d(b)},w=m=>{const b=Array.from(m.target.files);d(b)},j=()=>{o(""),c.current&&(c.current.value="")},B=()=>{var m;(m=c.current)==null||m.click()};return e.jsxs("div",{className:"image-uploader",children:[t?e.jsxs("div",{className:"current-image",children:[e.jsxs("div",{className:"image-preview",children:[e.jsx("img",{src:t,alt:"Featured"}),e.jsxs("div",{className:"image-overlay",children:[e.jsx("button",{type:"button",onClick:B,className:"btn btn-sm btn-primary",disabled:i,children:"Change"}),e.jsx("button",{type:"button",onClick:j,className:"btn btn-sm btn-danger",disabled:i,children:"Remove"})]})]}),e.jsx("div",{className:"image-info",children:e.jsx("p",{className:"image-url",children:t})})]}):e.jsx("div",{className:`upload-area ${n?"drag-over":""} ${i?"uploading":""}`,onDragOver:x,onDragLeave:y,onDrop:_,onClick:B,children:i?e.jsxs("div",{className:"upload-progress",children:[e.jsx("div",{className:"progress-bar",children:e.jsx("div",{className:"progress-fill",style:{width:`${p}%`}})}),e.jsxs("p",{children:["Uploading... ",p,"%"]})]}):e.jsxs("div",{className:"upload-content",children:[e.jsx("div",{className:"upload-icon",children:"📷"}),e.jsx("h3",{children:"Upload Featured Image"}),e.jsx("p",{children:"Drag and drop an image here, or click to browse"}),e.jsxs("p",{className:"upload-hint",children:["Supports JPG, PNG, WebP • Max ",Math.round(s/1024/1024),"MB"]})]})}),e.jsx("input",{ref:c,type:"file",accept:"image/*",onChange:w,style:{display:"none"}}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},pe=({data:t})=>{const o=r=>{if(!r)return"Not published";try{return new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}catch(n){return"Invalid date"}},s=l.useMemo(()=>{if(!t.content)return"";const r=document.createElement("div");return r.innerHTML=t.content,r.innerHTML},[t.content]),i=l.useMemo(()=>{if(t.excerpt)return t.excerpt;if(t.content){const r=document.createElement("div");r.innerHTML=t.content;const n=r.textContent||r.innerText||"";return n.substring(0,150)+(n.length>150?"...":"")}return"No excerpt available"},[t.content,t.excerpt]);return e.jsxs("div",{className:"post-preview",children:[e.jsxs("div",{className:"preview-header",children:[e.jsx("h1",{children:"Preview Mode"}),e.jsx("div",{className:"preview-status",children:e.jsx("span",{className:`status-badge status-${t.status||"draft"}`,children:t.status||"draft"})})]}),e.jsxs("article",{className:"preview-article",children:[t.featured_image_url&&e.jsx("div",{className:"featured-image",children:e.jsx("img",{src:t.featured_image_url,alt:t.title||"Featured image"})}),e.jsxs("header",{className:"post-header",children:[e.jsx("h1",{className:"post-title",children:t.title||"Untitled Post"}),e.jsxs("div",{className:"post-meta",children:[e.jsx("time",{className:"post-date",children:o(t.published_at||t.created_at)}),t.slug&&e.jsxs("div",{className:"post-url",children:[e.jsx("strong",{children:"URL:"})," /",t.slug]})]}),i&&e.jsx("div",{className:"post-excerpt",children:i})]}),e.jsx("div",{className:"post-content",children:s?e.jsx("div",{dangerouslySetInnerHTML:{__html:s}}):e.jsx("p",{className:"no-content",children:"No content available"})}),(t.meta_title||t.meta_description)&&e.jsxs("div",{className:"seo-preview",children:[e.jsx("h3",{children:"SEO Preview"}),e.jsxs("div",{className:"search-result-preview",children:[e.jsx("div",{className:"search-title",children:t.meta_title||t.title||"Untitled Post"}),e.jsxs("div",{className:"search-url",children:[window.location.origin,"/",t.slug||"untitled-post"]}),e.jsx("div",{className:"search-description",children:t.meta_description||i})]})]})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},ve=({initialData:t=null,onSave:o,onCancel:s,loading:i=!1,isEditing:r=!1})=>{const[n,g]=l.useState(!1),[p,a]=l.useState(!1),[c,d]=l.useState(null),[$,x]=l.useState(!1),{register:y,handleSubmit:_,watch:w,setValue:j,getValues:B,formState:{errors:m,isDirty:b},reset:L}=se({defaultValues:{title:(t==null?void 0:t.title)||"",slug:(t==null?void 0:t.slug)||"",content:(t==null?void 0:t.content)||"",excerpt:(t==null?void 0:t.excerpt)||"",featured_image_url:(t==null?void 0:t.featured_image_url)||"",meta_title:(t==null?void 0:t.meta_title)||"",meta_description:(t==null?void 0:t.meta_description)||"",status:(t==null?void 0:t.status)||"draft"}}),I=w("title"),S=w("slug"),v=w("content");l.useEffect(()=>{if(I&&!r){const f=ae(I);j("slug",f)}},[I,j,r]),l.useEffect(()=>{const q=setTimeout(()=>P(null,null,function*(){if(S&&S!==(t==null?void 0:t.slug)){x(!0);try{(yield le(S,t==null?void 0:t.id))||k.error("This slug is already taken. Please choose a different one.")}catch(X){}finally{x(!1)}}}),500);return()=>clearTimeout(q)},[S,t==null?void 0:t.slug,t==null?void 0:t.id]),l.useEffect(()=>{if(b&&(I||v)){const f=setTimeout(()=>P(null,null,function*(){yield C()}),3e4);return()=>clearTimeout(f)}},[b,I,v]);const C=()=>P(null,null,function*(){if(b){a(!0);try{const f=w();if(r&&(t!=null&&t.id))yield Q(t.id,h(u({},f),{status:"draft"}));else if(f.title||f.content){const q=yield G(h(u({},f),{status:"draft"}));q&&!t&&window.history.replaceState(null,"",`/admin/edit/${q.id}`)}d(new Date)}catch(f){}finally{a(!1)}}}),z=f=>P(null,null,function*(){try{let q;return r?q=yield Q(t.id,f):q=yield G(f),o(f,f.status==="draft"),q}catch(q){throw k.error("Failed to save post. Please try again."),q}}),N=()=>{j("status","draft"),_(z)()},E=()=>{j("status","published"),j("published_at",new Date().toISOString()),_(z)()},A=l.useCallback(f=>{j("content",f,{shouldDirty:!0})},[j]),F=l.useCallback(f=>{j("featured_image_url",f,{shouldDirty:!0})},[j]);return e.jsxs("div",{className:"post-editor",children:[e.jsxs("div",{className:"editor-header",children:[e.jsxs("div",{className:"editor-actions",children:[e.jsx("button",{type:"button",onClick:()=>g(!n),className:"btn btn-outline",children:n?"📝 Edit":"👁️ Preview"}),e.jsxs("div",{className:"save-status",children:[p&&e.jsx("span",{className:"auto-saving",children:"Auto-saving..."}),c&&!p&&e.jsxs("span",{className:"last-saved",children:["Saved ",c.toLocaleTimeString()]})]})]}),e.jsxs("div",{className:"primary-actions",children:[e.jsx("button",{type:"button",onClick:s,className:"btn btn-secondary",disabled:i,children:"Cancel"}),e.jsx("button",{type:"button",onClick:N,className:"btn btn-outline",disabled:i,children:i?"Saving...":"Save Draft"}),e.jsx("button",{type:"button",onClick:E,className:"btn btn-primary",disabled:i||!I,children:i?"Publishing...":"Publish"})]})]}),e.jsx("div",{className:"editor-content",children:n?e.jsx(pe,{data:w()}):e.jsxs("form",{onSubmit:_(z),className:"post-form",children:[e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"title",children:"Title *"}),e.jsx("input",h(u({id:"title",type:"text"},y("title",{required:"Title is required",minLength:{value:3,message:"Title must be at least 3 characters"}})),{className:`form-control ${m.title?"error":""}`,placeholder:"Enter post title..."})),m.title&&e.jsx("span",{className:"error-message",children:m.title.message})]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"slug",children:["URL Slug *",$&&e.jsx("span",{className:"checking",children:"Checking..."})]}),e.jsxs("div",{className:"slug-input",children:[e.jsxs("span",{className:"slug-prefix",children:["/",window.location.host,"/"]}),e.jsx("input",h(u({id:"slug",type:"text"},y("slug",{required:"Slug is required",pattern:{value:/^[a-z0-9-]+$/,message:"Slug can only contain lowercase letters, numbers, and hyphens"}})),{className:`form-control ${m.slug?"error":""}`,placeholder:"post-url-slug"}))]}),m.slug&&e.jsx("span",{className:"error-message",children:m.slug.message})]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"excerpt",children:"Excerpt"}),e.jsx("textarea",h(u({id:"excerpt"},y("excerpt")),{className:"form-control",rows:"3",placeholder:"Brief description of the post..."}))]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Featured Image"}),e.jsx(he,{currentImage:w("featured_image_url"),onImageUpload:F})]})}),e.jsx("div",{className:"form-row",children:e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"content",children:"Content"}),e.jsx(ue,{value:v,onChange:A,placeholder:"Write your post content here..."})]})}),e.jsxs("details",{className:"seo-section",children:[e.jsx("summary",{children:"SEO Settings"}),e.jsxs("div",{className:"seo-fields",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"meta_title",children:"Meta Title"}),e.jsx("input",h(u({id:"meta_title",type:"text"},y("meta_title")),{className:"form-control",placeholder:"SEO title (leave empty to use post title)"}))]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"meta_description",children:"Meta Description"}),e.jsx("textarea",h(u({id:"meta_description"},y("meta_description")),{className:"form-control",rows:"2",placeholder:"SEO description (leave empty to use excerpt)"}))]})]})]})]})}),e.jsx("style",{jsx:!0,children:`
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
      `})]})},ye=({selectedPosts:t,onActionComplete:o,onClearSelection:s})=>{const[i,r]=l.useState(!1),n=a=>P(null,null,function*(){if(t.length===0){k.error("Please select posts to perform bulk action");return}const c=p(a,t.length);if(confirm(c)){r(!0);try{let d;switch(a){case"publish":d=yield M(t,"published"),k.success(`${d} posts published successfully`);break;case"draft":d=yield M(t,"draft"),k.success(`${d} posts moved to draft`);break;case"private":d=yield M(t,"private"),k.success(`${d} posts made private`);break;case"delete":d=yield g(t),k.success(`${d} posts deleted successfully`);break;default:throw new Error("Invalid bulk action")}o(),s()}catch(d){k.error(`Failed to ${a} posts. Please try again.`)}finally{r(!1)}}}),g=a=>P(null,null,function*(){let c=0;for(const d of a)try{yield de(d),c++}catch($){}return c}),p=(a,c)=>{const d=c===1?"post":"posts";switch(a){case"publish":return`Are you sure you want to publish ${c} ${d}?`;case"draft":return`Are you sure you want to move ${c} ${d} to draft?`;case"private":return`Are you sure you want to make ${c} ${d} private?`;case"delete":return`Are you sure you want to delete ${c} ${d}? This action cannot be undone.`;default:return`Are you sure you want to perform this action on ${c} ${d}?`}};return t.length===0?null:e.jsxs("div",{className:"bulk-actions",children:[e.jsxs("div",{className:"bulk-info",children:[e.jsxs("span",{className:"selected-count",children:[t.length," post",t.length!==1?"s":""," selected"]}),e.jsx("button",{type:"button",onClick:s,className:"clear-selection",disabled:i,children:"Clear Selection"})]}),e.jsxs("div",{className:"bulk-buttons",children:[e.jsx("button",{type:"button",onClick:()=>n("publish"),className:"btn btn-sm btn-success",disabled:i,children:i?"Processing...":"Publish"}),e.jsx("button",{type:"button",onClick:()=>n("draft"),className:"btn btn-sm btn-warning",disabled:i,children:i?"Processing...":"Move to Draft"}),e.jsx("button",{type:"button",onClick:()=>n("private"),className:"btn btn-sm btn-secondary",disabled:i,children:i?"Processing...":"Make Private"}),e.jsx("button",{type:"button",onClick:()=>n("delete"),className:"btn btn-sm btn-danger",disabled:i,children:i?"Processing...":"Delete"})]}),e.jsx("style",{jsx:!0,children:`
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
      `})]})};export{ye as B,be as F,ce as H,me as P,T as S,ve as a};
