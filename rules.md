# Cursor Rules - CROCKNESTCLUB

## Project Overview
CROCKNESTCLUB is a modern mobile-first e-commerce web application for purchasing trendy clothing and lifestyle products, inspired by The Souled Store's design and user experience.

## Instructions

- Record fixes for mistakes or corrections to avoid repetition in the `Lessons` section.
- Organize thoughts and plan steps before starting a task in the `Scratchpad` section.
- Clear old tasks if necessary.
- Use todo markers for progress tracking:
  - `[X]` Completed tasks
  - `[ ]` Pending tasks
- Update Scratchpad after completing subtasks.
- Reflect and plan after milestones for better task management.
- Always refer to Scratchpad before planning the next step.
- Prioritize mobile-first responsive design for all components.
- Follow modern UI/UX patterns with smooth animations and transitions.
- Focus on scalable architecture and performance optimization from the start.

## Tech Stack (Latest Versions)
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS 4.0 + Shadcn/ui components
- **State Management**: Zustand v5 with persist middleware
- **Database**: PostgreSQL with Prisma ORM v6
- **Authentication**: Auth.js v5 (NextAuth.js successor)
- **Payments**: Instamojo SDK v2.1+
- **File Storage**: UploadThing v7
- **Email**: Resend v4
- **Icons**: Lucide React v0.400+
- **Charts**: Recharts v2.12+ (admin analytics only)
- **Validation**: Zod v3.23+
- **Forms**: React Hook Form v7.52+ with Zod resolver
- **Image Optimization**: next/image with sharp
- **Runtime**: Node.js 20+ LTS

## Lessons

1. Use `npx shadcn@latest add [component]` for installing Shadcn UI components.

2. In Next.js 15, page params are automatically typed as Promise:
   ```typescript
   interface PageProps {
     params: Promise<{ slug: string }>
     searchParams: Promise<{ [key: string]: string | string[] | undefined }>
   }
   
   export default async function Page({ params, searchParams }: PageProps) {
     const { slug } = await params
     const search = await searchParams
   }
   ```

3. Use `import { auth } from "@/auth"` and `const session = await auth()` for server-side authentication with Auth.js v5.

4. Client components must use `'use client'` directive when using hooks like `useRouter`, `useState`, etc.

5. Use Server Actions for form submissions instead of API routes when possible for better performance and type safety.

6. Implement React Suspense boundaries for better loading states and user experience.

7. Use `unstable_cache` from Next.js for database query caching to improve performance.

8. Implement proper error boundaries using Next.js error.tsx files for better error handling.

9. Use Tailwind CSS Container Queries for component-based responsive design instead of viewport-only breakpoints.

10. Implement proper SEO with Next.js metadata API for better search engine optimization.

11. Use Web Streams API for better file upload performance with UploadThing.

12. Implement proper database connection pooling with Prisma for production scalability.

## Scratchpad

### 1. Project Foundation [X]

  - [X] Initialize Next.js 15 project with latest stable features:
    - [X] Enable App Router (default in Next.js 15)
    - [X] Configure TypeScript with strict mode
    - [X] Set up ESLint with Next.js recommended rules
    - [X] Configure Prettier with Tailwind plugin
  - [X] Project structure setup:
  ```
  src/
  ├── app/              # App Router pages and layouts
  ├── components/       # Reusable UI components
  ├── lib/             # Utilities, database, auth config
  ├── hooks/           # Custom React hooks
  ├── store/           # Zustand stores
  ├── types/           # TypeScript type definitions
  ├── actions/         # Server Actions
  └── styles/          # Global styles and Tailwind config
  ```
  - [X] Install and configure core dependencies:
    - [X] Tailwind CSS 4.0 with container queries
    - [X] Shadcn/ui with latest component versions
    - [X] Zustand v5 with TypeScript and persist middleware
    - [X] React Hook Form with Zod resolver

### 2. Database Architecture [X]

- [X] PostgreSQL setup with connection pooling
- [X] Prisma ORM v6 configuration with optimizations:
  ```prisma
  // Scalable schema design
    email         String    @unique
    name          String?
    phone         String?   @unique
    emailVerified DateTime?
    image         String?
    role          UserRole  @default(CUSTOMER)
    
    // Relationships
    addresses     Address[]
    orders        Order[]
    reviews       Review[]
    cartItems     CartItem[]
    wishlist      WishlistItem[]
    
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    @@map("users")
  }
  
  model Product {
    id          String   @id @default(cuid())
    name        String
    description String?
    slug        String   @unique
    status      ProductStatus @default(DRAFT)
    
    // SEO and metadata
    metaTitle       String?
    metaDescription String?
    
    // Product details
    basePrice    Decimal  @db.Money
    comparePrice Decimal? @db.Money
    weight       Float?
    dimensions   Json?
    
    // Relationships
    category     Category @relation(fields: [categoryId], references: [id])
    categoryId   String
    variants     ProductVariant[]
    images       ProductImage[]
    reviews      Review[]
    
    // Analytics
    viewCount    Int @default(0)
    
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    
    @@map("products")
    @@index([categoryId])
    @@index([status])
    @@index([createdAt])
  }
  ```
