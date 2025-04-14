# Plan to Fix Import Errors

This plan outlines the steps to resolve the import errors identified in the project related to `Button`, `Card`, `CardDescription`, and `authOptions`.

**Goal:** Correct all identified import errors across the relevant files.

**Detailed Steps:**

1.  **Correct `Button` Imports:**
    *   **Issue:** `Button` is exported as a named export (`export { Button }`) from `components/ui/button.tsx` but is incorrectly imported using the default import syntax (`import Button from ...`) in several files.
    *   **Fix:** Modify the import statements in the affected files to use named import syntax: `import { Button } from '@/components/ui/button';`
    *   **Affected Files (Examples based on search):**
        *   `pages/admin-ketabyar-control/index.tsx`
        *   `components/ui/data-table-view-options.tsx`
        *   `components/layout/sidebar.tsx`
        *   `components/layout/site-header.tsx`
        *   `components/home/trending-books.tsx`
        *   *(Potentially others)*

2.  **Correct `Card` Imports:**
    *   **Issue:** `Card` is exported as the default export (`export default function Card`) from `components/ui/card.tsx` but is incorrectly imported using named import syntax (`import { Card, ... } from ...`) or via separate import statements in many files.
    *   **Fix:** Modify the import statements:
        *   Change `import { Card, CardContent, ... } from '@/components/ui/card';` to `import Card, { CardContent, ... } from '@/components/ui/card';`
        *   Consolidate separate imports like `import Card from ...` and `import { CardContent, ... } from ...` into a single statement: `import Card, { CardContent, ... } from '@/components/ui/card';`
    *   **Affected Files (Examples based on search):**
        *   `v2/components/vocabulary/vocabulary-page.tsx`
        *   `src/components/library/book-grid.tsx`
        *   `components/reader/TranslationOverlay.tsx`
        *   `components/user/UserApiManager.tsx`
        *   `components/reading/ReadingProgress.tsx`
        *   `components/profile/profile-form.tsx`
        *   `components/home/app-features.tsx`
        *   `components/home/popular-categories.tsx`
        *   `components/home/features-section.tsx`
        *   `components/categories/categories-client.tsx`
        *   `components/categories/category-grid.tsx`
        *   `components/dashboard/reading-stats.tsx`
        *   `components/admin/ApiKeyManager.tsx`
        *   `components/admin/dashboard-stats.tsx`
        *   `components/admin/TranslationPromptManager.tsx`
        *   `components/admin/ErrorLogViewer.tsx`
        *   `components/admin/book-form.tsx`
        *   `app/translate/page.tsx`
        *   `app/profile/page.tsx`
        *   `app/books/[slug]/page.tsx`
        *   `app/bookmarks/page.tsx`
        *   `app/auth/register/page.tsx`
        *   `app/auth/verify/page.tsx`
        *   `app/auth/login/page.tsx`
        *   `app/admin-secure-dashboard-xyz123/page.tsx`
        *   *(Potentially others)*

3.  **Address `CardDescription` Imports:**
    *   **Issue:** `CardDescription` is imported from `components/ui/card.tsx` (`import { ..., CardDescription, ... } from ...`), but it is *not* exported from that file.
    *   **Fix:** Remove `CardDescription` from the import statements originating from `components/ui/card.tsx`. Replace its usage with `CardContent` where appropriate, as confirmed. If `CardContent` is not already part of the same import statement, add it.
    *   **Affected Files (Examples based on search):**
        *   `components/profile/profile-form.tsx`
        *   `components/home/features-section.tsx`
        *   `components/admin/dashboard-stats.tsx`
        *   `components/admin/book-form.tsx`
        *   `app/profile/page.tsx`
        *   `app/auth/register/page.tsx`
        *   `app/auth/verify/page.tsx`
        *   `app/auth/login/page.tsx`

4.  **Correct `authOptions` Imports:**
    *   **Issue:** `authOptions` is imported from `lib/auth.ts` (`import { authOptions } from '@/lib/auth'`), but the actual export in that file is `authConfig`.
    *   **Fix:** Modify the import statements to use the correct export name: `import { authConfig } from '@/lib/auth';`
    *   **Affected Files (Examples based on search):**
        *   `app/dashboard/page.tsx`
        *   `app/api/auth/[...nextauth]/route.ts`
        *   `app/api/auth/session/route.ts`
        *   `app/api/profile/route.ts`
        *   `app/api/gemini/route.ts`
        *   `app/api/gemini/prompts/route.ts`
        *   `app/api/books/upload/route.ts`
        *   `app/api/gemini/errors/route.ts`
        *   `app/admin-secure-dashboard-xyz123/layout.tsx`
        *   `app/admin-secure-dashboard-xyz123/page.tsx`
        *   `app/admin-secure-dashboard-xyz123/books/actions.ts`
        *   `app/admin/page.tsx`
        *   `app/admin/login/page.tsx`
        *   `app/admin/layout.tsx`
        *   *(Potentially others)*

**Next Step:** Switch to "Code" mode to implement these changes.