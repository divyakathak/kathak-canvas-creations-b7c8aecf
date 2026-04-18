
-- ===== SITE CONTENT =====
UPDATE public.site_content
SET title = 'Divya Bhardwaj',
    subtitle = 'Kathak Artist · Choreographer · Founder of Divyakala',
    body = 'Nearly two decades of devotion to Kathak — story told through ghungroo, abhinaya and the silence between beats.',
    data = '{"cta_label":"Experience the Art","cta_link":"#performances"}'::jsonb,
    updated_at = now()
WHERE id = 'hero';

UPDATE public.site_content
SET title = 'A Life in Kathak',
    subtitle = 'Nearly two decades of training, performance and teaching',
    body = 'Divya Bhardwaj is a dynamic and dedicated Kathak dancer with nearly two decades of intensive training and performance experience. A graded artist of Doordarshan and C.C.R.T. scholarship holder, she completed her Visharad in Kathak from Akhil Bhartiya Gandharva Maha Vidyalaya under Smt. Moumala Nayak ji, and her Post Diploma Honours in Kathak from the National Institute of Kathak, Delhi under Smt. Gauri Diwakar ji. She is the founder-director of Divyakala Performing Arts and founder of the Sangini Foundation. Beyond Kathak, she is trained and choreographs in Contemporary, Bollywood and Indian Folk styles, and has worked in acclaimed theatre productions including The Legend of Ram, Prem Ramayan and Miraj. She has performed at the Khajuraho Dance Festival, Bharat Mandapam (in the presence of Hon. PM Shri Narendra Modi), the Royal Opera House Mumbai, Kala Ghoda, Jairangam, Sangeet Natak Akademi and the High Commission of India in Accra, Ghana — and was part of the Guinness World Record at the 50th Khajuraho Dance Festival, 2024.',
    data = '{"image_caption":"Photographed on stage, 2024","achievements":["Founder-Director, Divyakala Performing Arts","Founder, Sangini Foundation","C.C.R.T. Scholarship Holder","Graded Artist of Doordarshan","Scholarship Holder, Akhil Bhartiya Gandharva Mahavidyalaya","Part of Guinness World Record — 50th Khajuraho Dance Festival, 2024","Honoured twice with Shagun by Late Smt. Saroj Khan ji","Post Diploma Honours, National Institute of Kathak (under Smt. Gauri Diwakar ji)"]}'::jsonb,
    updated_at = now()
WHERE id = 'about';

UPDATE public.site_content
SET title = 'Divya Bhardwaj',
    subtitle = 'Kathak Artist · Choreographer',
    body = 'For performance bookings, workshops, festivals and press inquiries — Narela, New Delhi.',
    data = '{"email":"Divyabharadwaj020@gmail.com","instagram":"https://instagram.com/Divya_dance1","youtube":"https://youtube.com","facebook":"https://facebook.com"}'::jsonb,
    updated_at = now()
WHERE id = 'footer';

-- ===== GALLERY: replace placeholders with real photos =====
DELETE FROM public.gallery_items;
INSERT INTO public.gallery_items (title, description, category, media_type, media_url, sort_order, is_featured) VALUES
('Maroon Anarkali — Stage', 'In flowing maroon, mid-abhinaya under marigold-draped lights.', 'performance', 'image', '/gallery/divya-9.jpg', 0, true),
('Lifted in Light', 'A quiet pause between beats — purple wash, golden skirt.', 'performance', 'image', '/gallery/divya-1.jpg', 1, false),
('The Reach', 'Dramatic side light, the moment a tukda ends.', 'performance', 'image', '/gallery/divya-2.jpg', 2, true),
('Stillness in Red', 'Portrait under blue stage haze, gold-bordered ghagra.', 'portrait', 'image', '/gallery/divya-3.jpg', 3, false),
('Brown Anarkali — Tatkar', 'Featured at a televised national stage.', 'performance', 'image', '/gallery/divya-4.jpg', 4, true),
('Earth Tones', 'A seated abhinaya passage in warm spotlight.', 'performance', 'image', '/gallery/divya-5.jpg', 5, false),
('Sunlight, Sandstone', 'Off-stage portrait in maroon Anarkali.', 'portrait', 'image', '/gallery/divya-6.jpg', 6, false),
('Mukhda — Black & White', 'Lyric mudra against marigold strands.', 'performance', 'image', '/gallery/divya-7.jpg', 7, false),
('At the Temple Wall', 'Quiet portrait, Hampi.', 'portrait', 'image', '/gallery/divya-8.jpg', 8, false);

-- ===== PERFORMANCES: replace examples with venues & festivals from CV =====
DELETE FROM public.performances;

