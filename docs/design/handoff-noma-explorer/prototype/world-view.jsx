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
const [sel,setSel]=React.useState(()=>(window.NOMA_DATA.events.find(e=>e.featured)||{}).id||null);
const settings=useSettings();
const [slots,setSlots]=React.useState({});const [listOpen,setListOpen]=React.useState(false);
React.useEffect(()=>{setSlots({lead:document.getElementById('nm-dock-leading'),pop:document.getElementById('nm-dock-pop')});},[]);
const listRef=React.useRef(null);const [listH,setListH]=React.useState(0);
React.useEffect(()=>{const el=listRef.current;if(!el)return;const ro=new ResizeObserver(()=>setListH(el.offsetHeight));ro.observe(el);return()=>ro.disconnect();});
const [filter,setFilter]=React.useState(null);
const [zoom,setZoom]=React.useState(null);
React.useEffect(()=>{const r=()=>setSize({w:window.innerWidth,h:window.innerHeight});window.addEventListener('resize',r);return()=>window.removeEventListener('resize',r);},[]);
React.useEffect(()=>{fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r=>r.json()).then(t=>setLand(topojson.feature(t,t.objects.countries)));},[]);
const items=filter?filter.items:D.events.filter(e=>e.featured);
const selRef=React.useRef(null);selRef.current=sel;
React.useEffect(()=>{const k=e=>{if(e.key==='Escape'){if(selRef.current!=null)setSel(null);else clear();}};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);},[]);
const L=16;const LW=260;const R=16;const B=dockH+24;
const proj=React.useMemo(()=>d3.geoNaturalEarth1().fitExtent([[8,24],[size.w-8,size.h-16]],{type:'Sphere'}),[size]);
const path=d3.geoPath(proj);
const grat=React.useMemo(()=>d3.geoGraticule10(),[]);
// fit filtered set
const fit=React.useMemo(()=>{if(!filter||!filter.items.length)return {k:1,tx:0,ty:0};
const pts=filter.items.map(e=>proj([e.lon,e.lat]));const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
const aw=size.w-L-R-20,ah=Math.max(120,size.h-90-B);const k=Math.max(0.5,Math.min(3.2,aw/((x1-x0)+120),ah/((y1-y0)+120)));
const cx=L+10+aw/2,cy=90+ah/2;return {k,tx:cx-(x0+x1)/2*k,ty:cy-(y0+y1)/2*k};},[filter,proj,size,L,R,B]);
const [hov,setHov]=React.useState(null);const hovT=React.useRef(null);
const hoverOn=e=>{clearTimeout(hovT.current);setHov(e.id);};
const hoverOff=()=>{clearTimeout(hovT.current);hovT.current=setTimeout(()=>setHov(null),280);};
const keepHover=()=>clearTimeout(hovT.current);
const [uv,setUv]=React.useState({k:1,x:0,y:0});const [drag,setDrag]=React.useState(false);const dragRef=React.useRef(null);const svgRef=React.useRef(null);
React.useEffect(()=>{setUv({k:1,x:0,y:0});},[filter]);
const K=fit.k*uv.k,TX=fit.tx*uv.k+uv.x,TY=fit.ty*uv.k+uv.y;
const toS=p=>[p[0]*K+TX,p[1]*K+TY];
const zoomAt=(f,cx,cy)=>setUv(u=>{const k=Math.max(1,Math.min(12,u.k*f));const r=k/u.k;return k===1?{k:1,x:0,y:0}:{k,x:cx-(cx-u.x)*r,y:cy-(cy-u.y)*r};});
React.useEffect(()=>{const el=svgRef.current;if(!el)return;const h=e=>{e.preventDefault();zoomAt(Math.exp(-e.deltaY*0.0018),e.clientX,e.clientY);};el.addEventListener('wheel',h,{passive:false});return()=>el.removeEventListener('wheel',h);},[]);
const onDown=e=>{if(e.button!==0)return;dragRef.current={x:e.clientX,y:e.clientY,ux:uv.x,uy:uv.y,moved:false};};
const onMove=e=>{const d=dragRef.current;if(!d)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)<4)return;if(!d.moved){d.moved=true;setDrag(true);}setUv(u=>({...u,x:d.ux+dx,y:d.uy+dy}));};
const onUp=()=>{const d=dragRef.current;dragRef.current=null;if(d&&d.moved){setDrag(false);window.__nmDragged=Date.now();}};
const notDragged=f=>(...a)=>{if(window.__nmDragged&&Date.now()-window.__nmDragged<200)return;f(...a);};
const shown=hov!=null?hov:sel;
const ev=shown!=null?(D.events.find(e=>e.id===shown)||null):null;
const labelled=React.useMemo(()=>{const s=new Set();if(!settings.labels||!filter||filter.items.length>10)return s;const k=zoom?1:K;const placed=[];
const order=[...filter.items].sort((a,b)=>(ev&&a.id===ev.id?-1:ev&&b.id===ev.id?1:b.activity-a.activity));
for(const e of order){const [x,y]=proj([e.lon,e.lat]);const X=x*k,Y=y*k;if(placed.every(([px,py])=>Math.abs(px-X)>90||Math.abs(py-Y)>16)){placed.push([X,Y]);s.add(e.id);}}return s;},[filter,fit,proj,ev,zoom,settings.labels,K]);
const pick=e=>{clearTimeout(hovT.current);setHov(null);setSel(e.id);};
const clear=()=>{setFilter(null);setSel(s=>{const f=D.events.find(e=>e.id===s&&e.featured);return f?s:(D.events.find(e=>e.featured)||{}).id||null;});};
const closeCard=()=>setSel(null);
const open=e=>{const [x,y]=proj([e.lon,e.lat]);const k=7;
setZoom(`translate(${size.w/2-x*k}px,${size.h/2-y*k}px) scale(${k})`);setTimeout(()=>onOpen(e),750);};
const ask=q=>{const f={q,...parseWorld(q,D.events)};setFilter(f);setSel(f.items.length?f.items[0].id:null);
onAnswer&&onAnswer({q,view:'world',state:{q},ctx:'Earth · Now',answer:{title:f.title||f.label,body:f.summary,ev:f.ev,...(WORLD_EXTRA[f.label]||{})}});};
React.useEffect(()=>{if(!restore||restore.view!=='world')return;if(restore.state&&restore.state.q)setFilter({q:restore.state.q,...parseWorld(restore.state.q,D.events)});else setFilter(null);setSel(null);},[restore&&restore.nonce]);
React.useEffect(()=>{onContext&&onContext(['Earth','Now',...(filter?[filter.label]:[])]);},[filter]);
React.useEffect(()=>{registerAsk&&registerAsk({ask,insets:{left:16,right:168},placeholder:'Ask about the planet…',suggestions:['Show me the most active volcanoes right now','Show me all volcanoes along the Mid-Atlantic Ridge','Which volcanoes are erupting?','Largest earthquakes this week','Show the Pacific Ring of Fire']});});
const gT=zoom||`translate(${TX}px,${TY}px) scale(${K})`;const inv=1/(zoom?1:K);
return <div style={{position:'absolute',inset:0,background:'var(--map-page)',overflow:'hidden'}}>
<svg ref={svgRef} width={size.w} height={size.h} style={{position:'absolute',inset:0,cursor:drag?'grabbing':'grab',touchAction:'none'}} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} onDoubleClick={e=>{if(e.target.closest&&e.target.closest('g[data-mk]'))return;zoomAt(2,e.clientX,e.clientY);}}>
<g style={{transform:gT,transformOrigin:'0 0',transition:drag?'none':(zoom?'transform 800ms var(--ease-out), opacity 800ms':'transform 260ms var(--ease-out), opacity 800ms'),opacity:zoom?0.2:1}}>
<path d={path({type:'Sphere'})} fill="var(--map-ground)" stroke="var(--map-line)" strokeWidth={inv} onClick={notDragged(closeCard)}/>
<path d={path(grat)} fill="none" stroke="var(--map-grat)" style={{pointerEvents:'none'}}/>
{land&&<path d={path(land)} fill="var(--map-ground-2)" stroke="var(--map-land-stroke)" strokeWidth={0.6*inv} onClick={notDragged(closeCard)}/>}
{filter&&filter.ridge&&<path d={path({type:'LineString',coordinates:D.ridge})} fill="none" stroke="rgba(var(--overlay-rgb),0.45)" strokeWidth={1.5*inv} strokeDasharray={`${5*inv} ${4*inv}`} style={{pointerEvents:'none'}}/>}
{D.quakes.map(([lon,lat,m],i)=>{const [x,y]=proj([lon,lat]);return <circle key={i} cx={x} cy={y} r={m*0.9*inv} fill={filter&&filter.quakes?'rgba(var(--overlay-rgb),0.5)':'rgba(var(--overlay-rgb),0.2)'} style={{pointerEvents:'none'}}/>;})}
{D.events.map(e=>{const [x,y]=proj([e.lon,e.lat]);const on=ev&&e.id===ev.id;const inSet=items.includes(e);const c=toneColor[e.tone];
const op=filter?(inSet?1:0.12):(e.featured?1:0.45);
return <g key={e.id} style={{cursor:'pointer',opacity:op,transition:'opacity 300ms',transform:`translate(${x}px,${y}px) scale(${inv})`,transformOrigin:'0 0'}} data-mk="1" onClick={notDragged(()=>pick(e))} onMouseEnter={()=>{if(!dragRef.current||!dragRef.current.moved)hoverOn(e);}} onMouseLeave={hoverOff}>
<circle r="14" fill="transparent"/>
{on&&<circle r="6" fill="none" stroke={c} strokeWidth="1.5" className="nm-pulse"/>}
{e.kind==='volcano'?<path d={e.featured||inSet?'M0,-6 L6,4 L-6,4 Z':'M0,-4 L4,3 L-4,3 Z'} fill={c} stroke="var(--map-page)" strokeWidth="1"/>:<circle r="4.5" fill={c} stroke="var(--map-page)"/>}
{!on&&labelled.has(e.id)&&<text x="10" y="4" fill={on?'var(--map-ink)':'var(--map-ink-2)'} style={{fontFamily:'var(--font-mono)',fontSize:10.5,letterSpacing:'0.06em',pointerEvents:'none'}}>{e.name.toUpperCase()}</text>}
</g>;})}
</g>
</svg>
<div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:zoom?0:1,transition:'opacity 400ms'}}>
<div style={{position:'absolute',top:16,left:16,display:'flex',alignItems:'center',gap:8,pointerEvents:'auto'}}><Wordmark/><div className="nm-glass nm-glass-surface" style={{minWidth:0,overflow:'hidden',boxSizing:'border-box',...glassPill,display:'flex',alignItems:'center',gap:12,padding:'8px 16px',pointerEvents:'auto'}}>
<span style={{fontSize:15,fontWeight:500}}>Earth</span>
<span style={{...labelStyle,color:'var(--text-faint)',whiteSpace:'nowrap'}}>Now · {settings.time==='utc'?'06:41 UTC':'07:41 local'}</span>
</div>
</div>
{!zoom&&<div style={{position:'absolute',top:16,right:16,pointerEvents:'auto'}}><SettingsButton/></div>}
{!zoom&&<div style={{position:'absolute',bottom:16,right:16,pointerEvents:'auto'}}><MapControls k={uv.k} onIn={()=>zoomAt(1.6,size.w/2,size.h/2)} onOut={()=>zoomAt(1/1.6,size.w/2,size.h/2)} onReset={()=>setUv({k:1,x:0,y:0})}/></div>}

