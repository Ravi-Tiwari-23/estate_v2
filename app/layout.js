import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Your Home | Smart Real Estate Decisions',
  description: 'Explore properties in Gurugram and Ghaziabad, calculate true costs, check affordability and get smarter property insights with Your Home.'
};

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body suppressHydrationWarning><Providers>{children}</Providers></body></html>;
}
