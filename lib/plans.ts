import type {Event} from './events';
const KEY='detty-december-v1';
export type Plans={bookmarks:string[];itinerary:string[]};
export const emptyPlans:Plans={bookmarks:[],itinerary:[]};
export function readPlans():Plans{if(typeof window==='undefined')return emptyPlans;try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return {bookmarks:Array.isArray(v?.bookmarks)?v.bookmarks:[],itinerary:Array.isArray(v?.itinerary)?v.itinerary:[]};}catch{return emptyPlans;}}
export function writePlans(p:Plans){if(typeof window!=='undefined')localStorage.setItem(KEY,JSON.stringify(p));}
export function conflicts(a:Event,b:Event){return a.id!==b.id&&new Date(a.start)<new Date(b.end)&&new Date(b.start)<new Date(a.end);}
const escapeICS=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const stamp=(s:string)=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
export function exportIcs(events:Event[]){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Detty December//Demo Planner//EN','CALSCALE:GREGORIAN',...events.flatMap(e=>['BEGIN:VEVENT',`UID:${e.id}@detty-december.local`,`DTSTAMP:${stamp(new Date().toISOString())}`,`DTSTART:${stamp(e.start)}`,`DTEND:${stamp(e.end)}`,`SUMMARY:${escapeICS(e.title)}`,`DESCRIPTION:${escapeICS(e.description)} — DEMONSTRATION EVENT`,`LOCATION:${escapeICS(e.address)}`,'END:VEVENT']),'END:VCALENDAR'];const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='my-detty-december.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
