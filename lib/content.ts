/**
 * Portfolio copy.
 *
 * Two sources, and nothing beyond them:
 * - The static export that was the entire `gh-pages` branch.
 * - User-confirmed employment, plus the résumé slide for Karguvel Kalisekar
 *   (education, Innoart scope, skills, domains, industry labels).
 * Do not add other employers, promotion dates, client names, or metrics.
 */

export const site = {
  name: "Karguvel K",
  fullName: "Karguvel Kalisekar",
  givenName: "Karguvel",
  handle: "karguvel7",
  jobTitle: "Lead Software Engineer",
  employer: "Innoart Technologies (P) Ltd.",
  url: "https://karguvel7.github.io",
  email: "karguvel7@gmail.com",
  emailSubject: "Hello from your portfolio",
  location: "Chennai, India",
  availability: "Open to remote",
  rolesNote: "Open to AI and platform roles",
  github: "https://github.com/karguvel7",
  linkedin: "https://www.linkedin.com/in/karguvel-k-967975b8",
  profileImage: "/karguvel-k.jpg",
  profileImageAlt:
    "Portrait of Karguvel K, Lead Software Engineer and AI engineer",
  headline:
    "AI Engineer building production-grade AI systems, cloud platforms and scalable enterprise applications.",
  summary:
    "Agentic systems, enterprise copilots, and the cloud infrastructure and observability around them — from LLM orchestration to production operations.",
  description:
    "Lead Software Engineer at Innoart Technologies. AI Engineer building production-grade AI systems, cloud platforms and scalable enterprise applications.",
} as const;

export const roles = [
  "AI Engineer",
  "DevOps Engineer",
  "Full-Stack Engineer",
  "Software Architect",
] as const;

export const arc = [
  {
    step: "AI",
    detail: "LLM applications, agents, orchestration",
  },
  {
    step: "Backend",
    detail: "Node.js, TypeScript, Python",
  },
  {
    step: "Cloud",
    detail: "AWS and Azure",
  },
  {
    step: "DevOps",
    detail: "Docker, CI/CD, Kubernetes",
  },
  {
    step: "Frontend",
    detail: "Angular and React",
  },
] as const;

export const primaryNav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#workflow", label: "Workflow" },
  { href: "#contact", label: "Contact" },
] as const;

export const mobileNav = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#expertise", label: "Expertise" },
  { href: "#systems", label: "AI systems" },
  { href: "#platform", label: "Cloud and DevOps" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#workflow", label: "Workflow" },
  { href: "#github", label: "GitHub" },
  { href: "#contact", label: "Contact" },
] as const;

export const about = {
  lede: "Lead Software Engineer at Innoart Technologies (P) Ltd. since February 2017, building production AI applications, agentic systems, cloud infrastructure, and enterprise software.",
  paragraphs: [
    "I design and ship systems where AI, cloud, and software engineering meet — multi-agent platforms, enterprise copilots, and the DevOps pipelines that keep them reliable in production.",
    "Since February 2017 I have worked continuously at Innoart Technologies (P) Ltd. The current title is Lead Software Engineer. That tenure is the enterprise foundation: digital transformation platforms, micro front-ends, microservices, and delivery across several industries. The current practice extends it into production AI systems, cloud platforms, and DevOps.",
    "The work spans agent orchestration, streaming LLM experiences, microservices on AWS and Azure, and observability that teams can act on.",
    "I use AI-native developer workflows — Cursor, Claude, and Spec Kit — to move from specification to implementation with clarity and speed.",
  ],
  facts: [
    { label: "Role", value: "Lead Software Engineer" },
    { label: "Employer", value: "Innoart Technologies (P) Ltd." },
    { label: "Tenure", value: "February 2017 — present · 9+ years" },
    { label: "Based", value: "Chennai, India · open to remote" },
  ],
  applicationStack:
    "Scalable applications with Node.js, Angular, React, AWS, Azure, Docker, CI/CD, microservices, and modern LLM and agent frameworks.",
} as const;

