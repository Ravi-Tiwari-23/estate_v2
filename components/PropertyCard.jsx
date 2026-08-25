import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
export default function PropertyCard({ property }) {
  return <article className="group overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
    <div className="relative h-56 overflow-hidden bg-sage"><img loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={property.image} alt={`${property.title} property exterior`}/><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur">{property.type}</span></div>
    <div className="p-5"><div className="mb-2 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-green">{property.bhk}</p><h3 className="mt-1 font-serif text-2xl leading-tight">{property.title}</h3></div><p className="whitespace-nowrap text-lg font-bold">{property.price}</p></div><p className="flex items-center gap-1 text-sm text-ink/55"><MapPin size={14}/>{property.location}</p><div className="mt-5 grid grid-cols-3 gap-2 border-y border-ink/8 py-4 text-xs"><span><b className="block text-sm">{property.area}</b>Area</span><span><b className="block text-sm text-green">{property.risk}</b>Risk</span><span><b className="block text-sm">{property.roi}</b>Rental ROI</span></div><Link className="mt-4 flex items-center justify-between text-sm font-bold text-green" href={`/properties/${property.id}`}>View property <ArrowUpRight size={17}/></Link></div>
  </article>;
}
