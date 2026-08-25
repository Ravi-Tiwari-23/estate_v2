'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight, Calculator, CalendarDays, ChartNoAxesCombined, CircleDollarSign, CircleHelp, House, Landmark, Lightbulb, ShieldCheck, WalletCards } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { calculateEmi } from '@/lib/calculators';
import { money, percent } from '@/utils/currency';

const schema = z.object({
  propertyPrice: z.coerce.number().positive('Property price must be greater than zero.'),
  downPayment: z.coerce.number().min(0, 'Down payment must be zero or greater.'),
  interestRate: z.coerce.number().positive('Interest rate must be greater than zero.'),
  tenureYears: z.coerce.number().positive('Loan tenure must be greater than zero.')
}).refine((data) => data.downPayment <= data.propertyPrice, { message: 'Down payment cannot exceed property price.', path: ['downPayment'] });

const defaults = { propertyPrice: 10000000, downPayment: 2000000, interestRate: 8.5, tenureYears: 20 };
const tenureOptions = [5, 10, 15, 20, 25, 30];

export default function EmiPage() {
  const { register, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: defaults, mode: 'onChange' });
  const values = watch();
  const price = Number(values.propertyPrice) || 0;
  const downPayment = Math.max(0, Number(values.downPayment) || 0);
  const loanAmount = Math.max(0, price - downPayment);
  const interestRate = Number(values.interestRate) || 0;
  const tenureYears = Number(values.tenureYears) || 0;
  const loan = useMemo(() => calculateEmi({ loanAmount, interestRate, tenureYears }), [loanAmount, interestRate, tenureYears]);
  const downPaymentPercent = price ? (downPayment / price) * 100 : 0;
  const breakdown = [
    { name: 'Principal Amount', value: loan.principal, color: '#155f4b' },
    { name: 'Total Interest', value: loan.totalInterest, color: '#f0ad26' }
  ];
  const setField = (name, value) => setValue(name, Number(value), { shouldValidate: true, shouldDirty: true });

  return <><Navbar/><main className="min-h-screen bg-[#fbfaf6] text-ink">
    <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-4 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] font-medium text-ink/45"><Link href="/">Home</Link><span>›</span><Link href="/calculators">Calculators</Link><span>›</span><span className="text-ink/70">EMI Calculator</span></nav>
      <header className="mt-3 grid items-start gap-5 lg:grid-cols-[1fr_360px]"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#c48818]">HOME LOAN CALCULATOR</p><h1 className="mt-2 max-w-xl font-serif text-[34px] leading-[.9] tracking-[-.04em] md:text-[42px]">Plan Your Home Loan<br/>With Confidence.</h1><p className="mt-3 max-w-md text-[12px] leading-5 text-ink/60">Estimate your monthly EMI, total interest and overall loan repayment before making a property decision.</p></div><div className="mt-1 flex items-center gap-3 rounded-lg border border-[#dfe7dd] bg-[#f0f5ed] px-4 py-3 text-[10px] leading-4 text-ink/70"><Lightbulb className="shrink-0 text-green" size={22}/><span>Adjust the values to see how your EMI and total interest change in real time.</span></div></header>

      <section className="mt-5 grid gap-5 lg:grid-cols-[.42fr_.58fr]">
        <form className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm md:p-5"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-md bg-[#eef4ed] text-green"><Calculator size={18}/></span><h2 className="font-serif text-lg">Loan Details</h2></div><div className="mt-5 space-y-5">
          <RangeField label="Property Price" min={1000000} max={50000000} step={100000} value={price} onChange={(value)=>setField('propertyPrice',value)} display={money(price)} error={errors.propertyPrice?.message}/>
          <RangeField label="Down Payment" min={0} max={Math.max(price, 1)} step={100000} value={downPayment} onChange={(value)=>setField('downPayment',value)} display={money(downPayment)} error={errors.downPayment?.message}/>
          <div className="rounded-lg bg-[#eff6ee] px-3 py-2.5"><div className="flex items-center justify-between gap-3 text-[11px]"><span className="flex items-center gap-2 font-bold text-green"><House size={15}/> Estimated Loan Amount</span><b>{money(loanAmount)}</b></div></div>
          <RangeField label="Interest Rate (% p.a.)" min={5} max={15} step={0.1} value={interestRate} onChange={(value)=>setField('interestRate',value)} display={`${interestRate.toFixed(2)} %`} error={errors.interestRate?.message}/>
          <div><p className="text-[11px] font-bold">Loan Tenure</p><div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">{tenureOptions.map(year=><button key={year} type="button" onClick={()=>setField('tenureYears',year)} className={`h-8 rounded-md border text-[10px] font-bold transition ${tenureYears===year?'border-[#0f5c48] bg-[#0f5c48] text-white':'border-ink/10 bg-white text-ink/60 hover:border-green'}`}>{year} Yrs</button>)}</div></div>
          <div className="flex gap-2 rounded-lg border border-[#dfe7dd] bg-[#fafcf9] p-3 text-[10px] leading-4 text-ink/60"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-green"><i className="h-2 w-2 rounded-full bg-green"/></span><span><b className="block text-ink">Your down payment covers {percent(downPaymentPercent)} of the property price.</b>Increasing your down payment can significantly reduce your EMI and total interest.</span></div>
        </div></form>

        <section aria-live="polite" className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm md:p-5"><p className="text-[10px] font-bold text-ink/70">Estimated Monthly EMI <CircleHelp className="ml-1 inline text-ink/35" size={12}/></p><h2 className="mt-2 font-serif text-4xl leading-none text-[#173c33] md:text-[44px]">{money(loan.emi)}</h2><p className="mt-1 text-[12px] font-bold">per month</p><p className="mt-2 max-w-[260px] text-[10px] leading-4 text-ink/55">Based on your loan details, this is your estimated monthly payment.</p>{loanAmount===0&&<p className="mt-3 rounded-md bg-[#eff6ee] p-2 text-[10px] font-bold text-green">No loan is required for the entered property price and down payment.</p>}
          <div className="mt-4 grid gap-2 sm:grid-cols-3"><Metric icon={WalletCards} label="Loan Amount" value={money(loan.principal)}/><Metric icon={ChartNoAxesCombined} label="Total Interest" value={money(loan.totalInterest)}/><Metric icon={CircleDollarSign} label="Total Repayment" value={money(loan.totalPayment)}/></div>
          <div className="mt-4 rounded-xl border border-ink/10 p-4"><h3 className="text-[11px] font-bold">Loan Breakdown <CircleHelp className="ml-1 inline text-ink/35" size={12}/></h3><div className="grid items-center gap-4 sm:grid-cols-[.78fr_1.22fr]"><div className="relative mx-auto h-48 w-full max-w-[220px]"><ResponsiveContainer><PieChart><Pie data={breakdown} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="88%" paddingAngle={2} stroke="none">{breakdown.map(item=><Cell key={item.name} fill={item.color}/>)}</Pie><Tooltip formatter={(value)=>money(value)} contentStyle={{borderRadius:8,border:'1px solid #e4e7e0',fontSize:11}}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><span className="text-[10px] text-ink/50">Total Payment</span><b className="-mt-8 font-serif text-xl">{money(loan.totalPayment)}</b></div></div><div className="space-y-3"><BreakdownRow color="bg-green" label="Principal Amount" value={loan.principal} total={loan.totalPayment}/><BreakdownRow color="bg-[#f0ad26]" label="Total Interest" value={loan.totalInterest} total={loan.totalPayment}/><div className="mt-5 flex gap-2 rounded-md bg-[#f0f5ed] p-3 text-[10px] leading-4 text-ink/65"><ShieldCheck className="shrink-0 text-green" size={17}/>The chart shows how your total payment is divided between principal and interest.</div></div></div></div>
        </section>
      </section>

      <section className="mt-5 rounded-xl border border-ink/10 bg-white p-4 shadow-sm md:p-5"><h2 className="font-serif text-lg">Your Loan at a Glance</h2><dl className="mt-4 grid grid-cols-2 gap-y-4 border-y border-ink/10 py-4 sm:grid-cols-4 lg:grid-cols-8">{[[House,'Property Price',money(price)],[WalletCards,'Down Payment',money(downPayment)],[Landmark,'Loan Amount',money(loan.principal)],[CircleDollarSign,'Interest Rate',percent(interestRate)],[CalendarDays,'Loan Tenure',`${tenureYears} Years`],[CircleDollarSign,'Monthly EMI',money(loan.emi)],[ChartNoAxesCombined,'Total Interest',money(loan.totalInterest)],[WalletCards,'Total Repayment',money(loan.totalPayment)]].map(([Icon,label,value])=><div className="flex gap-2 px-2 first:pl-0" key={label}><Icon className="mt-1 shrink-0 text-green" size={18}/><div><dt className="text-[9px] text-ink/50">{label}</dt><dd className="mt-1 text-[11px] font-bold">{value}</dd></div></div>)}</dl><div className="mt-4 flex flex-col gap-4 rounded-lg bg-[#f0f5ed] p-4 md:flex-row md:items-center"><div className="flex min-w-0 gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-green text-green"><CircleDollarSign size={18}/></span><div><h3 className="font-serif text-base">Can You Comfortably Afford This EMI?</h3><p className="mt-1 text-[10px] leading-4 text-ink/65">EMI is only one part of the decision. Combine it with your income, expenses, savings, existing EMI and property details for a complete analysis.</p></div></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row"><Link className="btn-dark !min-h-9 !px-5 !py-2 !text-[10px]" href="/calculators/affordability">Check My Affordability <ArrowRight size={14}/></Link><Link className="btn-outline !min-h-9 !px-5 !py-2 !text-[10px]" href="/smart-recommendation">Get Smart Recommendation <ArrowRight size={14}/></Link></div></div></section>
      <p className="mt-3 text-center text-[9px] text-ink/45">EMI calculations are estimates based on the information provided. Actual loan terms, rates and payments may vary by lender.</p>
    </div></main><Footer/></>;
}

