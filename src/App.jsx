import {Routes,Route,NavLink,Link,useNavigate,useParams,useSearchParams} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {useStore} from './store.jsx';
import {CITIES,TYPES,AMENITIES,FALLBACK,inr,priceLabel,filterProps} from './data.js';

const Img=({src,alt,...r})=><img src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=FALLBACK}} {...r}/>;
function Modal({children,onClose}){
 useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose]);
 return <div className="overlay" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}>{children}</div></div>}

function Navbar(){
 const {theme,setTheme,favs}=useStore();const [open,setOpen]=useState(false);
 const L=[['/','Home'],['/buy','Buy'],['/rent','Rent'],['/commercial','Commercial'],['/add','Sell Property'],['/my-listings','My Listings'],['/saved',`Saved (${favs.length})`]];
 return <header className="nav"><Link to="/" className="logo">🏠 EstateNest</Link>
 <button className="burger" aria-label="Menu" aria-expanded={open} onClick={()=>setOpen(!open)}>☰</button>
 <nav className={open?'links open':'links'} onClick={()=>setOpen(false)}>{L.map(([t,n])=><NavLink key={t} to={t} end={t==='/'}>{n}</NavLink>)}</nav>
 <button className="btn ghost" aria-label="Toggle theme" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?'☀️':'🌙'}</button></header>}

function Card({p}){
 const {favs,toggleFav}=useStore();const on=favs.includes(p.id);
 return <article className="card"><div className="imgwrap"><Img src={p.images[0]} alt={p.title}/>
 <button className={'heart'+(on?' on':'')} aria-pressed={on} aria-label="Save property" onClick={()=>toggleFav(p.id)}>{on?'♥':'♡'}</button>
 <span className="badge">{p.source==='user'?'User Added · Demo':p.featured?'Featured':p.purpose}</span></div>
 <div className="cbody"><h3>{p.title}</h3><p className="muted">{p.locality}, {p.city}</p><p className="price">{priceLabel(p)}</p>
 <p className="muted">{p.type} · {p.beds?p.beds+' bed · ':''}{p.baths} bath · {p.area} sq ft</p><p className="tag">{p.status}</p>
 <Link className="btn" to={`/property/${p.id}`}>View Details</Link></div></article>}

function Home(){
 const nav=useNavigate();const {all}=useStore();const [f,setF]=useState({purpose:'Buy'});
 const go=e=>{e.preventDefault();const q=new URLSearchParams(Object.entries(f).filter(([k,v])=>v&&k!=='purpose'));nav(`/${f.purpose.toLowerCase()}?${q}`)};
 const set=k=>e=>setF({...f,[k]:e.target.value});
 return <>
 <section className="hero"><div className="heroimg"/><div className="herotxt"><h1>Find a Place You'll Love to Call Home</h1>
 <p>Explore premium homes, discover new communities, and find the right property for your lifestyle.</p>
 <div className="row"><Link className="btn" to="/buy">Explore Properties</Link><Link className="btn alt" to="/add">List Your Property</Link></div>
 <p className="small">{all.length} demo listings · all content is sample data</p>
 <form className="search" onSubmit={go}>
 <div className="seg">{['Buy','Rent','Commercial'].map(x=><button type="button" key={x} className={f.purpose===x?'on':''} onClick={()=>setF({...f,purpose:x})}>{x}</button>)}</div>
 <input list="cl" placeholder="City or locality" aria-label="City or locality" value={f.q||''} onChange={set('q')}/><datalist id="cl">{CITIES.map(c=><option key={c}>{c}</option>)}</datalist>
 <select aria-label="Property type" value={f.type||''} onChange={set('type')}><option value="">Any type</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
 <input type="number" placeholder="Min ₹" aria-label="Minimum price" value={f.min||''} onChange={set('min')}/>
 <input type="number" placeholder="Max ₹" aria-label="Maximum price" value={f.max||''} onChange={set('max')}/>
 <select aria-label="Bedrooms" value={f.beds||''} onChange={set('beds')}><option value="">Any BHK</option>{[1,2,3,4].map(n=><option key={n} value={n}>{n}+ BHK</option>)}</select>
 <button className="btn">Search</button><button type="button" className="btn ghost" onClick={()=>setF({purpose:'Buy'})}>Reset</button></form></div></section>
 <section className="sec"><h2>Featured Properties</h2><div className="grid">{all.filter(p=>p.featured).slice(0,6).map(p=><Card key={p.id} p={p}/>)}</div></section>
 <section className="sec"><h2>Explore by Category</h2><div className="chips">{TYPES.map(t=><Link key={t} className="chip" to={`/buy?type=${t}`}>{t}</Link>)}</div></section>
 <section className="sec"><h2>Explore by City</h2><div className="chips">{CITIES.map(c=><Link key={c} className="chip" to={`/buy?city=${c}`}>{c}</Link>)}</div></section></>}

