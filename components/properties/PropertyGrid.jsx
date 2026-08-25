import PropertyCard from '@/components/PropertyCard';
export default function PropertyGrid({ properties }) { return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{properties.map((property) => <PropertyCard key={property.id} property={property}/>)}</div>; }
