# Component source (reference)

Design-system primitives used by the prototype, stored as Markdown so they are not compiled. Recreate in your framework.

## components/core/Button.d.ts

```ts
/** Primary action button.
 * @startingPoint section="Core" subtitle="Primary, secondary, ghost, dark" viewport="700x220"
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;

```

## components/core/Button.jsx

```jsx
import React from 'react';
export function Button({variant='primary',size='md',disabled,children,style,...rest}){
const pad=size==='sm'?'5px 12px':size==='lg'?'10px 20px':'7px 16px';
const base={fontFamily:'var(--font-sans)',fontWeight:500,fontSize:size==='sm'?13:15,padding:pad,borderRadius:'var(--radius-2)',border:'1px solid transparent',cursor:disabled?'default':'pointer',opacity:disabled?0.45:1,transition:'background var(--dur-fast),border-color var(--dur-fast)',display:'inline-flex',alignItems:'center',gap:8,lineHeight:1.2};
const v={primary:{background:'var(--accent)',color:'#fff'},secondary:{background:'var(--surface-card)',color:'var(--text-body)',borderColor:'var(--border-strong)'},ghost:{background:'transparent',color:'var(--text-body)'},dark:{background:'var(--ink-1)',color:'var(--paper-1)'}}[variant]||{};
return <button disabled={disabled} style={{...base,...v,...style}} {...rest}>{children}</button>;
}

```

## components/core/Checkbox.d.ts

```ts
/** Checkbox with label. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;

```

## components/core/Checkbox.jsx

```jsx
import React from 'react';
export function Checkbox({label,checked,onChange,disabled,style}){
return <label style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:14,color:'var(--text-body)',cursor:disabled?'default':'pointer',opacity:disabled?0.45:1,...style}}>
<span style={{width:16,height:16,borderRadius:'var(--radius-1)',border:'1px solid '+(checked?'var(--accent)':'var(--border-strong)'),background:checked?'var(--accent)':'var(--surface-card)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,lineHeight:1,transition:'background var(--dur-fast)'}}>{checked?'✓':''}</span>
<input type="checkbox" checked={!!checked} disabled={disabled} onChange={onChange} style={{position:'absolute',opacity:0,width:0,height:0}}/>
{label}
</label>;
}

```

## components/core/IconButton.d.ts

```ts
/** Square 32px icon-only button. */
export interface IconButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;

```

## components/core/IconButton.jsx

```jsx
import React from 'react';
export function IconButton({label,active,disabled,children,style,...rest}){
return <button aria-label={label} title={label} disabled={disabled} style={{width:32,height:32,display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'var(--radius-2)',border:'1px solid '+(active?'var(--accent)':'var(--border-default)'),background:active?'var(--accent-soft)':'var(--surface-card)',color:active?'var(--accent-ink)':'var(--text-muted)',cursor:disabled?'default':'pointer',opacity:disabled?0.45:1,transition:'background var(--dur-fast)',...style}} {...rest}>{children}</button>;
}

```

## components/core/Input.d.ts

```ts
/** Text input with optional label and hint. */
export interface InputProps {
  label?: string;
  hint?: string;
  /** Use IBM Plex Mono for the value (numbers, coordinates). */
  mono?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;

```

## components/core/Input.jsx

```jsx
import React from 'react';
export function Input({label,hint,mono,style,inputStyle,...rest}){
return <label style={{display:'block',fontSize:13,color:'var(--text-muted)',...style}}>
{label&&<div style={{marginBottom:4,fontWeight:500}}>{label}</div>}
<input style={{width:'100%',boxSizing:'border-box',padding:'7px 10px',fontSize:15,fontFamily:mono?'var(--font-mono)':'var(--font-sans)',color:'var(--text-body)',background:'var(--surface-card)',border:'1px solid var(--border-strong)',borderRadius:'var(--radius-2)',outline:'none',...inputStyle}} {...rest}/>
{hint&&<div style={{marginTop:4,fontSize:12,color:'var(--text-faint)'}}>{hint}</div>}
</label>;
}

```

