/* Núcleo das apresentações WMedic: navegação, tema, tela cheia, modo impressão. */
(function(){
const root=document.documentElement;
const deck=document.getElementById('deck');
const slides=[...document.querySelectorAll('.slide')];
const ticks=document.getElementById('ticks');
const printing=/[?&]print\b/.test(location.search);
window.DECK={index:0,scale:1,printing,listeners:[],onChange(f){this.listeners.push(f)}};
const emit=k=>DECK.listeners.forEach(f=>{try{f(k)}catch(e){console.error(e)}});

// tema efetivo (para trocar o logo e reler as cores nos desenhos)
function effTheme(){return root.dataset.theme||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}
function syncTheme(){root.dataset.eff=effTheme()}
syncTheme();
try{matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{syncTheme();emit('theme')})}catch(e){}
window.cssVar=n=>getComputedStyle(root).getPropertyValue(n).trim();

slides.forEach((s,i)=>{const b=document.createElement('button');b.title=(i+1)+'. '+s.dataset.name;b.setAttribute('aria-label',b.title);b.onclick=()=>go(i);ticks.appendChild(b)});

function fit(){const vp=document.getElementById('viewport');const s=Math.min(vp.clientWidth/1600,vp.clientHeight/900);DECK.scale=s;deck.style.transform=`translate(-50%,-50%) scale(${s})`;emit('scale')}
function go(i){i=Math.max(0,Math.min(slides.length-1,i));DECK.index=i;
  slides.forEach((s,k)=>s.classList.toggle('active',k===i));
  [...ticks.children].forEach((b,k)=>{b.classList.toggle('on',k===i);b.classList.toggle('done',k<i)});
  document.getElementById('counter').textContent=String(i+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  if(!printing){try{history.replaceState(null,'',location.pathname+location.search+'#s'+(i+1))}catch(e){}}
  emit('slide');}
DECK.go=go;

if(printing){
  root.classList.add('printing');
  const title=document.querySelector('#nav .title')?.textContent||'';
  slides.forEach((s,i)=>{const f=document.createElement('div');f.className='pfoot';
    f.innerHTML=`<img class="logo-d" src="img/symbol.png" alt=""><img class="logo-l" src="img/symbol.png" alt=""><span>${title}</span><span>${String(i+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}</span>`;s.appendChild(f)});
} else {
  window.addEventListener('resize',fit);fit();
}
document.getElementById('prev').onclick=()=>go(DECK.index-1);
document.getElementById('next').onclick=()=>go(DECK.index+1);
document.addEventListener('keydown',e=>{
  const t=e.target, tag=(t.tagName||'').toLowerCase();
  if(tag==='input'&&(t.type==='text'||t.type==='number'||t.type==='range'&&/Arrow/.test(e.key)))return;
  if(tag==='select')return;
  if(e.key==='ArrowRight'||e.key==='PageDown'||(e.key===' '&&tag!=='button')){e.preventDefault();go(DECK.index+1)}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(DECK.index-1)}
  else if(e.key==='Home')go(0); else if(e.key==='End')go(slides.length-1);
  else if(e.key==='f'||e.key==='F'){toggleFS()}
});
function toggleFS(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>{})}catch(e){}}
document.getElementById('fsBtn').onclick=toggleFS;
document.getElementById('themeBtn').onclick=()=>{root.dataset.theme=effTheme()==='dark'?'light':'dark';syncTheme();emit('theme')};
const m=/^#s(\d+)$/.exec(location.hash);go(m&&!printing?(+m[1]-1):0);
window.addEventListener('hashchange',()=>{const m=/^#s(\d+)$/.exec(location.hash);if(m&&(+m[1]-1)!==DECK.index)go(+m[1]-1)});
// preenchimento dos sliders
window.fillRange=r=>r.style.setProperty('--p',((r.value-r.min)/(r.max-r.min)*100)+'%');
document.querySelectorAll('input[type=range]').forEach(r=>{r.addEventListener('input',()=>fillRange(r));fillRange(r)});
// ícones de traço simples (24×24)
window.ICON={
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
 pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
 steth:'<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-3"/><circle cx="20" cy="11" r="2"/>',
 chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-7"/>',
 headset:'<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
 award:'<circle cx="12" cy="8" r="6"/><path d="M8.2 13.9L7 23l5-3 5 3-1.2-9.1"/>',
 trend:'<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
 video:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-4v12l-6-4z"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
 cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>',
 cycle:'<path d="M21 12a9 9 0 0 1-15.5 6.2M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h-4M6 22v-4h4"/>',
 brand:'<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
 doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
 building:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/>',
 pin:'<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
 handshake:'<path d="M11 17l2 2a1.5 1.5 0 0 0 2-2M14 14l2.5 2.5a1.5 1.5 0 0 0 2-2L15 11M2 11l4-4 5 1 3-2 4 1 4 4M6 7l-4 9 3 3 5-5"/>',
 plug:'<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
 rocket:'<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4l6 0 0 6-8 8-6-6z"/><circle cx="15" cy="9" r="1.5"/>',
 flask:'<path d="M9 2h6M10 2v6L4 20a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 20L14 8V2"/><path d="M7 15h10"/>',
 baby:'<circle cx="12" cy="8" r="5"/><path d="M10 8h.01M14 8h.01M10.5 10.5a2 2 0 0 0 3 0M6 21a6 6 0 0 1 12 0"/>',
 apple:'<path d="M12 7c-2-2-7-1.5-7 4 0 4 3 9 5 9 1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 5-5 5-9 0-5.5-5-6-7-4zM12 7c0-2 1-4 3-5"/>',
 brain:'<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3 2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'
};
window.icon=(k,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]||''}</svg>`;
})();
