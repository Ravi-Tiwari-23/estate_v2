import { properties, insights, schemes } from '@/data/home';

export async function getHomeData() {
  // Replace this adapter with GET /api/v1/home when the backend is available.
  await new Promise((resolve) => setTimeout(resolve, 350));
  return { featuredProperties: properties, insights, schemes, demo: true };
}
