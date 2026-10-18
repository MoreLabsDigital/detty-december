import { z } from 'zod';
export const eventSchema=z.object({id:z.string(),slug:z.string(),title:z.string(),description:z.string(),category:z.enum(['Music','Nightlife','Arts','Food','Experiences']),tags:z.array(z.string()),start:z.string().datetime({offset:true}),end:z.string().datetime({offset:true}),timezone:z.string(),venue:z.string(),address:z.string(),neighbourhood:z.string(),city:z.string(),latitude:z.number().optional(),longitude:z.number().optional(),price:z.number().nullable(),currency:z.literal('NGN'),ticketUrl:z.string().url().nullable(),organiser:z.string(),ageRestriction:z.string().optional(),dressCode:z.string().optional(),rules:z.string().optional(),bookingStatus:z.enum(['unknown','available','sold-out','cancelled']),verificationStatus:z.enum(['demo','verified']),featured:z.boolean(),indoor:z.boolean().optional(),createdAt:z.string(),updatedAt:z.string(),art:z.number()});
export type Event=z.infer<typeof eventSchema>;
const seeds:[number,string,Event['category'],string,string,number|null,number,string,boolean][]=[
[1,'The December Kickoff','Nightlife','Victoria Island','Harbour Yard',15000,19,'Opening nights, electric sets, and the first taste of December.',true],
[3,'Palmwine & Paint','Arts','Lekki','Canvas Courtyard',8000,15,'A colourful afternoon of art, good company, and Nigerian sounds.',false],
[5,'Sunset by the Water','Experiences','Ikoyi','Lagoon Deck',null,17,'A golden-hour gathering by the Lagos lagoon.',false],
[7,'Street Food Stories','Food','Yaba','Market Studio',4500,13,'Small bites, big flavours, and stories from Lagos food culture.',false],
[10,'Afrobeat After Dark','Music','Victoria Island','Pulse Warehouse',20000,21,'Heavy drums, late-night rhythm, and an unforgettable dance floor.',true],
[12,'The Colour Market','Arts','Ikeja','Creative House',0,11,'An open-entry showcase of makers, prints, and playful design.',false],
[12,'Rhythm Room','Nightlife','Ikeja','Night Garden',10000,20,'Dance into the night with a rotating lineup of DJs.',false],
[15,'Island Cinema Club','Experiences','Lekki','Moonlight Park',6500,18,'Outdoor cinema, snacks and a little December magic.',false],
[18,'Jollof & Jam','Food','Surulere','Courtyard 18',7500,16,'Friendly food rivalries and feel-good sounds.',true],
[20,'The All-Night Session','Nightlife','Victoria Island','Afterhours Club',18000,22,'A dancefloor-led night for adventurous music lovers.',false],
[24,'Christmas Eve on the Roof','Music','Ikoyi','Rooftop Commons',12000,19,'Easy listening, warm lights, and the city below.',false],
[26,'Boxing Day Block Party','Music','Surulere','Block 26',5000,15,'Street-party energy, community, and all-day music.',true],
[29,'Last Dance Social','Nightlife','Lekki','The Yard',9000,20,'The last weekend of the year calls for one more dance.',false],
[31,'Midnight in Lagos','Music','Victoria Island','Skyline Terrace',25000,21,'A fictional New Year countdown with fireworks-inspired festivities.',true]
];
export const EVENTS:Event[]=seeds.map(([day,title,category,neighbourhood,venue,price,hour,description,featured],i)=>eventSchema.parse({id:`demo-${i+1}`,slug:`${title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${day}`,title,description,category,tags:[category.toLowerCase(),'december','lagos'],start:`2026-12-${String(day).padStart(2,'0')}T${String(hour).padStart(2,'0')}:00:00+01:00`,end:`2026-12-${String(day===31?31:day).padStart(2,'0')}T${String(Math.min(hour+3,23)).padStart(2,'0')}:45:00+01:00`,timezone:'Africa/Lagos',venue,address:`${venue}, ${neighbourhood}, Lagos`,neighbourhood,city:'Lagos',price,currency:'NGN',ticketUrl:null,organiser:'Detty December Demo Studio',bookingStatus:'unknown',verificationStatus:'demo',featured,indoor:i%2===0,createdAt:'2026-10-01T12:00:00+01:00',updatedAt:'2026-10-01T12:00:00+01:00',art:i%5}));
export const dayOf=(event:Event)=>Number(event.start.slice(8,10));
export const eventBySlug=(slug:string)=>EVENTS.find(e=>e.slug===slug);
export const money=(price:number|null)=>price===null?'Price unconfirmed':price===0?'FREE ENTRY':`₦${price.toLocaleString('en-NG')}`;
export const time=(iso:string)=>new Date(iso).toLocaleTimeString('en-NG',{timeZone:'Africa/Lagos',hour:'numeric',minute:'2-digit'});
export type Filters={q:string;category:string;neighbourhood:string;price:string;sort:string};
export const filterEvents=(events:Event[],f:Filters)=>events.filter(e=>{const q=f.q.toLowerCase().trim();return (!q||[e.title,e.description,e.organiser,e.venue,e.neighbourhood,...e.tags].join(' ').toLowerCase().includes(q))&&(!f.category||e.category===f.category)&&(!f.neighbourhood||e.neighbourhood===f.neighbourhood)&&(!f.price||(f.price==='free'?e.price===0:f.price==='paid'?e.price!==null&&e.price>0:e.price!==null&&e.price<=10000));}).sort((a,b)=>f.sort==='price'?(a.price??Infinity)-(b.price??Infinity):f.sort==='recent'?b.createdAt.localeCompare(a.createdAt):a.start.localeCompare(b.start));
