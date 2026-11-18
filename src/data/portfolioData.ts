export interface ProjectModule {
  title: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  featured: boolean;
  category: 'Enterprise ERP Development' | 'Java & Spring Boot' | 'AI & Web' | 'Enterprise & Cloud';
  isPrivate?: boolean;
  modules?: ProjectModule[];
  details: {
    problem: string;
    solution: string;
    features: string[];
    architecture: string;
    contribution: string;
  };
}

export interface SkillItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'AI';
  level: number; // 1-100
  description: string;
  color: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
  technologies: string[];
  domains: string[];
}

export interface EducationItem {
  degree: string;
  field: string;
  period: string;
  institution: string;
  status: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: 'AI' | 'Cloud & Security' | 'Enterprise Analytics' | 'Core Engineering';
  badgeColor: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: 'Fuzail Ahmed',
    initials: 'FA',
    title: 'Java Full Stack Developer | Enterprise ERP Developer',
    subtitles: [
      'Java Full Stack Developer',
      'Enterprise ERP Developer',
      'Full Stack Developer',
      'Spring Boot & Angular Engineer'
    ],
    tagline: 'BUILDING ENTERPRISE ERP & DIGITAL EXPERIENCES WITH JAVA, SPRING BOOT & ANGULAR.',
    shortBio:
      "I'm a Java Full Stack Developer and Enterprise ERP Developer with 1.5+ years of experience specializing in scalable business systems, robust backend architectures, and modern reactive user interfaces. Currently at Tech Solution (Dammam Branch, Saudi Arabia), I contribute to comprehensive enterprise ERP platforms across Supply Chain (SCM), Manufacturing, CRM, HRM, Inventory, and Construction Management (CMS) workflows. My technical focus bridges Java, Spring Boot microservices, REST APIs, Angular, React, TypeScript, MySQL, and Docker containerization.",
    stats: [
      { label: 'Years Experience', value: '1.5+' },
      { label: 'Core Technologies', value: '15+' },
      { label: 'Enterprise ERP Modules', value: '5+' },
      { label: 'Learning & Innovation', value: '∞' },
    ],
    location: 'Chennai, India',
    languages: ['English', 'Tamil', 'Urdu', 'Hindi'],
    email: 'fuzailahmed2702@gmail.com',
    phone: '+91 9840843264',
    github: 'https://github.com/FUZAIL27',
    linkedin: 'https://linkedin.com/in/fuzail-ahmed27',
    portfolio: 'https://animation-portfolio-fuzailahmedh-8355s-projects.vercel.app/',
    codeSnippet: `const developer = {
  name: "Fuzail Ahmed",
  role: "Java Full Stack Developer | Enterprise ERP Developer",
  company: "Tech Solution – Dammam Branch",
  location: "Chennai, India",
  stack: [
    "Java", "Spring Boot", "Microservices",
    "Angular", "React", "TypeScript",
    "MySQL", "PostgreSQL", "REST APIs",
    "PrimeNG", "Docker", "Git"
  ],
  modules: [
    "SCM (MRF, BOM, Work Orders)",
    "CRM (Customer & Leads)",
    "HRM (Attendance, Leaves & Labor)",
    "Inventory (Stock Validation & Warehouses)",
    "CMS (Construction BOQ & WBS)"
  ],
  status: "Engineering mission-critical enterprise systems"
};`,
  },

  skills: [
    // Frontend
    { name: 'Angular', category: 'Frontend', level: 90, description: 'Enterprise modules, TypeScript services, RxJS, PrimeNG components & reactive forms', color: '#ef4444' },
    { name: 'React', category: 'Frontend', level: 92, description: 'Modern component architectures, hooks, custom state stores & responsive SPAs', color: '#06b6d4' },
    { name: 'TypeScript', category: 'Frontend', level: 92, description: 'Strict typing, interfaces, generics & robust enterprise architectural patterns', color: '#3b82f6' },
    { name: 'JavaScript', category: 'Frontend', level: 94, description: 'ES6+, async/await, closures, event loop & DOM APIs', color: '#eab308' },
    { name: 'PrimeNG', category: 'Frontend', level: 88, description: 'Enterprise UI component suite, data tables, dialogs, and responsive dashboards for Angular', color: '#f59e0b' },
    { name: 'HTML5', category: 'Frontend', level: 95, description: 'Semantic structure, accessibility (a11y) & modern web standards', color: '#f97316' },
    { name: 'CSS3 / Tailwind', category: 'Frontend', level: 92, description: 'Glassmorphism, flex/grid layouts, micro-interactions & utility design systems', color: '#38bdf8' },
    { name: 'Bootstrap', category: 'Frontend', level: 90, description: 'Rapid responsive grid scaffolding, accessible UI components & mobile-first layouts', color: '#8b5cf6' },

    // Backend
    { name: 'Java', category: 'Backend', level: 94, description: 'Core OOP, multi-threading, Collections, Streams API & JVM fundamentals', color: '#f59e0b' },
    { name: 'Spring Boot', category: 'Backend', level: 92, description: 'REST controllers, Spring Data JPA/Hibernate, Spring Security & dependency injection', color: '#10b981' },
    { name: 'Microservices', category: 'Backend', level: 88, description: 'Modular service boundaries, REST contracts, distributed transactions & system resilience', color: '#06b6d4' },
    { name: 'REST APIs', category: 'Backend', level: 95, description: 'Clean resource modeling, HTTP status codes, JSON validation & API contract testing', color: '#3b82f6' },
    { name: 'Node.js', category: 'Backend', level: 88, description: 'Event-driven asynchronous runtimes, worker threads & REST microservices', color: '#22c55e' },
    { name: 'Express.js', category: 'Backend', level: 88, description: 'Middleware pipelines, routing, authentication & RESTful endpoints', color: '#94a3b8' },
    { name: 'JDBC', category: 'Backend', level: 86, description: 'Direct database connectivity, connection pooling & prepared statements', color: '#eab308' },

    // Database
    { name: 'MySQL', category: 'Database', level: 92, description: 'Relational data modeling, foreign keys, stored procedures, indexing & query optimization', color: '#0284c7' },
    { name: 'PostgreSQL', category: 'Database', level: 88, description: 'ACID transactions, relational schemas, indexing & complex joins', color: '#3b82f6' },
    { name: 'MongoDB', category: 'Database', level: 88, description: 'Document schemas, aggregation pipelines & high-throughput NoSQL', color: '#10b981' },

    // Tools
    { name: 'Git', category: 'Tools', level: 94, description: 'Version control branching, interactive rebasing, merge conflict resolution & hygiene', color: '#f97316' },
    { name: 'GitHub', category: 'Tools', level: 92, description: 'Collaborative code reviews, pull requests, actions & repository management', color: '#f1f5f9' },
    { name: 'Docker', category: 'Tools', level: 84, description: 'Containerization, Dockerfile optimization & reproducible multi-stage environments', color: '#0ea5e9' },
    { name: 'Postman', category: 'Tools', level: 92, description: 'API contract testing, environment variables & automated mock suites', color: '#fb923c' },
    { name: 'VS Code', category: 'Tools', level: 95, description: 'Developer productivity ecosystem, debugging & workspace automation', color: '#3b82f6' },

    // AI
    { name: 'AI APIs', category: 'AI', level: 90, description: 'Anthropic Claude, OpenAI, Google Gemini API integration & streaming', color: '#a855f7' },
    { name: 'Generative AI', category: 'AI', level: 88, description: 'LLM orchestration, agentic reasoning & multimodal interfaces', color: '#ec4899' },
    { name: 'Prompt Engineering', category: 'AI', level: 92, description: 'Structured prompting, chain-of-thought, few-shot conditioning', color: '#06b6d4' },
    { name: 'AI-Powered Apps', category: 'AI', level: 90, description: 'Real-world intelligent products with vector context & automated synthesis', color: '#8b5cf6' },
  ] as SkillItem[],

  experience: [
    {
      role: 'Full Stack Developer',
      company: 'Tech Solution – Dammam Branch, Saudi Arabia',
      period: 'September 2025 – Present',
      location: 'Chennai, India',
      type: 'Full-time',
      domains: [
        'Enterprise ERP',
        'SCM (Supply Chain Management)',
        'BOM & Manufacturing Workflows',
        'CMS (Construction Management)',
        'CRM (Customer Relationship)',
        'HRM (Human Resources)',
        'Inventory & Stock Validation',
      ],
      highlights: [
        'Developing enterprise-grade ERP applications and modular business systems for Tech Solution (Dammam Branch, Saudi Arabia).',
        'Engineered Java and Spring Boot backend microservices, robust REST APIs, and transactional database logic ensuring high system reliability.',
        'Building dynamic, responsive Angular frontend modules using TypeScript and PrimeNG for complex data grids, interactive forms, and dashboards.',
        'Implementing SCM and Manufacturing ERP workflows, including Material Requisition Flows (MRF), Bill of Materials (BOM) management, Manufacturing Orders, and Work Orders.',
        'Engineering operation management tracking and real-time inventory integration with automated stock availability validation.',
        'Delivering CMS Construction Management features including BOQ (Bill of Quantities), WBS structures, project phases, and activity progress tracking.',
        'Executing database schema design, query optimization, and complex business logic in MySQL relational databases.',
        'Collaborating actively with cross-functional development teams, participating in architectural discussions, code reviews, and agile sprints.',
      ],
      technologies: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'MySQL', 'REST APIs', 'PrimeNG', 'Docker', 'Git'],
    },
    {
      role: 'Web Development Intern',
      company: 'CodSoft',
      period: 'July 2024 – August 2024',
      location: 'Remote',
      type: 'Internship',
      domains: [
        'Web Development',
        'Frontend Architecture',
        'Responsive Web Design',
        'UI/UX Prototyping',
      ],
      highlights: [
        'Engineered fully responsive web applications, interactive landing pages, and web utility interfaces using HTML5, CSS3, JavaScript, and Bootstrap.',
        'Developed intuitive, mobile-first layouts with smooth cross-browser compatibility and accessible component design.',
        'Managed version control workflows, feature branching, and milestone submissions using Git and GitHub.',
        'Collaborated on code optimization and performance audits to ensure rapid load times and fluid user navigation.',
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Git', 'GitHub'],
    },
  ] as ExperienceItem[],

  projects: [
    {
      id: 'ai-presentation-generator',
      number: '01',
      title: 'AI PRESENTATION GENERATOR',
      subtitle: 'Automated Slide Generation & PPT Export Platform',
      description:
        'AI-powered full-stack application that transforms simple prompts into structured, highly stylized presentation content with instant downloadable PPTX slides.',
      tech: ['MERN', 'Node.js', 'Express.js', 'MongoDB', 'AI APIs', 'PPTX Generation', 'React'],
      liveUrl: 'https://frontend-pink-omega-38.vercel.app/',
      githubUrl: 'https://github.com/FUZAIL27',
      image: '/src/assets/images/fuzail-hero.webp',
      featured: true,
      category: 'AI & Web',
      details: {
        problem:
          'Creating professional presentation decks typically requires hours of researching, structuring outlines, crafting slide copy, and configuring layouts manually.',
        solution:
          'Built an intelligent generative AI engine that accepts user topics, dynamically crafts multi-slide presentation outlines, generates tailored bullet points, and provides instant download of formatted PowerPoint (.pptx) files.',
        features: [
          'Generative slide topic brainstorming & outline synthesis',
          'Automated slide-by-slide content formatting with executive summaries',
          'Direct client-side and server-side PPTX file generation & download',
          'Custom presentation history and draft management stored in MongoDB',
          'Responsive React UI with real-time generation previews',
        ],
        architecture:
          'React frontend communicating with an Express/Node.js backend orchestrating streaming LLM completions, with MongoDB handling persistence and a specialized PPTX generation engine.',
        contribution:
          'Engineered the end-to-end full stack architecture, integrated AI APIs, optimized prompt structures for clean JSON slide schemas, and developed the PPT export handler.',
      },
    },
    {
      id: 'sentinel-audit-dashboard',
      number: '02',
      title: 'SENTINEL — ENTERPRISE SECURITY AUDIT DASHBOARD',
      subtitle: 'Enterprise Security Observability & Compliance Portal',
      description:
        'Mission-critical security audit dashboard delivering real-time visibility into enterprise events, vulnerability scores, audit trails, and compliance posture.',
      tech: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'TanStack Query', 'Zustand', 'Tailwind CSS'],
      liveUrl: 'https://audit-dashboard12.vercel.app/',
      githubUrl: 'https://github.com/FUZAIL27/audit-dashboard.git',
      image: '/src/assets/images/fuzail-hero.webp',
      featured: true,
      category: 'Enterprise & Cloud',
      details: {
        problem:
          'Enterprise security analysts struggle to monitor fragmented log streams across multiple systems without unified risk categorization and real-time alerts.',
        solution:
          'Developed Sentinel, a centralized security observability dashboard that ingests audit logs, calculates severity scores, and presents interactive time-series visualizations.',
        features: [
          'Real-time enterprise audit trail visualization and filtering',
          'Automated vulnerability risk score computation and incident categorizations',
          'TanStack Query asynchronous caching for fast page switches and zero-lag filter queries',
          'Zustand lightweight state management for cross-component alert controls',
          'Responsive, high-density dark UI tailored for SOC analysts',
        ],
        architecture:
          'Modular React + TypeScript frontend paired with an Express/Node.js API, leveraging MongoDB time-series indices for rapid audit record querying and TanStack Query client caching.',
        contribution:
          'Built full frontend dashboard architecture, designed the audit event filter models, integrated state stores, and styled the sleek glassmorphic analyst interface.',
      },
    },
    {
      id: 'docmind-ai',
      number: '03',
      title: 'DOC-AI',
      subtitle: 'Intelligent Document Understanding & Chat Platform',
      description:
        'AI-powered document intelligence experience allowing conversational queries, instant summarization, and key fact extraction from uploaded documents.',
      tech: ['React', 'Node.js', 'Express.js', 'AI APIs', 'Vector Context', 'Document Processing', 'Tailwind CSS'],
      liveUrl: 'https://doc-ai-flax.vercel.app/',
      githubUrl: 'https://github.com/FUZAIL27/Doc-Ai.git',
      image: '/src/assets/images/fuzail-about.jpg',
      featured: true,
      category: 'AI & Web',
      details: {
        problem:
          'Professionals spend excessive time reading through dense multi-page documentation, contracts, and reports to locate specific answers.',
        solution:
          'Engineered Doc-AI, an interactive conversational platform where users query documents in natural language to receive instant, verifiable answers with context highlights.',
        features: [
          'Multi-format document parsing and automated executive summary generation',
          'Context-aware conversational Q&A with citations',
          'Keyword entity extraction and structured data tables',
          'Streaming token response animation for snappy user feedback',
          'Secure client-side document inspection panel',
        ],
        architecture:
          'React frontend with streaming UI components, Node.js document chunking service, semantic embedding pipeline, and LLM synthesis API.',
        contribution:
          'Spearheaded the UI/UX design, streaming response handling, document upload workflow, and prompt conditioning for accurate factual answers.',
      },
    },
    {
      id: 'international-real-estate',
      number: '04',
      title: 'JAVA FULL STACK REAL ESTATE',
      subtitle: 'Enterprise Property Management & Multi-Currency Listing Platform',
      description:
        'Enterprise-grade real estate platform built on Java Spring Boot and modern frontend, powering property listings, agent transactions, and multi-currency property discovery.',
      tech: ['Java', 'Spring Boot', 'Hibernate/JPA', 'REST APIs', 'MySQL / PostgreSQL', 'React', 'JWT Security'],
      liveUrl: 'https://international-real-estate-full-mu.vercel.app/',
      githubUrl: 'https://github.com/FUZAIL27/International-real-estate-full.git',
      image: '/src/assets/images/fuzail-profile.jpg',
      featured: true,
      category: 'Java & Spring Boot',
      details: {
        problem:
          'International real estate marketplaces require strict transactional consistency, secure role-based access for agents/buyers, and scalable property search.',
        solution:
          'Built an enterprise full-stack system featuring Spring Boot backend services, relational database schemas with JPA/Hibernate, and dynamic property filter engines.',
        features: [
          'Comprehensive international property catalog with multi-attribute filtering',
          'Role-based access control (Admin, Agent, Buyer) with JWT token security',
          'Spring Data JPA transaction management for inquiries and bookings',
          'High-performance REST API endpoints with pagination and sorting',
          'Modern responsive UI with property image galleries and interactive maps',
        ],
        architecture:
          'Spring Boot REST micro-architecture with layered Controller-Service-Repository patterns, MySQL/PostgreSQL relational persistence, and secure token authentication.',
        contribution:
          'Engineered core Spring Boot entities, repositories, and REST controllers; implemented JWT authentication filters and connected with the frontend views.',
      },
    },
    {
      id: 'tech-solution-enterprise-erp',
      number: '05',
      title: 'TECH SOLUTION ENTERPRISE ERP SYSTEM',
      subtitle: 'Multi-Module Enterprise Resource Planning Platform',
      description:
        'Working on a comprehensive enterprise ERP platform involving multiple business modules. Contributing to frontend and backend development, REST API integration, business workflows, database operations and enterprise application functionality.',
      tech: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'MySQL', 'PrimeNG', 'REST APIs', 'Microservices', 'Docker'],
      liveUrl: '',
      githubUrl: '',
      image: '/src/assets/images/fuzail-hero.webp',
      featured: true,
      category: 'Enterprise ERP Development',
      isPrivate: true,
      modules: [
        {
          title: 'A. SCM – Supply Chain Management',
          items: [
            'Material Requisition Flow (MRF)',
            'Bill of Materials (BOM)',
            'Manufacturing Order Management',
            'Manufacturing Work Order Management',
            'Material Planning & Allocation',
            'Material Issue and Return',
            'Stock Availability Validation',
            'Manufacturing Operations Tracking',
            'Production Tracking & Progress',
            'Inventory Integration'
          ]
        },
        {
          title: 'B. CRM – Customer Relationship Management',
          items: [
            'Customer Master Management',
            'Lead Lifecycle Management',
            'Sales Activities & Follow-ups',
            'Customer Information Management',
            'Customer Workflow Integration'
          ]
        },
        {
          title: 'C. HRM – Human Resource Management',
          items: [
            'Employee Management & Master Records',
            'Employee Detailed Records',
            'Attendance Tracking & Management',
            'Leave Management & Approvals',
            'Employee Approval Workflows',
            'Payroll-related Integration',
            'Role and Team Hierarchy Management'
          ]
        },
        {
          title: 'D. Inventory Management',
          items: [
            'Product & Item Catalog Management',
            'Stock Level Management',
            'Warehouse Management & Locations',
            'Stock Availability Verification',
            'Material Receipt Flow',
            'Material Issue Operations',
            'Stock Transfers Between Warehouses',
            'Real-Time Inventory Tracking',
            'Manufacturing Stock Integration'
          ]
        },
        {
          title: 'E. CMS – Construction Management System',
          items: [
            'Construction Project Management',
            'Project Details & Specifications',
            'BOQ – Bill of Quantities',
            'WBS – Work Breakdown Structure',
            'Project Phases Management',
            'Trades and Sub-Trades',
            'Work Packages Formulation',
            'Activity Management & Milestones',
            'Project Progress Tracking',
            'Project Budget Management & Costs'
          ]
        }
      ],
      details: {
        problem:
          'Large-scale enterprise operations require unified coordination across supply chains, manufacturing orders, human resources, inventory stock reconciliation, and construction project budgeting without data silos or synchronization bottlenecks.',
        solution:
          'Developing and enhancing a unified, modular Enterprise ERP platform featuring centralized Spring Boot microservices, secure REST APIs, and responsive Angular frontend workflows, ensuring end-to-end transactional consistency and automated approval pipelines across multinational branches.',
        features: [
          'SCM & Manufacturing: Material Requisition Flow (MRF), multi-tier BOMs, Manufacturing Orders, and Work Orders with operation scheduling',
          'Inventory Control: Real-time stock availability verification, warehouse receipts/issues, stock transfers, and manufacturing integration',
          'CMS (Construction): Comprehensive Project Management, Bill of Quantities (BOQ), Work Breakdown Structure (WBS), phases, and budget tracking',
          'HRM & Approvals: Employee master data, attendance tracking, leave request & approval workflows, and role/team hierarchies',
          'CRM Workflows: Centralized customer profiles, lead tracking, and sales workflow integration',
          'Enterprise Security: Role-Based Access Control (RBAC), transactional ACID safety, and structured REST contracts',
        ],
        architecture:
          'Multi-tier enterprise architecture featuring Java Spring Boot backend microservices exposing RESTful endpoints, transactional MySQL relational persistence, and modular Angular/TypeScript frontend with PrimeNG enterprise UI components.',
        contribution:
          'Contributed to frontend Angular module development and Spring Boot REST API integration; engineered business logic for SCM MRF, BOM, and Work Orders; built stock availability validation routines and CMS BOQ workflows; collaborated with the team on database design and system stability.',
      },
    },
    {
      id: 'pulse-social-dashboard',
      number: '06',
      title: 'PULSE SOCIAL DASHBOARD',
      subtitle: 'Social Analytics, Engagement Tracking & Audience Intelligence',
      description:
        'Interactive social analytics dashboard tracking real-time audience engagement, campaign ROI metrics, and multi-channel performance insights.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Zustand', 'REST APIs'],
      liveUrl: 'https://pulse-social-dashboard-chi.vercel.app/',
      githubUrl: 'https://github.com/FUZAIL27/pulse--Social-Dashboard.git',
      image: '/src/assets/images/fuzail-profile.jpg',
      featured: true,
      category: 'Enterprise & Cloud',
      details: {
        problem:
          'Marketing and growth teams need unified visibility into social metrics, impressions, and campaign engagement across disparate platforms.',
        solution:
          'Engineered Pulse Social Dashboard, providing consolidated metrics aggregation, interactive trend graphs, and audience sentiment indicators in a sleek dark UI.',
        features: [
          'Real-time multi-platform engagement and impression analytics',
          'Audience growth trajectory visualizations and conversion metrics',
          'Interactive date range filtering and performance benchmarks',
          'Modern glassmorphic dashboard architecture with responsive layouts',
        ],
        architecture:
          'Modular React + TypeScript frontend with optimized chart rendering, lightweight state management, and reusable analytical cards.',
        contribution:
          'Designed and built the full dashboard user experience, chart integration, metric calculations, and responsive UI layout.',
      },
    },
    {
      id: 'adventure-tourism',
      number: '07',
      title: 'ADVENTURE TOURISM',
      subtitle: 'Dynamic Travel Booking & Destination Discovery Portal',
      description:
        'Comprehensive travel and adventure booking web application featuring curated adventure itineraries, dynamic package discovery, and seamless user booking flows.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Bootstrap'],
      liveUrl: 'https://adventure-tourism2.vercel.app/',
      githubUrl: 'https://github.com/FUZAIL27/Adventure_Tourism2.git',
      image: '/src/assets/images/fuzail-about.jpg',
      featured: true,
      category: 'AI & Web',
      details: {
        problem:
          'Adventure travelers need an intuitive, visually captivating portal to explore complex itineraries, compare destinations, and complete reservations effortlessly.',
        solution:
          'Built a responsive, content-rich adventure portal featuring dynamic package catalogs, filterable itineraries, interactive photo galleries, and booking workflows.',
        features: [
          'Curated adventure package catalog with rich destination highlights',
          'Interactive itinerary breakdown with difficulty levels and gear guides',
          'Seamless reservation and customer inquiry forms',
          'Fully responsive cross-device layout with smooth transitions',
        ],
        architecture:
          'Clean modern web architecture utilizing semantic HTML5, modular CSS3 styling, and vanilla JavaScript event handling for optimal load speed and accessibility.',
        contribution:
          'Engineered the complete web portal frontend, designed responsive layouts, implemented dynamic itinerary filters, and verified cross-browser compatibility.',
      },
    },
  ] as ProjectItem[],

  aiPipeline: {
    title: 'THE AI INTELLIGENCE PIPELINE',
    subtitle: 'From Raw Intent to Enterprise-Ready Digital Results',
    nodes: [
      { id: 'user', label: 'USER', desc: 'Human intent, domain constraints & natural language input', icon: 'User' },
      { id: 'prompt', label: 'PROMPT', desc: 'Chain-of-thought conditioning & structured schema guidance', icon: 'Terminal' },
      { id: 'ai', label: 'AI CORE', desc: 'State-of-the-art LLMs (Claude, Gemini, GPT) reasoning engine', icon: 'Cpu' },
      { id: 'data', label: 'DATA', desc: 'Vector embeddings, enterprise docs & relational context', icon: 'Database' },
      { id: 'application', label: 'APPLICATION', desc: 'Java Spring Boot, Angular, React & Node execution layers', icon: 'Layers' },
      { id: 'result', label: 'RESULT', desc: 'Synthesized documents, presentations, insights & enterprise workflows', icon: 'Zap' },
    ],
  },

  education: [
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      field: 'Computer Science & Software Engineering',
      period: '2022 – 2025',
      institution: 'University of Madras — Chennai, India',
      status: 'Graduated',
      description: 'Comprehensive study of computer architecture, data structures & algorithms, OOP in Java, relational database systems, web development, and software engineering methodologies.',
    },
    {
      degree: 'Online Master of Computer Applications (MCA)',
      field: 'Advanced Computer Applications & Enterprise Systems',
      period: '2025 – 2027',
      institution: 'Master Degree Program',
      status: 'Currently Pursuing',
      description: 'Advanced curriculum focusing on distributed systems, enterprise Java architectures, cloud scalability, relational databases, and enterprise software engineering.',
    },
  ] as EducationItem[],

  certifications: [
    {
      id: 'aws-prompt',
      title: 'Foundations of Prompt Engineering',
      issuer: 'AWS',
      category: 'AI',
      badgeColor: '#f59e0b',
    },
    {
      id: 'claude-101',
      title: 'Claude 101 Certification',
      issuer: 'Anthropic',
      category: 'AI',
      badgeColor: '#8b5cf6',
    },
    {
      id: 'm365-sec',
      title: 'Microsoft 365 Security Foundations',
      issuer: 'Microsoft',
      category: 'Cloud & Security',
      badgeColor: '#0ea5e9',
    },
    {
      id: 'm365-core',
      title: 'Microsoft 365 Core Services and Admin Controls',
      issuer: 'Microsoft',
      category: 'Cloud & Security',
      badgeColor: '#06b6d4',
    },
    {
      id: 'deloitte-data',
      title: 'Deloitte Data Analytics Job Simulation',
      issuer: 'Forage',
      category: 'Enterprise Analytics',
      badgeColor: '#10b981',
    },
    {
      id: 'tata-genai',
      title: 'Tata GenAI Powered Data Analytics Job Simulation',
      issuer: 'Forage',
      category: 'Enterprise Analytics',
      badgeColor: '#3b82f6',
    },
    {
      id: 'java-prog',
      title: 'Java Programming Certification',
      issuer: 'Verified Certification',
      category: 'Core Engineering',
      badgeColor: '#f97316',
    },
    {
      id: 'mysql-cert',
      title: 'MySQL Relational Database Management',
      issuer: 'Verified Certification',
      category: 'Core Engineering',
      badgeColor: '#0284c7',
    },
  ] as CertificationItem[],
};
