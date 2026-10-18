'use client';
import React,{createContext,useContext,useEffect,useState} from 'react';
import {emptyPlans,readPlans,writePlans,type Plans} from '@/lib/plans';
type Context={plans:Plans;toggle:(kind:keyof Plans,id:string)=>void;ready:boolean};
const PlanContext=createContext<Context>({plans:emptyPlans,toggle:()=>{},ready:false});
export function PlanProvider({children}:{children:React.ReactNode}){const [plans,setPlans]=useState<Plans>(emptyPlans);const[ready,setReady]=useState(false);useEffect(()=>{setPlans(readPlans());setReady(true)},[]);function toggle(kind:keyof Plans,id:string){setPlans(old=>{const list=old[kind];const next={...old,[kind]:list.includes(id)?list.filter(x=>x!==id):[...list,id]};writePlans(next);return next})}return <PlanContext.Provider value={{plans,toggle,ready}}>{children}</PlanContext.Provider>}
export const usePlans=()=>useContext(PlanContext);
