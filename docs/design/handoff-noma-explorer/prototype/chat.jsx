const {EvidenceTag:IEvidence,Button:IButton}=window.NomaDesignSystem_02438c;
const WORLD_EXTRA={
'Along the Mid-Atlantic Ridge':{points:['Iceland hosts four of the nine, and all recent eruptions.','The Azores sit near the triple junction with the Eurasian and African plates.','The southern ridge volcanoes are remote and largely unmonitored.'],sources:[{n:'Global Volcanism Program, Smithsonian',k:'retrieved'},{n:'Icelandic Met Office — seismic & GNSS',k:'observed'},{n:'IVAR, University of the Azores',k:'retrieved'}]},
'Most active volcanoes':{points:['Etna — tremor and SO₂ both at 12-month highs.','Kīlauea — episode 31 of summit fountaining.','Merapi — dome growth with pyroclastic flows.'],sources:[{n:'INGV Osservatorio Etneo',k:'observed'},{n:'USGS Hawaiian Volcano Observatory',k:'observed'},{n:'PVMBG / BPPTKG Indonesia',k:'observed'},{n:'Noma activity index (7-day composite)',k:'calculated'}]},
'Erupting now':{sources:[{n:'Smithsonian / USGS Weekly Volcanic Activity Report',k:'retrieved'},{n:'VAAC Toulouse, Tokyo, Washington',k:'observed'}]},
'Significant earthquakes':{sources:[{n:'USGS ComCat',k:'observed'},{n:'GFZ GEOFON',k:'observed'}]},
'Notable right now':{sources:[{n:'Smithsonian / USGS Weekly Volcanic Activity Report',k:'retrieved'},{n:'USGS ComCat',k:'observed'}]}};
const DETAIL_EXTRA={
'Ash is drifting east-southeast':{points:['Ash likely over Catania from about 12:00 UTC.','Catania airport: moderate risk of disruption this afternoon.','Uncertainty grows after 4 hours as winds back to the southwest.'],sources:[{n:'ECMWF wind forecast, 06 UTC run',k:'forecast'},{n:'FALL3D ash dispersion v8.2',k:'modelled'},{n:'VAAC Toulouse advisory 0612',k:'observed'}]},
'38 earthquakes in the last 24 hours':{points:['Depths cluster at 1–4 km, shallower than last month.','No events deeper than 10 km, so no sign of deep recharge.'],sources:[{n:'INGV-OE seismic network (18 of 21 stations)',k:'observed'}]},
'Three towns lie within 15 km of the active vent':{sources:[{n:'ISTAT population 2024',k:'retrieved'},{n:'Copernicus CORINE land cover',k:'retrieved'}]},
'Lava would most likely flow southeast':{sources:[{n:'MAGFLOW lava-flow model, INGV',k:'modelled'},{n:'TINITALY 10 m DEM',k:'retrieved'}]},
'Jumped to the December 2025 lava fountain':{sources:[{n:'INGV-OE bulletins, Dec 2025',k:'historical'}]}};
const {QueryBar:AQueryBar}=window.NomaDesignSystem_02438c;
const chatLink={background:'none',border:'none',padding:0,cursor:'pointer',fontFamily:'var(--font-sans)',fontSize:13,color:'var(--text-muted)',whiteSpace:'nowrap'};
function Message({m,cur,onRestore}){
const [more,setMore]=React.useState(false);
const src=m.answer.sources||[];
return <div style={{display:'flex',flexDirection:'column',gap:8}}>
<div style={{alignSelf:'flex-end',maxWidth:'80%',background:'var(--glass-bubble)',borderRadius:'16px 16px 4px 16px',padding:'7px 12px',fontSize:14}}>{m.q}</div>
<div style={{maxWidth:'92%'}}>
<div style={{fontSize:15,fontWeight:600,lineHeight:1.35}}>{m.answer.title}</div>
<div style={{fontSize:14,color:'var(--text-muted)',lineHeight:1.5,marginTop:2}}>{m.answer.body}</div>
{more&&<div style={{marginTop:8,display:'flex',flexDirection:'column',gap:4}}>
{(m.answer.points||[]).map(p=><div key={p} style={{fontSize:13,color:'var(--text-muted)'}}>— {p}</div>)}
{src.map((s,j)=><div key={j} style={{display:'flex',gap:8,alignItems:'center',fontSize:12,color:'var(--text-faint)'}}><span style={{flex:1}}>{s.n}</span><IEvidence kind={s.k}/></div>)}
</div>}
<div style={{display:'flex',alignItems:'center',gap:14,marginTop:6}}>
<IEvidence kind={m.answer.ev}/>
{src.length>0&&<button style={chatLink} onClick={()=>setMore(!more)}>{src.length} source{src.length>1?'s':''} {more?'▴':'▾'}</button>}
{cur?<span style={{...labelStyle,color:'#5FA36F'}}>● On map</span>:<button style={chatLink} onClick={()=>onRestore(m)}>Show on map</button>}
</div>
</div>
</div>;
}
function ChatDock({thread,ctx,currentId,open,setOpen,onAsk,placeholder,suggestions,onRestore,onNew,onToast,insets,onHeight,history=[],onLoad}){
const [hist,setHist]=React.useState(false);
React.useEffect(()=>{if(!hist)return;const c=()=>setHist(false);const k=e=>{if(e.key==='Escape')setHist(false);};const id=setTimeout(()=>window.addEventListener('pointerdown',c),0);window.addEventListener('keydown',k);return()=>{clearTimeout(id);window.removeEventListener('pointerdown',c);window.removeEventListener('keydown',k);};},[hist]);
const bodyRef=React.useRef(null);const boxRef=React.useRef(null);
React.useEffect(()=>{if(!boxRef.current||!onHeight)return;const ro=new ResizeObserver(()=>onHeight(boxRef.current.offsetHeight));ro.observe(boxRef.current);return()=>ro.disconnect();},[]);
const n=thread.length;const expanded=open&&n>0;
React.useEffect(()=>{if(bodyRef.current)bodyRef.current.scrollTop=bodyRef.current.scrollHeight;},[n,expanded]);
const histBtn=<button type="button" onClick={()=>setHist(!hist)} title="Previous chats" aria-label="Previous chats" style={{width:28,height:28,flex:'none',borderRadius:'50%',border:'1px solid var(--line-1)',background:hist?'var(--glass-hover)':'transparent',color:'var(--text-body)',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2.5,padding:0}}><span style={{width:11,height:1.5,background:'currentColor'}}></span><span style={{width:11,height:1.5,background:'currentColor'}}></span><span style={{width:7,height:1.5,background:'currentColor',alignSelf:'center',marginRight:4}}></span></button>;
const reopen=n>0&&!expanded?<button type="button" onClick={()=>setOpen(true)} title="Show conversation" style={{...chatLink,display:'flex',alignItems:'center',gap:6,height:28,padding:'0 10px',borderRadius:999,border:'1px solid var(--line-1)',fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-body)'}}>{n}<span style={{fontSize:9}}>▲</span></button>:null;
return <div style={{position:'absolute',left:insets.left,right:insets.right,bottom:16,display:'flex',justifyContent:'center',zIndex:30,pointerEvents:'none',transition:'left var(--dur-med), right var(--dur-med)'}}>
<div ref={boxRef} className="nm-glass nm-glass-surface" style={{position:'relative',pointerEvents:'auto',width:'100%',maxWidth:620,borderRadius:expanded?'var(--glass-radius)':28,display:'flex',flexDirection:'column',background:expanded?'var(--glass-bg-strong)':'var(--glass-bg)'}}>
{expanded&&<>
<div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px 8px',borderBottom:'1px solid var(--line-1)'}}>
<span style={{flex:1,minWidth:0,fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-faint)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ctx.join(' · ')}</span>
<button style={chatLink} onClick={()=>onToast('Link copied — opens at the same map state')}>Share</button>
<button style={chatLink} onClick={onNew}>New</button>
<button style={chatLink} onClick={()=>setOpen(false)} title="Hide conversation">Hide ▾</button>
</div>
<div ref={bodyRef} style={{overflow:'auto',padding:'14px',display:'flex',flexDirection:'column',gap:18,maxHeight:'min(420px, calc(100vh - 220px))'}}>
{thread.map(m=><Message key={m.id} m={m} cur={m.id===currentId} onRestore={onRestore}/>)}
</div>
</>}
<div style={{padding:6,borderTop:expanded?'1px solid var(--line-1)':'none'}}><AQueryBar embedded placeholder={placeholder} examples={suggestions} onAsk={q=>{onAsk(q);setOpen(true);}} trailing={<>{reopen}{histBtn}</>}/></div>
{hist&&<div className="nm-glass nm-glass-surface" onPointerDown={e=>e.stopPropagation()} style={{position:'absolute',right:0,bottom:'calc(100% + 8px)',width:320,maxWidth:'100%',borderRadius:'var(--glass-radius)',padding:6,background:'var(--glass-bg-strong)'}}>
<div style={{display:'flex',alignItems:'center',padding:'4px 10px 6px'}}><span style={{...labelStyle,color:'var(--text-faint)',flex:1}}>Previous chats</span><button style={chatLink} onClick={()=>{onNew();setHist(false);}}>New chat</button></div>
{n>0&&<div style={{padding:'7px 10px',borderRadius:'var(--radius-2)',background:'var(--glass-hover)'}}><div style={{fontSize:14,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{thread[0].q}</div><div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-faint)',marginTop:2}}>Current · {n} question{n>1?'s':''}</div></div>}
{history.map(h=><button key={h.id} onClick={()=>{onLoad(h);setHist(false);}} style={{display:'block',width:'100%',textAlign:'left',background:'none',border:'none',borderRadius:'var(--radius-2)',padding:'7px 10px',cursor:'pointer',color:'var(--text-body)',fontFamily:'var(--font-sans)'}} onMouseEnter={e=>e.currentTarget.style.background='var(--glass-hover)'} onMouseLeave={e=>e.currentTarget.style.background='none'}><div style={{fontSize:14,fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{h.title}</div><div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-faint)',marginTop:2}}>{h.place} · {h.thread.length} question{h.thread.length>1?'s':''} · {h.date}</div></button>)}
{history.length===0&&n===0&&<div style={{fontSize:13,color:'var(--text-muted)',padding:'6px 10px 8px'}}>No previous chats yet.</div>}
</div>}
</div>
</div>;
}
function AskMenu({menu,onAsk,onClose}){
React.useEffect(()=>{if(!menu)return;const k=e=>{if(e.key==='Escape')onClose();};const c=()=>onClose();window.addEventListener('keydown',k);const id=setTimeout(()=>window.addEventListener('pointerdown',c),0);return()=>{clearTimeout(id);window.removeEventListener('keydown',k);window.removeEventListener('pointerdown',c);};},[menu]);
if(!menu)return null;
const W=280,left=Math.max(16,Math.min(window.innerWidth-W-16,menu.x+12)),top=Math.max(16,Math.min(window.innerHeight-60-menu.qs.length*36,menu.y+12));
return <div className="nm-glass nm-glass-surface" onPointerDown={e=>e.stopPropagation()} style={{position:'fixed',left,top,width:W,borderRadius:'var(--glass-radius)',padding:6,zIndex:50}}>
<div style={{...labelStyle,color:'var(--text-faint)',padding:'4px 10px 6px'}}>Ask about {menu.title}</div>
{menu.qs.map(q=><button key={q} onClick={()=>{onAsk(q);onClose();}} style={{display:'block',width:'100%',textAlign:'left',fontFamily:'var(--font-sans)',fontSize:14,color:'var(--text-body)',background:'none',border:'none',borderRadius:'var(--radius-2)',padding:'7px 10px',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='var(--glass-hover)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>{q}</button>)}
</div>;
}
Object.assign(window,{AskMenu,ChatDock,WORLD_EXTRA,DETAIL_EXTRA});
