// Edit this list to add or change projects. cat = category name.
const designs = [
  {t:"Segregator Burning Machine",i:"images/1.jpg",c:"Recycling"},
  {t:"Charging Vendo Station Machine",i:"images/2.jpg",c:"Vending"},
  {t:"Cassava Maker Machine",i:"images/3.jpg",c:"Food Processing"},
  {t:"Abaca Drying and Flattening Machine",i:"images/4.jpg",c:"Farm & Compost"},
  {t:"Used Candle Recycling Machine",i:"images/5.jpg",c:"Recycling"},
  {t:"Alert Port System",i:"images/6.jpg",c:"Safety & Monitoring"},
  {t:"Coin Color Detection Device",i:"images/7.jpg",c:"Detection"},
  {t:"Compost Maker Machine",i:"images/8.jpg",c:"Farm & Compost"},
  {t:"Live Monitoring Fire Detection Device",i:"images/9.jpg",c:"Safety & Monitoring"},
  {t:"Emergency Keychain Alert Device",i:"images/10.jpg",c:"Safety & Monitoring"},
  {t:"Coconut Milk Grinder Milling Machine",i:"images/11.jpg",c:"Food Processing"},
  {t:"Jackfruit Cooking Machine",i:"images/12.jpg",c:"Food Processing"},
  {t:"Printing Vendo Machine",i:"images/13.jpg",c:"Vending"},
  {t:"Quality Milk Checking Machine",i:"images/14.jpg",c:"Detection"},
  {t:"Compost Mixing Machine",i:"images/15.jpg",c:"Farm & Compost"},
  {t:"Machine Learning Glass Bottle Vendo Machine",i:"images/16.jpg",c:"Vending"},
  {t:"Crayfish Gender Detection Device",i:"images/17.png",c:"Detection"},
  {t:"EcoPad Automated Dispenser Machine",i:"images/18.png",c:"Vending"},
  {t:"Automated Charcoal Mixing and Production Machine",i:"images/19.png",c:"Recycling"},
  {t:"Medical Neuropen Product",i:"images/20.png",c:"Safety & Monitoring"},
  {t:"TogueTech Automated Smart Incubation Machine",i:"images/21.png",c:"Farm & Compost"},
  {t:"Smart Fruit Ripeness Detection Device",i:"images/22.png",c:"Detection"},
  {t:"Cassava Grinding and Pressing Machine",i:"images/23.png",c:"Food Processing"},
  {t:"Automated Recycled Candle Making Machine",i:"images/24.png",c:"Recycling"},
  {t:"Jackfruit Seed Roasting and Grinding Machine",i:"images/25.png",c:"Food Processing"},
  {t:"Smart Automated Cabinet",i:"images/26.png",c:"Safety & Monitoring"},
  {t:"Solar Powered Smart Water and Plant Monitoring System",i:"images/27.png",c:"Farm & Compost"},
  {t:"Smart Eggplant Ripeness Detection System",i:"images/28.png",c:"Detection"},
  {t:"Smart Mushroom Greenhouse Monitoring System",i:"images/29.png",c:"Farm & Compost"},
  {t:"Smart Smoke and Gas Detection Device",i:"images/30.png",c:"Safety & Monitoring"}
];
const skills = ["3D Modeling","Texturing","Lighting & Rendering","Prototype Visualization","3D Printing Files","Website Development"];

const $ = id => document.getElementById(id);
document.documentElement.classList.add("js");
const io = "IntersectionObserver" in window ? new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");o.unobserve(e.target)}}),{threshold:.12}) : null;
function watch(list){ list.forEach(el => io ? io.observe(el) : el.classList.add("in")); }
const cats = ["All", ...new Set(designs.map(d => d.c))];
let active = "All", shown = [], idx = 0, lastFocus = null;

function renderFilters(){
  $("filters").innerHTML = cats.map(c =>
    `<button class="chip" aria-pressed="${c===active}" data-cat="${c}">${c}</button>`).join("");
}
function renderGallery(){
  shown = designs.filter(d => active === "All" || d.c === active);
  $("galleryGrid").innerHTML = shown.map((d,n) => `
    <button class="card reveal" style="--d:${(n%6)*70}ms" data-n="${n}" aria-label="View ${d.t}">
      <img src="${d.i}" alt="3D design: ${d.t}" loading="lazy" decoding="async">
      <span class="card-body"><span class="tag">${d.c}</span><h3>${d.t}</h3></span>
    </button>`).join("");
  watch($("galleryGrid").querySelectorAll(".reveal"));
  $("resultCount").textContent = `Showing ${shown.length} of ${designs.length} projects`;
}
$("filters").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  active = b.dataset.cat; renderFilters(); renderGallery();
});
$("galleryGrid").addEventListener("click", e => {
  const c = e.target.closest(".card"); if (c) openLb(+c.dataset.n, c);
});

