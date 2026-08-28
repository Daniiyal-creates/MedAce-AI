# Architecture Overview

<cite>
**Referenced Files in This Document**
- [layout.tsx](file://Next-app/src/app/layout.tsx)
- [middleware.ts](file://Next-app/src/middleware.ts)
- [AuthProvider.tsx](file://Next-app/src/providers/AuthProvider.tsx)
- [QueryProvider.tsx](file://Next-app/src/providers/QueryProvider.tsx)
- [dashboard layout.tsx](file://Next-app/src/app/(dashboard)/layout.tsx)
- [auth layout.tsx](file://Next-app/src/app/(auth)/layout.tsx)
- [quiz generate route.ts](file://Next-app/src/app/api/quiz/generate/route.ts)
- [study plan route.ts](file://Next-app/src/app/api/study-plan/route.ts)
- [gemini client.ts](file://Next-app/src/lib/gemini/client.ts)
- [supabase server.ts](file://Next-app/src/lib/supabase/server.ts)
- [supabase middleware.ts](file://Next-app/src/lib/supabase/middleware.ts)
- [package.json](file://Next-app/package.json)
</cite>

## Table of Contents
1. Introduction
2. Project Structure
3. Core Components
4. Architecture Overview
5. Detailed Component Analysis
6. Dependency Analysis
7. Performance Considerations
8. Troubleshooting Guide
9. Conclusion

## Introduction
This document explains the system architecture of MedAce-AI, a Next.js application that delivers AI-powered MDCAT preparation with quizzes and personalized study plans. It covers the high-level architecture using the Next.js App Router, component hierarchy, data flow patterns, and integration points with Supabase (authentication and persistence) and the Gemini API (AI content generation). It also documents the separation between client-side and server-side logic, authentication middleware, route groups, state management patterns, and scalability considerations.

## Project Structure
MedAce-AI is organized around Next.js App Router conventions:
- Root layout wraps the app with global providers for data fetching and authentication.
- Route groups separate public auth flows from protected dashboard features.
- API routes encapsulate server-side logic for quiz generation and study plan creation.
- Shared libraries provide reusable clients for Supabase and Gemini.
- UI components are grouped by feature and shared primitives live under a common UI set.

```mermaid
graph TB
A["Root Layout<br/>Providers"] --> B["Auth Route Group<br/>(login/signup)"]
A --> C["Dashboard Route Group<br/>(quiz/history/profile/study-plan)"]
C --> D["API Routes<br/>/api/quiz/*, /api/study-plan"]
D --> E["Gemini Client<br/>generateQuestions, generateStudyPlan"]
D --> F["Supabase Server Client<br/>auth + DB access"]
A --> G["Client Providers<br/>React Query, Auth Context"]
```

**Diagram sources**
- [layout.tsx:12-22](file://Next-app/src/app/layout.tsx#L12-L22)
- [dashboard layout.tsx:12-60](file://Next-app/src/app/(dashboard)/layout.tsx#L12-L60)
- [auth layout.tsx:1-8](file://Next-app/src/app/(auth)/layout.tsx#L1-L8)
- [quiz generate route.ts:4-31](file://Next-app/src/app/api/quiz/generate/route.ts#L4-L31)
- [study plan route.ts:5-78](file://Next-app/src/app/api/study-plan/route.ts#L5-L78)
- [gemini client.ts:6-28](file://Next-app/src/lib/gemini/client.ts#L6-L28)
- [supabase server.ts:4-30](file://Next-app/src/lib/supabase/server.ts#L4-L30)

**Section sources**
- [layout.tsx:12-22](file://Next-app/src/app/layout.tsx#L12-L22)
- [dashboard layout.tsx:12-60](file://Next-app/src/app/(dashboard)/layout.tsx#L12-L60)
- [auth layout.tsx:1-8](file://Next-app/src/app/(auth)/layout.tsx#L1-L8)

## Core Components
- Root Providers: The root layout composes React Query and Auth providers to supply global state and caching to all pages.
- Authentication Provider: Manages user session state on the client via Supabase, exposing user, session, loading status, and sign-out.
- Dashboard Layout: Enforces authentication for protected routes, renders navigation chrome, and guards against unauthenticated access.
- API Routes: Implement server-only operations such as generating quizzes and study plans, integrating with Gemini and Supabase.
- Gemini Client: Encapsulates prompts and calls to the Gemini API for question generation, explanations, and study planning.
- Supabase Clients: Provide server-side client for authenticated requests and middleware-based session handling.

**Section sources**
- [layout.tsx:12-22](file://Next-app/src/app/layout.tsx#L12-L22)
- [AuthProvider.tsx:27-78](file://Next-app/src/providers/AuthProvider.tsx#L27-L78)
- [dashboard layout.tsx:12-60](file://Next-app/src/app/(dashboard)/layout.tsx#L12-L60)
- [quiz generate route.ts:4-31](file://Next-app/src/app/api/quiz/generate/route.ts#L4-L31)
- [study plan route.ts:5-78](file://Next-app/src/app/api/study-plan/route.ts#L5-L78)
- [gemini client.ts:30-134](file://Next-app/src/lib/gemini/client.ts#L30-L134)
- [supabase server.ts:4-30](file://Next-app/src/lib/supabase/server.ts#L4-L30)
- [supabase middleware.ts:4-67](file://Next-app/src/lib/supabase/middleware.ts#L4-L67)

## Architecture Overview
The application follows a layered architecture:
- Presentation Layer: Pages and components render UI and manage local state.
- Application Layer: Route handlers orchestrate business logic, calling external services and persisting data.
- Integration Layer: Supabase and Gemini clients abstract external dependencies.
- Infrastructure: Next.js App Router, middleware, and environment variables configure runtime behavior.

```mermaid
graph TB
subgraph "Client"
P["Pages & Components"]
QP["React Query Cache"]
AC["Auth Context"]
end
subgraph "Server"
MW["Middleware<br/>Session Update"]
AR["API Routes"]
end
subgraph "External Services"
SB["Supabase<br/>Auth + Database"]
GA["Gemini API"]
end
P --> QP
P --> AC
P --> AR
AR --> SB
AR --> GA
MW --> SB
```

**Diagram sources**
- [middleware.ts:4-12](file://Next-app/src/middleware.ts#L4-L12)
- [supabase middleware.ts:4-67](file://Next-app/src/lib/supabase/middleware.ts#L4-L67)
- [quiz generate route.ts:4-31](file://Next-app/src/app/api/quiz/generate/route.ts#L4-L31)
- [study plan route.ts:5-78](file://Next-app/src/app/api/study-plan/route.ts#L5-L78)
- [gemini client.ts:6-28](file://Next-app/src/lib/gemini/client.ts#L6-L28)
- [supabase server.ts:4-30](file://Next-app/src/lib/supabase/server.ts#L4-L30)

## Detailed Component Analysis

### Authentication Flow and Middleware
- Global middleware updates sessions and enforces route protection. Unauthenticated users accessing protected paths are redirected to login; authenticated users are redirected away from auth pages.
- The dashboard layout performs client-side checks to guard protected areas and display loading states while resolving auth state.

```mermaid
sequenceDiagram
participant U as "User"
participant N as "Next.js Middleware"
participant S as "Supabase Server Client"
participant R as "Route Handler"
U->>N : Request to protected route
N->>S : Get user session
alt User not authenticated
N-->>U : Redirect to /login
else User authenticated
N-->>R : Continue to route handler
R-->>U : Render page or return JSON
end
```

**Diagram sources**
- [middleware.ts:4-12](file://Next-app/src/middleware.ts#L4-L12)
- [supabase middleware.ts:4-67](file://Next-app/src/lib/supabase/middleware.ts#L4-L67)
- [dashboard layout.tsx:17-37](file://Next-app/src/app/(dashboard)/layout.tsx#L17-L37)

**Section sources**
- [middleware.ts:4-12](file://Next-app/src/middleware.ts#L4-L12)
- [supabase middleware.ts:4-67](file://Next-app/src/lib/supabase/middleware.ts#L4-L67)
- [dashboard layout.tsx:17-37](file://Next-app/src/app/(dashboard)/layout.tsx#L17-L37)

### Quiz Generation Flow
- Client triggers a POST to the quiz generation endpoint with topic, count, difficulty, and optional weak topics.
- Server validates input, calls Gemini to generate questions, and returns structured results.

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant API as "/api/quiz/generate"
participant G as "Gemini Client"
participant GA as "Gemini API"
FE->>API : POST {topic, questionCount, difficulty, weakTopics}
API->>API : Validate inputs
API->>G : generateQuestions(...)
G->>GA : Call generateContent
GA-->>G : JSON array of questions
G-->>API : Parsed Question[]
API-->>FE : Questions
```

**Diagram sources**
- [quiz generate route.ts:4-31](file://Next-app/src/app/api/quiz/generate/route.ts#L4-L31)
- [gemini client.ts:30-75](file://Next-app/src/lib/gemini/client.ts#L30-L75)

**Section sources**
- [quiz generate route.ts:4-31](file://Next-app/src/app/api/quiz/generate/route.ts#L4-L31)
- [gemini client.ts:30-75](file://Next-app/src/lib/gemini/client.ts#L30-L75)

### Study Plan Generation Flow
- Client calls the study plan endpoint.
- Server retrieves user’s weak topics and recent accuracy from Supabase, generates a weekly plan via Gemini, persists it, and returns the plan.

```mermaid
flowchart TD
Start(["POST /api/study-plan"]) --> Auth["Verify user via Supabase"]
Auth --> |Unauthenticated| Err401["Return 401"]
Auth --> |Authenticated| FetchWeak["Fetch weak_topics by user_id"]
FetchWeak --> FetchSessions["Fetch recent quiz_sessions for accuracy"]
FetchSessions --> CalcAcc["Compute recent accuracy"]
CalcAcc --> GenPlan["Call Gemini generateStudyPlan"]
GenPlan --> ParsePlan["Parse JSON response"]
ParsePlan --> SavePlan["Insert into study_plans"]
SavePlan --> ReturnPlan["Return plan data"]
```

**Diagram sources**
- [study plan route.ts:5-78](file://Next-app/src/app/api/study-plan/route.ts#L5-L78)
- [gemini client.ts:94-134](file://Next-app/src/lib/gemini/client.ts#L94-L134)
- [supabase server.ts:4-30](file://Next-app/src/lib/supabase/server.ts#L4-L30)

**Section sources**
- [study plan route.ts:5-78](file://Next-app/src/app/api/study-plan/route.ts#L5-L78)
- [gemini client.ts:94-134](file://Next-app/src/lib/gemini/client.ts#L94-L134)
- [supabase server.ts:4-30](file://Next-app/src/lib/supabase/server.ts#L4-L30)

### State Management Patterns
- React Query: Centralized caching and background refetching for data-heavy features.
- Auth Context: Lightweight client-side state for user/session and sign-out actions.
- Local UI State: Components manage transient UI state (e.g., modals, toggles) without polluting global state.

```mermaid
classDiagram
class QueryProvider {
+client : QueryClient
}
class AuthProvider {
+user : User | null
+session : Session | null
+isLoading : boolean
+signOut() void
}
class PageComponents {
+useQuery()
+useAuth()
}
PageComponents --> QueryProvider : "uses"
PageComponents --> AuthProvider : "uses"
```

**Diagram sources**
- [QueryProvider.tsx:6-23](file://Next-app/src/providers/QueryProvider.tsx#L6-L23)
- [AuthProvider.tsx:27-78](file://Next-app/src/providers/AuthProvider.tsx#L27-L78)

**Section sources**
- [QueryProvider.tsx:6-23](file://Next-app/src/providers/QueryProvider.tsx#L6-L23)
- [AuthProvider.tsx:27-78](file://Next-app/src/providers/AuthProvider.tsx#L27-L78)

### Separation of Client and Server Logic
- Client: UI components, routing, and state hooks operate in the browser. They call API routes and consume context/state.
- Server: API routes handle sensitive operations, enforce authentication, and integrate with external services.
- Middleware: Updates sessions and enforces route-level protections before reaching route handlers.

**Section sources**
- [dashboard layout.tsx:17-37](file://Next-app/src/app/(dashboard)/layout.tsx#L17-L37)
- [quiz generate route.ts:4-31](file://Next-app/src/app/api/quiz/generate/route.ts#L4-L31)
- [study plan route.ts:5-78](file://Next-app/src/app/api/study-plan/route.ts#L5-L78)
- [supabase middleware.ts:4-67](file://Next-app/src/lib/supabase/middleware.ts#L4-L67)

## Dependency Analysis
Key runtime dependencies include Next.js, React, Supabase SDKs, React Query, and Drizzle ORM. These enable serverless API routes, real-time auth, caching, and database interactions.

```mermaid
graph LR
Next["Next.js"] --> React["React"]
Next --> SSR["@supabase/ssr"]
Next --> SQ["@tanstack/react-query"]
Next --> DR["drizzle-orm"]
SQ --> React
SSR --> Supabase["@supabase/supabase-js"]
```

**Diagram sources**
- [package.json:11-23](file://Next-app/package.json#L11-L23)

**Section sources**
- [package.json:11-23](file://Next-app/package.json#L11-L23)

## Performance Considerations
- Caching: React Query provides configurable stale times and retries to reduce network load and improve perceived performance.
- Server-Side Validation: Input validation in API routes prevents unnecessary downstream calls and reduces error propagation.
- External API Limits: Gemini calls should be rate-limited and cached where appropriate to minimize cost and latency.
- Database Queries: Use selective queries and indexes on frequently filtered columns (e.g., user_id) to optimize read/write performance.
- Environment Configuration: Ensure Supabase and Gemini credentials are correctly configured to avoid runtime errors during builds or deployments.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Missing Supabase Credentials: Server client throws an error if environment variables are not set; verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
- Unauthorized Access: Protected routes redirect to login when no user is present; ensure middleware is active and cookies are properly handled.
- Gemini API Errors: Non-OK responses raise errors; check API key validity and payload formatting.
- Invalid Gemini Response: If Gemini does not return expected JSON structure, parsing will fail; add robust fallbacks and logging.

**Section sources**
- [supabase server.ts:9-11](file://Next-app/src/lib/supabase/server.ts#L9-L11)
- [supabase middleware.ts:4-11](file://Next-app/src/lib/supabase/middleware.ts#L4-L11)
- [gemini client.ts:22-28](file://Next-app/src/lib/gemini/client.ts#L22-L28)
- [gemini client.ts:68-74](file://Next-app/src/lib/gemini/client.ts#L68-L74)

## Conclusion
MedAce-AI leverages Next.js App Router to cleanly separate concerns across presentation, application, and integration layers. Authentication is enforced at both middleware and layout levels, ensuring secure access to protected features. Data flows from user input through API routes to Supabase and Gemini, with React Query managing client-side state and caching. The modular design supports scalability by isolating external integrations, centralizing configuration, and enabling independent evolution of UI and backend logic.

[No sources needed since this section summarizes without analyzing specific files]