export const CITIES=['Pune','Mumbai','Bengaluru','Hyderabad','Delhi NCR','Chennai','Ahmedabad'];
export const TYPES=['Apartment','Villa','Independent House','Row House','Plot','Office','Shop'];
export const AMENITIES=['Swimming pool','Gym','Clubhouse','Garden','Lift','Security','Power backup','Parking','Play area','CCTV'];
const U=id=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;
const P=['1545324418-cc1a3fa10c00','1512917774080-9991f1c4c750','1600585154340-be6161a56a0c','1564013799919-ab600027ffc6','1560448204-e02f11c3d0e2','1600596542815-ffad4c1539a9','1486406146926-c627a92ad1ab','1502672260266-1c1ef2d93688','1613490493576-7fde63acd811','1580587771525-78b9dba3b914'].map(U);
export const FALLBACK=P[0];
const mk=(n,title,purpose,type,city,locality,price,area,beds,baths,feat,status='Ready to move')=>({id:'EN-D'+String(n).padStart(3,'0'),title,purpose,type,city,locality,address:locality+', '+city,price,area,beds,baths,balconies:2,furnishing:n%3?'Semi-furnished':'Furnished',status,
amenities:AMENITIES.slice(n%3,n%3+6),images:[P[n%10],P[(n+3)%10],P[(n+6)%10]],featured:feat,source:'demo',date:new Date(2026,9,22-n).toISOString(),
desc:'Sample demo listing for '+title+'. All details are invented for demonstration.',seller:{name:'Demo Agent',phone:'+91 90000 00000',email:'agent@example.com'}});
export const DEMO=[
mk(1,'Skyline Residences 3 BHK','Buy','Apartment','Pune','Baner',12500000,1450,3,3,true,'Under construction'),
mk(2,'Palm Court Villa','Buy','Villa','Bengaluru','Whitefield',45000000,3600,4,5,true),
mk(3,'Lakeview 2 BHK','Rent','Apartment','Mumbai','Powai',55000,950,2,2,false),
mk(4,'Greenfield Row House','Buy','Row House','Hyderabad','Gachibowli',18500000,2100,3,3,true),
mk(5,'Corporate Tower Office','Commercial','Office','Delhi NCR','Gurugram',32000000,2800,0,4,true),
mk(6,'High Street Shop','Commercial','Shop','Chennai','T Nagar',14000000,650,0,1,false),
mk(7,'Sunrise Plot','Buy','Plot','Ahmedabad','SG Highway',6500000,2400,0,0,false),
mk(8,'Heritage Independent House','Buy','Independent House','Pune','Kothrud',21000000,2200,4,4,false),
mk(9,'City Studio 1 BHK','Rent','Apartment','Bengaluru','Indiranagar',32000,600,1,1,false),
mk(10,'Orchid Villa Rental','Rent','Villa','Hyderabad','Jubilee Hills',140000,3000,4,4,true),
mk(11,'Budget 2 BHK','Buy','Apartment','Chennai','Velachery',6800000,880,2,2,false,'Under construction'),
mk(12,'Co-working Office Floor','Commercial','Office','Mumbai','BKC',58000000,4000,0,6,true)];
export const inr=n=>n>=1e7?`₹${(n/1e7).toFixed(2)} Cr`:n>=1e5?`₹${(n/1e5).toFixed(1)} L`:`₹${n.toLocaleString('en-IN')}`;
export const priceLabel=p=>inr(p.price)+(p.purpose==='Rent'?'/mo':'');
export function filterProps(list,f){
 const q=(f.q||'').toLowerCase();
 let r=list.filter(p=>(!f.purpose||p.purpose===f.purpose)&&(!f.city||p.city===f.city)&&(!f.type||p.type===f.type)&&
 (!f.min||p.price>=+f.min)&&(!f.max||p.price<=+f.max)&&(!f.beds||p.beds>=+f.beds)&&(!f.furnishing||p.furnishing===f.furnishing)&&
 (!q||[p.title,p.city,p.locality].join(' ').toLowerCase().includes(q)));
 const s={low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price,area:(a,b)=>b.area-a.area,feat:(a,b)=>b.featured-a.featured,new:(a,b)=>new Date(b.date)-new Date(a.date)}[f.sort||'new'];
 return r.sort(s);}