function RangeField({label,min,max,step,value,onChange,display,error}){return <label className="block"><span className="flex items-center justify-between gap-3 text-[11px] font-bold"><span>{label}</span><output className="rounded-md border border-ink/10 bg-[#fbfbf9] px-3 py-1.5 text-[10px] font-semibold">{display}</output></span><input className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#d7e4dd] accent-green" type="range" min={min} max={max} step={step} value={Math.min(Math.max(value,min),max)} onChange={e=>onChange(e.target.value)}/><span className="mt-1 flex justify-between text-[9px] text-ink/45"><span>{label.includes('Rate')?`${min}%`:money(min)}</span><span>{label.includes('Rate')?`${max}%`:money(max)}</span></span>{error&&<small className="mt-1 block text-[10px] text-red-700">{error}</small>}</label>}
function Metric({icon:Icon,label,value}){return <div className="flex items-center gap-2 rounded-lg border border-ink/10 p-3"><Icon className="shrink-0 text-green" size={19}/><div><span className="block text-[9px] text-ink/55">{label}</span><b className="mt-0.5 block text-[13px]">{value}</b></div></div>}
function BreakdownRow({color,label,value,total}){return <div className="flex items-center justify-between border-b border-ink/10 pb-3 text-[10px]"><span className="flex items-center gap-2"><i className={`h-2.5 w-2.5 rounded-full ${color}`}/>{label}</span><b>{money(value)} <span className="ml-3">{percent(total?value/total*100:0)}</span></b></div>}
