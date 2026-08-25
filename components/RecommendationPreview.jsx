'use client';
import { Check, AlertTriangle, IndianRupee, Gauge, TrendingUp, Home } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
export default function RecommendationPreview() {
  const data=[{value:72},{value:28}];
  return <div className="overflow-hidden rounded-[32px] bg-[#102721] p-5 text-white shadow-2xl md:p-8">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6"><div><p className="eyebrow !text-[#a6cbbd]">SMART RECOMMENDATION PREVIEW</p><h3 className="mt-2 font-serif text-2xl">M3M Antalya Hills</h3><p className="text-sm text-white/55">Sector 79 · Gurugram · 3 BHK</p></div><span className="rounded-full bg-[#d8f7df] px-5 py-2 text-sm font-extrabold tracking-wider text-[#155f4b]">BUY</span></div>
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <div className="relative flex min-h-52 items-center justify-center rounded-3xl bg-white/[.055]"><div className="h-44 w-44"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" innerRadius={61} outerRadius={76} startAngle={90} endAngle={-270} stroke="none"><Cell fill="#79b99f"/><Cell fill="rgba(255,255,255,.08)"/></Pie></PieChart></ResponsiveContainer></div><div className="absolute text-center"><strong className="font-serif text-4xl">72</strong><span className="block text-xs text-white/50">FIT SCORE</span></div></div>
      <div className="grid grid-cols-2 gap-3"><Metric icon={Home} label="Property price" value="₹ 2.42 Cr"/><Metric icon={IndianRupee} label="True cost" value="₹ 2.68 Cr"/><Metric icon={Gauge} label="Estimated EMI" value="₹ 1.54 L/mo"/><Metric icon={TrendingUp} label="Rental ROI" value="3.8%"/><div className="col-span-2 rounded-2xl bg-white/[.06] p-5"><div className="mb-3 flex justify-between text-sm"><span>Monthly affordability</span><b>Comfortable</b></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[68%] rounded-full bg-[#79b99f]"/></div><p className="mt-2 text-xs text-white/45">EMI uses 31% of estimated household income</p></div></div>
    </div>
    <div className="mt-6 grid gap-3 md:grid-cols-2"><Reason icon={Check} text="Strong location demand and rental potential" good/><Reason icon={AlertTriangle} text="Registration costs need a larger cash buffer"/></div>
  </div>;
}
function Metric({icon:Icon,label,value}){return <div className="rounded-2xl bg-white/[.06] p-4"><Icon size={17} className="mb-6 text-[#a6cbbd]"/><span className="block text-xs text-white/45">{label}</span><b className="mt-1 block">{value}</b></div>}
function Reason({icon:Icon,text,good}){return <div className="flex items-center gap-3 rounded-2xl border border-white/10 p-4 text-sm"><span className={`rounded-full p-2 ${good?'bg-green-300/15 text-green-200':'bg-amber-300/15 text-amber-200'}`}><Icon size={16}/></span>{text}</div>}