## components/core/Radio.d.ts

```ts
/** Radio option with label. */
export interface RadioProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: any) => void;
  name?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;

```

## components/core/Radio.jsx

```jsx
import React from 'react';
export function Radio({label,checked,onChange,name,disabled,style}){
return <label style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:14,color:'var(--text-body)',cursor:disabled?'default':'pointer',opacity:disabled?0.45:1,...style}}>
<span style={{width:16,height:16,borderRadius:'50%',border:checked?'5px solid var(--accent)':'1px solid var(--border-strong)',background:'var(--surface-card)',boxSizing:'border-box',transition:'border var(--dur-fast)'}}></span>
<input type="radio" name={name} checked={!!checked} disabled={disabled} onChange={onChange} style={{position:'absolute',opacity:0,width:0,height:0}}/>
{label}
</label>;
}

```

## components/core/Select.d.ts

```ts
/** Native select with label. */
export interface SelectProps {
  label?: string;
  options: string[];
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
  selectStyle?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;

```

## components/core/Select.jsx

```jsx
import React from 'react';
export function Select({label,options=[],style,selectStyle,...rest}){
return <label style={{display:'block',fontSize:13,color:'var(--text-muted)',...style}}>
{label&&<div style={{marginBottom:4,fontWeight:500}}>{label}</div>}
<select style={{width:'100%',padding:'7px 8px',fontSize:15,fontFamily:'var(--font-sans)',color:'var(--text-body)',background:'var(--surface-card)',border:'1px solid var(--border-strong)',borderRadius:'var(--radius-2)',outline:'none',...selectStyle}} {...rest}>
{options.map(o=><option key={o} value={o}>{o}</option>)}
</select>
</label>;
}

```

## components/core/Switch.d.ts

```ts
/** Toggle switch with label. */
export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  onChange?: (e: any) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;

```

## components/core/Switch.jsx

```jsx
import React from 'react';
export function Switch({label,checked,onChange,disabled,style}){
return <label style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:14,color:'var(--text-body)',cursor:disabled?'default':'pointer',opacity:disabled?0.45:1,...style}}>
<span style={{width:32,height:18,borderRadius:999,background:checked?'var(--accent)':'var(--line-2)',position:'relative',transition:'background var(--dur-fast)',flex:'none'}}>
<span style={{position:'absolute',top:2,left:checked?16:2,width:14,height:14,borderRadius:'50%',background:'#fff',transition:'left var(--dur-fast)'}}></span>
</span>
<input type="checkbox" checked={!!checked} disabled={disabled} onChange={onChange} style={{position:'absolute',opacity:0,width:0,height:0}}/>
{label}
</label>;
}

```

## components/core/Tabs.d.ts

```ts
/** Underline tabs. */
export interface TabsProps {
  tabs: string[];
  value: string;
  onChange?: (tab: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;

```

## components/core/Tabs.jsx

```jsx
import React from 'react';
export function Tabs({tabs=[],value,onChange,style}){
return <div role="tablist" style={{display:'flex',gap:2,borderBottom:'1px solid var(--border-default)',...style}}>
{tabs.map(t=>{const a=t===value;
return <button key={t} role="tab" aria-selected={a} onClick={()=>onChange&&onChange(t)} style={{padding:'8px 12px',fontSize:14,fontFamily:'var(--font-sans)',fontWeight:a?600:400,color:a?'var(--text-body)':'var(--text-muted)',background:'none',border:'none',borderBottom:a?'2px solid var(--accent)':'2px solid transparent',marginBottom:-1,cursor:'pointer'}}>{t}</button>;})}
</div>;
}

```

## components/surfaces/Badge.d.ts

```ts
/** Status pill — mono uppercase with a tone dot. */
export interface BadgeProps {
  tone?: 'neutral' | 'ok' | 'caution' | 'alert' | 'accent';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;

```

