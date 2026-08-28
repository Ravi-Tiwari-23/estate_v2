'use client';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const nav = [['Home','/'],['Properties','/properties'],['Calculators','/calculators'],['Insights','/insights'],['Schemes','/schemes'],['Tools','/tools'],['About','/about']];
const calculators=[['EMI Calculator','/calculators/emi'],['True Cost Calculator','/calculators/true-cost'],['Affordability Calculator','/calculators/affordability'],['Rental ROI Calculator','/calculators/rental-roi'],['Risk Analysis','/calculators/risk-analysis'],['Buy vs Rent Calculator','/calculators/buy-vs-rent'],['Smart Property Analyzer','/calculators/smart-property-analyzer'],['Smart Recommendation','/smart-recommendation']];

export default function Navbar() {
  const [open, setOpen] = useState(false),[calculatorOpen,setCalculatorOpen]=useState(false);
  const pathname = usePathname();
  const active = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  return <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/90 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-8 px-5 lg:px-10">
      <Link href="/" className="mr-auto leading-none"><span className="font-serif text-[25px] font-semibold tracking-tight">YOUR HOME</span><span className="mt-1 block text-[9px] font-semibold uppercase tracking-[.28em] text-green">Plan · Analyze · Invest</span></Link>
      <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">{nav.map(([label,href])=>label==='Calculators'?<div className="relative" key={href}><button onClick={()=>setCalculatorOpen(value=>!value)} aria-expanded={calculatorOpen} className={active(href)?'flex items-center gap-1 text-green':'flex items-center gap-1 text-ink/65 hover:text-ink'}>Calculators <ChevronDown size={14}/></button>{calculatorOpen&&<div className="absolute left-0 top-8 w-64 rounded-xl border border-ink/10 bg-white p-2 shadow-xl"><p className="px-3 py-2 text-[9px] font-bold tracking-widest text-ink/45">CALCULATORS</p>{calculators.map(([name,path])=><Link onClick={()=>setCalculatorOpen(false)} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${pathname===path?'bg-[#eef4ed] font-bold text-green':path.includes('smart-property')?'bg-[#eef4ed] text-green hover:bg-[#e4eee3]':'hover:bg-ink/5'}`} href={path} key={path}>{name}{path.includes('smart-property')?<small className="rounded-full bg-green px-1.5 py-0.5 text-[7px] text-white">NEW</small>:pathname===path&&<Check size={14}/>}</Link>)}</div>}</div>:<Link className={active(href)?'text-green':'text-ink/65 hover:text-ink'} href={href} key={href}>{label}</Link>)}</nav>
      <div className="hidden items-center gap-3 lg:flex"><Link href="/signin" className="px-2 text-sm font-semibold">Sign in</Link><Link href="/sell" className="btn-dark">List your property <ArrowUpRight size={15}/></Link></div>
      <button aria-label={open?'Close menu':'Open menu'} aria-expanded={open} className="rounded-full border border-ink/15 p-2.5 lg:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
    {open && <nav className="border-t border-black/5 bg-cream px-5 py-5 lg:hidden">{nav.map(([label,href])=>label==='Calculators'?<details key={href} className="border-b border-black/5 py-3"><summary className="cursor-pointer font-medium">Calculators</summary><div className="mt-2 pl-3">{calculators.map(([name,path])=><Link onClick={()=>setOpen(false)} className={`flex items-center justify-between py-2 text-sm ${pathname===path?'font-bold text-green':''}`} href={path} key={path}>{name}{pathname===path&&<Check size={14}/>}</Link>)}</div></details>:<Link onClick={()=>setOpen(false)} className="block border-b border-black/5 py-3 font-medium" href={href} key={href}>{label}</Link>)}<div className="mt-5 grid grid-cols-2 gap-3"><Link className="btn-outline" href="/signin">Sign in</Link><Link className="btn-dark" href="/sell">List property</Link></div></nav>}
  </header>;
}
