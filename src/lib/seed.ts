import type { PortfolioContent, Project, TechStack, Experience } from "@/lib/db";

export const DEFAULT_PROJECTS: Array<Omit<Project, "_id" | "createdAt" | "updatedAt">> = [
  {
    title: "QNotes — AI Powered Note Taking Platform",
    description:
      "Audio/Text/PDF → structured notes + quizzes. Includes public sharing and playlists. Backend built from scratch in Node.js + Express.",
    technologies: ["Node.js", "Express.js", "MongoDB", "Next.js"],
    githubUrl: "https://github.com/NevilVataliya/QNotes",
    demoUrl: "https://qnotes.nevil.codes",
  },
  {
    title: "Facial Recognition Attendance System",
    description:
      "Contactless attendance using Raspberry Pi + HOG face recognition, with Student/Teacher React Native apps and real-time sync.",
    technologies: ["Python", "Raspberry Pi", "React Native", "Node.js", "MongoDB", "Firebase"],
    githubUrl: "https://github.com/NevilVataliya/Attendance_Management_System",
  },
  {
    title: "Loan Default Prediction System",
    description:
      "ML pipeline on LendingClub to assess credit risk; achieved 68% recall (32% precision) and deployed with Flask.",
    technologies: ["Python", "Pandas", "Scikit-Learn", "Flask", "Docker"],
    githubUrl: "https://github.com/NevilVataliya/loan-default-predictor",
    demoUrl: "https://loan.nevil.codes",
  },
  {
    title: "Library Management System",
    description: "C++ console LMS with file-based persistence, RBAC, and advanced OOP (operator overloading, polymorphism).",
    technologies: ["C++", "OOP", "File Handling"],
    githubUrl: "https://github.com/parthm2005/library",
  },
];

export const DEFAULT_EXPERIENCES: Array<Omit<Experience, "_id" | "createdAt" | "updatedAt">> = [
  {
    type: "leadership",
    title: "Web Development Team Head",
    org: "Mindbend (SVNIT TechFest)",
    period: "Nov 2025 — Present",
    summary:
      "Leading full-stack development of the official TechFest website using Next.js + MongoDB and coordinating delivery for the 2026 event.",
    highlights: ["Defined project structure and module ownership for juniors", "Conducted code reviews and ensured consistent standards"],
    tags: ["Next.js", "MongoDB", "Leadership", "Code Reviews"],
    links: [{ label: "Live", href: "https://mindbend-svnit.org" }],
  },
  {
    type: "leadership",
    title: "Web Development Team Co-Head",
    org: "Mindbend (SVNIT TechFest)",
    period: "Nov 2024 — May 2025",
    summary: "Integrated an AI chatbot (Flowise) into the official festival website and contributed to frontend work.",
    highlights: ["Shipped Flowise-based chatbot integration", "Improved UX in key pages"],
    tags: ["Next.js", "Flowise", "Frontend"],
    links: [{ label: "Live", href: "https://mindbend-main.vercel.app" }],
  },
  {
    type: "work",
    title: "Cybersecurity Researcher",
    org: "TryHackMe",
    period: "Ongoing",
    summary: "Top 7% globally. Practicing client-side + server-side exploitation and Linux hardening.",
    highlights: ["OWASP-focused web exploitation practice", "Pen-testing methodology and system hardening"],
    tags: ["Web Security", "Linux", "TryHackMe"],
    links: [{ label: "Profile", href: "https://tryhackme.com/p/N3V1L" }],
  },
];

export const DEFAULT_TECHSTACKS: Array<Omit<TechStack, "_id" | "createdAt">> = [
  ...["C++", "JavaScript (ES6+)", "C", "SQL", "Python", "Bash", "HTML5"].map((name) => ({
    name,
    category: "languages" as const,
  })),
  ...["Node.js", "Express.js", "REST APIs", "MongoDB (Mongoose)", "MySQL", "Firebase"].map((name) => ({
    name,
    category: "backend" as const,
  })),
  ...["React.js", "Next.js", "React Native", "Tailwind CSS"].map((name) => ({
    name,
    category: "frontend" as const,
  })),
  ...["Linux", "Git/GitHub", "Docker", "Postman", "Vercel", "Render"].map((name) => ({
    name,
    category: "tools" as const,
  })),
  ...["OOPS", "Web Security (OWASP)", "Machine Learning", "Data Structures"].map((name) => ({
    name,
    category: "concepts" as const,
  })),
];

