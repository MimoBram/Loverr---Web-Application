-- Loverr — starter quiz question bank
-- Matches the categories shown on the Quiz Interaction screen's category
-- tabs in High-Fi (Umum / Kenangan / Masa Depan / Random).

insert into public.quiz_questions (category, question_text, sort_order) values
  ('umum', 'Apa warna favorit pasanganmu?', 1),
  ('umum', 'Apa makanan favorit pasanganmu?', 2),
  ('umum', 'Apa film atau series favorit pasanganmu?', 3),
  ('umum', 'Apa hobi yang paling sering dilakukan pasanganmu?', 4),
  ('kenangan', 'Kapan pertama kali kalian bertemu?', 1),
  ('kenangan', 'Apa kencan pertama kalian?', 2),
  ('kenangan', 'Momen apa yang paling berkesan tahun ini?', 3),
  ('kenangan', 'Apa hadiah favorit yang pernah kamu terima dari pasanganmu?', 4),
  ('masa depan', 'Kemana kalian ingin liburan bersama tahun depan?', 1),
  ('masa depan', 'Apa satu hal yang ingin kalian capai bersama?', 2),
  ('masa depan', 'Bagaimana kalian membayangkan rumah impian kalian?', 3),
  ('random', 'Kalau jadi hewan, pasanganmu jadi hewan apa?', 1),
  ('random', 'Apa lagu yang paling mengingatkanmu pada pasanganmu?', 2),
  ('random', 'Apa kebiasaan lucu pasanganmu?', 3)
on conflict do nothing;