/* lightbox */
const lb = $("lightbox");
function showLb(n){
  resetZoom();
  idx = (n + shown.length) % shown.length;
  const d = shown[idx];
  const im = $("lbImg"); im.classList.remove("ready");
  im.onload = () => im.classList.add("ready");
  im.src = d.i; im.alt = d.t;
  if (im.complete) im.classList.add("ready");
  $("lbCap").textContent = d.t;
  $("lbCount").textContent = `${d.c} · ${idx+1} of ${shown.length}`;
}
function openLb(n, from){
  lastFocus = from; showLb(n); lb.hidden = false;
  document.body.style.overflow = "hidden"; $("lbClose").focus();
}
function closeLb(){
  lb.hidden = true; document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
$("lbClose").onclick = closeLb;
$("prevBtn").onclick = () => showLb(idx-1);
$("nextBtn").onclick = () => showLb(idx+1);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowRight") showLb(idx+1);
  if (e.key === "ArrowLeft") showLb(idx-1);
  if (e.key === "+" || e.key === "=") zoomBy(1.4);
  if (e.key === "-") zoomBy(1/1.4);
  if (e.key === "0") resetZoom();
});
let x0 = null; // swipe on phones
lb.addEventListener("touchstart", e => x0 = e.touches.length === 1 ? e.touches[0].clientX : null, {passive:true});
lb.addEventListener("touchend", e => {
  if (x0 === null || z > 1) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) showLb(idx + (dx < 0 ? 1 : -1));
  x0 = null;
});

/* zoom: wheel, pinch, double-tap/click, drag to pan, +/- buttons */
const stage = document.querySelector(".lb-stage"), zim = $("lbImg");
let z = 1, tx = 0, ty = 0, pd = 0, moved = 0, lastTap = 0;
const pts = new Map();
function applyZoom(){
  const r = stage.getBoundingClientRect(), mx = (z-1)*r.width/2, my = (z-1)*r.height/2;
  tx = Math.max(-mx, Math.min(mx, tx)); ty = Math.max(-my, Math.min(my, ty));
  zim.style.transform = `translate(${tx}px,${ty}px) scale(${z})`;
  stage.classList.toggle("zoomed", z > 1);
}
function zoomTo(nz, cx = 0, cy = 0){
  nz = Math.min(5, Math.max(1, nz)); const k = nz / z;
  tx = cx - (cx - tx) * k; ty = cy - (cy - ty) * k; z = nz;
  if (z === 1) tx = ty = 0;
  applyZoom();
}
function zoomBy(f){ zoomTo(z * f); }
function resetZoom(){ z = 1; tx = ty = 0; applyZoom(); }
const rel = e => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left - r.width/2, e.clientY - r.top - r.height/2]; };
const gap = () => { const [a,b] = [...pts.values()]; return Math.hypot(a.x-b.x, a.y-b.y); };
stage.addEventListener("wheel", e => { e.preventDefault(); const [x,y] = rel(e); zoomTo(z * (e.deltaY < 0 ? 1.2 : 1/1.2), x, y); }, {passive:false});
stage.addEventListener("pointerdown", e => {
  stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, {x:e.clientX, y:e.clientY});
  if (pts.size === 1) moved = 0; if (pts.size === 2) pd = gap();
  stage.classList.add("dragging");
});
stage.addEventListener("pointermove", e => {
  const p = pts.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
  if (pts.size === 2){
    const [a,b] = [...pts.values()], r = stage.getBoundingClientRect(), nd = gap();
    zoomTo(z * nd / pd, (a.x+b.x)/2 - r.left - r.width/2, (a.y+b.y)/2 - r.top - r.height/2); pd = nd;
  } else if (z > 1){ tx += dx; ty += dy; applyZoom(); }
});
function endPtr(e){
  if (!pts.delete(e.pointerId)) return;
  if (pts.size === 0){
    stage.classList.remove("dragging");
    if (e.type === "pointerup" && moved < 8){
      const now = Date.now();
      if (now - lastTap < 300){ const [x,y] = rel(e); z > 1 ? zoomTo(1) : zoomTo(2.5, x, y); lastTap = 0; }
      else lastTap = now;
    }
  }
}
stage.addEventListener("pointerup", endPtr); stage.addEventListener("pointercancel", endPtr);
$("zoomIn").onclick = () => zoomBy(1.4);
$("zoomOut").onclick = () => zoomBy(1/1.4);
$("zoomReset").onclick = resetZoom;

