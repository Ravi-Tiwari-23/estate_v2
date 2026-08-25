import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecommendationWizard from '@/components/recommendation/RecommendationWizard';
export const metadata={title:'Smart Property Recommendation | Your Home',description:'Combine property and finance inputs to get an explainable Buy, Wait, Rent or Avoid recommendation.'};
export default function SmartRecommendationPage(){return <><Navbar/><main className="bg-cream"><section className="border-b border-ink/10 bg-[#eef1ea]"><div className="mx-auto max-w-[1040px] px-5 py-12"><p className="eyebrow">YOUR FINANCES + YOUR PROPERTY</p><h1 className="mt-3 font-serif text-5xl tracking-[-.04em]">Make a smarter property decision.</h1><p className="mt-4 max-w-2xl text-ink/60">Answer a few practical questions. We will calculate the numbers and explain what they mean for your next move.</p></div></section><Suspense fallback={<div className="min-h-[60vh]"/>}><RecommendationWizard/></Suspense></main><Footer/></>}