export const DEFAULT_PORTFOLIO_CONTENT: Omit<PortfolioContent, "_id" | "createdAt" | "updatedAt"> = {
  slug: "default",
  navbar: {
    name: "Nevil",
    mobileSubtitle: "nevil.codes",
    desktopSubtitle: "SVNIT • CSE",
    items: [
      { id: "home", label: "Home" },
      { id: "projects", label: "Projects" },
      { id: "experience", label: "Experience" },
      { id: "tech", label: "Tech Stack" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ],
  },
  hero: {
    name: "Nevil Vataliya",
    headline: "Nevil Vataliya",
    subheadline: "Backend • Security • ML",
    metaLine: "B.Tech CSE • SVNIT, Surat (2023 — Present)",
    avatarAlt: "Nevil",
    githubUsername: "nevilvataliya",
    links: [
      { label: "Website", href: "https://nevil.codes" },
      { label: "GitHub", href: "https://github.com/nevilvataliya" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/nevilvataliya/" },
      { label: "Email", href: "mailto:nevilvataliya@gmail.com" },
    ],
    stats: [
      { label: "Projects", value: "4+" },
      { label: "TryHackMe", value: "Top 7%" },
      { label: "CGPA", value: "7.55" },
    ],
  },
  overview: {
    title: "Overview",
    paragraphs: [
      "I build Node.js + Express backends, ship Next.js apps, and work deeply with MongoDB.",
      "I practice web security (OWASP) and build ML pipelines end-to-end (cleaning → training → deployment).",
    ],
    ctas: [
      { label: "Explore my work", href: "#projects" },
      { label: "Let’s collaborate", href: "#contact" },
    ],
  },
  contactCard: {
    title: "Contact info",
    items: [
      { label: "Location", value: "Surat, Gujarat" },
      { label: "Email", value: "nevilvataliya@gmail.com" },
      { label: "Phone", value: "+91 96244 96417" },
      { label: "Website", value: "nevil.codes" },
    ],
  },
  experience: {
    title: "Experience",
    subtitle: "Leadership and contributions that shaped how I build.",
    items: [],
  },
  projectsSection: {
    title: "Projects Showcase",
    subtitle: "Admin-added projects appear here automatically. Add images/links for a richer grid.",
  },
  techSection: {
    title: "Stack",
    subtitle: "Technologies and tools I use across domains.",
    quickFacts: {
      title: "Quick facts",
      items: [
        { label: "Focus", value: "Backend systems, security, ML" },
        { label: "Deploy", value: "Vercel, Render" },
        { label: "TryHackMe", value: "Top 7%" },
      ],
    },
  },
  achievements: {
    title: "About",
    subtitle: "Milestones that reflect consistency, security practice, and shipping real systems.",
    items: [
      {
        id: "thm-top7",
        title: "TryHackMe — Top 7% globally",
        year: "2025",
        category: "milestone",
        description: "Client-side + server-side exploitation practice and Linux hardening.",
      },
      {
        id: "loan-68-recall",
        title: "Loan Default Predictor — 68% recall",
        year: "2025",
        category: "project",
        description: "End-to-end ML pipeline on LendingClub data, deployed with Flask.",
      },
      {
        id: "jee-9895",
        title: "JEE Main 98.95 percentile",
        year: "2023",
        category: "milestone",
        description: "Strong problem-solving foundation.",
      },
    ],
  },

  thoughts: {
    title: "Thought Generator",
    subtitle: "Deep thoughts to keep building momentum.",
    shareAttribution: "shared via Nevil's portfolio",
    items: [
      { id: "t1", text: "If it’s secure by default, it scales in trust." },
      { id: "t2", text: "A strong backend feels invisible when it’s done right." },
      { id: "t3", text: "Security isn’t a feature; it’s a posture." },
      { id: "t4", text: "Consistency beats intensity—ship weekly, improve daily." },
      { id: "t5", text: "Readable code is a competitive advantage." },
      { id: "t6", text: "Design for failure; celebrate reliability." },
      { id: "t7", text: "Tradeoffs are the real language of engineering." },
      { id: "t8", text: "Don’t optimize before you can measure." },
    ],
  },
  aboutMe: {
    title: "What I’m optimizing for",
    subtitle: "How I think about building systems and growing as an engineer.",
    strengthsTitle: "What I’m good at",
    strengths: [
      "Backend engineering with clean APIs (Node.js/Express)",
      "MongoDB + deployment workflows (Vercel/Render/Docker)",
      "Security mindset (OWASP)",
    ],
    learningTitle: "Currently learning",
    learning: ["Trees/Graphs in DSA", "Sharper UI engineering in Next.js + Tailwind", "Deeper OpenCV + Python"],
  },
  contactSection: {
    title: "Contact",
    subtitle: "Reach out for collaboration, mentorship, or project work.",
    cardTitle: "Contact",
    primaryCta: { label: "Email me", href: "mailto:nevilvataliya@gmail.com" },
    secondaryCta: { label: "Website", href: "https://nevil.codes" },
    resumeTitle: "Resume",
    resumeBody: "Resume PDF available on request.",
    resumeCta: { label: "Request resume", href: "mailto:nevilvataliya@gmail.com?subject=Resume%20Request" },
  },
  footer: {
    rightText: "Type “nevil.help()” in console",
  },
  consoleHint: {
    enabled: true,
    consoleTitle: "n e v i l --help",
    commandsTitle: "Commands:",
    commands: ["- about: quick summary", "- links: social links", "- stack: current stack"],
    about: "CSE @ SVNIT • backend-first • security • ML",
    links: [
      { label: "github", href: "https://github.com/nevilvataliya" },
      { label: "linkedin", href: "https://linkedin.com/in/nevilvataliya" },
      { label: "email", href: "mailto:nevilvataliya@gmail.com" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "MongoDB"],
  },
};
