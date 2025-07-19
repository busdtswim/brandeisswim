# TypeScript Migration Guide

## Overview
This document outlines the TypeScript migration for the Brandeis Swim project. The migration has been partially completed with core infrastructure in place.

## Completed Tasks ✅

### 1. TypeScript Configuration
- ✅ Created `tsconfig.json` with comprehensive configuration
- ✅ Removed `jsconfig.json`
- ✅ Added TypeScript dependencies to `package.json`
- ✅ Created `next-env.d.ts` for Next.js types

### 2. Type Definitions
- ✅ Created `src/types/index.ts` with comprehensive type definitions
- ✅ Added types for all major entities (User, Swimmer, Instructor, Lesson, etc.)
- ✅ Added form types, API response types, and component prop types
- ✅ Added NextAuth type extensions for proper authentication typing

### 3. Utility Files Converted
- ✅ `src/lib/utils.js` → `src/lib/utils.ts`
- ✅ `src/utils/dateUtils.js` → `src/utils/dateUtils.ts`
- ✅ `src/utils/timeUtils.js` → `src/utils/timeUtils.ts`
- ✅ `src/utils/formatUtils.js` → `src/utils/formatUtils.ts`
- ✅ `src/utils/timezoneUtils.js` → `src/utils/timezoneUtils.ts`

### 4. Core Components Converted
- ✅ `src/components/ui/button.js` → `src/components/ui/button.tsx`
- ✅ `src/components/ui/accordion.jsx` → `src/components/ui/accordion.tsx`
- ✅ `src/components/Header.js` → `src/components/Header.tsx`
- ✅ `src/components/Footer.js` → `src/components/Footer.tsx`
- ✅ `src/components/LoginForm.js` → `src/components/LoginForm.tsx`
- ✅ `src/components/ContactForm.js` → `src/components/ContactForm.tsx`

### 5. Admin Components Converted
- ✅ `src/components/AdminSideBar.js` → `src/components/AdminSideBar.tsx`

### 6. Customer Components Converted
- ✅ `src/components/CustomerSideBar.js` → `src/components/CustomerSideBar.tsx`

### 7. Layout Files Converted
- ✅ `src/app/layout.js` → `src/app/layout.tsx`
- ✅ `src/app/providers.js` → `src/app/providers.tsx`

### 8. Authentication Setup
- ✅ Created `src/lib/auth.ts` with proper NextAuth configuration
- ✅ Converted NextAuth route to TypeScript
- ✅ Fixed authentication type issues

### 9. API Routes Converted
- ✅ `src/app/api/auth/[...nextauth]/route.js` → `src/app/api/auth/[...nextauth]/route.ts`
- ✅ `src/app/api/auth/contact/route.js` → `src/app/api/auth/contact/route.ts`
- ✅ `src/app/api/auth/admin/stats/route.js` → `src/app/api/auth/admin/stats/route.ts`

### 10. API Utilities Created
- ✅ Created `src/lib/api-utils.ts` with typed API utilities
- ✅ Added helper functions for common API patterns
- ✅ Added authentication and authorization helpers
- ✅ Added request/response type utilities

## Remaining Tasks 📋

### High Priority Files to Convert

#### App Pages
- [ ] `src/app/page.js` → `src/app/page.tsx`
- [ ] `src/app/contact/page.js` → `src/app/contact/page.tsx`
- [ ] `src/app/register/page.js` → `src/app/register/page.tsx`
- [ ] `src/app/login/page.js` → `src/app/login/page.tsx`
- [ ] `src/app/lessons/page.js` → `src/app/lessons/page.tsx`
- [ ] `src/app/forgot-password/page.js` → `src/app/forgot-password/page.tsx`
- [ ] `src/app/reset-password/page.js` → `src/app/reset-password/page.tsx`

#### Admin Pages
- [ ] `src/app/admin/page.js` → `src/app/admin/page.tsx`
- [ ] `src/app/admin/layout.js` → `src/app/admin/layout.tsx`
- [ ] `src/app/admin/add-instructor/page.js` → `src/app/admin/add-instructor/page.tsx`
- [ ] `src/app/admin/content/page.js` → `src/app/admin/content/page.tsx`
- [ ] `src/app/admin/create-lessons/page.js` → `src/app/admin/create-lessons/page.tsx`
- [ ] `src/app/admin/view-schedule/page.js` → `src/app/admin/view-schedule/page.tsx`
- [ ] `src/app/admin/waitlist/page.js` → `src/app/admin/waitlist/page.tsx`

#### Customer Pages
- [ ] `src/app/customer/page.js` → `src/app/customer/page.tsx`
- [ ] `src/app/customer/layout.js` → `src/app/customer/layout.tsx`
- [ ] `src/app/customer/view-schedule/page.js` → `src/app/customer/view-schedule/page.tsx`

