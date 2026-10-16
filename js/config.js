/* ============================================================
   MERTEKS FRONTEND CONFIGURATION (Supabase)
   - supabaseUrl / supabaseKey: Project URL and *publishable* key.
     They are meant to be public; the database rules (RLS) protect the data.
     NEVER put a "secret" or "service_role" key here.
<<<<<<< HEAD
   - ایمیل مدیر دیگر اینجا نیست؛ در صفحهٔ admin.html وارد می‌شود.
   ============================================================ */
window.MERTEKS_CONFIG = Object.freeze({
  supabaseUrl: 'https://xpkckkosnnixshbarieo.supabase.co',
  supabaseKey: 'sb_publishable_TboHxYoN_qQLAzZTuRErvw_nbDP5TZW'
=======
   - adminEmail: the admin user created in Supabase > Authentication > Users.
   ============================================================ */
window.MERTEKS_CONFIG = Object.freeze({
  supabaseUrl: 'https://xpkckkosnnixshbarieo.supabase.co',
  supabaseKey: 'sb_publishable_TboHxYoN_qQLAzZTuRErvw_nbDP5TZW',
  adminEmail: 'mhmdsammtyy466@gmail.com'
>>>>>>> 150194eadc1104479a7c0205939f6ae9d9973594
});
