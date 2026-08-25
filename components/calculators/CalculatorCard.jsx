import Link from 'next/link';
import * as Icons from 'lucide-react';

export default function CalculatorCard({ tool }) {
  const Icon = Icons[tool.icon];
  return <Link href={`/calculators/${tool.slug}`} className="tool-card bg-white"><span className="icon-box shrink-0"><Icon/></span><span><b className="block font-serif text-2xl">{tool.title}</b><p className="mt-2 text-sm leading-6 text-ink/55">{tool.description}</p><small className="mt-4 block font-bold text-green">{tool.outcome}</small><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-green">Use calculator <Icons.ArrowUpRight size={15}/></span></span></Link>;
}