function Listings({purpose}){
 const {all}=useStore();const [sp,setSp]=useSearchParams();const [n,setN]=useState(6);
 const f={...Object.fromEntries(sp),purpose};
 const set=(k,v)=>{const q=new URLSearchParams(sp);v?q.set(k,v):q.delete(k);setSp(q);setN(6)};
 const res=filterProps(all,f);
 return <div className="sec layout"><aside className="filters"><h3>Filters</h3>
 <input placeholder="Search name / locality" aria-label="Search" value={f.q||''} onChange={e=>set('q',e.target.value)}/>
 <select aria-label="City" value={f.city||''} onChange={e=>set('city',e.target.value)}><option value="">All cities</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select>
 <select aria-label="Type" value={f.type||''} onChange={e=>set('type',e.target.value)}><option value="">All types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
 <input type="number" placeholder="Min price ₹" aria-label="Min price" value={f.min||''} onChange={e=>set('min',e.target.value)}/>
 <input type="number" placeholder="Max price ₹" aria-label="Max price" value={f.max||''} onChange={e=>set('max',e.target.value)}/>
 <select aria-label="Bedrooms" value={f.beds||''} onChange={e=>set('beds',e.target.value)}><option value="">Any BHK</option>{[1,2,3,4].map(x=><option key={x} value={x}>{x}+</option>)}</select>
 <select aria-label="Furnishing" value={f.furnishing||''} onChange={e=>set('furnishing',e.target.value)}><option value="">Any furnishing</option>{['Furnished','Semi-furnished','Unfurnished'].map(x=><option key={x}>{x}</option>)}</select>
 <button className="btn ghost" onClick={()=>setSp({})}>Reset all</button></aside>
 <div><div className="between"><h1>{purpose} Properties</h1><select aria-label="Sort" value={f.sort||'new'} onChange={e=>set('sort',e.target.value)}>
 <option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="area">Largest area</option><option value="feat">Featured first</option></select></div>
 <p className="muted">{res.length} matching properties</p>
 {res.length?<><div className="grid">{res.slice(0,n).map(p=><Card key={p.id} p={p}/>)}</div>
 {n<res.length&&<button className="btn" onClick={()=>setN(n+6)}>Load more</button>}</>:<div className="empty">No properties match. <button className="btn ghost" onClick={()=>setSp({})}>Clear filters</button></div>}</div></div>}

function Visit({p,onClose}){
 const [v,setV]=useState({name:'',phone:'',email:'',date:'',time:'',msg:''});const [e,setE]=useState({});const [done,setDone]=useState(false);
 const submit=ev=>{ev.preventDefault();const x={};
 if(!v.name.trim())x.name='Name is required';if(!/^[6-9]\d{9}$/.test(v.phone))x.phone='Enter a valid 10-digit Indian mobile';
 if(!/^\S+@\S+\.\S+$/.test(v.email))x.email='Enter a valid email';if(!v.date)x.date='Choose a date';if(!v.time)x.time='Choose a time';
 setE(x);if(!Object.keys(x).length)setDone(true)};
 const F=(k,l,t='text')=><label>{l}<input type={t} value={v[k]} aria-invalid={!!e[k]} onChange={ev=>setV({...v,[k]:ev.target.value})}/>{e[k]&&<span className="err" role="alert">{e[k]}</span>}</label>;
 return <Modal onClose={onClose}>{done?<><h2>✅ Request recorded (demo)</h2><p>No data was sent anywhere and no agent was notified.</p><button className="btn" onClick={onClose}>Close</button></>:
 <form onSubmit={submit} noValidate><h2>Schedule a site visit</h2><p className="muted">{p.title}</p>{F('name','Full name')}{F('phone','Mobile number','tel')}{F('email','Email','email')}{F('date','Preferred date','date')}{F('time','Preferred time','time')}
 <label>Message<textarea value={v.msg} onChange={ev=>setV({...v,msg:ev.target.value})}/></label><div className="row"><button className="btn">Submit</button><button type="button" className="btn ghost" onClick={onClose}>Cancel</button></div></form>}</Modal>}

