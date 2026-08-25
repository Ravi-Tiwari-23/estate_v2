import PropertiesClient from '@/components/properties/PropertiesClient';
import { Suspense } from 'react';
export const metadata={title:'Properties in Gurugram & Ghaziabad | Your Home',description:'Explore properties for sale and rent in Gurugram and Ghaziabad. Compare prices, rental yield, risk and property details with Your Home.'};
export default function PropertiesPage(){return <Suspense fallback={<main className="min-h-screen bg-cream"/>}><PropertiesClient/></Suspense>}