## components/surfaces/Badge.jsx

```jsx
import React from 'react';
export function Badge({tone='neutral',children,style}){
const c={neutral:'var(--text-muted)',ok:'var(--ok)',caution:'var(--caution)',alert:'var(--alert)',accent:'var(--accent-ink)'}[tone];
return <span style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:c,border:'1px solid var(--border-default)',borderRadius:'var(--radius-pill)',padding:'3px 10px',background:'var(--surface-card)',...style}}>
<span style={{width:6,height:6,borderRadius:'50%',background:c}}></span>{children}
</span>;
}

```

## components/surfaces/Card.d.ts

```ts
/** Content surface. `floating` for panels over the map (shadow, no border). */
export interface CardProps {
  title?: string;
  /** Mono uppercase instrument label above the title. */
  label?: string;
  floating?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;

```

## components/surfaces/Card.jsx

```jsx
import React from 'react';
export function Card({title,label,floating,children,style,...rest}){
return <div className={floating?'nm-glass nm-glass-surface':undefined} style={{...(floating?{borderRadius:'var(--glass-radius)'}:{background:'var(--surface-card)',border:'1px solid var(--border-default)',borderRadius:'var(--radius-2)'}),padding:16,...style}} {...rest}>
{label&&<div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',color:'var(--text-faint)',textTransform:'uppercase',marginBottom:6}}>{label}</div>}
{title&&<div style={{fontSize:15,fontWeight:600,marginBottom:8}}>{title}</div>}
{children}
</div>;
}

```

## components/surfaces/Dialog.d.ts

```ts
/** Modal dialog — for evidence inspection and confirmations only. */
export interface DialogProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;

```

## components/surfaces/Dialog.jsx

```jsx
import React from 'react';
export function Dialog({open,title,onClose,children,footer,width=440}){
if(!open)return null;
return <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(28,27,24,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
<div onClick={e=>e.stopPropagation()} role="dialog" style={{width,maxWidth:'90vw',background:'var(--surface-card)',borderRadius:'var(--radius-3)',boxShadow:'var(--shadow-3)',padding:20}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
<div style={{fontSize:17,fontWeight:600}}>{title}</div>
<button onClick={onClose} aria-label="Close" style={{border:'none',background:'none',cursor:'pointer',fontSize:18,color:'var(--text-faint)',lineHeight:1}}>×</button>
</div>
<div style={{fontSize:14,color:'var(--text-body)'}}>{children}</div>
{footer&&<div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16}}>{footer}</div>}
</div>
</div>;
}

```

## components/surfaces/Panel.d.ts

```ts
/** Foldable glass panel — the default container for anything floating over the map. */
export interface PanelProps {
  /** Mono uppercase header label. */
  title: React.ReactNode;
  /** Right-aligned header readout (count, status, time). Stays visible when folded. */
  meta?: React.ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  collapsible?: boolean;
  /** Smoked glass (default) or opaque paper. */
  glass?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}
export declare function Panel(props: PanelProps): JSX.Element;

```

## components/surfaces/Panel.jsx

```jsx
import React from 'react';
export function Panel({title,meta,defaultOpen=true,open,onToggle,collapsible=true,glass=true,children,style,bodyStyle}){
const [o,setO]=React.useState(defaultOpen);
const isOpen=open!==undefined?open:o;
const toggle=()=>{if(!collapsible)return;onToggle?onToggle(!isOpen):setO(!isOpen);};
return <div className={glass?'nm-glass nm-glass-surface':undefined} style={{borderRadius:'var(--glass-radius)',overflow:'hidden',flex:'none',...(glass?{}:{background:'var(--surface-card)',border:'1px solid var(--border-default)'}),...style}}>
<button onClick={toggle} aria-expanded={isOpen} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 14px',background:'none',border:'none',cursor:collapsible?'pointer':'default',color:'inherit',textAlign:'left'}}>
<span style={{flex:1,fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--text-faint)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</span>
{meta&&<span style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.06em',color:'var(--text-muted)',whiteSpace:'nowrap'}}>{meta}</span>}
{collapsible&&<span style={{fontSize:10,color:'var(--text-faint)',transform:isOpen?'none':'rotate(-90deg)',transition:'transform var(--dur-fast)'}}>▾</span>}
</button>
{isOpen&&<div style={{padding:'0 14px 14px',...bodyStyle}}>{children}</div>}
</div>;
}

```