function Details(){
 const {id}=useParams();const {all}=useStore();const p=all.find(x=>x.id===id);const [i,setI]=useState(0);const [lb,setLb]=useState(false);const [visit,setVisit]=useState(false);
 if(!p)return <NotFound/>;const im=p.images,go=d=>setI((i+d+im.length)%im.length);
 const rel=all.filter(x=>x.id!==p.id&&(x.city===p.city||x.purpose===p.purpose)).slice(0,3);
 return <div className="sec"><div className="gallery"><Img src={im[i]} alt={`${p.title} photo ${i+1}`} onClick={()=>setLb(true)}/>
 <button className="nx l" aria-label="Previous image" onClick={()=>go(-1)}>‹</button><button className="nx r" aria-label="Next image" onClick={()=>go(1)}>›</button></div>
 <div className="thumbs">{im.map((s,k)=><Img key={k} src={s} alt={`Thumbnail ${k+1}`} className={k===i?'on':''} onClick={()=>setI(k)}/>)}</div>
 <div className="layout2"><div><h1>{p.title}</h1><p className="muted">{p.address}</p><p className="price big">{priceLabel(p)}{p.purpose==='Buy'&&p.area?<small> · {inr(Math.round(p.price/p.area))}/sq ft</small>:null}</p>
 <p>{p.type} · {p.beds||'–'} bed · {p.baths} bath · {p.balconies??0} balconies · {p.area} sq ft · {p.furnishing} · {p.status}</p>
 <p className="muted">Listing ID {p.id} · {new Date(p.date).toLocaleDateString()} {p.source==='user'&&'· User Added (Demo Listing)'}</p>
 <h3>About</h3><p>{p.desc}</p><h3>Amenities</h3><div className="chips">{p.amenities.map(a=><span className="chip" key={a}>{a}</span>)}</div>
 <h3>Location</h3><a className="btn ghost" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/${encodeURIComponent(p.address)}`}>Open in Maps</a></div>
 <aside className="contact"><h3>{p.seller?.name}</h3><a className="btn" href={`tel:${p.seller?.phone||''}`}>Call Agent</a>
 <a className="btn alt" target="_blank" rel="noreferrer" href={`https://wa.me/${(p.seller?.phone||'').replace(/\D/g,'')}`}>WhatsApp Agent</a>
 <button className="btn ghost" onClick={()=>setVisit(true)}>Schedule a Site Visit</button><p className="small">Demo contact details; nothing is sent.</p></aside></div>
 <h2>Related properties</h2><div className="grid">{rel.map(r=><Card key={r.id} p={r}/>)}</div>
 {lb&&<Modal onClose={()=>setLb(false)}><Img src={im[i]} alt={p.title} className="lbimg"/><div className="row"><button className="btn ghost" onClick={()=>go(-1)}>‹ Prev</button><button className="btn ghost" onClick={()=>go(1)}>Next ›</button><button className="btn" onClick={()=>setLb(false)}>Close</button></div></Modal>}
 {visit&&<Visit p={p} onClose={()=>setVisit(false)}/>}</div>}

