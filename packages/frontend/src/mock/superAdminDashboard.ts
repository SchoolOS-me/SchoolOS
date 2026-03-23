type SuperAdminStat = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendVariant: "positive" | "negative" | "neutral";
};

export const superAdminStats: SuperAdminStat[] = [
  {
    id: "totalSchools",
    label: "Total Schools",
    value: "124",
    trend: "12% from last month",
    trendVariant: "positive",
  },
  {
    id: "activeSubscriptions",
    label: "Active Subscriptions",
    value: "89",
    trend: "4% renewal rate",
    trendVariant: "positive",
  },
  {
    id: "expiredSubscriptions",
    label: "Expired Subscriptions",
    value: "12",
    trend: "2 more than last week",
    trendVariant: "negative",
  },
  {
    id: "trialSchools",
    label: "Trial Schools",
    value: "23",
    trend: "High conversion potential",
    trendVariant: "neutral",
  },
];

export const superAdminSchools = [
  {
    id: "1",
    name: "Global International School",
    adminName: "John Doe",
    adminEmail: "admin@global.edu",
    subscriptionStatus: "active" as const,
  },
  {
    id: "2",
    name: "St. Mary's Academy",
    adminName: "Jane Smith",
    adminEmail: "info@stmarys.org",
    subscriptionStatus: "trial" as const,
  },
  {
    id: "3",
    name: "Westside High",
    adminName: "Robert Brown",
    adminEmail: "admin@westside.com",
    subscriptionStatus: "expired" as const,
  },
  {
    id: "4",
    name: "Elite Prep School",
    adminName: "Alice Johnson",
    adminEmail: "contact@eliteprep.edu",
    subscriptionStatus: "active" as const,
  },
  {
    id: "5",
    name: "Oakwood Primary",
    adminName: "Michael Wilson",
    adminEmail: "m.wilson@oakwood.com",
    subscriptionStatus: "active" as const,
  },
];
