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
    // Replace the Sign In link with user info + a separate Sign Out link
    var parent = link.parentNode;
    // User badge
    link.innerHTML = name.toUpperCase() + (isPaid ? ' <span style="font-size:0.55rem;font-weight:700;padding:2px 6px;background:#b8965a;color:#0a0a0a;border-radius:4px;letter-spacing:0.08em;margin-left:4px;vertical-align:middle">PRO</span>' : '');
    link.href = '#';
    link.onclick = function(e) { e.preventDefault(); };
    link.style.cursor = 'default';
    link.style.borderColor = isPaid ? '#b8965a' : '#fff';
    // Sign Out link (separate element)
    var signout = document.createElement('a');
    signout.textContent = 'Sign Out';
    signout.href = '#';
    signout.style.cssText = 'font-size:0.68rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#666;cursor:pointer;margin-left:12px;transition:color 0.2s;';
    signout.onmouseover = function() { this.style.color = '#fff'; };
    signout.onmouseout = function() { this.style.color = '#666'; };
    signout.onclick = function(e) {
      e.preventDefault();
      localStorage.removeItem('rtw_token');
      localStorage.removeItem('rtw_refresh');
      window.location.reload();
    };
    parent.appendChild(signout);
  })
  .catch(() => {
    // Token expired — try refresh
    var refreshToken = localStorage.getItem('rtw_refresh');
    if (refreshToken) {
      fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(data) {
        localStorage.setItem('rtw_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('rtw_refresh', data.refresh_token);
        window.location.reload();
      })
      .catch(function() {
        localStorage.removeItem('rtw_token');
        localStorage.removeItem('rtw_refresh');
      });
    } else {
      localStorage.removeItem('rtw_token');
      localStorage.removeItem('rtw_refresh');
    }
  });
})();