const blank={purpose:'Buy',title:'',type:'Apartment',city:CITIES[0],locality:'',address:'',desc:'',beds:2,baths:2,balconies:1,area:'',furnishing:'Semi-furnished',status:'Ready to move',price:'',amenities:[],images:[],name:'',phone:'',email:''};
function AddProperty(){
 const {id}=useParams();const {user,addProp,updateProp,notify}=useStore();const nav=useNavigate();
 const ex=id&&user.find(x=>x.id===id);
 const [v,setV]=useState(ex?{...ex,name:ex.seller.name,phone:ex.seller.phone,email:ex.seller.email}:blank);const [e,setE]=useState({});const [ok,setOk]=useState(null);const [busy,setBusy]=useState(false);
 const S=k=>ev=>setV({...v,[k]:ev.target.value});
 const files=fl=>[...fl].slice(0,4-v.images.length).forEach(f=>{
  if(!/^image\/(jpe?g|png|webp)$/.test(f.type))return notify('Only JPG, PNG or WebP allowed');
  if(f.size>1.5e6)return notify('Image over 1.5 MB skipped');
  const r=new FileReader();r.onload=()=>setV(c=>({...c,images:[...c.images,r.result]}));r.readAsDataURL(f)});
 const submit=ev=>{ev.preventDefault();if(busy)return;const x={};
  ['title','locality','address','desc'].forEach(k=>!String(v[k]).trim()&&(x[k]='Required'));
  if(!(+v.area>0))x.area='Enter a valid area';if(!(+v.price>0))x.price='Enter a valid price';
  if(!v.name.trim())x.name='Required';if(!/^[6-9]\d{9}$/.test(v.phone))x.phone='Enter a valid 10-digit Indian mobile';
  if(!/^\S+@\S+\.\S+$/.test(v.email))x.email='Enter a valid email';if(!v.images.length)x.images='Add at least one image';
  setE(x);if(Object.keys(x).length)return;setBusy(true);
  const p={...v,id:ex?ex.id:'EN-U'+Date.now().toString(36).toUpperCase(),price:+v.price,area:+v.area,beds:+v.beds,baths:+v.baths,balconies:+v.balconies,featured:false,source:'user',date:ex?ex.date:new Date().toISOString(),seller:{name:v.name,phone:v.phone,email:v.email}};
  delete p.name;delete p.phone;delete p.email;ex?updateProp(p):addProp(p);setOk(p);setBusy(false)};
 const F=(k,l,t='text')=><label>{l}<input type={t} value={v[k]} aria-invalid={!!e[k]} onChange={S(k)}/>{e[k]&&<span className="err" role="alert">{e[k]}</span>}</label>;
 const Sel=(k,l,o)=><label>{l}<select value={v[k]} onChange={S(k)}>{o.map(x=><option key={x}>{x}</option>)}</select></label>;
 return <form className="sec form" onSubmit={submit} noValidate><h1>{ex?'Edit Property':'List Your Property'}</h1><p className="muted">Demo only: stored in this browser, not published anywhere.</p>
 <fieldset><legend>Basics</legend>{Sel('purpose','Purpose',['Buy','Rent','Commercial'])}{F('title','Title')}{Sel('type','Type',TYPES)}{Sel('city','City',CITIES)}{F('locality','Locality')}{F('address','Address')}
 <label>Description<textarea value={v.desc} onChange={S('desc')}/>{e.desc&&<span className="err">{e.desc}</span>}</label></fieldset>
 <fieldset><legend>Specs & pricing</legend>{F('beds','Bedrooms','number')}{F('baths','Bathrooms','number')}{F('area','Area (sq ft)','number')}{Sel('furnishing','Furnishing',['Furnished','Semi-furnished','Unfurnished'])}{Sel('status','Status',['Ready to move','Under construction'])}{F('price',v.purpose==='Rent'?'Monthly rent (₹)':'Asking price (₹)','number')}</fieldset>
 <fieldset><legend>Amenities</legend><div className="chips">{AMENITIES.map(a=><label key={a} className="chip"><input type="checkbox" checked={v.amenities.includes(a)} onChange={()=>setV({...v,amenities:v.amenities.includes(a)?v.amenities.filter(x=>x!==a):[...v.amenities,a]})}/> {a}</label>)}</div></fieldset>
 <fieldset><legend>Images (max 4, JPG/PNG/WebP, 1.5 MB each)</legend><div className="drop" onDragOver={ev=>ev.preventDefault()} onDrop={ev=>{ev.preventDefault();files(ev.dataTransfer.files)}}>Drag & drop or <input type="file" accept="image/*" multiple onChange={ev=>files(ev.target.files)}/></div>
 {e.images&&<span className="err">{e.images}</span>}<div className="thumbs">{v.images.map((s,k)=><div key={k}><Img src={s} alt={`Preview ${k+1}`} className={k===0?'on':''}/><button type="button" className="btn ghost" onClick={()=>setV({...v,images:[s,...v.images.filter((_,j)=>j!==k)]})}>Cover</button><button type="button" className="btn ghost" onClick={()=>setV({...v,images:v.images.filter((_,j)=>j!==k)})}>Remove</button></div>)}</div></fieldset>
 <fieldset><legend>Contact</legend>{F('name','Seller name')}{F('phone','Mobile','tel')}{F('email','Email','email')}</fieldset>
 <button className="btn" disabled={busy}>{ex?'Save changes':'Submit Property'}</button>
 {ok&&<Modal onClose={()=>nav('/my-listings')}><h2>✅ Your property has been {ex?'updated':'added'} successfully!</h2><p>{ok.title} · ID {ok.id}</p><p className="small">Demo listing, not verified or published to a real marketplace.</p>
 <div className="row"><button className="btn" onClick={()=>nav('/property/'+ok.id)}>View Property</button><button className="btn ghost" onClick={()=>nav('/'+(ok.purpose==='Rent'?'rent':ok.purpose==='Buy'?'buy':'commercial'))}>Back to Listings</button></div></Modal>}</form>}

