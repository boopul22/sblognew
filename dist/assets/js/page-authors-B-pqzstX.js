var y=Object.defineProperty,L=Object.defineProperties;var A=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var j=(s,e,r)=>e in s?y(s,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[e]=r,w=(s,e)=>{for(var r in e||(e={}))O.call(e,r)&&j(s,r,e[r]);if(C)for(var r of C(e))b.call(e,r)&&j(s,r,e[r]);return s},v=(s,e)=>L(s,A(e));var x=(s,e,r)=>new Promise((f,p)=>{var _=o=>{try{c(r.next(o))}catch(m){p(m)}},g=o=>{try{c(r.throw(o))}catch(m){p(m)}},c=o=>o.done?f(o.value):Promise.resolve(o.value).then(_,g);c((r=r.apply(s,e)).next())});import{r as h,j as i,L as I}from"./react-vendor-DNThP37t.js";import{s as E}from"./utils-G5iJCnJd.js";import"./vendor-BttnBCBn.js";import"./supabase-vendor-DDc5weSN.js";const F=({searchQuery:s})=>{const[e,r]=h.useState([]),[f,p]=h.useState(!0),[_,g]=h.useState(null);h.useEffect(()=>{c()},[s]);const c=()=>x(null,null,function*(){try{p(!0);let t=`
        SELECT
          u.id, u.wp_id, u.user_login, u.display_name, u.user_registered,
          COUNT(p.id) as post_count
        FROM users u
        LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
      `;s&&s.trim()&&(t+=` WHERE u.display_name ILIKE '%${s}%'`),t+=`
        GROUP BY u.id, u.wp_id, u.user_login, u.display_name, u.user_registered
        HAVING COUNT(p.id) > 0
        ORDER BY COUNT(p.id) DESC
      `;const{data:n,error:u}=yield E.rpc("execute_sql",{query:t});if(u)return yield o();const l=(n==null?void 0:n.map(a=>({id:a.id,wp_id:a.wp_id,user_login:a.user_login,display_name:a.display_name,user_registered:a.user_registered,postCount:parseInt(a.post_count)||0})))||[];r(l)}catch(t){yield o()}finally{p(!1)}}),o=()=>x(null,null,function*(){try{const{data:t,error:n}=yield E.from("posts").select(`
          author_id,
          users!posts_author_id_fkey (
            id,
            wp_id,
            user_login,
            display_name,
            user_registered
          )
        `).eq("status","published");if(n)throw n;const u=new Map;t==null||t.forEach(a=>{const d=a.users;if(d){const N=d.id;u.has(N)?u.get(N).postCount++:u.set(N,v(w({},d),{postCount:1}))}});let l=Array.from(u.values());if(s&&s.trim()){const a=s.toLowerCase();l=l.filter(d=>d.display_name.toLowerCase().includes(a))}l.sort((a,d)=>d.postCount-a.postCount),r(l)}catch(t){g("Failed to load authors")}}),m=t=>t?t.split(" ").map(n=>n.charAt(0)).join("").toUpperCase().substring(0,2):"A";return f?i.jsx("div",{className:"author-grid",children:i.jsx("div",{className:"loading",children:"Loading authors..."})}):_?i.jsx("div",{className:"author-grid",children:i.jsx("div",{className:"error",children:_})}):e.length===0?i.jsx("div",{className:"author-grid",children:i.jsx("div",{className:"loading",children:s?`No authors found for "${s}"`:"No authors available"})}):i.jsx("div",{className:"author-grid",children:e.map(t=>i.jsxs(I,{to:`/author/${t.user_login}`,className:"author-card",children:[i.jsx("div",{className:"author-avatar",children:m(t.display_name)}),i.jsx("div",{className:"author-name",children:t.display_name}),i.jsxs("div",{className:"author-count",children:[t.postCount," ",t.postCount===1?"post":"posts"]})]},t.id))})};export{F as default};
