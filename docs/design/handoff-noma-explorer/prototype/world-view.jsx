const {QueryBar,EvidenceTag,Badge,Button,Card,IconButton,Panel}=window.NomaDesignSystem_02438c;
const toneColor={alert:'#E0442F',caution:'#D9A02A',neutral:'var(--map-mark)',ok:'#5FA36F',quiet:'#7D8893'};
const glassPill={borderRadius:'var(--radius-pill)'};
function parseWorld(q,E){const l=q.toLowerCase();const V=E.filter(e=>e.kind==='volcano');
const hit=E.find(e=>l.includes(e.name.toLowerCase()));
if(hit&&/like|similar/.test(l)){const it=[hit,...E.filter(e=>e!==hit&&e.kind===hit.kind&&e.tags.some(t=>hit.tags.includes(t)))];return {label:'Similar to '+hit.name,items:it,summary:it.length>1?(it.length-1)+' systems share '+hit.name+"'s tectonic setting. "+it.slice(1,3).map(e=>e.name).join(' and ')+' are the most active of them.':'No close analogues in the current feed.',ev:'retrieved'};}
if(hit&&/last year|compare/.test(l))return {label:hit.name+' vs last year',items:[hit],summary:hit.name+' is more active than at this time last year, when it was in a quiet phase between episodes.',ev:'historical'};
if(hit)return {label:hit.name,title:hit.headline,items:[hit],summary:hit.summary,ev:'observed'};
if(/atlantic|ridge|rift/.test(l)){const ids=E.filter(e=>e.tags.includes('mar'));const act=ids.filter(e=>e.activity>50);
return {label:'Along the Mid-Atlantic Ridge',items:ids,ridge:true,summary:`${ids.length} volcanoes lie on or near the ridge. ${act.length===1?'Only '+act[0].name+', on Reykjanes, is':act.length+' are'} currently active; the Icelandic systems are the most closely monitored.`,ev:'retrieved'};}
if(/most active|active|busiest/.test(l)){const it=[...V].sort((a,b)=>b.activity-a.activity).slice(0,6);
return {label:'Most active volcanoes',items:it,summary:`${it.slice(0,3).map(e=>e.name).join(', ')} lead a combined ranking of seismicity, gas and thermal output over the past 7 days.`,ev:'calculated'};}
if(/ring of fire|pacific/.test(l)){const it=E.filter(e=>e.tags.includes('ring'));return {label:'Pacific Ring of Fire',items:it,summary:`${it.length} notable systems along the Pacific margin this week.`,ev:'observed'};}
if(/erupt/.test(l)){const it=E.filter(e=>/Erupt|fountain|Strombolian|explos/i.test(e.status));return {label:'Erupting now',items:it,summary:`${it.length} volcanoes are erupting or in explosive episodes. Etna is the most intense.`,ev:'observed'};}
if(/earthquake|quake/.test(l)){return {label:'Significant earthquakes',items:E.filter(e=>e.kind==='earthquake'),quakes:true,summary:'Largest this week: M 6.1 off Kamchatka, with twelve aftershocks above M 4.',ev:'observed'};}
return {label:'Notable right now',items:E.filter(e=>e.featured),summary:'Etna is erupting. Kīlauea and Sakurajima are in ongoing episodes, uplift continues on Reykjanes, and an aftershock sequence is underway off Kamchatka.',ev:'observed'};}
function WorldView({onOpen,onAnswer,restore,drawerOpen,registerAsk,onContext,dockH=96}){
const D=window.NOMA_DATA;
const [size,setSize]=React.useState({w:window.innerWidth,h:window.innerHeight});
const [land,setLand]=React.useState(null);
const [sel,setSel]=React.useState(0);
const [auto,setAuto]=React.useState(true);
const [filter,setFilter]=React.useState(null);
const [zoom,setZoom]=React.useState(null);
React.useEffect(()=>{const r=()=>setSize({w:window.innerWidth,h:window.innerHeight});window.addEventListener('resize',r);return()=>window.removeEventListener('resize',r);},[]);
React.useEffect(()=>{fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r=>r.json()).then(t=>setLand(topojson.feature(t,t.objects.countries)));},[]);
const items=filter?filter.items:D.events.filter(e=>e.featured);
React.useEffect(()=>{if(!auto)return;const t=setInterval(()=>setSel(s=>(s+1)%items.length),7000);return()=>clearInterval(t);},[auto,items]);
React.useEffect(()=>{const k=e=>{if(e.key==='Escape')clear();};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);},[]);
const L=16;const R=16;const B=dockH+24;
const proj=React.useMemo(()=>d3.geoNaturalEarth1().fitExtent([[L,72],[size.w-24,size.h-40]],{type:'Sphere'}),[size,L]);
const path=d3.geoPath(proj);
const grat=React.useMemo(()=>d3.geoGraticule10(),[]);
// fit filtered set
const fit=React.useMemo(()=>{if(!filter||!filter.items.length)return {k:1,tx:0,ty:0};
const pts=filter.items.map(e=>proj([e.lon,e.lat]));const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
const aw=size.w-L-R-20,ah=Math.max(120,size.h-90-B);const k=Math.max(0.5,Math.min(3.2,aw/((x1-x0)+120),ah/((y1-y0)+120)));
const cx=L+10+aw/2,cy=90+ah/2;return {k,tx:cx-(x0+x1)/2*k,ty:cy-(y0+y1)/2*k};},[filter,proj,size,L,R,B]);
const ev=items[Math.min(sel,items.length-1)];
const labelled=React.useMemo(()=>{const s=new Set();if(!filter||filter.items.length>10)return s;const k=zoom?1:fit.k;const placed=[];
const order=[...filter.items].sort((a,b)=>(ev&&a.id===ev.id?-1:ev&&b.id===ev.id?1:b.activity-a.activity));
for(const e of order){const [x,y]=proj([e.lon,e.lat]);const X=x*k,Y=y*k;if(placed.every(([px,py])=>Math.abs(px-X)>90||Math.abs(py-Y)>16)){placed.push([X,Y]);s.add(e.id);}}return s;},[filter,fit,proj,ev,zoom]);
const go=i=>{setAuto(false);setSel(i);};
const clear=()=>{setFilter(null);setSel(0);};
const open=e=>{const [x,y]=proj([e.lon,e.lat]);const k=7;setAuto(false);
setZoom(`translate(${size.w/2-x*k}px,${size.h/2-y*k}px) scale(${k})`);setTimeout(()=>onOpen(e),750);};
const ask=q=>{setAuto(false);setSel(0);const f={q,...parseWorld(q,D.events)};setFilter(f);
onAnswer&&onAnswer({q,view:'world',state:{q},ctx:'Earth · Now',answer:{title:f.title||f.label,body:f.summary,ev:f.ev,...(WORLD_EXTRA[f.label]||{})}});};
React.useEffect(()=>{if(!restore||restore.view!=='world')return;if(restore.state&&restore.state.q)setFilter({q:restore.state.q,...parseWorld(restore.state.q,D.events)});else setFilter(null);setSel(0);},[restore&&restore.nonce]);
React.useEffect(()=>{onContext&&onContext(['Earth','Now',...(filter?[filter.label]:[])]);},[filter]);
React.useEffect(()=>{registerAsk&&registerAsk({ask,insets:{left:L,right:16},placeholder:'Ask about the planet…',suggestions:['Show me the most active volcanoes right now','Show me all volcanoes along the Mid-Atlantic Ridge','Which volcanoes are erupting?','Largest earthquakes this week','Show the Pacific Ring of Fire']});});
const gT=zoom||`translate(${fit.tx}px,${fit.ty}px) scale(${fit.k})`;const inv=1/(zoom?1:fit.k);
return <div style={{position:'absolute',inset:0,background:'var(--map-page)',overflow:'hidden'}}>
<svg width={size.w} height={size.h} style={{position:'absolute',inset:0}}>
<g style={{transform:gT,transformOrigin:'0 0',transition:'transform 800ms var(--ease-out), opacity 800ms',opacity:zoom?0.2:1}}>
<path d={path({type:'Sphere'})} fill="var(--map-ground)" stroke="var(--map-line)" onClick={clear}/>
<path d={path(grat)} fill="none" stroke="var(--map-grat)" style={{pointerEvents:'none'}}/>
{land&&<path d={path(land)} fill="var(--map-ground-2)" stroke="var(--map-land-stroke)" strokeWidth={0.6*inv} onClick={clear}/>}
{filter&&filter.ridge&&<path d={path({type:'LineString',coordinates:D.ridge})} fill="none" stroke="rgba(var(--overlay-rgb),0.45)" strokeWidth={1.5*inv} strokeDasharray={`${5*inv} ${4*inv}`} style={{pointerEvents:'none'}}/>}
{D.quakes.map(([lon,lat,m],i)=>{const [x,y]=proj([lon,lat]);return <circle key={i} cx={x} cy={y} r={m*0.9*inv} fill={filter&&filter.quakes?'rgba(var(--overlay-rgb),0.5)':'rgba(var(--overlay-rgb),0.2)'} style={{pointerEvents:'none'}}/>;})}
{D.events.map(e=>{const [x,y]=proj([e.lon,e.lat]);const on=ev&&e.id===ev.id;const inSet=items.includes(e);const c=toneColor[e.tone];
const op=filter?(inSet?1:0.12):(e.featured?1:0.45);
return <g key={e.id} style={{cursor:'pointer',opacity:op,transition:'opacity 300ms',transform:`translate(${x}px,${y}px) scale(${inv})`,transformOrigin:'0 0'}} onClick={()=>open(e)} onMouseEnter={()=>{const i=items.indexOf(e);if(i>=0)go(i);}}>
<circle r="14" fill="transparent"/>
{on&&<circle r="6" fill="none" stroke={c} strokeWidth="1.5" className="nm-pulse"/>}
{e.kind==='volcano'?<path d={e.featured||inSet?'M0,-6 L6,4 L-6,4 Z':'M0,-4 L4,3 L-4,3 Z'} fill={c} stroke="var(--map-page)" strokeWidth="1"/>:<circle r="4.5" fill={c} stroke="var(--map-page)"/>}
{!on&&labelled.has(e.id)&&<text x="10" y="4" fill={on?'var(--map-ink)':'var(--map-ink-2)'} style={{fontFamily:'var(--font-mono)',fontSize:10.5,letterSpacing:'0.06em',pointerEvents:'none'}}>{e.name.toUpperCase()}</text>}
</g>;})}
</g>
</svg>
<div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:zoom?0:1,transition:'opacity 400ms'}}>
<div className="nm-glass nm-glass-surface" style={{...glassPill,position:'absolute',top:16,left:16,display:'flex',alignItems:'center',gap:12,padding:'8px 16px',pointerEvents:'auto'}}>
<span style={{fontWeight:600,fontSize:17,letterSpacing:'-0.02em'}}>noma</span><span style={{color:'var(--text-faint)'}}>·</span><span style={{fontSize:15}}>Earth</span>
<span style={{...labelStyle,color:'var(--text-faint)'}}>Now · 06:41 UTC</span>
<ThemeToggle/>
</div>
{filter&&<div className="nm-glass nm-glass-surface" style={{...glassPill,position:'absolute',top:16,left:`calc(${L}px + (100% - ${L+16}px) / 2)`,transform:'translateX(-50%)',display:'flex',alignItems:'center',gap:10,padding:'6px 6px 6px 16px',pointerEvents:'auto',maxWidth:`calc(100% - ${L+32}px)`}}>
<span style={{...labelStyle,color:'var(--text-faint)'}}>Filter</span>
<span style={{fontSize:14,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{filter.label}</span>
<span style={{...labelStyle,color:'var(--text-muted)'}}>{filter.items.length}</span>
<button onClick={clear} aria-label="Clear filter" title="Clear filter (Esc)" style={{width:26,height:26,borderRadius:'50%',border:'none',background:'var(--glass-hover)',color:'var(--text-body)',cursor:'pointer',fontSize:14,lineHeight:1}}>×</button>
</div>}
{ev&&!zoom&&<Spotlight onAsk={ask} ev={ev} n={items.length} sel={Math.min(sel,items.length-1)} auto={auto} setAuto={setAuto} go={go} open={open} x={proj([ev.lon,ev.lat])[0]*fit.k+fit.tx} y={proj([ev.lon,ev.lat])[1]*fit.k+fit.ty} W={size.w} H={size.h} B={B} pts={items.filter(e=>e!==ev).map(e=>{const p=proj([e.lon,e.lat]);return [p[0]*fit.k+fit.tx,p[1]*fit.k+fit.ty];})}/>}

</div>
</div>;
}
function Spotlight({ev,n,sel,auto,setAuto,go,open,onAsk,x,y,W,H,B,pts=[]}){
const CW=290,LBL=110,G=22;
const room=H-B-16-72;const showImg=ev.img&&room>=276,showStream=room>=212;const CH=(showImg?64:0)+(showStream?150:104)+62;
// score candidate rects by how many other markers (+ their right-hand labels) they cover; pick the least-covering, nearest one
const minTop=72,maxTop=Math.max(minTop,H-B-CH-16);
const clampT=t=>Math.max(minTop,Math.min(maxTop,t)),clampL=l=>Math.max(16,Math.min(W-16-CW,l));
const cands=[];
for(const L0 of [x+G,x-G-CW,x-CW/2])for(const T0 of [y-44,y-CH-G,y+G,minTop,maxTop])cands.push([clampL(L0),clampT(T0)]);
const hits=(l,t)=>pts.filter(([px,py])=>px+LBL>l-6&&px-8<l+CW+6&&py+8>t-6&&py-8<t+CH+6).length;
const selfHit=(l,t)=>x+8>l&&x-8<l+CW&&y+8>t&&y-8<t+CH;
let best=null;
for(const [l,t] of cands){if(selfHit(l,t))continue;const s=hits(l,t)*10000+Math.hypot(l+CW/2-x,t+CH/2-y);if(!best||s<best[2])best=[l,t,s];}
const left=best?best[0]:clampL(x+G),top=best?best[1]:clampT(y-44);
const ex=Math.max(left,Math.min(left+CW,x)),ey=Math.max(top,Math.min(top+CH,y));
const lead=Math.hypot(ex-x,ey-y)>G+4;
const pg={width:24,height:24,border:'none',borderRadius:'50%',background:'var(--glass-hover)',color:'var(--text-body)',cursor:'pointer',fontSize:13,lineHeight:1,padding:0};
return <>
{lead&&<svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}><line x1={x} y1={y} x2={ex} y2={ey} stroke="rgba(var(--overlay-rgb),0.45)" strokeWidth="1" strokeDasharray="2 3"/></svg>}
<div className="nm-glass nm-glass-surface" style={{position:'absolute',left,top,width:CW,borderRadius:'var(--glass-radius)',overflow:'hidden',pointerEvents:'auto',transition:'left 600ms var(--ease-out), top 600ms var(--ease-out)'}}>
{showImg&&<div style={{position:'relative',height:64}}><image-slot key={ev.id} id={'spot-'+ev.id} shape="rect" src={ev.img} placeholder=""></image-slot></div>}
<div style={{padding:'10px 14px 12px'}}>
<div style={{display:'flex',alignItems:'center',gap:8}}>
<span style={{width:8,height:8,borderRadius:'50%',background:toneColor[ev.tone],flex:'none'}}></span>
<span style={{fontSize:16,fontWeight:600,flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.name}</span>
<span style={{...labelStyle,color:'var(--text-faint)',whiteSpace:'nowrap'}}>{ev.status}</span>
</div>
<div style={{fontSize:13,color:'var(--text-muted)',marginTop:4,lineHeight:1.4}}>{ev.headline}</div>
{showStream&&<><div style={{marginTop:8}}><Spark key={ev.id} base={ev.stream.base} amp={ev.stream.amp} w={CW-28} h={22} dark/></div>
<div style={{display:'flex',justifyContent:'space-between',...labelStyle,color:'var(--text-faint)',marginTop:3}}><span>{ev.stream.label} · live</span><span>{ev.stream.unit}</span></div></>}
<div style={{display:'flex',alignItems:'center',gap:6,marginTop:10}}>
<button style={pg} aria-label="Previous" onClick={()=>go((sel-1+n)%n)}>‹</button>
<span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)',minWidth:34,textAlign:'center'}}>{sel+1} / {n}</span>
<button style={pg} aria-label="Next" onClick={()=>go((sel+1)%n)}>›</button>
<button style={{...pg,fontSize:8}} aria-label={auto?'Pause':'Play'} onClick={()=>setAuto(!auto)}>{auto?'❚❚':'▶'}</button>
<span style={{flex:1}}></span>
<Button size="sm" variant="dark" onClick={()=>open(ev)}>Explore →</Button>
</div>
<div style={{display:'flex',flexDirection:'column',marginTop:8,borderTop:'1px solid var(--line-1)',paddingTop:6}}>
{[ev.kind==='volcano'?`Why is ${ev.name} ${ev.status.toLowerCase()}?`:`What caused the ${ev.name}?`,`Show volcanoes like ${ev.name}`].map(q=><button key={q} onClick={()=>onAsk(q)} style={{textAlign:'left',background:'none',border:'none',padding:'4px 0',fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-muted)',cursor:'pointer',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} onMouseEnter={e=>e.currentTarget.style.color='var(--text-body)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>↳ {q}</button>)}
</div>
</div>
</div>
</>;
}
Object.assign(window,{WorldView,toneColor});