function MyListings(){
 const {user,deleteProp,notify}=useStore();const [d,setD]=useState(null);
 return <div className="sec"><h1>My Listings</h1><p className="muted">Local demo management for this browser only, not a secure account.</p>
 {user.length?user.map(p=><div className="lrow" key={p.id}><Img src={p.images[0]} alt={p.title}/><div><h3>{p.title}</h3><p className="muted">{p.locality}, {p.city} · {p.purpose} · {p.id}</p><p className="price">{priceLabel(p)}</p><span className="tag">User Added · Demo</span></div>
 <div className="row"><Link className="btn ghost" to={'/property/'+p.id}>View</Link><Link className="btn ghost" to={'/add/'+p.id}>Edit</Link><button className="btn ghost" onClick={()=>setD(p)}>Delete</button></div></div>)
 :<div className="empty">You haven't added any listings. <Link className="btn" to="/add">Add Property</Link></div>}
 {d&&<Modal onClose={()=>setD(null)}><h2>Delete “{d.title}”?</h2><div className="row"><button className="btn" onClick={()=>{deleteProp(d.id);setD(null);notify('Listing deleted')}}>Delete</button><button className="btn ghost" onClick={()=>setD(null)}>Cancel</button></div></Modal>}</div>}

function Saved(){
 const {all,favs}=useStore();const l=all.filter(p=>favs.includes(p.id));
 return <div className="sec"><h1>Saved Properties</h1>{l.length?<div className="grid">{l.map(p=><Card key={p.id} p={p}/>)}</div>:<div className="empty">Nothing saved yet. <Link className="btn" to="/buy">Browse Properties</Link></div>}</div>}
const NotFound=()=><div className="sec"><h1>Page not found</h1><Link className="btn" to="/">Go home</Link></div>;

const CONTACT={phone:'+91 98765 43210',email:'hello@estatenest.example',address:'Sample Office, Baner Road, Pune, Maharashtra 411045'};
function Footer(){
 const tel=CONTACT.phone.replace(/[^\d+]/g,'');
 return <footer className="foot"><div className="footgrid">
 <div><div className="logo">🏠 EstateNest</div><p>Discover premium homes, rentals and commercial spaces across India.</p>
 <a className="callbtn" href={`tel:${tel}`}>📞 {CONTACT.phone}</a></div>
 <div><h4>Explore</h4><Link to="/buy">Buy</Link><Link to="/rent">Rent</Link><Link to="/commercial">Commercial</Link><Link to="/add">Sell Property</Link></div>
 <div><h4>Popular cities</h4>{CITIES.slice(0,5).map(c=><Link key={c} to={`/buy?city=${c}`}>{c}</Link>)}</div>
 <div><h4>Contact us</h4><a href={`tel:${tel}`}>📞 {CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`}>✉️ {CONTACT.email}</a><span>📍 {CONTACT.address}</span><span>🕘 Mon–Sat, 9am–7pm</span></div></div>
 <p className="copy">© 2026 EstateNest · Demo website. Contact details are sample information; all listings are sample data. No backend or real verification.</p></footer>}
export default function App(){
 useEffect(()=>{scrollTo(0,0)});
 return <><Navbar/><main><Routes><Route path="/" element={<Home/>}/><Route path="/buy" element={<Listings purpose="Buy"/>}/><Route path="/rent" element={<Listings purpose="Rent"/>}/><Route path="/commercial" element={<Listings purpose="Commercial"/>}/>
 <Route path="/property/:id" element={<Details/>}/><Route path="/add" element={<AddProperty/>}/><Route path="/add/:id" element={<AddProperty key="edit"/>}/><Route path="/my-listings" element={<MyListings/>}/><Route path="/saved" element={<Saved/>}/><Route path="*" element={<NotFound/>}/></Routes></main>
 <Footer/></>}