## components/surfaces/Toast.d.ts

```ts
/** Transient dark notification. */
export interface ToastProps {
  tone?: 'neutral' | 'ok' | 'caution' | 'alert';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;

```

## components/surfaces/Toast.jsx

```jsx
import React from 'react';
export function Toast({children,tone='neutral',style}){
const bar={neutral:'var(--line-2)',ok:'var(--ok)',caution:'var(--caution)',alert:'var(--alert)'}[tone];
return <div role="status" style={{display:'inline-flex',alignItems:'center',gap:10,background:'var(--ink-1)',color:'var(--paper-1)',borderRadius:'var(--radius-2)',boxShadow:'var(--shadow-3)',padding:'10px 14px',fontSize:14,...style}}>
<span style={{width:3,alignSelf:'stretch',borderRadius:2,background:bar}}></span>{children}
</div>;
}

```

## components/surfaces/Tooltip.d.ts

```ts
/** Hover tooltip. */
export interface TooltipProps {
  text: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;

```

## components/surfaces/Tooltip.jsx

```jsx
import React from 'react';
export function Tooltip({text,children,style}){
const [show,set]=React.useState(false);
return <span style={{position:'relative',display:'inline-block',...style}} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}>
{children}
{show&&<span style={{position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:'var(--ink-1)',color:'var(--paper-1)',fontSize:12,padding:'4px 8px',borderRadius:'var(--radius-1)',whiteSpace:'nowrap',zIndex:50}}>{text}</span>}
</span>;
}

```

## components/noma/EvidenceTag.d.ts

```ts
/** Evidence classification marker — dot + mono label, unobtrusive.
 * @startingPoint section="Noma" subtitle="Observed / modelled / simulated provenance marker" viewport="700x200"
 */
export interface EvidenceTagProps {
  kind: 'observed' | 'historical' | 'retrieved' | 'calculated' | 'modelled' | 'simulated' | 'inferred' | 'forecast';
  /** Click-to-inspect handler; renders as a button when set. */
  onInspect?: () => void;
  /** Light-on-dark variant for panels over the map. */
  dark?: boolean;
  style?: React.CSSProperties;
}
export declare function EvidenceTag(props: EvidenceTagProps): JSX.Element;

```

## components/noma/EvidenceTag.jsx

```jsx
import React from 'react';
const COLORS={observed:'var(--ev-observed)',historical:'var(--ev-historical)',retrieved:'var(--ev-retrieved)',calculated:'var(--ev-calculated)',modelled:'var(--ev-modelled)',simulated:'var(--ev-simulated)',inferred:'var(--ev-inferred)',forecast:'var(--ev-forecast)'};
export function EvidenceTag({kind='observed',onInspect,dark,style}){
const c=COLORS[kind]||COLORS.observed;
return <button onClick={onInspect} title={onInspect?'Inspect evidence':undefined} style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:dark?'var(--map-ink-2)':'var(--text-muted)',background:'none',border:'none',padding:0,cursor:onInspect?'pointer':'default',...style}}>
<span style={{width:7,height:7,borderRadius:'50%',background:c}}></span>{kind}
</button>;
}

```

## components/noma/QueryBar.d.ts