- [X] Implement database migrations and seeding scripts
- [X] Set up database indexes for performance optimization

### 3. Authentication & Authorization [ ]
    - [X] PostgreSQL setup with connection pooling
    - [X] Prisma ORM v6 configuration with optimizations:
    - [X] Implement database migrations and seeding scripts
    - [X] Set up database indexes for performance optimization
  - [X] Email/password authentication with verification
  - [X] Google OAuth integration
  - [X] JWT configuration with secure settings
  - [X] Role-based access control (RBAC)
  - [X] Authentication pages and components:
    - [X] Login/register modals with mobile-first design
    - [X] Email verification flow
    - [X] Password reset functionality
    - [X] Account management pages
  - [X] Middleware for route protection and role-based access

### 4. Core UI Foundation [X]

- [X] Design system implementation:
  - [X] Color palette and theme configuration
  - [X] Typography system with mobile optimization
  - [X] Spacing and sizing scales
  - [X] Animation and transition library
- [X] Layout components:
  - [X] Responsive header with search and cart
  - [X] Mobile-first navigation (bottom tabs + drawer)
  - [X] Footer with essential links
  - [X] Breadcrumb navigation
- [X] Essential UI components:
  - [X] Button variants with loading states
  - [X] Form inputs with validation states
  - [X] Modal and drawer components
  - [X] Toast notification system
  - [X] Loading skeleton components

### 5. Product Catalog System [ ]

- [X] Homepage implementation:
  - [X] Hero section with promotional banners
  - [X] Category showcase grid
  - [X] Featured products carousel
  - [X] Social proof sections
- [ ] Product listing and filtering:
  - [X] Advanced search with filters (price, size, color, brand)
  - [X] Sort functionality (relevance, price, newest, popularity)
  - [X] Infinite scroll with skeleton loading
  - [X] Quick view modal for products
[X] Product detail pages:
  - [X] Image gallery with zoom and 360° view
  - [X] Variant selection (size, color) with inventory display
  - [X] Product information tabs
  - [X] Reviews and ratings system
  - [X] Related products recommendation
- [X] Search functionality:
  - [X] Algolia or similar search service integration
  - [X] Auto-complete and search suggestions
  - [X] Search analytics and optimization

### 6. Shopping Cart & Checkout Flow [X]

 [X] Cart management:
  - [X] Server-side cart for authenticated users
  - [X] Local storage cart for guests with migration on login
  - [X] Real-time inventory validation
  - [ ] Cart abandonment recovery (email automation)
 [X] Checkout process:
  - [X] Multi-step checkout with progress indicator
  - [X] Guest checkout option
  - [X] Address validation and autocomplete
  - [X] Instamojo payment integration (UPI, cards, net banking, wallets)
  - [X] Payment gateway fallback handling
  - [X] Order confirmation and email receipts
  - [X] GST calculation and invoice generation for Indian market
 [X] Payment integration:
  - [X] Instamojo SDK integration with webhook handling
  - [X] Payment status tracking and retry mechanism
  - [X] Refund processing through Instamojo
  - [X] Payment analytics and reporting
  - [X] PCI DSS compliance implementation
 [ ] Order management:
  - [X] Order tracking with status updates
  - [X] Return and refund processing
  - [ ] Invoice generation and download

### 7. User Account Management [ ]

- [X] User dashboard:
  - [X] Order history with tracking
  - [X] Profile management with avatar upload
  - [X] Address book management
  - [X] Wishlist functionality
  - [X] Notification preferences
- [X] Account features:
  - [X] Two-factor authentication (2FA)
  - [X] Account deletion with data export
  - [X] Privacy settings management
  - [X] Communication preferences

### 8. Admin Dashboard (Scalable Architecture) [X]


[X] Admin authentication and RBAC:
  - [X] Multi-level admin roles (Super Admin, Manager, Staff)
  - [X] Permission-based access control
  - [X] Activity logging and audit trails
[X] Dashboard overview:
  - [X] Real-time metrics with WebSocket updates
  - [X] Revenue analytics with date range filtering
  - [X] Order volume and conversion rate tracking
  - [X] Inventory alerts and low stock notifications
[X] Product management:
  - [X] Bulk product operations (import/export CSV)
  - [X] Advanced inventory tracking
  - [X] SEO optimization tools
  - [X] Product performance analytics