export const experience = {
  title: "Lead Software Engineer",
  employer: "Innoart Technologies (P) Ltd.",
  dates: "February 2017 — Present",
  tenure: "9+ years",
  continuity: "Still employed there. One continuous tenure since February 2017.",
  lede: "Lead Software Engineer at Innoart Technologies (P) Ltd. The enterprise record below is from that tenure. The AI, cloud, and DevOps work elsewhere on this page is the current shape of the same practice.",
  scope: [
    "Front-end and back-end development of an industry-agnostic Digital Transformation Platform.",
    "Incident Management System and a Social Media Hub for a top educational organization.",
    "Micro front-ends and microservices, including flexible web parts used to improve the user experience.",
    "REST APIs documented with OpenAPI, with OAuth 2.0 for authentication and authorization.",
    "Performance debugging, Agile delivery, and architecture review of newer technical options.",
    "3D rendering with Three.js.",
    "Work both with a team and independently, against product design requirements and scheduled deadlines.",
  ],
  domains: [
    "Digital Transformation Platform",
    "Human Capital Management",
    "Digital Payments",
    "Marketplace application",
  ],
  industries: [
    "Semiconductors & Wireless Tech",
    "EduTech",
    "Manufacturing",
    "Healthcare",
    "E-Commerce",
    "FinTech",
    "Real Estate",
  ],
  education: [
    {
      credential: "Master of Computer Application",
      school: "Anna University",
    },
    {
      credential: "BSc Computer Science",
      school: "Alagappa University",
    },
  ],
} as const;

export const expertise = [
  {
    title: "AI / Agentic AI / LLM applications",
    detail:
      "LLMs, agentic systems, tool calling, streaming, RAG, and AI workflow automation.",
  },
  {
    title: "AWS and Azure",
    detail: "Cloud platforms the services and copilots are deployed on.",
  },
  {
    title: "DevOps, CI/CD, and infrastructure",
    detail: "Docker, Kubernetes, CI/CD, and Git across the delivery path.",
  },
  {
    title: "Microservices and distributed systems",
    detail:
      "Service boundaries, micro front-ends, REST APIs, and event-driven systems.",
  },
  {
    title: "Node.js and TypeScript",
    detail: "Backend services, with Python as part of the same stack.",
  },
  {
    title: "Angular and React",
    detail: "Angular 1–14 and React, including agentic UI and Three.js where the product needs it.",
  },
  {
    title: "Docker and Kubernetes",
    detail: "Docker and Kubernetes, alongside CI/CD and Git.",
  },
  {
    title: "Observability and monitoring",
    detail: "Logs, metrics, alerts, and audit events operators can act on.",
  },
  {
    title: "Data stores",
    detail:
      "MongoDB, PostgreSQL, Neo4j, MySQL, and ClickHouse. Sharded MongoDB on the observability platform.",
  },
  {
    title: "Enterprise application architecture",
    detail:
      "The structure that holds copilots, services, data, and operations together.",
  },
] as const;

export const systemShape = [
  "Frontend",
  "API",
  "AI / agent layer",
  "Services",
  "Database",
  "Cloud",
  "Observability",
] as const;

export const aiCapabilities = [
  {
    name: "LLMs",
    detail: "Model integrations inside application workflows.",
  },
  {
    name: "Agentic AI",
    detail: "Multi-agent orchestration and AI agents that carry a workflow.",
  },
  {
    name: "Tool calling",
    detail: "LLM integrations with tool and function calling.",
  },
  {
    name: "Streaming",
    detail: "Streaming responses and streaming APIs.",
  },
  {
    name: "RAG",
    detail: "Part of the AI stack, alongside agents and tool calling.",
  },
  {
    name: "Workflow automation",
    detail: "Multi-step AI workflows, including enterprise copilots.",
  },
  {
    name: "Voice and agentic UI",
    detail: "Voice transcription and AG-UI patterns on the healthcare copilot.",
  },
] as const;

export const aiInPractice = [
  {
    href: "#multi-agent-orchestration",
    title: "Multi-Agent AI Orchestration Platform",
    detail: "Orchestration, tool calling, streaming, workflow automation.",
  },
  {
    href: "#healthcare-ai-copilot",
    title: "Healthcare AI Copilot",
    detail: "React, AG-UI, streaming chat, voice transcription.",
  },
  {
    href: "#trade-finance-ai-copilot",
    title: "Trade Finance AI Copilot",
    detail: "AI-assisted enterprise workflow automation.",
  },
] as const;

export const platformAreas = [
  {
    title: "Cloud",
    items: ["AWS", "Azure"],
    note: "Azure hosts the trade-finance copilot, with observability wired in.",
  },
  {
    title: "Delivery",
    items: ["Docker", "Kubernetes", "CI/CD", "Git"],
    note: "Containers and pipelines. The observability platform specifically runs on Docker-based infrastructure.",
  },
  {
    title: "Distributed systems",
    items: ["Microservices", "REST APIs", "Event-driven systems", "Streaming APIs"],
    note: "Node.js and TypeScript services, with Angular and React on the client side.",
  },
  {
    title: "Operability",
    items: ["Logs", "Metrics", "Alerts", "Audit events"],
    note: "Service and entity tracking, backed by sharded MongoDB where the observability platform needs it.",
  },
] as const;