#### API Routes
- [ ] `src/app/api/auth/admin/add/route.js` → `src/app/api/auth/admin/add/route.ts`
- [ ] `src/app/api/auth/admin/add/[id]/route.js` → `src/app/api/auth/admin/add/[id]/route.ts`
- [ ] `src/app/api/auth/admin/content/route.js` → `src/app/api/auth/admin/content/route.ts`
- [ ] `src/app/api/auth/admin/content/[section]/route.js` → `src/app/api/auth/admin/content/[section]/route.ts`
- [ ] `src/app/api/auth/admin/create/route.js` → `src/app/api/auth/admin/create/route.ts`
- [ ] `src/app/api/auth/admin/lessons/[id]/route.js` → `src/app/api/auth/admin/lessons/[id]/route.ts`
- [ ] `src/app/api/auth/admin/stats/classes/route.js` → `src/app/api/auth/admin/stats/classes/route.ts`
- [ ] `src/app/api/auth/admin/stats/users/route.js` → `src/app/api/auth/admin/stats/users/route.ts`
- [ ] `src/app/api/auth/admin/stats/waitlist/route.js` → `src/app/api/auth/admin/stats/waitlist/route.ts`
- [ ] `src/app/api/auth/admin/swimmers/route.js` → `src/app/api/auth/admin/swimmers/route.ts`
- [ ] `src/app/api/auth/admin/swimmers/[id]/route.js` → `src/app/api/auth/admin/swimmers/[id]/route.ts`
- [ ] `src/app/api/auth/admin/users/route.js` → `src/app/api/auth/admin/users/route.ts`
- [ ] `src/app/api/auth/admin/users/[id]/route.js` → `src/app/api/auth/admin/users/[id]/route.ts`
- [ ] `src/app/api/auth/admin/waitlist/route.js` → `src/app/api/auth/admin/waitlist/route.ts`
- [ ] `src/app/api/auth/admin/waitlist/[id]/route.js` → `src/app/api/auth/admin/waitlist/[id]/route.ts`
- [ ] `src/app/api/auth/customer/password/route.js` → `src/app/api/auth/customer/password/route.ts`
- [ ] `src/app/api/auth/customer/profile/route.js` → `src/app/api/auth/customer/profile/route.ts`
- [ ] `src/app/api/auth/customer/schedule/route.js` → `src/app/api/auth/customer/schedule/route.ts`
- [ ] `src/app/api/auth/customer/schedule/[lessonId]/route.js` → `src/app/api/auth/customer/schedule/[lessonId]/route.ts`
- [ ] `src/app/api/auth/customer/swimmers/route.js` → `src/app/api/auth/customer/swimmers/route.ts`
- [ ] `src/app/api/auth/forgot-password/route.js` → `src/app/api/auth/forgot-password/route.ts`
- [ ] `src/app/api/auth/lesson-register/register/route.js` → `src/app/api/auth/lesson-register/register/route.ts`
- [ ] `src/app/api/auth/lesson-register/slots/route.js` → `src/app/api/auth/lesson-register/slots/route.ts`
- [ ] `src/app/api/auth/lesson-register/swimmers/route.js` → `src/app/api/auth/lesson-register/swimmers/route.ts`
- [ ] `src/app/api/auth/lessons/assign/[classId]/route.js` → `src/app/api/auth/lessons/assign/[classId]/route.ts`
- [ ] `src/app/api/auth/lessons/classes/route.js` → `src/app/api/auth/lessons/classes/route.ts`
- [ ] `src/app/api/auth/lessons/exceptions/[id]/route.js` → `src/app/api/auth/lessons/exceptions/[id]/route.ts`
- [ ] `src/app/api/auth/lessons/instructors/route.js` → `src/app/api/auth/lessons/instructors/route.ts`
- [ ] `src/app/api/auth/lessons/notify-instructor/route.js` → `src/app/api/auth/lessons/notify-instructor/route.ts`
- [ ] `src/app/api/auth/lessons/payment/route.js` → `src/app/api/auth/lessons/payment/route.ts`
- [ ] `src/app/api/auth/lessons/remove-swimmer/route.js` → `src/app/api/auth/lessons/remove-swimmer/route.ts`
- [ ] `src/app/api/auth/logout/route.js` → `src/app/api/auth/logout/route.ts`
- [ ] `src/app/api/auth/register/route.js` → `src/app/api/auth/register/route.ts`
- [ ] `src/app/api/auth/reset-password/route.js` → `src/app/api/auth/reset-password/route.ts`
- [ ] `src/app/api/auth/waitlist/join/route.js` → `src/app/api/auth/waitlist/join/route.ts`
- [ ] `src/app/api/auth/waitlist/status/route.js` → `src/app/api/auth/waitlist/status/route.ts`
- [ ] `src/app/api/content/route.js` → `src/app/api/content/route.ts`

