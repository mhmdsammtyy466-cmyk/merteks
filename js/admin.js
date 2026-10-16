(function () {
'use strict';
var D = document, W = window;
function $(id) { return D.getElementById(id); }
function qa(sel, root) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
var CFG = W.MERTEKS_CONFIG || {};
var API = String(CFG.supabaseUrl || '').replace(/\/+$/, '');
var KEY = CFG.supabaseKey || '';
var BUCKET = 'projects';
var TOK_KEY = 'mx_adm_tok';
var IDLE_MS = 5 * 60 * 1000;
var STATUSES = ['جدید', 'در حال بررسی', 'در حال انجام', 'انجام شد', 'لغو شد'];
var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ESC[c]; }); }
function fa(n) { return Number(n).toLocaleString('fa-IR'); }
function budgetText(b) { b = String(b == null ? '' : b).trim(); if (!b) return 'اعلام نشده'; return /^\d+$/.test(b) ? fa(b) + ' تومان' : b; }
function dateFa(iso) { var d = new Date(iso); return isNaN(d.getTime()) ? String(iso || '') : d.toLocaleString('fa-IR'); }
function norm(s) {
return String(s == null ? '' : s).toLowerCase()
.replace(/[\u06F0-\u06F9]/g, function (d) { return String(d.charCodeAt(0) - 0x06F0); })
.replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x0660); })
.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\s]+/g, ' ').trim();
}
var toastEl = $('adToast'), toastT;
function toast(msg) {
toastEl.textContent = msg; toastEl.classList.add('show');
clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
}
function csvCell(v) {
var s = String(v == null ? '' : v);
if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
return '"' + s.replace(/"/g, '""') + '"';
}
function csv(rows) { return '\uFEFF' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n'); }
function download(name, type, data) {
var url = URL.createObjectURL(new Blob([data], { type: type }));
var a = D.createElement('a'); a.href = url; a.download = name;
D.body.appendChild(a); a.click();
setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 200);
}
function reportDoc(title, body) {
return '<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><title>' + esc(title) + '</title>' +
'<style>body{font-family:Tahoma,Arial,sans-serif;line-height:1.9;padding:24px;color:#111}.order{border:1px solid #ccc;border-radius:10px;padding:12px 16px;margin:0 0 14px;page-break-inside:avoid}h1{font-size:22px}h2{font-size:16px;margin:0 0 6px}p{margin:3px 0}</style>' +
'</head><body><h1>' + esc(title) + '</h1>' + body + '</body></html>';
}
function printHtml(html) {
var w = W.open('', '_blank', 'width=900,height=700');
if (!w) { toast('اجازهٔ باز شدن پنجرهٔ جدید را فعال کنید'); return; }
w.document.open(); w.document.write(html); w.document.close();
w.focus(); setTimeout(function () { w.print(); }, 500);
}
function getTok() { try { return sessionStorage.getItem(TOK_KEY) || ''; } catch (e) { return ''; } }
function setTok(t) { try { t ? sessionStorage.setItem(TOK_KEY, t) : sessionStorage.removeItem(TOK_KEY); } catch (e) {} }
function sb(method, path, o) {
o = o || {};
var h = { apikey: KEY };
var t = getTok();
if (o.auth !== false && t) h.Authorization = 'Bearer ' + t;
var body;
if (o.raw !== undefined) { body = o.raw; h['Content-Type'] = o.type; }
else if (o.json !== undefined) { body = JSON.stringify(o.json); h['Content-Type'] = 'application/json'; }
if (o.prefer) h.Prefer = o.prefer;
var ctl = W.AbortController ? new AbortController() : null;
var timer = ctl ? setTimeout(function () { ctl.abort(); }, o.timeout || 30000) : null;
return fetch(API + path, { method: method, headers: h, body: body, cache: 'no-store', signal: ctl ? ctl.signal : undefined })
.then(function (r) {
if (timer) clearTimeout(timer);
return r.text().then(function (txt) {
var d = null; try { d = txt ? JSON.parse(txt) : null; } catch (e) { d = txt; }
if (r.status === 401 && o.auth !== false && getTok()) { logout('نشست مدیر تمام شد؛ دوباره وارد شوید'); }
return { ok: r.ok, status: r.status, data: d };
});
}, function (err) { if (timer) clearTimeout(timer); throw err; });
}
function errText(res) {
var d = res.data;
return (d && typeof d === 'object' && (d.message || d.msg || d.error_description || d.error)) || ('خطای سرور (' + res.status + ')');
}
var idleTimer;
function touch() {
clearTimeout(idleTimer);
if (!getTok()) return;
idleTimer = setTimeout(function () { logout('به‌دلیل بی‌فعالیتی از پنل خارج شدید'); }, IDLE_MS);
}
['click', 'keydown', 'pointerdown', 'touchstart', 'scroll'].forEach(function (ev) { D.addEventListener(ev, touch, { passive: true }); });
function showApp(on) {
$('adLogin').hidden = on;
$('adApp').hidden = !on;
D.title = on ? 'پنل مدیریت مرتکس' : 'ورود به پنل مدیریت';
}
function logout(msg) {
setTok(''); clearTimeout(idleTimer);
state.orders = []; state.chatRows = null; state.projects = null; state.comments = null;
['orderList', 'chatList', 'projList', 'commentList'].forEach(function (id) { $(id).innerHTML = ''; });
$('adPass').value = '';
showApp(false);
if (msg) toast(msg);
}
var loginForm = $('adLoginForm'), loginErr = $('adLoginError');
if (CFG.adminEmail) $('adEmail').value = CFG.adminEmail;
function loginFail(msg) {
loginErr.textContent = '✕ ' + msg; loginErr.hidden = false;
loginForm.classList.remove('ad-shake'); void loginForm.offsetWidth; loginForm.classList.add('ad-shake');
$('adPass').select();
}
$('adPassToggle').addEventListener('click', function () {
var p = $('adPass'), show = p.type === 'password';
p.type = show ? 'text' : 'password';
this.setAttribute('aria-pressed', String(show));
});
loginForm.addEventListener('submit', function (e) {
e.preventDefault();
loginErr.hidden = true;
var email = $('adEmail').value.trim(), pass = $('adPass').value;
if (!email || !pass) return;
if (!API || !KEY) { loginFail('اتصال به سرور تنظیم نشده است (js/config.js)'); return; }
var btn = $('adLoginBtn'); btn.disabled = true; btn.textContent = 'در حال بررسی…';
function reset() { btn.disabled = false; btn.textContent = 'ورود'; }
sb('POST', '/auth/v1/token?grant_type=password', { auth: false, json: { email: email, password: pass } }).then(function (res) {
var d = res.data;
if (res.ok && d && d.access_token) {
setTok(d.access_token);
return sb('POST', '/rest/v1/rpc/is_admin', { json: {} }).then(function (r2) {
reset();
if (r2.ok && r2.data === true) { $('adPass').value = ''; enter(); }
else { setTok(''); loginFail('این حساب دسترسی مدیر ندارد'); }
});
}
reset();
var code = d && typeof d === 'object' ? (d.error_code || d.code || '') : '';
if (res.status === 429) loginFail('تلاش‌های زیاد بود؛ چند دقیقه بعد دوباره امتحان کنید');
else if (code === 'invalid_credentials') loginFail('ایمیل یا رمز عبور اشتباه است');
else if (code === 'email_not_confirmed') loginFail('ایمیل این کاربر در Supabase تأیید نشده است');
else loginFail('ورود انجام نشد' + (code ? ' (' + code + ')' : ''));
}, function () { reset(); loginFail('اتصال به سرور برقرار نشد'); });
});
var state = { orders: [], chatRows: null, projects: null, comments: null, tab: 'orders' };
function switchTab(name) {
state.tab = name;
qa('.ad-tab').forEach(function (t) { var on = t.getAttribute('data-tab') === name; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', String(on)); });
$('paneOrders').hidden = name !== 'orders';
$('paneChats').hidden = name !== 'chats';
$('paneProjects').hidden = name !== 'projects';
$('paneComments').hidden = name !== 'comments';
if (name === 'chats' && !state.chatRows) loadChats();
if (name === 'projects' && !state.projects) loadProjects();
if (name === 'comments' && !state.comments) loadComments();
}
qa('.ad-tab').forEach(function (t) { t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); }); });
$('adLogout').addEventListener('click', function () { logout('از پنل خارج شدید'); });
$('adRefresh').addEventListener('click', function () {
if (state.tab === 'orders') loadOrders(); else if (state.tab === 'chats') loadChats(); else if (state.tab === 'comments') loadComments(); else loadProjects();
});
function enter() { showApp(true); touch(); switchTab('orders'); loadOrders(); }
var filterSel = $('orderFilter');
STATUSES.forEach(function (s) { var o = D.createElement('option'); o.value = s; o.textContent = s; filterSel.appendChild(o); });
var baseTitle = 'پنل مدیریت مرتکس', unseen = 0, orderSig = '';
function sigOf(list) { return list.map(function (o) { return o.id + ':' + o.status; }).join('|'); }
function setUnseen(n) { unseen = n; D.title = (n ? '(' + n + ') سفارش جدید · ' : '') + baseTitle; }
D.addEventListener('visibilitychange', function () { if (D.visibilityState === 'visible') { setUnseen(0); pollOrders(); } });
function pollOrders() {
if (!getTok() || state.tab !== 'orders') return;
sb('GET', '/rest/v1/orders?select=id,created_at,name,phone,service,budget,description,status&order=created_at.desc&limit=1000').then(function (res) {
if (!getTok() || !res.ok || !Array.isArray(res.data)) return;
var known = {}; state.orders.forEach(function (o) { known[o.id] = 1; });
var fresh = res.data.filter(function (o) { return !known[o.id]; }).length;
if (sigOf(res.data) === orderSig) return;
state.orders = res.data; orderSig = sigOf(res.data); renderOrders();
if (fresh) { toast(fa(fresh) + ' سفارش جدید رسید'); if (D.visibilityState !== 'visible') setUnseen(unseen + fresh); }
}, function () {});
}
setInterval(pollOrders, 60000);
function loadOrders() {
$('orderList').innerHTML = '<div class="ad-empty">در حال بارگذاری…</div>';
sb('GET', '/rest/v1/orders?select=id,created_at,name,phone,service,budget,description,status&order=created_at.desc&limit=1000').then(function (res) {
if (!getTok()) return;
if (!res.ok || !Array.isArray(res.data)) { $('orderList').innerHTML = '<div class="ad-empty">بارگذاری سفارش‌ها انجام نشد: ' + esc(errText(res)) + '</div>'; return; }
state.orders = res.data; orderSig = sigOf(res.data); renderOrders();
}, function () { $('orderList').innerHTML = '<div class="ad-empty">اتصال به سرور برقرار نشد.</div>'; });
}
function renderOrders() {
var all = state.orders, fresh = 0, done = 0;
all.forEach(function (o) { if (o.status === 'جدید') fresh++; if (o.status === 'انجام شد') done++; });
$('orderStats').innerHTML =
'<div class="ad-stat"><strong>' + fa(all.length) + '</strong><span>کل سفارش‌ها</span></div>' +
'<div class="ad-stat"><strong>' + fa(fresh) + '</strong><span>سفارش جدید</span></div>' +
'<div class="ad-stat"><strong>' + fa(done) + '</strong><span>انجام شده</span></div>';
var q = norm($('orderSearch').value), st = filterSel.value;
var list = all.filter(function (o) {
if (st && o.status !== st) return false;
return !q || norm([o.name, o.phone, o.id, o.service, o.description].join(' ')).indexOf(q) > -1;
});
if (!list.length) { $('orderList').innerHTML = '<div class="ad-empty">' + (all.length ? 'موردی با این فیلتر پیدا نشد.' : 'هنوز سفارشی ثبت نشده است.') + '</div>'; return; }
$('orderList').innerHTML = list.map(function (o) {
return '<article class="ad-item' + (o.status === 'جدید' ? ' is-new' : '') + '">' +
'<div class="ad-item-head"><div><strong>' + esc(o.name) + '</strong><div class="ad-id">' + esc(o.id) + ' · ' + esc(dateFa(o.created_at)) + '</div></div>' +
'<select class="ad-select ad-status" data-status="' + esc(o.id) + '" aria-label="وضعیت سفارش">' +
STATUSES.map(function (s) { return '<option' + (o.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></div>' +
'<div class="ad-meta"><span><b>تلفن:</b> <a href="tel:' + esc(o.phone) + '">' + esc(o.phone) + '</a></span><span><b>خدمت:</b> ' + esc(o.service) + '</span><span><b>بودجه:</b> ' + esc(budgetText(o.budget)) + '</span></div>' +
'<div class="ad-desc">' + esc(o.description) + '</div>' +
'<div class="ad-row-actions"><button class="ad-btn ad-danger" type="button" data-del="' + esc(o.id) + '">حذف سفارش</button></div></article>';
}).join('');
}
$('orderSearch').addEventListener('input', renderOrders);
filterSel.addEventListener('change', renderOrders);
$('orderList').addEventListener('change', function (e) {
var sel = e.target.closest('[data-status]');
if (!sel) return;
var id = sel.getAttribute('data-status'), val = sel.value;
var item = state.orders.filter(function (o) { return o.id === id; })[0];
var old = item && item.status;
sel.disabled = true;
sb('PATCH', '/rest/v1/orders?id=eq.' + encodeURIComponent(id), { json: { status: val }, prefer: 'return=representation' }).then(function (res) {
sel.disabled = false;
if (res.ok && Array.isArray(res.data) && res.data.length) { if (item) item.status = val; renderOrders(); toast('وضعیت سفارش تغییر کرد'); }
else { sel.value = old; toast('تغییر وضعیت انجام نشد: ' + (res.ok ? 'سفارش پیدا نشد' : errText(res))); }
}, function () { sel.disabled = false; sel.value = old; toast('اتصال به سرور برقرار نشد'); });
});
$('orderList').addEventListener('click', function (e) {
var b = e.target.closest('[data-del]');
if (!b) return;
if (!W.confirm('این سفارش حذف شود؟')) return;
var id = b.getAttribute('data-del'); b.disabled = true;
sb('DELETE', '/rest/v1/orders?id=eq.' + encodeURIComponent(id), { prefer: 'return=representation' }).then(function (res) {
if (res.ok) { state.orders = state.orders.filter(function (o) { return o.id !== id; }); renderOrders(); toast('سفارش حذف شد'); }
else { b.disabled = false; toast('حذف انجام نشد: ' + errText(res)); }
}, function () { b.disabled = false; toast('اتصال به سرور برقرار نشد'); });
});
$('orderClear').addEventListener('click', function () {
if (!state.orders.length) { toast('سفارشی برای حذف وجود ندارد'); return; }
if (!W.confirm('همهٔ سفارش‌ها حذف شوند؟ این کار قابل برگشت نیست.')) return;
sb('DELETE', '/rest/v1/orders?id=not.is.null', { prefer: 'return=minimal' }).then(function (res) {
if (res.ok) { state.orders = []; renderOrders(); toast('همهٔ سفارش‌ها حذف شدند'); } else toast('حذف انجام نشد: ' + errText(res));
}, function () { toast('اتصال به سرور برقرار نشد'); });
});
function loadChats() {
$('chatList').innerHTML = '<div class="ad-empty">در حال بارگذاری…</div>';
sb('GET', '/rest/v1/chats?select=chat_id,name,phone,device,question,answer,at,type&order=at.asc&limit=5000').then(function (res) {
if (!getTok()) return;
if (!res.ok || !Array.isArray(res.data)) { $('chatList').innerHTML = '<div class="ad-empty">بارگذاری گفتگوها انجام نشد: ' + esc(errText(res)) + '</div>'; return; }
state.chatRows = res.data; renderChats();
}, function () { $('chatList').innerHTML = '<div class="ad-empty">اتصال به سرور برقرار نشد.</div>'; });
}
function groupChats() {
var map = {}, order = [];
(state.chatRows || []).forEach(function (r) {
var k = r.phone || r.chat_id;
var c = map[k];
if (!c) { c = map[k] = { key: k, name: r.name, phone: r.phone, device: r.device, first: r.at, last: r.at, msgs: [] }; order.push(c); }
if (r.name) c.name = r.name;
if (r.device) c.device = r.device;
if (r.at > c.last) c.last = r.at;
if (r.type === 'message') c.msgs.push({ at: r.at, q: r.question, a: r.answer });
});
return order.sort(function (a, b) { return a.last < b.last ? 1 : -1; });
}
function renderChats() {
var chats = groupChats(), today = new Date().toDateString(), q = 0, act = 0;
chats.forEach(function (c) { q += c.msgs.length; if (new Date(c.last).toDateString() === today) act++; });
$('chatStats').innerHTML =
'<div class="ad-stat"><strong>' + fa(chats.length) + '</strong><span>کل گفتگوها</span></div>' +
'<div class="ad-stat"><strong>' + fa(q) + '</strong><span>سؤال کاربران</span></div>' +
'<div class="ad-stat"><strong>' + fa(act) + '</strong><span>فعال امروز</span></div>';
var s = norm($('chatSearch').value);
var list = chats.filter(function (c) {
return !s || norm(c.name + ' ' + c.phone + ' ' + c.msgs.map(function (m) { return m.q + ' ' + m.a; }).join(' ')).indexOf(s) > -1;
});
if (!list.length) { $('chatList').innerHTML = '<div class="ad-empty">' + (chats.length ? 'موردی پیدا نشد.' : 'هنوز گفتگویی با دستیار ثبت نشده است.') + '</div>'; return; }
$('chatList').innerHTML = list.map(function (c) {
return '<article class="ad-item"><div class="ad-item-head"><div><strong>' + esc(c.name || 'بدون نام') + '</strong>' +
'<div class="ad-id">' + fa(c.msgs.length) + ' پیام</div></div>' + (c.phone ? '<a class="ad-id" href="tel:' + esc(c.phone) + '">' + esc(c.phone) + '</a>' : '<span class="ad-id">بدون شماره</span>') + '</div>' +
'<div class="ad-meta"><span><b>شروع:</b> ' + esc(dateFa(c.first)) + '</span><span><b>آخرین پیام:</b> ' + esc(dateFa(c.last)) + '</span><span><b>دستگاه:</b> ' + esc(c.device || 'نامشخص') + '</span></div>' +
'<div class="ad-msgs">' + (c.msgs.map(function (m) {
return '<div class="ad-msg q"><small>👤 ' + esc(c.name) + ' · ' + esc(dateFa(m.at)) + '</small>' + esc(m.q) + '</div>' +
'<div class="ad-msg a"><small>🤖 ربات</small>' + esc(m.a) + '</div>';
}).join('') || '<div class="ad-muted">هنوز پیامی ارسال نشده است.</div>') + '</div></article>';
}).join('');
}
$('chatSearch').addEventListener('input', renderChats);
function clearSiteCache() { try { ['mx_projects_v2', 'mx_projects_v3', 'mx_projects_v4'].forEach(function (k) { sessionStorage.removeItem(k); }); } catch (e) {} }
function publicUrl(key) { return API + '/storage/v1/object/public/' + BUCKET + '/' + String(key).split('/').map(encodeURIComponent).join('/'); }
function thumbKey(key) { return /\.webp$/.test(key) ? key.slice(0, -5) + '-t.webp' : key; }
function loadProjects() {
$('projList').innerHTML = '<div class="ad-empty">در حال بارگذاری…</div>';
var q = function (cols) { return sb('GET', '/rest/v1/projects?select=' + cols + ',project_images(key,pos)&order=created_at.desc&limit=200', { auth: false }); };
q('id,name,description,url,created_at').then(function (r) { return r.ok && Array.isArray(r.data) ? r : q('id,name,created_at'); }).then(function (res) {
if (!res.ok || !Array.isArray(res.data)) { $('projList').innerHTML = '<div class="ad-empty">بارگذاری پروژه‌ها انجام نشد: ' + esc(errText(res)) + '</div>'; return; }
state.projects = res.data.map(function (p) {
var im = (p.project_images || []).slice().sort(function (a, b) { return a.pos - b.pos; });
return { id: p.id, name: p.name, description: p.description || '', url: p.url || '', createdAt: p.created_at, keys: im.map(function (x) { return x.key; }) };
});
renderProjects();
}, function () { $('projList').innerHTML = '<div class="ad-empty">اتصال به سرور برقرار نشد.</div>'; });
}
function renderProjects() {
var list = state.projects || [];
if (!list.length) { $('projList').innerHTML = '<div class="ad-empty">هنوز پروژه‌ای اضافه نشده است.</div>'; return; }
$('projList').innerHTML = list.map(function (p) {
var cover = p.keys[0];
return '<article class="ad-item ad-proj">' +
(cover ? '<img src="' + esc(publicUrl(thumbKey(cover))) + '" data-full="' + esc(publicUrl(cover)) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' : '<span></span>') +
'<div><strong>' + esc(p.name) + '</strong><span class="ad-muted">' + fa(p.keys.length) + ' عکس · ' + esc(new Date(p.createdAt).toLocaleDateString('fa-IR')) + '</span>' +
(p.description ? '<div class="ad-muted">' + esc(p.description) + '</div>' : '') + (p.url ? '<div class="ad-id">' + esc(p.url) + '</div>' : '') + '</div>' +
'<button class="ad-btn ad-danger" type="button" data-pdel="' + esc(p.id) + '">حذف پروژه</button></article>';
}).join('');
qa('img[data-full]', $('projList')).forEach(function (img) {
img.addEventListener('error', function () { var f = img.getAttribute('data-full'); if (f && img.src !== f) img.src = f; });
});
}
$('projList').addEventListener('click', function (e) {
var b = e.target.closest('[data-pdel]');
if (!b) return;
if (!W.confirm('این پروژه و همهٔ عکس‌های آن حذف شود؟')) return;
var id = b.getAttribute('data-pdel'), p = (state.projects || []).filter(function (x) { return x.id === id; })[0];
if (!p) return;
b.disabled = true;
var keys = p.keys.slice();
if (keys[0]) keys.push(thumbKey(keys[0]));
keys = keys.filter(function (k, i) { return keys.indexOf(k) === i; });
sb('DELETE', '/storage/v1/object/' + BUCKET, { json: { prefixes: keys } }).then(function (r1) {
if (!r1.ok) throw new Error(errText(r1));
return sb('DELETE', '/rest/v1/projects?id=eq.' + encodeURIComponent(id), { prefer: 'return=minimal' });
}).then(function (r2) {
if (!r2.ok) throw new Error(errText(r2));
state.projects = state.projects.filter(function (x) { return x.id !== id; });
clearSiteCache();
renderProjects(); toast('پروژه حذف شد');
}).catch(function (err) { b.disabled = false; toast('حذف انجام نشد: ' + (err && err.message || 'خطا')); });
});
var picked = [], previewUrls = [];
function clearPreview() { previewUrls.forEach(function (u) { URL.revokeObjectURL(u); }); previewUrls = []; $('projPreview').innerHTML = ''; }
function showPicked() {
clearPreview();
$('projInfo').textContent = picked.length ? fa(picked.length) + ' عکس انتخاب شده است.' : 'هنوز عکسی انتخاب نشده است.';
picked.slice(0, 30).forEach(function (f) {
var u = URL.createObjectURL(f); previewUrls.push(u);
var im = D.createElement('img'); im.src = u; im.alt = 'پیش‌نمایش'; im.decoding = 'async'; $('projPreview').appendChild(im);
});
}
$('projFiles').addEventListener('change', function () {
var files = Array.prototype.slice.call(this.files || []).filter(function (f) { return /^image\//.test(f.type); });
if (files.length > 30) { toast('حداکثر ۳۰ عکس مجاز است'); files = files.slice(0, 30); }
picked = files; showPicked();
});
$('projReset').addEventListener('click', function () { picked = []; $('projFiles').value = ''; $('projName').value = ''; $('projDesc').value = ''; $('projUrl').value = ''; showPicked(); });
function loadImg(file) {
return new Promise(function (resolve, reject) {
var u = URL.createObjectURL(file), im = new Image();
im.onload = function () { URL.revokeObjectURL(u); resolve(im); };
im.onerror = function () { URL.revokeObjectURL(u); reject(new Error('خواندن تصویر ناموفق بود')); };
im.src = u;
});
}
function encode(img, max, q) {
var scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
var w = Math.max(1, Math.round(img.naturalWidth * scale)), h = Math.max(1, Math.round(img.naturalHeight * scale));
var c = D.createElement('canvas'); c.width = w; c.height = h;
c.getContext('2d').drawImage(img, 0, 0, w, h);
return new Promise(function (resolve, reject) {
c.toBlob(function (b) {
if (b && b.type === 'image/webp') return resolve(b);
c.toBlob(function (j) { j ? resolve(j) : reject(new Error('فشرده‌سازی تصویر ناموفق بود')); }, 'image/jpeg', q);
}, 'image/webp', q);
});
}
function setProgress(n, total, label) {
var box = $('projProgress'); box.hidden = false;
box.firstElementChild.style.width = Math.round((n / total) * 100) + '%';
box.lastElementChild.textContent = label;
}
$('projForm').addEventListener('submit', function (e) {
e.preventDefault();
var name = $('projName').value.trim();
if (!name) { toast('نام پروژه را وارد کنید'); return; }
if (picked.length < 1) { toast('حداقل یک عکس انتخاب کنید'); return; }
if (picked.length > 30) { toast('حداکثر ۳۰ عکس مجاز است'); return; }
var btn = $('projSave'); btn.disabled = true;
var pid = null, uploaded = [], total = picked.length;
function rollback(err) {
var undo = Promise.resolve();
if (uploaded.length) undo = sb('DELETE', '/storage/v1/object/' + BUCKET, { json: { prefixes: uploaded } }).catch(function () {});
if (pid) undo = undo.then(function () { return sb('DELETE', '/rest/v1/projects?id=eq.' + encodeURIComponent(pid), { prefer: 'return=minimal' }).catch(function () {}); });
return undo.then(function () { throw err; });
}
function upload(key, blob) {
return sb('POST', '/storage/v1/object/' + BUCKET + '/' + key, { raw: blob, type: blob.type, timeout: 120000 }).then(function (r) {
if (!r.ok) throw new Error('آپلود عکس ناموفق بود: ' + errText(r));
uploaded.push(key);
});
}
var desc = $('projDesc').value.trim(), url = $('projUrl').value.trim();
if (url && !/^https?:\/\//i.test(url)) { btn.disabled = false; toast('لینک باید با http:// یا https:// شروع شود'); return; }
setProgress(0, total, 'در حال ساخت پروژه…');
var createP = sb('POST', '/rest/v1/projects', { json: { name: name, description: desc || null, url: url || null }, prefer: 'return=representation' }).then(function (r) {
if (r.ok) return r;
if (!desc && !url) return r;
toast('برای ذخیرهٔ توضیح و لینک، فایل migration-portfolio.sql را در Supabase اجرا کنید');
return sb('POST', '/rest/v1/projects', { json: { name: name }, prefer: 'return=representation' });
});
createP.then(function (r) {
if (!r.ok || !Array.isArray(r.data) || !r.data[0]) throw new Error('ساخت پروژه ناموفق بود: ' + errText(r));
pid = r.data[0].id;
return picked.reduce(function (chain, file, i) {
return chain.then(function () {
setProgress(i, total, 'عکس ' + fa(i + 1) + ' از ' + fa(total) + '…');
return loadImg(file).then(function (img) {
return encode(img, 1800, 0.82).then(function (full) {
var ext = full.type === 'image/webp' ? 'webp' : 'jpg';
var key = pid + '/' + i + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
return upload(key, full).then(function () {
if (i === 0 && ext === 'webp') {
return encode(img, 640, 0.8).then(function (th) { return upload(thumbKey(key), th); });
}
}).then(function () {
return sb('POST', '/rest/v1/project_images', { json: { project_id: pid, pos: i, key: key }, prefer: 'return=minimal' }).then(function (r2) {
if (!r2.ok) throw new Error('ثبت عکس ناموفق بود: ' + errText(r2));
});
});
});
});
});
}, Promise.resolve());
}).catch(rollback).then(function () {
setProgress(total, total, 'انجام شد');
toast('پروژه با موفقیت اضافه شد');
clearSiteCache();
$('projReset').click(); state.projects = null; loadProjects();
setTimeout(function () { $('projProgress').hidden = true; }, 1200);
}, function (err) {
$('projProgress').hidden = true;
toast(err && err.message ? err.message : 'ذخیرهٔ پروژه انجام نشد؛ دوباره امتحان کنید');
}).then(function () { btn.disabled = false; });
});
function loadComments() {
$('commentList').innerHTML = '<div class="ad-empty">در حال بارگذاری…</div>';
sb('GET', '/rest/v1/project_comments?select=id,project_id,name,body,created_at,projects(name)&order=created_at.desc&limit=1000').then(function (res) {
if (!getTok()) return;
if (!res.ok || !Array.isArray(res.data)) {
$('commentList').innerHTML = '<div class="ad-empty">' + (res.status === 404 ? 'جدول نظرات ساخته نشده؛ فایل supabase/migration-comments.sql را در Supabase اجرا کنید.' : 'بارگذاری نظرات انجام نشد: ' + esc(errText(res))) + '</div>';
return;
}
state.comments = res.data; renderComments();
}, function () { $('commentList').innerHTML = '<div class="ad-empty">اتصال به سرور برقرار نشد.</div>'; });
}
function renderComments() {
var all = state.comments || [], today = new Date().toDateString(), td = 0, names = {};
all.forEach(function (c) { if (new Date(c.created_at).toDateString() === today) td++; if (c.projects && c.projects.name) names[c.project_id] = 1; });
$('commentStats').innerHTML =
'<div class="ad-stat"><strong>' + fa(all.length) + '</strong><span>کل نظرها</span></div>' +
'<div class="ad-stat"><strong>' + fa(td) + '</strong><span>نظرهای امروز</span></div>' +
'<div class="ad-stat"><strong>' + fa(Object.keys(names).length) + '</strong><span>پروژهٔ دارای نظر</span></div>';
var q = norm($('commentSearch').value);
var list = all.filter(function (c) {
return !q || norm([c.name, c.body, c.projects && c.projects.name].join(' ')).indexOf(q) > -1;
});
if (!list.length) { $('commentList').innerHTML = '<div class="ad-empty">' + (all.length ? 'موردی پیدا نشد.' : 'هنوز نظری ثبت نشده است.') + '</div>'; return; }
$('commentList').innerHTML = list.map(function (c) {
return '<article class="ad-item"><div class="ad-item-head"><div><strong>' + esc(c.name) + '</strong>' +
'<div class="ad-id">' + esc(dateFa(c.created_at)) + '</div></div>' +
'<span class="ad-muted">پروژه: <b>' + esc((c.projects && c.projects.name) || 'حذف‌شده') + '</b></span></div>' +
'<div class="ad-desc">' + esc(c.body) + '</div>' +
'<div class="ad-row-actions"><button class="ad-btn ad-danger" type="button" data-cdel="' + esc(c.id) + '">حذف نظر</button></div></article>';
}).join('');
}
$('commentSearch').addEventListener('input', renderComments);
$('commentList').addEventListener('click', function (e) {
var b = e.target.closest('[data-cdel]');
if (!b) return;
if (!W.confirm('این نظر حذف شود؟')) return;
var id = b.getAttribute('data-cdel'); b.disabled = true;
sb('DELETE', '/rest/v1/project_comments?id=eq.' + encodeURIComponent(id), { prefer: 'return=representation' }).then(function (res) {
if (res.ok && Array.isArray(res.data) && res.data.length) {
state.comments = state.comments.filter(function (c) { return String(c.id) !== id; });
clearSiteCache(); renderComments(); toast('نظر حذف شد');
} else { b.disabled = false; toast('حذف انجام نشد: ' + (res.ok ? 'نظر پیدا نشد' : errText(res))); }
}, function () { b.disabled = false; toast('اتصال به سرور برقرار نشد'); });
});
function orderRowsHtml(list) {
return list.map(function (o) {
return '<div class="order"><h2>' + esc(o.name || 'بدون نام') + '</h2>' +
'<p><b>شمارهٔ سفارش:</b> ' + esc(o.id) + '</p><p><b>تاریخ:</b> ' + esc(dateFa(o.created_at)) + '</p>' +
'<p><b>تلفن:</b> ' + esc(o.phone) + '</p><p><b>نوع سفارش:</b> ' + esc(o.service) + '</p>' +
'<p><b>بودجه:</b> ' + esc(budgetText(o.budget)) + '</p><p><b>وضعیت:</b> ' + esc(o.status) + '</p>' +
'<p><b>توضیحات:</b><br>' + esc(o.description || '') + '</p></div>';
}).join('');
}
function chatRowsHtml(chats) {
return chats.map(function (c) {
return '<div class="order"><h2>' + esc(c.name || 'بدون نام') + ' — ' + esc(c.phone) + '</h2>' +
'<p><b>شروع:</b> ' + esc(dateFa(c.first)) + ' · <b>آخرین پیام:</b> ' + esc(dateFa(c.last)) + '</p>' +
c.msgs.map(function (m) {
return '<p><b>' + esc(c.name || 'کاربر') + '</b> (' + esc(dateFa(m.at)) + '): ' + esc(m.q) + '</p><p><b>ربات:</b> ' + esc(m.a) + '</p>';
}).join('') + '</div>';
}).join('');
}
var EXPORTS = {
'orders-json': function () { download('merteks-orders.json', 'application/json;charset=utf-8', JSON.stringify(state.orders, null, 2)); },
'orders-csv': function () {
var h = ['id', 'created_at', 'name', 'phone', 'service', 'budget', 'description', 'status'];
download('merteks-orders.csv', 'text/csv;charset=utf-8', csv([h].concat(state.orders.map(function (o) { return h.map(function (k) { return o[k]; }); }))));
},
'orders-word': function () { download('merteks-orders.doc', 'application/msword;charset=utf-8', '\uFEFF' + reportDoc('گزارش سفارش‌ها', '<p>تعداد: ' + state.orders.length + '</p>' + orderRowsHtml(state.orders))); },
'orders-pdf': function () { printHtml(reportDoc('گزارش سفارش‌ها', '<p>تعداد: ' + state.orders.length + '</p>' + orderRowsHtml(state.orders))); },
'chats-csv': function () {
var rows = [['phone', 'name', 'device', 'time', 'question', 'answer']];
groupChats().forEach(function (c) { c.msgs.forEach(function (m) { rows.push([c.phone, c.name, c.device, m.at, m.q, m.a]); }); });
download('merteks-chats.csv', 'text/csv;charset=utf-8', csv(rows));
},
'chats-word': function () { download('merteks-chats.doc', 'application/msword;charset=utf-8', '\uFEFF' + reportDoc('گزارش گفتگوهای دستیار', chatRowsHtml(groupChats()))); }
};
D.addEventListener('click', function (e) {
var b = e.target.closest('[data-export]');
if (!b) return;
var name = b.getAttribute('data-export');
if (name.indexOf('chats') === 0 && !state.chatRows) { toast('ابتدا تب گفتگوها را باز کنید'); return; }
var fn = EXPORTS[name];
if (fn) fn();
});
if (getTok()) {
sb('POST', '/rest/v1/rpc/is_admin', { json: {} }).then(function (r) {
if (r.ok && r.data === true) enter(); else { setTok(''); showApp(false); }
}, function () { showApp(false); });
}
W.addEventListener('pagehide', function () { clearPreview(); });
})();