```ts
/** The ask affordance — glass pill input; suggestions appear as a popover above it on focus (no layout space).
 * @startingPoint section="Noma" subtitle="Glass ask input with on-focus suggestions" viewport="700x160"
 */
export interface QueryBarProps {
  placeholder?: string;
  /** Contextual questions, shown in a popover above the input while it is focused and empty. */
  suggestions?: string[];
  /** Example questions that rotate through the empty field's placeholder every ~4 s. Tab accepts the one shown. */
  examples?: string[];
  onAsk?: (question: string) => void;
  /** Render without its own glass surface — for use inside a dock that already is one. */
  embedded?: boolean;
  /** Node rendered before the input (e.g. a time toggle). */
  leading?: React.ReactNode;
  /** Node rendered after the input, before submit (e.g. a thread toggle). */
  trailing?: React.ReactNode;
  /** Where the suggestion popover opens. Use 'below' when the bar sits at the top of the screen. */
  placement?: 'above' | 'below';
  style?: React.CSSProperties;
}
export declare function QueryBar(props: QueryBarProps): JSX.Element;

```

## components/noma/QueryBar.jsx

```jsx
import React from 'react';
export function QueryBar({placeholder="Ask about this place…",suggestions=[],examples=[],onAsk,embedded,leading,trailing,placement='above',style}){
const [v,set]=React.useState('');
const [focus,setFocus]=React.useState(false);
const [ix,setIx]=React.useState(0);
React.useEffect(()=>{if(!examples.length||v)return;const t=setInterval(()=>setIx(i=>(i+1)%examples.length),3800);return()=>clearInterval(t);},[examples.length,v]);
const ex=examples.length?examples[ix%examples.length]:null;
const submit=q=>{if(onAsk&&q.trim())onAsk(q.trim());set('');};
const showSugg=focus&&!v&&suggestions.length>0;
return <div className={embedded?undefined:'nm-glass'} style={{position:'relative',width:'100%',...style}}>
{showSugg&&<div className="nm-glass nm-glass-surface" style={{position:'absolute',left:0,right:0,...(placement==='below'?{top:'calc(100% + 8px)'}:{bottom:'calc(100% + 8px)'}),borderRadius:'var(--glass-radius)',padding:6,zIndex:20}}>
<div style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.08em',color:'var(--text-faint)',padding:'4px 10px 6px'}}>TRY ASKING</div>
{suggestions.map(s=><button key={s} onMouseDown={e=>{e.preventDefault();submit(s);}} style={{display:'block',width:'100%',textAlign:'left',fontSize:14,fontFamily:'var(--font-sans)',color:'var(--text-body)',background:'none',border:'none',borderRadius:'var(--radius-2)',padding:'6px 10px',cursor:'pointer'}} onMouseEnter={e=>e.currentTarget.style.background='var(--glass-hover)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>{s}</button>)}
</div>}
<form onSubmit={e=>{e.preventDefault();submit(v);}} className={embedded?undefined:'nm-glass-surface'} style={{display:'flex',alignItems:'center',gap:10,borderRadius:'var(--radius-pill)',padding:embedded?'2px 2px 2px 6px':'6px 8px 6px 18px'}}>
{leading}
<input value={v} onChange={e=>set(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} onKeyDown={e=>{if(e.key==='Tab'&&!v&&ex){e.preventDefault();set(ex);}}} placeholder={ex?'Try: '+ex+'   ⇥':placeholder} style={{flex:1,minWidth:0,border:'none',outline:'none',background:'none',fontSize:15,fontFamily:'var(--font-sans)',color:'var(--text-body)'}}/>
{trailing}
<button type="submit" aria-label="Ask" style={{width:32,height:32,flex:'none',borderRadius:'50%',border:'none',background:'var(--ink-1)',color:'var(--paper-1)',cursor:'pointer',fontSize:15,lineHeight:1}}>↑</button>
</form>
</div>;
}

```

## components/noma/ScenarioCard.d.ts

