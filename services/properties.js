import { propertyListings } from '@/data/properties';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const budgetRanges = { 'under-1': [0, 10000000], '1-2': [10000000, 20000000], '2-4': [20000000, 40000000], '4-6': [40000000, 60000000], '6-plus': [60000000, Infinity] };

export async function getProperties(filters = {}) {
  // Replace this demo adapter with GET /api/v1/properties when the backend is available.
  await wait(300);
  let results = propertyListings.filter((property) => {
    const needle = (filters.query || '').trim().toLowerCase();
    const matchesSearch = !needle || [property.title, property.location, property.locality].some((value) => value.toLowerCase().includes(needle));
    const matchesBudget = !filters.budget || !budgetRanges[filters.budget] || (property.purpose === 'Rent' ? true : property.priceValue >= budgetRanges[filters.budget][0] && property.priceValue < budgetRanges[filters.budget][1]);
    return property.purpose === (filters.purpose || 'Buy') && (!filters.city || property.city === filters.city) && (!filters.type || property.type === filters.type) && (!filters.bhk || property.bhk === filters.bhk) && (!filters.risk || property.risk === filters.risk) && (!filters.status || property.status === filters.status) && (!filters.minRoi || property.roiValue >= Number(filters.minRoi)) && (!filters.minArea || property.areaValue >= Number(filters.minArea)) && matchesSearch && matchesBudget;
  });
  const sorters = { 'price-low': (a,b) => a.priceValue-b.priceValue, 'price-high': (a,b) => b.priceValue-a.priceValue, roi: (a,b) => b.roiValue-a.roiValue, risk: (a,b) => ['Low Risk','Moderate Risk','High Risk'].indexOf(a.risk)-['Low Risk','Moderate Risk','High Risk'].indexOf(b.risk) };
  if (sorters[filters.sort]) results = [...results].sort(sorters[filters.sort]);
  return { properties: results, total: results.length, demo: true };
}

export async function getPropertyById(id) {
  await wait(150);
  return propertyListings.find((property) => property.id === id) || null;
}
