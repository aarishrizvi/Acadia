import { Academy, Course, Lesson, Review } from '../types';

export const INITIAL_ACADEMIES: Academy[] = [
  {
    id: 'academy-1',
    name: 'Hyperion Code Labs',
    tagline: 'Architecting Modern Full-Stack & Distributed Systems',
    description: 'A premier software engineering guild dedicated to deep computer science fundamentals, scalable web architectures, microservices, and reactive user interfaces.',
    category: 'Software Engineering',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80',
    website: 'https://hyperion-code.dev',
    instructorId: 'arish-instructor',
    instructorName: 'Arish Rizvi',
    instructorEmail: 'arishrizvi_b-1636@kmclu.ac.in',
    featured: true,
    courseCount: 2,
    studentCount: 420,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'academy-2',
    name: 'Vanguard Design Studio',
    tagline: 'Human-Centric Interface Design & Design Systems',
    description: 'Elevating digital product design through comprehensive visual ergonomics, design tokens, responsive layout frameworks, and seamless design-to-code pipelines.',
    category: 'Design & UI/UX',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&q=80',
    website: 'https://vanguard-studio.design',
    instructorId: 'elena-instructor',
    instructorName: 'Elena Rostova',
    instructorEmail: 'elena@vanguard.design',
    featured: true,
    courseCount: 1,
    studentCount: 285,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'academy-3',
    name: 'Aether AI Research Guild',
    tagline: 'Applied LLMs, Agentic Architectures, & Neural Networks',
    description: 'Cutting-edge engineering for autonomous agents, retrieval augmented generation (RAG), fine-tuning transformers, and production-scale AI pipelines.',
    category: 'Artificial Intelligence',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&q=80',
    website: 'https://aether-ai.org',
    instructorId: 'marcus-instructor',
    instructorName: 'Dr. Marcus Chen',
    instructorEmail: 'marcus@aether-ai.org',
    featured: true,
    courseCount: 1,
    studentCount: 650,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'academy-4',
    name: 'Apex Cloud & DevOps Institute',
    tagline: 'Kubernetes, Zero-Trust Security, & Cloud Infrastructure',
    description: 'Production-tested patterns for high-availability cloud deployments, infrastructure as code, automated continuous delivery, and observability.',
    category: 'Cloud & DevOps',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    logoImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&q=80',
    website: 'https://apex-devops.io',
    instructorId: 'sarah-instructor',
    instructorName: 'Sarah Jenkins',
    instructorEmail: 'sarah@apex-devops.io',
    featured: false,
    courseCount: 1,
    studentCount: 190,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    academyId: 'academy-1',
    academyName: 'Hyperion Code Labs',
    instructorId: 'arish-instructor',
    instructorName: 'Arish Rizvi',
    title: 'Full-Stack TypeScript & Scalable System Architecture',
    slug: 'full-stack-typescript-scalable-system-architecture',
    subtitle: 'Master enterprise TypeScript, RESTful/GraphQL micro-services, reactive state management, and production cloud patterns.',
    description: 'Take your software engineering skills to senior and lead levels. In this comprehensive course, you will build and deploy an enterprise-scale application with type-safe contracts, optimal caching strategies, automated integration testing, and clean modular boundaries.',
    category: 'Software Engineering',
    level: 'Intermediate',
    estimatedHours: 18,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=80',
    learningObjectives: [
      'Architect robust modular applications with strict TypeScript typing',
      'Implement real-time persistence and connection pooling',
      'Design RESTful API boundaries with defensive schema validation',
      'Optimize frontend rendering with code splitting and memoization',
      'Secure applications with granular Role-Based Access Control (RBAC)'
    ],
    requirements: [
      'Familiarity with basic JavaScript and ES6 syntax',
      'Fundamental understanding of web requests and component state',
      'A computer with Node.js 18+ installed'
    ],
    published: true,
    featured: true,
    rating: 4.9,
    reviewCount: 48,
    enrolledCount: 312,
    createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-2',
    academyId: 'academy-2',
    academyName: 'Vanguard Design Studio',
    instructorId: 'elena-instructor',
    instructorName: 'Elena Rostova',
    title: 'Design Systems & Advanced UI Micro-Interactions',
    slug: 'design-systems-advanced-ui-micro-interactions',
    subtitle: 'From Figma tokens to animated code: create cohesive, accessible, and delightful digital user interfaces.',
    description: 'Learn how elite design teams build resilient multi-brand design systems. We break down token naming taxonomies, fluid typography scales, spring-physics micro-interactions, and keyboard accessibility patterns.',
    category: 'Design & UI/UX',
    level: 'Intermediate',
    estimatedHours: 14,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&q=80',
    learningObjectives: [
      'Structure atomic design tokens across color, spacing, and typography',
      'Implement physics-based motion and reactive hover/press animations',
      'Build WCAG 2.1 AA compliant keyboard navigable components',
      'Translate design tokens into Tailwind CSS and CSS custom properties'
    ],
    requirements: [
      'Basic knowledge of UI design principles',
      'Introductory familiarity with HTML and CSS styling'
    ],
    published: true,
    featured: true,
    rating: 4.8,
    reviewCount: 34,
    enrolledCount: 220,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-3',
    academyId: 'academy-3',
    academyName: 'Aether AI Research Guild',
    instructorId: 'marcus-instructor',
    instructorName: 'Dr. Marcus Chen',
    title: 'Autonomous Multi-Agent AI Architectures & RAG',
    slug: 'autonomous-multi-agent-ai-architectures-rag',
    subtitle: 'Build production-ready LLM pipelines, semantic vector search, tool-calling agents, and structured memory.',
    description: 'Go beyond basic chat wrappers. This hands-on masterclass teaches you how to construct deterministic AI agents, implement hybrid vector search with BM25 reranking, manage prompt tokens, and evaluate hallucination mitigation.',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    estimatedHours: 22,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&q=80',
    learningObjectives: [
      'Formulate multi-agent collaboration graphs with supervisor nodes',
      'Implement chunking, embedding generation, and cosine vector retrieval',
      'Execute tool-calling with JSON schema enforcement and error recovery',
      'Build evaluation suites to prevent regression and model drift'
    ],
    requirements: [
      'Intermediate Python or TypeScript development experience',
      'Basic knowledge of API calls and asynchronous programming'
    ],
    published: true,
    featured: true,
    rating: 5.0,
    reviewCount: 62,
    enrolledCount: 510,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-4',
    academyId: 'academy-4',
    academyName: 'Apex Cloud & DevOps Institute',
    instructorId: 'sarah-instructor',
    instructorName: 'Sarah Jenkins',
    title: 'Kubernetes Mastery: Zero-Downtime Multi-Cluster Deployment',
    slug: 'kubernetes-mastery-zero-downtime-deployment',
    subtitle: 'Deploy, scale, and monitor cloud-native workloads with Helm, ArgoCD, and Prometheus telemetry.',
    description: 'Gain operational confidence managing cloud clusters. Learn declarative GitOps pipelines, canary rollouts, ingress controllers, horizontal pod autoscaling, and secret management.',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    estimatedHours: 16,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&q=80',
    learningObjectives: [
      'Write production-grade Kubernetes manifests and Helm charts',
      'Configure automated GitOps deployments with health checks',
      'Set up distributed tracing and Prometheus alert thresholds',
      'Harden cluster network policies and container security contexts'
    ],
    requirements: [
      'Familiarity with Linux command line and Docker basics'
    ],
    published: true,
    featured: false,
    rating: 4.7,
    reviewCount: 19,
    enrolledCount: 145,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-5',
    academyId: 'academy-1',
    academyName: 'Hyperion Code Labs',
    instructorId: 'arish-instructor',
    instructorName: 'Arish Rizvi',
    title: 'Modern TypeScript Foundations & Clean Code Patterns',
    slug: 'modern-typescript-foundations-clean-code',
    subtitle: 'Write expressive, maintainable, and bug-resistant code with modern TypeScript paradigms.',
    description: 'A master foundation for developers transitioning to TypeScript. Master generics, utility types, discriminated unions, and object-oriented clean code principles.',
    category: 'Software Engineering',
    level: 'Beginner',
    estimatedHours: 9,
    price: 0,
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1000&q=80',
    learningObjectives: [
      'Understand TypeScript type inference and narrowing',
      'Leverage generics and conditional types safely',
      'Apply SOLID design principles in everyday web applications'
    ],
    requirements: [
      'Basic understanding of JavaScript variables and functions'
    ],
    published: true,
    featured: false,
    rating: 4.9,
    reviewCount: 27,
    enrolledCount: 180,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  // Course 1 Lessons
  {
    id: 'lesson-101',
    courseId: 'course-1',
    academyId: 'academy-1',
    order: 1,
    title: 'Architecture Blueprint & Modular Design Principles',
    description: 'Explore the high-level architecture of enterprise full-stack TypeScript applications.',
    content: `## Modern Enterprise Architecture Blueprint

Welcome to the **Full-Stack TypeScript & Scalable System Architecture** masterclass. In this opening module, we establish the foundational mental models required to architect resilient, maintainable web systems.

### Core Architectural Pillars
1. **Domain-Driven Directory Organization**: Grouping by business bounded contexts rather than technical artifacts.
2. **Strict Type Invariants**: Enforcing type definitions that make invalid states unrepresentable.
3. **Uni-directional Data Flow**: Clear separation between read models (queries) and write models (mutations).

\`\`\`typescript
// Example: Domain Entity with Invariant Validation
export interface AcademyDomain {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: 'active' | 'archived' | 'pending';
}

export function createAcademyEntity(input: Partial<AcademyDomain>): AcademyDomain {
  if (!input.name || input.name.trim().length < 3) {
    throw new Error('Academy name must be at least 3 characters long');
  }
  return {
    id: input.id || crypto.randomUUID(),
    name: input.name.trim(),
    slug: input.name.toLowerCase().replace(/\\s+/g, '-'),
    status: 'active',
  };
}
\`\`\`

### Key Takeaways
- Always isolate external integrations behind typed adapter interfaces.
- Avoid premature microservices: optimize for cohesive modular monoliths first.`,
    durationMinutes: 25,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: true,
    attachments: [
      { name: 'Architecture_Blueprint_Diagram.pdf', url: '#', size: '2.4 MB' },
      { name: 'Starter_Monorepo_Config.zip', url: '#', size: '150 KB' }
    ],
    createdAt: new Date(Date.now() - 48 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lesson-102',
    courseId: 'course-1',
    academyId: 'academy-1',
    order: 2,
    title: 'Type-Safe Data Contracts & Validation Pipelines',
    description: 'Learn how to synchronize schemas between server and client with zero drift.',
    content: `## Eliminating Drift with Unified Data Contracts

In modern applications, API runtime contract mismatches cause over 40% of production defects. In this lesson, we implement runtime schema validation combined with compile-time type deduction.

### Schema Validation Pattern
Using runtime validators ensures that unvetted incoming HTTP payloads or webhook responses are parsed defensively before entering your application domain logic.

\`\`\`typescript
// Schema Blueprint example
export type UserRole = 'student' | 'instructor' | 'admin';

export interface RegistrationPayload {
  email: string;
  displayName: string;
  role: UserRole;
}

export function validateRegistration(payload: any): RegistrationPayload {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!payload || typeof payload !== 'object') throw new Error('Invalid JSON');
  if (!emailRegex.test(payload.email)) throw new Error('Malformed email format');
  if (typeof payload.displayName !== 'string' || payload.displayName.length < 2) {
    throw new Error('Display name too short');
  }
  return {
    email: payload.email,
    displayName: payload.displayName,
    role: payload.role === 'instructor' ? 'instructor' : 'student'
  };
}
\`\`\`

### Practical Exercise
Examine the schema in your project repository and verify how each incoming request maps into domain entities without casting with \`any\`.`,
    durationMinutes: 35,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: true,
    attachments: [
      { name: 'Contract_Testing_Cheatsheet.md', url: '#', size: '45 KB' }
    ],
    createdAt: new Date(Date.now() - 47 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lesson-103',
    courseId: 'course-1',
    academyId: 'academy-1',
    order: 3,
    title: 'Connection Pooling & Resilient Database Queries',
    description: 'Implement lazy connection pooling, query sanitization, and error isolation.',
    content: `## Database Resilience & Query Isolation

When scaling web systems, database connection exhaustion is the primary bottleneck. In this lesson, we study lazy pooling, two-layer error boundaries, and defensive queries.

### Two-Layer Error Handling Architecture
1. **Query Layer**: Catches database-specific errors (driver exceptions, timeouts) and translates them into sanitized domain errors without leaking internal table schemas.
2. **Controller Layer**: Inspects the sanitized error and responds with standard HTTP status codes (400, 403, 404, 500).

\`\`\`typescript
export async function executeSafeQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  try {
    return await queryFn();
  } catch (error: any) {
    console.error('[DB Error Isolated]:', error.message);
    throw new Error('Database transaction was interrupted. Please try again.', { cause: error });
  }
}
\`\`\`

### Best Practices
- Keep transactions short and focused.
- Ensure all foreign keys are indexed for sub-millisecond lookups.`,
    durationMinutes: 40,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: false,
    attachments: [
      { name: 'Postgres_Optimization_Guide.pdf', url: '#', size: '1.8 MB' }
    ],
    createdAt: new Date(Date.now() - 46 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lesson-104',
    courseId: 'course-1',
    academyId: 'academy-1',
    order: 4,
    title: 'Role-Based Access Control (RBAC) & Security Hardening',
    description: 'Secure academies, courses, and lessons with fine-grained role authorization.',
    content: `## Fine-Grained Role-Based Access Control

Security must be verified at every API gateway and database transaction layer. Never trust client claims or state without server validation.

### Role Hierarchy
- **Students**: Can view published academies and courses, enroll, track their progress, and post reviews.
- **Instructors**: Can create/edit academies, publish courses, manage curriculum lessons, and monitor student progress.
- **Admins**: Super-user access to moderate courses, promote instructors, verify academies, and oversee all platform activity.

\`\`\`typescript
export function assertCanManageCourse(user: { id: string; role: string }, course: { instructorId: string }) {
  if (user.role === 'admin') return true;
  if (user.role === 'instructor' && course.instructorId === user.id) return true;
  throw new Error('Unauthorized: You do not have permission to modify this course.');
}
\`\`\`

### Lesson Challenge
Audit the permissions on your routes and ensure that only course owners can modify lesson content!`,
    durationMinutes: 30,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: false,
    attachments: [
      { name: 'Security_Audit_Checklist.pdf', url: '#', size: '920 KB' }
    ],
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Course 2 Lessons
  {
    id: 'lesson-201',
    courseId: 'course-2',
    academyId: 'academy-2',
    order: 1,
    title: 'Foundations of Design Tokens & Semantic Systems',
    description: 'Learn how to translate visual aesthetics into scalable, multi-platform token architectures.',
    content: `## Design Tokens: The Language of Scale

Design tokens are the single source of truth for color, spacing, typography, and motion across web and mobile platforms.

### Token Taxonomy
1. **Global/Primitive Tokens**: \`color-blue-500: #3b82f6\`
2. **Semantic Tokens**: \`color-primary-action: var(--color-blue-500)\`
3. **Component Tokens**: \`btn-primary-bg: var(--color-primary-action)\`

By adopting semantic indirection, changing dark/light themes becomes a matter of swapping token variables at root level without rewriting component styling.`,
    durationMinutes: 20,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: true,
    attachments: [
      { name: 'Figma_Token_Spec.fig', url: '#', size: '5.1 MB' }
    ],
    createdAt: new Date(Date.now() - 39 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lesson-202',
    courseId: 'course-2',
    academyId: 'academy-2',
    order: 2,
    title: 'Spring Physics & Intentional Motion in Web UI',
    description: 'Master spring curves, natural easing, and subtle micro-interactions that elevate user delight.',
    content: `## Micro-Interactions and Spring Physics

Linear animations feel robotic and artificial. In this module, we explore how natural spring physics (damping, stiffness, and mass) provide tactile feedback that guides user attention without distraction.

### Principles of Purposeful Motion
- Motion should clarify spatial relationships (e.g. card expansion from origin).
- Duration should inversely correlate with travel distance.
- Always honor \`prefers-reduced-motion\` for accessibility.`,
    durationMinutes: 30,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: false,
    attachments: [
      { name: 'Motion_Curves_Cheatsheet.pdf', url: '#', size: '820 KB' }
    ],
    createdAt: new Date(Date.now() - 38 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Course 3 Lessons
  {
    id: 'lesson-301',
    courseId: 'course-3',
    academyId: 'academy-3',
    order: 1,
    title: 'Architecting Multi-Agent State Machines',
    description: 'Design deterministic agent graphs with supervisor routing and tool execution.',
    content: `## Multi-Agent Systems: From Prompts to Graph States

Autonomous agents become reliable when modeled as state machines with strict transition guards and explicit tool interfaces.

### Core Architecture Components
1. **Supervisor Router**: Decides which specialized agent (Researcher, Coder, Reviewer) should handle the current step.
2. **Context Scratchpad**: Shared memory state recording intermediate thoughts and artifacts.
3. **Guardrails & Verifiers**: Programmatic checks ensuring generated code or answers pass validation before delivery.`,
    durationMinutes: 45,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isFreePreview: true,
    attachments: [
      { name: 'Agent_State_Graph.pdf', url: '#', size: '3.1 MB' }
    ],
    createdAt: new Date(Date.now() - 24 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'review-1',
    courseId: 'course-1',
    academyId: 'academy-1',
    userId: 'student-1',
    userName: 'Kavita Patel',
    userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    rating: 5,
    title: 'The definitive architectural guide for modern TypeScript engineers!',
    comment: 'The focus on invariant validation and connection pooling solved real scaling bugs we were experiencing at work. Arish breaks down complex patterns into crystal-clear mental models.',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'review-2',
    courseId: 'course-1',
    academyId: 'academy-1',
    userId: 'student-2',
    userName: 'David Miller',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    rating: 5,
    title: 'Exceptional curriculum and real code samples',
    comment: 'Unlike other tutorials that gloss over error handling and RBAC, this course tackles enterprise security and data integrity head on. Highly recommended!',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'review-3',
    courseId: 'course-3',
    academyId: 'academy-3',
    userId: 'student-3',
    userName: 'Zack Thorne',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
    rating: 5,
    title: 'Unbelievably good breakdown of autonomous agents',
    comment: 'The supervisor graph and evaluation pipeline lectures are masterclass level. Implemented these exact patterns in our startup production deployment last week.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
];