[X] Order processing:
  - [X] Order workflow automation
  - [X] Shipping integration (multiple carriers)
  - [X] Return processing automation
  - [X] Customer communication templates

### 9. Performance & Scalability [ ]

- [ ] Core Web Vitals optimization:
  - [ ] Image optimization with next/image and CDN
  - [ ] Code splitting and lazy loading
  - [ ] Database query optimization with caching
  - [ ] Bundle size analysis and optimization
- [ ] Caching strategy:
  - [ ] Page-level caching with ISR
  - [ ] Database query caching with Redis
  - [ ] CDN configuration for static assets
  - [ ] Service worker for offline capability
- [ ] Mobile performance:
  - [ ] Progressive Web App (PWA) implementation
  - [ ] Touch gesture optimization
  - [ ] Network-aware loading strategies
  - [ ] Performance monitoring and alerting

### 10. Advanced E-commerce Features [ ]

- [ ] Marketing and promotions:
  - [ ] Discount code system with usage tracking
  - [ ] Flash sales with countdown timers
  - [ ] Customer segmentation for targeted promotions
  - [ ] A/B testing framework for conversion optimization
- [ ] Recommendation engine:
  - [ ] Machine learning-based product recommendations
  - [ ] Recently viewed products tracking
  - [ ] Cross-sell and upsell suggestions
  - [ ] Personalized homepage content
- [ ] Inventory management:
  - [ ] Multi-location inventory tracking
  - [ ] Automated reorder points
  - [ ] Supplier management system
  - [ ] Stock movement history and analytics

### 11. Communication & Notifications [ ]

- [ ] Email automation with Resend:
  - [ ] Transactional emails (orders, shipping, returns)
  - [ ] Marketing campaigns with segmentation
  - [ ] Abandoned cart recovery sequences
  - [ ] Product back-in-stock notifications
- [ ] Real-time notifications:
  - [ ] WebSocket implementation for live updates
  - [ ] Push notifications for mobile users
  - [ ] SMS notifications for critical updates
  - [ ] In-app notification center

### 12. Analytics & Monitoring [ ]

- [ ] Business intelligence:
  - [ ] Custom analytics dashboard
  - [ ] Customer lifetime value (CLV) tracking
  - [ ] Product performance analytics
  - [ ] Marketing campaign ROI analysis
- [ ] Technical monitoring:
  - [ ] Error tracking and alerting (Sentry)
  - [ ] Performance monitoring (Vercel Analytics)
  - [ ] Database performance monitoring
  - [ ] Security monitoring and logging

### 13. Security & Compliance [ ]

- [ ] Security implementation:
  - [ ] OWASP security best practices
  - [ ] Rate limiting and DDoS protection
  - [ ] Content Security Policy (CSP)
  - [ ] Regular security audits and updates
- [ ] Data compliance:
  - [ ] GDPR compliance implementation
  - [ ] Data retention and deletion policies
  - [ ] Privacy policy and terms of service
  - [ ] Cookie consent management

### 14. Testing & Quality Assurance [ ]

- [ ] Testing strategy:
  - [ ] Unit tests for business logic
  - [ ] Integration tests for API endpoints
  - [ ] E2E tests for critical user journeys
  - [ ] Performance testing and load testing
- [ ] Quality assurance:
  - [ ] Code review processes
  - [ ] Automated CI/CD pipeline
  - [ ] Staging environment for testing
  - [ ] User acceptance testing (UAT)

### 15. Deployment & DevOps [ ]

- [ ] Production deployment:
  - [ ] Vercel deployment with edge functions
  - [ ] Environment variable management
  - [ ] Database migration automation
  - [ ] Health checks and monitoring
- [ ] DevOps pipeline:
  - [ ] GitHub Actions CI/CD
  - [ ] Automated testing and deployment
  - [ ] Database backup automation
  - [ ] Disaster recovery procedures

## Scalability Considerations

1. **Database**: Use read replicas and connection pooling for high traffic
2. **Caching**: Implement Redis for session storage and query caching
3. **CDN**: Use Vercel Edge Network or Cloudflare for global content delivery
4. **Search**: Integrate Algolia or Elasticsearch for advanced search capabilities
5. **Media**: Use cloud storage (AWS S3/Cloudflare R2) for product images
6. **Monitoring**: Implement comprehensive logging and alerting systems
7. **API Design**: Use GraphQL or tRPC for type-safe API communication

## Mobile-First Design Principles

1. **Touch-First**: Design for finger navigation (min 44px touch targets)
2. **Performance**: Optimize for 3G networks and lower-end devices
3. **Progressive Enhancement**: Core functionality works on all devices
4. **Offline Support**: Cache critical content for offline browsing
5. **Native Feel**: Use platform-specific UI patterns and gestures