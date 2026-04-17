
-- Replace permissive inquiry insert with validation-based check
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.inquiries;

CREATE POLICY "Anyone can submit valid inquiries"
  ON public.inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND char_length(message) BETWEEN 1 AND 5000
    AND (subject IS NULL OR char_length(subject) <= 200)
    AND (phone IS NULL OR char_length(phone) <= 30)
    AND (venue IS NULL OR char_length(venue) <= 200)
  );

-- Storage: gallery media must be readable by URL but we don't want anonymous listing of bucket contents.
-- Files are still served publicly via their URLs (bucket is public). We just remove the broad SELECT
-- on storage.objects so unauthenticated users can't enumerate via the API.
DROP POLICY IF EXISTS "Media is publicly viewable" ON storage.objects;

-- Allow listing/select only to admins (for the dashboard). Public reads still work via signed/public URLs
-- because the bucket itself is public.
CREATE POLICY "Admins can list media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
