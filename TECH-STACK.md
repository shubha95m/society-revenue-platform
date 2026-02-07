# Technology Stack - Mobile Reusability Strategy

## Frontend Architecture (Web + Mobile Code Sharing)

### Web Application
- **Framework:** Next.js 15+ (React 19)
- **Language:** TypeScript 5+
- **Styling:** Tailwind CSS 4.x
- **UI Components:** shadcn/ui (built on Radix UI)
- **State Management:** Zustand (lightweight, mobile-compatible)
- **Forms:** React Hook Form + Zod (validation)
- **API Client:** TanStack Query (React Query v5)
- **Charts:** Recharts (React-based)
- **Icons:** Lucide React
- **Date/Time:** date-fns (tree-shakeable)

### Mobile Application (Phase 2)
- **Framework:** React Native (Expo)
- **Language:** TypeScript 5+ (SAME as web)
- **Styling:** NativeWind (Tailwind for React Native)
- **UI Components:** Custom components (styled similarly to web)
- **State Management:** Zustand (SAME library as web)
- **Forms:** React Hook Form + Zod (SAME as web)
- **API Client:** TanStack Query (SAME as web)
- **Icons:** Lucide React Native (SAME icon set)
- **Date/Time:** date-fns (SAME as web)

## Code Reusability Strategy (90%+ Shared Code)

### Shared Between Web & Mobile
```
shared/
├── api/              # API client, endpoints, queries (100% shared)
├── types/            # TypeScript types/interfaces (100% shared)
├── utils/            # Helper functions (100% shared)
├── validation/       # Zod schemas (100% shared)
├── hooks/            # Custom React hooks (90% shared)
├── store/            # Zustand stores (100% shared)
├── constants/        # Colors, config, strings (100% shared)
└── business-logic/   # Core logic (100% shared)
```

### Platform-Specific
```
web/
├── app/              # Next.js pages (App Router)
├── components/       # React components (web-specific)
└── styles/           # Tailwind config

mobile/
├── app/              # Expo Router pages
├── components/       # React Native components
└── styles/           # NativeWind config
```

### Reusability Example
```typescript
// ✅ SHARED (works on both web + mobile)
// shared/api/auth.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => api.post('/auth/login', data),
  });
};

// shared/validation/auth.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// shared/store/auth.ts
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// ❌ PLATFORM-SPECIFIC (different UI)
// web/components/LoginForm.tsx
<form>
  <input type="email" /> {/* HTML input */}
</form>

// mobile/components/LoginForm.tsx
<View>
  <TextInput /> {/* React Native input */}
</View>
```

## Why This Stack? (2025+ Best Practices)

### Next.js 15
- **Latest features:** React 19 support, App Router, Server Components
- **SEO:** Critical for landing page ranking
- **Performance:** Automatic code splitting, image optimization
- **Future-proof:** Most active React framework

### TypeScript 5+
- **Type safety:** Catch errors at compile time
- **Mobile compatible:** Same types in React Native
- **Developer experience:** Best autocomplete, refactoring

### Tailwind CSS 4.x + NativeWind
- **Consistency:** Same utility classes on web and mobile
- **Speed:** Rapid UI development
- **Mobile:** NativeWind brings Tailwind to React Native
- **Example:**
  ```tsx
  // SAME code structure on web and mobile
  <View className="flex flex-row items-center p-4 bg-blue-500">
    <Text className="text-white font-bold">Hello</Text>
  </View>
  ```

### Zustand (State Management)
- **Lightweight:** 1KB bundle size (vs Redux 10KB+)
- **Simple API:** Less boilerplate than Redux
- **Mobile compatible:** Works identically in React Native
- **No Context hell:** Direct store access
- **Example:**
  ```typescript
  // SAME code on web and mobile
  const { user, setUser } = useAuthStore();
  ```

### TanStack Query (React Query v5)
- **Modern:** Latest version (2024+)
- **Caching:** Smart API caching, deduplication
- **Mobile compatible:** Works in React Native
- **Offline support:** Built-in offline/online handling
- **Example:**
  ```typescript
  // SAME code on web and mobile
  const { data, isLoading } = useQuery({
    queryKey: ['societies'],
    queryFn: () => api.get('/societies'),
  });
  ```