export type CaseStudy = {
  id: string;
  title: string;
  summary: string;
  pipeline: readonly string[];
  tags: readonly string[];
  problem: string;
  architecture: string;
  technologies: string;
  contribution: string;
  challenges: string;
  solution: string;
  outcome: string;
};

export const projects: readonly CaseStudy[] = [
  {
    id: "multi-agent-orchestration",
    title: "Multi-Agent AI Orchestration Platform",
    summary:
      "Production multi-agent system with orchestration, tool calling, and streaming responses for complex AI workflows.",
    pipeline: [
      "Agent orchestration",
      "LLM tool calling",
      "Streaming responses",
      "Workflow automation",
    ],
    tags: ["Agentic AI", "LLMs", "Orchestration", "Streaming"],
    problem:
      "Complex AI workflows need coordinated agents, tools, and streamed output in one system.",
    architecture:
      "A multi-agent architecture. LLM integrations expose tool and function calling, responses stream, and workflow automation connects the steps.",
    technologies: "Agentic AI, LLMs, orchestration, and streaming.",
    contribution:
      "Architected and delivered the production system: multi-agent orchestration, LLM tool calling, streaming responses, and AI workflow automation.",
    challenges:
      "Keeping orchestration, tool calling, and streaming responses coherent so the workflow behaves as one system.",
    solution:
      "A production multi-agent platform that integrates LLMs with tool and function calling and streams responses through automated AI workflows.",
    outcome:
      "A production system for complex AI workflows: orchestration, tool calling, and streaming in one platform.",
  },
  {
    id: "healthcare-ai-copilot",
    title: "Healthcare AI Copilot",
    summary:
      "Conversational healthcare assistant with agentic UI patterns and voice-enabled interaction.",
    pipeline: [
      "React / AG-UI",
      "Streaming chat",
      "Voice transcription",
      "Backend AI",
    ],
    tags: ["React", "AG-UI", "Voice", "Healthcare AI"],
    problem:
      "The assistant has to hold a conversation: streamed replies, voice input, and an agentic interface.",
    architecture:
      "React frontend using AG-UI / agentic UI patterns, streaming chat, voice transcription, and a backend AI integration behind them.",
    technologies: "React, AG-UI, voice transcription, and backend AI integration.",
    contribution:
      "Architected and delivered the conversational interface and its AI integration — agentic UI, streaming chat, and voice transcription.",
    challenges:
      "Combining streaming chat and voice transcription in an agentic UI so the interaction stays one conversation.",
    solution:
      "A React healthcare copilot with AG-UI patterns, streaming chat, voice transcription, and backend AI integration.",
    outcome:
      "A voice-capable conversational healthcare assistant with agentic UI and streaming chat.",
  },
  {
    id: "trade-finance-ai-copilot",
    title: "Trade Finance AI Copilot",
    summary:
      "Enterprise trade-finance workflows augmented with AI across Angular, Node.js, and Azure.",
    pipeline: [
      "Angular",
      "Node.js microservices",
      "AI workflows",
      "Azure",
      "Observability",
    ],
    tags: ["Angular", "Node.js", "Azure", "Microservices"],
    problem:
      "Trade-finance work needs AI assistance inside an enterprise application: a client, services, a cloud deployment, and a way to operate it.",
    architecture:
      "Angular on the client, Node.js microservices for the domain, AI-assisted workflow automation, Azure for deployment, and observability on the running system.",
    technologies: "Angular, Node.js, Azure, microservices, and observability.",
    contribution:
      "Architected and delivered the AI-assisted workflows across the Angular client, Node.js microservices, Azure deployment, and observability.",
    challenges:
      "Placing AI assistance inside microservice boundaries and keeping the Azure deployment observable.",
    solution:
      "AI-assisted trade-finance workflows spanning Angular, Node.js microservices, Azure, and observability.",
    outcome:
      "Enterprise trade-finance workflows augmented with AI, deployed on Azure, and operated with observability.",
  },
  {
    id: "enterprise-observability",
    title: "Enterprise Observability Platform",
    summary:
      "Distributed monitoring platform with sharded data stores and Docker-based infrastructure.",
    pipeline: [
      "Services and entities",
      "Audit events",
      "MongoDB sharding",
      "Docker",
      "Logs, metrics, alerts",
    ],
    tags: ["Observability", "MongoDB", "Docker", "Audit"],
    problem:
      "Distributed systems need service and entity tracking, an audit trail, and signals teams can act on — logs, metrics, and alerts.",
    architecture:
      "Service and entity tracking with audit events. MongoDB sharding for the store. Docker for the infrastructure. Logs, metrics, and alerts as the operator surface.",
    technologies:
      "Observability, MongoDB sharding, Docker, audit events, logs, metrics, and alerts.",
    contribution:
      "Architected and delivered the monitoring platform: tracking, audit events, sharded MongoDB, and Docker-based logs, metrics, and alerts.",
    challenges:
      "Audit and telemetry across services, stored on sharded MongoDB and run on Docker infrastructure.",
    solution:
      "A monitoring platform that tracks services and entities, records audit events, and surfaces logs, metrics, and alerts.",
    outcome:
      "Operational visibility for a distributed system: service and entity tracking, audit events, and alerts.",
  },
  {
    id: "ai-developer-productivity",
    title: "AI Developer Productivity",
    summary:
      "Spec-driven, AI-assisted delivery — from specifications to implementation with Cursor, Claude, and Spec Kit.",
    pipeline: ["Specification", "Spec Kit", "Cursor and Claude", "Implementation"],
    tags: ["Cursor", "Claude", "Spec Kit", "DX"],
    problem:
      "Implementation drifts when specifications stay informal. Delivery needs a repeatable path from spec to code.",
    architecture:
      "A daily workflow of Cursor and Claude, Spec Kit for structured specs, and automated specification-to-implementation workflows.",
    technologies: "Cursor, Claude, Spec Kit, and spec-driven delivery.",
    contribution:
      "The engineering practice itself: structured specs and AI-assisted implementation in the ship cycle.",
    challenges:
      "Moving from a specification to implementation without losing the structure of the spec.",
    solution:
      "Automated spec-to-implementation pipelines using Cursor, Claude, and Spec Kit.",
    outcome:
      "Faster, clearer delivery for product teams, through a repeatable spec-to-implementation workflow.",
  },
];

