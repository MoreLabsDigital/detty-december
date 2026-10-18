import type {Metadata} from 'next';import './globals.css';import {PlanProvider} from '@/components/PlanProvider';import {Header,Footer} from '@/components/Header';
export const metadata:Metadata={title:{default:'Detty December — December Is a Whole Adventure',template:'%s | Detty December'},description:'31 days. Endless plans. Find your kind of Detty. An interactive demonstration of December event discovery in Lagos.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><PlanProvider><Header/>{children}<Footer/></PlanProvider></body></html>}