```ts
/** Compact simulation scenario — a question, minimum parameters, one Run action.
 * @startingPoint section="Noma" subtitle="Question-first simulation setup" viewport="700x240"
 */
export interface ScenarioCardProps {
  /** The hypothetical, phrased as asked: "What if the plume reaches 8 km?" */
  question: string;
  params?: { label: string; value: string }[];
  running?: boolean;
  onRun?: () => void;
  /** Reveals advanced parameters; omit to hide the affordance. */
  onAdvanced?: () => void;
  style?: React.CSSProperties;
}
export declare function ScenarioCard(props: ScenarioCardProps): JSX.Element;

```

## components/noma/ScenarioCard.jsx

```jsx
import React from 'react';
export function ScenarioCard({question,params=[],running,onRun,onAdvanced,style}){
return <div className="nm-glass nm-glass-surface" style={{borderRadius:'var(--glass-radius)',padding:16,width:280,...style}}>
<div style={{fontSize:14,fontWeight:600,marginBottom:12}}>{question}</div>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px 16px',marginBottom:14}}>
{params.map(p=><div key={p.label}>
<div style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.08em',color:'var(--text-faint)',textTransform:'uppercase'}}>{p.label}</div>
<div style={{fontFamily:'var(--font-mono)',fontSize:14,marginTop:2}}>{p.value}</div>
</div>)}
</div>
<div style={{display:'flex',alignItems:'center',gap:10}}>
<button onClick={onRun} disabled={running} style={{flex:1,padding:'8px 0',fontSize:14,fontWeight:500,fontFamily:'var(--font-sans)',color:'#fff',background:'var(--accent)',border:'none',borderRadius:'var(--radius-2)',cursor:'pointer',opacity:running?0.6:1}}>{running?'Running…':'Run simulation'}</button>
{onAdvanced&&<button onClick={onAdvanced} style={{fontSize:13,fontFamily:'var(--font-sans)',color:'var(--text-muted)',background:'none',border:'none',cursor:'pointer'}}>Advanced</button>}
</div>
</div>;
}

```

## components/noma/TimeStrip.d.ts

```ts
/** Time navigation pill — Now / recent / historical, with optional event marks.
 * @startingPoint section="Noma" subtitle="Now → recent → historical navigation" viewport="700x120"
 */
export interface TimeStripProps {
  range?: string;
  ranges?: string[];
  onChange?: (range: string) => void;
  /** Event dots along the strip; major ones render in accent. */
  marks?: { label: string; major?: boolean }[];
  /** Right-hand current-time readout. */
  now?: string;
  style?: React.CSSProperties;
}
export declare function TimeStrip(props: TimeStripProps): JSX.Element;

```

## components/noma/TimeStrip.jsx

```jsx
import React from 'react';
export function TimeStrip({range='7d',ranges=['24h','7d','30d','1y','Historical'],onChange,marks=[],now='Now',style}){
return <div className="nm-glass nm-glass-surface" style={{display:'inline-flex',alignItems:'center',gap:14,borderRadius:'var(--radius-pill)',padding:'6px 14px',...style}}>
<span style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',color:'var(--text-faint)'}}>TIME</span>
<div style={{display:'flex',gap:2}}>
{ranges.map(r=>{const a=r===range;
return <button key={r} onClick={()=>onChange&&onChange(r)} style={{fontSize:13,fontFamily:'var(--font-sans)',fontWeight:a?600:400,color:a?'var(--text-body)':'var(--text-muted)',background:a?'var(--surface-inset)':'none',border:'none',borderRadius:'var(--radius-pill)',padding:'4px 10px',cursor:'pointer'}}>{r}</button>;})}
</div>
{marks.length>0&&<div style={{display:'flex',alignItems:'center',gap:3}}>
{marks.map((m,i)=><span key={i} title={m.label} style={{width:m.major?7:5,height:m.major?7:5,borderRadius:'50%',background:m.major?'var(--accent)':'var(--line-2)'}}></span>)}
</div>}
<span style={{fontFamily:'var(--font-mono)',fontSize:12,color:'var(--text-muted)'}}>{now}</span>
</div>;
}

```