#### Components
- [ ] `src/components/RegistrationForm.js` → `src/components/RegistrationForm.tsx`
- [ ] `src/components/ResetPasswordForm.js` → `src/components/ResetPasswordForm.tsx`
- [ ] `src/components/ForgotPasswordForm.js` → `src/components/ForgotPasswordForm.tsx`
- [ ] `src/components/ModernHomePage.js` → `src/components/ModernHomePage.tsx`
- [ ] `src/components/LessonRegistration.js` → `src/components/LessonRegistration.tsx`
- [ ] `src/components/AdminDashboard.js` → `src/components/AdminDashboard.tsx`
- [ ] `src/components/CustomerDashboard.js` → `src/components/CustomerDashboard.tsx`
- [ ] `src/components/CreateLessons.js` → `src/components/CreateLessons.tsx`
- [ ] `src/components/AddInstructors.js` → `src/components/AddInstructors.tsx`
- [ ] `src/components/ContentEditor.js` → `src/components/ContentEditor.tsx`
- [ ] `src/components/ViewSchedule.js` → `src/components/ViewSchedule.tsx`
- [ ] `src/components/ViewUserSchedule.js` → `src/components/ViewUserSchedule.tsx`
- [ ] `src/components/ViewWaitlist.js` → `src/components/ViewWaitlist.tsx`
- [ ] `src/components/UserSchedule.js` → `src/components/UserSchedule.tsx`
- [ ] `src/components/ClassSchedule.js` → `src/components/ClassSchedule.tsx`
- [ ] `src/components/EditableContent.js` → `src/components/EditableContent.tsx`
- [ ] `src/components/ExceptionDates.js` → `src/components/ExceptionDates.tsx`
- [ ] `src/components/EditExceptionModal.js` → `src/components/EditExceptionModal.tsx`
- [ ] All other components in `src/components/**/*.js`

## Migration Process

### For Each File:

1. **Rename**: Change extension from `.js`/`.jsx` to `.ts`/`.tsx`
2. **Add Types**: Import types from `@/types` and add proper type annotations
3. **Fix Imports**: Update import paths to use `.ts`/`.tsx` extensions where needed
4. **Add Props Interfaces**: Create interfaces for component props
5. **Type Functions**: Add parameter and return types to functions
6. **Handle API Routes**: Add proper request/response types for API routes

### Common Patterns:

#### Component Props
```typescript
interface ComponentProps {
  prop1: string;
  prop2?: number;
  children?: React.ReactNode;
}

export default function Component({ prop1, prop2, children }: ComponentProps) {
  // component logic
}
```

#### API Route Handlers
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse, createErrorResponse, requireAdmin } from '@/lib/api-utils';
import type { TypedApiResponse } from '@/lib/api-utils';

export async function GET(request: NextRequest): Promise<NextResponse<TypedApiResponse<YourDataType>>> {
  try {
    // Check authorization
    const authError = requireAdmin(session);
    if (authError) {
      return createErrorResponse(authError, 401);
    }

    // Your logic here
    const data = await someOperation();
    
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse('Operation failed');
  }
}
```

#### Page Components
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};

export default function Page() {
  // page logic
}
```

## TypeScript Configuration

The `tsconfig.json` includes:
- Strict type checking enabled
- Path mapping for clean imports
- Next.js plugin configuration
- ES2020 target with modern features

## Established Patterns

### Component Patterns
- Use `React.FC` for functional components
- Define interfaces for component props
- Use proper event handler types (`ChangeEvent`, `FormEvent`, etc.)
- Use proper state typing with generics

### API Route Patterns
- Use `TypedApiResponse<T>` for consistent API responses
- Use `createSuccessResponse()` and `createErrorResponse()` helpers
- Use `requireAdmin()`, `requireCustomer()`, `requireAuth()` for authorization
- Use `parseRequestBody()` for request validation
- Use `handleApiOperation()` for async operations

### Form Patterns
- Use Formik with proper typing
- Define form value interfaces
- Use proper validation schemas with Yup
- Handle form submission with proper error typing

### State Management Patterns
- Use proper useState typing with generics
- Define interfaces for complex state objects
- Use proper loading and error state types

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Notes

- The migration maintains backward compatibility during the transition
- All existing functionality should work as before
- Type errors will be shown during development to guide the migration
- Some `any` types may be used temporarily during migration and should be refined later

## Next Steps

1. Continue converting files in priority order
2. Run `npm run type-check` regularly to identify type issues
3. Gradually replace `any` types with proper types
4. Add more specific type definitions as needed
5. Update tests to work with TypeScript 