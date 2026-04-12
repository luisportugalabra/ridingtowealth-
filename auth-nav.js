/**
 * Shared auth nav — checks localStorage for login token and updates the Sign In link.
 * Include this script on every page EXCEPT invest.html (which has its own full auth).
 */
(function() {
  const SUPABASE_URL = 'https://efiyeiwdywodjxxnslvu.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_IccFybhqHU9RM5rc-Em1KA_G5Dsrqha';

  const link = document.querySelector('.btn-sub');
  if (!link) return;

  const token = localStorage.getItem('rtw_token');
  if (!token) return; // not logged in, keep "Sign In" as-is

  // Check if token is still valid
  fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { 'Authorization': 'Bearer ' + token, 'apikey': SUPABASE_KEY }
  })
  .then(r => { if (!r.ok) throw new Error(); return r.json(); })
  .then(user => {
    const name = user.email.split('@')[0];
    const isPaid = user.user_metadata && user.user_metadata.is_paid === true;
    link.textContent = name;
    if (isPaid) {
      link.innerHTML = name + ' <span style="font-size:0.55rem;font-weight:700;padding:2px 6px;background:#b8965a;color:#0a0a0a;border-radius:4px;letter-spacing:0.08em;margin-left:4px;vertical-align:middle">PRO</span>';
    }
    link.href = '#';
    link.onclick = function(e) {
      e.preventDefault();
      localStorage.removeItem('rtw_token');
      localStorage.removeItem('rtw_refresh');
      window.location.reload();
    };
    link.title = 'Click to sign out';
  })
  .catch(() => {
    // Token expired/invalid — clean up
    localStorage.removeItem('rtw_token');
    localStorage.removeItem('rtw_refresh');
  });
})();
