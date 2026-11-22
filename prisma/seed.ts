import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SQLite database...");

  // 1. Admin User
  await prisma.user.upsert({
    where: { email: "admin@portfolio.com" },
    update: {},
    create: {
      email: "admin@portfolio.com",
      name: "Portfolio Admin",
      role: "admin",
    },
  });

  // 2. Projects & Case Studies
  const projectsData = [
    {
      id: "proj-1",
      slug: "fintech-redesign",
      title: "Razorpay Dashboard Redesign",
      subtitle: "Reducing cognitive load for 500K+ merchants",
      description: "End-to-end redesign of the merchant analytics dashboard, introducing progressive disclosure, smart defaults, and contextual insights.",
      overview: "Merchant analytics was cluttered with 180+ metrics across 12 tabs. Merchants reported confusion, and support tickets for 'how to find X' were at 34% of total volume.",
      role: "Lead Product Designer",
      duration: "6 months",
      year: "2024",
      company: "Razorpay",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      accentColor: "#3B82F6",
      featured: true,
      published: true,
      order: 1,
      tools: JSON.stringify(["Figma", "Protopie", "Maze", "Looker"]),
      tags: JSON.stringify(["UX Research", "Design System", "Data Viz", "B2B", "Dashboard", "Fintech"]),
      metrics: JSON.stringify([
        { label: "Task completion", value: "+43%" },
        { label: "Support tickets", value: "-38%" },
        { label: "Session duration", value: "+2.4×" },
        { label: "NPS score", value: "72 → 89" },
      ]),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
      ]),
      caseStudy: {
        problem: "180+ metrics cluttered across 12 tabs caused decision paralysis and high support ticket volume.",
        research: JSON.stringify(["24 Merchant interviews", "Session recordings analysis", "Usability testing with 15 users"]),
        wireframes: JSON.stringify(["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&q=80"]),
        hiFidelity: JSON.stringify(["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"]),
        prototype: "https://figma.com/@sample-prototype",
        testing: JSON.stringify({ passRate: "94%", taskTimeReduction: "43%" }),
        lessons: "Progressive disclosure and customizable metric cards dramatically improved merchant productivity.",
        figmaEmbed: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/sample",
      }
    },
    {
      id: "proj-2",
      slug: "swiggy-checkout",
      title: "Swiggy Checkout Overhaul",
      subtitle: "2.4% conversion lift on a 50M+ user platform",
      description: "Redesigning the checkout flow to reduce friction, introduce smart address inference, and personalize payment method ordering.",
      overview: "Checkout abandonment was at 68% — driven by address confusion, payment failure friction, and slow upsell interstitials.",
      role: "Senior Product Designer",
      duration: "4 months",
      year: "2023",
      company: "Swiggy",
      coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
      accentColor: "#FF5200",
      featured: true,
      published: true,
      order: 2,
      tools: JSON.stringify(["Figma", "Protopie", "FullStory", "Firebase A/B"]),
      tags: JSON.stringify(["Mobile", "A/B Testing", "Conversion", "B2C", "Mobile App", "E-commerce"]),
      metrics: JSON.stringify([
        { label: "Conversion rate", value: "+2.4%" },
        { label: "Checkout time", value: "-18s avg" },
        { label: "Payment errors", value: "-61%" },
        { label: "Revenue impact", value: "₹12Cr / month" },
      ]),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80"
      ]),
      caseStudy: {
        problem: "Checkout abandonment at 68% due to address confusion and payment friction.",
        research: JSON.stringify(["Checkout funnel dropoff audit", "500-user survey", "Competitor benchmark"]),
        wireframes: JSON.stringify(["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&q=80"]),
        hiFidelity: JSON.stringify(["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80"]),
        prototype: "https://figma.com/@sample-prototype-2",
        testing: JSON.stringify({ conversionLift: "+2.4%", timeSaved: "18s" }),
        lessons: "Contextual payment sorting based on past user success reduced payment failure drops by 61%.",
        figmaEmbed: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/sample2",
      }
    },
    {
      id: "proj-3",
      slug: "cred-design-system",
      title: "CRED Design System 2.0",
      subtitle: "Scaling design across 3 product lines",
      description: "Built a comprehensive design system from scratch that unified visual language, reduced design-dev handoff time, and enabled 24 designers to ship faster.",
      overview: "CRED had 3 product lines (Pay, Store, Garage) with divergent UI patterns. Handoff was painful and component duplication was rampant.",
      role: "Design Systems Lead",
      duration: "8 months",
      year: "2023",
      company: "CRED",
      coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
      accentColor: "#1a1a1a",
      featured: true,
      published: true,
      order: 3,
      tools: JSON.stringify(["Figma", "Storybook", "Style Dictionary", "Zeroheight"]),
      tags: JSON.stringify(["Design Systems", "Tokens", "Storybook", "Documentation", "Design System", "B2C"]),
      metrics: JSON.stringify([
        { label: "Components built", value: "240+" },
        { label: "Design velocity", value: "+60%" },
        { label: "Design-dev sync time", value: "-55%" },
        { label: "Brand consistency", value: "97% audit pass" },
      ]),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80"
      ]),
      caseStudy: {
        problem: "UI divergence across 3 product lines created technical debt and slowed feature velocity.",
        research: JSON.stringify(["Component audit across 150 screens", "Developer friction interviews"]),
        wireframes: JSON.stringify(["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&q=80"]),
        hiFidelity: JSON.stringify(["https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80"]),
        prototype: "https://figma.com/@sample-prototype-3",
        testing: JSON.stringify({ velocityGain: "+60%", auditPass: "97%" }),
        lessons: "Token-first architecture allowed zero-overhead dark mode and dynamic theme switches across web and native apps.",
        figmaEmbed: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/sample3",
      }
    },
    {
      id: "proj-4",
      slug: "atlassian-jira-mobile",
      title: "Jira Mobile for Managers",
      subtitle: "On-the-go project oversight for engineering leads",
      description: "Designed a mobile-first Jira experience focused on team health, sprint burn-down, and blocker resolution — without requiring desktop.",
      overview: "Engineering managers at Atlassian couldn't effectively track team health or resolve blockers without opening their laptops.",
      role: "Senior Product Designer",
      duration: "7 months",
      year: "2024",
      company: "Atlassian",
      coverImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
      accentColor: "#0052CC",
      featured: true,
      published: true,
      order: 4,
      tools: JSON.stringify(["Figma", "Framer", "Amplitude", "UserInterviews"]),
      tags: JSON.stringify(["B2B", "Mobile", "Productivity", "SaaS", "Mobile App"]),
      metrics: JSON.stringify([
        { label: "Daily active managers", value: "+82%" },
        { label: "Blocker resolution time", value: "-3.2h avg" },
        { label: "Feature adoption (30d)", value: "67%" },
        { label: "Manager satisfaction", value: "8.9/10" },
      ]),
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80"
      ]),
      caseStudy: {
        problem: "Desktop Jira parity on mobile felt overwhelming and unsuitable for quick status checks and blocker resolution.",
        research: JSON.stringify(["40 Manager interviews across APAC and US", "Diary studies"]),
        wireframes: JSON.stringify(["https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&q=80"]),
        hiFidelity: JSON.stringify(["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80"]),
        prototype: "https://figma.com/@sample-prototype-4",
        testing: JSON.stringify({ dauGrowth: "+82%", satisfaction: "8.9/10" }),
        lessons: "Focusing on key high-frequency manager actions (approvals, triage, blocker unsticking) drove massive engagement.",
        figmaEmbed: "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/sample4",
      }
    }
  ];

  for (const item of projectsData) {
    const { caseStudy, ...project } = item;
    const createdProj = await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });

    if (caseStudy) {
      await prisma.caseStudy.upsert({
        where: { projectId: createdProj.id },
        update: { ...caseStudy, projectId: createdProj.id },
        create: { ...caseStudy, projectId: createdProj.id },
      });
    }
  }

  // 3. Experience Timeline (All 5 roles)
  const expData = [
    {
      id: "exp-1",
      company: "Atlassian",
      role: "Senior Product Designer",
      period: "2023 – Present",
      location: "Remote / Sydney",
      description: "Leading design for Jira Mobile — an initiative to bring project management to on-the-go workflows for engineering managers and team leads.",
      achievements: JSON.stringify([
        "Designed Jira Mobile for Managers — 82% DAU growth in 6 months",
        "Built and maintained the mobile design system (120+ components)",
        "Ran 40+ user research sessions across APAC and US markets",
        "Partnered with 3 engineering squads across 2 time zones"
      ]),
      logo: "Briefcase",
      color: "#0052CC",
      order: 1,
      current: true,
    },
    {
      id: "exp-2",
      company: "CRED",
      role: "Design Systems Lead",
      period: "2022 – 2023",
      location: "Bangalore, India",
      description: "Founded and led the design systems practice, unifying visual language across Pay, Store, and Garage product lines for 24 designers and 200+ engineers.",
      achievements: JSON.stringify([
        "Shipped CRED Design System 2.0 — 240+ components, 7 semantic token layers",
        "Reduced design-dev handoff friction by 55%",
        "Trained 24 designers in token-first design workflow"
      ]),
      logo: "Shield",
      color: "#1a1a1a",
      order: 2,
      current: false,
    },
    {
      id: "exp-3",
      company: "Swiggy",
      role: "Product Designer",
      period: "2021 – 2022",
      location: "Bangalore, India",
      description: "Worked on core consumer checkout and reordering flows — directly impacting GMV through conversion optimization and friction reduction.",
      achievements: JSON.stringify([
        "Led checkout redesign — +2.4% conversion on 50M+ users",
        "Designed smart reorder shelf — 33% adoption in month 1",
        "Shipped 'Swiggy Genie' redesign — +18% task success rate"
      ]),
      logo: "ShoppingBag",
      color: "#FF5200",
      order: 3,
      current: false,
    },
    {
      id: "exp-4",
      company: "Razorpay",
      role: "Product Designer",
      period: "2020 – 2021",
      location: "Bangalore, India",
      description: "Designed B2B merchant-facing products — analytics dashboards, payment link flows, and the Razorpay Capital credit dashboard.",
      achievements: JSON.stringify([
        "Dashboard redesign — 43% improvement in task completion",
        "Designed Payment Links v2 — shipped to 500K+ merchants"
      ]),
      logo: "CreditCard",
      color: "#3B82F6",
      order: 4,
      current: false,
    },
    {
      id: "exp-5",
      company: "Freelance",
      role: "UX Designer",
      period: "2018 – 2020",
      location: "Remote",
      description: "Worked with early-stage startups across fintech, edtech, and healthcare — from 0-to-1 product design to design-developer handoff.",
      achievements: JSON.stringify([
        "Designed 12+ products from scratch",
        "3 clients raised seed funding post-launch"
      ]),
      logo: "Sparkles",
      color: "#7C3AED",
      order: 5,
      current: false,
    }
  ];

  for (const exp of expData) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: exp,
      create: exp,
    });
  }

  // 4. Skills & Tools
  const skillsList = [
    { id: "sk-1", name: "Figma", level: 95, icon: "Palette", category: "design", order: 1 },
    { id: "sk-2", name: "Framer", level: 80, icon: "Zap", category: "design", order: 2 },
    { id: "sk-3", name: "Protopie", level: 85, icon: "Smartphone", category: "design", order: 3 },
    { id: "sk-4", name: "Principle", level: 70, icon: "Lightbulb", category: "design", order: 4 },
    { id: "sk-5", name: "Webflow", level: 75, icon: "Globe", category: "design", order: 5 },
    { id: "sk-6", name: "After Effects", level: 65, icon: "Film", category: "design", order: 6 },
    { id: "sk-7", name: "User Interviews", level: 90, icon: "Mic", category: "research", order: 1 },
    { id: "sk-8", name: "Usability Testing", level: 90, icon: "FlaskConical", category: "research", order: 2 },
    { id: "sk-9", name: "A/B Testing", level: 85, icon: "GitCompare", category: "research", order: 3 },
    { id: "sk-10", name: "Journey Mapping", level: 95, icon: "Map", category: "research", order: 4 },
    { id: "sk-11", name: "Analytics (Amplitude)", level: 80, icon: "BarChart3", category: "research", order: 5 },
    { id: "sk-12", name: "Survey Design", level: 75, icon: "ClipboardList", category: "research", order: 6 },
    { id: "sk-13", name: "Design Tokens", level: 95, icon: "Coins", category: "systems", order: 1 },
    { id: "sk-14", name: "Component Libraries", level: 90, icon: "Boxes", category: "systems", order: 2 },
    { id: "sk-15", name: "Documentation", level: 85, icon: "FileText", category: "systems", order: 3 },
    { id: "sk-16", name: "Storybook", level: 70, icon: "BookOpen", category: "systems", order: 4 },
    { id: "sk-17", name: "Style Dictionary", level: 75, icon: "Layers", category: "systems", order: 5 },
    { id: "sk-18", name: "Zeroheight", level: 80, icon: "Ruler", category: "systems", order: 6 },
    { id: "sk-19", name: "HTML / CSS", level: 80, icon: "Code", category: "code", order: 1 },
    { id: "sk-20", name: "TypeScript", level: 60, icon: "FileCode", category: "code", order: 2 },
    { id: "sk-21", name: "React basics", level: 55, icon: "Component", category: "code", order: 3 },
    { id: "sk-22", name: "Git", level: 65, icon: "GitBranch", category: "code", order: 4 }
  ];

  for (const sk of skillsList) {
    await prisma.skill.upsert({
      where: { id: sk.id },
      update: sk,
      create: sk,
    });
  }

  // 5. Testimonials
  const testimonialsData = [
    {
      id: "t-1",
      name: "Priya Sharma",
      role: "VP Engineering",
      company: "Atlassian",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      quote: "Hands down the most thorough design process I've seen. They don't just deliver screens — they deliver thinking.",
      featured: true,
      order: 1,
    },
    {
      id: "t-2",
      name: "Rahul Mehta",
      role: "Head of Product",
      company: "CRED",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
      quote: "Our design system went from a liability to a superpower. Ship velocity doubled in the quarter after launch.",
      featured: true,
      order: 2,
    },
    {
      id: "t-3",
      name: "Anika Patel",
      role: "Chief Product Officer",
      company: "Swiggy",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anika",
      quote: "The checkout redesign delivered results we hadn't seen from any previous iteration. Data-driven thinking meets beautiful execution.",
      featured: true,
      order: 3,
    },
    {
      id: "t-4",
      name: "Vikram Nair",
      role: "Product Manager",
      company: "Razorpay",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
      quote: "Working with them changed how our team thinks about design. Research-led, outcome-focused, and always ahead of the brief.",
      featured: true,
      order: 4,
    }
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // 6. Settings
  const settingsData = [
    { key: "heroName", value: "Nitish Tao" },
    { key: "heroTitle", value: "Senior Product Designer" },
    { key: "heroBio", value: "I design products that ship, scale, and move metrics. 6 years crafting experiences for 100M+ users at Atlassian, CRED, Swiggy & Razorpay." },
    { key: "yearsExperience", value: "6+" },
    { key: "productsShipped", value: "40+" },
    { key: "usersImpacted", value: "100M+" },
    { key: "resumeUrl", value: "/resume.pdf" },
    { key: "heroImage", value: "" },
    { key: "googleDriveFolderUrl", value: "https://drive.google.com/drive/folders/sample" },
  ];

  for (const s of settingsData) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // 7. Social Links
  const socialsData = [
    { id: "soc-1", platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", order: 1, active: true },
    { id: "soc-2", platform: "Twitter / X", url: "https://twitter.com", icon: "Twitter", order: 2, active: true },
    { id: "soc-3", platform: "GitHub", url: "https://github.com", icon: "Github", order: 3, active: true },
    { id: "soc-4", platform: "Dribbble", url: "https://dribbble.com", icon: "Dribbble", order: 4, active: true },
    { id: "soc-5", platform: "Email", url: "mailto:admin@portfolio.com", icon: "Mail", order: 5, active: true },
  ];

  for (const soc of socialsData) {
    await prisma.social.upsert({
      where: { id: soc.id },
      update: soc,
      create: soc,
    });
  }

  console.log("Database seeded successfully with all website records!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