{filter&&filter.quakes&&!zoom&&(()=>{const CN=window.NomaDesignSystem_02438c.CoverageNote;return CN?<div style={{position:'absolute',top:64,left:'50%',transform:'translateX(-50%)',pointerEvents:'auto',width:'max-content',maxWidth:'calc(100% - 32px)'}}><CN title="Showing M 4.5+ worldwide" detail="Smaller earthquakes appear only where a local network reports them. Open a system to see its local catalogue."/></div>:null;})()}
{slots.lead&&!zoom&&ReactDOM.createPortal(<FeaturedTrigger n={items.length} filter={filter} open={listOpen} onToggle={()=>setListOpen(v=>!v)} onClear={clear}/>,slots.lead)}
{slots.pop&&listOpen&&!zoom&&ReactDOM.createPortal(<FeaturedPopover onHover={hoverOn} onHoverEnd={hoverOff} items={items} sel={sel} filter={filter} onClear={clear} onPick={e=>{pick(e);setListOpen(false);}} onClose={()=>setListOpen(false)} maxH={Math.min(380,size.h-dockH-110)}/>,slots.pop)}
{ev&&!zoom&&<Spotlight onAsk={ask} ev={ev} open={open} onClose={()=>{setHov(null);closeCard();}} preview={hov!=null&&hov!==sel} onEnter={keepHover} onLeave={hov!=null?hoverOff:undefined} avoid={null} x={toS(proj([ev.lon,ev.lat]))[0]} y={toS(proj([ev.lon,ev.lat]))[1]} W={size.w} H={size.h} B={B} pts={items.filter(e=>e!==ev).map(e=>{return toS(proj([e.lon,e.lat]));})}/>}

