// future-date.ts
const now = new Date();
now.setDate(now.getDate() + 10);

console.log(`Valid until: ${now.toISOString().split("T")[0]}`); // e.g., Valid until: 2025-07-03
