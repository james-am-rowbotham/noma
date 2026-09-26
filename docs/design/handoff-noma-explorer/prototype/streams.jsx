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
Object.assign(window,{Spark,useLiveSeries,labelStyle,ThemeToggle});
