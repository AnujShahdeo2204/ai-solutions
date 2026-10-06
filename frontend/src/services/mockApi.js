export const mockData = {
  summary: {
    totalOrders: 1250,
    totalRevenue: 458000,
    delayedOrders: 87,
    deliveredOrders: 1163,
    averageOrderValue: 366.4,
    averageDeliveryDays: 4.2
  },
  revenue: [
    { date: "2024-01-01", revenue: 12500, orders: 42 },
    { date: "2024-01-02", revenue: 14800, orders: 51 },
    { date: "2024-01-03", revenue: 16000, orders: 60 },
    { date: "2024-01-04", revenue: 13500, orders: 45 },
    { date: "2024-01-05", revenue: 18200, orders: 65 },
    { date: "2024-01-06", revenue: 21000, orders: 78 },
    { date: "2024-01-07", revenue: 19500, orders: 70 },
    { date: "2024-01-08", revenue: 17300, orders: 58 },
    { date: "2024-01-09", revenue: 15600, orders: 52 },
    { date: "2024-01-10", revenue: 22100, orders: 80 },
    { date: "2024-01-11", revenue: 20400, orders: 72 },
    { date: "2024-01-12", revenue: 18900, orders: 63 },
    { date: "2024-01-13", revenue: 16700, orders: 55 },
    { date: "2024-01-14", revenue: 23500, orders: 85 },
  ],
  categories: [
    { category: "Electronics", revenue: 185000, orders: 420 },
    { category: "Furniture", revenue: 92000, orders: 210 },
    { category: "Clothing", revenue: 74000, orders: 310 },
    { category: "Toys", revenue: 45000, orders: 150 },
    { category: "Books", revenue: 62000, orders: 160 },
  ],
  delivery: {
    delivered: 1163,
    delayed: 87,
    unknown: 0
  },
  orders: [
    { orderId: "ORD-1001", customer: "Rahul Sharma", date: "2024-01-01", items: 3, amount: 2200, category: "Electronics", deliveryStatus: "Delivered", deliveryDays: 3 },
    { orderId: "ORD-1002", customer: "Amit Patel", date: "2024-01-01", items: 1, amount: 1500, category: "Furniture", deliveryStatus: "Delayed", deliveryDays: 8 },
    { orderId: "ORD-1003", customer: "Sneha Gupta", date: "2024-01-02", items: 5, amount: 3100, category: "Clothing", deliveryStatus: "Delivered", deliveryDays: 2 },
    { orderId: "ORD-1004", customer: "Vikram Singh", date: "2024-01-02", items: 2, amount: 900, category: "Books", deliveryStatus: "Delivered", deliveryDays: 4 },
    { orderId: "ORD-1005", customer: "Pooja Verma", date: "2024-01-03", items: 4, amount: 4200, category: "Electronics", deliveryStatus: "Delayed", deliveryDays: 9 },
    { orderId: "ORD-1006", customer: "Arjun Reddy", date: "2024-01-03", items: 2, amount: 1800, category: "Toys", deliveryStatus: "Delivered", deliveryDays: 3 },
    { orderId: "ORD-1007", customer: "Neha Joshi", date: "2024-01-04", items: 1, amount: 650, category: "Books", deliveryStatus: "Delivered", deliveryDays: 2 },
    { orderId: "ORD-1008", customer: "Karan Mehta", date: "2024-01-04", items: 3, amount: 5400, category: "Electronics", deliveryStatus: "Delivered", deliveryDays: 5 },
    { orderId: "ORD-1009", customer: "Priya Nair", date: "2024-01-05", items: 2, amount: 2100, category: "Furniture", deliveryStatus: "Delayed", deliveryDays: 10 },
    { orderId: "ORD-1010", customer: "Rohan Das", date: "2024-01-05", items: 6, amount: 3600, category: "Clothing", deliveryStatus: "Delivered", deliveryDays: 3 },
    { orderId: "ORD-1011", customer: "Anita Kumari", date: "2024-01-06", items: 1, amount: 1200, category: "Electronics", deliveryStatus: "Delivered", deliveryDays: 4 },
    { orderId: "ORD-1012", customer: "Suresh Yadav", date: "2024-01-06", items: 4, amount: 2800, category: "Toys", deliveryStatus: "Delivered", deliveryDays: 3 },
    { orderId: "ORD-1013", customer: "Meena Iyer", date: "2024-01-07", items: 2, amount: 1750, category: "Clothing", deliveryStatus: "Delayed", deliveryDays: 7 },
    { orderId: "ORD-1014", customer: "Deepak Jain", date: "2024-01-07", items: 3, amount: 4100, category: "Electronics", deliveryStatus: "Delivered", deliveryDays: 2 },
    { orderId: "ORD-1015", customer: "Kavita Rao", date: "2024-01-08", items: 1, amount: 950, category: "Books", deliveryStatus: "Delivered", deliveryDays: 5 },
  ],
  products: [
    { id: "P101", name: "Laptop", category: "Electronics", price: 45000, stock: 120 },
    { id: "P102", name: "Smartphone", category: "Electronics", price: 25000, stock: 340 },
    { id: "P103", name: "Tablet", category: "Electronics", price: 18000, stock: 85 },
    { id: "P104", name: "Monitor", category: "Electronics", price: 12000, stock: 60 },
    { id: "P201", name: "Office Chair", category: "Furniture", price: 8500, stock: 45 },
    { id: "P202", name: "Standing Desk", category: "Furniture", price: 15000, stock: 30 },
    { id: "P203", name: "Bookshelf", category: "Furniture", price: 6500, stock: 55 },
    { id: "P301", name: "T-Shirt", category: "Clothing", price: 800, stock: 500 },
    { id: "P302", name: "Jeans", category: "Clothing", price: 1500, stock: 280 },
    { id: "P303", name: "Jacket", category: "Clothing", price: 3500, stock: 90 },
    { id: "P401", name: "Building Blocks", category: "Toys", price: 1200, stock: 200 },
    { id: "P402", name: "RC Car", category: "Toys", price: 2500, stock: 75 },
    { id: "P501", name: "Novel Set", category: "Books", price: 600, stock: 400 },
    { id: "P502", name: "Programming Guide", category: "Books", price: 950, stock: 150 },
  ]
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getMockSummary = async (filters) => {
  await delay(400);
  return mockData.summary;
};

export const getMockRevenue = async (filters) => {
  await delay(400);
  let data = [...mockData.revenue];
  if (filters?.startDate) {
    data = data.filter(d => d.date >= filters.startDate);
  }
  if (filters?.endDate) {
    data = data.filter(d => d.date <= filters.endDate);
  }
  return data;
};

export const getMockCategories = async (filters) => {
  await delay(400);
  let data = [...mockData.categories];
  if (filters?.category) {
    data = data.filter(c => c.category === filters.category);
  }
  return data;
};

export const getMockDelivery = async (filters) => {
  await delay(400);
  return mockData.delivery;
};

export const getMockOrders = async (filters) => {
  await delay(400);
  let data = [...mockData.orders];
  if (filters?.category) {
    data = data.filter(o => o.category === filters.category);
  }
  if (filters?.deliveryStatus) {
    data = data.filter(o => o.deliveryStatus === filters.deliveryStatus);
  }
  if (filters?.startDate) {
    data = data.filter(o => o.date >= filters.startDate);
  }
  if (filters?.endDate) {
    data = data.filter(o => o.date <= filters.endDate);
  }
  return data;
};

export const getMockProducts = async (filters) => {
  await delay(400);
  let data = [...mockData.products];
  if (filters?.category) {
    data = data.filter(p => p.category === filters.category);
  }
  return data;
};
