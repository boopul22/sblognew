var ie=Object.defineProperty,ne=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var M=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,ue=Object.prototype.propertyIsEnumerable;var W=(s,r,i)=>r in s?ie(s,r,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[r]=i,g=(s,r)=>{for(var i in r||(r={}))le.call(r,i)&&W(s,i,r[i]);if(M)for(var i of M(r))ue.call(r,i)&&W(s,i,r[i]);return s},h=(s,r)=>ne(s,te(r));var j=(s,r,i)=>new Promise((l,o)=>{var t=u=>{try{a(i.next(u))}catch(c){o(c)}},f=u=>{try{a(i.throw(u))}catch(c){o(c)}},a=u=>u.done?l(u.value):Promise.resolve(u.value).then(t,f);a((i=i.apply(s,r)).next())});import{r as n,V as E,j as e,u as O,L as C,R as ae,a as me,b as de,N as ce}from"./react-vendor-QWuLYCV5.js";import{s as R,d as pe,g as be,n as fe,a as H,b as K,f as Ne,c as ve,e as xe,u as ge,h as ke,i as Y,j as G,v as he,k as q,l as De,m as je,o as ye,p as Ee,q as _e}from"./utils-CyCRfmWG.js";const J=n.createContext({}),X=()=>{const s=n.useContext(J);if(!s)throw new Error("useAuth must be used within an AuthProvider");return s},$e=({children:s})=>{const[r,i]=n.useState(null),[l,o]=n.useState(!0),[t,f]=n.useState(null);n.useEffect(()=>{R.auth.getSession().then(({data:{session:b}})=>{var m;f(b),i((m=b==null?void 0:b.user)!=null?m:null),o(!1)});const{data:{subscription:d}}=R.auth.onAuthStateChange((b,m)=>j(null,null,function*(){var k;f(m),i((k=m==null?void 0:m.user)!=null?k:null),o(!1),b==="SIGNED_IN"?E.success("Successfully signed in!"):b==="SIGNED_OUT"&&E.success("Successfully signed out!")}));return()=>d.unsubscribe()},[]);const a=(d,b)=>j(null,null,function*(){try{o(!0);const{data:m,error:k}=yield R.auth.signInWithPassword({email:d,password:b});if(k)throw k;return{data:m,error:null}}catch(m){return E.error(m.message||"Failed to sign in"),{data:null,error:m}}finally{o(!1)}}),u=()=>j(null,null,function*(){try{o(!0);const{error:d}=yield R.auth.signOut();if(d)throw d}catch(d){E.error(d.message||"Failed to sign out")}finally{o(!1)}}),c=(k,T,...S)=>j(null,[k,T,...S],function*(d,b,m={}){try{o(!0);const{data:V,error:D}=yield R.auth.signUp({email:d,password:b,options:{data:m}});if(D)throw D;return{data:V,error:null}}catch(V){return E.error(V.message||"Failed to sign up"),{data:null,error:V}}finally{o(!1)}}),p=d=>j(null,null,function*(){try{const{data:b,error:m}=yield R.auth.resetPasswordForEmail(d,{redirectTo:`${window.location.origin}/admin/reset-password`});if(m)throw m;return E.success("Password reset email sent!"),{data:b,error:null}}catch(b){return E.error(b.message||"Failed to send reset email"),{data:null,error:b}}}),U=d=>j(null,null,function*(){try{const{data:b,error:m}=yield R.auth.updateUser({password:d});if(m)throw m;return E.success("Password updated successfully!"),{data:b,error:null}}catch(b){return E.error(b.message||"Failed to update password"),{data:null,error:b}}}),x=()=>j(null,null,function*(){if(!r)return null;try{const{data:d,error:b}=yield R.from("users").select("*").eq("id",r.id).single();if(b)throw b;return d}catch(d){return null}}),v={user:r,session:t,loading:l,signIn:a,signOut:u,signUp:c,resetPassword:p,updatePassword:U,getUserProfile:x,isAdmin:()=>j(null,null,function*(){const d=yield x();return(d==null?void 0:d.role)==="admin"}),isEditor:()=>j(null,null,function*(){const d=yield x();return(d==null?void 0:d.role)==="editor"||(d==null?void 0:d.role)==="admin"})};return e.jsxDEV(J.Provider,{value:v,children:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/contexts/AuthContext.jsx",lineNumber:192,columnNumber:5},void 0)},Ue=n.memo(({onSearch:s,searchQuery:r,setSearchQuery:i})=>{const l=O(),o=a=>!!(a==="/"&&l.pathname==="/"||a!=="/"&&l.pathname.startsWith(a)),t=n.useCallback(pe(a=>{s&&s(a)},300),[s]),f=a=>{const u=a.target.value;i(u),t(u)};return e.jsxDEV("header",{className:"header",children:e.jsxDEV("div",{className:"container",children:e.jsxDEV("div",{className:"flex items-center justify-between",children:[e.jsxDEV("div",{className:"logo",children:e.jsxDEV(C,{to:"/",className:"logo-text",children:"शायरी ब्लॉग"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:41,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:40,columnNumber:11},void 0),e.jsxDEV("nav",{className:"nav-menu",children:e.jsxDEV("ul",{className:"nav-list",children:[e.jsxDEV("li",{children:e.jsxDEV(C,{to:"/",className:`nav-link ${o("/")?"active":""}`,children:"Home"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:50,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:49,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV(C,{to:"/category/shayari",className:`nav-link ${o("/category/shayari")?"active":""}`,children:"श्रेणियाँ"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:58,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:57,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV(C,{to:"/authors",className:`nav-link ${o("/authors")?"active":""}`,children:"लेखक"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:66,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:65,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV(C,{to:"/about",className:`nav-link ${o("/about")?"active":""}`,children:"हमारे बारे में"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:74,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:73,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:48,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:47,columnNumber:11},void 0),e.jsxDEV("div",{className:"header-actions flex items-center gap-16",children:[e.jsxDEV("div",{className:"search-container",children:[e.jsxDEV("input",{type:"text",className:"search-input",placeholder:"शायरी खोजें...",value:r,onChange:f,autoComplete:"off",spellCheck:"false"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:87,columnNumber:15},void 0),e.jsxDEV("button",{className:"search-btn",children:"🔍"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:96,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:86,columnNumber:13},void 0),e.jsxDEV("button",{className:"lang-toggle btn btn--outline btn--sm",children:"हिंदी/En"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:98,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:85,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:38,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:37,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Header.jsx",lineNumber:36,columnNumber:5},void 0)});Ue.displayName="Header";const qe=()=>e.jsxDEV("footer",{className:"footer",children:e.jsxDEV("div",{className:"container",children:[e.jsxDEV("div",{className:"footer-content",children:[e.jsxDEV("div",{className:"footer-section",children:[e.jsxDEV("h4",{className:"footer-title",children:"श्रेणियाँ"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:7,columnNumber:13},void 0),e.jsxDEV("ul",{className:"footer-links",children:[e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"प्रेम शायरी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:9,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:9,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"दुख शायरी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:10,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:10,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"मोटिवेशनल शायरी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:11,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:11,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"दोस्ती शायरी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:12,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:12,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:8,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:6,columnNumber:11},void 0),e.jsxDEV("div",{className:"footer-section",children:[e.jsxDEV("h4",{className:"footer-title",children:"लेखक"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:17,columnNumber:13},void 0),e.jsxDEV("ul",{className:"footer-links",children:[e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"राहुल शर्मा"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:19,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:19,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"प्रिया गुप्ता"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:20,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:20,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"अमित कुमार"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:21,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:21,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"सुनीता देवी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:22,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:22,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:18,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:16,columnNumber:11},void 0),e.jsxDEV("div",{className:"footer-section",children:[e.jsxDEV("h4",{className:"footer-title",children:"About"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:27,columnNumber:13},void 0),e.jsxDEV("ul",{className:"footer-links",children:[e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"हमारे बारे में"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:29,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:29,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"Contact"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:30,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:30,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"Privacy Policy"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:31,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:31,columnNumber:15},void 0),e.jsxDEV("li",{children:e.jsxDEV("a",{href:"#",children:"Terms of Service"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:32,columnNumber:19},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:32,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:28,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:26,columnNumber:11},void 0),e.jsxDEV("div",{className:"footer-section",children:[e.jsxDEV("h4",{className:"footer-title",children:"Follow Us"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:37,columnNumber:13},void 0),e.jsxDEV("div",{className:"social-links",children:[e.jsxDEV("a",{href:"#",className:"social-link",children:"📘 Facebook"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:39,columnNumber:15},void 0),e.jsxDEV("a",{href:"#",className:"social-link",children:"🐦 Twitter"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:40,columnNumber:15},void 0),e.jsxDEV("a",{href:"#",className:"social-link",children:"📷 Instagram"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:41,columnNumber:15},void 0),e.jsxDEV("a",{href:"#",className:"social-link",children:"📺 YouTube"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:42,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:38,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:36,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:5,columnNumber:9},void 0),e.jsxDEV("div",{className:"footer-bottom",children:[e.jsxDEV("p",{children:"© 2025 शायरी ब्लॉग. All rights reserved."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:48,columnNumber:11},void 0),e.jsxDEV("p",{children:"Contact: info@shayariblog.com | +91 9876543210"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:49,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:47,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:4,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Footer.jsx",lineNumber:3,columnNumber:5},void 0),A=n.memo(({type:s="post",count:r=1,className:i="",style:l={}})=>{const o=g({backgroundColor:"#f0f0f0",borderRadius:"4px",position:"relative",overflow:"hidden"},l),t={position:"absolute",top:0,left:"-100%",width:"100%",height:"100%",background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",animation:"shimmer 1.5s infinite"},f=()=>e.jsxDEV("div",{className:`skeleton-post ${i}`,style:{marginBottom:"20px"},children:[e.jsxDEV("div",{style:h(g({},o),{width:"100%",height:"200px",marginBottom:"15px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:35,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:34,columnNumber:7},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"80%",height:"24px",marginBottom:"10px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:40,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:39,columnNumber:7},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"100%",height:"16px",marginBottom:"8px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:45,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:44,columnNumber:7},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"90%",height:"16px",marginBottom:"8px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:48,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:47,columnNumber:7},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"70%",height:"16px",marginBottom:"15px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:51,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:50,columnNumber:7},void 0),e.jsxDEV("div",{style:{display:"flex",gap:"15px"},children:[e.jsxDEV("div",{style:h(g({},o),{width:"80px",height:"14px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:57,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:56,columnNumber:9},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"100px",height:"14px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:60,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:59,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:55,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:32,columnNumber:5},void 0),a=()=>e.jsxDEV("div",{className:`skeleton-author ${i}`,style:{marginBottom:"15px"},children:e.jsxDEV("div",{style:{display:"flex",alignItems:"center",gap:"15px"},children:[e.jsxDEV("div",{style:h(g({},o),{width:"50px",height:"50px",borderRadius:"50%"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:71,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:70,columnNumber:9},void 0),e.jsxDEV("div",{style:{flex:1},children:[e.jsxDEV("div",{style:h(g({},o),{width:"150px",height:"18px",marginBottom:"5px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:77,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:76,columnNumber:11},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"200px",height:"14px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:82,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:81,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:74,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:68,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:67,columnNumber:5},void 0),u=()=>e.jsxDEV("div",{className:`skeleton-header ${i}`,style:{marginBottom:"30px"},children:e.jsxDEV("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxDEV("div",{style:h(g({},o),{width:"120px",height:"32px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:94,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:93,columnNumber:9},void 0),e.jsxDEV("div",{style:{display:"flex",gap:"20px"},children:[1,2,3,4,5].map(x=>e.jsxDEV("div",{style:h(g({},o),{width:"60px",height:"20px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:101,columnNumber:15},void 0)},x,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:100,columnNumber:13},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:98,columnNumber:9},void 0),e.jsxDEV("div",{style:h(g({},o),{width:"200px",height:"36px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:108,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:107,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:91,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:90,columnNumber:5},void 0),c=({lines:x=3,width:y="100%"})=>e.jsxDEV("div",{className:`skeleton-text ${i}`,children:Array.from({length:x}).map((N,v)=>e.jsxDEV("div",{style:h(g({},o),{width:v===x-1?"70%":y,height:"16px",marginBottom:"8px"}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:126,columnNumber:11},void 0)},v,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:117,columnNumber:9},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:115,columnNumber:5},void 0),p=({width:x="100%",height:y="200px"})=>e.jsxDEV("div",{className:`skeleton-image ${i}`,style:h(g({},o),{width:x,height:y}),children:e.jsxDEV("div",{style:t},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:137,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:133,columnNumber:5},void 0),U=()=>{switch(s){case"post":return e.jsxDEV(f,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:144,columnNumber:16},void 0);case"author":return e.jsxDEV(a,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:146,columnNumber:16},void 0);case"header":return e.jsxDEV(u,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:148,columnNumber:16},void 0);case"text":return e.jsxDEV(c,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:150,columnNumber:16},void 0);case"image":return e.jsxDEV(p,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:152,columnNumber:16},void 0);default:return e.jsxDEV(f,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:154,columnNumber:16},void 0)}};return e.jsxDEV(e.Fragment,{children:[e.jsxDEV("style",{children:`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:160,columnNumber:7},void 0),e.jsxDEV("div",{className:`skeleton-loader ${i}`,children:Array.from({length:r}).map((x,y)=>e.jsxDEV("div",{children:U()},y,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:174,columnNumber:11},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:172,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:159,columnNumber:5},void 0)});A.displayName="SkeletonLoader";n.memo(()=>e.jsxDEV(A,{type:"post",count:1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:188,columnNumber:40},void 0));n.memo(()=>e.jsxDEV(A,{type:"author",count:1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:189,columnNumber:42},void 0));n.memo(()=>e.jsxDEV(A,{type:"header",count:1},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:190,columnNumber:42},void 0));n.memo(({lines:s=3})=>e.jsxDEV(A,{type:"text",lines:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:191,columnNumber:53},void 0));n.memo(({width:s,height:r})=>e.jsxDEV(A,{type:"image",width:s,height:r},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/SkeletonLoader.jsx",lineNumber:192,columnNumber:58},void 0));const B=n.memo(({src:s,alt:r,width:i,height:l,className:o="",style:t={},lazy:f=!0,priority:a=!1,sizes:u="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",aspectRatio:c=null})=>{const[p,U]=n.useState(!1),[x,y]=n.useState(!f||a),[N,v]=n.useState(!1),d=n.useRef(null),b=n.useRef(null);n.useEffect(()=>{if(!f||a||x)return;const D=new IntersectionObserver(F=>{F.forEach(L=>{L.isIntersecting&&(y(!0),D.disconnect())})},{rootMargin:"50px",threshold:.1});return d.current&&(D.observe(d.current),b.current=D),()=>{b.current&&b.current.disconnect()}},[f,a,x]);const m=(D,F,L=80)=>{if(!D)return null;if(be(),D.includes("supabase.co/storage/v1/object/public/"))try{const I=new URL(D);return I.searchParams.set("width",F.toString()),I.searchParams.set("quality",L.toString()),I.searchParams.set("format","webp"),I.toString()}catch(I){return D}return D.includes(".r2.dev")||D.includes("r2.cloudflarestorage.com"),D},k=(D,F="original")=>D?[320,480,640,768,1024,1280,1920].filter(z=>!i||z<=i*2).map(z=>{let w=m(D,z);if(F==="webp")if(w.includes("supabase.co/storage/v1/object/public/"))try{const $=new URL(w);$.searchParams.set("format","webp"),w=$.toString()}catch($){}else w.includes(".r2.dev")||w.includes("r2.cloudflarestorage.com")?w=w:w=w.replace(/\.(jpg|jpeg|png)$/i,".webp");return`${w} ${z}w`}).join(", "):"",T=()=>{U(!0)},S=D=>{v(!0)},V=e.jsxDEV("div",{className:`image-placeholder ${o}`,style:h(g({},t),{backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"}),ref:d,children:N?"Failed to load":"Loading..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:154,columnNumber:5},void 0);return!x||N?V:e.jsxDEV("div",{className:`optimized-image-container ${o}`,style:t,ref:d,children:[e.jsxDEV("picture",{children:[e.jsxDEV("source",{srcSet:k(s,"webp"),sizes:u,type:"image/webp"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:185,columnNumber:9},void 0),e.jsxDEV("img",{src:m(s,i),srcSet:k(s),sizes:u,alt:r,width:i,height:l,loading:f&&!a?"lazy":"eager",fetchpriority:a?"high":"auto",decoding:"async",onLoad:T,onError:S,style:{width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.3s ease",opacity:p?1:0,display:"block"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:191,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:183,columnNumber:7},void 0),!p&&e.jsxDEV("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundColor:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",color:"#999",fontSize:"14px"},children:e.jsxDEV("div",{style:{width:"16px",height:"16px",border:"2px solid #f3f3f3",borderTop:"2px solid #333",borderRadius:"50%",animation:"spin 1s linear infinite"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:229,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:214,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/OptimizedImage.jsx",lineNumber:182,columnNumber:5},void 0)},(s,r)=>s.src===r.src&&s.width===r.width&&s.height===r.height&&s.lazy===r.lazy&&s.priority===r.priority);B.displayName="OptimizedImage";const Ve=({post:s,showDebug:r=!1})=>{const[i,l]=n.useState(null);return n.useEffect(()=>{if(!r||!s)return;const o=s.featured_image_url,t=fe(o),f=H(s.content,s.featured_image_url);l({originalUrl:o,normalizedUrl:t,thumbnailUrl:f,isSupabaseUrl:o==null?void 0:o.includes("supabase.co"),isExternalUrl:o&&!o.includes("supabase.co"),hasImage:!!o})},[s,r]),!r||!i?null:e.jsxDEV("div",{style:{position:"fixed",top:"10px",right:"10px",background:"rgba(0, 0, 0, 0.9)",color:"white",padding:"15px",borderRadius:"8px",fontSize:"12px",maxWidth:"400px",zIndex:9999,fontFamily:"monospace"},children:[e.jsxDEV("h4",{style:{margin:"0 0 10px 0",color:"#4CAF50"},children:"🐛 Image Debug Info"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:45,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Post:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:48,columnNumber:9},void 0)," ",s.title]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:47,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Storage:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:52,columnNumber:9},void 0),e.jsxDEV("span",{style:{color:"#4CAF50"},children:"✅ Supabase Storage"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:53,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:51,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Image URL:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:59,columnNumber:9},void 0),e.jsxDEV("div",{style:{background:"rgba(255, 255, 255, 0.1)",padding:"4px",borderRadius:"4px",wordBreak:"break-all",fontSize:"10px"},children:i.originalUrl||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:60,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:58,columnNumber:7},void 0),e.jsxDEV("div",{style:{marginBottom:"8px"},children:[e.jsxDEV("strong",{children:"Status:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:72,columnNumber:9},void 0),!i.hasImage&&e.jsxDEV("span",{style:{color:"#9e9e9e"},children:" ℹ️ No featured image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:74,columnNumber:11},void 0),i.isSupabaseUrl&&e.jsxDEV("span",{style:{color:"#4CAF50"},children:" ✅ Supabase Storage URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:77,columnNumber:11},void 0),i.isExternalUrl&&e.jsxDEV("span",{style:{color:"#2196F3"},children:" ℹ️ External URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:80,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:71,columnNumber:7},void 0),i.thumbnailUrl&&e.jsxDEV("div",{style:{marginTop:"10px"},children:[e.jsxDEV("strong",{children:"Image Test:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:86,columnNumber:11},void 0),e.jsxDEV("img",{src:i.thumbnailUrl,alt:"Debug test",style:{width:"100px",height:"60px",objectFit:"cover",border:"1px solid #ccc",borderRadius:"4px",display:"block",marginTop:"5px"},onLoad:()=>{},onError:()=>{}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:87,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:85,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/ImageDebugger.jsx",lineNumber:32,columnNumber:5},void 0)},we=n.memo(({post:s,featured:r=!1,priority:i=!1,showDebug:l=!1})=>{const o=()=>"Admin";if(r){const f=H(s.content,s.featured_image_url);return e.jsxDEV(C,{to:`/${s.slug}`,className:"featured",children:[f&&e.jsxDEV("div",{className:"featured-image",children:e.jsxDEV(B,{src:f,alt:s.title,width:800,height:200,priority:i||r,style:{borderRadius:"8px",marginBottom:"15px"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:21,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:20,columnNumber:11},void 0),e.jsxDEV("div",{className:"featured-title",children:s.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:34,columnNumber:9},void 0),e.jsxDEV("div",{className:"featured-content",children:K(s.content,200)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:35,columnNumber:9},void 0),e.jsxDEV("div",{className:"featured-author",children:["By ",o()]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:38,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:18,columnNumber:7},void 0)}const t=H(s.content,s.featured_image_url);return e.jsxDEV(e.Fragment,{children:[e.jsxDEV(C,{to:`/${s.slug}`,className:"poem-card",children:[t&&e.jsxDEV("div",{className:"poem-image",children:e.jsxDEV(B,{src:t,alt:s.title,width:400,height:150,lazy:!i,priority:i,style:{borderRadius:"8px",marginBottom:"10px"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:52,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:51,columnNumber:11},void 0),e.jsxDEV("div",{className:"poem-title",children:s.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:66,columnNumber:9},void 0),e.jsxDEV("div",{className:"poem-preview",children:K(s.content)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:67,columnNumber:9},void 0),e.jsxDEV("div",{className:"poem-meta",children:[e.jsxDEV("div",{className:"author",children:["By ",o()]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:71,columnNumber:11},void 0),e.jsxDEV("div",{className:"date",children:Ne(s.published_at)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:72,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:70,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:49,columnNumber:7},void 0),l&&e.jsxDEV(Ve,{post:s,showDebug:l},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:75,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/PostCard.jsx",lineNumber:48,columnNumber:5},void 0)},(s,r)=>s.post.id===r.post.id&&s.featured===r.featured&&s.priority===r.priority);we.displayName="PostCard";const Se=n.memo(()=>{const s=r=>{r.preventDefault(),alert(`Featured शायरी:

"दिल से दिल तक का सफर
शब्दों में बयाँ करता है
हर एक शायर अपनी कलम से
जिंदगी का राज़ बताता है"

- फीचर्ड पोएट`)};return e.jsxDEV("section",{className:"hero",children:e.jsxDEV("div",{className:"container",children:e.jsxDEV("div",{className:"hero-content",children:e.jsxDEV("div",{className:"hero-banner",children:[e.jsxDEV("div",{className:"hero-image-placeholder"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:14,columnNumber:13},void 0),e.jsxDEV("div",{className:"hero-text",children:[e.jsxDEV("h2",{className:"hero-title",children:"आज की खास शायरी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:16,columnNumber:15},void 0),e.jsxDEV("p",{className:"hero-subtitle",children:"प्रेम, दुख, खुशी की अनमोल शायरियाँ"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:17,columnNumber:15},void 0),e.jsxDEV("button",{className:"btn btn--primary",onClick:s,children:"Read More"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:18,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:15,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:13,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:12,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:11,columnNumber:7},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/HeroSection.jsx",lineNumber:10,columnNumber:5},void 0)});Se.displayName="HeroSection";const Q=n.memo(()=>{const s=[{id:1,title:"दिल की आवाज़",author:"राहुल शर्मा",likes:456},{id:2,title:"मोहब्बत का एहसास",author:"प्रिया गुप्ता",likes:389},{id:3,title:"जिंदगी के रंग",author:"अमित कुमार",likes:298}];return e.jsxDEV("div",{className:"widget",children:[e.jsxDEV("h4",{className:"widget-title",children:"Popular शायरी"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:28,columnNumber:7},void 0),e.jsxDEV("div",{className:"popular-list",children:s.map(r=>e.jsxDEV("div",{className:"popular-item",children:[e.jsxDEV("h5",{children:r.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:32,columnNumber:13},void 0),e.jsxDEV("p",{className:"popular-author",children:r.author},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:33,columnNumber:13},void 0),e.jsxDEV("span",{className:"popular-likes",children:[r.likes," ❤️"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:34,columnNumber:13},void 0)]},r.id,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:31,columnNumber:11},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:29,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/PopularShayari.jsx",lineNumber:27,columnNumber:5},void 0)});Q.displayName="PopularShayari";const Z=n.memo(({onCategoryChange:s,selectedCategory:r="all"})=>{const[i,l]=n.useState([]),[o,t]=n.useState(!0);n.useEffect(()=>{j(null,null,function*(){try{const u=yield ve();l(u||[])}catch(u){}finally{t(!1)}})},[]);const f=(a,u)=>{if(a.preventDefault(),s)s(u);else{const c=i.find(p=>p.slug===u);alert(`${(c==null?void 0:c.name)||u} फ़िल्टर लागू किया गया!`)}};return e.jsxDEV("div",{className:"widget",children:[e.jsxDEV("h4",{className:"widget-title",children:"श्रेणियाँ"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/CategoriesWidget.jsx",lineNumber:37,columnNumber:7},void 0),e.jsxDEV("div",{className:"categories-list",id:"categoriesList",children:[e.jsxDEV("a",{href:"#",className:`category-link ${r==="all"?"active":""}`,onClick:a=>f(a,"all"),children:"सभी श्रेणियाँ"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/CategoriesWidget.jsx",lineNumber:40,columnNumber:9},void 0),o?e.jsxDEV("div",{children:"Loading categories..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/CategoriesWidget.jsx",lineNumber:50,columnNumber:11},void 0):i.map(a=>e.jsxDEV("a",{href:"#",className:`category-link ${r===a.slug?"active":""}`,onClick:u=>f(u,a.slug),children:a.name},a.id,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/CategoriesWidget.jsx",lineNumber:53,columnNumber:13},void 0))]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/CategoriesWidget.jsx",lineNumber:38,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/CategoriesWidget.jsx",lineNumber:36,columnNumber:5},void 0)});Z.displayName="CategoriesWidget";const ee=n.memo(()=>{const s=[{id:1,title:"खुशियों का मंजर",date:"28 जनवरी 2025",slug:"khushiyon-ka-manjar"},{id:2,title:"दोस्ती का रिश्ता",date:"25 जनवरी 2025",slug:"dosti-ka-rishta"}];return e.jsxDEV("div",{className:"widget",children:[e.jsxDEV("h4",{className:"widget-title",children:"Recent Posts"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:23,columnNumber:7},void 0),e.jsxDEV("div",{className:"recent-list",children:s.map(r=>e.jsxDEV("div",{className:"recent-item",children:[e.jsxDEV("div",{className:"recent-image-placeholder"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:27,columnNumber:13},void 0),e.jsxDEV("div",{className:"recent-content",children:[e.jsxDEV("h5",{children:e.jsxDEV(C,{to:`/${r.slug}`,children:r.title},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:30,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:29,columnNumber:15},void 0),e.jsxDEV("p",{className:"recent-date",children:r.date},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:34,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:28,columnNumber:13},void 0)]},r.id,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:26,columnNumber:11},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:24,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/RecentPosts.jsx",lineNumber:22,columnNumber:5},void 0)});ee.displayName="RecentPosts";const se=n.memo(()=>{const s=[{name:"राहुल शर्मा",bio:"प्रेम और जिंदगी की शायरी के मशहूर लेखक",username:"rahul-sharma",postsCount:45,specialty:"प्रेम शायरी"},{name:"प्रिया गुप्ता",bio:"दुख और खुशी की भावनाओं की कुशल कवयित्री",username:"priya-gupta",postsCount:32,specialty:"भावनात्मक शायरी"},{name:"अमित कुमार",bio:"जिंदगी के रंगों को शब्दों में पिरोने वाले शायर",username:"amit-kumar",postsCount:28,specialty:"जिंदगी शायरी"}],r=new Date().getHours(),i=s[r%s.length];return e.jsxDEV("div",{className:"widget",children:[e.jsxDEV("h4",{className:"widget-title",children:"Author Spotlight"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:36,columnNumber:7},void 0),e.jsxDEV("div",{className:"author-spotlight",children:[e.jsxDEV("div",{className:"author-image-placeholder"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:38,columnNumber:9},void 0),e.jsxDEV("h5",{children:i.name},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:39,columnNumber:9},void 0),e.jsxDEV("p",{className:"author-bio",children:i.bio},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:40,columnNumber:9},void 0),e.jsxDEV(C,{to:`/author/${i.username}`,className:"btn btn--sm btn--outline",children:"View Profile"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:41,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:37,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/AuthorSpotlight.jsx",lineNumber:35,columnNumber:5},void 0)});se.displayName="AuthorSpotlight";const re=n.memo(()=>{const[s,r]=n.useState(""),[i,l]=n.useState(!1),[o,t]=n.useState(!1),f=u=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u),a=u=>j(null,null,function*(){if(u.preventDefault(),!s.trim()||!f(s)){alert("कृपया वैध ईमेल पता दर्ज करें।");return}l(!0),setTimeout(()=>{t(!0),r(""),l(!1),setTimeout(()=>{t(!1)},3e3)},1e3)});return o?e.jsxDEV("div",{className:"widget",children:[e.jsxDEV("h4",{className:"widget-title",children:"Newsletter"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:39,columnNumber:9},void 0),e.jsxDEV("div",{className:"newsletter-signup",children:e.jsxDEV("div",{className:"success-message",children:[e.jsxDEV("div",{className:"success-icon",children:"✅"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:42,columnNumber:13},void 0),e.jsxDEV("h5",{children:"धन्यवाद!"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:43,columnNumber:13},void 0),e.jsxDEV("p",{children:["आपका सब्स्क्रिप्शन सफल रहा।",e.jsxDEV("br",{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:44,columnNumber:43},void 0),"अब आपको रोज़ाना नई शायरी मिलती रहेगी।"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:44,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:41,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:40,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:38,columnNumber:7},void 0):e.jsxDEV("div",{className:"widget",children:[e.jsxDEV("h4",{className:"widget-title",children:"Newsletter"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:53,columnNumber:7},void 0),e.jsxDEV("div",{className:"newsletter-signup",children:[e.jsxDEV("p",{children:"रोज़ाना नई शायरी पाएं"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:55,columnNumber:9},void 0),e.jsxDEV("form",{onSubmit:a,children:[e.jsxDEV("input",{type:"email",className:"form-control",placeholder:"Your email",value:s,onChange:u=>r(u.target.value),disabled:i},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:57,columnNumber:11},void 0),e.jsxDEV("button",{type:"submit",className:"btn btn--primary btn--full-width mt-8",disabled:i,children:i?"Subscribing...":"Subscribe"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:65,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:56,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:54,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/widgets/NewsletterSignup.jsx",lineNumber:52,columnNumber:5},void 0)});re.displayName="NewsletterSignup";const Pe=n.memo(({selectedCategory:s,onCategoryChange:r})=>e.jsxDEV("aside",{className:"sidebar",children:[e.jsxDEV(Q,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Sidebar.jsx",lineNumber:11,columnNumber:7},void 0),e.jsxDEV(Z,{selectedCategory:s,onCategoryChange:r},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Sidebar.jsx",lineNumber:12,columnNumber:7},void 0),e.jsxDEV(ee,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Sidebar.jsx",lineNumber:16,columnNumber:7},void 0),e.jsxDEV(se,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Sidebar.jsx",lineNumber:17,columnNumber:7},void 0),e.jsxDEV(re,{},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Sidebar.jsx",lineNumber:18,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/Sidebar.jsx",lineNumber:10,columnNumber:5},void 0));Pe.displayName="Sidebar";const Ce=({value:s,onChange:r,placeholder:i="Start writing..."})=>{const l=n.useRef(null),[o,t]=n.useState(s||"");n.useEffect(()=>{t(s||"")},[s]);const f=(p,U,x,y)=>{t(p),r(p)},a={toolbar:{container:[[{header:[1,2,3,!1]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{align:[]}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],["blockquote","code-block"],["link","image"],["clean"],["center-text","hindi-format"]],handlers:{"center-text":function(){this.quill.getSelection()&&this.quill.format("align","center")},"hindi-format":function(){this.quill.getSelection()&&(this.quill.format("align","center"),this.quill.format("size","large"))}}},clipboard:{matchVisual:!1}},u=["header","font","size","bold","italic","underline","strike","blockquote","list","bullet","indent","link","image","video","align","color","background","code-block"],c={minHeight:"400px",fontFamily:'"Noto Sans Devanagari", "Mangal", "Kruti Dev 010", Arial, sans-serif'};return e.jsxDEV("div",{className:"rich-text-editor",children:[e.jsxDEV(ae,{ref:l,theme:"snow",value:o,onChange:f,modules:a,formats:u,placeholder:i,style:c},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:72,columnNumber:7},void 0),e.jsxDEV("div",{className:"editor-help",children:e.jsxDEV("details",{children:[e.jsxDEV("summary",{children:"Formatting Tips"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:85,columnNumber:11},void 0),e.jsxDEV("div",{className:"help-content",children:[e.jsxDEV("h4",{children:"For Hindi Shayari:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:87,columnNumber:13},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Center Text:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:89,columnNumber:19},void 0)," Use the center alignment button for verses"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:89,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Line Breaks:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:90,columnNumber:19},void 0)," Press Shift+Enter for line breaks within verses"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:90,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Stanza Breaks:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:91,columnNumber:19},void 0)," Press Enter twice for stanza separation"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:91,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("strong",{children:"Emphasis:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:92,columnNumber:19},void 0)," Use bold or italic for emphasis"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:92,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:88,columnNumber:13},void 0),e.jsxDEV("h4",{children:"Keyboard Shortcuts:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:94,columnNumber:13},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+B"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:96,columnNumber:19},void 0)," - Bold"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:96,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+I"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:97,columnNumber:19},void 0)," - Italic"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:97,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+U"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:98,columnNumber:19},void 0)," - Underline"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:98,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+Shift+C"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:99,columnNumber:19},void 0)," - Center align"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:99,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+Z"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:100,columnNumber:19},void 0)," - Undo"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:100,columnNumber:15},void 0),e.jsxDEV("li",{children:[e.jsxDEV("kbd",{children:"Ctrl+Y"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:101,columnNumber:19},void 0)," - Redo"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:101,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:95,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:86,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:84,columnNumber:9},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:83,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",global:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:107,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/RichTextEditor.jsx",lineNumber:71,columnNumber:5},void 0)},Le=({currentImage:s,onImageUpload:r,maxSize:i=5*1024*1024})=>{const[l,o]=n.useState(!1),[t,f]=n.useState(!1),[a,u]=n.useState(0),c=n.useRef(null),p=n.useCallback(m=>j(null,null,function*(){if(!m||m.length===0)return;const k=m[0];if(!k.type.startsWith("image/")){E.error("Please select an image file");return}if(k.size>i){E.error(`Image size must be less than ${Math.round(i/1024/1024)}MB`);return}yield U(k)}),[i]),U=m=>j(null,null,function*(){o(!0),u(0);try{const k=yield xe(m,{maxWidth:1200,maxHeight:800,quality:.8}),T=yield ge(k,{onProgress:S=>{u(Math.round(S))}});if(!T.success)throw new Error(T.error||"Upload failed");r(T.url),E.success("Image uploaded successfully!")}catch(k){E.error(k.message||"Failed to upload image. Please try again.")}finally{o(!1),u(0)}}),x=m=>{m.preventDefault(),f(!0)},y=m=>{m.preventDefault(),f(!1)},N=m=>{m.preventDefault(),f(!1);const k=Array.from(m.dataTransfer.files);p(k)},v=m=>{const k=Array.from(m.target.files);p(k)},d=()=>{r(""),c.current&&(c.current.value="")},b=()=>{var m;(m=c.current)==null||m.click()};return e.jsxDEV("div",{className:"image-uploader",children:[s?e.jsxDEV("div",{className:"current-image",children:[e.jsxDEV("div",{className:"image-preview",children:[e.jsxDEV("img",{src:s,alt:"Featured"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:105,columnNumber:13},void 0),e.jsxDEV("div",{className:"image-overlay",children:[e.jsxDEV("button",{type:"button",onClick:b,className:"btn btn-sm btn-primary",disabled:l,children:"Change"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:107,columnNumber:15},void 0),e.jsxDEV("button",{type:"button",onClick:d,className:"btn btn-sm btn-danger",disabled:l,children:"Remove"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:115,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:106,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:104,columnNumber:11},void 0),e.jsxDEV("div",{className:"image-info",children:e.jsxDEV("p",{className:"image-url",children:s},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:126,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:125,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:103,columnNumber:9},void 0):e.jsxDEV("div",{className:`upload-area ${t?"drag-over":""} ${l?"uploading":""}`,onDragOver:x,onDragLeave:y,onDrop:N,onClick:b,children:l?e.jsxDEV("div",{className:"upload-progress",children:[e.jsxDEV("div",{className:"progress-bar",children:e.jsxDEV("div",{className:"progress-fill",style:{width:`${a}%`}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:140,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:139,columnNumber:15},void 0),e.jsxDEV("p",{children:["Uploading... ",a,"%"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:145,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:138,columnNumber:13},void 0):e.jsxDEV("div",{className:"upload-content",children:[e.jsxDEV("div",{className:"upload-icon",children:"📷"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:149,columnNumber:15},void 0),e.jsxDEV("h3",{children:"Upload Featured Image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:150,columnNumber:15},void 0),e.jsxDEV("p",{children:"Drag and drop an image here, or click to browse"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:151,columnNumber:15},void 0),e.jsxDEV("p",{className:"upload-hint",children:["Supports JPG, PNG, WebP • Max ",Math.round(i/1024/1024),"MB"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:152,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:148,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:130,columnNumber:9},void 0),e.jsxDEV("input",{ref:c,type:"file",accept:"image/*",onChange:v,style:{display:"none"}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:160,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:168,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ImageUploader.jsx",lineNumber:101,columnNumber:5},void 0)},Ie=({data:s})=>{const r=o=>{if(!o)return"Not published";try{return new Date(o).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}catch(t){return"Invalid date"}},i=n.useMemo(()=>{if(!s.content)return"";const o=document.createElement("div");return o.innerHTML=s.content,o.innerHTML},[s.content]),l=n.useMemo(()=>{if(s.excerpt)return s.excerpt;if(s.content){const o=document.createElement("div");o.innerHTML=s.content;const t=o.textContent||o.innerText||"";return t.substring(0,150)+(t.length>150?"...":"")}return"No excerpt available"},[s.content,s.excerpt]);return e.jsxDEV("div",{className:"post-preview",children:[e.jsxDEV("div",{className:"preview-header",children:[e.jsxDEV("h1",{children:"Preview Mode"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:49,columnNumber:9},void 0),e.jsxDEV("div",{className:"preview-status",children:e.jsxDEV("span",{className:`status-badge status-${s.status||"draft"}`,children:s.status||"draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:51,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:50,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:48,columnNumber:7},void 0),e.jsxDEV("article",{className:"preview-article",children:[s.featured_image_url&&e.jsxDEV("div",{className:"featured-image",children:e.jsxDEV("img",{src:s.featured_image_url,alt:s.title||"Featured image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:61,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:60,columnNumber:11},void 0),e.jsxDEV("header",{className:"post-header",children:[e.jsxDEV("h1",{className:"post-title",children:s.title||"Untitled Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:70,columnNumber:11},void 0),e.jsxDEV("div",{className:"post-meta",children:[e.jsxDEV("time",{className:"post-date",children:r(s.published_at||s.created_at)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:75,columnNumber:13},void 0),s.slug&&e.jsxDEV("div",{className:"post-url",children:[e.jsxDEV("strong",{children:"URL:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:80,columnNumber:17},void 0)," /",s.slug]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:79,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:74,columnNumber:11},void 0),l&&e.jsxDEV("div",{className:"post-excerpt",children:l},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:86,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:69,columnNumber:9},void 0),e.jsxDEV("div",{className:"post-content",children:i?e.jsxDEV("div",{dangerouslySetInnerHTML:{__html:i}},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:95,columnNumber:13},void 0):e.jsxDEV("p",{className:"no-content",children:"No content available"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:97,columnNumber:13},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:93,columnNumber:9},void 0),(s.meta_title||s.meta_description)&&e.jsxDEV("div",{className:"seo-preview",children:[e.jsxDEV("h3",{children:"SEO Preview"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:104,columnNumber:13},void 0),e.jsxDEV("div",{className:"search-result-preview",children:[e.jsxDEV("div",{className:"search-title",children:s.meta_title||s.title||"Untitled Post"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:106,columnNumber:15},void 0),e.jsxDEV("div",{className:"search-url",children:[window.location.origin,"/",s.slug||"untitled-post"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:109,columnNumber:15},void 0),e.jsxDEV("div",{className:"search-description",children:s.meta_description||l},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:112,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:105,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:103,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:57,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:120,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostPreview.jsx",lineNumber:47,columnNumber:5},void 0)},He=({initialData:s=null,onSave:r,onCancel:i,loading:l=!1,isEditing:o=!1})=>{const[t,f]=n.useState(!1),[a,u]=n.useState(!1),[c,p]=n.useState(null),[U,x]=n.useState(!1),{register:y,handleSubmit:N,watch:v,setValue:d,getValues:b,formState:{errors:m,isDirty:k},reset:T}=me({defaultValues:{title:(s==null?void 0:s.title)||"",slug:(s==null?void 0:s.slug)||"",content:(s==null?void 0:s.content)||"",excerpt:(s==null?void 0:s.excerpt)||"",featured_image_url:(s==null?void 0:s.featured_image_url)||"",meta_title:(s==null?void 0:s.meta_title)||"",meta_description:(s==null?void 0:s.meta_description)||"",status:(s==null?void 0:s.status)||"draft"}}),S=v("title"),V=v("slug"),D=v("content");n.useEffect(()=>{if(S&&!o){const _=ke(S);d("slug",_)}},[S,d,o]),n.useEffect(()=>{const P=setTimeout(()=>j(null,null,function*(){if(V&&V!==(s==null?void 0:s.slug)){x(!0);try{(yield he(V,s==null?void 0:s.id))||E.error("This slug is already taken. Please choose a different one.")}catch(oe){}finally{x(!1)}}}),500);return()=>clearTimeout(P)},[V,s==null?void 0:s.slug,s==null?void 0:s.id]),n.useEffect(()=>{if(k&&(S||D)){const _=setTimeout(()=>j(null,null,function*(){yield F()}),3e4);return()=>clearTimeout(_)}},[k,S,D]);const F=()=>j(null,null,function*(){if(k){u(!0);try{const _=v();if(o&&(s!=null&&s.id))yield Y(s.id,h(g({},_),{status:"draft"}));else if(_.title||_.content){const P=yield G(h(g({},_),{status:"draft"}));P&&!s&&window.history.replaceState(null,"",`/admin/edit/${P.id}`)}p(new Date)}catch(_){}finally{u(!1)}}}),L=_=>j(null,null,function*(){try{let P;return o?P=yield Y(s.id,_):P=yield G(_),r(_,_.status==="draft"),P}catch(P){throw E.error("Failed to save post. Please try again."),P}}),I=()=>{d("status","draft"),N(L)()},z=()=>{d("status","published"),d("published_at",new Date().toISOString()),N(L)()},w=n.useCallback(_=>{d("content",_,{shouldDirty:!0})},[d]),$=n.useCallback(_=>{d("featured_image_url",_,{shouldDirty:!0})},[d]);return e.jsxDEV("div",{className:"post-editor",children:[e.jsxDEV("div",{className:"editor-header",children:[e.jsxDEV("div",{className:"editor-actions",children:[e.jsxDEV("button",{type:"button",onClick:()=>f(!t),className:"btn btn-outline",children:t?"📝 Edit":"👁️ Preview"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:152,columnNumber:11},void 0),e.jsxDEV("div",{className:"save-status",children:[a&&e.jsxDEV("span",{className:"auto-saving",children:"Auto-saving..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:161,columnNumber:28},void 0),c&&!a&&e.jsxDEV("span",{className:"last-saved",children:["Saved ",c.toLocaleTimeString()]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:163,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:160,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:151,columnNumber:9},void 0),e.jsxDEV("div",{className:"primary-actions",children:[e.jsxDEV("button",{type:"button",onClick:i,className:"btn btn-secondary",disabled:l,children:"Cancel"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:171,columnNumber:11},void 0),e.jsxDEV("button",{type:"button",onClick:I,className:"btn btn-outline",disabled:l,children:l?"Saving...":"Save Draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:179,columnNumber:11},void 0),e.jsxDEV("button",{type:"button",onClick:z,className:"btn btn-primary",disabled:l||!S,children:l?"Publishing...":"Publish"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:187,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:170,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:150,columnNumber:7},void 0),e.jsxDEV("div",{className:"editor-content",children:t?e.jsxDEV(Ie,{data:v()},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:200,columnNumber:11},void 0):e.jsxDEV("form",{onSubmit:N(L),className:"post-form",children:[e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"title",children:"Title *"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:205,columnNumber:17},void 0),e.jsxDEV("input",h(g({id:"title",type:"text"},y("title",{required:"Title is required",minLength:{value:3,message:"Title must be at least 3 characters"}})),{className:`form-control ${m.title?"error":""}`,placeholder:"Enter post title..."}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:206,columnNumber:17},void 0),m.title&&e.jsxDEV("span",{className:"error-message",children:m.title.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:216,columnNumber:34},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:204,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:203,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"slug",children:["URL Slug *",U&&e.jsxDEV("span",{className:"checking",children:"Checking..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:224,columnNumber:36},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:222,columnNumber:17},void 0),e.jsxDEV("div",{className:"slug-input",children:[e.jsxDEV("span",{className:"slug-prefix",children:["/",window.location.host,"/"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:227,columnNumber:19},void 0),e.jsxDEV("input",h(g({id:"slug",type:"text"},y("slug",{required:"Slug is required",pattern:{value:/^[a-z0-9-]+$/,message:"Slug can only contain lowercase letters, numbers, and hyphens"}})),{className:`form-control ${m.slug?"error":""}`,placeholder:"post-url-slug"}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:228,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:226,columnNumber:17},void 0),m.slug&&e.jsxDEV("span",{className:"error-message",children:m.slug.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:242,columnNumber:33},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:221,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:220,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"excerpt",children:"Excerpt"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:248,columnNumber:17},void 0),e.jsxDEV("textarea",h(g({id:"excerpt"},y("excerpt")),{className:"form-control",rows:"3",placeholder:"Brief description of the post..."}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:249,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:247,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:246,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{children:"Featured Image"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:261,columnNumber:17},void 0),e.jsxDEV(Le,{currentImage:v("featured_image_url"),onImageUpload:$},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:262,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:260,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:259,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-row",children:e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"content",children:"Content"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:271,columnNumber:17},void 0),e.jsxDEV(Ce,{value:D,onChange:w,placeholder:"Write your post content here..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:272,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:270,columnNumber:15},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:269,columnNumber:13},void 0),e.jsxDEV("details",{className:"seo-section",children:[e.jsxDEV("summary",{children:"SEO Settings"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:281,columnNumber:15},void 0),e.jsxDEV("div",{className:"seo-fields",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"meta_title",children:"Meta Title"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:284,columnNumber:19},void 0),e.jsxDEV("input",h(g({id:"meta_title",type:"text"},y("meta_title")),{className:"form-control",placeholder:"SEO title (leave empty to use post title)"}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:285,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:283,columnNumber:17},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"meta_description",children:"Meta Description"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:294,columnNumber:19},void 0),e.jsxDEV("textarea",h(g({id:"meta_description"},y("meta_description")),{className:"form-control",rows:"2",placeholder:"SEO description (leave empty to use excerpt)"}),void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:295,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:293,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:282,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:280,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:202,columnNumber:11},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:198,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:311,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/PostEditor.jsx",lineNumber:149,columnNumber:5},void 0)},Be=({selectedPosts:s,onActionComplete:r,onClearSelection:i})=>{const[l,o]=n.useState(!1),t=u=>j(null,null,function*(){if(s.length===0){E.error("Please select posts to perform bulk action");return}const c=a(u,s.length);if(confirm(c)){o(!0);try{let p;switch(u){case"publish":p=yield q(s,"published"),E.success(`${p} posts published successfully`);break;case"draft":p=yield q(s,"draft"),E.success(`${p} posts moved to draft`);break;case"private":p=yield q(s,"private"),E.success(`${p} posts made private`);break;case"delete":p=yield f(s),E.success(`${p} posts deleted successfully`);break;default:throw new Error("Invalid bulk action")}r(),i()}catch(p){E.error(`Failed to ${u} posts. Please try again.`)}finally{o(!1)}}}),f=u=>j(null,null,function*(){let c=0;for(const p of u)try{yield De(p),c++}catch(U){}return c}),a=(u,c)=>{const p=c===1?"post":"posts";switch(u){case"publish":return`Are you sure you want to publish ${c} ${p}?`;case"draft":return`Are you sure you want to move ${c} ${p} to draft?`;case"private":return`Are you sure you want to make ${c} ${p} private?`;case"delete":return`Are you sure you want to delete ${c} ${p}? This action cannot be undone.`;default:return`Are you sure you want to perform this action on ${c} ${p}?`}};return s.length===0?null:e.jsxDEV("div",{className:"bulk-actions",children:[e.jsxDEV("div",{className:"bulk-info",children:[e.jsxDEV("span",{className:"selected-count",children:[s.length," post",s.length!==1?"s":""," selected"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:89,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:i,className:"clear-selection",disabled:l,children:"Clear Selection"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:92,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:88,columnNumber:7},void 0),e.jsxDEV("div",{className:"bulk-buttons",children:[e.jsxDEV("button",{type:"button",onClick:()=>t("publish"),className:"btn btn-sm btn-success",disabled:l,children:l?"Processing...":"Publish"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:103,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:()=>t("draft"),className:"btn btn-sm btn-warning",disabled:l,children:l?"Processing...":"Move to Draft"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:111,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:()=>t("private"),className:"btn btn-sm btn-secondary",disabled:l,children:l?"Processing...":"Make Private"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:119,columnNumber:9},void 0),e.jsxDEV("button",{type:"button",onClick:()=>t("delete"),className:"btn btn-sm btn-danger",disabled:l,children:l?"Processing...":"Delete"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:127,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:102,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:137,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/BulkActions.jsx",lineNumber:87,columnNumber:5},void 0)},Oe=({isVisible:s=!1})=>{const[r,i]=n.useState(null),[l,o]=n.useState(null),[t,f]=n.useState(null),[a,u]=n.useState(!1),[c,p]=n.useState("status");n.useEffect(()=>{s&&U()},[s]);const U=()=>{const N=je(),v=ye();i(N),o(v)},x=()=>j(null,null,function*(){u(!0);try{const N=yield _e({includeUploadTest:!1,testImageUrl:null});f(N),p("tests")}catch(N){}finally{u(!1)}}),y=N=>{Ee.switchProvider(N)&&U()};return s?e.jsxDEV("div",{className:"storage-debugger",children:[e.jsxDEV("div",{className:"debugger-header",children:[e.jsxDEV("h3",{children:"🔧 Storage System Debugger"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:60,columnNumber:9},void 0),e.jsxDEV("div",{className:"debugger-tabs",children:[e.jsxDEV("button",{className:c==="status"?"active":"",onClick:()=>p("status"),children:"Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:62,columnNumber:11},void 0),e.jsxDEV("button",{className:c==="config"?"active":"",onClick:()=>p("config"),children:"Config"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:68,columnNumber:11},void 0),e.jsxDEV("button",{className:c==="tests"?"active":"",onClick:()=>p("tests"),children:"Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:74,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:61,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:59,columnNumber:7},void 0),e.jsxDEV("div",{className:"debugger-content",children:[c==="status"&&e.jsxDEV("div",{className:"status-tab",children:[e.jsxDEV("div",{className:"status-section",children:[e.jsxDEV("h4",{children:"Current Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:87,columnNumber:15},void 0),r&&e.jsxDEV("div",{className:"status-info",children:[e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("strong",{children:"Active Provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:91,columnNumber:21},void 0),e.jsxDEV("span",{className:`provider-badge ${r.current}`,children:r.current||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:92,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:90,columnNumber:19},void 0),e.jsxDEV("div",{className:"status-item",children:[e.jsxDEV("strong",{children:"Fallback Provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:97,columnNumber:21},void 0),e.jsxDEV("span",{className:"provider-badge",children:r.fallback||"None"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:98,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:96,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:89,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:86,columnNumber:13},void 0),e.jsxDEV("div",{className:"providers-section",children:[e.jsxDEV("h4",{children:"Available Providers"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:107,columnNumber:15},void 0),r&&e.jsxDEV("div",{className:"providers-list",children:Object.entries(r.providers).map(([N,v])=>e.jsxDEV("div",{className:`provider-item ${v.configured?"configured":"not-configured"}`,children:[e.jsxDEV("div",{className:"provider-info",children:[e.jsxDEV("span",{className:"provider-name",children:N},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:113,columnNumber:25},void 0),e.jsxDEV("span",{className:`status-indicator ${v.configured?"configured":"not-configured"}`,children:v.configured?"✅ Configured":"❌ Not Configured"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:114,columnNumber:25},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:112,columnNumber:23},void 0),v.configured&&N!==r.current&&e.jsxDEV("button",{className:"switch-btn",onClick:()=>y(N),children:["Switch to ",N]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:119,columnNumber:25},void 0)]},N,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:111,columnNumber:21},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:109,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:106,columnNumber:13},void 0),e.jsxDEV("div",{className:"actions-section",children:[e.jsxDEV("button",{onClick:U,className:"refresh-btn",children:"🔄 Refresh Status"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:133,columnNumber:15},void 0),e.jsxDEV("button",{onClick:x,className:"test-btn",disabled:a,children:a?"🧪 Running Tests...":"🧪 Run Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:136,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:132,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:85,columnNumber:11},void 0),c==="config"&&e.jsxDEV("div",{className:"config-tab",children:[e.jsxDEV("div",{className:"validation-section",children:[e.jsxDEV("h4",{children:"Configuration Validation"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:150,columnNumber:15},void 0),l&&e.jsxDEV("div",{className:`validation-result ${l.valid?"valid":"invalid"}`,children:[e.jsxDEV("div",{className:"validation-status",children:l.valid?"✅ Valid Configuration":"❌ Configuration Issues"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:153,columnNumber:19},void 0),l.errors.length>0&&e.jsxDEV("div",{className:"validation-errors",children:[e.jsxDEV("strong",{children:"Errors:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:159,columnNumber:23},void 0),e.jsxDEV("ul",{children:l.errors.map((N,v)=>e.jsxDEV("li",{className:"error",children:N},v,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:162,columnNumber:27},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:160,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:158,columnNumber:21},void 0),l.warnings.length>0&&e.jsxDEV("div",{className:"validation-warnings",children:[e.jsxDEV("strong",{children:"Warnings:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:170,columnNumber:23},void 0),e.jsxDEV("ul",{children:l.warnings.map((N,v)=>e.jsxDEV("li",{className:"warning",children:N},v,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:173,columnNumber:27},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:171,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:169,columnNumber:21},void 0),e.jsxDEV("div",{className:"validation-stats",children:e.jsxDEV("span",{children:["Configured Providers: ",l.configuredProviders,"/",l.totalProviders]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:180,columnNumber:21},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:179,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:152,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:149,columnNumber:13},void 0),e.jsxDEV("div",{className:"env-vars-section",children:[e.jsxDEV("h4",{children:"Environment Variables"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:187,columnNumber:15},void 0),e.jsxDEV("div",{className:"env-vars-info",children:[e.jsxDEV("p",{children:"Check your environment variables for each provider:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:189,columnNumber:17},void 0),e.jsxDEV("div",{className:"env-vars-list",children:[e.jsxDEV("div",{className:"env-var-group",children:[e.jsxDEV("strong",{children:"Supabase:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:192,columnNumber:21},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"VITE_SUPABASE_URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:194,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_SUPABASE_ANON_KEY"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:195,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:193,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:191,columnNumber:19},void 0),e.jsxDEV("div",{className:"env-var-group",children:[e.jsxDEV("strong",{children:"Cloudflare R2:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:199,columnNumber:21},void 0),e.jsxDEV("ul",{children:[e.jsxDEV("li",{children:"VITE_CLOUDFLARE_ACCOUNT_ID"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:201,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_ACCESS_KEY_ID"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:202,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:203,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_BUCKET_NAME"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:204,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_PUBLIC_URL"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:205,columnNumber:23},void 0),e.jsxDEV("li",{children:"VITE_CLOUDFLARE_R2_ENDPOINT"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:206,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:200,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:198,columnNumber:19},void 0),e.jsxDEV("div",{className:"env-var-group",children:[e.jsxDEV("strong",{children:"General:"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:210,columnNumber:21},void 0),e.jsxDEV("ul",{children:e.jsxDEV("li",{children:"VITE_STORAGE_PROVIDER (optional, defaults to 'supabase')"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:212,columnNumber:23},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:211,columnNumber:21},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:209,columnNumber:19},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:190,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:188,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:186,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:148,columnNumber:11},void 0),c==="tests"&&e.jsxDEV("div",{className:"tests-tab",children:[e.jsxDEV("div",{className:"tests-header",children:[e.jsxDEV("h4",{children:"Validation Tests"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:224,columnNumber:15},void 0),t&&e.jsxDEV("div",{className:`test-summary ${t.success?"success":"failure"}`,children:[t.passedTests,"/",t.totalTests," tests passed (",t.passRate,"%)"]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:226,columnNumber:17},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:223,columnNumber:13},void 0),t&&e.jsxDEV("div",{className:"test-results",children:t.results.map((N,v)=>e.jsxDEV("div",{className:`test-result ${N.passed?"passed":"failed"}`,children:[e.jsxDEV("div",{className:"test-header",children:[e.jsxDEV("span",{className:"test-status",children:N.passed?"✅":"❌"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:237,columnNumber:23},void 0),e.jsxDEV("span",{className:"test-name",children:N.name},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:240,columnNumber:23},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:236,columnNumber:21},void 0),e.jsxDEV("div",{className:"test-message",children:N.message},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:242,columnNumber:21},void 0),N.error&&e.jsxDEV("div",{className:"test-error",children:["Error: ",N.error]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:244,columnNumber:23},void 0),N.details&&e.jsxDEV("details",{className:"test-details",children:[e.jsxDEV("summary",{children:"Details"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:248,columnNumber:25},void 0),e.jsxDEV("pre",{children:JSON.stringify(N.details,null,2)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:249,columnNumber:25},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:247,columnNumber:23},void 0)]},v,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:235,columnNumber:19},void 0))},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:233,columnNumber:15},void 0),!t&&!a&&e.jsxDEV("div",{className:"no-tests",children:e.jsxDEV("p",{children:'No test results available. Click "Run Tests" to validate your storage setup.'},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:259,columnNumber:17},void 0)},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:258,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:222,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:83,columnNumber:7},void 0),e.jsxDEV("style",{jsx:"true",children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:266,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/StorageDebugger.jsx",lineNumber:58,columnNumber:5},void 0):null},Re=()=>{var v,d;const[s,r]=n.useState(""),[i,l]=n.useState(""),[o,t]=n.useState(!1),[f,a]=n.useState(!1),{signIn:u,resetPassword:c}=X(),p=de(),x=((d=(v=O().state)==null?void 0:v.from)==null?void 0:d.pathname)||"/admin/posts",y=b=>j(null,null,function*(){if(b.preventDefault(),!s||!i)return;t(!0);const{error:m}=yield u(s,i);m||p(x,{replace:!0}),t(!1)}),N=b=>j(null,null,function*(){if(b.preventDefault(),!s){alert("Please enter your email address first");return}yield c(s),a(!1)});return e.jsxDEV("div",{className:"login-container",children:[e.jsxDEV("div",{className:"login-card",children:[e.jsxDEV("div",{className:"login-header",children:[e.jsxDEV("h1",{children:"Admin Login"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:45,columnNumber:11},void 0),e.jsxDEV("p",{children:"Sign in to manage your blog"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:46,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:44,columnNumber:9},void 0),f?e.jsxDEV("form",{onSubmit:N,className:"login-form",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"reset-email",children:"Email"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:97,columnNumber:15},void 0),e.jsxDEV("input",{id:"reset-email",type:"email",value:s,onChange:b=>r(b.target.value),placeholder:"Enter your email",required:!0},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:98,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:96,columnNumber:13},void 0),e.jsxDEV("button",{type:"submit",className:"login-button",disabled:!s,children:"Send Reset Email"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:108,columnNumber:13},void 0),e.jsxDEV("button",{type:"button",className:"forgot-password-link",onClick:()=>a(!1),children:"Back to Login"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:116,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:95,columnNumber:11},void 0):e.jsxDEV("form",{onSubmit:y,className:"login-form",children:[e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"email",children:"Email"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:52,columnNumber:15},void 0),e.jsxDEV("input",{id:"email",type:"email",value:s,onChange:b=>r(b.target.value),placeholder:"Enter your email",required:!0,disabled:o},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:53,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:51,columnNumber:13},void 0),e.jsxDEV("div",{className:"form-group",children:[e.jsxDEV("label",{htmlFor:"password",children:"Password"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:65,columnNumber:15},void 0),e.jsxDEV("input",{id:"password",type:"password",value:i,onChange:b=>l(b.target.value),placeholder:"Enter your password",required:!0,disabled:o},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:66,columnNumber:15},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:64,columnNumber:13},void 0),e.jsxDEV("button",{type:"submit",className:"login-button",disabled:o||!s||!i,children:o?"Signing in...":"Sign In"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:77,columnNumber:13},void 0),e.jsxDEV("button",{type:"button",className:"forgot-password-link",onClick:()=>a(!0),disabled:o,children:"Forgot your password?"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:85,columnNumber:13},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:50,columnNumber:11},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:43,columnNumber:7},void 0),e.jsxDEV("style",{jsx:!0,children:`
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
      `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:127,columnNumber:7},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/Login.jsx",lineNumber:42,columnNumber:5},void 0)},Me=Object.freeze(Object.defineProperty({__proto__:null,default:Re},Symbol.toStringTag,{value:"Module"})),Fe=({children:s})=>{const{user:r,loading:i}=X(),l=O();return i?e.jsxDEV("div",{className:"loading-container",children:[e.jsxDEV("div",{className:"spinner"},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:11,columnNumber:9},void 0),e.jsxDEV("p",{children:"Checking authentication..."},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:12,columnNumber:9},void 0),e.jsxDEV("style",{jsx:!0,children:`
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
        `},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:14,columnNumber:9},void 0)]},void 0,!0,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:10,columnNumber:7},void 0):r?s:e.jsxDEV(ce,{to:"/admin/login",state:{from:l},replace:!0},void 0,!1,{fileName:"/Users/bipulkumar/Desktop/site_v2 copy/src/components/admin/ProtectedRoute.jsx",lineNumber:51,columnNumber:12},void 0)},We=Object.freeze(Object.defineProperty({__proto__:null,default:Fe},Symbol.toStringTag,{value:"Module"}));export{$e as A,Be as B,qe as F,Se as H,Me as L,we as P,A as S,Pe as a,Ue as b,He as c,Oe as d,We as e,X as u};