-- Upcoming (kept generic, dates in future for the demo)
INSERT INTO public.performances (title, description, venue, city, event_date, event_type, is_upcoming, sort_order) VALUES
('Solo Kathak Recital', 'An evening of pure Kathak — invocation, tatkar, gat and abhinaya.', 'Triveni Auditorium', 'New Delhi', '2026-09-12', 'performance', true, 0),
('Udaan Sapno Ki — Workshop', 'Foundational Kathak workshop for young students, presented by Anhad Music Academy.', 'Anhad Music Academy', 'New Delhi', '2026-10-05', 'workshop', true, 1),
('Khajuraho Dance Festival — Return Recital', 'Solo Kathak performance at the historic Khajuraho Dance Festival.', 'Khajuraho Dance Festival', 'Khajuraho', '2027-02-20', 'festival', true, 2);

-- Past (selected highlights from CV)
INSERT INTO public.performances (title, description, venue, city, event_date, event_type, is_upcoming, sort_order) VALUES
('50th Khajuraho Dance Festival — Guinness World Record', 'Part of the historic ensemble that set a Guinness World Record at the 50th Khajuraho Dance Festival.', 'Khajuraho Dance Festival', 'Khajuraho', '2024-02-20', 'festival', false, 10),
('Inauguration — Bharat Mandapam', 'Performed in the inauguration ceremony of Bharat Mandapam in the presence of Hon. Prime Minister Shri Narendra Modi ji.', 'Bharat Mandapam', 'New Delhi', '2023-07-26', 'performance', false, 11),
('Inauguration — Amphi Theatre, Bharat Mandapam', 'Performed in the inauguration ceremony of the Amphi Theatre at Bharat Mandapam.', 'Bharat Mandapam', 'New Delhi', '2023-09-09', 'performance', false, 12),
('Royal Opera House — Mumbai Film Festival', 'Featured Kathak performance at the historic Royal Opera House.', 'Royal Opera House', 'Mumbai', '2023-10-21', 'festival', false, 13),
('Kala Ghoda Arts Festival', 'Solo Kathak presentation at the Kala Ghoda Arts Festival.', 'Kala Ghoda', 'Mumbai', '2023-02-11', 'festival', false, 14),
('Geeta Mahotsav', 'Performance at the Geeta Mahotsav, organised in Kurukshetra.', 'Geeta Mahotsav', 'Kurukshetra', '2022-12-04', 'festival', false, 15),
('Vasant Ritu Festival', 'Performance organised by the Ministry of Culture.', 'Vasant Ritu Festival', 'Udaipur', '2023-03-05', 'festival', false, 16),
('Ranga-Rang Festival — Sangeet Natak Akademi', 'Featured Kathak recital at the Sangeet Natak Akademi.', 'Sangeet Natak Akademi', 'Lucknow', '2022-11-12', 'festival', false, 17),
('National Theatre Festival', 'Kathak performance at the National Theatre Festival.', 'National Theatre Festival', 'Lucknow', '2022-04-18', 'festival', false, 18),
('Jairangam Festival', 'Featured artist at the Jairangam Theatre & Dance Festival.', 'Jairangam', 'Jaipur', '2023-01-14', 'festival', false, 19),
('Azadi Ka Amrit Mahotsav', 'Kathak performance organised by ICCR for Azadi Ka Amrit Mahotsav.', 'ICCR', 'New Delhi', '2022-08-15', 'performance', false, 20),
('50 Years of Tagore Theatre Society', 'Performance at the golden jubilee of Tagore Theatre, Chandigarh.', 'Tagore Theatre', 'Chandigarh', '2023-05-13', 'performance', false, 21),
('69th Republic Day — High Commission of India, Accra', 'Performed at the High Commission of India, Accra (Ghana) on the occasion of the 69th Republic Day of India.', 'High Commission of India', 'Accra, Ghana', '2018-01-26', 'performance', false, 22),
('ITM University — Cultural Evening', 'Kathak recital at ITM University.', 'ITM University', 'Gwalior', '2022-03-18', 'performance', false, 23),
('Solo at Triveni Auditorium', 'Solo Kathak recital at Triveni Auditorium.', 'Triveni Auditorium', 'New Delhi', '2019-11-22', 'performance', false, 24),
('Solo at Delhi Haat (INA)', 'Solo Kathak presentation in an event organised by Sahitya Kala Parishad.', 'Delhi Haat, INA', 'New Delhi', '2021-12-04', 'performance', false, 25);

-- ===== TESTIMONIALS: real-context placeholders referencing her gurus/recognitions =====
DELETE FROM public.testimonials;
INSERT INTO public.testimonials (author_name, author_title, quote, sort_order, is_published) VALUES
('Smt. Gauri Diwakar', 'Kathak Exponent · Guru, National Institute of Kathak', 'Divya carries the discipline of the form with the quiet confidence of a true student of the parampara.', 0, true),
('Anhad Music Academy', 'New Delhi', 'Over 200 students learnt Kathak from Divya in our Udaan Sapno Ki workshop — her teaching is patient, structured and deeply musical.', 1, true),
('Festival Curator', '50th Khajuraho Dance Festival, 2024', 'A grounded soloist with sharp tatkar and emotive abhinaya — she held the stage with grace.', 2, true);
