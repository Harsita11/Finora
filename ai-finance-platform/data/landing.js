import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <Receipt className="h-7 w-7" />,
    title: "Smart Receipt Scanner",
    description:
      "Snap a photo of a receipt and Gemini AI extracts the amount, date, and category for you automatically",
  },
  {
    icon: <PieChart className="h-7 w-7" />,
    title: "Budget Tracking & Alerts",
    description:
      "Set a monthly budget and get an email alert as soon as your spending gets close to the limit",
  },
  {
    icon: <CreditCard className="h-7 w-7" />,
    title: "Multi-Account, Multi-Currency",
    description:
      "Track separate accounts side by side, each shown in its own currency — from ₹ to $ to €",
  },
  {
    icon: <RefreshCw className="h-7 w-7" />,
    title: "Recurring Transactions & Reminders",
    description:
      "Set it once for bills and subscriptions — they're logged automatically, with a reminder email 3 days before each charge",
  },
  {
    icon: <SlidersHorizontal className="h-7 w-7" />,
    title: "Search, Filter & Export",
    description:
      "Filter transactions by category, date range, or amount, then export exactly what you need to a CSV file",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "Monthly AI Insights",
    description:
      "Get a personalized email each month with AI-generated insights on your spending patterns",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Finora has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I recommend Finora to all my clients. The multi-currency support and detailed analytics make it perfect for international investors.",
  },
];
