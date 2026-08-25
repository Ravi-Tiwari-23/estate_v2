export const money = (value, suffix = '') => `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}${suffix}`;
export const percent = (value) => `${(Number(value) || 0).toFixed(1)}%`;
