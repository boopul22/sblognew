var Z=Object.defineProperty,ee=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var W=(s,i,o)=>i in s?Z(s,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[i]=o,x=(s,i)=>{for(var o in i||(i={}))re.call(i,o)&&W(s,o,i[o]);if(H)for(var o of H(i))oe.call(i,o)&&W(s,o,i[o]);return s},h=(s,i)=>ee(s,se(i));var j=(s,i,o)=>new Promise((t,r)=>{var n=m=>{try{N(o.next(m))}catch(d){r(d)}},f=m=>{try{N(o.throw(m))}catch(d){r(d)}},N=m=>m.done?t(m.value):Promise.resolve(m.value).then(n,f);N((o=o.apply(s,i)).next())});import{r as l,V as y,j as e,u as M,L as R,R as ie,a as ne,b as te,N as le}from"./react-vendor-QWuLYCV5.js";import{s as I,d as ae,g as ue,a as B,n as me,b as K,f as de,c as ce,u as pe,e as be,h as G,i as Y,v as fe,j as $,k as Ne,l as ge,m as ve,o as xe,p as ke}from"./utils-AGEL3kgC.js";const Q=l.createContext({}),J=()=>{const s=l.useContext(Q);if(!s)throw new Error("useAuth must be used within an AuthProvider");return s},Le=({children:s})=>{const[i,o]=l.useState(null),[t,r]=l.useState(!0),[n,f]=l.useState(null);l.useEffect(()=>{I.auth.getSession().then(({data:{session:c}})=>{var a;f(c),o((a=c==null?void 0:c.user)!=null?a:null),r(!1)});const{data:{subscription:u}}=I.auth.onAuthStateChange((c,a)=>j(null,null,function*(){var k;f(a),o((k=a==null?void 0:a.user)!=null?k:null),r(!1),c==="SIGNED_IN"?y.success("Successfully signed in!"):c==="SIGNED_OUT"&&y.success("Successfully signed out!")}));return()=>u.unsubscribe()},[]);const N=(u,c)=>j(null,null,function*(){try{r(!0);const{data:a,error:k}=yield I.auth.signInWithPassword({email:u,password:c});if(k)throw k;return{data:a,error:null}}catch(a){return y.error(a.message||"Failed to sign in"),{data:null,error:a}}finally{r(!1)}}),m=()=>j(null,null,function*(){try{r(!0);const{error:u}=yield I.auth.signOut();if(u)throw u}catch(u){y.error(u.message||"Failed to sign out")}finally{r(!1)}}),d=(k,z,...S)=>j(null,[k,z,...S],function*(u,c,a={}){try{r(!0);const{data:V,error:E}=yield I.auth.signUp({email:u,password:c,options:{data:a}});if(E)throw E;return{data:V,error:null}}catch(V){return y.error(V.message||"Failed to sign up"),{data:null,error:V}}finally{r(!1)}}),p=u=>j(null,null,function*(){try{const{data:c,error:a}=yield I.auth.resetPasswordForEmail(u,{redirectTo:`${window.location.origin}/admin/reset-password`});if(a)throw a;return y.success("Password reset email sent!"),{data:c,error:null}}catch(c){return y.error(c.message||"Failed to send reset email"),{data:null,error:c}}}),U=u=>j(null,null,function*(){try{const{data:c,error:a}=yield I.auth.updateUser({password:u});if(a)throw a;return y.success("Password updated successfully!"),{data:c,error:null}}catch(c){return y.error(c.message||"Failed to update password"),{data:null,error:c}}}),v=()=>j(null,null,function*(){if(!i)return null;try{const{data:u,error:c}=yield I.from("users").select("*").eq("id",i.id).single();if(c)throw c;return u}catch(u){return null}}),g={user:i,session:n,loading:t,signIn:N,signOut:m,signUp:d,resetPassword:p,updatePassword:U,getUserProfile:v,isAdmin:()=>j(null,null,function*(){const u=yield v();return(u==null?void 0:u.role)==="admin"}),isEditor:()=>j(null,null,function*(){const u=yield v();return(u==null?void 0:u.role)==="editor"||(u==null?void 0:u.role)==="admin"})};return e.jsxDEV(Q.Provider,{value:g,children:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/contexts/AuthContext.jsx",lineNumber:192,columnNumber:5},void 0)},he=l.memo(({onSearch:s,searchQuery:i,setSearchQuery:o})=>{const t=M(),r=m=>!!(m==="/"&&t.pathname==="/"||m!=="/"&&t.pathname.startsWith(m)),n=l.useCallback(ae(m=>{s&&s(m)},300),[s]),f=m=>{const d=m.target.value;o(d),n(d)},N=()=>t.pathname.startsWith("/authors")?"Search Authors...":"Search...";return e.jsxDEV("div",{className:"header",children:[e.jsxDEV(R,{to:"/",className:"logo",children:"SAYARI"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:37,columnNumber:7},void 0),e.jsxDEV("nav",{className:"nav",children:[e.jsxDEV(R,{to:"/",className:`nav-item ${r("/")?"active":""}`,children:"All"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:42,columnNumber:9},void 0),e.jsxDEV(R,{to:"/category/shayari",className:`nav-item ${r("/category/shayari")?"active":""}`,children:"Shayari"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:48,columnNumber:9},void 0),e.jsxDEV(R,{to:"/category/quotes",className:`nav-item ${r("/category/quotes")?"active":""}`,children:"Quotes"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:54,columnNumber:9},void 0),e.jsxDEV(R,{to:"/category/wishes",className:`nav-item ${r("/category/wishes")?"active":""}`,children:"Wishes"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:60,columnNumber:9},void 0),e.jsxDEV(R,{to:"/authors",className:`nav-item ${r("/authors")?"active":""}`,children:"Authors"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:66,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:41,columnNumber:7},void 0),e.jsxDEV("div",{className:"search-container",children:e.jsxDEV("input",{type:"text",className:"search",placeholder:N(),value:i,onChange:f,autoComplete:"off",spellCheck:"false"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:75,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:74,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:36,columnNumber:5},void 0)});he.displayName="Header";const Ce=()=>e.jsxDEV("div",{className:"footer",children:e.jsxDEV("div",{className:"footer-content",children:[e.jsxDEV("p",{children:"© 2025 Sayari Blog. All rights reserved."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:5,columnNumber:9},void 0),e.jsxDEV("p",{style:{marginTop:"10px",fontSize:"12px",color:"#999"},children:"A collection of beautiful Hindi Shayari, Quotes, and Wishes"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:6,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:4,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:3,columnNumber:5},void 0),A=l.memo(({type:s="post",count:i=1,className:o="",style:t={}})=>{const r=x({backgroundColor:"#f0f0f0",borderRadius:"4px",position:"relative",overflow:"hidden"},t),n={position:"absolute",top:0,left:"-100%",width:"100%",height:"100%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",animation:"shimmer 1.5s infinite"},f=()=>e.jsxDEV("div",{className:`skeleton-post ${o}`,style:{marginBottom:"20px"},children:[e.jsxDEV("div",{style:h(x({},r),{width:"100%",height:"200px",marginBottom:"15px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:35,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:34,columnNumber:7},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"80%",height:"24px",marginBottom:"10px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:40,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:39,columnNumber:7},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"100%",height:"16px",marginBottom:"8px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:45,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:44,columnNumber:7},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"90%",height:"16px",marginBottom:"8px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:48,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:47,columnNumber:7},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"70%",height:"16px",marginBottom:"15px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:51,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:50,columnNumber:7},void 0),e.jsxDEV("div",{style:{display:"flex",gap:"15px"},children:[e.jsxDEV("div",{style:h(x({},r),{width:"80px",height:"14px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:57,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:56,columnNumber:9},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"100px",height:"14px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:60,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:59,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:55,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:32,columnNumber:5},void 0),N=()=>e.jsxDEV("div",{className:`skeleton-author ${o}`,style:{marginBottom:"15px"},children:e.jsxDEV("div",{style:{display:"flex",alignItems:"center",gap:"15px"},children:[e.jsxDEV("div",{style:h(x({},r),{width:"50px",height:"50px",borderRadius:"50%"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:71,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:70,columnNumber:9},void 0),e.jsxDEV("div",{style:{flex:1},children:[e.jsxDEV("div",{style:h(x({},r),{width:"150px",height:"18px",marginBottom:"5px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:77,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:76,columnNumber:11},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"200px",height:"14px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:82,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:81,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:74,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:68,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:67,columnNumber:5},void 0),m=()=>e.jsxDEV("div",{className:`skeleton-header ${o}`,style:{marginBottom:"30px"},children:e.jsxDEV("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxDEV("div",{style:h(x({},r),{width:"120px",height:"32px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:94,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:93,columnNumber:9},void 0),e.jsxDEV("div",{style:{display:"flex",gap:"20px"},children:[1,2,3,4,5].map(v=>e.jsxDEV("div",{style:h(x({},r),{width:"60px",height:"20px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:101,columnNumber:15},void 0)},v,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:100,columnNumber:13},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:98,columnNumber:9},void 0),e.jsxDEV("div",{style:h(x({},r),{width:"200px",height:"36px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:108,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:107,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:91,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:90,columnNumber:5},void 0),d=({lines:v=3,width:D="100%"})=>e.jsxDEV("div",{className:`skeleton-text ${o}`,children:Array.from({length:v}).map((b,g)=>e.jsxDEV("div",{style:h(x({},r),{width:g===v-1?"70%":D,height:"16px",marginBottom:"8px"}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:126,columnNumber:11},void 0)},g,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:117,columnNumber:9},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:115,columnNumber:5},void 0),p=({width:v="100%",height:D="200px"})=>e.jsxDEV("div",{className:`skeleton-image ${o}`,style:h(x({},r),{width:v,height:D}),children:e.jsxDEV("div",{style:n},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:137,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:133,columnNumber:5},void 0),U=()=>{switch(s){case"post":return e.jsxDEV(f,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:144,columnNumber:16},void 0);case"author":return e.jsxDEV(N,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:146,columnNumber:16},void 0);case"header":return e.jsxDEV(m,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:148,columnNumber:16},void 0);case"text":return e.jsxDEV(d,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:150,columnNumber:16},void 0);case"image":return e.jsxDEV(p,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:152,columnNumber:16},void 0);default:return e.jsxDEV(f,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:154,columnNumber:16},void 0)}};return e.jsxDEV(e.Fragment,{children:[e.jsxDEV("style",{children:`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:160,columnNumber:7},void 0),e.jsxDEV("div",{className:`skeleton-loader ${o}`,children:Array.from({length:i}).map((v,D)=>e.jsxDEV("div",{children:U()},D,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:174,columnNumber:11},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:172,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:159,columnNumber:5},void 0)});A.displayName="SkeletonLoader";l.memo(()=>e.jsxDEV(A,{type:"post",count:1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:188,columnNumber:40},void 0));l.memo(()=>e.jsxDEV(A,{type:"author",count:1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:189,columnNumber:42},void 0));l.memo(()=>e.jsxDEV(A,{type:"header",count:1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:190,columnNumber:42},void 0));l.memo(({lines:s=3})=>e.jsxDEV(A,{type:"text",lines:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:191,columnNumber:53},void 0));l.memo(({width:s,height:i})=>e.jsxDEV(A,{type:"image",width:s,height:i},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:192,columnNumber:58},void 0));const O=l.memo(({src:s,alt:i,width:o,height:t,className:r="",style:n={},lazy:f=!0,priority:N=!1,sizes:m="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",aspectRatio:d=null})=>{const[p,U]=l.useState(!1),[v,D]=l.useState(!f||N),[b,g]=l.useState(!1),u=l.useRef(null),c=l.useRef(null);l.useEffect(()=>{if(!f||N||v)return;const E=new IntersectionObserver(T=>{T.forEach(L=>{L.isIntersecting&&(D(!0),E.disconnect())})},{rootMargin:"50px",threshold:.1});return u.current&&(E.observe(u.current),c.current=E),()=>{c.current&&c.current.disconnect()}},[f,N,v]);const a=(E,T,L=80)=>{if(!E)return null;const F=ue();if(F==="supabase"&&E.includes("supabase.co/storage/v1/object/public/"))try{const w=new URL(E);return w.searchParams.set("width",T.toString()),w.searchParams.set("quality",L.toString()),w.searchParams.set("format","webp"),w.toString()}catch(w){return E}return E},k=(E,T="original")=>E?[320,480,640,768,1024,1280,1920].filter(w=>!o||w<=o*2).map(w=>{let C=a(E,w);if(T==="webp")if(C.includes("supabase.co/storage/v1/object/public/"))try{const q=new URL(C);q.searchParams.set("format","webp"),C=q.toString()}catch(q){}else C=C.replace(/\.(jpg|jpeg|png)$/i,".webp");return`${C} ${w}w`}).join(", "):"",z=()=>{U(!0)},S=()=>{g(!0)},V=e.jsxDEV("div",{className:`image-placeholder ${r}`,style:h(x({},n),{backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"}),ref:u,children:b?"Failed to load":"Loading..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:147,columnNumber:5},void 0);return!v||b?V:e.jsxDEV("div",{className:`optimized-image-container ${r}`,style:n,ref:u,children:[e.jsxDEV("picture",{children:[e.jsxDEV("source",{srcSet:k(s,"webp"),sizes:m,type:"image/webp"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:178,columnNumber:9},void 0),e.jsxDEV("img",{src:a(s,o),srcSet:k(s),sizes:m,alt:i,width:o,height:t,loading:f&&!N?"lazy":"eager",fetchPriority:N?"high":"auto",decoding:"async",onLoad:z,onError:S,style:{width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.3s ease",opacity:p?1:0,display:"block"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:184,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:176,columnNumber:7},void 0),!p&&e.jsxDEV("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"},children:e.jsxDEV("div",{style:{width:"16px",height:"16px",border:"2px solid #f3f3f3",borderTop:"2px solid #333",borderRadius:"50%",animation:"spin 1s linear infinite"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:222,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:207,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:175,columnNumber:5},void 0)},(s,i)=>s.src===i.src&&s.width===i.width&&s.height===i.height&&s.lazy===i.lazy&&s.priority===i.priority);O.displayName="OptimizedImage";const De=({post:s,showDebug:i=!1})=>{const[o,t]=l.useState(null);return l.useEffect(()=>{if(!i||!s)return;const r=s.featured_image_url,n=me(r),f=B(s.content,s.featured_image_url);t({originalUrl:r,normalizedUrl:n,thumbnailUrl:f,isSupabaseUrl:r==null?void 0:r.includes("supabase.co"),isExternalUrl:r&&!r.includes("supabase.co"),hasImage:!!r})},[s,i]),!i||!o?null:e.jsxDEV("div",{style:{position:"fixed",top:"10px",right:"10px",background:"rgba(0, 0, 0, 0.9)",color:"white",padding:"15px",borderRadius:"8px",fontSize:"12px",maxWidth:"400px",zIndex:9999,fontFamily:"monospace"},children:[e.jsxDEV("h4",{style:{margin:"0 0 10px 0",color:"#4CAF50"},children:"🐛 Image Debug Info"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:45,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Post:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:48,columnNumber:9},void 0)," ",s.title]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:47,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Storage:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:52,columnNumber:9},void 0),e.jsxDEV("span",{style:{color:"#4CAF50"},children:"✅ Supabase Storage"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:53,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:51,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Image URL:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:59,columnNumber:9},void 0),e.jsxDEV("div",{style:{background:"rgba(255, 255, 255, 0.1)",padding:"4px",borderRadius:"4px",wordBreak:"break-all",fontSize:"10px"},children:o.originalUrl||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:60,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:58,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Status:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:72,columnNumber:9},void 0),!o.hasImage&&e.jsxDEV("span",{style:{color:"#9e9e9e"},children:" ℹ️ No featured image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:74,columnNumber:11},void 0),o.isSupabaseUrl&&e.jsxDEV("span",{style:{color:"#4CAF50"},children:" ✅ Supabase Storage URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:77,columnNumber:11},void 0),o.isExternalUrl&&e.jsxDEV("span",{style:{color:"#2196F3"},children:" ℹ️ External URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:80,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:71,columnNumber:7},void 0),o.thumbnailUrl&&e.jsxDEV("div",{style:{marginTop:"10px"},children:[e.jsxDEV("strong",{children:"Image Test:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:86,columnNumber:11},void 0),e.jsxDEV("img",{src:o.thumbnailUrl,alt:"Debug test",style:{width:"100px",height:"60px",objectFit:"cover",border:"1px solid #ccc",borderRadius:"4px",display:"block",marginTop:"5px"},onLoad:()=>{},onError:()=>{}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:87,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:85,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:32,columnNumber:5},void 0)},je=l.memo(({post:s,featured:i=!1,priority:o=!1,showDebug:t=!1})=>{const r=()=>"Admin";if(i){const f=B(s.content,s.featured_image_url);return e.jsxDEV(R,{to:`/${s.slug}`,className:"featured",children:[f&&e.jsxDEV("div",{className:"featured-image",children:e.jsxDEV(O,{src:f,alt:s.title,width:800,height:200,priority:o||i,style:{borderRadius:"8px",marginBottom:"15px"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:21,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:20,columnNumber:11},void 0),e.jsxDEV("div",{className:"featured-title",children:s.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:34,columnNumber:9},void 0),e.jsxDEV("div",{className:"featured-content",children:K(s.content,200)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:35,columnNumber:9},void 0),e.jsxDEV("div",{className:"featured-author",children:["By ",r()]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:38,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:18,columnNumber:7},void 0)}const n=B(s.content,s.featured_image_url);return e.jsxDEV(e.Fragment,{children:[e.jsxDEV(R,{to:`/${s.slug}`,className:"poem-card",children:[n&&e.jsxDEV("div",{className:"poem-image",children:e.jsxDEV(O,{src:n,alt:s.title,width:400,height:150,lazy:!o,priority:o,style:{borderRadius:"8px",marginBottom:"10px"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:52,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:51,columnNumber:11},void 0),e.jsxDEV("div",{className:"poem-title",children:s.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:66,columnNumber:9},void 0),e.jsxDEV("div",{className:"poem-preview",children:K(s.content)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:67,columnNumber:9},void 0),e.jsxDEV("div",{className:"poem-meta",children:[e.jsxDEV("div",{className:"author",children:["By ",r()]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:71,columnNumber:11},void 0),e.jsxDEV("div",{className:"date",children:de(s.published_at)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:72,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:70,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:49,columnNumber:7},void 0),t&&e.jsxDEV(De,{post:s,showDebug:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:75,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:48,columnNumber:5},void 0)},(s,i)=>s.post.id===i.post.id&&s.featured===i.featured&&s.priority===i.priority);je.displayName="PostCard";const ye=({value:s,onChange:i,placeholder:o="Start writing..."})=>{const t=l.useRef(null),[r,n]=l.useState(s||"");l.useEffect(()=>{n(s||"")},[s]);const f=(p,U,v,D)=>{n(p),i(p)},N={toolbar:{container:[[{header:[1,2,3,!1]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{align:[]}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],["blockquote","code-block"],["link","image"],["clean"],["center-text","hindi-format"]],handlers:{"center-text":function(){this.quill.getSelection()&&this.quill.format("align","center")},"hindi-format":function(){this.quill.getSelection()&&(this.quill.format("align","center"),this.quill.format("size","large"))}}},clipboard:{matchVisual:!1}},m=["header","font","size","bold","italic","underline","strike","blockquote","list","bullet","indent","link","image","video","align","color","background","code-block"],d={minHeight:"400px",fontFamily:'"Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif'};return e.jsxDEV("div",{className:"rich-text-editor",children:[e.jsxDEV(ie,{ref:t,theme:"snow",value:r,onChange:f,modules:N,formats:m,placeholder:o,style:d},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:72,columnNumber:7},void 0),e.jsxDEV("div",{className:"editor-help",children:e.jsxDEV("details",{children:[e.jsxDEV("summary",{children:"Formatting Tips"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:85,columnNumber:11},void 0),e.jsxDEV("div",{className:"help-content",children:[e.jsxDEV("h4",{children:"For Hindi Shayari:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:87,columnNumber:13},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Center Text:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:89,columnNumber:19},void 0)," Use the center alignment button for verses"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:89,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Line Breaks:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:90,columnNumber:19},void 0)," Press Shift+Enter for line breaks within verses"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:90,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Stanza Breaks:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:91,columnNumber:19},void 0)," Press Enter twice for stanza separation"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:91,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Emphasis:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:92,columnNumber:19},void 0)," Use bold or italic for emphasis"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:92,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:88,columnNumber:13},void 0),e.jsxDEV("h4",{children:"Keyboard Shortcuts:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:94,columnNumber:13},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+B"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:96,columnNumber:19},void 0)," - Bold"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:96,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+I"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:97,columnNumber:19},void 0)," - Italic"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:97,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+U"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:98,columnNumber:19},void 0)," - Underline"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:98,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+Shift+C"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:99,columnNumber:19},void 0)," - Center align"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:99,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+Z"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:100,columnNumber:19},void 0)," - Undo"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:100,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+Y"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:101,columnNumber:19},void 0)," - Redo"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:101,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:95,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:86,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:84,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:83,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",global:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:107,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:71,columnNumber:5},void 0)},Ee=({currentImage:s,onImageUpload:i,maxSize:o=5*1024*1024})=>{const[t,r]=l.useState(!1),[n,f]=l.useState(!1),[N,m]=l.useState(0),d=l.useRef(null),p=l.useCallback(a=>j(null,null,function*(){if(!a||a.length===0)return;const k=a[0];if(!k.type.startsWith("image/")){y.error("Please select an image file");return}if(k.size>o){y.error(`Image size must be less than ${Math.round(o/1024/1024)}MB`);return}yield U(k)}),[o]),U=a=>j(null,null,function*(){r(!0),m(0);try{const k=yield ce(a,{maxWidth:1200,maxHeight:800,quality:.8}),z=yield pe(k,{onProgress:S=>{m(Math.round(S))}});if(!z.success)throw new Error(z.error||"Upload failed");i(z.url),y.success("Image uploaded successfully!")}catch(k){y.error(k.message||"Failed to upload image. Please try again.")}finally{r(!1),m(0)}}),v=a=>{a.preventDefault(),f(!0)},D=a=>{a.preventDefault(),f(!1)},b=a=>{a.preventDefault(),f(!1);const k=Array.from(a.dataTransfer.files);p(k)},g=a=>{const k=Array.from(a.target.files);p(k)},u=()=>{i(""),d.current&&(d.current.value="")},c=()=>{var a;(a=d.current)==null||a.click()};return e.jsxDEV("div",{className:"image-uploader",children:[s?e.jsxDEV("div",{className:"current-image",children:[e.jsxDEV("div",{className:"image-preview",children:[e.jsxDEV("img",{src:s,alt:"Featured"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:105,columnNumber:13},void 0),e.jsxDEV("div",{className:"image-overlay",children:[e.jsxDEV("button",{type:"button",onClick:c,className:"btn btn-sm btn-primary",disabled:t,children:"Change"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:107,columnNumber:15},void 0),e.jsxDEV("button",{type:"button",onClick:u,className:"btn btn-sm btn-danger",disabled:t,children:"Remove"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:115,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:106,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:104,columnNumber:11},void 0),e.jsxDEV("div",{className:"image-info",children:e.jsxDEV("p",{className:"image-url",children:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:126,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:125,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:103,columnNumber:9},void 0):e.jsxDEV("div",{className:`upload-area ${n?"drag-over":""} ${t?"uploading":""}`,onDragOver:v,onDragLeave:D,onDrop:b,onClick:c,children:t?e.jsxDEV("div",{className:"upload-progress",children:[e.jsxDEV("div",{className:"progress-bar",children:e.jsxDEV("div",{className:"progress-fill",style:{width:`${N}%`}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:140,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:139,columnNumber:15},void 0),e.jsxDEV("p",{children:["Uploading... ",N,"%"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:145,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:138,columnNumber:13},void 0):e.jsxDEV("div",{className:"upload-content",children:[e.jsxDEV("div",{className:"upload-icon",children:"📷"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:149,columnNumber:15},void 0),e.jsxDEV("h3",{children:"Upload Featured Image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:150,columnNumber:15},void 0),e.jsxDEV("p",{children:"Drag and drop an image here, or click to browse"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:151,columnNumber:15},void 0),e.jsxDEV("p",{className:"upload-hint",children:["Supports JPG, PNG, WebP • Max ",Math.round(o/1024/1024),"MB"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:152,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:148,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:130,columnNumber:9},void 0),e.jsxDEV("input",{ref:d,type:"file",accept:"image/*",onChange:g,style:{display:"none"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:160,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:168,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:101,columnNumber:5},void 0)},_e=({data:s})=>{const i=r=>{if(!r)return"Not published";try{return new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}catch(n){return"Invalid date"}},o=l.useMemo(()=>{if(!s.content)return"";const r=document.createElement("div");return r.innerHTML=s.content,r.innerHTML},[s.content]),t=l.useMemo(()=>{if(s.excerpt)return s.excerpt;if(s.content){const r=document.createElement("div");r.innerHTML=s.content;const n=r.textContent||r.innerText||"";return n.substring(0,150)+(n.length>150?"...":"")}return"No excerpt available"},[s.content,s.excerpt]);return e.jsxDEV("div",{className:"post-preview",children:[e.jsxDEV("div",{className:"preview-header",children:[e.jsxDEV("h1",{children:"Preview Mode"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:49,columnNumber:9},void 0),e.jsxDEV("div",{className:"preview-status",children:e.jsxDEV("span",{className:`status-badge status-${s.status||"draft"}`,children:s.status||"draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:51,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:50,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:48,columnNumber:7},void 0),e.jsxDEV("article",{className:"preview-article",children:[s.featured_image_url&&e.jsxDEV("div",{className:"featured-image",children:e.jsxDEV("img",{src:s.featured_image_url,alt:s.title||"Featured image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:61,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:60,columnNumber:11},void 0),e.jsxDEV("header",{className:"post-header",children:[e.jsxDEV("h1",{className:"post-title",children:s.title||"Untitled Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:70,columnNumber:11},void 0),e.jsxDEV("div",{className:"post-meta",children:[e.jsxDEV("time",{className:"post-date",children:i(s.published_at||s.created_at)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:75,columnNumber:13},void 0),s.slug&&e.jsxDEV("div",{className:"post-url",children:[e.jsxDEV("strong",{children:"URL:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:80,columnNumber:17},void 0)," /",s.slug]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:79,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:74,columnNumber:11},void 0),t&&e.jsxDEV("div",{className:"post-excerpt",children:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:86,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:69,columnNumber:9},void 0),e.jsxDEV("div",{className:"post-content",children:o?e.jsxDEV("div",{dangerouslySetInnerHTML:{__html:o}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:95,columnNumber:13},void 0):e.jsxDEV("p",{className:"no-content",children:"No content available"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:97,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:93,columnNumber:9},void 0),(s.meta_title||s.meta_description)&&e.jsxDEV("div",{className:"seo-preview",children:[e.jsxDEV("h3",{children:"SEO Preview"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:104,columnNumber:13},void 0),e.jsxDEV("div",{className:"search-result-preview",children:[e.jsxDEV("div",{className:"search-title",children:s.meta_title||s.title||"Untitled Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:106,columnNumber:15},void 0),e.jsxDEV("div",{className:"search-url",children:[window.location.origin,"/",s.slug||"untitled-post"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:109,columnNumber:15},void 0),e.jsxDEV("div",{className:"search-description",children:s.meta_description||t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:112,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:105,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:103,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:57,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:120,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:47,columnNumber:5},void 0)},Ie=({initialData:s=null,onSave:i,onCancel:o,loading:t=!1,isEditing:r=!1})=>{const[n,f]=l.useState(!1),[N,m]=l.useState(!1),[d,p]=l.useState(null),[U,v]=l.useState(!1),{register:D,handleSubmit:b,watch:g,setValue:u,getValues:c,formState:{errors:a,isDirty:k},reset:z}=ne({defaultValues:{title:(s==null?void 0:s.title)||"",slug:(s==null?void 0:s.slug)||"",content:(s==null?void 0:s.content)||"",excerpt:(s==null?void 0:s.excerpt)||"",featured_image_url:(s==null?void 0:s.featured_image_url)||"",meta_title:(s==null?void 0:s.meta_title)||"",meta_description:(s==null?void 0:s.meta_description)||"",status:(s==null?void 0:s.status)||"draft"}}),S=g("title"),V=g("slug"),E=g("content");l.useEffect(()=>{if(S&&!r){const _=be(S);u("slug",_)}},[S,u,r]),l.useEffect(()=>{const P=setTimeout(()=>j(null,null,function*(){if(V&&V!==(s==null?void 0:s.slug)){v(!0);try{(yield fe(V,s==null?void 0:s.id))||y.error("This slug is already taken. Please choose a different one.")}catch(X){}finally{v(!1)}}}),500);return()=>clearTimeout(P)},[V,s==null?void 0:s.slug,s==null?void 0:s.id]),l.useEffect(()=>{if(k&&(S||E)){const _=setTimeout(()=>j(null,null,function*(){yield T()}),3e4);return()=>clearTimeout(_)}},[k,S,E]);const T=()=>j(null,null,function*(){if(k){m(!0);try{const _=g();if(r&&(s!=null&&s.id))yield G(s.id,h(x({},_),{status:"draft"}));else if(_.title||_.content){const P=yield Y(h(x({},_),{status:"draft"}));P&&!s&&window.history.replaceState(null,"",`/admin/edit/${P.id}`)}p(new Date)}catch(_){}finally{m(!1)}}}),L=_=>j(null,null,function*(){try{let P;return r?P=yield G(s.id,_):P=yield Y(_),i(_,_.status==="draft"),P}catch(P){throw y.error("Failed to save post. Please try again."),P}}),F=()=>{u("status","draft"),b(L)()},w=()=>{u("status","published"),u("published_at",new Date().toISOString()),b(L)()},C=l.useCallback(_=>{u("content",_,{shouldDirty:!0})},[u]),q=l.useCallback(_=>{u("featured_image_url",_,{shouldDirty:!0})},[u]);return e.jsxDEV("div",{className:"post-editor",children:[e.jsxDEV("div",{className:"editor-header",children:[e.jsxDEV("div",{className:"editor-actions",children:[e.jsxDEV("button",{type:"button",onClick:()=>f(!n),className:"btn btn-outline",children:n?"📝 Edit":"👁️ Preview"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:152,columnNumber:11},void 0),e.jsxDEV("div",{className:"save-status",children:[N&&e.jsxDEV("span",{className:"auto-saving",children:"Auto-saving..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:161,columnNumber:28},void 0),d&&!N&&e.jsxDEV("span",{className:"last-saved",children:["Saved ",d.toLocaleTimeString()]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:163,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:160,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:151,columnNumber:9},void 0),e.jsxDEV("div",{className:"primary-actions",children:[e.jsxDEV("button",{type:"button",onClick:o,className:"btn btn-secondary",disabled:t,children:"Cancel"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:171,columnNumber:11},void 0),e.jsxDEV("button",{type:"button",onClick:F,className:"btn btn-outline",disabled:t,children:t?"Saving...":"Save Draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:179,columnNumber:11},void 0),e.jsxDEV("button",{type:"button",onClick:w,className:"btn btn-primary",disabled:t||!S,children:t?"Publishing...":"Publish"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:187,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:170,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:150,columnNumber:7},void 0),e.jsxDEV("div",{className:"editor-content",children:n?e.jsxDEV(_e,{data:g()},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:200,columnNumber:11},void 0):e.jsxDEV("form",{onSubmit:b(L),className:"post-form",children:[e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"title",children:"Title *"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:205,columnNumber:17},void 0),e.jsxDEV("input",h(x({id:"title",type:"text"},D("title",{required:"Title is required",minLength:{value:3,message:"Title must be at least 3 characters"}})),{className:`form-control ${a.title?"error":""}`,placeholder:"Enter post title..."}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:206,columnNumber:17},void 0),a.title&&e.jsxDEV("span",{className:"error-message",children:a.title.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:216,columnNumber:34},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:204,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:203,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"slug",children:["URL Slug *",U&&e.jsxDEV("span",{className:"checking",children:"Checking..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:224,columnNumber:36},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:222,columnNumber:17},void 0),e.jsxDEV("div",{className:"slug-input",children:[e.jsxDEV("span",{className:"slug-prefix",children:["/",window.location.host,"/"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:227,columnNumber:19},void 0),e.jsxDEV("input",h(x({id:"slug",type:"text"},D("slug",{required:"Slug is required",pattern:{value:/^[a-z0-9-]+$/,message:"Slug can only contain lowercase letters, numbers, and hyphens"}})),{className:`form-control ${a.slug?"error":""}`,placeholder:"post-url-slug"}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:228,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:226,columnNumber:17},void 0),a.slug&&e.jsxDEV("span",{className:"error-message",children:a.slug.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:242,columnNumber:33},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:221,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:220,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"excerpt",children:"Excerpt"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:248,columnNumber:17},void 0),e.jsxDEV("textarea",h(x({id:"excerpt"},D("excerpt")),{className:"form-control",rows:"3",placeholder:"Brief description of the post..."}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:249,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:247,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:246,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Featured Image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:261,columnNumber:17},void 0),e.jsxDEV(Ee,{currentImage:g("featured_image_url"),onImageUpload:q},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:262,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:260,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:259,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"content",children:"Content"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:271,columnNumber:17},void 0),e.jsxDEV(ye,{value:E,onChange:C,placeholder:"Write your post content here..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:272,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:270,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:269,columnNumber:13},void 0),e.jsxDEV("details",{className:"seo-section",children:[e.jsxDEV("summary",{children:"SEO Settings"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:281,columnNumber:15},void 0),e.jsxDEV("div",{className:"seo-fields",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"meta_title",children:"Meta Title"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:284,columnNumber:19},void 0),e.jsxDEV("input",h(x({id:"meta_title",type:"text"},D("meta_title")),{className:"form-control",placeholder:"SEO title (leave empty to use post title)"}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:285,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:283,columnNumber:17},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"meta_description",children:"Meta Description"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:294,columnNumber:19},void 0),e.jsxDEV("textarea",h(x({id:"meta_description"},D("meta_description")),{className:"form-control",rows:"2",placeholder:"SEO description (leave empty to use excerpt)"}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:295,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:293,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:282,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:280,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:202,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:198,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:311,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:149,columnNumber:5},void 0)},Re=({selectedPosts:s,onActionComplete:i,onClearSelection:o})=>{const[t,r]=l.useState(!1),n=m=>j(null,null,function*(){if(s.length===0){y.error("Please select posts to perform bulk action");return}const d=N(m,s.length);if(confirm(d)){r(!0);try{let p;switch(m){case"publish":p=yield $(s,"published"),y.success(`${p} posts published successfully`);break;case"draft":p=yield $(s,"draft"),y.success(`${p} posts moved to draft`);break;case"private":p=yield $(s,"private"),y.success(`${p} posts made private`);break;case"delete":p=yield f(s),y.success(`${p} posts deleted successfully`);break;default:throw new Error("Invalid bulk action")}i(),o()}catch(p){y.error(`Failed to ${m} posts. Please try again.`)}finally{r(!1)}}}),f=m=>j(null,null,function*(){let d=0;for(const p of m)try{yield Ne(p),d++}catch(U){}return d}),N=(m,d)=>{const p=d===1?"post":"posts";switch(m){case"publish":return`Are you sure you want to publish ${d} ${p}?`;case"draft":return`Are you sure you want to move ${d} ${p} to draft?`;case"private":return`Are you sure you want to make ${d} ${p} private?`;case"delete":return`Are you sure you want to delete ${d} ${p}? This action cannot be undone.`;default:return`Are you sure you want to perform this action on ${d} ${p}?`}};return s.length===0?null:e.jsxDEV("div",{className:"bulk-actions",children:[e.jsxDEV("div",{className:"bulk-info",children:[e.jsxDEV("span",{className:"selected-count",children:[s.length," post",s.length!==1?"s":""," selected"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:89,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:o,className:"clear-selection",disabled:t,children:"Clear Selection"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:92,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:88,columnNumber:7},void 0),e.jsxDEV("div",{className:"bulk-buttons",children:[e.jsxDEV("button",{type:"button",onClick:()=>n("publish"),className:"btn btn-sm btn-success",disabled:t,children:t?"Processing...":"Publish"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:103,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:()=>n("draft"),className:"btn btn-sm btn-warning",disabled:t,children:t?"Processing...":"Move to Draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:111,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:()=>n("private"),className:"btn btn-sm btn-secondary",disabled:t,children:t?"Processing...":"Make Private"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:119,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:()=>n("delete"),className:"btn btn-sm btn-danger",disabled:t,children:t?"Processing...":"Delete"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:127,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:102,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:137,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:87,columnNumber:5},void 0)},Te=({isVisible:s=!1})=>{const[i,o]=l.useState(null),[t,r]=l.useState(null),[n,f]=l.useState(null),[N,m]=l.useState(!1),[d,p]=l.useState("status");l.useEffect(()=>{s&&U()},[s]);const U=()=>{const b=ge(),g=ve();o(b),r(g)},v=()=>j(null,null,function*(){m(!0);try{const b=yield ke({includeUploadTest:!1,testImageUrl:null});f(b),p("tests")}catch(b){}finally{m(!1)}}),D=b=>{xe.switchProvider(b)&&U()};return s?e.jsxDEV("div",{className:"storage-debugger",children:[e.jsxDEV("div",{className:"debugger-header",children:[e.jsxDEV("h3",{children:"🔧 Storage System Debugger"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:60,columnNumber:9},void 0),e.jsxDEV("div",{className:"debugger-tabs",children:[e.jsxDEV("button",{className:d==="status"?"active":"",onClick:()=>p("status"),children:"Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:62,columnNumber:11},void 0),e.jsxDEV("button",{className:d==="config"?"active":"",onClick:()=>p("config"),children:"Config"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:68,columnNumber:11},void 0),e.jsxDEV("button",{className:d==="tests"?"active":"",onClick:()=>p("tests"),children:"Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:74,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:61,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:59,columnNumber:7},void 0),e.jsxDEV("div",{className:"debugger-content",children:[d==="status"&&e.jsxDEV("div",{className:"status-tab",children:[e.jsxDEV("div",{className:"status-section",children:[e.jsxDEV("h4",{children:"Current Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:87,columnNumber:15},void 0),i&&e.jsxDEV("div",{className:"status-info",children:[e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("strong",{children:"Active Provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:91,columnNumber:21},void 0),e.jsxDEV("span",{className:`provider-badge ${i.current}`,children:i.current||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:92,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:90,columnNumber:19},void 0),e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("strong",{children:"Fallback Provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:97,columnNumber:21},void 0),e.jsxDEV("span",{className:"provider-badge",children:i.fallback||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:98,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:96,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:89,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:86,columnNumber:13},void 0),e.jsxDEV("div",{className:"providers-section",children:[e.jsxDEV("h4",{children:"Available Providers"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:107,columnNumber:15},void 0),i&&e.jsxDEV("div",{className:"providers-list",children:Object.entries(i.providers).map(([b,g])=>e.jsxDEV("div",{className:`provider-item ${g.configured?"configured":"not-configured"}`,children:[e.jsxDEV("div",{className:"provider-info",children:[e.jsxDEV("span",{className:"provider-name",children:b},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:113,columnNumber:25},void 0),e.jsxDEV("span",{className:`status-indicator ${g.configured?"configured":"not-configured"}`,children:g.configured?"✅ Configured":"❌ Not Configured"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:114,columnNumber:25},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:112,columnNumber:23},void 0),g.configured&&b!==i.current&&e.jsxDEV("button",{className:"switch-btn",onClick:()=>D(b),children:["Switch to ",b]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:119,columnNumber:25},void 0)]},b,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:111,columnNumber:21},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:109,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:106,columnNumber:13},void 0),e.jsxDEV("div",{className:"actions-section",children:[e.jsxDEV("button",{onClick:U,className:"refresh-btn",children:"🔄 Refresh Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:133,columnNumber:15},void 0),e.jsxDEV("button",{onClick:v,className:"test-btn",disabled:N,children:N?"🧪 Running Tests...":"🧪 Run Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:136,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:132,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:85,columnNumber:11},void 0),d==="config"&&e.jsxDEV("div",{className:"config-tab",children:[e.jsxDEV("div",{className:"validation-section",children:[e.jsxDEV("h4",{children:"Configuration Validation"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:150,columnNumber:15},void 0),t&&e.jsxDEV("div",{className:`validation-result ${t.valid?"valid":"invalid"}`,children:[e.jsxDEV("div",{className:"validation-status",children:t.valid?"✅ Valid Configuration":"❌ Configuration Issues"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:153,columnNumber:19},void 0),t.errors.length>0&&e.jsxDEV("div",{className:"validation-errors",children:[e.jsxDEV("strong",{children:"Errors:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:159,columnNumber:23},void 0),e.jsxDEV("ul",{children:t.errors.map((b,g)=>e.jsxDEV("li",{className:"error",children:b},g,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:162,columnNumber:27},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:160,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:158,columnNumber:21},void 0),t.warnings.length>0&&e.jsxDEV("div",{className:"validation-warnings",children:[e.jsxDEV("strong",{children:"Warnings:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:170,columnNumber:23},void 0),e.jsxDEV("ul",{children:t.warnings.map((b,g)=>e.jsxDEV("li",{className:"warning",children:b},g,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:173,columnNumber:27},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:171,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:169,columnNumber:21},void 0),e.jsxDEV("div",{className:"validation-stats",children:e.jsxDEV("span",{children:["Configured Providers: ",t.configuredProviders,"/",t.totalProviders]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:180,columnNumber:21},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:179,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:152,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:149,columnNumber:13},void 0),e.jsxDEV("div",{className:"env-vars-section",children:[e.jsxDEV("h4",{children:"Environment Variables"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:187,columnNumber:15},void 0),e.jsxDEV("div",{className:"env-vars-info",children:[e.jsxDEV("p",{children:"Check your environment variables for each provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:189,columnNumber:17},void 0),e.jsxDEV("div",{className:"env-vars-list",children:[e.jsxDEV("div",{className:"env-var-group",children:[e.jsxDEV("strong",{children:"Supabase:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:192,columnNumber:21},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"VITE_SUPABASE_URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:194,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_SUPABASE_ANON_KEY"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:195,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:193,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:191,columnNumber:19},void 0),e.jsxDEV("div",{className:"env-var-group",children:[e.jsxDEV("strong",{children:"Cloudflare R2:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:199,columnNumber:21},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"VITE_CLOUDFLARE_ACCOUNT_ID"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:201,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_ACCESS_KEY_ID"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:202,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:203,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_BUCKET_NAME"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:204,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_PUBLIC_URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:205,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_ENDPOINT"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:206,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:200,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:198,columnNumber:19},void 0),e.jsxDEV("div",{className:"env-var-group",children:[e.jsxDEV("strong",{children:"General:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:210,columnNumber:21},void 0),e.jsxDEV("ul",{children:e.jsxDEV("li",{children:"VITE_STORAGE_PROVIDER (optional, defaults to 'supabase')"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:212,columnNumber:23},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:211,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:209,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:190,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:188,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:186,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:148,columnNumber:11},void 0),d==="tests"&&e.jsxDEV("div",{className:"tests-tab",children:[e.jsxDEV("div",{className:"tests-header",children:[e.jsxDEV("h4",{children:"Validation Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:224,columnNumber:15},void 0),n&&e.jsxDEV("div",{className:`test-summary ${n.success?"success":"failure"}`,children:[n.passedTests,"/",n.totalTests," tests passed (",n.passRate,"%)"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:226,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:223,columnNumber:13},void 0),n&&e.jsxDEV("div",{className:"test-results",children:n.results.map((b,g)=>e.jsxDEV("div",{className:`test-result ${b.passed?"passed":"failed"}`,children:[e.jsxDEV("div",{className:"test-header",children:[e.jsxDEV("span",{className:"test-status",children:b.passed?"✅":"❌"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:237,columnNumber:23},void 0),e.jsxDEV("span",{className:"test-name",children:b.name},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:240,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:236,columnNumber:21},void 0),e.jsxDEV("div",{className:"test-message",children:b.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:242,columnNumber:21},void 0),b.error&&e.jsxDEV("div",{className:"test-error",children:["Error: ",b.error]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:244,columnNumber:23},void 0),b.details&&e.jsxDEV("details",{className:"test-details",children:[e.jsxDEV("summary",{children:"Details"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:248,columnNumber:25},void 0),e.jsxDEV("pre",{children:JSON.stringify(b.details,null,2)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:249,columnNumber:25},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:247,columnNumber:23},void 0)]},g,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:235,columnNumber:19},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:233,columnNumber:15},void 0),!n&&!N&&e.jsxDEV("div",{className:"no-tests",children:e.jsxDEV("p",{children:'No test results available. Click "Run Tests" to validate your storage setup.'},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:259,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:258,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:222,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:83,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:266,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:58,columnNumber:5},void 0):null},Ue=()=>{var g,u;const[s,i]=l.useState(""),[o,t]=l.useState(""),[r,n]=l.useState(!1),[f,N]=l.useState(!1),{signIn:m,resetPassword:d}=J(),p=te(),v=((u=(g=M().state)==null?void 0:g.from)==null?void 0:u.pathname)||"/admin/posts",D=c=>j(null,null,function*(){if(c.preventDefault(),!s||!o)return;n(!0);const{error:a}=yield m(s,o);a||p(v,{replace:!0}),n(!1)}),b=c=>j(null,null,function*(){if(c.preventDefault(),!s){alert("Please enter your email address first");return}yield d(s),N(!1)});return e.jsxDEV("div",{className:"login-container",children:[e.jsxDEV("div",{className:"login-card",children:[e.jsxDEV("div",{className:"login-header",children:[e.jsxDEV("h1",{children:"Admin Login"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:45,columnNumber:11},void 0),e.jsxDEV("p",{children:"Sign in to manage your blog"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:46,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:44,columnNumber:9},void 0),f?e.jsxDEV("form",{onSubmit:b,className:"login-form",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"reset-email",children:"Email"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:97,columnNumber:15},void 0),e.jsxDEV("input",{id:"reset-email",type:"email",value:s,onChange:c=>i(c.target.value),placeholder:"Enter your email",required:!0},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:98,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:96,columnNumber:13},void 0),e.jsxDEV("button",{type:"submit",className:"login-button",disabled:!s,children:"Send Reset Email"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:108,columnNumber:13},void 0),e.jsxDEV("button",{type:"button",className:"forgot-password-link",onClick:()=>N(!1),children:"Back to Login"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:116,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:95,columnNumber:11},void 0):e.jsxDEV("form",{onSubmit:D,className:"login-form",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"email",children:"Email"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:52,columnNumber:15},void 0),e.jsxDEV("input",{id:"email",type:"email",value:s,onChange:c=>i(c.target.value),placeholder:"Enter your email",required:!0,disabled:r},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:53,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:51,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"password",children:"Password"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:65,columnNumber:15},void 0),e.jsxDEV("input",{id:"password",type:"password",value:o,onChange:c=>t(c.target.value),placeholder:"Enter your password",required:!0,disabled:r},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:66,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:64,columnNumber:13},void 0),e.jsxDEV("button",{type:"submit",className:"login-button",disabled:r||!s||!o,children:r?"Signing in...":"Sign In"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:77,columnNumber:13},void 0),e.jsxDEV("button",{type:"button",className:"forgot-password-link",onClick:()=>N(!0),disabled:r,children:"Forgot your password?"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:85,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:50,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:43,columnNumber:7},void 0),e.jsxDEV("style",{jsx:!0,children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:127,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:42,columnNumber:5},void 0)},ze=Object.freeze(Object.defineProperty({__proto__:null,default:Ue},Symbol.toStringTag,{value:"Module"})),Ve=({children:s})=>{const{user:i,loading:o}=J(),t=M();return o?e.jsxDEV("div",{className:"loading-container",children:[e.jsxDEV("div",{className:"spinner"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:11,columnNumber:9},void 0),e.jsxDEV("p",{children:"Checking authentication..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:12,columnNumber:9},void 0),e.jsxDEV("style",{jsx:!0,children:`
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
        `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:14,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:10,columnNumber:7},void 0):i?s:e.jsxDEV(le,{to:"/admin/login",state:{from:t},replace:!0},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:51,columnNumber:12},void 0)},Ae=Object.freeze(Object.defineProperty({__proto__:null,default:Ve},Symbol.toStringTag,{value:"Module"}));export{Le as A,Re as B,Ce as F,he as H,ze as L,je as P,A as S,Ie as a,Te as b,Ae as c,J as u};
