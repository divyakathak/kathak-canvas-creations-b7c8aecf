INSERT INTO public.user_roles (user_id, role)
VALUES ('bbcc38ff-b80f-4de1-8188-95df086fe46d', 'admin')
ON CONFLICT DO NOTHING;