### React Hook Form + Zod
- **Performance:** Minimal re-renders
- **Validation:** Type-safe schemas shared across platforms
- **Mobile compatible:** Works in React Native
- **Example:**
  ```typescript
  // SHARED validation schema
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  // Use in both web and mobile
  const form = useForm({ resolver: zodResolver(schema) });
  ```

## Mobile App Strategy (React Native + Expo)

### Why React Native?
- **Code sharing:** 90%+ logic reused from web
- **Skills:** Same team can build web + mobile
- **Performance:** Near-native performance
- **Ecosystem:** Mature, large community

### Why Expo?
- **Modern:** Managed workflow, faster development
- **OTA Updates:** Update app without app store approval
- **Dev Experience:** Hot reload, easy setup
- **Native APIs:** Camera, location, notifications built-in

### Mobile Tech Stack
```json
{
  "expo": "^52.x",
  "react-native": "^0.76.x",
  "nativewind": "^4.x",
  "expo-router": "^4.x",
  "zustand": "^5.x",
  "@tanstack/react-query": "^5.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x"
}
```

## Backend API Requirements (For Reusability)

### RESTful API with JSON
- **Consistent:** Same API for web and mobile
- **Typed:** OpenAPI/Swagger generates TypeScript types
- **Versioned:** /v1/ allows breaking changes

### API Client (Shared)
```typescript
// shared/api/client.ts
import { create } from 'axios';

export const api = create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Web
  // or process.env.EXPO_PUBLIC_API_URL,     // Mobile
});
```

## File Structure (Monorepo Approach)

```
society-revenue-platform/
├── packages/
│   ├── shared/           # 90% of code here (web + mobile)
│   │   ├── api/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── validation/
│   ├── web/              # Next.js app (10%)
│   │   ├── app/
│   │   └── components/
│   └── mobile/           # React Native app (10%)
│       ├── app/
│       └── components/
├── backend/              # Node.js API
└── tasks/                # Documentation
```

## Current Implementation (This Session)

For now, we're building the **web app** in `frontend/` with this structure:

```
frontend/
├── app/                  # Next.js App Router pages
├── components/           # React components
├── lib/                  # Shared utilities, types, API client
│   ├── api/
│   ├── types/
│   ├── utils/
│   ├── hooks/
│   └── store/
└── public/               # Static assets
```

Later, we'll extract `lib/` to `packages/shared/` when building mobile app.

## Migration Path to Mobile

1. **Now (Web development):**
   - Build everything in `frontend/lib/` using mobile-compatible libraries
   - Use TanStack Query, Zustand, React Hook Form, Zod

2. **Phase 2 (Mobile prep):**
   - Move `frontend/lib/` to `packages/shared/`
   - Update imports in web app

3. **Phase 2 (Mobile build):**
   - Create `packages/mobile/` with Expo
   - Import from `packages/shared/`
   - Build platform-specific UI components
   - 90%+ code reuse achieved

## Why This Beats Alternatives

### vs Flutter
- ❌ Different language (Dart) - no code sharing with web
- ❌ Different team skills needed
- ✅ Slightly better performance (but React Native is close)

### vs Pure Native (Swift/Kotlin)
- ❌ Zero code sharing
- ❌ Need 2 separate codebases + web
- ❌ 3x development time

### vs React Native Only (No Web)
- ❌ Web app as mobile wrapper (bad UX)
- ✅ Code sharing
- ❌ Poor SEO for landing page

### ✅ Next.js (Web) + React Native (Mobile)
- ✅ Best web experience (SEO, performance)
- ✅ Best mobile experience (native feel)
- ✅ 90%+ code sharing (business logic)
- ✅ One team, one language, modern stack

## Dependencies to Install (Web - Now)

```bash
# Already installed by create-next-app:
# - next, react, react-dom, typescript, tailwindcss

# Now install:
npm install zustand @tanstack/react-query axios
npm install react-hook-form @hookform/resolvers zod
npm install date-fns clsx tailwind-merge
npm install lucide-react recharts

# shadcn/ui (component library)
npx shadcn@latest init
```

## Summary

✅ **Modern stack (2025+):** Next.js 15, React 19, TypeScript 5
✅ **Mobile-ready:** 90%+ code reusable in React Native
✅ **Same libraries:** Zustand, TanStack Query, Zod work on both
✅ **Same styling:** Tailwind (web) → NativeWind (mobile)
✅ **Same team:** React developers build web + mobile
✅ **Future-proof:** Active ecosystems, long-term support
