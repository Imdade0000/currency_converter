"use strict";(()=>{var e={};e.id=164,e.ids=[164,888,660],e.modules={1323:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},7260:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{config:()=>h,default:()=>u,getServerSideProps:()=>m,getStaticPaths:()=>f,getStaticProps:()=>d,reportWebVitals:()=>g,routeModule:()=>q,unstable_getServerProps:()=>S,unstable_getServerSideProps:()=>b,unstable_getStaticParams:()=>P,unstable_getStaticPaths:()=>y,unstable_getStaticProps:()=>x});var n=r(7093),i=r(5244),o=r(1323),l=r(7645),s=r(6814),c=r(6783),p=e([s]);s=(p.then?(await p)():p)[0];let u=(0,o.l)(c,"default"),d=(0,o.l)(c,"getStaticProps"),f=(0,o.l)(c,"getStaticPaths"),m=(0,o.l)(c,"getServerSideProps"),h=(0,o.l)(c,"config"),g=(0,o.l)(c,"reportWebVitals"),x=(0,o.l)(c,"unstable_getStaticProps"),y=(0,o.l)(c,"unstable_getStaticPaths"),P=(0,o.l)(c,"unstable_getStaticParams"),S=(0,o.l)(c,"unstable_getServerProps"),b=(0,o.l)(c,"unstable_getServerSideProps"),q=new n.PagesRouteModule({definition:{kind:i.x.PAGES,page:"/sitemap.xml",pathname:"/sitemap.xml",bundlePath:"",filename:""},components:{App:s.default,Document:l.default},userland:c});a()}catch(e){a(e)}})},7645:(e,t,r)=>{r.r(t),r.d(t,{default:()=>i});var a=r(997),n=r(6859);function i(){return(0,a.jsxs)(n.Html,{lang:"fr",children:[(0,a.jsxs)(n.Head,{children:[a.jsx("meta",{charSet:"utf-8"}),a.jsx("meta",{name:"theme-color",content:"#1e3a5f"}),a.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),a.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),a.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;700;900&display=swap",rel:"stylesheet"}),a.jsx("link",{rel:"icon",href:"/favicon.ico"})]}),(0,a.jsxs)("body",{children:[a.jsx(n.Main,{}),a.jsx(n.NextScript,{})]})]})}},6783:(e,t,r)=>{r.r(t),r.d(t,{default:()=>d,getServerSideProps:()=>u});var a=r(2048),n=r.n(a),i=r(5315),o=r.n(i);let l="https://xchange.africa",s=[{path:"/",priority:"1.0",changefreq:"daily"},{path:"/rates",priority:"0.9",changefreq:"daily"},{path:"/blog",priority:"0.8",changefreq:"weekly"},{path:"/faq",priority:"0.7",changefreq:"monthly"},{path:"/contact",priority:"0.5",changefreq:"monthly"}],c=["dollar-en-franc-cfa","euro-en-franc-cfa","euro-en-naira","dollar-en-naira","dollar-en-franc-cfa-cameroun","euro-en-dirham","livre-en-franc-cfa","yuan-en-franc-cfa","dollar-en-cedi","euro-en-cedi","dollar-en-shilling-kenyan","euro-en-shilling-kenyan","dollar-en-birr","franc-suisse-en-franc-cfa","dollar-canadien-en-franc-cfa"],p=["benin","senegal","cote-divoire","togo","mali","burkina-faso","niger","cameroun","nigeria","ghana","kenya","maroc"],u=async({res:e})=>{let t=[];try{let e=o().join(process.cwd(),"content","blog");n().existsSync(e)&&(t=n().readdirSync(e).filter(e=>e.endsWith(".mdx")||e.endsWith(".md")).map(e=>e.replace(/\.(mdx|md)$/,"")))}catch(e){}let r=function(e){let t=new Date().toISOString().split("T")[0],r=s.map(e=>`
  <url>
    <loc>${l}${e.path}</loc>
    <lastmod>${t}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join(""),a=c.map(e=>`
  <url>
    <loc>${l}/convertir/${e}</loc>
    <lastmod>${t}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join(""),n=p.map(e=>`
  <url>
    <loc>${l}/taux/${e}</loc>
    <lastmod>${t}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join(""),i=e.map(e=>`
  <url>
    <loc>${l}/blog/${e}</loc>
    <lastmod>${t}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("");return`<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${r}
  ${a}
  ${n}
  ${i}
</urlset>`}(t);return e.setHeader("Content-Type","text/xml; charset=utf-8"),e.setHeader("Cache-Control","public, s-maxage=86400, stale-while-revalidate"),e.write(r),e.end(),{props:{}}},d=function(){return null}},5244:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},2785:e=>{e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{e.exports=require("react")},6405:e=>{e.exports=require("react-dom")},997:e=>{e.exports=require("react/jsx-runtime")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},1568:e=>{e.exports=require("zlib")},9648:e=>{e.exports=import("axios")},6197:e=>{e.exports=import("framer-motion")},6201:e=>{e.exports=import("react-hot-toast")},6912:e=>{e.exports=import("zustand")},3602:e=>{e.exports=import("zustand/middleware")}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[567,424,859,814],()=>r(7260));module.exports=a})();