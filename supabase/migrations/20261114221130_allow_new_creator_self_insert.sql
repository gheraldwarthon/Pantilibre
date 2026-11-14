/*
# Allow new sellers to create their own creator profile

1. Purpose
   When a user registers as a seller ("creadora"), the app creates their profile
   and then a row in the `creators` catalog table so they appear in the feed,
   categories and VIP pages. The `creators` table had no INSERT policy, so this
   final step failed with a row-level-security error and the registration flow
   broke for new sellers.

2. Security changes
   - Add an INSERT policy on `public.creators` that only allows an
     authenticated user to create the catalog row that matches their own
     account id (auth.uid() = id). Admins keep their existing UPDATE policy;
     anon users still cannot write anything.
   - Existing grants already include INSERT for `authenticated`, so no new
     grants are needed.
*/

DROP POLICY IF EXISTS "creator_insert_own" ON creators;

CREATE POLICY "creator_insert_own"
ON creators FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
