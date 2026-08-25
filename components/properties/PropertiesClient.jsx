'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getProperties } from '@/services/properties';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertiesHeader from './PropertiesHeader';
import PropertyFilters from './PropertyFilters';
import PropertyGrid from './PropertyGrid';
import PropertyGridSkeleton from './PropertyGridSkeleton';
import PropertyEmptyState from './PropertyEmptyState';

const defaults={purpose:'Buy',query:'',city:'',type:'',bhk:'',budget:'',minArea:'',risk:'',minRoi:'',status:'',sort:'recommended'};
export default function PropertiesClient(){
 const router=useRouter(), pathname=usePathname(), searchParams=useSearchParams();
 const initial=useMemo(()=>normalizeFilters(searchParams),[searchParams]);
 const [filters,setFilters]=useState(initial),[advancedOpen,setAdvancedOpen]=useState(searchParams.get('filters')==='advanced'),[shown,setShown]=useState(6);
 useEffect(()=>{setFilters(initial);setShown(6)},[initial]);
 useEffect(()=>{const next=new URLSearchParams();Object.entries(filters).forEach(([key,value])=>{if(value&&value!==defaults[key])next.set(key,value)});router.replace(`${pathname}${next.size?`?${next}`:''}`,{scroll:false})},[filters,pathname,router]);
 const {data,isLoading,isError,refetch}=useQuery({queryKey:['properties',filters],queryFn:()=>getProperties(filters)});
 const update=(next)=>{setFilters(next);setShown(6)}; const clear=()=>{setFilters(defaults);setShown(6)}; const visible=data?.properties.slice(0,shown)||[];
 return <><Navbar/><main><PropertiesHeader/><section className="bg-cream px-5 py-8 md:py-10 lg:px-10"><div className="mx-auto max-w-[1360px]"><PropertyFilters filters={filters} onChange={update} onClear={clear} advancedOpen={advancedOpen} setAdvancedOpen={setAdvancedOpen}/><div className="mt-8 flex flex-col gap-4 border-y border-ink/10 py-5 sm:flex-row sm:items-center sm:justify-between"><p className="font-serif text-2xl">{isLoading?'Finding properties…':`${data?.total||0} ${data?.total===1?'Property':'Properties'} Found`}</p><label className="flex items-center gap-2 text-sm text-ink/60"><span>Sort by</span><span className="relative"><select aria-label="Sort properties" className="appearance-none border-0 bg-transparent py-1 pr-6 font-bold text-ink outline-none" value={filters.sort} onChange={(e)=>update({...filters,sort:e.target.value})}><option value="recommended">Recommended</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="roi">Rental Yield</option><option value="risk">Lowest Risk</option></select><ChevronDown className="pointer-events-none absolute right-0 top-1" size={16}/></span></label></div>{isLoading?<div className="mt-7"><PropertyGridSkeleton/></div>:isError?<ErrorState onRetry={refetch}/>:visible.length?<><div className="mt-7"><PropertyGrid properties={visible}/></div>{shown<(data?.total||0)&&<div className="mt-10 text-center"><button className="btn-outline" onClick={()=>setShown(shown+6)}>Load more properties</button></div>}<p className="mt-5 text-xs text-ink/40">Listings are demo data for product preview. Availability, price and analysis values are illustrative.</p></>:<div className="mt-7"><PropertyEmptyState onClear={clear}/></div>}</div></section><section className="bg-[#15352c] px-5 py-16 text-white md:py-20 lg:px-10"><div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="eyebrow !text-[#a6cbbd]">SMART DECISION MAKING</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-[.98] md:text-6xl">Found Something You Like? Analyze It Before You Decide.</h2><p className="mt-5 max-w-xl leading-7 text-white/60">Understand affordability, true cost, EMI, risk and rental potential before you move forward.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link className="btn-light" href="/calculators/affordability">Check affordability</Link><Link className="btn-outline !border-white/30 !text-white" href="/tools/risk-analysis">Explore smart analysis <ArrowUpRight size={16}/></Link></div></div></section></main><Footer/></>;
}
function ErrorState({onRetry}){return <div className="mt-7 rounded-[28px] border border-dashed border-ink/20 bg-white p-12 text-center"><SlidersHorizontal className="mx-auto text-green"/><h2 className="mt-4 font-serif text-3xl">We couldn’t load properties right now.</h2><button className="btn-dark mt-6" onClick={onRetry}>Try again</button></div>}
function normalizeFilters(params){const filters=Object.fromEntries(Object.keys(defaults).map((key)=>[key,params.get(key)||defaults[key]]));const homeMode=params.get('mode');if(homeMode==='Buy'||homeMode==='Rent')filters.purpose=homeMode;if(['Any type','Any budget','Any BHK'].includes(filters.type))filters.type='';if(['Any budget','Any Budget'].includes(filters.budget))filters.budget='';if(['Any BHK'].includes(filters.bhk))filters.bhk='';return filters}
