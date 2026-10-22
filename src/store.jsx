import {createContext,useContext,useState,useEffect,useCallback,useMemo} from 'react';
import {DEMO} from './data.js';
const C=createContext();export const useStore=()=>useContext(C);
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
export function Store({children}){
 const [user,setUser]=useState(()=>{const v=load('en_user',[]);return Array.isArray(v)?v:[]});
 const [favs,setFavs]=useState(()=>{const v=load('en_favs',[]);return Array.isArray(v)?v:[]});
 const [theme,setTheme]=useState(()=>localStorage.getItem('en_theme')||'light');
 const [toast,setToast]=useState('');
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('en_theme',theme)}catch{}},[theme]);
 useEffect(()=>{save('en_favs',favs)},[favs]);
 useEffect(()=>{if(!save('en_user',user))setToast('Storage full: images may not persist after reload')},[user]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),2500);return()=>clearTimeout(t)},[toast]);
 const all=useMemo(()=>[...user,...DEMO],[user]);
 const notify=useCallback(setToast,[]);
 const toggleFav=id=>{setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);setToast(favs.includes(id)?'Removed from saved':'Saved property')};
 const addProp=p=>setUser(u=>[p,...u]);
 const updateProp=p=>setUser(u=>u.map(x=>x.id===p.id?p:x));
 const deleteProp=id=>{setUser(u=>u.filter(x=>x.id!==id));setFavs(f=>f.filter(x=>x!==id))};
 return <C.Provider value={{all,user,favs,theme,setTheme,toggleFav,addProp,updateProp,deleteProp,notify}}>{children}
 {toast&&<div className="toast" role="status">{toast}</div>}</C.Provider>}