export const stack = [
  {
    area: "AI",
    technologies: "LLMs, Agentic AI, RAG, AI Agents, Tool Calling, Streaming",
  },
  {
    area: "Backend",
    technologies: "Node.js, TypeScript, Python, MEAN",
  },
  {
    area: "Frontend",
    technologies: "Angular 1–14, React, Three.js",
  },
  {
    area: "Cloud",
    technologies: "Azure, AWS",
  },
  {
    area: "DevOps",
    technologies: "Docker, CI/CD, Git, Kubernetes",
  },
  {
    area: "Databases",
    technologies: "MongoDB, PostgreSQL, Neo4j, MySQL, ClickHouse",
  },
  {
    area: "Architecture",
    technologies: "Microservices, micro front-ends, REST APIs, event-driven systems",
  },
  {
    area: "Observability",
    technologies: "Logs, Metrics, Alerts, Audit Events",
  },
  {
    area: "AI dev tools",
    technologies: "Cursor, Claude, Spec Kit",
  },
  {
    area: "Mobile",
    technologies: "Flutter, Android, Xamarin Forms, Cordova",
  },
  {
    area: "APIs",
    technologies: "REST, OpenAPI, OAuth 2.0, streaming APIs, AI integrations",
  },
] as const;

export const workflowSteps = [
  {
    title: "Specify",
    detail: "Spec Kit holds the work as a structured specification before implementation starts.",
  },
  {
    title: "Implement with agents",
    detail: "Cursor and Claude are part of the daily development loop, against that spec.",
  },
  {
    title: "Automate the handoff",
    detail:
      "Specification-to-implementation workflows keep the path from spec to code repeatable.",
  },
  {
    title: "Ship with the same clarity",
    detail: "The point of the loop is faster, clearer delivery for product teams.",
  },
] as const;

export const caseStudyFields = [
  { key: "problem", label: "Problem" },
  { key: "architecture", label: "Architecture" },
  { key: "technologies", label: "Technologies" },
  { key: "contribution", label: "Contribution" },
  { key: "challenges", label: "Engineering challenge" },
  { key: "solution", label: "Solution" },
  { key: "outcome", label: "Outcome" },
] as const;

export function mailtoHref(): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`;
}
