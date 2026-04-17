
-- =========================================
-- ROLES SYSTEM (security best practice)
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SHARED updated_at trigger
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- SITE CONTENT (singleton bio / about / hero text)
-- =========================================
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,           -- e.g. 'hero', 'about', 'footer'
  title TEXT,
  subtitle TEXT,
  body TEXT,
  media_url TEXT,
  data JSONB DEFAULT '{}'::jsonb, -- arbitrary structured fields (achievements list, etc)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_site_content_updated
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- GALLERY (photos + videos)
-- =========================================
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'performance', -- performance, portrait, workshop, etc
  media_type TEXT NOT NULL CHECK (media_type IN ('image','video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_category ON public.gallery_items(category);
CREATE INDEX idx_gallery_sort ON public.gallery_items(sort_order);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery is publicly readable"
  ON public.gallery_items FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert gallery"
  ON public.gallery_items FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery"
  ON public.gallery_items FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery"
  ON public.gallery_items FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_gallery_updated
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- PERFORMANCES (events, shows, workshops)
-- =========================================
CREATE TABLE public.performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT,
  city TEXT,
  event_date DATE,
  event_type TEXT NOT NULL DEFAULT 'performance', -- performance, workshop, festival
  poster_url TEXT,
  ticket_url TEXT,
  is_upcoming BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_performances_date ON public.performances(event_date DESC);
CREATE INDEX idx_performances_upcoming ON public.performances(is_upcoming);

ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Performances are publicly readable"
  ON public.performances FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert performances"
  ON public.performances FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update performances"
  ON public.performances FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete performances"
  ON public.performances FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_performances_updated
  BEFORE UPDATE ON public.performances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- TESTIMONIALS
-- =========================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_title TEXT,
  quote TEXT NOT NULL,
  avatar_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published testimonials are public"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_testimonials_updated
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- INQUIRIES (contact + booking forms)
-- =========================================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type TEXT NOT NULL DEFAULT 'contact' CHECK (inquiry_type IN ('contact','booking')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  event_date DATE,
  venue TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiries_created ON public.inquiries(created_at DESC);
CREATE INDEX idx_inquiries_unread ON public.inquiries(is_read);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit inquiries"
  ON public.inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY "Admins can read inquiries"
  ON public.inquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inquiries"
  ON public.inquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete inquiries"
  ON public.inquiries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- STORAGE BUCKET for media uploads
-- =========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

CREATE POLICY "Media is publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
