const {QueryBar:DQueryBar,EvidenceTag:DEvidence,Badge:DBadge,Button:DButton,Card:DCard,Switch,Panel:DPanel}=window.NomaDesignSystem_02438c;
const VENT={x:49,y:28};
const MONTHS=['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
const tDate=t=>{const d=new Date(2025,9,1);d.setDate(d.getDate()+Math.round(t*359));return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});};
const defaults=e=>({wind:{dir:270,speed:22,label:'W 22 kt at 5 km'},weather:{temp:'—',cloud:'—',vis:'—'},places:[],forests:[],
streams:[{k:'main',label:e.stream.label,unit:e.stream.unit,val:'—',trend:'rising',ev:'observed',base:e.stream.base,amp:e.stream.amp}],
models:[{name:'Ash dispersion',state:'Ready',detail:'On request'}],history:[{t:0.5,label:'Previous episode',major:true},{t:0.95,label:'Current episode',major:true}]});
function detailAnswer(q,d){const l=q.toLowerCase();const full=d.places.length>0;
const st=d.streams.find(s=>l.includes(s.label.toLowerCase()));
if(st&&/over the last year|history|record/.test(l))return {a:{title:st.label+': 12-month record',body:'The current value is the highest since the December 2025 lava fountain. Drag the timeline to compare episodes.',ev:'historical'},set:{timeOpen:true}};
if(st&&/why/.test(l))return {a:{title:st.label+' is '+st.trend+' with the current episode',body:'Rising '+st.label.toLowerCase()+' usually tracks magma moving into the shallow conduit. It rose the same way for 9 days before the last lava fountain.',ev:'inferred'},set:{}};
const pl=d.places.find(p=>l.includes(p.name.toLowerCase()));
if(pl&&/reach|exposed|ash|risk/.test(l))return {a:{title:pl.bear.includes('S')||pl.bear.includes('E')?pl.name+' is downwind today':pl.name+' is upwind today',body:pl.bear.includes('S')||pl.bear.includes('E')?'Light ashfall is likely in '+pl.name+' ('+pl.dist+' '+pl.bear+') from late morning. Accumulation should stay below 1 mm.':'Current winds carry ash away from '+pl.name+'. Exposure is low unless winds turn easterly.',ev:'forecast'},set:{plume:true,places:true}};
if(/at risk/.test(l)&&/forest|woodland|pineta|park/.test(l))return {a:{title:'Low risk to woodland this week',body:'Modelled lava paths stay inside the Valle del Bove, away from forested flanks. Ashfall on the eastern pine stands is light.',ev:'modelled'},set:{lava:true,places:true}};
if(/plume|wind|ash|smoke/.test(l))return {a:{title:full?'Ash is drifting east-southeast':'Ash would drift downwind',body:full?`Winds of ${d.wind.label} carry the plume toward the Ionian coast. The shaded footprint shows where ash is likely to fall in the next 6 hours; it fades where the forecast is less certain.`:`Winds of ${d.wind.label} would carry ash away from ${d.name}. The footprint fades where the forecast is less certain.`,ev:'forecast'},set:{plume:true}};
if(!full)return {a:{title:'Not available yet for '+d.name,body:'Detailed local data for this system is not in the prototype. Etna has the full sample dataset.',ev:'inferred'},set:{}};
if(/earthquake|quake|seism/.test(l))return {a:{title:'38 earthquakes in the last 24 hours',body:'Most are shallow, 1–4 km beneath the summit craters. The largest was M 2.9 at 04:12 UTC.',ev:'observed'},set:{quakes:true}};
if(/city|cities|town|near|who|people|forest/.test(l))return {a:{title:'Three towns lie within 15 km of the active vent',body:'Zafferana Etnea, Nicolosi and Bronte. Catania (300k) is 28 km southeast, downwind today. Woodland covers much of the lower north and southwest flanks.',ev:'retrieved'},set:{places:true}};
if(/lava|flow/.test(l))return {a:{title:'Lava would most likely flow southeast',body:'Three modelled paths follow the Valle del Bove. None reach inhabited areas within 72 hours at current effusion rates.',ev:'modelled'},set:{lava:true}};
if(/before|history|last year|past|changed/.test(l))return {a:{title:'Jumped to the December 2025 lava fountain',body:'Tremor rose for 9 days before that episode, a pattern similar to this week.',ev:'historical'},set:{t:0.52,timeOpen:true}};
return {a:{title:d.headline,body:d.summary,ev:'observed'},set:{}};}
function DetailView({event,onBack,onAnswer,drawerOpen,registerAsk,initState,onContext,dockH=56}){
const d={...defaults(event),...event};
const [o,setO]=React.useState({plume:false,quakes:false,places:true,lava:false,t:1,timeOpen:true,...(initState||{})});
const [answer,setAnswer]=React.useState(null);
const [menu,setMenu]=React.useState(null);
const openMenu=(e,title,qs)=>{e.stopPropagation();setMenu({x:e.clientX,y:e.clientY,title,qs});};

const [vw,setVw]=React.useState(window.innerWidth);
React.useEffect(()=>{const r=()=>setVw(window.innerWidth);window.addEventListener('resize',r);return()=>window.removeEventListener('resize',r);},[]);
const RW=vw>=1100?340:300;
const live=o.t>0.97;
const set=p=>setO(s=>({...s,...p}));
const ask=q=>{const r=detailAnswer(q,d);setAnswer({q,...r.a});set(r.set);
const ns={...o,...r.set};const tl=ns.t>0.97?'Now':tDate(ns.t);
onAnswer&&onAnswer({q,view:'detail',eventId:event.id,state:ns,ctx:d.name+' · '+tl,answer:{...r.a,...(DETAIL_EXTRA[r.a.title]||{sources:[{n:'Noma synthesis of current observations',k:'inferred'}]})}});};
React.useEffect(()=>{onContext&&onContext([d.name,live?'Now':tDate(o.t),...(o.plume?['Ash forecast']:[]),...(o.quakes?['Earthquakes']:[]),...(o.lava?['Lava paths']:[]),...(o.places&&d.places.length?['Towns']:[])]);},[o.t,o.plume,o.quakes,o.lava,o.places]);
const windRot=(d.wind.dir+180)%360-90;
React.useEffect(()=>{registerAsk&&registerAsk({ask,insets:vw>=1100?{left:RW+32,right:RW+32}:{left:16,right:16},placeholder:`Ask about ${d.name}…`,suggestions:sugg});});
const sugg=d.places.length?['Where is the plume going?','Who lives nearby?','Show me the earthquakes','Where would lava flow?','What happened before the last eruption?']:['Where is the plume going?',`Why is ${d.streams[0].label.toLowerCase()} rising?`];
return <div className="nm-fadein" style={{position:'absolute',inset:0,background:'var(--map-ground)',overflow:'hidden'}}>
<div style={{position:'absolute',inset:0}}><image-slot id={'terrain-'+event.id} shape="rect" src={event.img||''} placeholder={'Drop a terrain render of '+event.name}></image-slot></div>
<div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(180deg,rgba(15,19,23,0.4),transparent 16%,transparent 78%,rgba(15,19,23,0.5))'}}></div>
<div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
{live&&[0,1,2,3,4,5].map(i=><div key={i} className="nm-puff" style={{left:VENT.x+'%',top:VENT.y+'%',animationDelay:(i*1.1)+'s','--wx':(Math.cos(windRot*Math.PI/180)*180)+'px','--wy':(Math.sin(windRot*Math.PI/180)*60-90)+'px'}}></div>)}
{Array.from({length:14}).map((_,i)=><div key={i} style={{position:'absolute',left:(8+(i%7)*11)+'%',top:(9+Math.floor(i/7)*9)+'%',color:'rgba(233,237,241,0.35)',fontSize:13,transform:`rotate(${windRot}deg)`}}>→</div>)}
{o.plume&&<div style={{position:'absolute',left:VENT.x+'%',top:VENT.y+'%',width:'46vw',height:'20vw',marginTop:'-10vw',transformOrigin:'0 50%',transform:`rotate(${windRot+14}deg)`,background:'radial-gradient(80% 55% at 4% 50%, rgba(233,237,241,0.55), rgba(233,237,241,0.25) 45%, rgba(233,237,241,0.07) 72%, transparent 86%)',borderRadius:'50%'}}></div>}
{o.lava&&<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
{['M49,28 C52,40 58,52 63,70','M49,28 C47,42 44,58 40,76','M49,28 C56,36 64,44 71,55'].map((p,i)=><path key={i} d={p} fill="none" stroke="#E0442F" strokeWidth={i===0?2.5:1.5} strokeDasharray="4 3" vectorEffect="non-scaling-stroke" opacity={i===0?0.95:0.6}/>)}
</svg>}
{o.quakes&&[[47,31,2.9],[50,33,1.8],[48,35,2.2],[52,30,1.2],[46,29,1.5],[51,36,2.4],[49,32,1.1],[53,34,1.6]].map(([x,y,m],i)=><div key={i} style={{position:'absolute',left:x+'%',top:y+'%',width:m*8,height:m*8,margin:-m*4,borderRadius:'50%',border:'1.5px solid #E9EDF1',background:'rgba(233,237,241,0.2)'}}></div>)}
{o.places&&d.forests.map(f=><div key={f.name} onClick={e=>openMenu(e,f.name,[`Is ${f.name} at risk?`,'Where would lava flow?'])} style={{pointerEvents:'auto',cursor:'pointer',position:'absolute',left:f.x+'%',top:f.y+'%',width:f.w+'%',height:f.h+'%',borderRadius:'40%',border:'1px dashed rgba(143,190,128,0.8)',background:'rgba(62,124,79,0.22)'}}><span style={{...labelStyle,position:'absolute',left:10,top:8,color:'#CFE3C4'}}>{f.name}</span></div>)}
{o.places&&d.places.map(p=><div key={p.name} onClick={e=>openMenu(e,p.name,[`Will ash reach ${p.name}?`,`How exposed is ${p.name}?`,'Who lives nearby?'])} style={{position:'absolute',left:p.x+'%',top:p.y+'%',display:'flex',alignItems:'center',gap:6,transform:'translate(-5px,-5px)',pointerEvents:'auto',cursor:'pointer'}}>
<span style={{width:9,height:9,borderRadius:p.type==='city'?2:'50%',background:'#F6F4EF',border:'2px solid #161B20'}}></span>
<span className="nm-glass nm-glass-surface" style={{padding:'3px 8px',borderRadius:'var(--radius-1)',fontSize:13,whiteSpace:'nowrap'}}>{p.name}<span style={{...labelStyle,color:'var(--text-muted)',marginLeft:8}}>{p.dist} {p.bear}{p.pop?' · '+p.pop:''}</span></span>
</div>)}
<div onClick={e=>openMenu(e,'the active vent',d.places.length?['Where is the plume going?','Where would lava flow?','Show me the earthquakes']:['Where is the plume going?',`Why is ${d.streams[0].label.toLowerCase()} rising?`])} style={{position:'absolute',left:VENT.x+'%',top:VENT.y+'%',transform:'translate(-50%,-6px)',padding:'8px 10px',pointerEvents:'auto',cursor:'pointer',...labelStyle,color:'#E9EDF1',textShadow:'0 1px 3px #000'}}>▲ Active vent</div>
</div>
<div className="nm-glass nm-glass-surface" style={{position:'absolute',top:16,left:16,display:'flex',alignItems:'center',gap:12,borderRadius:'var(--radius-pill)',padding:'6px 16px 6px 6px',maxWidth:`calc(100% - ${RW+48}px)`,overflow:'hidden',boxSizing:'border-box'}}>
<DButton size="sm" variant="secondary" onClick={onBack} style={{borderRadius:999,whiteSpace:'nowrap',flex:'none'}}>← Earth</DButton>
<span style={{fontWeight:600,fontSize:17,whiteSpace:'nowrap'}}>{d.name}</span>
<span style={{fontSize:14,color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0}}>{d.region}</span>
<ThemeToggle/>
<DBadge tone={live?(d.tone==='neutral'||d.tone==='quiet'?'neutral':d.tone):'neutral'} style={{whiteSpace:'nowrap'}}>{live?d.status:'Historical'}</DBadge>
</div>
<RightColumn d={d} live={live} o={o} set={set} RW={RW} B={vw>=1100?16:dockH+26} openMenu={openMenu}/>
<AskMenu menu={menu} onAsk={ask} onClose={()=>setMenu(null)}/>
<div style={{position:'absolute',top:16,right:16,bottom:vw>=1100?16:dockH+26,width:RW,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
<ModelsPanel d={d} o={o} set={set}/>
<TimePanel o={o} set={set} d={d} live={live}/>
</div>
</div>;
}
function TimePanel({o,set,d,live}){
return <DPanel title="Time" meta={live?<span style={{color:'#5FA36F'}}>● Now</span>:tDate(o.t)} open={o.timeOpen} onToggle={v=>set({timeOpen:v})}>
<Timeline t={o.t} setT={t=>set({t})} marks={d.history}/>
{!live&&<div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}><DButton size="sm" variant="secondary" onClick={()=>set({t:1})}>Return to now</DButton></div>}
</DPanel>;
}
function ModelsPanel({d,o,set}){
return <DPanel title="Models & overlays" meta={d.models.filter(m=>m.state==='Running').length+' running'}>
{d.models.map((m,i)=>{const key=m.name==='Ash dispersion'?'plume':m.name==='Lava flow paths'?'lava':null;
return <div key={m.name} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderTop:i?'1px solid var(--line-1)':'none'}}>
<div style={{flex:1}}><div style={{fontSize:14}}>{m.name}</div><div style={{fontSize:12,color:'var(--text-faint)'}}>{m.state} · {m.detail}</div></div>
{key&&<Switch checked={o[key]} onChange={e=>set({[key]:e.target.checked})}/>}
</div>;})}
{d.places.length>0&&<div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderTop:'1px solid var(--line-1)'}}><div style={{flex:1,fontSize:14}}>Towns & forests</div><Switch checked={o.places} onChange={e=>set({places:e.target.checked})}/></div>}
</DPanel>;
}
function RightColumn({d,live,o,set,RW,B,openMenu}){
return <div style={{position:'absolute',top:72,left:16,bottom:B,width:RW,display:'flex',flexDirection:'column',gap:10,overflow:'auto'}}>
<DPanel title="Data streams" meta={live?<span style={{color:'#5FA36F'}}>● Live</span>:'Paused'}>
{d.streams.map((s,i)=><div key={s.k} onClick={e=>openMenu(e,s.label.toLowerCase(),[`Why is ${s.label.toLowerCase()} ${s.trend}?`,`Show ${s.label.toLowerCase()} over the last year`])} title="Ask about this" style={{marginTop:i?12:2,cursor:'pointer',borderRadius:6}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}><span style={{fontSize:14,fontWeight:500,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.label}</span><span style={{fontFamily:'var(--font-mono)',fontSize:13,whiteSpace:'nowrap',flexShrink:0,marginLeft:8}}>{s.val} <span style={{color:'var(--text-faint)',fontSize:11}}>{s.unit}</span></span></div>
<div style={{marginTop:4}}><Spark base={s.base} amp={s.amp} w={RW-30} h={24} paused={!live} dark/></div>
<div style={{display:'flex',justifyContent:'space-between',marginTop:4}}><DEvidence kind={live?s.ev:'historical'}/><span style={{...labelStyle,color:'var(--text-faint)'}}>{s.trend}</span></div>
</div>)}
</DPanel>
<DPanel title="Local conditions" meta={d.wind.label.split(' at')[0]}>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 16px'}}>
{[['Wind',d.wind.label],['Temperature',d.weather.temp],['Cloud',d.weather.cloud],['Visibility',d.weather.vis]].map(([k,v])=><div key={k}><div style={{...labelStyle,color:'var(--text-faint)'}}>{k}</div><div style={{fontFamily:'var(--font-mono)',fontSize:13,marginTop:2}}>{v}</div></div>)}
</div>
<div style={{marginTop:10}}><DEvidence kind="forecast"/></div>
</DPanel>

</div>;
}
function Timeline({t,setT,marks}){
const ref=React.useRef(null);
const drag=e=>{const r=ref.current.getBoundingClientRect();setT(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)));};
const down=e=>{drag(e);const mv=ev=>drag(ev);const up=()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);};window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);};
const live=t>0.97;
return <div style={{display:'flex',alignItems:'center',gap:14,padding:'2px 4px 0'}}>
<div ref={ref} onPointerDown={down} style={{flex:1,height:40,position:'relative',cursor:'ew-resize',touchAction:'none'}}>
<div style={{position:'absolute',left:0,right:0,top:14,height:2,background:'var(--line-1)'}}></div>
<div style={{position:'absolute',left:0,width:(t*100)+'%',top:14,height:2,background:'var(--ink-3)'}}></div>
{MONTHS.map((m,i)=>i%2===0&&<span key={m+i} style={{position:'absolute',left:(i/12*100)+'%',top:24,...labelStyle,color:'var(--text-faint)'}}>{m}</span>)}
{marks.map(m=><span key={m.label} title={m.label} onPointerDown={e=>{e.stopPropagation();setT(m.t);}} style={{position:'absolute',left:(m.t*100)+'%',top:15,width:m.major?10:7,height:m.major?10:7,transform:'translate(-50%,-50%)',borderRadius:'50%',background:m.major?'#E0442F':'var(--ink-3)',border:'2px solid #1D242B',cursor:'pointer'}}></span>)}
<div style={{position:'absolute',left:(t*100)+'%',top:2,bottom:16,width:2,marginLeft:-1,background:'var(--ink-1)'}}><div style={{position:'absolute',top:-2,left:-5,width:12,height:12,borderRadius:'50%',background:'var(--ink-1)'}}></div></div>
</div>
</div>;
}
Object.assign(window,{DetailView});