/* share: phone share sheet if available, otherwise a small panel */
const sharePanel = $("sharePanel"), shareUrl = $("shareUrl"), shareMsg = $("shareMsg");
const SHARE_TITLE = document.title;
const SHARE_TEXT = "Check out this 3D design portfolio: industrial machines and devices made in Tinkercad.";
let shareFrom = null;
const pageUrl = () => location.href.split("#")[0];
function openShare(from){
  const u = pageUrl(), enc = encodeURIComponent(u);
  shareFrom = from; shareUrl.value = u; shareMsg.textContent = "";
  $("shFb").href = "https://www.facebook.com/sharer/sharer.php?u=" + enc;
  $("shMail").href = "mailto:?subject=" + encodeURIComponent(SHARE_TITLE) + "&body=" + encodeURIComponent(SHARE_TEXT + "\n" + u);
  sharePanel.hidden = false; $("copyLink").focus();
}
function closeShare(){
  sharePanel.hidden = true;
  if (shareFrom) shareFrom.focus();
}
async function copyLink(app){
  const u = pageUrl(), done = app ? `Link copied! Paste it in ${app} (message, story, or post).` : "Link copied!";
  try{
    await navigator.clipboard.writeText(u);
    shareMsg.textContent = done;
  }catch(e){
    shareUrl.focus(); shareUrl.select();
    try{ shareMsg.textContent = document.execCommand("copy") ? done : "Press Ctrl+C (or hold and Copy) to copy the link."; }
    catch(_){ shareMsg.textContent = "Press Ctrl+C (or hold and Copy) to copy the link."; }
  }
}
// Native share sheet only on touch phones/tablets opened from a real http(s) link.
// On laptops/desktop (and file:// previews) the built-in panel is used, because Chrome's native share can crash the tab there.
const canNativeShare = () => !!navigator.share && /^https?:$/.test(location.protocol) && window.matchMedia("(pointer: coarse)").matches;
document.querySelectorAll("[data-share]").forEach(btn => btn.addEventListener("click", async () => {
  if (canNativeShare()){
    try{ await navigator.share({title: SHARE_TITLE, text: SHARE_TEXT, url: pageUrl()}); return; }
    catch(e){ if (e && e.name === "AbortError") return; } // user closed the share sheet
  }
  openShare(btn);
}));
$("copyLink").onclick = () => copyLink();
$("shIg").addEventListener("click", () => copyLink("Instagram")); // Instagram/TikTok have no web share link, so we copy it and open the app/site
$("shTt").addEventListener("click", () => copyLink("TikTok"));
$("shareClose").onclick = closeShare;
sharePanel.addEventListener("click", e => { if (e.target === sharePanel) closeShare(); });
shareUrl.addEventListener("focus", () => shareUrl.select());
document.addEventListener("keydown", e => { if (!sharePanel.hidden && e.key === "Escape") closeShare(); });

/* menu + buttons jump straight to the section (no smooth scrolling, easier on slow phones); the section heading blinks so you know you arrived */
function blink(el){
  if (!el) return;
  clearTimeout(el._b);
  const seq = [1,0,1,0]; let i = 0;
  (function step(){ el.classList.toggle("blink", !!seq[i]); if (++i < seq.length) el._b = setTimeout(step, 160); })();
}
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const t = document.getElementById(a.getAttribute("href").slice(1));
  if (t) blink(t.querySelector("h1,h2"));
});

/* nav */
const menu = $("menu"), mb = $("menuBtn");
mb.onclick = () => { const o = menu.classList.toggle("open"); mb.setAttribute("aria-expanded", o); };
menu.addEventListener("click", e => { if (e.target.tagName === "A"){ menu.classList.remove("open"); mb.setAttribute("aria-expanded", false); }});

$("skillsList").innerHTML = skills.map(s => `<li>${s}</li>`).join("");
$("statCount").textContent = designs.length;
$("statCats").textContent = cats.length - 1;
renderFilters(); renderGallery();

const blocks = document.querySelectorAll(".section .wrap > *:not(#galleryGrid)");
blocks.forEach(b => b.classList.add("reveal"));
watch(blocks);
