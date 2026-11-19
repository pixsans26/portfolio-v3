export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string[];
  tags: string[];
  year: string;
  role: string;
  duration: string;
  tools: string[];
  company: string;
  coverImage: string;
  accentColor: string;
  featured: boolean;
  metrics: { label: string; value: string }[];
  overview: string;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "fintech-redesign",
    title: "Razorpay Dashboard Redesign",
    subtitle: "Reducing cognitive load for 500K+ merchants",
    description:
      "End-to-end redesign of the merchant analytics dashboard, introducing progressive disclosure, smart defaults, and contextual insights.",
    category: ["Dashboard", "Fintech"],
    tags: ["UX Research", "Design System", "Data Viz", "B2B"],
    year: "2024",
    role: "Lead Product Designer",
    duration: "6 months",
    tools: ["Figma", "Protopie", "Maze", "Looker"],
    company: "Razorpay",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    accentColor: "#3B82F6",
    featured: true,
    metrics: [
      { label: "Task completion", value: "+43%" },
      { label: "Support tickets", value: "-38%" },
      { label: "Session duration", value: "+2.4×" },
      { label: "NPS score", value: "72 → 89" },
    ],
    overview:
      "Merchant analytics was cluttered with 180+ metrics across 12 tabs. Merchants reported confusion, and support tickets for 'how to find X' were at 34% of total volume.",
  },
  {
    id: "2",
    slug: "swiggy-checkout",
    title: "Swiggy Checkout Overhaul",
    subtitle: "2.4% conversion lift on a 50M+ user platform",
    description:
      "Redesigning the checkout flow to reduce friction, introduce smart address inference, and personalize payment method ordering.",
    category: ["Mobile App", "E-commerce"],
    tags: ["Mobile", "A/B Testing", "Conversion", "B2C"],
    year: "2023",
    role: "Senior Product Designer",
    duration: "4 months",
    tools: ["Figma", "Protopie", "FullStory", "Firebase A/B"],
    company: "Swiggy",
    coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    accentColor: "#FF5200",
    featured: true,
    metrics: [
      { label: "Conversion rate", value: "+2.4%" },
      { label: "Checkout time", value: "-18s avg" },
      { label: "Payment errors", value: "-61%" },
      { label: "Revenue impact", value: "₹12Cr / month" },
    ],
    overview:
      "Checkout abandonment was at 68% — primarily driven by address confusion, payment failure friction, and slow upsell interstitials.",
  },
  {
    id: "3",
    slug: "cred-design-system",
    title: "CRED Design System 2.0",
    subtitle: "Scaling design across 3 product lines",
    description:
      "Built a comprehensive design system from scratch that unified visual language, reduced design-dev handoff time, and enabled a team of 24 designers to ship faster.",
    category: ["Design System", "B2C"],
    tags: ["Design Systems", "Tokens", "Storybook", "Documentation"],
    year: "2023",
    role: "Design Systems Lead",
    duration: "8 months",
    tools: ["Figma", "Storybook", "Style Dictionary", "Zeroheight"],
    company: "CRED",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
    accentColor: "#1a1a1a",
    featured: true,
    metrics: [
      { label: "Components built", value: "240+" },
      { label: "Design velocity", value: "+60%" },
      { label: "Design-dev sync time", value: "-55%" },
      { label: "Brand consistency", value: "97% audit pass" },
    ],
    overview:
      "CRED had 3 product lines (Pay, Store, Garage) each with divergent UI patterns. Handoff was painful, component duplication was rampant, and onboarding new designers took 3+ weeks.",
  },
  {
    id: "4",
    slug: "healthcare-app",
    title: "Practo Patient App",
    subtitle: "Simplifying healthcare navigation for 20M patients",
    description:
      "Redesigned the patient journey from symptom search to post-consultation — with AI-assisted triage and smart appointment scheduling.",
    category: ["Mobile App", "Healthcare"],
    tags: ["Healthcare", "AI/ML", "Accessibility", "B2C"],
    year: "2022",
    role: "Product Designer",
    duration: "5 months",
    tools: ["Figma", "Maze", "Hotjar", "UserTesting"],
    company: "Practo",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    accentColor: "#10B981",
    featured: false,
    metrics: [
      { label: "Appointment bookings", value: "+31%" },
      { label: "Drop-off rate", value: "-47%" },
      { label: "Accessibility score", value: "WCAG AA" },
      { label: "Avg rating", value: "4.1 → 4.7" },
    ],
    overview:
      "Patients dropped off at symptom entry (48%) due to medical jargon. The app felt clinical and overwhelming, not empathetic.",
  },
  {
    id: "5",
    slug: "atlassian-jira-mobile",
    title: "Jira Mobile for Managers",
    subtitle: "On-the-go project oversight for engineering leads",
    description:
      "Designed a mobile-first Jira experience focused on team health, sprint burn-down, and blocker resolution — without requiring desktop.",
    category: ["Mobile App", "B2B"],
    tags: ["B2B", "Mobile", "Productivity", "SaaS"],
    year: "2024",
    role: "Senior Product Designer",
    duration: "7 months",
    tools: ["Figma", "Framer", "Amplitude", "UserInterviews"],
    company: "Atlassian",
    coverImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
    accentColor: "#0052CC",
    featured: true,
    metrics: [
      { label: "Daily active managers", value: "+82%" },
      { label: "Blocker resolution time", value: "-3.2h avg" },
      { label: "Feature adoption (30d)", value: "67%" },
      { label: "Manager satisfaction", value: "8.9/10" },
    ],
    overview:
      "Engineering managers at Atlassian couldn't effectively track team health or resolve blockers without opening their laptops. Mobile Jira was desktop-parity, not mobile-first.",
  },
  {
    id: "6",
    slug: "edtech-platform",
    title: "Byju's Learning Streaks",
    subtitle: "Habit-forming engagement for 10M students",
    description:
      "Designed a streak and reward system that gamified daily learning without resorting to dark patterns — increasing 7-day retention significantly.",
    category: ["Mobile App", "EdTech"],
    tags: ["EdTech", "Gamification", "Retention", "B2C"],
    year: "2022",
    role: "Product Designer",
    duration: "3 months",
    tools: ["Figma", "Maze", "Firebase", "Lottie"],
    company: "Byju's",
    coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
    accentColor: "#6366F1",
    featured: false,
    metrics: [
      { label: "7-day retention", value: "+28%" },
      { label: "Daily sessions", value: "+1.8× avg" },
      { label: "Parent satisfaction", value: "+22%" },
      { label: "Churn reduction", value: "-15%" },
    ],
    overview:
      "Students dropped after 3 sessions. Notifications were ignored, progress was invisible, and there was no sense of momentum or reward.",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const categories = [
  "All",
  "Mobile App",
  "Dashboard",
  "Design System",
  "Website",
  "Branding",
  "Fintech",
  "Healthcare",
  "EdTech",
  "B2B",
  "AI",
];
