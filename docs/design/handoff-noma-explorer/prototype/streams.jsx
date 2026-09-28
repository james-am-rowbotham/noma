function useLiveSeries(base,amp,n=48,paused){
const gen=(i)=>base+amp*(Math.sin(i/4)*0.5+Math.sin(i/1.7)*0.3+(Math.random()-0.5)*0.6);
const [s,set]=React.useState(()=>Array.from({length:n},(_,i)=>gen(i)));
const iRef=React.useRef(n);
React.useEffect(()=>{if(paused)return;const t=setInterval(()=>{iRef.current++;set(v=>[...v.slice(1),gen(iRef.current)]);},900);return()=>clearInterval(t);},[base,amp,paused]);
return s;
}
function Spark({base,amp,w=220,h=36,dark,paused,color}){
const s=useLiveSeries(base,amp,48,paused);
const min=Math.min(...s),max=Math.max(...s),r=max-min||1;
const pts=s.map((v,i)=>(i/(s.length-1)*w).toFixed(1)+','+(h-2-(v-min)/r*(h-4)).toFixed(1)).join(' ');
const last=s[s.length-1],ly=h-2-(last-min)/r*(h-4);
const c=color||(dark?'var(--map-ink)':'var(--ink-1)');
return <svg width={w} height={h} style={{display:'block',overflow:'visible'}}>
<line x1="0" x2={w} y1={h-1} y2={h-1} stroke={dark?'var(--map-line)':'var(--line-1)'}/>
<polyline points={pts} fill="none" stroke={c} strokeWidth="1.25" strokeLinejoin="round"/>
{!paused&&<circle cx={w} cy={ly} r="2.5" fill={c}/>}
</svg>;
}
const labelStyle={fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase'};
function ThemeToggle(){
const [t,setT]=React.useState(document.documentElement.dataset.theme||'dark');
const flip=()=>{const n=t==='dark'?'light':'dark';document.documentElement.dataset.theme=n;localStorage.setItem('noma-theme',n);setT(n);};
return <button onClick={flip} title={t==='dark'?'Light theme':'Dark theme'} aria-label="Toggle theme" style={{width:26,height:26,flex:'none',borderRadius:'50%',border:'1px solid var(--line-1)',background:'var(--glass-hover)',color:'var(--text-body)',cursor:'pointer',fontSize:13,lineHeight:1,padding:0}}>{t==='dark'?'☀':'☾'}</button>;
}
const NOMA_SETTINGS_KEY='noma-settings';
function readSettings(){try{return {theme:document.documentElement.dataset.theme||'dark',time:'utc',units:'metric',motion:'full',labels:true,...JSON.parse(localStorage.getItem(NOMA_SETTINGS_KEY)||'{}'),theme:document.documentElement.dataset.theme||'dark'};}catch(e){return {theme:'dark',time:'utc',units:'metric',motion:'full',labels:true};}}
function applySettings(s){const r=document.documentElement;r.dataset.theme=s.theme;localStorage.setItem('noma-theme',s.theme);r.dataset.motion=s.motion;localStorage.setItem(NOMA_SETTINGS_KEY,JSON.stringify({time:s.time,units:s.units,motion:s.motion,labels:s.labels}));window.dispatchEvent(new CustomEvent('noma-settings',{detail:s}));}
function Seg({value,options,onChange}){return <div style={{display:'inline-flex',padding:2,borderRadius:999,background:'var(--glass-hover)',border:'1px solid var(--line-1)'}}>
{options.map(([v,l])=><button key={v} onClick={()=>onChange(v)} style={{fontFamily:'var(--font-sans)',fontSize:13,padding:'5px 12px',borderRadius:999,border:'none',cursor:'pointer',whiteSpace:'nowrap',background:value===v?'var(--ink-1)':'transparent',color:value===v?'var(--paper-1)':'var(--text-body)',fontWeight:value===v?500:400}}>{l}</button>)}</div>;}
function SettingsModal({onClose}){
const [s,setS]=React.useState(readSettings);
const up=p=>{const n={...s,...p};setS(n);applySettings(n);};
const SW=window.NomaDesignSystem_02438c.Switch;
React.useEffect(()=>{const k=e=>{if(e.key==='Escape')onClose();};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k);},[]);
const Row=({t,sub,children})=><div style={{display:'flex',alignItems:'center',gap:16,padding:'12px 0',borderTop:'1px solid var(--line-1)'}}><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:500}}>{t}</div>{sub&&<div style={{fontSize:12,color:'var(--text-faint)',marginTop:2}}>{sub}</div>}</div>{children}</div>;
return ReactDOM.createPortal(<div onPointerDown={onClose} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(8,11,14,0.35)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
<div role="dialog" aria-label="Settings" className="nm-glass nm-glass-surface" onPointerDown={e=>e.stopPropagation()} style={{width:440,maxWidth:'100%',maxHeight:'calc(100vh - 32px)',overflowY:'auto',borderRadius:'var(--glass-radius)',background:'var(--glass-bg-strong)',padding:'16px 20px 8px',boxSizing:'border-box'}}>
<div style={{display:'flex',alignItems:'center',marginBottom:6}}><span style={{fontSize:17,fontWeight:600,flex:1}}>Settings</span><button onClick={onClose} aria-label="Close" style={{width:28,height:28,borderRadius:'50%',border:'none',background:'var(--glass-hover)',color:'var(--text-body)',cursor:'pointer',fontSize:16,lineHeight:1,padding:0}}>×</button></div>
<div style={{...labelStyle,color:'var(--text-faint)',margin:'10px 0 2px'}}>Appearance</div>
<Row t="Theme"><Seg value={s.theme} options={[['light','Light'],['dark','Dark']]} onChange={v=>up({theme:v})}/></Row>
<Row t="Motion" sub="Reduce turns off plume, pulse and card transitions"><Seg value={s.motion} options={[['full','Full'],['reduced','Reduced']]} onChange={v=>up({motion:v})}/></Row>
<Row t="Map labels" sub="Names beside markers in filter views">{SW&&<SW checked={s.labels} onChange={e=>up({labels:e.target.checked})}/>}</Row>
<div style={{...labelStyle,color:'var(--text-faint)',margin:'16px 0 2px'}}>Data display</div>
<Row t="Time" sub="Used for timestamps and the timeline"><Seg value={s.time} options={[['utc','UTC'],['local','Local']]} onChange={v=>up({time:v})}/></Row>
<Row t="Units" sub="Distances, heights and wind"><Seg value={s.units} options={[['metric','Metric'],['imperial','Imperial']]} onChange={v=>up({units:v})}/></Row>
</div></div>,document.body);
}
function useSettings(){const [s,setS]=React.useState(readSettings);React.useEffect(()=>{const h=e=>setS(e.detail);window.addEventListener('noma-settings',h);return()=>window.removeEventListener('noma-settings',h);},[]);return s;}
function Wordmark(){return <div className="nm-glass nm-glass-surface" aria-label="Noma" style={{height:44,flex:'none',boxSizing:'border-box',display:'flex',alignItems:'center',padding:'0 16px',borderRadius:999}}><span style={{fontSize:18,fontWeight:600,letterSpacing:'-0.02em',lineHeight:1}}>noma</span></div>;}
function SettingsButton(){const [o,setO]=React.useState(false);
return <><button onClick={()=>setO(true)} aria-label="Settings" title="Settings" className="nm-glass nm-glass-surface" style={{width:44,height:44,flex:'none',borderRadius:'50%',cursor:'pointer',color:'var(--text-body)',display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
</button>{o&&<SettingsModal onClose={()=>setO(false)}/>}</>;}
Object.assign(window,{Spark,useLiveSeries,labelStyle,ThemeToggle,SettingsButton,useSettings,Wordmark});