</div>
</div>;
}
const EV_C={observed:'#3E7C4F',historical:'#75685B',retrieved:'#4E6E82',calculated:'#5E6A46',modelled:'#3A6EA5',simulated:'#6E6A60',inferred:'#8B867B',forecast:'#A8770F'};
const EV_T={observed:'Observed — measured directly by instruments',retrieved:'Retrieved — reported by an external source',calculated:'Calculated — derived by Noma from observations',inferred:'Inferred — estimated, not measured',modelled:'Modelled',forecast:'Forecast',historical:'Historical',simulated:'Simulated'};
function EvDot({k}){const ref=React.useRef(null);const [pos,setPos]=React.useState(null);
const show=()=>{const r=ref.current.getBoundingClientRect();setPos({x:r.left+r.width/2,y:r.top});};
return <span ref={ref} onMouseEnter={show} onMouseLeave={()=>setPos(null)} aria-label={EV_T[k]} style={{position:'relative',display:'inline-flex',width:12,height:12,alignItems:'center',justifyContent:'center',flex:'none',cursor:'help'}}>
<span style={{width:7,height:7,borderRadius:'50%',background:EV_C[k],boxShadow:'0 0 0 1.5px rgba(255,255,255,0.55)'}}></span>
{pos&&ReactDOM.createPortal(<span style={{position:'fixed',left:pos.x,top:pos.y-8,transform:'translate(-50%,-100%)',background:'#1C1B18',color:'#F6F4EF',fontFamily:'var(--font-sans)',fontSize:12,lineHeight:1.3,whiteSpace:'nowrap',padding:'5px 9px',borderRadius:4,zIndex:1000,pointerEvents:'none',boxShadow:'0 4px 14px rgba(0,0,0,0.3)'}}>{EV_T[k]}</span>,document.body)}
</span>;}
function MapControls({k,onIn,onOut,onReset}){
const b={width:42,height:44,border:'none',background:'transparent',color:'var(--text-body)',cursor:'pointer',fontSize:18,lineHeight:1,padding:0,display:'flex',alignItems:'center',justifyContent:'center'};
const hv={onMouseEnter:e=>e.currentTarget.style.background='var(--glass-hover)',onMouseLeave:e=>e.currentTarget.style.background='transparent'};
return <div className="nm-glass nm-glass-surface" style={{height:44,borderRadius:22,overflow:'hidden',display:'flex',alignItems:'center',padding:'0 4px'}}>
<button style={b} {...hv} onClick={onIn} disabled={k>=12} aria-label="Zoom in" title="Zoom in (scroll or double-click)">+</button>
<span style={{width:1,height:20,background:'var(--line-1)',flex:'none'}}></span>
<button style={{...b,opacity:k<=1?0.4:1,cursor:k<=1?'default':'pointer'}} {...hv} onClick={onOut} disabled={k<=1} aria-label="Zoom out" title="Zoom out">−</button>
<span style={{width:1,height:20,background:'var(--line-1)',flex:'none'}}></span>
<button style={{...b,opacity:k<=1?0.4:1,cursor:k<=1?'default':'pointer'}} {...hv} onClick={onReset} disabled={k<=1} aria-label="Reset view" title="Reset view"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg></button>
</div>;
}
function FeaturedTrigger({n,filter,open,onToggle,onClear}){
const base={display:'flex',alignItems:'center',gap:6,height:28,flex:'none',borderRadius:999,border:'1px solid var(--line-1)',background:open?'var(--glass-hover)':'transparent',color:'var(--text-body)',cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:13,whiteSpace:'nowrap',padding:'0 10px'};
return <span style={{display:'inline-flex',alignItems:'center',gap:4,flex:'none',minWidth:0}}>
<button type="button" onPointerDown={e=>e.stopPropagation()} onClick={onToggle} aria-expanded={open} title={filter?'Show filter results':'Show featured systems'} style={{...base,maxWidth:filter?200:'none'}}>
{filter?<span style={{...labelStyle,color:'var(--text-faint)',flex:'none'}}>Filter</span>:<span style={{display:'inline-flex',flexDirection:'column',gap:2.5,flex:'none'}}><span style={{width:10,height:1.5,background:'currentColor'}}></span><span style={{width:10,height:1.5,background:'currentColor'}}></span><span style={{width:10,height:1.5,background:'currentColor'}}></span></span>}
<span style={{overflow:'hidden',textOverflow:'ellipsis',minWidth:0,fontWeight:500}}>{filter?filter.label:'Featured'}</span>
<span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)',flex:'none'}}>{n}</span>
<span style={{fontSize:9,color:'var(--text-faint)',flex:'none',transform:open?'rotate(180deg)':'none'}}>▲</span>
</button>
{filter&&<button type="button" onClick={onClear} aria-label="Clear filter" title="Clear filter (Esc)" style={{width:24,height:24,flex:'none',borderRadius:'50%',border:'none',background:'var(--glass-hover)',color:'var(--text-body)',cursor:'pointer',fontSize:14,lineHeight:1,padding:0}}>×</button>}
<span style={{width:1,height:18,background:'var(--line-1)',margin:'0 4px 0 6px',flex:'none'}}></span>
</span>;
}
function FeaturedPopover({items,sel,filter,onClear,onPick,onClose,maxH,onHover,onHoverEnd}){
React.useEffect(()=>{const c=()=>onClose();const k=e=>{if(e.key==='Escape')onClose();};const id=setTimeout(()=>window.addEventListener('pointerdown',c),0);window.addEventListener('keydown',k);return()=>{clearTimeout(id);window.removeEventListener('pointerdown',c);window.removeEventListener('keydown',k);};},[]);
return <div className="nm-glass nm-glass-surface nm-unfold" onPointerDown={e=>e.stopPropagation()} style={{position:'absolute',left:0,bottom:'calc(100% + 8px)',width:320,maxWidth:'100%',maxHeight:Math.max(120,maxH),display:'flex',flexDirection:'column',borderRadius:'var(--glass-radius)',background:'var(--glass-bg-strong)',overflow:'hidden',zIndex:40}}>
<div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 10px 8px 14px',flex:'none',borderBottom:'1px solid var(--line-1)'}}>
<span style={{...labelStyle,color:'var(--text-faint)',flex:'none'}}>{filter?'Filter':'Featured now'}</span>
{filter&&<span style={{fontSize:13,fontWeight:500,flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{filter.label}</span>}
{!filter&&<span style={{flex:1}}></span>}
<span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-muted)'}}>{items.length}</span>
{filter&&<button onClick={()=>{onClear();onClose();}} style={{fontFamily:'var(--font-sans)',fontSize:12,color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer',padding:'0 2px',whiteSpace:'nowrap'}}>Clear</button>}
</div>
<div style={{overflowY:'auto',minHeight:0,padding:'4px 6px 6px'}}>
{items.map(e=>{const on=e.id===sel;return <button key={e.id} onClick={()=>onPick(e)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',textAlign:'left',padding:'8px',marginTop:2,border:'none',borderRadius:'var(--radius-2)',background:on?'var(--glass-hover)':'transparent',cursor:'pointer',color:'var(--text-body)',fontFamily:'var(--font-sans)'}} onMouseEnter={ev=>{onHover&&onHover(e);if(!on)ev.currentTarget.style.background='var(--glass-hover)';}} onMouseLeave={ev=>{onHoverEnd&&onHoverEnd();if(!on)ev.currentTarget.style.background='transparent';}}>
<span style={{width:8,height:8,borderRadius:e.kind==='volcano'?1:'50%',transform:e.kind==='volcano'?'rotate(45deg)':'none',background:toneColor[e.tone],flex:'none'}}></span>
<span style={{minWidth:0,flex:1}}><span style={{display:'block',fontSize:14,fontWeight:on?600:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{e.name}</span><span style={{display:'block',fontSize:12,color:'var(--text-faint)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{e.status}</span></span>
<span style={{...labelStyle,color:'var(--text-faint)',flex:'none',maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.region}</span>
</button>;})}
</div>
</div>;
}
function Spotlight({ev,open,onClose,onAsk,x,y,W,H,B,pts=[],avoid,preview,onEnter,onLeave}){
const CW=290,LBL=110,G=22;
const cardRef=React.useRef(null);const [base,setBase]=React.useState(170);
const OPT={stats:84,q:80,stream:0,img:64};const CHIP=46;
const room=H-B-16-72;let avail=room-base;
const take=k=>{if(avail>=OPT[k]){avail-=OPT[k];return true;}return false;};
const compact=room<base,hidden=room<CHIP;
const showStats=!compact&&take('stats'),showQ=!compact&&take('q'),showStream=false,showImg=!compact&&!!ev.img&&take('img');
const CH=compact?CHIP:base+(showStats?OPT.stats:0)+(showQ?OPT.q:0)+(showStream?OPT.stream:0)+(showImg?OPT.img:0);
React.useLayoutEffect(()=>{const el=cardRef.current;if(!el||compact)return;const m=()=>{const h=el.offsetHeight-(showStats?OPT.stats:0)-(showQ?OPT.q:0)-(showStream?OPT.stream:0)-(showImg?OPT.img:0);if(Math.abs(h-base)>1)setBase(h);};m();const ro=new ResizeObserver(m);ro.observe(el);return()=>ro.disconnect();});
// score candidate rects by how many other markers (+ their right-hand labels) they cover; pick the least-covering, nearest one
const minTop=72,maxTop=Math.max(minTop,H-B-CH-16);
const clampT=t=>Math.max(minTop,Math.min(maxTop,t)),clampL=l=>Math.max(16,Math.min(W-16-CW,l));
const cands=[];
for(const L0 of [x+G,x-G-CW,x-CW/2,avoid?avoid.l-CW:W])for(const T0 of [y-44,y-CH-G,y+G,minTop,maxTop])cands.push([clampL(L0),clampT(T0)]);
const hits=(l,t)=>pts.filter(([px,py])=>px+LBL>l-6&&px-8<l+CW+6&&py+8>t-6&&py-8<t+CH+6).length;
const selfHit=(l,t)=>x+8>l&&x-8<l+CW&&y+8>t&&y-8<t+CH;
const avoidHit=(l,t)=>avoid&&l<avoid.r&&l+CW>avoid.l&&t<avoid.b&&t+CH>avoid.t;
let best=null;
for(const [l,t] of cands){if(selfHit(l,t))continue;const s=(avoidHit(l,t)?1e6:0)+hits(l,t)*10000+Math.hypot(l+CW/2-x,t+CH/2-y);if(!best||s<best[2])best=[l,t,s];}
const left=best?best[0]:clampL(x+G),top=best?best[1]:clampT(y-44);
const ex=Math.max(left,Math.min(left+CW,x)),ey=Math.max(top,Math.min(top+CH,y));
const lead=Math.hypot(ex-x,ey-y)>G+4;
if(hidden)return null;
if(compact)return <>
{lead&&<svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}><line x1={x} y1={y} x2={ex} y2={ey} stroke="rgba(var(--overlay-rgb),0.45)" strokeWidth="1" strokeDasharray="2 3"/></svg>}
<div onMouseEnter={onEnter} onMouseLeave={onLeave} className="nm-glass nm-glass-surface" style={{position:'absolute',left,top,width:CW,height:CHIP,boxSizing:'border-box',borderRadius:999,display:'flex',alignItems:'center',gap:8,padding:'0 6px 0 14px',pointerEvents:'auto',transition:'left 600ms var(--ease-out), top 600ms var(--ease-out)'}}>
<span style={{width:8,height:8,borderRadius:'50%',background:toneColor[ev.tone],flex:'none'}}></span>
<span style={{fontSize:14,fontWeight:600,whiteSpace:'nowrap',flex:'none'}}>{ev.name}</span>
<span style={{fontSize:13,color:'var(--text-muted)',flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.status}</span>
<Button size="sm" variant="dark" onClick={()=>open(ev)} style={{borderRadius:999,flex:'none'}}>Explore →</Button>
<button onClick={onClose} aria-label="Close" style={{width:24,height:24,flex:'none',borderRadius:'50%',border:'none',background:'transparent',color:'var(--text-faint)',cursor:'pointer',fontSize:15,padding:0}}>×</button>
</div>
</>;
return <>
{lead&&<svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}><line x1={x} y1={y} x2={ex} y2={ey} stroke="rgba(var(--overlay-rgb),0.45)" strokeWidth="1" strokeDasharray="2 3"/></svg>}
<div ref={cardRef} onMouseEnter={onEnter} onMouseLeave={onLeave} className="nm-glass nm-glass-surface" style={{opacity:preview?0.96:1,position:'absolute',left,top,width:CW,borderRadius:'var(--glass-radius)',overflow:'hidden',pointerEvents:'auto',transition:'left 600ms var(--ease-out), top 600ms var(--ease-out)'}}>
{showImg&&<div style={{position:'relative',height:64}}><image-slot key={ev.id} id={'spot-'+ev.id} shape="rect" src={ev.img} placeholder=""></image-slot></div>}
<div style={{padding:16}}>
<div style={{display:'flex',alignItems:'baseline',gap:8}}>
<span style={{fontSize:17,fontWeight:600,flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ev.name}</span>
<button onClick={onClose} aria-label="Close" title="Close (Esc)" style={{width:22,height:22,flex:'none',alignSelf:'center',marginRight:-4,borderRadius:'50%',border:'none',background:'transparent',color:'var(--text-faint)',cursor:'pointer',fontSize:15,lineHeight:1,padding:0}} onMouseEnter={e=>e.currentTarget.style.background='var(--glass-hover)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>×</button>
</div>
<div style={{...labelStyle,color:'var(--text-faint)',marginTop:3,lineHeight:1.4}}>{ev.region}</div>
<div style={{display:'flex',alignItems:'center',gap:8,marginTop:8}}><span style={{width:8,height:8,borderRadius:'50%',background:toneColor[ev.tone],flex:'none'}}></span><span style={{fontSize:14,fontWeight:500}}>{ev.status}</span></div>
<div style={{fontSize:13,color:'var(--text-muted)',marginTop:6,lineHeight:1.45}}>{ev.headline}</div>
{showStats&&(()=>{const local=!!(ev.places&&ev.places.length);
const trend=ev.streams&&ev.streams[0]?ev.streams[0].trend:(ev.tone==='alert'||ev.tone==='caution'?'rising':'steady');
const facts=[['Activity',ev.activity!=null?ev.activity:'—','/ 100','calculated'],['Trend',trend[0].toUpperCase()+trend.slice(1),ev.stream.label,local?'observed':'inferred']];
return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:14,paddingTop:12,height:70,boxSizing:'border-box',overflow:'hidden',borderTop:'1px solid var(--line-1)'}}>
{facts.map(([k,v,sub,evk])=><div key={k} style={{minWidth:0}}><div style={{...labelStyle,color:'var(--text-faint)',display:'flex',alignItems:'center',gap:5}}>{k}<EvDot k={evk}/></div><div style={{fontSize:15,fontWeight:500,marginTop:2,color:'var(--text-body)'}}>{v}</div><div style={{fontSize:11,color:'var(--text-faint)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={sub}>{sub}</div></div>)}
</div>;})()}
<div style={{display:'flex',alignItems:'flex-start',gap:6,marginTop:12,fontSize:11,color:'var(--text-faint)',lineHeight:1.4}}><span style={{marginTop:1,flex:'none',display:'inline-flex'}}><EvDot k="retrieved"/></span><span style={{minWidth:0}}>Reported by {ev.source||'monitoring networks'} · 06:41 UTC</span></div>
{showQ&&<div style={{display:'flex',flexDirection:'column',gap:2,marginTop:12,borderTop:'1px solid var(--line-1)',paddingTop:8,height:68,boxSizing:'border-box',overflow:'hidden'}}>
{[ev.kind==='volcano'?`Why is ${ev.name} ${ev.status.toLowerCase()}?`:`What caused the ${ev.name}?`,`Show volcanoes like ${ev.name}`].map(q=><button key={q} onClick={()=>onAsk(q)} style={{textAlign:'left',background:'none',border:'none',padding:'5px 0',fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-muted)',cursor:'pointer',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} onMouseEnter={e=>e.currentTarget.style.color='var(--text-body)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>↳ {q}</button>)}
</div>}
<Button size="sm" variant="dark" onClick={()=>open(ev)} style={{width:'100%',justifyContent:'center',marginTop:14}}>{`Explore ${ev.name} →`}</Button>
</div>
</div>
</>;
}
Object.assign(window,{WorldView,toneColor});
