
/* ============================================================
   SOURCE BLOCK: merteks-assistant-radial-rays-script
   ============================================================ */
(function(){
  function setupAssistantRadial(){
    var fab=document.getElementById('mxAiFab');
    if(!fab) return;

    /* فقط یک ساختار تمیز: ربات + خطوط شعاعی */
    var robot=fab.querySelector('.mx-assistant-robot');
    if(!robot){
      var current=fab.textContent.trim();
      fab.innerHTML='';
      robot=document.createElement('span');
      robot.className='mx-assistant-robot';
      robot.setAttribute('aria-hidden','true');
      robot.textContent='🤖';
      fab.appendChild(robot);
    }

    var rays=fab.querySelector('.mx-assistant-rays');
    if(!rays){
      rays=document.createElement('span');
      rays.className='mx-assistant-rays';
      rays.setAttribute('aria-hidden','true');
      var count=10;
      for(var i=0;i<count;i++){
        var ray=document.createElement('span');
        ray.className='mx-assistant-ray';
        ray.style.setProperty('--ray-angle',(i*(360/count))+'deg');
        ray.style.setProperty('--ray-delay',(-i*0.09)+'s');
        rays.appendChild(ray);
      }
      fab.insertBefore(rays,robot);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',setupAssistantRadial);
  }else{
    setupAssistantRadial();
  }
  setTimeout(setupAssistantRadial,100);
  setTimeout(setupAssistantRadial,500);
  setTimeout(setupAssistantRadial,1200);
})();


/* ============================================================
   SOURCE BLOCK: merteks-performance-background
   ============================================================ */
(function(){
  /* Performance mode: the animated WebGL background is replaced by the
     existing CSS gradients. The visual language stays the same while the
     continuous GPU loop is removed. */
  var canvas=document.getElementById("nlGl");
  if(canvas){canvas.style.display="none";canvas.setAttribute("aria-hidden","true");}
  document.documentElement.classList.add("mx-css-background");
})();


/* ============================================================
   SOURCE BLOCK: inline-script-3
   ============================================================ */
(function(){
 'use strict';
 var $=function(id){return document.getElementById(id)};
 var links=$('links'),menuBtn=$('menuBtn');


 menuBtn.addEventListener('click',function(){
 var open=links.classList.toggle('open');
 menuBtn.setAttribute('aria-expanded',String(open));
 });
 links.querySelectorAll('a').forEach(function(a){
 a.addEventListener('click',function(){
 links.classList.remove('open');
 menuBtn.setAttribute('aria-expanded','false');
 });
 });

 /* progress and back-to-top share one scroll listener */
 var progress=$('progress'),backTop=$('backTop');
 function onScroll(){
 var h=document.documentElement.scrollHeight-window.innerHeight;
 progress.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
 backTop.classList.toggle('show',window.scrollY>560);
 }
 window.addEventListener('scroll',onScroll,{passive:true});
 window.addEventListener('resize',onScroll,{passive:true});
 onScroll();
 backTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

 var items=document.querySelectorAll('.reveal');
 if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(entries){
 entries.forEach(function(e){
 if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}
 });
 },{threshold:.12,rootMargin:'0px 0px -36px 0px'});
 items.forEach(function(el){io.observe(el)});
 }else{
 items.forEach(function(el){el.classList.add('show')});
 }

 /* mark the section currently being read */
 var navLinks=Array.prototype.slice.call(links.querySelectorAll('a'));
 var ids=['home','about','projects','services','contact'];
 if('IntersectionObserver' in window){
 var spy=new IntersectionObserver(function(entries){
 entries.forEach(function(e){
 if(!e.isIntersecting)return;
 navLinks.forEach(function(a){
 a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id);
 });
 });
 },{rootMargin:'-44% 0px -52% 0px'});
 ids.forEach(function(id){var s=$(id);if(s)spy.observe(s)});
 }

 var toast=$('toast'),toastTimer;
 function showToast(msg){
 toast.textContent=msg;
 toast.classList.add('show');
 clearTimeout(toastTimer);
 toastTimer=setTimeout(function(){toast.classList.remove('show')},1900);
 }

 /* ---- dark / light ---- */
 var themeBtn=$('themeBtn');
 function applyTheme(light){
 document.body.classList.toggle('light',light);
 themeBtn.textContent=light?'☀':'☾';
 themeBtn.setAttribute('aria-pressed',String(light));
 var meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.setAttribute('content',light?'#f7f9fd':'#0b1220');
 }
 var startLight=true;
 try{startLight=localStorage.getItem('sam-theme')==='light'}catch(e){}
 applyTheme(startLight);
 themeBtn.addEventListener('click',function(){
 var light=!document.body.classList.contains('light');
 applyTheme(light);
 try{localStorage.setItem('sam-theme',light?'light':'dark')}catch(e){}
 showToast(light?'حالت روشن فعال شد':'حالت تاریک فعال شد');
 });

 /* ---- project modal ---- */
 var modal=$('projectModal'),modalClose=$('modalClose'),
 modalTitle=$('modalTitle'),modalText=$('modalText'),modalTags=$('modalTags');
 var projectData={
 personal:{title:'وب‌سایت شخصی',text:'پرتفولیویی مدرن با تمرکز روی هویت شخصی، تایپوگرافی خوانا، انیمیشن‌های ظریف و تجربه کاربری روان.',tags:['HTML','CSS','JavaScript','Responsive']},
 dashboard:{title:'داشبورد هوشمند',text:'یک رابط داده‌محور برای نمایش اطلاعات و ابزارهای هوشمند با ساختار منظم، کارت‌های تعاملی و ظاهر حرفه‌ای.',tags:['UI/UX','Python','AI','Dashboard']},
 landing:{title:'لندینگ پیج',text:'صفحه‌ای سریع و واکنش‌گرا با ساختار واضح، دعوت به اقدام مناسب و جزئیات بصری برای جلب توجه کاربر.',tags:['Frontend','UX','Responsive','CTA']}
 };
 var lastFocused=null;
 function openModal(key){
 var d=projectData[key];
 if(!d)return;
 lastFocused=document.activeElement;
 modalTitle.textContent=d.title;
 modalText.textContent=d.text;
 modalTags.innerHTML=d.tags.map(function(t){return '<span class="tag">'+t+'</span>'}).join('');
 modal.classList.add('open');
 modal.setAttribute('aria-hidden','false');
 modalClose.focus();
 }
 function closeModal(){
 modal.classList.remove('open');
 modal.setAttribute('aria-hidden','true');
 if(lastFocused&&lastFocused.focus)lastFocused.focus();
 }
 document.querySelectorAll('[data-project]').forEach(function(btn){
 btn.addEventListener('click',function(){openModal(btn.getAttribute('data-project'))});
 });
 modalClose.addEventListener('click',closeModal);
 modal.addEventListener('click',function(e){if(e.target.getAttribute('data-close'))closeModal()});
 document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){
 closeModal();
 links.classList.remove('open');
 menuBtn.setAttribute('aria-expanded','false');
 }
 });

 /* ---- ultra motion: pointer glow, tilt, magnetic buttons, particles ---- */
 var isTouch = window.matchMedia('(hover: none)').matches;
 var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

 if(!isTouch && !reduced){
 var root=document.documentElement;
 var pointerTick=false;
 window.addEventListener('pointermove',function(e){
 if(pointerTick)return;
 pointerTick=true;
 requestAnimationFrame(function(){
 root.style.setProperty('--mx',e.clientX+'px');
 root.style.setProperty('--my',e.clientY+'px');
 pointerTick=false;
 });
 },{passive:true});

 document.querySelectorAll('.hero-showcase').forEach(function(el){
 el.addEventListener('pointermove',function(e){
 var r=el.getBoundingClientRect();
 var x=(e.clientX-r.left)/r.width-.5;
 var y=(e.clientY-r.top)/r.height-.5;
 el.style.transform='perspective(1000px) rotateX('+(-y*2.8)+'deg) rotateY('+(x*3.8)+'deg) translateY(-2px)';
 });
 el.addEventListener('pointerleave',function(){
 el.style.transform='';
 });
 });

 document.querySelectorAll('.card,.project,.service,.step,.stat,.social').forEach(function(el){
 el.addEventListener('pointermove',function(e){
 var r=el.getBoundingClientRect();
 var x=(e.clientX-r.left)/r.width-.5;
 var y=(e.clientY-r.top)/r.height-.5;
 el.style.transform='perspective(900px) rotateX('+(-y*2.2)+'deg) rotateY('+(x*3)+'deg) translateY(-8px) scale(1.012)';
 });
 el.addEventListener('pointerleave',function(){el.style.transform=''});
 });

 document.querySelectorAll('.btn,.tool-btn').forEach(function(btn){
 btn.addEventListener('pointermove',function(e){
 var r=btn.getBoundingClientRect();
 var x=e.clientX-r.left, y=e.clientY-r.top;
 btn.style.setProperty('--bx',x+'px');
 btn.style.setProperty('--by',y+'px');
 var dx=(x/r.width-.5)*8, dy=(y/r.height-.5)*8;
 btn.style.transform='translate('+dx+'px,'+dy+'px) translateY(-2px)';
 });
 btn.addEventListener('pointerleave',function(){btn.style.transform=''});
 });
 }

 /* contact phone dropdown: close when clicking outside */
 document.querySelectorAll('.phone-menu').forEach(function(menu){
 document.addEventListener('click',function(e){
 if(!menu.contains(e.target)) menu.removeAttribute('open');
 });
 });

 /* extra micro-interaction for clickable elements */
 document.querySelectorAll('.social,.btn,.tool-btn,.more').forEach(function(el){
 el.addEventListener('click',function(){
 el.classList.remove('tap-pop');
 void el.offsetWidth;
 el.classList.add('tap-pop');
 });
 });

 /* nav reacts to scroll */
 var nav=document.querySelector('.nav');
 if(nav){
 var updateNav=function(){nav.classList.toggle('scrolled',window.scrollY>18)};
 window.addEventListener('scroll',updateNav,{passive:true});
 updateNav();
 }

})();

// Extra visible micro-interactions
document.addEventListener('click', e => {
 const target=e.target.closest('.btn,.social,.project-card,.member-card');
 if(!target) return;
 target.classList.remove('tap-pop'); void target.offsetWidth; target.classList.add('tap-pop');
});


/* ============================================================
   SOURCE BLOCK: inline-script-4
   ============================================================ */
(() => {
 document.querySelectorAll('a, button, .social, .project-card, .member-card').forEach(el => {
 el.classList.add('fx-ripple');
 el.addEventListener('pointerdown', () => {
 el.animate(
 [{transform:'scale(1)'},{transform:'scale(.975)'},{transform:'scale(1)'}],
 {duration:260, easing:'cubic-bezier(.2,1.4,.4,1)'}
 );
 }, {passive:true});
 });

 const floaters = document.querySelectorAll('.project-card, .member-card, .process-card');
 floaters.forEach((el, i) => {
 el.addEventListener('pointermove', e => {
 const r = el.getBoundingClientRect();
 const x = (e.clientX-r.left)/r.width-.5;
 const y = (e.clientY-r.top)/r.height-.5;
 el.style.transform = `perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-4px)`;
 });
 el.addEventListener('pointerleave', () => {
 el.style.transform = '';
 });
 });

 // Give revealed elements a tiny stagger for a more cinematic entrance.
 const groups = document.querySelectorAll('.reveal');
 groups.forEach((el,i) => {
 el.style.transitionDelay = `${Math.min((i%6)*70,350)}ms`;
 });
})();


/* ============================================================
   SOURCE BLOCK: merteks-order-system
   ============================================================ */
(function(){
  'use strict';

  /* Orders are cached locally for instant UI updates and synchronized with Supabase. */
  var ORDERS_KEY='merteks_orders_v1';
  /* Backend URL is the only environment-specific value in the frontend. */
  var SESSION_KEY='merteks_admin_session_v2';
  var ADMIN_TOKEN_KEY='merteks_admin_token_v2';
  var CHATS_KEY='merteks_chats_v1';
  var AGENT_KEY='merteks_agent_v1';
  var CLOUD_API_URL=window.MERTEKS_CONFIG && window.MERTEKS_CONFIG.supabaseUrl || '';
  function getAdminToken(){try{return sessionStorage.getItem(ADMIN_TOKEN_KEY)||''}catch(e){return ''}}
  function setAdminToken(token){try{sessionStorage.setItem(ADMIN_TOKEN_KEY,String(token||''));sessionStorage.setItem(SESSION_KEY,token?'1':'')}catch(e){}}
  function clearAdminToken(){try{sessionStorage.removeItem(ADMIN_TOKEN_KEY);sessionStorage.removeItem(SESSION_KEY)}catch(e){}}

  /* ---------- Merteks API (Supabase) ---------- */
  var OUTBOX_KEY='merteks_outbox_v2';
  var SB_KEY=(window.MERTEKS_CONFIG&&window.MERTEKS_CONFIG.supabaseKey)||'';
  var ADMIN_EMAIL=(window.MERTEKS_CONFIG&&window.MERTEKS_CONFIG.adminEmail)||'';
  function sbBase(){return String(CLOUD_API_URL||'').replace(/\/+$/,'')}

  /* Low-level request. Resolves {ok,status,data}; rejects only on network failure / timeout. */
  function sbFetch(method,path,body,opts){
    opts=opts||{};
    var headers={apikey:SB_KEY};
    var token=getAdminToken();
    if(opts.auth&&token)headers['Authorization']='Bearer '+token;
    if(body!==undefined)headers['Content-Type']='application/json';
    if(opts.prefer)headers['Prefer']=opts.prefer;
    var ctl=window.AbortController?new AbortController():null;
    var timer=ctl?setTimeout(function(){ctl.abort()},opts.timeout||15000):null;
    return fetch(sbBase()+path,{
      method:method,headers:headers,
      body:body!==undefined?JSON.stringify(body):undefined,
      keepalive:!!opts.keepalive&&method!=='GET',cache:'no-store',
      signal:ctl?ctl.signal:undefined
    }).then(function(r){
      if(timer)clearTimeout(timer);
      return r.text().then(function(t){
        var d=null;try{d=t?JSON.parse(t):null}catch(e){d=t}
        return {ok:r.ok,status:r.status,data:d};
      });
    },function(err){if(timer)clearTimeout(timer);throw err});
  }
  function sbError(res){var d=res.data;return (d&&typeof d==='object'&&(d.message||d.msg||d.error_description||d.error))||'خطای سرور'}

  /* Calls a database function; our functions answer {ok:true|false, code, error}. */
  function sbRpc(name,args,opts){
    return sbFetch('POST','/rest/v1/rpc/'+name,args,opts).then(function(res){
      var d=res.data,out={success:false,status:res.status,error:''};
      if(res.ok&&d&&typeof d==='object'&&d.ok===true){out.success=true;out.id=d.id;return out}
      if(res.ok&&d&&typeof d==='object'&&d.ok===false){out.status=d.code==='rate_limited'?429:400;out.error=d.error||'';return out}
      out.error=sbError(res);return out;
    });
  }

  /* Public requests that failed because of the network are kept and retried later. */
  function outboxGet(){try{return JSON.parse(localStorage.getItem(OUTBOX_KEY)||'[]')}catch(e){return []}}
  function outboxSet(list){try{localStorage.setItem(OUTBOX_KEY,JSON.stringify(list.slice(-200)))}catch(e){}}
  function outboxAdd(item){var l=outboxGet();l.push(item);outboxSet(l)}
  var outboxBusy=false;
  function flushOutbox(){
    if(outboxBusy||!CLOUD_API_URL)return;
    var list=outboxGet();
    if(!list.length)return;
    outboxBusy=true;
    (function next(i,keep){
      if(i>=list.length){outboxSet(keep);outboxBusy=false;return}
      var it=list[i];
      sbRpc(it.rpc,it.args,{keepalive:true}).then(function(j){
        var permanent=!j.success&&j.status>=400&&j.status<500&&j.status!==429;
        if(!j.success&&!permanent)keep.push(it);
        next(i+1,keep);
      },function(){outboxSet(keep.concat(list.slice(i)));outboxBusy=false});
    })(0,[]);
  }
  window.addEventListener('online',flushOutbox);
  setTimeout(flushOutbox,2500);

  function sessionExpired(){
    clearAdminToken();
    toast('نشست مدیر تمام شد؛ دوباره وارد شوید');
  }

  /* Same call signature as before, now mapped to Supabase. Always returns a Promise of {success,status,error}. */
  function cloudPost(data){
    if(!CLOUD_API_URL||!SB_KEY)return Promise.resolve({success:false,error:'no api'});
    var a=data.action,rpc,args,req,pub=false;
    if(a==='create'){pub=true;rpc='create_order';
      args={p_id:data.id,p_name:data.name,p_phone:data.phone,p_service:data.service||'',p_budget:data.budget||'',p_description:data.description||''}}
    else if(a==='chatStart'){pub=true;rpc='chat_start';args={p_id:data.id,p_name:data.name,p_phone:data.phone}}
    else if(a==='chatMessage'){pub=true;rpc='chat_message';
      args={p_chat_id:data.chatId,p_name:data.name,p_phone:data.phone,p_device:data.device||'',p_question:data.question||'',p_answer:data.answer||'',
            p_mid:'M-'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)}}
    else if(a==='update'){
      req=sbFetch('PATCH','/rest/v1/orders?id=eq.'+encodeURIComponent(data.id),{status:data.status},{auth:true,prefer:'return=representation',keepalive:true});
    }else if(a==='delete'){
      req=sbFetch('DELETE','/rest/v1/orders?id=eq.'+encodeURIComponent(data.id),undefined,{auth:true,prefer:'return=representation',keepalive:true});
    }else if(a==='clear'){
      req=sbFetch('DELETE','/rest/v1/orders?id=not.is.null',undefined,{auth:true,prefer:'return=minimal',keepalive:true});
    }else return Promise.resolve({success:false,error:'unknown action'});

    if(pub){
      return sbRpc(rpc,args,{keepalive:true}).then(function(j){
        if(!j.success&&(j.status>=500||j.status===429))outboxAdd({rpc:rpc,args:args});
        return j;
      },function(){outboxAdd({rpc:rpc,args:args});return {success:false,error:'network',status:0}});
    }
    return req.then(function(res){
      if(res.status===401){sessionExpired();return {success:false,status:401,error:'unauthorized'}}
      if(!res.ok)return {success:false,status:res.status,error:sbError(res)};
      /* update/delete answer with the affected rows: an empty list means nothing was changed */
      if((a==='update'||a==='delete')&&Array.isArray(res.data)&&!res.data.length)return {success:false,status:404,error:'سفارش در سرور پیدا نشد'};
      return {success:true,status:res.status};
    },function(){return {success:false,error:'network',status:0}});
  }

  function loadCloudOrders(done){
    if(!CLOUD_API_URL||!getAdminToken()){done(null);return}
    sbFetch('GET','/rest/v1/orders?select=id,created_at,name,phone,service,budget,description,status&order=created_at.desc&limit=1000',undefined,{auth:true}).then(function(res){
      if(res.status===401){clearAdminToken();done(null);return}
      if(!res.ok||!Array.isArray(res.data)){done(null);return}
      done(res.data.map(function(r){return {id:r.id,createdAt:r.created_at,name:r.name,phone:r.phone,service:r.service,budget:r.budget,description:r.description,status:r.status}}));
    },function(){done(null)});
  }

  /* Admin signs in with Supabase Auth (e-mail from config + the password typed here). */
  function loginAdmin(password,done){
    if(!CLOUD_API_URL||!SB_KEY||!ADMIN_EMAIL){done(false,'اتصال به سرور تنظیم نشده است');return}
    sbFetch('POST','/auth/v1/token?grant_type=password',{email:ADMIN_EMAIL,password:String(password||'')}).then(function(res){
      var d=res.data;
      if(res.ok&&d&&d.access_token){
        setAdminToken(d.access_token);
        /* make sure this account really is the admin account */
        sbFetch('POST','/rest/v1/rpc/is_admin',{},{auth:true}).then(function(r2){
          if(r2.ok&&r2.data===true)done(true,'');
          else{clearAdminToken();done(false,'این حساب دسترسی مدیر ندارد')}
        },function(){clearAdminToken();done(false,'اتصال به سرور برقرار نشد')});
        return;
      }
      var code=d&&typeof d==='object'?(d.error_code||d.code||''):'';
      if(res.status===429)done(false,'تلاش‌های زیاد بود؛ چند دقیقه بعد دوباره امتحان کنید');
      else if(code==='invalid_credentials')done(false,'رمز عبور اشتباه است');
      else if(code==='email_not_confirmed')done(false,'ایمیل این کاربر در Supabase تأیید نشده است (Auto Confirm)');
      else done(false,'ورود انجام نشد: '+(code||res.status)+(d&&d.msg?' — '+d.msg:''));
    },function(){done(false,'اتصال به سرور برقرار نشد')});
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function getOrders(){
    try{return JSON.parse(localStorage.getItem(ORDERS_KEY)||'[]')}catch(e){return []}
  }
  function saveOrders(list){localStorage.setItem(ORDERS_KEY,JSON.stringify(list))}
  function getChats(){
    try{return JSON.parse(localStorage.getItem(CHATS_KEY)||'[]')}catch(e){return []}
  }
  function saveChats(list){try{localStorage.setItem(CHATS_KEY,JSON.stringify(list))}catch(e){}}
  function getAgent(){
    try{return JSON.parse(localStorage.getItem(AGENT_KEY)||'null')}catch(e){return null}
  }
  function saveAgent(info){try{localStorage.setItem(AGENT_KEY,JSON.stringify(info))}catch(e){}}
  function clearAgent(){try{localStorage.removeItem(AGENT_KEY)}catch(e){}}
  /* نشست پنل مدیریت فقط برای همین بازدید معتبر است؛ با بستن/رفرش صفحه پاک می‌شود */
  var ADMIN_IDLE_MS=3*60*1000;
  function adminAuthed(){return !!getAdminToken()}
  function endAdminSession(){
    clearAdminToken();
    var p=document.getElementById('merteksPassword');
    if(p)p.value='';
  }
  function requireAdmin(){
    if(adminAuthed()){renderAdmin();open('merteksAdminModal');}
    else{endAdminSession();open('merteksLoginModal');}
  }
  /* شمارهٔ تماس معتبر: فقط رقم‌های فارسی/عربی به لاتین تبدیل می‌شوند */
  function normalizeDigits(v){
    return String(v==null?'':v)
      .replace(/[\u06F0-\u06F9]/g,function(d){return String(d.charCodeAt(0)-0x06F0)})
      .replace(/[\u0660-\u0669]/g,function(d){return String(d.charCodeAt(0)-0x0660)})
      .replace(/[\s\-()]/g,'');
  }
  function validPhone(v){
    var s=normalizeDigits(v);
    return /^09\d{9}$/.test(s);
  }
  function toast(msg){
    var t=document.getElementById('merteksOrderToast');
    if(!t)return;
    t.textContent=msg;t.classList.add('show');
    clearTimeout(window.__merteksToast);
    window.__merteksToast=setTimeout(function(){t.classList.remove('show')},2200);
  }
  function open(id){
    var el=document.getElementById(id);
    if(el)el.classList.add('open');
    if(id==='merteksOrderModal'){
      document.body.classList.add('merteks-order-page-active');
      document.documentElement.style.overflow='hidden';
      try{history.pushState({merteksOrder:true},'',location.href.split('#')[0]+'#order')}catch(e){}
    }
  }
  function close(id){
    var el=document.getElementById(id);
    if(el)el.classList.remove('open');
    if(id==='merteksOrderModal'){
      document.body.classList.remove('merteks-order-page-active');
      document.documentElement.style.overflow='';
      try{if(location.hash==='#order')history.replaceState(null,'',location.href.split('#')[0])}catch(e){}
    }
  }

  /* پنل مدیریت از منوی سه‌خط در دسترس است. */

  document.body.insertAdjacentHTML('beforeend',`
    <div class="merteks-overlay" id="merteksOrderModal" aria-hidden="true">
      <div class="merteks-panel" role="dialog" aria-modal="true" aria-labelledby="merteksOrderTitle">
        <div class="merteks-order-page-inner">
        <div class="merteks-panel-head">
          <div>
            <div class="kicker">ORDER PANEL</div>
            <h3 id="merteksOrderTitle">ثبت سفارش</h3>
            <p>اطلاعات سفارش را وارد کنید تا در پنل مدیریت ذخیره شود.</p>
          </div>
          <button class="merteks-close" type="button" data-close-order aria-label="بازگشت به سایت">×</button>
        </div>
        <form class="merteks-form" id="merteksOrderForm">
          <div class="merteks-grid">
            <div class="merteks-field">
              <label for="moName">نام و نام خانوادگی *</label>
              <input id="moName" name="name" required maxlength="80" autocomplete="name">
            </div>
            <div class="merteks-field">
              <label for="moPhone">شماره تماس *</label>
              <input id="moPhone" name="phone" required maxlength="11" inputmode="numeric" pattern="09[0-9]{9}" placeholder="09xxxxxxxxx" title="شمارهٔ تماس باید ۱۱ رقم و با ۰۹ شروع شود" autocomplete="tel">
            </div>
          </div>
          <div class="merteks-grid">
            <div class="merteks-field">
              <label for="moService">نوع سفارش *</label>
              <select id="moService" name="service" required>
                <option value="">انتخاب کنید</option>
                <option>طراحی وب‌سایت</option>
                <option>توسعه فرانت‌اند</option>
                <option>بازطراحی و بهبود سایت</option>
                <option>سازگاری با موبایل</option>
                <option>تولید محتوا</option>
                 <option>ساخت و تدوین ویدیو</option>
                <option value="__custom__">سفارش اختصاصی</option>
              </select>
              <input id="moCustomService" name="customService" maxlength="120" placeholder="نوع سفارش خود را بنویسید" style="display:none;margin-top:8px">
            </div>
            <div class="merteks-field">
              <label for="moBudget">بودجه تقریبی</label>
              <input id="moBudget" name="budget" maxlength="50" placeholder="مثلاً ۱۰ میلیون تومان">
            </div>
          </div>
          <div class="merteks-field">
            <label for="moDescription">توضیحات سفارش *</label>
            <textarea id="moDescription" name="description" required maxlength="2000" placeholder="توضیح دهید چه چیزی نیاز دارید..."></textarea>
          </div>
          <div class="merteks-actions">
            <button class="merteks-btn primary" type="submit">ثبت سفارش</button>
            <button class="merteks-btn" type="button" data-close-order>انصراف</button>
          </div>
          <p class="merteks-note">سفارش شما به‌صورت آنلاین ثبت می‌شود و در پنل مدیریت قابل مشاهده است.</p>
          <button class="merteks-admin-link" type="button" id="merteksAdminOpen">⚙ ورود به پنل مدیریت</button>
        </form>
        </div>
      </div>
    </div>

    <div class="merteks-overlay" id="merteksLoginModal" aria-hidden="true">
      <div class="merteks-panel merteks-login" role="dialog" aria-modal="true">
        <div class="merteks-panel-head">
          <div>
            <div class="kicker">ADMIN</div>
            <h3>ورود مدیر</h3>
            <p>برای مشاهده و مدیریت سفارش‌ها وارد شوید.</p>
          </div>
          <button class="merteks-close" type="button" data-close-login aria-label="بستن پنجره ورود مدیر">×</button>
        </div>
        <form class="merteks-form" id="merteksLoginForm">
          <div class="merteks-field">
            <label for="merteksPassword">رمز پنل مدیریت</label>
            <div class="merteks-password-wrap">
              <input id="merteksPassword" type="password" required autocomplete="current-password">
              <button type="button" class="merteks-password-toggle" id="merteksPasswordToggle" aria-label="نمایش رمز عبور" aria-pressed="false">
  <svg class="password-eye password-eye-show" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2.2 12s3.6-6.2 9.8-6.2S21.8 12 21.8 12 18.2 18.2 12 18.2 2.2 12 2.2 12Z"
      fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.9"/>
  </svg>
  <svg class="password-eye password-eye-hide" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3 3l18 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
    <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.2 0 9.8 6 9.8 6a17.2 17.2 0 0 1-3 3.6M6.3 6.7C3.8 8.4 2.2 12 2.2 12s3.6 6 9.8 6c1.2 0 2.3-.2 3.3-.6"
      fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
            </div>
          </div>
          <div class="merteks-actions">
            <button class="merteks-btn primary" type="submit">ورود</button>
            <button class="merteks-btn" type="button" data-close-login>انصراف</button>
          </div>
          <div class="merteks-login-error" id="merteksLoginError" role="alert" hidden></div>
        </form>
      </div>
    </div>

    <div class="merteks-overlay" id="merteksAdminModal" aria-hidden="true">
      <div class="merteks-panel wide" role="dialog" aria-modal="true">
        <div class="merteks-panel-head">
          <div>
            <div class="kicker">ADMIN DASHBOARD</div>
            <h3>پنل مدیریت سفارشات</h3>
            <p>مشاهده، تغییر وضعیت، خروجی گرفتن و حذف سفارش‌ها.</p>
          </div>
          <button class="merteks-close" type="button" data-close-admin aria-label="بستن پنل مدیریت">×</button>
        </div>

        <div class="merteks-admin-top">
          <div class="merteks-actions">
            <button class="merteks-btn" id="merteksExport">خروجی JSON</button>
            <button class="merteks-btn" id="merteksExportCsv">خروجی CSV</button>
            <button class="merteks-btn" id="merteksExportWord">خروجی Word</button>
            <button class="merteks-btn" id="merteksExportPdf">خروجی PDF</button>
          </div>
          <div class="merteks-actions">
            <button class="merteks-btn merteks-danger" id="merteksClearAll">حذف همه سفارش‌ها</button>
            <button class="merteks-btn" id="merteksLogout">خروج</button>
          </div>
        </div>

        <div class="merteks-tabs">
          <button class="merteks-tab is-on" type="button" data-admin-tab="orders">📦 سفارش‌ها</button>
          <button class="merteks-tab" type="button" data-admin-tab="chats">💬 گفتگوهای دستیار</button>
        </div>

        <div id="merteksPaneOrders">
          <div class="merteks-stat-row" id="merteksStats"></div>
          <div class="merteks-orders" id="merteksOrders"></div>
        </div>

        <div id="merteksPaneChats" hidden>
          <div class="merteks-stat-row" id="merteksChatStats"></div>
          <div class="merteks-actions" style="margin-bottom:14px">
            <input id="merteksChatSearch" class="merteks-search" aria-label="جستجوی گفتگوها" placeholder="جستجو بر اساس نام، شماره یا متن پیام...">
            <button class="merteks-btn" id="merteksChatExportCsv">خروجی CSV گفتگوها</button>
            <button class="merteks-btn" id="merteksChatExportWord">خروجی Word گفتگوها</button>
          </div>
          <div class="merteks-orders" id="merteksChats"></div>
        </div>
      </div>
    </div>

    <div class="merteks-toast" id="merteksOrderToast" role="status" aria-live="polite"></div>

    <button id="mxAiFab" type="button" aria-label="گفتگو با دستیار هوشمند مرتکس" title="دستیار هوشمند مرتکس">💬</button>

    <div class="merteks-overlay" id="mxAiModal" aria-hidden="true">
      <div class="mx-ai-panel" role="dialog" aria-modal="true" aria-labelledby="mxAiTitle">
        <div class="mx-ai-head">
          <div class="mx-ai-avatars">
            <div class="mx-ai-dot">🤖</div>
            <div>
              <div class="kicker">MERTEKS AI</div>
              <h3 id="mxAiTitle">دستیار هوشمند مرتکس</h3>
              <p class="mx-ai-sub">آنلاین · پاسخ فوری بدون محدودیت تعداد پیام</p>
            </div>
          </div>
          <div class="mx-ai-avatars">
            <div class="mx-ai-head-user" id="mxAiUserBox" hidden></div>
            <button class="merteks-close" type="button" id="mxAiClose" aria-label="بستن گفتگو">×</button>
          </div>
        </div>

        <div class="mx-ai-body" id="mxAiBody"></div>

        <div class="mx-ai-suggest" id="mxAiSuggest" hidden>
          <button class="mx-ai-chip" type="button">چه خدمات و تخصص‌هایی دارید؟</button>
          <button class="mx-ai-chip" type="button">هزینه و مدت زمان پروژه چقدر است؟</button>
          <button class="mx-ai-chip" type="button">چطور سفارش ثبت کنم؟</button>
          <button class="mx-ai-chip mx-ai-more" type="button" id="mxAiMore" data-more="1">بیشتر ▾</button>
        </div>

        <div class="mx-ai-allbox" id="mxAiAllBox" hidden>
          <div class="mx-ai-allbox-head">
            <strong>همهٔ پرسش‌ها</strong>
            <button class="mx-ai-chip" type="button" id="mxAiAllClose">بستن ×</button>
          </div>
          <div class="mx-ai-allgrid" id="mxAiAllGrid"></div>
        </div>

        <div class="mx-ai-compose" id="mxAiCompose" hidden>
          <div class="mx-ai-attach" id="mxAiAttach"></div>
          <div class="mx-ai-row">
            <textarea id="mxAiInput" rows="1" placeholder="پیام خود را بنویسید..." aria-label="متن پیام"></textarea>
            <button class="mx-ai-send" type="button" id="mxAiSend" aria-label="ارسال پیام">➤</button>
          </div>
          <div class="mx-ai-tools">
            <label for="mxAiFile">📎 پیوست فایل<input type="file" id="mxAiFile" aria-label="پیوست فایل" multiple accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx,.zip,.rar,.mp3,.mp4"></label>
            <span class="mx-ai-hint">پاسخ‌ها را می‌توانید کپی کنید · گفتگو نامحدود است</span>
          </div>
        </div>
      </div>
    </div>

    <div id="merteksOrderSuccess" aria-live="polite">
      <div class="merteks-success-card">
        <div class="merteks-success-icon">✓</div>
        <h3>سفارش شما با موفقیت ثبت شد</h3>
        <p>اطلاعات سفارش شما ذخیره شد. تا چند لحظه دیگر به صفحه اصلی سایت برمی‌گردید.</p>
        <div class="merteks-countdown" id="merteksCountdown">5</div>
      </div>
    </div>

  `);

  var orderModal=document.getElementById('merteksOrderModal');
  var loginModal=document.getElementById('merteksLoginModal');
  var adminModal=document.getElementById('merteksAdminModal');

  document.getElementById('merteksOrderOpen').addEventListener('click',function(){open('merteksOrderModal')});
  document.querySelectorAll('[data-open-order]').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      open('merteksOrderModal');
      var menu=document.getElementById('links');
      var menuBtn=document.getElementById('menuBtn');
      if(menu){menu.classList.remove('open')}
      if(menuBtn){menuBtn.setAttribute('aria-expanded','false')}
    });
  });
  document.querySelectorAll('[data-open-admin]').forEach(function(link){
    link.addEventListener('click',function(e){
      e.preventDefault();
      var menu=document.getElementById('links');
      var menuBtn=document.getElementById('menuBtn');
      if(menu){menu.classList.remove('open')}
      if(menuBtn){menuBtn.setAttribute('aria-expanded','false')}
      requireAdmin();
    });
  });
  document.getElementById('merteksAdminOpen').addEventListener('click',function(){
    close('merteksOrderModal');
    requireAdmin();
  });

  document.querySelectorAll('[data-close-order]').forEach(function(b){b.addEventListener('click',function(){close('merteksOrderModal')})});
  document.querySelectorAll('[data-close-login]').forEach(function(b){b.addEventListener('click',function(){close('merteksLoginModal')})});
  document.querySelectorAll('[data-close-admin]').forEach(function(b){b.addEventListener('click',function(){
    /* توکن تا پایان نشست/timeout نگه داشته می‌شود تا ورود بعدی فوری باشد. */
    close('merteksAdminModal');
  })});

  [orderModal,loginModal,adminModal].forEach(function(modal){
    modal.addEventListener('click',function(e){
      if(e.target!==modal)return;
      if(modal===orderModal)close('merteksOrderModal');
      else if(modal===adminModal){
        endAdminSession();
        modal.classList.remove('open');
      } else modal.classList.remove('open');
    });
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      if(orderModal.classList.contains('open')) close('merteksOrderModal');
      else if(adminModal.classList.contains('open')){
        adminModal.classList.remove('open');
      } else loginModal.classList.remove('open');
    }
  });
  window.addEventListener('popstate',function(){
    if(orderModal.classList.contains('open') && location.hash!=='#order') close('merteksOrderModal');
  });


  /* Customer order submission */
  var moService=document.getElementById('moService');
  var moCustomService=document.getElementById('moCustomService');
  if(moService && moCustomService){
    moService.addEventListener('change',function(){
      var custom=moService.value==='__custom__';
      moCustomService.style.display=custom?'block':'none';
      moCustomService.required=custom;
      if(!custom) moCustomService.value='';
    });
  }

  document.getElementById('merteksOrderForm').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target);
    var order={
      id:'MTX-'+Date.now().toString(36).toUpperCase(),
      createdAt:new Date().toISOString(),
      name:String(fd.get('name')||'').trim(),
      phone:normalizeDigits(String(fd.get('phone')||'').trim()),
      service:(String(fd.get('service')||'').trim()==='__custom__'?String(fd.get('customService')||'').trim():String(fd.get('service')||'').trim()),
      budget:String(fd.get('budget')||'').trim(),
      description:String(fd.get('description')||'').trim(),
      status:'جدید'
    };
    if(!order.name||!order.phone||!order.service||!order.description){
      toast('لطفاً فیلدهای الزامی را کامل کنید');return;
    }
    order.phone=normalizeDigits(order.phone);
    if(!validPhone(order.phone)){
      toast('شمارهٔ تماس باید ۱۱ رقم و با ۰۹ شروع شود');
      return;
    }
    var orders=getOrders();
    orders.unshift(order);
    saveOrders(orders);
    cloudPost({action:'create',id:order.id,name:order.name,phone:order.phone,service:order.service,budget:order.budget,description:order.description}).then(function(j){
      if(j.success||!CLOUD_API_URL)return;
      if(j.status>=400&&j.status<500&&j.status!==429)toast('ثبت آنلاین سفارش انجام نشد: '+(j.error||'خطا'));
      else toast('اتصال برقرار نشد؛ سفارش ذخیره شد و خودکار دوباره ارسال می‌شود');
    });
    e.target.reset();
    if(moCustomService){moCustomService.style.display='none';moCustomService.required=false;moCustomService.value='';}
    close('merteksOrderModal');
    var success=document.getElementById('merteksOrderSuccess');
    var countdown=document.getElementById('merteksCountdown');
    var seconds=5;
    countdown.textContent=seconds;
    success.classList.add('open');
    var timer=setInterval(function(){
      seconds--;
      countdown.textContent=seconds;
      if(seconds<=0){
        clearInterval(timer);
        success.classList.remove('open');
        try{history.replaceState(null,'',location.href.split('#')[0]+'#home')}catch(err){location.hash='home'}
        window.scrollTo({top:0,behavior:'smooth'});
      }
    },1000);
  });

  /* Admin login is verified by the backend; the plaintext password never leaves this page. */
  var merteksLoginForm=document.getElementById('merteksLoginForm');
  var merteksLoginError=document.getElementById('merteksLoginError');
  var merteksPassword=document.getElementById('merteksPassword');
  function clearLoginError(){
    if(merteksLoginError){merteksLoginError.hidden=true;merteksLoginError.textContent='';}
    if(merteksLoginForm)merteksLoginForm.classList.remove('has-error');
  }
  if(merteksPassword)merteksPassword.addEventListener('input',clearLoginError);
  merteksLoginForm.addEventListener('submit',function(e){
    e.preventDefault();
    clearLoginError();
    var pass=merteksPassword.value;
    if(!pass){merteksPassword.focus();return;}
    var btn=this.querySelector('button[type="submit"]');
    if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='در حال بررسی…';}
    loginAdmin(pass,function(ok,message){
      if(btn){btn.disabled=false;btn.textContent=btn.dataset.oldText||'ورود';}
      if(ok){
        touchAdmin();
        merteksPassword.value='';
        close('merteksLoginModal');
        renderAdmin();
        open('merteksAdminModal');
      }else{
        var msg=message||'رمز پنل مدیریت اشتباه است';
        if(merteksLoginError){merteksLoginError.textContent='✕ '+msg;merteksLoginError.hidden=false;}
        merteksLoginForm.classList.add('has-error');
        merteksLoginForm.classList.remove('shake');
        void merteksLoginForm.offsetWidth;
        merteksLoginForm.classList.add('shake');
        merteksPassword.select();
        merteksPassword.focus();
      }
    });
  });

  /* نشست مدیر با بی‌کاری طولانی خودبه‌خود بسته می‌شود */
  var adminIdleTimer=null;
  function touchAdmin(){
    clearTimeout(adminIdleTimer);
    adminIdleTimer=setTimeout(function(){
      if(!adminAuthed())return;
      endAdminSession();
      close('merteksAdminModal');
      close('merteksLoginModal');
      toast('نشست پنل مدیریت به پایان رسید؛ دوباره وارد شوید');
    },ADMIN_IDLE_MS);
  }
  ['click','keydown','mousemove','touchstart','scroll'].forEach(function(ev){
    document.addEventListener(ev,function(){
      if(adminAuthed() && adminModal.classList.contains('open')) touchAdmin();
    },{passive:true});
  });

  function renderAdmin(){
    if(!adminAuthed()){close('merteksAdminModal');return}
    /* اول UI محلی را فوراً نشان بده؛ همگام‌سازی ابری در پس‌زمینه انجام می‌شود. */
    renderAdminLocal();
    renderChatStats();
    var pc=document.getElementById('merteksPaneChats');
    if(pc && !pc.hidden)renderChats();
    requestAnimationFrame(function(){
      loadCloudOrders(function(cloudOrders){
        if(cloudOrders){saveOrders(cloudOrders);renderAdminLocal();}
        else if(getAdminToken()) toast('اتصال به سفارش‌های آنلاین برقرار نشد');
      });
    });
  }

  function renderAdminLocal(){
    if(!adminAuthed()){close('merteksAdminModal');return}
    var orders=getOrders();
    var fresh=orders.filter(function(o){return o.status==='جدید'}).length;
    var done=orders.filter(function(o){return o.status==='انجام شد'}).length;
    document.getElementById('merteksStats').innerHTML=
      '<div class="merteks-stat"><strong>'+orders.length+'</strong><span>کل سفارش‌ها</span></div>'+
      '<div class="merteks-stat"><strong>'+fresh+'</strong><span>سفارش جدید</span></div>'+
      '<div class="merteks-stat"><strong>'+done+'</strong><span>انجام شده</span></div>';

    var box=document.getElementById('merteksOrders');
    if(!orders.length){box.innerHTML='<div class="merteks-empty">هنوز سفارشی ثبت نشده است.</div>';return;}
    box.innerHTML=orders.map(function(o){
      var date=new Date(o.createdAt);
      var dateText=isNaN(date.getTime())?o.createdAt:date.toLocaleString('fa-IR');
      return '<article class="merteks-order-card '+(o.status==='جدید'?'new':'')+'">'+
        '<div class="merteks-order-head">'+
          '<div><strong>'+esc(o.name)+'</strong><div class="merteks-order-id">'+esc(o.id)+' · '+esc(dateText)+'</div></div>'+
          '<select class="merteks-status" data-status-id="'+esc(o.id)+'">'+
            ['جدید','در حال بررسی','در حال انجام','انجام شد','لغو شد'].map(function(st){return '<option '+(o.status===st?'selected':'')+'>'+st+'</option>';}).join('')+
          '</select>'+        '</div>'+        '<div class="merteks-order-meta">'+          '<div><b>تلفن:</b> '+esc(o.phone)+'</div>'+          '<div><b>خدمت:</b> '+esc(o.service)+'</div>'+          '<div><b>بودجه:</b> '+esc(o.budget||'اعلام نشده')+'</div>'+        '</div>'+        '<div class="merteks-order-desc">'+esc(o.description)+'</div>'+        '<button class="merteks-btn merteks-danger" type="button" data-delete-id="'+esc(o.id)+'">حذف سفارش</button>'+      '</article>';
    }).join('');

    box.querySelectorAll('[data-status-id]').forEach(function(sel){
      sel.addEventListener('change',function(){
        var list=getOrders(),id=sel.getAttribute('data-status-id');
        var item=list.find(function(x){return x.id===id});
        if(item){item.status=sel.value;saveOrders(list);cloudPost({action:'update',id:id,status:item.status});renderAdminLocal();toast('وضعیت سفارش تغییر کرد');}
      });
    });
    box.querySelectorAll('[data-delete-id]').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(!confirm('این سفارش حذف شود؟'))return;
        var id=btn.getAttribute('data-delete-id');
        saveOrders(getOrders().filter(function(x){return x.id!==id}));
        cloudPost({action:'delete',id:id});
        renderAdminLocal();toast('سفارش حذف شد');
      });
    });
  }

  /* ---------- گفتگوهای دستیار هوشمند در پنل ---------- */
  function renderChatStats(){
    var chats=getChats();
    var msgs=chats.reduce(function(a,c){return a+((c.messages||[]).filter(function(m){return m.role==='user'}).length)},0);
    var today=new Date().toDateString();
    var todayCount=chats.filter(function(c){
      var d=new Date(c.updatedAt);return !isNaN(d.getTime()) && d.toDateString()===today;
    }).length;
    var box=document.getElementById('merteksChatStats');
    if(!box)return;
    box.innerHTML=
      '<div class="merteks-stat"><strong>'+chats.length+'</strong><span>کل گفتگوها</span></div>'+
      '<div class="merteks-stat"><strong>'+msgs+'</strong><span>سؤال کاربران</span></div>'+
      '<div class="merteks-stat"><strong>'+todayCount+'</strong><span>فعال امروز</span></div>';
  }
  function chatSearchText(c){
    var t=String(c.name||'')+' '+String(c.phone||'');
    (c.messages||[]).forEach(function(m){t+=' '+String(m.text||'')});
    return t;
  }
  function renderChats(){
    renderChatStats();
    var box=document.getElementById('merteksChats');
    if(!box)return;
    var q=aiNorm((document.getElementById('merteksChatSearch')||{}).value||'');
    var chats=getChats().slice().sort(function(a,b){
      return new Date(b.updatedAt||b.startedAt)-new Date(a.updatedAt||a.startedAt);
    });
    if(q){
      chats=chats.filter(function(c){return aiNorm(chatSearchText(c)).indexOf(q)>-1});
    }
    if(!chats.length){
      box.innerHTML='<div class="merteks-empty">هنوز گفتگویی با دستیار ثبت نشده است.</div>';
      return;
    }
    box.innerHTML=chats.map(function(c){
      var body=(c.messages||[]).map(function(m){
        if(m.typing)return '';
        var who=m.role==='user';
        var label=(who?'👤 '+esc(c.name):'🤖 دستیار')+(m.at?' · '+esc(aiTimeTag(m.at)):'');
        var att=m.attachment?('\n📎 '+esc(m.attachment.name)):'';
        return '<div class="merteks-chat-msg '+(who?'q':'a')+'">'+
          '<small>'+label+'</small><div>'+esc(m.text||'')+att+'</div></div>';
      }).join('');
      return '<article class="merteks-order-card">'+
        '<div class="merteks-order-head"><div><strong>'+esc(c.name||'بدون نام')+'</strong>'+
        '<div class="merteks-order-id">'+esc(c.id)+' · '+(c.messages||[]).length+' پیام</div></div>'+
        '<div class="merteks-order-id">'+esc(c.phone)+'</div></div>'+
        '<div class="merteks-order-meta">'+
          '<div><b>شروع:</b> '+esc(aiDate(c.startedAt))+'</div>'+
          '<div><b>آخرین پیام:</b> '+esc(aiDate(c.updatedAt))+'</div>'+
          '<div><b>دستگاه:</b> '+esc(c.device||'نامشخص')+'</div>'+
        '</div>'+body+'</article>';
    }).join('');
  }
  var chatSearchEl=document.getElementById('merteksChatSearch');
  if(chatSearchEl)chatSearchEl.addEventListener('input',renderChats);

  document.getElementById('merteksChatExportCsv').addEventListener('click',function(){
    var chats=getChats();
    var rows=[['chatId','name','phone','device','startedAt','updatedAt','question','answer']];
    chats.forEach(function(c){
      var qs=[],as=[];
      (c.messages||[]).forEach(function(m){
        if(m.role==='user')qs.push(m.text||'');
        else if(m.text)as.push(m.text);
      });
      var n=Math.max(qs.length,as.length,1);
      for(var i=0;i<n;i++){
        rows.push([c.id,c.name,c.phone,c.device||'',c.startedAt,c.updatedAt,qs[i]||'',as[i]||'']);
      }
    });
    var csv=rows.map(function(r){
      return r.map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'}).join(',');
    }).join('\n');
    download('merteks-chats.csv','text/csv;charset=utf-8','\uFEFF'+csv);
  });

  document.getElementById('merteksChatExportWord').addEventListener('click',function(){
    var chats=getChats();
    var rows=chats.map(function(c){
      var body=(c.messages||[]).filter(function(m){return !m.typing}).map(function(m){
        return '<p><b>'+(m.role==='user'?esc(c.name||'کاربر'):'دستیار')+'</b> ('+esc(aiTimeTag(m.at))+'): '+esc(m.text||'')+'</p>';
      }).join('');
      return '<div class="order"><h2>'+esc(c.name||'بدون نام')+' — '+esc(c.phone)+'</h2>'+
        '<p><b>شروع:</b> '+esc(aiDate(c.startedAt))+' · <b>آخرین پیام:</b> '+esc(aiDate(c.updatedAt))+'</p>'+body+'</div>';
    }).join('');
    var html='<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><title>گزارش گفتگوهای دستیار مرتکس</title></head><body><h1>گزارش گفتگوهای دستیار هوشمند</h1><p style="text-align:center">تعداد گفتگوها: '+chats.length+'</p>'+rows+'</body></html>';
    download('merteks-chats.doc','application/msword;charset=utf-8','\uFEFF'+html);
  });

  document.querySelectorAll('[data-admin-tab]').forEach(function(tab){
    tab.addEventListener('click',function(){
      var name=tab.getAttribute('data-admin-tab');
      document.querySelectorAll('[data-admin-tab]').forEach(function(t){t.classList.toggle('is-on',t===tab)});
      var po=document.getElementById('merteksPaneOrders');
      var pc=document.getElementById('merteksPaneChats');
      if(name==='chats'){
        if(po)po.hidden=true;
        if(pc)pc.hidden=false;
        renderChats();
      }else{
        if(pc)pc.hidden=true;
        if(po)po.hidden=false;
        renderAdminLocal();
      }
    });
  });

  document.getElementById('merteksLogout').addEventListener('click',function(){
    clearTimeout(adminIdleTimer);
    endAdminSession();
    close('merteksAdminModal');
    toast('از پنل خارج شدید؛ برای ورود دوباره رمز لازم است');
  });

  document.getElementById('merteksClearAll').addEventListener('click',function(){
    if(!getOrders().length){toast('سفارشی برای حذف وجود ندارد');return}
    if(!confirm('همه سفارش‌ها حذف شوند؟ این کار قابل برگشت نیست.'))return;
    saveOrders([]);cloudPost({action:'clear'});renderAdmin();toast('همه سفارش‌ها حذف شدند');
  });

  function download(name,type,data){
    var blob=new Blob([data],{type:type});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;
    document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},100);
  }
  document.getElementById('merteksExport').addEventListener('click',function(){
    download('merteks-orders.json','application/json;charset=utf-8',
      JSON.stringify(getOrders(),null,2));
  });
  document.getElementById('merteksExportCsv').addEventListener('click',function(){
    var orders=getOrders();
    var headers=['id','createdAt','name','phone','service','budget','description','status'];
    var csv=[headers.join(',')].concat(orders.map(function(o){
      return headers.map(function(h){return '"'+String(o[h]||'').replace(/"/g,'""')+'"'}).join(',');
    })).join('\n');
    download('merteks-orders.csv','text/csv;charset=utf-8','\uFEFF'+csv);
  });

  document.getElementById('merteksExportWord').addEventListener('click',function(){
    var orders=getOrders();
    var rows=orders.map(function(o){
      var date=new Date(o.createdAt);
      var dateText=isNaN(date.getTime())?o.createdAt:date.toLocaleString('fa-IR');
      return '<div class="order">'+
        '<h2>'+esc(o.name||'بدون نام')+'</h2>'+
        '<p><b>شماره سفارش:</b> '+esc(o.id)+'</p>'+
        '<p><b>تاریخ:</b> '+esc(dateText)+'</p>'+
        '<p><b>تلفن:</b> '+esc(o.phone)+'</p>'+
        '<p><b>نوع سفارش:</b> '+esc(o.service)+'</p>'+
        '<p><b>بودجه:</b> '+esc(o.budget||'اعلام نشده')+'</p>'+
        '<p><b>وضعیت:</b> '+esc(o.status)+'</p>'+
        '<p><b>توضیحات:</b><br>'+esc(o.description||'')+'</p>'+
      '</div>';
    }).join('');
    var html='<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><title>گزارش سفارشات مرتکس</title></head><body><h1>گزارش سفارشات</h1><p>تعداد سفارش‌ها: '+orders.length+'</p>'+rows+'</body></html>';
    download('merteks-orders.doc','application/msword;charset=utf-8','\uFEFF'+html);
  });

  document.getElementById('merteksExportPdf').addEventListener('click',function(){
    var orders=getOrders();
    var rows=orders.map(function(o){
      var date=new Date(o.createdAt);
      var dateText=isNaN(date.getTime())?o.createdAt:date.toLocaleString('fa-IR');
      return '<div class="order">'+
        '<h2>'+esc(o.name||'بدون نام')+'</h2>'+
        '<p><b>شماره سفارش:</b> '+esc(o.id)+'</p>'+
        '<p><b>تاریخ:</b> '+esc(dateText)+'</p>'+
        '<p><b>تلفن:</b> '+esc(o.phone)+'</p>'+
        '<p><b>نوع سفارش:</b> '+esc(o.service)+'</p>'+
        '<p><b>بودجه:</b> '+esc(o.budget||'اعلام نشده')+'</p>'+
        '<p><b>وضعیت:</b> '+esc(o.status)+'</p>'+
        '<p><b>توضیحات:</b><br>'+esc(o.description||'')+'</p>'+
      '</div>';
    }).join('');
    var html='<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8"><title>گزارش سفارشات مرتکس</title></head><body><h1>گزارش سفارشات</h1><p>تعداد سفارش‌ها: '+orders.length+'</p>'+rows+'</body></html>';
    var printWindow=window.open('','_blank','width=900,height=700');
    if(!printWindow){toast('لطفاً اجازه باز شدن پنجره جدید را فعال کنید');return;}
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function(){printWindow.print();},500);
  });

  /* If an admin session already exists in this tab, the admin link goes straight in. */

  /* ============================================================
     دستیار هوشمند مرتکس — موتور پاسخ‌گویی محلی
     کاملاً آفلاین است و به هیچ سرویس بیرونی وصل نمی‌شود.
     ============================================================ */
  var aiModal=document.getElementById('mxAiModal');
  var aiBody=document.getElementById('mxAiBody');
  var aiCompose=document.getElementById('mxAiCompose');
  var aiSuggest=document.getElementById('mxAiSuggest');
  var aiInput=document.getElementById('mxAiInput');
  var aiSend=document.getElementById('mxAiSend');
  var aiFile=document.getElementById('mxAiFile');
  var aiAttachBox=document.getElementById('mxAiAttach');
  var aiUserBox=document.getElementById('mxAiUserBox');

  /* ============================================================
     موتور دانش و استدلال دستیار مرتکس
     تمام داده‌ها محلی‌اند؛ هیچ اتصال بیرونی وجود ندارد.
     ============================================================ */
  var AI_BOT_INFO='من ربات دستیار مرتکس هستم؛ توسط «مرتکس» ساخته شده‌ام.\n\n'+
    'من یک ربات اولیه، محدود و آزمایشی هستم: پاسخ‌هایم از یک دانش محلی می‌آید و مثل مدل‌های بزرگ هوش مصنوعی توان استدلال آزاد ندارم. بااین‌حال برای آشنایی شما با خدمات و مسیر کار مرتکس طراحی شده‌ام.';

  var AI_ABOUT_M='مرتکس یک تیم تخصصی و حرفه‌ای است که روی طراحی و توسعهٔ وب‌سایت کار می‌کند. ربات این سایت هم توسط خود مرتکس ساخته شده است.';

  var AI_PLANS='دربارهٔ مدل‌های هوش مصنوعی:\n\n'+
    'در حال حاضر مدل‌های هوش مصنوعی ما راه‌اندازی نشده‌اند و به‌زودی راه می‌افتند.\n\n'+
    'برای صحبت با مدل‌های معروف و قدرتمند هوش مصنوعی، باید اشتراک تهیه کنید. چون ما ایرانی هستیم و از داخل ایران کار می‌کنیم، قیمت این اشتراک‌ها برای شما از جاهای دیگر دنیا ارزان‌تر تمام می‌شود و می‌توانید آن را با تخفیف ویژه تهیه کنید.';

  var AI_ISTORE='فکر می‌کنم منظورتان «آی‌استور» است. آی‌استور فروشگاهی است که اپلیکیشن‌ها و ابزارهای هوش مصنوعی را معرفی می‌کند و برای دسترسی به نسخه‌های کامل و حرفه‌ای آن‌ها باید اشتراک تهیه کنید.\n\nچون تیم ما ایرانی است، این اشتراک‌ها برای شما ارزان‌تر از قیمت‌های جهانی تمام می‌شود و امکان خرید با تخفیف وجود دارد.';

  var AI_MODELS='پاسخ کوتاه:\n• مدل‌های هوش مصنوعی ما هنوز راه‌اندازی نشده‌اند و به‌زودی راه می‌افتند\n• برای استفاده از مدل‌های معروف و قدرتمند دنیا باید اشتراک تهیه کنید\n• به دلیل ایرانی بودن، قیمت برای شما ارزان‌تر از جاهای دیگر است\n• خرید با تخفیف هم امکان‌پذیر است\n• نسخهٔ فعلی ربات یک نسخهٔ اولیه، محدود و آزمایشی است که توسط مرتکس ساخته شده';

  var AI_KB=[
    {k:['سلام','درود','وقت بخیر','هستی','hi','hello','صبح بخیر','شب بخیر'],a:'سلام و وقت بخیر 👋 من ربات دستیار مرتکس هستم. دربارهٔ خدمات، هزینه‌ها، نمونه‌کارها، روند ثبت سفارش و مدل‌های هوش مصنوعی می‌توانم راهنمایی‌تان کنم.\n\nچه چیزی می‌خواهید بدانید؟'},

    {k:['چه کاری','چه کار','انجام می دهید','انجام میدید','خدمات','ارائه می دهید','تخصص','مهارت'],a:'مرتکس در این زمینه‌ها کار می‌کند:\n• طراحی وب‌سایت اختصاصی از صفر\n• توسعهٔ فرانت‌اند و پیاده‌سازی رابط کاربری\n• بازطراحی و بهینه‌سازی سایت‌های موجود\n• سازگاری کامل با موبایل و ریسپانسیو\n• بهینه‌سازی سرعت و سئو پایه\n• تولید محتوا و کپی‌رایتینگ\n• ساخت و تدوین ویدیو\n\nبرای شروع، از بخش «ثبت سفارش» یا فرم تماس استفاده کنید.'},

    {k:['هزینه','قیمت','تعرفه','چند','تومان','بودجه','گرون','ارزان'],a:'هزینه بسته به نوع، حجم و پیچیدگی پروژه تعیین می‌شود؛ به همین دلیل عدد ثابتی اعلام نمی‌کنیم.\n\nبرای برآورد دقیق، در فرم ثبت سفارش فیلد «بودجهٔ تقریبی» را پر کنید تا تیم مرتکس با توجه به نیاز شما پیشنهاد شفاف بدهد. مشاورهٔ اولیه رایگان است.'},

    {k:['سفارش','ثبت سفارش','چطور سفارش','روند','مراحل','فرم'],a:'روند ثبت سفارش بسیار ساده است:\n۱) روی دکمهٔ 🛒 در بالای سایت یا لینک «سفارشات» بزنید\n۲) نام، شمارهٔ تماس (۱۱ رقم و شروع با ۰۹)، نوع سفارش و توضیحات را وارد کنید\n۳) ثبت کنید\n\nسفارش شما بلافاصله در پنل مدیریت ثبت می‌شود و تیم مرتکس آن را بررسی می‌کند.'},

    {k:['شماره','شماره تلفن','تماس','تلفنی','راه ارتباط','ارتباط'],a:'شمارهٔ تماس ما: ۰۹۱۹۷۰۲۹۲۱۳\n\nتوجه: در فرم‌های سایت، شماره باید ۱۱ رقم باشد و با ۰۹ شروع شود؛ در غیر این صورت سیستم اجازهٔ ثبت نمی‌دهد.'},

    {k:['نمونه','نمونه کار','نمونه‌کار','پروژه','سابقه','portfolio','کارهای انجام'],a:'نمونه‌کارهای مرتکس در بخش «پروژه‌ها»ی همین سایت قابل مشاهده است. اگر حوزهٔ خاصی مدنظرتان است (فروشگاهی، شرکتی، شخصی یا اپلیکیشن) بگویید تا دقیق‌تر راهنمایی کنم.'},

    {k:['چقدر زمان','زمان','مدت','کی آماده','چند روز','تحویل'],a:'بازهٔ زمانی بسته به حجم پروژه متفاوت است:\n• سایت تک‌صفحه‌ای: حدود ۳ تا ۷ روز\n• سایت چندصفحه‌ای شرکتی: حدود ۲ تا ۴ هفته\n• پروژه‌های اختصاصی: بر اساس نیازسنجی اعلام می‌شود\n\nپس از ثبت سفارش، زمان‌بندی دقیق به شما اعلام می‌شود.'},

    {k:['تیم','کی هستید','مرتکس','درباره','چه کسی','شما کی','اعضای تیم'],a:AI_ABOUT_M+'\n\nمرتکس یک تیم دو‌نفره است: محمد سام مطیعی و مهدی اسکندری — یک تیم، دو نفر، یک مسیر مشترک. تمرکز ما روی ساخت تجربه‌های وب سریع، مدرن و دقیق است.'},

    {k:['ربات','دستیار','تو کی هستی','اسمت','کی ساخته','سازنده','چی هستی'],a:AI_BOT_INFO+'\n\n'+AI_ABOUT_M},

    {k:['اولیه','محدود','ازمایشی','آزمایشی','تست','بتا','beta','کامل نیست','ناقص'],a:AI_BOT_INFO},

    {k:['اشتراک','خرید اشتراک','ارزان تر','ارزانتر','تخفیف','ارز','دلار'],a:AI_PLANS},

    {k:['مدل','مدل ها','مدل‌ها','مدل هوش مصنوعی','چت جی پی تی','جی پی تی','gpt','claude','gemini','جمنای','قوی','قدرتمند'],a:AI_MODELS},

    {k:['راه اندازی','راه‌اندازی','کی راه می افتد','کی میاد','فعال نیست','غیرفعال','اماده نیست','ready'],a:'مدل‌های هوش مصنوعی ما در حال حاضر راه‌اندازی نشده‌اند و به‌زودی راه می‌افتند.\n\nدر این فاصله می‌توانید از همین ربات برای آشنایی با خدمات مرتکس استفاده کنید.'},

    {k:['ای استور','آی استور','i store','istore','ای‌استور'],a:AI_ISTORE},

    {k:['فایل','پیوست','عکس','ارسال عکس','اپلود','آپلود','عکس بفرستم'],a:'می‌توانید فایل‌تان را از دکمهٔ 📎 پیوست کنید. تصاویر و متن‌ها را می‌توانم بررسی کنم و بازخورد بدهم؛ برای فایل‌های دیگر نام و مشخصات فایل در گفتگو ثبت می‌شود تا تیم مرتکس ببیند.'},

    {k:['رایگان','مشاوره','رایگان است'],a:'مشاورهٔ اولیه کاملاً رایگان است. کافی است نیازتان را بگویید تا راهنمایی‌تان کنیم و بعد تصمیم بگیرید.'},

    {k:['ممنون','مرسی','سپاس','دستت درد نکنه','لطف','ممنونم'],a:'خواهش می‌کنم 🙏 اگر سؤال دیگری دارید در خدمتم. برای ادامهٔ کار می‌توانید از بخش «ثبت سفارش» اقدام کنید.'},

    {k:['خداحافظ','بای','خدانگهدار','فعلا','خدا نگهدار'],a:'خدانگهدار! هر وقت نیاز داشتید همین‌جا در خدمتم 🌟'},

    {k:['پشتیبانی','پشتیبانی می کنید','بعد از تحویل','گارانتی','ضمانت'],a:'بله. پس از تحویل پروژه، پشتیبانی و رفع اشکال انجام می‌شود. جزئیات مدت و دامنهٔ پشتیبانی در زمان توافق و ثبت سفارش مشخص می‌شود.'},

    {k:['تغییرات','ویرایش','اصلاح','بعدا عوض','تغییر بدم'],a:'بله، امکان اعمال تغییرات وجود دارد. بهتر است موارد را همان ابتدا دقیق مشخص کنیم تا در زمان و هزینه صرفه‌جویی شود؛ اما تغییرات بعدی هم قابل انجام است.'},

    {k:['روش پرداخت','پرداخت هزینه','پیش پرداخت','پیش‌پرداخت','قسط','اقساط','بیعانه','چطور پرداخت','پرداخت چطور'],a:'پرداخت معمولاً مرحله‌ای است؛ بخشی به‌عنوان پیش‌پرداخت در شروع کار و باقی در مراحل تحویل. جزئیات دقیق هنگام ثبت سفارش و توافق نهایی مشخص می‌شود.'},

    {k:['سئو','seo','گوگل','دیده شدن','رتبه'],a:'سئوی پایه (ساختار درست، سرعت، متاتگ‌ها و سازگاری موبایل) بخشی از کار ماست.\n\nسئوی حرفه‌ای و مستمر نیاز به همکاری بلندمدت و تولید محتوای منظم دارد که می‌تواند به‌صورت پروژهٔ جداگانه تعریف شود.'},

    {k:['موبایل','ریسپانسیو','ریسپانسیو','گوشی','تبلت','سازگار'],a:'بله، همهٔ پروژه‌های مرتکس به‌صورت پیش‌فرض ریسپانسیو ساخته می‌شوند و روی موبایل، تبلت و دسکتاپ درست نمایش داده می‌شوند.'},

    {k:['فروشگاهی','فروشگاه','ای کامرس','سبد خرید','محصول'],a:'بله، طراحی سایت فروشگاهی با سبد خرید، صفحهٔ محصول و مدیریت سفارش انجام می‌شود. اگر درگاه پرداخت ایرانی یا اتصال به سیستم انبار مدنظرتان است، در توضیحات سفارش ذکر کنید.'},

    {k:['هویت','برندینگ','لوگو','رنگ','طراحی گرافیک'],a:'هویت بصری و طراحی لوگو بخشی از خدمات ماست. اگر فقط لوگو نیاز دارید یا هویت کامل برند، در سفارش مشخص کنید تا پیشنهاد مناسب بدهیم.'},

    {k:['محتوا','کپی','متن','نوشتن','مقاله'],a:'تولید محتوا و کپی‌رایتینگ انجام می‌شود؛ از متن صفحات سایت تا معرفی خدمات و مقالات. اگر محتوای آماده دارید، همان را بهینه می‌کنیم.'},

    {k:['ویدیو','تدوین','کلیپ','مونتاژ','فیلم'],a:'ساخت و تدوین ویدیو از خدمات مرتکس است؛ از کلیپ معرفی کسب‌وکار تا محتوای شبکه‌های اجتماعی. در سفارش، موضوع و مدت ویدیو را بنویسید.'},

    {k:['حال','خوبی','چطوری','چطور هستی'],a:'ممنون، آمادهٔ کمک هستم 😊 بگویید چه چیزی لازم دارید؛ دربارهٔ خدمات مرتکس یا روند ثبت سفارش کامل راهنمایی‌تان می‌کنم.'},

    {k:['چند نفر','تعداد اعضا','دو نفر','اعضا','تیم چند'],a:'مرتکس یک گروه دو‌نفره است: محمد سام مطیعی و مهدی اسکندری.\n\nشعار ما: یک تیم، دو نفر، یک مسیر مشترک.\nدر بخش «درباره ما»ی سایت هم نوشته شده: ۲ عضو، یک گروه · ∞ ایده برای ساختن · ۱ مسیر مشترک.'},

    /* ===== محتوای دقیق سایت — بند به بند ===== */
    {k:['مهدی اسکندری','مهدی','اسکندری','مهدي اسکندري'],a:'مهدی اسکندری یکی از دو عضو گروه مرتکس است.\n\nنقش او در سایت این‌گونه معرفی شده: «برنامه‌نویس و متخصص تولید محتوا».\n\nاو همراه محمد سام مطیعی، مرتکس را تشکیل می‌دهد — یک تیم، دو نفر، یک مسیر مشترک.'},

    {k:['محمد سام مطیعی','محمد سام','مطیعی','سام مطیعی'],a:'محمد سام مطیعی یکی از دو عضو گروه مرتکس است.\n\nنقش او در سایت این‌گونه معرفی شده: «طراحی سایت و برنامه‌نویسی».\n\nاو همراه مهدی اسکندری، مرتکس را تشکیل می‌دهد — یک تیم، دو نفر، یک مسیر مشترک.'},

    {k:['درباره ما','دربارهٔ ما','معرفی گروه','شما کی هستید','کی هستید','مرتکس چیه','مرتکس کیست'],a:'بخش «درباره ما»ی سایت:\n\n«محمد سام مطیعی و مهدی اسکندری — دو نفر از یک گروه با علاقه مشترک به فناوری، طراحی و ساختن. روی طراحی رابط‌های مدرن، تجربه کاربری، برنامه‌نویسی Python و هوش مصنوعی کار می‌کنیم و هدفمان این است که هر پروژه علاوه بر ظاهر حرفه‌ای، سریع، خوانا و استفاده از آن راحت باشد.»\n\nشعار گروه: «یک طراحی خوب فقط زیبا نیست؛ باید حس خوب استفاده کردن را هم منتقل کند.»'},

    {k:['پروژه ها','پروژه‌ها','نمونه کارها','کارهای شما','چه پروژه','our work'],a:'بخش «پروژه‌ها»ی سایت شامل این نمونه‌کارهاست:\n\n۰۱ وب‌سایت شخصی — پرتفولیویی مدرن با تمرکز روی هویت شخصی، تایپوگرافی، انیمیشن و تجربه کاربری روان. (HTML، CSS، JavaScript)\n\n۰۲ داشبورد هوشمند — رابط داده‌محور برای نمایش اطلاعات، وضعیت‌ها و ابزارهای هوشمند با ظاهر حرفه‌ای. (UI/UX، Python، AI)\n\n۰۳ لندینگ پیج — صفحه فرود سریع و واکنش‌گرا با ساختار واضح و دعوت به اقدام. (Responsive، UX، Frontend)\n\n۰۴ ساخت و ادیت ویدیو — ساخت، ادیت و تدوین ویدیوهای حرفه‌ای برای معرفی، تبلیغات و شبکه‌های اجتماعی.\n\n۰۵ تولید محتوا — تولید محتوای خلاقانه و هدفمند برای معرفی برند و جذب مخاطب.'},

    {k:['خدمات','خدمات شما','what we do','زمینه فعالیت','چه خدماتی'],a:'بخش «خدمات ما»ی سایت — زمینه‌هایی که روی آن تمرکز می‌کنیم:\n\n۰۱ طراحی وب‌سایت — صفحات مدرن، مرتب و واکنش‌گرا برای نمایش حرفه‌ای در موبایل، تبلت و کامپیوتر.\n\n۰۲ توسعه فرانت‌اند — ساخت صفحات تعاملی با HTML، CSS و JavaScript و ایجاد تجربه‌ای روان و کاربردی.\n\n۰۳ بهبود ظاهر سایت — بازطراحی رنگ، فاصله‌ها، تایپوگرافی و جزئیات بصری برای حرفه‌ای‌تر شدن سایت.\n\n۰۴ سازگاری با موبایل — بهینه‌سازی چیدمان تا سایت در همه صفحه‌ها مرتب و قابل استفاده باقی بماند.\n\n۰۵ تولید محتوا — ساخت ویدیو و محتوای بصری برای سایت و شبکه‌های اجتماعی.'},

    {k:['مهارت ها','مهارت‌ها','our skills','با چی کار می کنید','تکنولوژی ها'],a:'بخش «مهارت‌های» سایت:\n\n• HTML — ساختار\n• CSS — طراحی\n• JavaScript — تعاملی\n• Python — برنامه‌نویسی\n• هوش مصنوعی — AI\n• UI/UX — رابط کاربری\n• ساخت و تدوین ویدیو — تدوین ویدیو\n\nو در بخش درباره ما هم روی طراحی رابط‌های مدرن، تجربه کاربری، Python و هوش مصنوعی تأکید شده است.'},

    {k:['روند کار','مراحل کار','process','چطور کار می کنید','فرایند'],a:'بخش «روند انجام کار» در سایت — یک مسیر ساده و شفاف از ایده تا نتیجه:\n\n۱) ایده — بررسی نیاز و هدف\n۲) طراحی — ساخت ظاهر و ساختار\n۳) توسعه — پیاده‌سازی و تعاملات\n۴) تحویل — بررسی و آماده‌سازی'},

    {k:['اطلاع رسانی','خبرنامه','اخبار','news','updates'],a:'بخش «اطلاع‌رسانی» سایت:\n\n«برای دریافت اطلاع‌رسانی و دنبال‌کردن آخرین مطالب، از راه‌های زیر همراه ما باشید.»\n\nراه‌های ارتباطی: اینستاگرام، تلگرام و ایتا — از بخش «تماس» یا پایین صفحه در دسترس هستند.'},

    {k:['ایتا','ایتا دارید'],a:'بله، مرتکس در «ایتا» هم حضور دارد. راه ارتباطی ایتا در بخش «ثبت سفارش» و تماس سایت قرار داده شده است.\n\nهمچنین می‌توانید از شمارهٔ ۰۹۱۹۷۰۲۹۲۱۳ استفاده کنید.'},

    {k:['شعار','slogan','یک تیم دو نفر','مسیر مشترک'],a:'شعار مرتکس: «یک تیم، دو نفر، یک مسیر مشترک».\n\nو در بخش درباره ما: «یک طراحی خوب فقط زیبا نیست؛ باید حس خوب استفاده کردن را هم منتقل کند.»\n\nآمار بخش درباره ما: ۲ عضو یک گروه · ∞ ایده برای ساختن · ۱ مسیر مشترک.'},

    {k:['هوش مصنوعی بلدید','ai کار','python','پایتون'],a:'بله. بر اساس بخش «مهارت‌ها»ی سایت، مرتکس روی این موارد کار می‌کند:\n\n• Python — برنامه‌نویسی\n• هوش مصنوعی (AI)\n• UI/UX — رابط کاربری\n• JavaScript — تعاملی\n\nو در معرفی گروه آمده: «روی طراحی رابط‌های مدرن، تجربه کاربری، برنامه‌نویسی Python و هوش مصنوعی کار می‌کنیم.»'},

    {k:['وبسایت شخصی','پرتفولیو','سایت شخصی'],a:'«وب‌سایت شخصی» یکی از نمونه‌کارهای مرتکس است:\n\nپرتفولیویی مدرن با تمرکز روی هویت شخصی، تایپوگرافی، انیمیشن و تجربه کاربری روان.\n\nتکنولوژی: HTML، CSS، JavaScript.'},

    {k:['داشبورد هوشمند','داشبورد'],a:'«داشبورد هوشمند» یکی از نمونه‌کارهای مرتکس است:\n\nرابط داده‌محور برای نمایش اطلاعات، وضعیت‌ها و ابزارهای هوشمند با ظاهر حرفه‌ای.\n\nتکنولوژی: UI/UX، Python، AI.'},

    {k:['بهبود ظاهر سایت','بازطراحی سایت','ظاهر سایت'],a:'«بهبود ظاهر سایت» یکی از خدمات مرتکس است:\n\nبازطراحی رنگ، فاصله‌ها، تایپوگرافی و جزئیات بصری برای حرفه‌ای‌تر شدن سایت.\n\nاگر سایت دارید و می‌خواهید مدرن‌تر شود، در فرم ثبت سفارش این گزینه را انتخاب کنید.'},

    {k:['شبکه اجتماعی','اینستاگرام','تلگرام','لینکدین','واتساپ','شبکه‌های اجتماعی'],a:'راه‌های ارتباطی مرتکس از بخش «تماس» در همین سایت و همچنین لینک‌های پایین صفحه در دسترس است.\n\nبرای شروع سریع‌تر، از فرم «ثبت سفارش» یا شمارهٔ ۰۹۱۹۷۰۲۹۲۱۳ استفاده کنید.'},

    {k:['کد نویسی','برنامه نویسی','فرانت اند','بک اند','react','javascript','تکنولوژی'],a:'تخصص اصلی ما فرانت‌اند و پیاده‌سازی رابط کاربری است؛ با تمرکز روی سرعت، دقت و تجربهٔ کاربری.\n\nاگر پروژه به بک‌اند یا پایگاه داده نیاز داشته باشد، در نیازسنجی مشخص و برنامه‌ریزی می‌شود.'},

    {k:['تحویل','تحویل پروژه','فایل نهایی','سورس کد','مالکیت'],a:'پس از تسویهٔ نهایی، فایل‌ها و خروجی‌های پروژه به شما تحویل داده می‌شود. جزئیات دقیق (شامل سورس‌کد و دامنه) در توافق ثبت سفارش مشخص می‌شود.'},

    {k:['دامنه','هاست','سرور','میزبانی','هستینگ'],a:'انتخاب و راه‌اندازی دامنه و هاست بخشی از کار است و در زمان ثبت سفارش راهنمایی می‌شویم. اگر دامنه یا هاست دارید، همان را استفاده می‌کنیم.'},

    {k:['چند صفحه','تعداد صفحه','صفحات'],a:'تعداد صفحات بسته به نیاز شما تعیین می‌شود؛ از سایت تک‌صفحه‌ای تا سایت چندصفحه‌ای کامل.\n\nدر توضیحات سفارش بنویسید چند صفحه لازم دارید تا برآورد دقیق بدهیم.'},

    {k:['قرارداد','توافق','فاکتور','رسمی'],a:'بله، کار به‌صورت توافقی و شفاف پیش می‌رود و جزئیات در زمان ثبت سفارش مشخص می‌شود.'},

    {k:['رایگان','تخفیف ویژه','کد تخفیف','تخفیف دارید'],a:'دربارهٔ اشتراک مدل‌های هوش مصنوعی، امکان خرید با تخفیف ویژه وجود دارد؛ چون تیم ما ایرانی است، قیمت‌ها برای شما ارزان‌تر از جاهای دیگر دنیا تمام می‌شود.'},

    {k:['امنیت','امن','هک','محافظت'],a:'سایت‌ها با رعایت اصول پایهٔ امنیت ساخته می‌شوند؛ اعتبارسنجی ورودی‌ها، جلوگیری از تزریق کد و رعایت استانداردهای وب.\n\nبرای پروژه‌های حساس، لایه‌های امنیتی بیشتر در نیازسنجی تعریف می‌شود.'},

    {k:['سرعت','سریع','بهینه','لگ','کند'],a:'بهینه‌سازی سرعت بخشی از کار ماست؛ کاهش حجم، بارگذاری هدفمند و ساختار سبک.\n\nاگر سایت فعلی‌تان کند است، در سفارش بنویسید «بهینه‌سازی سرعت» تا بررسی کنیم.'},

    {k:['سیستم مدیریت','پنل مدیریت','ادمین','داشبورد'],a:'بله، ساخت پنل مدیریت و داشبورد اختصاصی انجام می‌شود؛ مثل همین پنل مدیریت سفارشات این سایت.\n\nدر سفارش مشخص کنید چه بخش‌هایی نیاز به مدیریت دارد.'},

    {k:['اپلیکیشن','موبایل اپ','اندروید','ios'],a:'تمرکز اصلی مرتکس روی وب است؛ اما اگر اپلیکیشن مدنظرتان است، در نیازسنجی بررسی می‌کنیم و مسیر مناسب را پیشنهاد می‌دهیم.'},

    {k:['رزومه','سابقه کاری','تجربه','چند سال'],a:'نمونه‌کارها و مسیر کاری مرتکس در بخش «پروژه‌ها» و «درباره» همین سایت قابل مشاهده است.'},

    {k:['کی هستی','چی هستی','معرفی کن'],a:AI_BOT_INFO+'\n\n'+AI_ABOUT_M},

    {k:['خوب','عالی','ممنون','دمت گرم','مرسی'],a:'ممنون از شما 🙏 اگر سؤال دیگری دارید در خدمتم. برای شروع پروژه هم می‌توانید از بخش «ثبت سفارش» اقدام کنید.'},

    {k:['سوال','پرسش','کمک','راهنمایی'],a:'حتماً! سؤال‌تان را دقیق‌تر بنویسید یا از نمونه‌سؤال‌های پایین یکی را انتخاب کنید.\n\nموضوعاتی که کامل پوشش می‌دهم: خدمات، هزینه، زمان تحویل، نمونه‌کار، پرداخت، پشتیبانی، ثبت سفارش و وضعیت مدل‌های هوش مصنوعی.'}
  ];

  /* ============================================================
     بانک تخصص فنی مرتکس — پاسخ عمیق دربارهٔ هر تخصص
     ساختار: subject → { about, tools, cost, time, edge, done }
     ============================================================ */
  var MX_SKILL=[
    {n:['طراحی وبسایت','طراحی سایت','وبسایت اختصاصی','سایت اختصاصی'],
     about:'طراحی وب‌سایت اختصاصی یعنی ساخت یک سایت از صفر، دقیقاً بر اساس نیاز کسب‌وکار شما — نه قالب آماده.\n\nاین کار شامل سه لایه است:\n• ساختار و معماری اطلاعات: چه صفحاتی، با چه ترتیبی و چه ارتباطی\n• طراحی رابط کاربری (UI): ظاهر، رنگ، تایپوگرافی و حس برند\n• پیاده‌سازی (فرانت‌اند): تبدیل طرح به کد سریع و دقیق',
     tools:'ابزار و تکنولوژی ما: HTML5، CSS3، JavaScript مدرن، انیمیشن‌های GPU-محور، WebGL/Three.js برای صحنه‌های سه‌بعدی، و طراحی کاملاً ریسپانسیو.',
     time:'سایت تک‌صفحه‌ای: حدود ۳ تا ۷ روز کاری\nسایت چندصفحه‌ای شرکتی: حدود ۲ تا ۴ هفته\nپروژهٔ اختصاصی با پنل مدیریت: بر اساس نیازسنجی',
     edge:'تفاوت سایت اختصاصی با قالب آماده: قالب آماده سریع‌تر و ارزان‌تر است اما محدود، سنگین و مشابه هزاران سایت دیگر.\nسایت اختصاصی سبک‌تر، سریع‌تر، منحصربه‌فرد و قابل توسعه است.'},

    {n:['فرانت اند','فرانت‌اند','رابط کاربری','یو ای','UI'],
     about:'فرانت‌اند یعنی بخشی از سایت که کاربر می‌بیند و با آن کار می‌کند: چیدمان، دکمه‌ها، فرم‌ها، انیمیشن‌ها و تعامل‌ها.\n\nکیفیت فرانت‌اند تعیین می‌کند کاربر راحت باشد یا خسته شود — و همین مستقیماً روی فروش اثر می‌گذارد.',
     tools:'ما روی ساختار معنایی HTML، CSS مدرن (Grid/Flex/متغیرهای CSS)، JavaScript بدون وابستگی اضافه، و دسترس‌پذیری (a11y) تمرکز می‌کنیم.',
     edge:'فرانت‌اند ضعیف = کندی، پرش چیدمان، ناسازگاری با موبایل و از دست دادن کاربر.\nفرانت‌اند درست = بارگذاری سریع، تجربهٔ روان و نرخ تبدیل بالاتر.'},

    {n:['ریسپانسیو','موبایل','سازگار با موبایل','تبلت'],
     about:'ریسپانسیو یعنی سایت در هر اندازهٔ صفحه‌ای درست و خوانا نمایش داده شود؛ از موبایل کوچک تا مانیتور بزرگ.\n\nامروز بیش از ۷۰٪ بازدید سایت‌های ایرانی از موبایل است، پس این بخش اختیاری نیست.',
     tools:'رویکرد mobile-first، نقاط شکست (breakpoints) هدفمند، تصاویر تطبیقی و آزمون روی اندازه‌های واقعی.',
     edge:'اشتباه رایج: کوچک‌کردن نسخهٔ دسکتاپ برای موبایل. این کار باعث دکمه‌های ریز و متن ناخوانا می‌شود.\nروش درست: طراحی جداگانهٔ تجربهٔ موبایل.'},

    {n:['سئو','seo','بهینه سازی موتور جستجو','گوگل'],
     about:'سئو یعنی کاری کنیم سایت در نتایج گوگل بهتر دیده شود.\n\nدو بخش دارد:\n• سئوی فنی: سرعت، ساختار، متاتگ‌ها، نقشهٔ سایت، داده‌های ساختاریافته\n• سئوی محتوایی: کلمات کلیدی، کیفیت متن، لینک‌سازی',
     tools:'سئوی پایه (فنی + ساختار) بخشی از پروژهٔ ماست. سئوی محتوایی مستمر نیاز به همکاری بلندمدت دارد.',
     edge:'سئو نتیجهٔ فوری نمی‌دهد؛ معمولاً ۳ تا ۶ ماه زمان می‌برد تا اثرش دیده شود.\nهیچ‌کس نمی‌تواند وعدهٔ «صفحهٔ اول گوگل در یک هفته» بدهد.'},

    {n:['سرعت سایت','بهینه سازی سرعت','پرفورمنس','کندی سایت','سایت کند'],
     about:'سرعت سایت روی تجربهٔ کاربر، نرخ پرش و رتبهٔ گوگل اثر مستقیم دارد.\n\nعوامل اصلی کندی: تصاویر حجیم، کد اضافه، درخواست‌های زیاد به سرور و انیمیشن‌های سنگین.',
     tools:'بهینه‌سازی تصویر، حداقل‌سازی کد، بارگذاری تنبل (lazy load)، کش کردن، و انیمیشن روی GPU به‌جای CPU.',
     edge:'یک سایت کند هر ثانیه بخشی از کاربران را از دست می‌دهد. بهبود سرعت از ارزان‌ترین راه‌های افزایش فروش است.'},

    {n:['انیمیشن','متحرک','افکت','حرکت'],
     about:'انیمیشن سایت یعنی حرکت‌های هدفمند که تجربه را زنده می‌کند: ظاهر شدن تدریجی بخش‌ها، واکنش دکمه‌ها، انتقال بین صفحه‌ها.\n\nانیمیشن درست راهنما است؛ انیمیشن اشتباه حواس‌پرتی.',
     tools:'ما انیمیشن را با CSS و رندر GPU می‌سازیم تا سبک بماند، و برای موارد خاص از WebGL استفاده می‌کنیم.',
     edge:'قانون طلایی: انیمیشن باید زیر ۳۰۰ میلی‌ثانیه و قابل رد کردن (skip) باشد.\nهمچنین برای کاربرانی که «کاهش حرکت» را فعال کرده‌اند، انیمیشن باید خودکار خاموش شود.'},

    {n:['سه بعدی','three js','three.js','وب جی ال','webgl','3d'],
     about:'تجربهٔ سه‌بعدی در وب یعنی نمایش مدل، صحنه یا حرکت سه‌بعدی داخل مرورگر بدون نصب هیچ برنامه‌ای.\n\nکاربرد: معرفی محصول، صحنهٔ سینمایی، لوگوی متحرک، نمایش تعاملی.',
     tools:'ابزار اصلی ما Three.js روی WebGL است؛ همان تکنولوژی که در همین سایت برای صحنهٔ لپ‌تاپ‌ها استفاده شده.',
     edge:'محدودیت واقعی: WebGL در همهٔ گوشی‌ها و مرورگرهای قدیمی پشتیبانی نمی‌شود.\nراه‌حل درست: همیشه یک نسخهٔ سادهٔ جایگزین (fallback) داشته باشیم تا سایت خراب نشود.'},

    {n:['پنل مدیریت','داشبورد','ادمین','سیستم مدیریت محتوا','cms'],
     about:'پنل مدیریت یک صفحهٔ محافظت‌شده است که شما از آن محتوا، سفارش‌ها، کاربران یا آمار سایت را مدیریت می‌کنید — بدون نیاز به کدنویسی.',
     tools:'مثل پنل مدیریت سفارشات همین سایت: ورود با رمز، نمایش آمار، تغییر وضعیت، خروجی گرفتن و حذف.',
     edge:'نکتهٔ مهم امنیتی: اگر سایت فقط HTML است، هر رمزی داخل فایل قابل دیدن است.\nبرای پنل واقعاً امن، سرور و احراز هویت سمت سرور لازم است.'},

    {n:['فروشگاهی','فروشگاه اینترنتی','ای کامرس','سبد خرید','درگاه پرداخت'],
     about:'سایت فروشگاهی شامل فهرست محصول، صفحهٔ محصول، سبد خرید، تسویه و اتصال به درگاه پرداخت است.\n\nچالش اصلی، تجربهٔ خرید روان است: هر مرحلهٔ اضافه، بخشی از مشتری‌ها را فراری می‌دهد.',
     tools:'پیاده‌سازی اختصاصی یا اتصال به سیستم‌های آماده؛ درگاه پرداخت ایرانی (زرین‌پال، آیدی‌پی و…) و اتصال به انبار.',
     edge:'تنها ساختن سایت کافی نیست؛ مدیریت موجودی، ارسال و پشتیبانی هم لازم است.\nپیشنهاد ما: شروع کوچک با چند محصول و رشد تدریجی.'},

    {n:['هویت بصری','برندینگ','لوگو','طراحی گرافیک','رنگ برند'],
     about:'هویت بصری یعنی زبان تصویری یک برند: لوگو، پالت رنگ، تایپوگرافی، فاصله‌ها و قواعد استفاده.\n\nهویت یکدست باعث می‌شود مخاطب شما را درست تشخیص دهد و به‌خاطر بسپارد.',
     tools:'لوگو، پالت رنگ، سیستم تایپوگرافی، آیکون‌ها و راهنمای استفاده (brand guide).',
     edge:'اشتباه رایج: تغییر مداوم رنگ و ظاهر.\nیک برند قوی، سال‌ها یک زبان بصری را حفظ می‌کند.'},

    {n:['تولید محتوا','کپی رایتینگ','نوشتن متن','مقاله'],
     about:'تولید محتوا یعنی نوشتن متن‌هایی که هم برای کاربر مفید باشند و هم برای موتور جستجو.\n\nمتن خوب سه ویژگی دارد: روشن، کوتاه و هدفمند.',
     tools:'متن صفحات، معرفی خدمات، مقالات، توضیح محصول و متن شبکه‌های اجتماعی.',
     edge:'متن پر از کلمهٔ کلیدی بدون معنا، به سئو آسیب می‌زند.\nگوگل کیفیت و مفید بودن را می‌سنجد، نه تکرار کلمه.'},

    {n:['ویدیو','تدوین','مونتاژ','کلیپ','تیزر'],
     about:'ساخت و تدوین ویدیو شامل فیلم‌برداری، تدوین، صداگذاری، زیرنویس و خروجی متناسب با هر پلتفرم است.',
     tools:'کلیپ معرفی کسب‌وکار، ویدیوی محصول، محتوای شبکه‌های اجتماعی و تیزر تبلیغاتی.',
     edge:'هر پلتفرم نسبت تصویر و مدت متفاوتی می‌خواهد: اینستاگرام عمودی، یوتیوب افقی.\nیک ویدیو را نباید بی‌تغییر همه‌جا استفاده کرد.'},

    {n:['امنیت','هک','محافظت سایت','نفوذ'],
     about:'امنیت سایت یعنی جلوگیری از دسترسی غیرمجاز، دزدیدن داده و دستکاری محتوا.\n\nپایه‌های امنیت: اعتبارسنجی ورودی، جلوگیری از تزریق کد (XSS/SQLi)، HTTPS و مدیریت درست رمز.',
     tools:'رعایت اصول OWASP، رمزنگاری ارتباط، و کنترل دقیق دسترسی.',
     edge:'مهم‌ترین حقیقت: هیچ سایت کاملاً امنی وجود ندارد.\nهدف واقعی، بالا بردن هزینهٔ حمله و کاهش سطح آسیب است.'},

    {n:['هاست','دامنه','سرور','میزبانی','هستینگ','ssl'],
     about:'دامنه، نام سایت شماست (مثل example.ir) و هاست، فضایی است که فایل‌های سایت روی آن قرار می‌گیرد.\n\nانتخاب درست هاست روی سرعت و پایداری سایت اثر مستقیم دارد.',
     tools:'ثبت دامنه، راه‌اندازی هاست، گواهی SSL (قفل سبز و https) و تنظیم DNS.',
     edge:'هاست ارزان اشتراکی برای سایت‌های پربازدید مناسب نیست و باعث کندی می‌شود.\nاگر رشد سریع دارید، از ابتدا سرور اختصاصی بگیرید.'},

    {n:['دسترس پذیری','دسترس‌پذیری','a11y','ناتوانی'],
     about:'دسترس‌پذیری یعنی سایت برای همه قابل استفاده باشد؛ از جمله کاربران نابینا، کم‌بینا یا دارای محدودیت حرکتی.\n\nمثال: متن قابل بزرگ‌نمایی، کنتراست کافی، امکان استفاده با صفحه‌کلید.',
     tools:'ساختار معنایی، برچسب‌های ARIA، کنتراست رنگی مناسب و متن جانشین برای تصاویر.',
     edge:'در ایران اهمیت این موضوع کمتر شناخته شده، اما هم اخلاقی است و هم سئو را بهبود می‌دهد.'},

    {n:['اینتراکشن','تعامل','میکرو انیمیشن','تجربه کاربری','ux'],
     about:'تجربهٔ کاربری (UX) یعنی طراحی مسیری که کاربر بدون سردرگمی به هدفش برسد.\n\nمثال: پیدا کردن سریع دکمهٔ تماس، فرم کوتاه، پیام خطای واضح.',
     tools:'طراحی جریان کاربر، ساده‌سازی فرم‌ها، پیام‌های راهنما و آزمون واقعی.',
     edge:'بزرگ‌ترین دشمن UX، پیچیدگی است.\nهر فیلد اضافه در فرم، بخشی از کاربران را فراری می‌دهد.'},

    {n:['api','ای پی ای','اتصال به سیستم','وب سرویس','integratsion'],
     about:'API یعنی راه ارتباط دو نرم‌افزار با هم.\n\nمثال: اتصال فرم سایت به گوگل شیت، یا اتصال سایت به درگاه پرداخت یا سیستم انبار.',
     tools:'ما از APIهای عمومی و سرویس‌های ابری (مثل Supabase) برای ثبت داده‌ها استفاده می‌کنیم.',
     edge:'نکتهٔ امنیتی مهم: کلید API هرگز نباید داخل کد سمت کاربر (HTML) قرار بگیرد.\nکلید باید روی سرور بماند.'},

    {n:['ووکامرس','وردپرس','قالب آماده','المانور'],
     about:'سیستم‌های آماده مثل وردپرس و ووکامرس برای راه‌اندازی سریع مناسب‌اند.\n\nاما محدودیت دارند: سنگین‌تر، وابسته به افزونه و کندتر از سایت اختصاصی.',
     tools:'ما در صورت نیاز می‌توانیم روی سیستم آماده کار کنیم، اما تمرکز اصلی روی ساخت اختصاصی است.',
     edge:'افزونه‌های زیاد = کندی و حفره‌های امنیتی.\nهر افزونه یک ریسک و یک بار اضافه است.'},

    {n:['نگهداری','پشتیبانی سایت','بروزرسانی','بعد از تحویل'],
     about:'سایت یک محصول زنده است؛ نیاز به بروزرسانی، پشتیبان‌گیری و رفع اشکال دارد.',
     tools:'پشتیبان‌گیری منظم، بروزرسانی امنیتی، پایش سرعت و رفع خطاها.',
     edge:'بدون پشتیبان‌گیری، یک خطای ساده می‌تواند کل سایت را از بین ببرد.\nپشتیبان‌گیری خودکار، ارزان‌ترین بیمهٔ سایت است.'},

    {n:['هزینه طراحی سایت','قیمت سایت','برآورد هزینه'],
     about:'هزینهٔ سایت به این عوامل بستگی دارد:\n• تعداد و پیچیدگی صفحات\n• طراحی اختصاصی یا قالب آماده\n• وجود پنل مدیریت یا فروشگاه\n• انیمیشن و جلوه‌های ویژه\n• سئو و بهینه‌سازی',
     tools:'برای برآورد دقیق، در فرم «ثبت سفارش» فیلد بودجهٔ تقریبی را پر کنید تا پیشنهاد شفاف بدهیم.',
     edge:'ارزان‌ترین گزینه معمولاً گران‌ترین است؛ چون بعداً باید بازنویسی شود.\nکیفیت کد از ابتدا، هزینهٔ آینده را کم می‌کند.'},

    {n:['چه کار می کنی','چه کاری بلدی','چه بلدی','تخصص شما','مهارت شما','توانایی'],
     about:'من ربات دستیار مرتکس هستم و دربارهٔ تخصص‌های این تیم کامل توضیح می‌دهم.\n\nمرتکس در این حوزه‌ها تخصص دارد:',
     tools:'',
     edge:''},

    /* ---- لایهٔ دوم: تخصص‌های تکمیلی ---- */
    {n:['لندینگ پیج','لندینگ','صفحه فرود','تک صفحه'],
     about:'لندینگ‌پیج یک صفحهٔ مستقل است که هدفش یک کار مشخص است: گرفتن شماره، ثبت سفارش یا معرفی یک محصول.\n\nبرخلاف سایت کامل، هیچ منوی اضافه و مسیر انحرافی ندارد؛ همه‌چیز کاربر را به یک دکمهٔ نهایی می‌رساند.',
     tools:'ساختار AIDA، دکمهٔ عمل (CTA) واضح، فرم کوتاه، و سرعت بارگذاری بالا.',
     time:'لندینگ‌پیج ساده: حدود ۲ تا ۴ روز کاری',
     edge:'اشتباه رایج: گذاشتن چند هدف در یک صفحه.\nهر هدف اضافه، تمرکز کاربر را می‌شکند و نرخ تبدیل را پایین می‌آورد.'},

    {n:['کارت پستال','کاتالوگ','بروشور','pdf سایت'],
     about:'کاتالوگ دیجیتال یا بروشور PDF یعنی معرفی محصولات و خدمات در قالبی که راحت فرستاده و چاپ می‌شود.',
     tools:'طراحی صفحه‌آرایی، خروجی PDF بهینه و نسخهٔ قابل چاپ.',
     edge:'فایل سنگین PDF در موبایل باز نمی‌شود.\nهمیشه نسخهٔ سبک برای موبایل هم بسازید.'},

    {n:['زیرنویس','کپشن','زیرنویس خودکار','subtitle'],
     about:'زیرنویس و کپشن متن روی ویدیو است؛ برای بی‌صدا دیدن و دسترس‌پذیری ضروری است.',
     tools:'زیرنویس هم‌زمان، کپشن استودیویی و خروجی SRT.',
     edge:'بیشتر کاربران شبکه‌های اجتماعی ویدیو را بی‌صدا می‌بینند.\nویدیوی بدون زیرنویس، بخش بزرگی از مخاطب را از دست می‌دهد.'},

    {n:['لایت هاوس','lighthouse','پیج اسپید','pagespeed','نمره سرعت'],
     about:'PageSpeed و Lighthouse ابزارهای گوگل برای سنجش سرعت، دسترس‌پذیری، سئو و بهترین شیوه‌های وب هستند.\n\nنمرهٔ سبز معمولاً از ۹۰ شروع می‌شود.',
     tools:'تحلیل گزارش، بهینه‌سازی تصاویر، حذف کد بی‌استفاده و بارگذاری تنبل.',
     edge:'نمرهٔ ابزار، هدف نهایی نیست؛ تجربهٔ واقعی کاربر مهم‌تر است.\nگاهی نمرهٔ ۹۵ با تجربهٔ خوب، از ۱۰۰ با تجربهٔ بد بهتر است.'},

    {n:['فاویکون','favicon','ایکون سایت','لوگو مرورگر'],
     about:'فاویکون تصویر کوچکی است که کنار عنوان سایت در تب مرورگر دیده می‌شود.',
     tools:'خروجی چند اندازه، فرمت SVG برای وضوح بالا و پشتیبانی از حالت تاریک.',
     edge:'بی‌توجهی به فاویکون، سایت را ناتمام نشان می‌دهد.\nجزئیات کوچک، حس حرفه‌ای بودن می‌سازد.'},

    {n:['اوپن گراف','open graph','پیش نمایش لینک','og tag'],
     about:'تگ‌های Open Graph تعیین می‌کنند وقتی لینک سایت شما در واتساپ یا تلگرام فرستاده می‌شود، چه تصویر و عنوانی نشان داده شود.',
     tools:'og:title، og:description، og:image و twitter:card.',
     edge:'بدون این تنظیمات، لینک شما در شبکه‌های اجتماعی خالی و بی‌جذاب دیده می‌شود\n— و همین روی نرخ کلیک اثر مستقیم دارد.'},

    {n:['فرم','فرم تماس','فرم سفارش','اعتبارسنجی فرم'],
     about:'فرم ابزار اصلی گرفتن اطلاعات از کاربر است: تماس، سفارش یا نظرسنجی.\n\nفرم خوب کوتاه، واضح و با پیام خطای دقیق است.',
     tools:'اعتبارسنجی سمت کاربر و سرور، پیام خطای روشن، و ذخیرهٔ مطمئن داده.',
     edge:'نکتهٔ امنیتی: اعتبارسنجی فقط در مرورگر کافی نیست.\nهر داده‌ای از کاربر می‌آید باید سمت سرور هم بررسی شود.'},

    {n:['گوگل شیت','google sheet','اتصال به گوگل','sheet'],
     about:'اتصال سایت به گوگل شیت یعنی داده‌های فرم‌ها مستقیم در یک صفحهٔ اکسل آنلاین ذخیره شود — بدون نیاز به سرور گران.\n\nاین سایت سفارش‌ها را در دیتابیس واقعی (Supabase / PostgreSQL) ذخیره می‌کند، که سریع‌تر و مطمئن‌تر از گوگل شیت است.',
     tools:'Google Apps Script، درخواست JSONP و ذخیره‌سازی خودکار ردیف‌ها.',
     edge:'محدودیت: گوگل شیت برای حجم کم عالی است، اما برای هزاران رکورد در روز مناسب نیست.\nدر آن صورت پایگاه دادهٔ واقعی لازم است.'},

    {n:['اپس اسکریپت','apps script','اسکریپت گوگل'],
     about:'Apps Script زبان برنامه‌نویسی گوگل است که به شیت، ایمیل و تقویم وصل می‌شود و می‌تواند به‌عنوان یک API سادهٔ رایگان کار کند.',
     tools:'توابع doGet و doPost، بازگرداندن JSON و مدیریت داده در شیت.',
     edge:'محدودیت مهم: اجرای Apps Script کند است و سهمیهٔ روزانه دارد.\nبرای ترافیک بالا باید به سرور واقعی مهاجرت کرد.'},

    {n:['دیباگ','رفع خطا','خطای سایت','باگ'],
     about:'دیباگ یعنی پیدا کردن علت واقعی یک مشکل، نه فقط پاک کردن نشانهٔ آن.',
     tools:'کنسول مرورگر، بررسی شبکه، گزارش خطا و آزمون مرحله‌به‌مرحله.',
     edge:'اشتباه رایج: تغییر دادن کد به‌صورت تصادفی تا خطا برود.\nاین کار اغلب مشکل بزرگ‌تری می‌سازد که بعداً پیدا کردنش سخت‌تر است.'},

    {n:['ریسپانسیو تست','تست موبایل','تست مرورگر','سازگاری مرورگر'],
     about:'آزمون سازگاری یعنی مطمئن شویم سایت روی مرورگرها و گوشی‌های مختلف درست کار می‌کند.',
     tools:'آزمون روی اندازه‌های واقعی، بررسی Safari و Chrome، و آزمون لمس.',
     edge:'Safari روی آیفون بیشترین تفاوت را با بقیه دارد.\nاگر فقط روی کروم تست کنید، بخشی از کاربران مشکل می‌بینند.'},

    {n:['انیمیشن لود','loading','صفحه انتظار','skeleton'],
     about:'حالت بارگذاری یعنی وقتی داده‌ای هنوز نرسیده، کاربر جای خالی یا نشانگر انتظار ببیند — نه صفحهٔ سفید.',
     tools:'اسکلتون اسکرین، نشانگر پیشرفت و انتقال نرم.',
     edge:'صفحهٔ سفید حتی برای دو ثانیه، حس «خراب بودن» می‌دهد.\nحالت بارگذاری، همان دو ثانیه را قابل تحمل می‌کند.'},

    {n:['پیام خطا','error','خطای کاربر','پیام سیستم'],
     about:'پیام خطای خوب سه چیز می‌گوید: چه شد، چرا شد، و کاربر چه کار کند.\n\nپیام بد فقط می‌گوید «خطا رخ داد».',
     tools:'متن روشن فارسی، مشخص کردن فیلد مشکل‌دار و راه‌حل پیشنهادی.',
     edge:'پیام خطای فنی و انگلیسی، کاربر را فراری می‌دهد.\nهرگز کد خطا را بدون توضیح به کاربر نشان ندهید.'},

    {n:['بهینه سازی تصویر','فشرده سازی','webp','حجم تصویر'],
     about:'تصاویر بزرگ، عامل شمارهٔ یک کندی سایت‌ها هستند.\n\nبهینه‌سازی یعنی همان کیفیت با حجم بسیار کمتر.',
     tools:'فرمت WebP، اندازه‌های تطبیقی، و بارگذاری تنبل تصاویر پایین صفحه.',
     edge:'یک تصویر ۵ مگابایتی می‌تواند یک سایت سریع را کاملاً کند کند.\nقانون ساده: هیچ تصویری نباید بیش از ۳۰۰ کیلوبایت باشد.'},

    {n:['فونت','تایپوگرافی','vazir','فونت فارسی'],
     about:'تایپوگرافی فارسی چالش‌های خاص خودش را دارد: اتصال حروف، ارتفاع خط و خوانایی در اندازه‌های کوچک.',
     tools:'فونت‌های استاندارد فارسی مثل وزیرمتن، تنظیم ارتفاع خط و اندازهٔ بهینه.',
     edge:'فونت نامناسب، متن فارسی را خسته‌کننده می‌کند.\nهمچنین فونت وب حجیم، سرعت را کم می‌کند؛ باید زیرمجموعه‌سازی شود.'},

    {n:['دارک مود','حالت تاریک','تم شب','dark mode'],
     about:'حالت تاریک، ظاهر سایت را برای محیط کم‌نور تغییر می‌دهد و برای چشم راحت‌تر است.',
     tools:'متغیرهای CSS، تشخیص خودکار تنظیم سیستم، و ذخیرهٔ انتخاب کاربر.',
     edge:'حالت تاریک فقط معکوس کردن رنگ‌ها نیست.\nکنتراست و خوانایی باید جداگانه طراحی شود، وگرنه متن ناخوانا می‌شود.'},

    {n:['مولتی لنگویج','چند زبانه','دوزبانه','ترجمه سایت'],
     about:'سایت چندزبانه یعنی نمایش محتوا به بیش از یک زبان، با ساختار درست برای موتور جستجو.',
     tools:'ساختار hreflang، مسیرهای جدا برای هر زبان و ذخیرهٔ انتخاب کاربر.',
     edge:'ترجمهٔ ماشینی بدون بازبینی، اعتبار برند را خراب می‌کند.\nبرای هر زبان باید محتوا بازبینی انسانی شود.'},

    {n:['ابزار تحلیل','گوگل آنالیتیکس','analytics','امار سایت'],
     about:'ابزار تحلیل نشان می‌دهد کاربران از کجا می‌آیند، چه صفحه‌ای می‌بینند و کجا می‌روند.\n\nبدون این داده، تصمیم‌گیری حدس است.',
     tools:'نصب کد رهگیری، تعریف رویداد و ساخت گزارش‌های قابل فهم.',
     edge:'جمع‌آوری داده بدون اجازهٔ کاربر، مسئلهٔ حقوقی و اخلاقی است.\nباید شفاف گفته شود چه داده‌ای جمع می‌شود.'},

    {n:['دامنه بین المللی','دات کام','دات آی آر','انتخاب دامنه'],
     about:'انتخاب پسوند دامنه روی اعتماد و سئو اثر دارد.\n\nپسوند .ir برای مخاطب ایرانی اعتماد بیشتری می‌سازد و .com برای بازار جهانی مناسب‌تر است.',
     tools:'بررسی در دسترس بودن، ثبت به نام خودتان و تنظیم DNS.',
     edge:'نکتهٔ حیاتی: دامنه را حتماً به نام خودتان ثبت کنید.\nاگر به نام شرکت میزبان باشد، در آیندهٔ ممکن است آن را از دست بدهید.'},

    {n:['مهاجرت سایت','انتقال سایت','ری دیزاین','بازطراحی'],
     about:'مهاجرت سایت یعنی انتقال محتوا و ساختار از یک سیستم یا طراحی قدیمی به نسخهٔ جدید، بدون از دست دادن رتبهٔ گوگل.',
     tools:'نگاشت آدرس‌های قدیم به جدید، ریدایرکت ۳۰۱ و حفظ محتوا.',
     edge:'خطر اصلی: فراموش کردن ریدایرکت.\nاگر آدرس‌های قدیمی به ۴۰۴ بروند، تمام رتبهٔ گوگل از دست می‌رود.'},

    {n:['رار','zip','فایل فشرده','خروجی نهایی'],
     about:'تحویل نهایی پروژه یعنی همهٔ فایل‌ها، مستندات و دسترسی‌ها به‌صورت مرتب تحویل داده شود.',
     tools:'فایل فشردهٔ سورس، فایل مستندات، و دسترسی‌های هاست و دامنه.',
     edge:'تحویل خوب یعنی مشتری بتواند بدون کمک شما سایت را جابه‌جا کند.\nاگر وابسته بماند، تحویل کامل نبوده است.'},

    {n:['ریسک','خطر پروژه','مشکل پروژه','چالش'],
     about:'هر پروژهٔ وب ریسک‌هایی دارد: تغییر نیازها در میانه، تأخیر در تحویل محتوا، و انتظارات مبهم.\n\nمدیریت درست این ریسک‌ها، تفاوت پروژهٔ موفق و ناموفق است.',
     tools:'تقسیم پروژه به مراحل کوچک، تحویل تدریجی و بازخورد منظم.',
     edge:'بزرگ‌ترین ریسک، شروع بدون تعریف دقیق نیازهاست.\nهر ابهام در ابتدا، در میانهٔ کار چند برابر هزینه می‌سازد.'},

    {n:['نرخ تبدیل','افزایش فروش','تبدیل کاربر','conversion'],
     about:'نرخ تبدیل یعنی چه درصدی از بازدیدکنندگان به مشتری تبدیل می‌شوند.\n\nاین عدد مهم‌ترین شاخص یک سایت تجاری است.',
     tools:'بهبود دکمهٔ عمل، ساده‌کردن مسیر خرید، اعتمادسازی و آزمون A/B.',
     edge:'افزایش ترافیک بدون بهبود تبدیل، فقط هزینه است.\nدو برابر کردن نرخ تبدیل، همان اثر دو برابر کردن ترافیک را دارد — با هزینهٔ کمتر.'},

    {n:['ای بوک','کتاب الکترونیکی','دانلود فایل','لید مگنت'],
     about:'محتوای رایگان قابل دانلود (مثل ای‌بوک) ابزاری برای گرفتن شماره تماس و ساختن مخاطب است.',
     tools:'طراحی جلد، صفحهٔ دریافت و فرم کوتاه.',
     edge:'فایل بی‌کیفیت، اعتبار شما را کم می‌کند.\nمحتوای رایگان باید همان کیفیت کار پولی را داشته باشد.'},

    {n:['اسلایدر','کاروسل','گالری تصویر','نمایش تصاویر'],
     about:'اسلایدر برای نمایش چند تصویر یا پیام در فضای محدود است.',
     tools:'اسلایدر سبک بدون کتابخانهٔ حجیم، پشتیبانی از کشیدن لمسی و کنترل با صفحه‌کلید.',
     edge:'اسلایدر خودکار و سریع، آفت سایت‌هاست.\nکاربر نمی‌تواند بخواند و اسلاید عوض می‌شود. حرکت باید کند و قابل توقف باشد.'},

    {n:['مودال','پاپ اپ','پنجره شناور','popup'],
     about:'مودال یا پنجرهٔ شناور برای نمایش اطلاعات مهم بدون ترک صفحه استفاده می‌شود؛ مثل همین پنل سفارش این سایت.',
     tools:'تمرکز روی پنجره، بستن با کلید Escape و برگشت به حالت قبل.',
     edge:'پاپ‌آپ آزاردهنده، کاربر را فراری می‌دهد.\nهیچ پاپ‌آپی نباید بلافاصله بعد از ورود باز شود.'},
  ];
  var MX_SKILL_TAIL='من ربات دستیار مرتکس هستم و دربارهٔ تخصص‌های این تیم کامل توضیح می‌دهم.\n\nمرتکس در این حوزه‌ها تخصص دارد:\n\n• طراحی وب‌سایت اختصاصی و لندینگ‌پیج\n• توسعهٔ فرانت‌اند و رابط کاربری (UI)\n• تجربهٔ کاربری (UX)\n• طراحی ریسپانسیو و موبایل\n• صحنه و لوگوی سه‌بعدی با WebGL/Three.js\n• انیمیشن و تعامل پیشرفته\n• بهینه‌سازی سرعت و پرفورمنس\n• سئوی فنی و ساختاری\n• هویت بصری و طراحی لوگو\n• تولید محتوا و کپی‌رایتینگ\n• ساخت و تدوین ویدیو\n• پنل مدیریت و داشبورد اختصاصی\n• سایت فروشگاهی و درگاه پرداخت\n• اتصال به API و سرویس‌های بیرونی\n• امنیت پایهٔ وب و دسترس‌پذیری\n\nبپرسید دربارهٔ هر کدام کامل و تخصصی توضیح می‌دهم.';

  /* موتور پاسخ تخصصی: موضوع + نوع پرسش → پاسخ دقیق */
  var MX_INTENT=[
    {k:['چیه','چیست','یعنی چی','یعنی چه','چی هست','تعریف','چی کار میکنه'],f:'about'},
    {k:['چطور','چگونه','ابزار','با چی','چه تکنولوژی','چطور کار'],f:'tools'},
    {k:['هزینه','قیمت','چند','بودجه','تعرفه'],f:'cost'},
    {k:['زمان','چقدر طول','مدت','کی اماده','چند روز'],f:'time'},
    {k:['مزیت','بهتر','مزایا','چرا','محدودیت','عیب','ایراد'],f:'edge'},
    {k:['پشتیبانی','نگهداری','بعدش','اینده'],f:'support'}
  ];
  function mxSkillFind(n){
    var best=null,bestScore=0;
    MX_SKILL.forEach(function(sk){
      var sc=0;
      sk.n.forEach(function(key){
        var kk=aiNormKey(key);
        if(!kk)return;
        if(n.indexOf(kk)>-1)sc=Math.max(sc,kk.length*2);
      });
      if(sc>bestScore){bestScore=sc;best=sk}
    });
    return bestScore>=4?best:null;
  }
  function mxSkillAnswer(n){
    var sk=mxSkillFind(n);
    if(!sk)return null;
    var intent=null;
    for(var i=0;i<MX_INTENT.length;i++){
      for(var j=0;j<MX_INTENT[i].k.length;j++){
        if(n.indexOf(MX_INTENT[i].k[j])>-1){intent=MX_INTENT[i].f;break}
      }
      if(intent)break;
    }
    var head='📌 '+(sk.n[0]||'')+'\n\n';
    if(intent==='about')return head+sk.about;
    if(intent==='tools'){
      if(!sk.tools)return head+sk.about;
      return head+'پاسخ فنی:\n\n'+sk.tools;
    }
    if(intent==='cost'){
      var costBody=sk.cost||('هزینهٔ «'+(sk.n[0]||'این کار')+'» بسته به حجم و پیچیدگی کار تعیین می‌شود و عدد ثابتی برای آن نداریم.');
      return head+'هزینه:\n\n'+costBody+'\n\nبرای برآورد دقیق، در فرم «ثبت سفارش» فیلد بودجهٔ تقریبی را پر کنید تا تیم مرتکس پیشنهاد شفاف بدهد. مشاورهٔ اولیه رایگان است.';
    }
    if(intent==='time'){
      var timeBody=sk.time||('زمان انجام «'+(sk.n[0]||'این کار')+'» بسته به حجم کار متفاوت است و در نیازسنجی اعلام می‌شود.');
      return head+'زمان:\n\n'+timeBody+'\n\nبرای اعلام دقیق، در فرم سفارش حجم و جزئیات کار را توضیح دهید.';
    }
    if(intent==='edge'){
      if(!sk.edge)return head+sk.about;
      return head+'نکتهٔ مهم و محدودیت‌ها:\n\n'+sk.edge;
    }
    if(intent==='support'){
      return head+'پس از تحویل و پشتیبانی:\n\n'+sk.edge+'\n\nبرای پشتیبانی، از بخش «ثبت سفارش» یا شمارهٔ ۰۹۱۹۷۰۲۹۲۱۳ اقدام کنید.';
    }
    return head+sk.about+(sk.edge?'\n\n'+sk.edge:'');
  }
  function mxHasSkillList(n){
    return /(چه کار|چه کاری|چه بلدی|چی بلدی|توانایی|تخصص|مهارت)/.test(n);
  }

  var AI_FOLLOWUPS=[];
  AI_KB.forEach(function(item){
    item.k.forEach(function(key){
      AI_FOLLOWUPS.push({k:aiNormKey(key),a:item.a});
    });
  });
  function aiNormKey(s){
    return String(s||'').toLowerCase()
      .replace(/[\u064B-\u0652\u200c]/g,'')
      .replace(/[أإآ]/g,'ا').replace(/ي/g,'ی').replace(/ك/g,'ک')
      .replace(/[؟?!.,،:؛()"'«»\-_]/g,' ')
      .replace(/\s+/g,' ').trim();
  }

  function aiNorm(s){
    return String(s||'').toLowerCase()
      .replace(/[\u064B-\u0652\u200c]/g,'')
      .replace(/[أإآ]/g,'ا').replace(/ي/g,'ی').replace(/ك/g,'ک')
      .replace(/[؟?!.,،:؛()"'«»\-_]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function aiDate(iso){
    var d=new Date(iso);
    if(isNaN(d.getTime()))return iso;
    try{return d.toLocaleString('fa-IR',{dateStyle:'full',timeStyle:'short'})}catch(e){return d.toLocaleString('fa-IR')}
  }
  function aiTimeTag(iso){
    var d=new Date(iso);
    if(isNaN(d.getTime()))return '';
    try{
      return d.toLocaleDateString('fa-IR',{weekday:'long',day:'2-digit',month:'2-digit'})+
        ' ساعت '+d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});
    }catch(e){return ''}
  }

  /* واژه‌های پرسشی که در امتیازدهی نادیده گرفته می‌شوند */
  var AI_STOP=['چه','چی','چطور','چگونه','کجا','کی','آیا','هست','است','می','کن','کنید','کنم','دارید','دارد','شما','من','لطفا','بگو','بگویید','درباره','مورد','برای','از','به','با','و','یا','که','این','آن','یک','هم','را','خب','پس','الان','بعد'];

  /* واژه‌های هم‌معنا: پرسش کاربر را به واژگان دانش نزدیک می‌کند */
  var AI_SYN={
    'قیمت':'هزینه','تعرفه':'هزینه','مبلغ':'هزینه','هزینه اش':'هزینه',
    'بسازید':'می سازید','درست کنید':'می سازید','طراحی می کنید':'می سازید',
    'مدت':'زمان','چقدر طول':'زمان','کی تمام':'زمان','کی تحویل':'زمان',
    'تلفن':'شماره','موبایل':'شماره','همراه':'شماره','کانتکت':'شماره',
    'راه ارتباطی':'ارتباط','چطور تماس':'تماس',
    'سایت':'وبسایت','وب سایت':'وبسایت','صفحه وب':'وبسایت',
    'خرید':'اشتراک','بخرم':'اشتراک','تهیه کنم':'اشتراک',
    'رایگان':'مشاوره','بدون هزینه':'مشاوره',
    'هوش':'هوش مصنوعی','مدل های':'مدل','مدلها':'مدل','ai':'هوش مصنوعی',
    'ربات':'دستیار','چت بات':'دستیار',
    'قوی':'مدل','حرفه ای':'مدل','معروف':'مدل'
  };
  function aiSyn(n){
    var out=n;
    Object.keys(AI_SYN).forEach(function(k){
      var kk=aiNormKey(k);
      if(kk && out.indexOf(kk)>-1)out+=' '+AI_SYN[k];
    });
    return out;
  }
  function aiTokens(n){
    return n.split(' ').filter(function(w){return w.length>1 && AI_STOP.indexOf(w)===-1});
  }
  function aiScore(n,tokens,key){
    var s=0;
    if(n.indexOf(key)>-1){s+=key.length*2; if(n===key)s+=16}
    var kt=key.split(' ');
    kt.forEach(function(w){
      if(w.length<3)return;
      if(tokens.indexOf(w)>-1)s+=5;
      else if(n.indexOf(w)>-1)s+=3;
    });
    return s;
  }
  /* سؤال‌های کوتاه و پیرو: از پیام قبلی کاربر موضوع را می‌فهمد */
  var AI_LAST_TOPIC=null;
  function aiIsFollowUp(n){
    return n.split(' ').length<=3 && !/^سلام|^درود|^ممنون|^خداحافظ/.test(n);
  }
  function aiAnswer(q){
    var n=aiNorm(q);
    if(!n)return 'سؤالتان را بنویسید تا راهنمایی کنم.';
    n=aiSyn(n);
    if(validPhone(n) && !/[a-z\u0600-\u06FF]/.test(n)){
      return 'این شماره معتبر است ✅ شماره‌تان ثبت شد. حالا چه کمکی می‌توانم بکنم؟';
    }
    if(/\d{3,}/.test(n) && /(ساعت|تاریخ|امروز|الان|روز)/.test(n)){
      return 'الان '+aiDate(new Date().toISOString())+' است.';
    }

    var tokens=aiTokens(n);

    /* ۱) محتوای واقعی سایت (اعضای تیم، پروژه‌ها، خدمات، مهارت‌ها) — بالاترین اولویت */
    var site=null,siteScore=0;
    AI_KB.forEach(function(item){
      var score=0;
      item.k.forEach(function(key){
        var sc=aiScore(n,tokens,aiNormKey(key));
        if(sc>score)score=sc;
      });
      if(score>siteScore){siteScore=score;site=item}
    });
    /* اگر پرسش دقیقاً دربارهٔ محتوای سایت است، همان پاسخ داده می‌شود */
    if(site && siteScore>=14){AI_LAST_TOPIC=site;return site.a}

    /* ۲) فهرست تخصص‌ها */
    if(mxHasSkillList(n)){AI_LAST_TOPIC=null;return MX_SKILL_TAIL}

    /* ۳) پاسخ تخصص فنی: موضوع × نوع پرسش */
    var tech=mxSkillAnswer(n);
    if(tech){var sk=mxSkillFind(n);if(sk)AI_LAST_TOPIC={a:tech};return tech}

    var best=null,bestScore=0;
    AI_KB.forEach(function(item){
      var score=0;
      item.k.forEach(function(key){
        var sc=aiScore(n,tokens,aiNormKey(key));
        if(sc>score)score=sc;
      });
      if(score>bestScore){bestScore=score;best=item}
    });
    if(best && bestScore>=6){AI_LAST_TOPIC=best;return best.a}

    /* تلاش بعدی: جستجوی کلمه‌به‌کلمه در کل دانش */
    var hit=null,hitScore=0;
    AI_FOLLOWUPS.forEach(function(f){
      var sc=aiScore(n,tokens,f.k);
      if(sc>hitScore){hitScore=sc;hit=f}
    });
    if(hit && hitScore>=6){AI_LAST_TOPIC=null;return hit.a}

    /* پرسش کوتاه و پیرو → ادامهٔ موضوع قبلی (فقط اگر موضوع قبلی مشخص باشد) */
    if(AI_LAST_TOPIC && AI_LAST_TOPIC.a && tokens.length<=2 && aiIsFollowUp(n)){
      return 'ادامهٔ موضوع قبلی:\n\n'+AI_LAST_TOPIC.a+'\n\nاگر منظورتان چیز دیگری بود، کمی بیشتر توضیح دهید.';
    }

    /* موضوع را از واژگان کلیدی حدس می‌زند */
    var guess=aiGuess(n);
    if(guess)return guess;

    var tail='\n\nمی‌توانم دربارهٔ این موضوعات راهنمایی کنم:\n• خدمات و تخصص‌های مرتکس\n• هزینه و مدت زمان پروژه\n• نمونه‌کارها، پشتیبانی و پرداخت\n• روند ثبت سفارش و شمارهٔ تماس\n• وضعیت مدل‌های هوش مصنوعی و اشتراک‌ها';
    if(/[\u0600-\u06FF]/.test(n)){
      return 'سؤال‌تان را متوجه شدم، اما پاسخ دقیق آن در دانش محدود من نیست.\n\nمن یک ربات اولیه، محدود و آزمایشی هستم که توسط مرتکس ساخته شده‌ام؛ مدل‌های هوش مصنوعی ما هم به‌زودی راه می‌افتند.'+tail;
    }
    return 'برای راهنمایی دقیق‌تر، لطفاً سؤال‌تان را فارسی بنویسید یا یکی از موضوعات زیر را انتخاب کنید.'+tail;
  }
  /* استدلال ساده: از ریشهٔ واژه‌ها موضوع را حدس می‌زند */
  function aiGuess(n){
    var map=[
      {p:['وبسایت','سایت','صفحه','لندینگ','portal'],t:'خدمات و تخصص‌های مرتکس را توضیح می‌دهم:\nطراحی وب‌سایت اختصاصی، توسعهٔ فرانت‌اند، بازطراحی سایت، ریسپانسیو، سئوی پایه، تولید محتوا و ساخت ویدیو.\n\nبرای شروع از بخش «ثبت سفارش» استفاده کنید.'},
      {p:['پول','هزینه','بودجه','گران','ارزان'],t:'هزینه بسته به نوع و حجم پروژه تعیین می‌شود؛ عدد ثابت نداریم.\n\nبرای برآورد دقیق، در فرم ثبت سفارش فیلد «بودجهٔ تقریبی» را پر کنید. مشاورهٔ اولیه رایگان است.'},
      {p:['اشتراک','تخفیف','دلار','ارز','خرید','پرداخت اشتراک'],t:AI_PLANS},
      {p:['مدل','هوش','مصنوعی','ربات'],t:AI_MODELS}
    ];
    for(var i=0;i<map.length;i++){
      for(var j=0;j<map[i].p.length;j++){
        if(n.indexOf(map[i].p[j])>-1)return map[i].t;
      }
    }
    return null;
  }

  function aiThread(agent){
    var list=getChats();
    var t=null;
    for(var i=0;i<list.length;i++){if(list[i].phone===agent.phone){t=list[i];break}}
    if(!t){
      t={
        id:'CHT-'+Date.now().toString(36).toUpperCase(),
        name:agent.name,phone:agent.phone,
        device:agent.device||'',startedAt:new Date().toISOString(),
        updatedAt:new Date().toISOString(),messages:[],unread:0
      };
      list.unshift(t);
    }
    return {list:list,thread:t};
  }
  function aiPersist(list){saveChats(list)}
  /* ترد را در جای درستِ فهرست جای می‌گذارد (نه لزوماً خانهٔ صفر) */
  function aiThreadStore(list,thread){
    for(var i=0;i<list.length;i++){
      if(list[i].id===thread.id){list[i]=thread;return list}
    }
    list.unshift(thread);
    return list;
  }

  function aiRenderThread(){
    var agent=getAgent();
    if(!agent){aiGate();return}
    var r=aiThread(agent);
    var t=r.thread;
    if(t.messages.length===0){
      t.messages.push({
        role:'bot',at:new Date().toISOString(),
        text:'سلام '+agent.name+' عزیز 👋 خوش آمدید.\n\n'+
          'هر سؤالی دارید بپرسید؛ گفتگو نامحدود است.\n'+
          'اگر موضوع خاصی مدنظرتان نیست، از نمونه‌سؤال‌های پایین یکی را انتخاب کنید یا گزینهٔ «بیشتر» را بزنید.'
      });
      t.name=agent.name||t.name;
      var found=-1;
      for(var i=0;i<r.list.length;i++){if(r.list[i].id===t.id){found=i;break}}
      if(found>-1)r.list[found]=t;else r.list.unshift(t);
      aiPersist(r.list);
    }
    if(aiUserBox){
      aiUserBox.hidden=false;
      aiUserBox.innerHTML='<span>👤 <b>'+esc(t.name)+'</b> · '+esc(t.phone)+'</span>';
    }
    aiCompose.hidden=false;aiSuggest.hidden=false;
    aiBody.innerHTML=t.messages.map(aiBubble).join('');
    aiScroll();
    aiRefreshAttach();
  }
  function aiBubble(m){
    var who=m.role==='user';
    var inner=who?esc(m.text).replace(/\n/g,'<br>'):aiFormat(m.text);
    var extra='';
    if(m.attachment){
      var a=m.attachment;
      if(a.dataUrl && /^image\//.test(a.type||'')){
        extra+='<div class="mx-ai-file">🖼 '+esc(a.name)+'</div><img src="'+a.dataUrl+'" alt="'+esc(a.name)+'">';
      }else{
        extra+='<div class="mx-ai-file">📎 '+esc(a.name)+' · '+esc(a.size||'')+'</div>';
      }
    }
    if(!who && m.typing)inner='<span class="mx-ai-typing"><i></i><i></i><i></i></span>';
    return '<div class="mx-ai-msg '+(who?'user':'bot')+'" data-at="'+esc(m.at||'')+'">'+
      '<div class="mx-ai-av">'+(who?'🙂':'🤖')+'</div>'+
      '<div><div class="mx-ai-bubble">'+inner+extra+'</div>'+
      (m.at?'<div class="mx-ai-hint" style="margin-top:5px">'+esc(aiTimeTag(m.at))+'</div>':'')+
      '</div></div>';
  }
  function aiFormat(txt){
    return esc(txt).replace(/\n/g,'<br>').replace(/(۰۹۱۹۷۰۲۹۲۱۳|09197029213)/g,function(m){return m});
  }
  function aiScroll(){aiBody.scrollTop=aiBody.scrollHeight}

  function aiGate(){
    if(aiUserBox)aiUserBox.hidden=true;
    aiCompose.hidden=true;aiSuggest.hidden=true;
    var known=getChats().filter(function(c){return c.phone}).length;
    aiBody.innerHTML=
      '<div class="mx-ai-gate">'+
        '<h4>خوش آمدید 👋</h4>'+
        '<div class="mx-ai-introcard">'+
          '<p class="mx-ai-introtitle">این ربات توسط مرتکس ساخته شده است</p>'+
          '<p>یک ربات <b>اولیه، محدود و آزمایشی</b> است و گفتگو با آن نامحدود است.</p>'+
          '<p class="mx-ai-introtitle">دربارهٔ مدل‌های هوش مصنوعی</p>'+
          '<p>• مدل‌های هوش مصنوعی ما در حال حاضر <b>راه‌اندازی نشده‌اند</b> و به‌زودی راه می‌افتند\n'+
          '• برای صحبت با مدل‌های معروف و قدرتمند هوش مصنوعی باید <b>اشتراک</b> تهیه کنید\n'+
          '• چون ما ایرانی هستیم، این اشتراک‌ها برای شما <b>ارزان‌تر از جاهای دیگر دنیا</b> تمام می‌شود\n'+
          '• خرید با <b>تخفیف ویژه</b> هم امکان‌پذیر است</p>'+
        '</div>'+
        '<p class="mx-ai-label">برای ورود به صفحهٔ گفتگو، نام و شمارهٔ تماس خود را وارد کنید:</p>'+
        '<div class="merteks-form" id="mxAiGateForm">'+
          '<div class="merteks-grid">'+
            '<div class="merteks-field"><label for="mxAiName">نام و نام خانوادگی *</label>'+
              '<input id="mxAiName" maxlength="60" autocomplete="name"></div>'+
            '<div class="merteks-field"><label for="mxAiPhone">شمارهٔ تماس *</label>'+
              '<input id="mxAiPhone" maxlength="11" inputmode="numeric" placeholder="09xxxxxxxxx" autocomplete="tel"></div>'+
          '</div>'+
          '<div class="merteks-actions"><button class="merteks-btn primary" type="button" id="mxAiStart">تأیید و ورود به گفتگو</button></div>'+
        '</div>'+
      '</div>';
    var btn=document.getElementById('mxAiStart');
    if(btn)btn.addEventListener('click',function(){
      var nm=String(document.getElementById('mxAiName').value||'').trim();
      var ph=normalizeDigits(document.getElementById('mxAiPhone').value||'');
      if(nm.length<3){toast('نام را کامل وارد کنید');return}
      if(!validPhone(ph)){toast('شماره باید ۱۱ رقم و با ۰۹ شروع شود');return}
      var prev=null;
      getChats().forEach(function(c){if(c.phone===ph)prev=c});
      var info={name:nm,phone:ph,startedAt:(prev&&prev.startedAt)||new Date().toISOString(),restored:!!prev};
      saveAgent(info);
      if(!prev)cloudPost({action:'chatStart',id:'CHT-'+ph,phone:ph,name:nm});
      aiRenderThread();
      if(prev && (prev.messages||[]).length){
        toast('گفتگوی قبلی شما بازیابی شد');
      }
    });
  }

  var aiPending=[];
  if(aiFile)aiFile.addEventListener('change',function(){
    var files=[].slice.call(aiFile.files||[]);
    files.slice(0,5).forEach(function(f){
      if(f.size>2.5*1024*1024){toast('حجم «'+f.name+'» بیش از حد مجاز است');return}
      var rec={name:f.name,type:f.type,size:(f.size/1024).toFixed(0)+' KB'};
      if(/^image\//.test(f.type||'')){
        var fr=new FileReader();
        fr.onload=function(){rec.dataUrl=String(fr.result).slice(0,900000);aiPending.push(rec);aiRefreshAttach()};
        fr.readAsDataURL(f);
      }else{aiPending.push(rec);aiRefreshAttach()}
    });
    aiFile.value='';
  });
  function aiRefreshAttach(){
    if(!aiAttachBox)return;
    aiAttachBox.innerHTML=aiPending.map(function(f,i){
      return '<span>'+(f.dataUrl?'🖼':'📎')+' '+esc(f.name)+' <b data-rm="'+i+'" title="حذف">×</b></span>';
    }).join('');
    aiAttachBox.querySelectorAll('[data-rm]').forEach(function(b){
      b.addEventListener('click',function(){
        aiPending.splice(Number(b.getAttribute('data-rm')),1);aiRefreshAttach();
      });
    });
  }

  function aiSendMsg(){
    var agent=getAgent();
    if(!agent){aiGate();return}
    var text=String(aiInput.value||'').trim();
    if(!text && !aiPending.length)return;
    var r=aiThread(agent);
    var t=r.thread;
    var att=aiPending.length?aiPending[0]:null;
    var now=new Date().toISOString();
    t.messages.push({role:'user',text:text||'(فایل پیوست)',attachment:att,at:now});
    t.updatedAt=now;t.device=navigator.platform||'';
    aiPending=[];
    t.messages.push({role:'bot',text:'',typing:true,at:now});
    t.unread=0;
    aiThreadStore(r.list,t);aiPersist(r.list);
    aiInput.value='';aiInput.style.height='auto';
    aiCompose.hidden=false;
    aiBody.insertAdjacentHTML('beforeend',aiBubble(t.messages[t.messages.length-2])+aiBubble(t.messages[t.messages.length-1]));
    aiRefreshAttach();aiScroll();
    if(aiSuggest)aiSuggest.hidden=true;
    var answer=aiAnswer(text||'');
    setTimeout(function(){
      var rr=aiThread(agent),th=rr.thread;
      if(th.messages.length && th.messages[th.messages.length-1].typing){
        th.messages[th.messages.length-1]={role:'bot',text:answer,at:new Date().toISOString()};
      }else{th.messages.push({role:'bot',text:answer,at:new Date().toISOString()})}
      th.updatedAt=new Date().toISOString();
      aiThreadStore(rr.list,th);aiPersist(rr.list);
      aiBody.innerHTML=th.messages.map(aiBubble).join('');
      aiScroll();
      if(aiSuggest)aiSuggest.hidden=false;
      var lastUser=null;
      for(var i=th.messages.length-1;i>=0;i--){if(th.messages[i].role==='user'){lastUser=th.messages[i];break}}
      cloudPost({
        action:'chatMessage',chatId:th.id,name:th.name,phone:th.phone,
        device:th.device||'',question:(lastUser&&lastUser.text)||'(فایل پیوست)',
        answer:answer,at:new Date().toISOString()
      });
    },620);
  }

  if(aiSend)aiSend.addEventListener('click',aiSendMsg);
  if(aiInput){
    aiInput.addEventListener('keydown',function(e){
      if(e.key==='Enter' && !e.shiftKey){e.preventDefault();aiSendMsg()}
    });
    aiInput.addEventListener('input',function(){
      aiInput.style.height='auto';
      aiInput.style.height=Math.min(150,aiInput.scrollHeight)+'px';
    });
  }
  /* ---------- دایرهٔ پرسش‌ها: نمونه‌های کوتاه + گزینهٔ «بیشتر» ---------- */
  var AI_QUESTIONS=[
    'چه خدمات و تخصص‌هایی دارید؟',
    'هزینه و مدت زمان پروژه چقدر است؟',
    'چطور سفارش ثبت کنم؟',
    'نمونه‌کارهای شما را نشان بده',
    'پشتیبانی بعد از تحویل چطور است؟',
    'روش پرداخت و پیش‌پرداخت چطور است؟',
    'سایت فروشگاهی هم می‌سازید؟',
    'سئو و سرعت سایت چطور است؟',
    'سایت را چند وقت یک‌بار می‌شود تغییر داد؟',
    'مدل‌های هوش مصنوعی کی راه می‌افتند؟',
    'اشتراک مدل‌های هوش مصنوعی چطور است؟',
    'اشتراک با تخفیف چطور خریداری می‌شود؟',
    'آی‌استور چیست؟',
    'توسط چه کسی ساخته شده‌ای؟',
    'تو یک ربات اولیه و آزمایشی هستی؟',
    'شمارهٔ تماس شما چیست؟',
    'با فایل و عکس می‌توانم کار کنم؟',
    'مشاوره رایگان دارید؟',
    'طراحی سایت فروشگاهی چقدر زمان می‌برد؟',
    'پروژه‌های اختصاصی هم قبول می‌کنید؟'
  ];
  function aiAsk(text){
    if(!getAgent()){aiGate();return}
    var box=document.getElementById('mxAiAllBox');
    if(box)box.hidden=true;
    aiInput.value=text;aiSendMsg();
  }
  document.querySelectorAll('#mxAiSuggest .mx-ai-chip').forEach(function(c){
    if(c.getAttribute('data-more'))return;
    c.addEventListener('click',function(){
      if(!getAgent()){aiGate();return}
      aiInput.value=c.textContent.trim();aiSendMsg();
    });
  });
  (function(){
    var more=document.getElementById('mxAiMore');
    var box=document.getElementById('mxAiAllBox');
    var grid=document.getElementById('mxAiAllGrid');
    var closeBtn=document.getElementById('mxAiAllClose');
    if(!more||!box||!grid)return;
    grid.innerHTML=AI_QUESTIONS.map(function(q){
      return '<button class="mx-ai-chip" type="button">'+esc(q)+'</button>';
    }).join('');
    grid.querySelectorAll('.mx-ai-chip').forEach(function(b){
      b.addEventListener('click',function(){aiAsk(b.textContent.trim())});
    });
    more.addEventListener('click',function(){box.hidden=!box.hidden;aiScroll()});
    if(closeBtn)closeBtn.addEventListener('click',function(){box.hidden=true});
  })();
  document.getElementById('mxAiFab').addEventListener('click',function(){
    clearAgent();
    open('mxAiModal');
    aiGate();
    setTimeout(function(){
      var f=document.getElementById('mxAiName');
      if(f)f.focus();
    },140);
  });
  function aiCloseChat(){
    close('mxAiModal');
    clearAgent();
    aiPending=[];
    aiRefreshAttach();
    if(aiInput){aiInput.value='';aiInput.style.height='auto'}
  }
  document.getElementById('mxAiClose').addEventListener('click',aiCloseChat);
  aiModal.addEventListener('click',function(e){if(e.target===aiModal)aiCloseChat()});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && aiModal.classList.contains('open'))aiCloseChat();
  });

  /* آیکون دستیار فقط در صفحه اصلی دیده می‌شود */
  (function(){
    var fab=document.getElementById('mxAiFab');
    var home=document.getElementById('home');
    if(!fab)return;
    function setFab(){
      var show=true;
      var hash=location.hash||'#home';
      if(hash && hash!=='#home' && hash!=='#' && hash!=='#order')show=false;
      if(hash==='#order')show=false;
      if(home && home.getBoundingClientRect){
        var r=home.getBoundingClientRect();
        var past=(r.bottom < window.innerHeight*0.35);
        if(past)show=false;
      }
      try{if(document.body.classList.contains('merteks-order-page-active'))show=false}catch(e){}
      try{
        if(document.getElementById('merteksOrderModal').classList.contains('open'))show=false;
        if(document.getElementById('merteksAdminModal').classList.contains('open'))show=false;
        if(document.getElementById('merteksLoginModal').classList.contains('open'))show=false;
      }catch(e){}
      fab.hidden=false;
    }
    setFab();
    window.addEventListener('scroll',setFab,{passive:true});
    window.addEventListener('hashchange',setFab);
    window.addEventListener('resize',setFab);
    document.querySelectorAll('[data-open-order],[data-open-admin],.merteks-close').forEach(function(el){
      el.addEventListener('click',function(){setTimeout(setFab,260)});
    });
    setTimeout(setFab,400);
  })();
})();


/* ============================================================
   SOURCE BLOCK: inline-script-6
   ============================================================ */
/* ============================================================
   MERTEKS ADVANCED FX — لایهٔ انیمیشن و سه‌بعدی
   مستقل از کد اصلی سایت؛ اگر چیزی در دسترس نبود، سایت سالم می‌ماند.
   ============================================================ */
(function(){
  'use strict';
  var reduced=false;
  try{reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
  var isTouch=false;
  try{isTouch=window.matchMedia('(hover:none),(pointer:coarse)').matches}catch(e){}
  var canHover=!isTouch;

  /* ---------- 1) نوار پیشرفت اسکرول ---------- */
  (function(){
    var bar=document.createElement('div');
    bar.id='mxScrollBar';
    document.body.appendChild(bar);
    var ticking=false;
    function update(){
      var doc=document.documentElement;
      var max=(doc.scrollHeight-window.innerHeight);
      var p=max>0?(doc.scrollTop||document.body.scrollTop)/max:0;
      bar.style.transform='scaleX('+Math.min(1,Math.max(0,p))+')';
      ticking=false;
    }
    window.addEventListener('scroll',function(){
      if(!ticking){ticking=true;requestAnimationFrame(update)}
    },{passive:true});
    update();
  })();

  /* ---------- 2) ظاهر شدن با اسکرول + شمارش آمار ---------- */
  (function(){
    var targets=[].slice.call(document.querySelectorAll('.reveal'));
    if(!('IntersectionObserver' in window)){
      targets.forEach(function(el){el.classList.add('show','mx-in')});
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting)return;
        en.target.classList.add('show','mx-in');
        countUp(en.target);
        io.unobserve(en.target);
      });
    },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
    targets.forEach(function(el){io.observe(el)});

    function countUp(scope){
      [].slice.call(scope.querySelectorAll('.stat strong,.num')).forEach(function(el){
        var raw=(el.textContent||'').trim();
        var m=raw.match(/^([^\d]*)(\d[\d,]*)([^\d]*)$/);
        if(!m)return;
        var pre=m[1],digits=m[2].replace(/,/g,''),post=m[3];
        var end=parseInt(digits,10);
        if(isNaN(end)||end===0)return;
        var dur=1100,start=0,t0=null;
        if(reduced){return}
        function step(ts){
          if(t0===null)t0=ts;
          var k=Math.min(1,(ts-t0)/dur);
          var eased=1-Math.pow(1-k,3);
          el.textContent=pre+Math.round(start+(end-start)*eased).toLocaleString('fa-IR')+post;
          if(k<1)requestAnimationFrame(step);
        }
        el.textContent=pre+start+post;
        requestAnimationFrame(step);
      });
    }

    /* اسکرول نرم — پشتیبانی بومی مرورگر با fallback */
    if(!reduced){
      var raf=null;
      function smoothTo(y){
        var startY=window.pageYOffset||document.documentElement.scrollTop;
        var dist=y-startY,t0=null,dur=Math.min(1100,Math.max(420,Math.abs(dist)*.7));
        if(raf)cancelAnimationFrame(raf);
        function step(ts){
          if(t0===null)t0=ts;
          var k=Math.min(1,(ts-t0)/dur);
          var eased=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
          window.scrollTo(0,startY+dist*eased);
          if(k<1)raf=requestAnimationFrame(step);
        }
        raf=requestAnimationFrame(step);
      }
      document.addEventListener('click',function(ev){
        var a=ev.target.closest&&ev.target.closest('a[href^="#"]');
        if(!a)return;
        var id=a.getAttribute('href');
        if(!id||id==='#')return;
        var node=document.querySelector(id);
        if(!node)return;
        ev.preventDefault();
        var top=node.getBoundingClientRect().top+(window.pageYOffset||0)-72;
        smoothTo(top);
        try{history.replaceState(null,'',id)}catch(e){}
      });
    }
  })();

  /* ---------- 3) ورود لایه‌ای متن هیرو ---------- */
  (function(){
    var hero=document.querySelector('.hero .hero-showcase');
    if(!hero)return;
    var seq=['h1.group-name','p.group-tag','.members','p.hero-sub','p.hero-copy','.actions'];
    seq.forEach(function(sel,i){
      var el=hero.querySelector(sel);
      if(!el)return;
      el.classList.add('mx-stagger');
      el.style.setProperty('--d',(0.12+i*0.11)+'s');
    });
    /* درخشش روی تیتر گروه */
    hero.querySelectorAll('.group-tag,.section-title').forEach(function(el){
      el.classList.add('mx-title-sheen');
    });
    document.body.classList.add('mx-ready');
  })();

  /* ---------- 4) تیترهای بخش‌ها: درخشش ملایم ---------- */
  document.querySelectorAll('.section-title').forEach(function(el){
    if(!reduced)el.classList.add('mx-title-sheen');
  });

  /* ---------- 5) کارت‌های سه‌بعدی (تیلت) ---------- */
  (function(){
    if(!canHover||reduced)return;
    var sel='.bento .cell,.project-card,.member-card,.stat,.social,.hero-showcase.glass';
    var cards=[].slice.call(document.querySelectorAll(sel));
    cards.forEach(function(card){
      card.classList.add('mx-tilt');
      if(!card.querySelector('.mx-glare')){
        var g=document.createElement('span');
        g.className='mx-glare';
        card.appendChild(g);
      }
      card.addEventListener('mousemove',function(ev){
        var r=card.getBoundingClientRect();
        var px=(ev.clientX-r.left)/r.width;
        var py=(ev.clientY-r.top)/r.height;
        var rx=(py-.5)*-9, ry=(px-.5)*11;
        card.classList.add('is-live');
        card.style.transform='perspective(900px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateZ(10px)';
        card.style.setProperty('--gx',(px*100).toFixed(1)+'%');
        card.style.setProperty('--gy',(py*100).toFixed(1)+'%');
      });
      card.addEventListener('mouseleave',function(){
        card.classList.remove('is-live');
        card.style.transform='';
      });
    });
  })();

  /* ---------- 6) دکمه‌های جذبی (magnetic) ---------- */
  (function(){
    if(!canHover||reduced)return;
    document.querySelectorAll('.btn,.phone-order,#merteksAdminOpen').forEach(function(el){
      el.classList.add('mx-magnet');
      el.addEventListener('mousemove',function(ev){
        var r=el.getBoundingClientRect();
        var dx=(ev.clientX-(r.left+r.width/2))/r.width;
        var dy=(ev.clientY-(r.top+r.height/2))/r.height;
        el.style.transform='translate('+(dx*9).toFixed(1)+'px,'+(dy*7).toFixed(1)+'px) scale(1.03)';
      });
      el.addEventListener('mouseleave',function(){el.style.transform=''});
    });
  })();

  /* ---------- 8) پس‌زمینهٔ ذرات: CSS-only fallback ---------- */
  (function(){
    var canvas=document.getElementById('mxGrid3D');
    if(canvas)canvas.remove();
    document.documentElement.classList.add('mx-static-particles');
  })();

  /* ---------- 9) خط اسکن روی کارت‌ها ---------- */
  document.querySelectorAll('.project-card,.member-card,.social,.cell').forEach(function(el){
    el.classList.add('mx-scan');
  });

})();


/* ============================================================
   SOURCE BLOCK: mx-intro3d-disabled
   ============================================================ */
/* دروازهٔ ورود سه‌بعدی قدیمی حذف شد؛ اکنون تنها #introScreen مالک ورود است. */


/* ============================================================
   SOURCE BLOCK: merteks-requested-fixes-script
   ============================================================ */
(function(){
  'use strict';

  /* فقط اعداد فارسی/عربی/انگلیسی را برای بودجه قبول کن */
  function normalizeBudgetDigits(value){
    return String(value || '')
      .replace(/[۰-۹]/g,function(ch){
        return String(ch.charCodeAt(0)-0x06F0);
      })
      .replace(/[٠-٩]/g,function(ch){
        return String(ch.charCodeAt(0)-0x0660);
      })
      .replace(/[^0-9]/g,'');
  }

  function setupMerteksBudget(){
    var budget=document.getElementById('moBudget');
    if(!budget || budget.dataset.merteksNumericReady==='1') return;

    budget.dataset.merteksNumericReady='1';

    /* فقط عدد */
    budget.setAttribute('inputmode','numeric');
    budget.setAttribute('pattern','[0-9]*');
    budget.setAttribute('autocomplete','off');
    budget.setAttribute('maxlength','15');
    budget.setAttribute('placeholder','لطفاً بودجه خود را به تومان وارد کنید');

    budget.addEventListener('input',function(){
      var clean=normalizeBudgetDigits(budget.value);
      if(budget.value!==clean) budget.value=clean;
    });

    budget.addEventListener('beforeinput',function(ev){
      if(ev.inputType==='insertText' && ev.data && /[^0-9۰-۹٠-٩]/.test(ev.data)){
        ev.preventDefault();
      }
    });

    budget.addEventListener('paste',function(){
      setTimeout(function(){
        budget.value=normalizeBudgetDigits(budget.value);
      },0);
    });

    budget.addEventListener('change',function(){
      budget.value=normalizeBudgetDigits(budget.value);
      if(budget.value.length > 0 && budget.value.length < 7){
        budget.setCustomValidity('بودجه باید حداقل ۷ رقم باشد.');
      }else{
        budget.setCustomValidity('');
      }
    });

    budget.addEventListener('input',function(){
      if(budget.value.length > 0 && budget.value.length < 7){
        budget.setCustomValidity('بودجه باید حداقل ۷ رقم باشد.');
      }else{
        budget.setCustomValidity('');
      }
    });
  }

  /* فرم سفارش با باز شدن صفحه/مودال ساخته می‌شود؛ چند بار بررسی امن است. */
  setupMerteksBudget();

  function validateMerteksBudgetOnSubmit(){
    var form=document.getElementById('merteksOrderForm');
    var budget=document.getElementById('moBudget');
    if(!form || !budget || form.dataset.merteksBudgetValidationReady==='1') return;

    form.dataset.merteksBudgetValidationReady='1';
    form.addEventListener('submit',function(ev){
      budget.value=normalizeBudgetDigits(budget.value);

      if(budget.value.length > 0 && budget.value.length < 7){
        ev.preventDefault();
        budget.setCustomValidity('بودجه باید حداقل ۷ رقم باشد.');
        budget.reportValidity();
        budget.focus();
        return false;
      }

      budget.setCustomValidity('');
    });
  }

  validateMerteksBudgetOnSubmit();
  document.addEventListener('DOMContentLoaded',function(){
    setupMerteksBudget();
    validateMerteksBudgetOnSubmit();
  });
  var tries=0;
  var timer=setInterval(function(){
    setupMerteksBudget();
    if(++tries>=30) clearInterval(timer);
  },250);

  /* خوانایی پنل وضعیت حتی در مرورگرهایی که option را از CSS اصلی می‌گیرند */
  function fixStatusSelects(){
    document.querySelectorAll('.merteks-status').forEach(function(sel){
      sel.style.backgroundColor=getComputedStyle(document.body).getPropertyValue('--bg-2').trim();
      sel.style.color=getComputedStyle(document.body).getPropertyValue('--text').trim();
      sel.style.colorScheme=document.body.classList.contains('light')?'light':'dark';
      Array.prototype.forEach.call(sel.options,function(opt){
        opt.style.backgroundColor=document.body.classList.contains('light')?'#FFFFFF':'#182235';
        opt.style.color=document.body.classList.contains('light')?'#111827':'#F8FAFF';
      });
    });
  }

  fixStatusSelects();
  document.addEventListener('DOMContentLoaded',fixStatusSelects);

  /* پنل مدیریت بعد از renderAdminLocal ساخته می‌شود. */
  var statusTries=0;
  var statusTimer=setInterval(function(){
    fixStatusSelects();
    if(++statusTries>=40) clearInterval(statusTimer);
  },250);
})();


/* ============================================================
   SOURCE BLOCK: merteks-menu-stickers-clean-script
   ============================================================ */
(function(){
  'use strict';

  function applyMenuStickers(){
    var links=document.getElementById('links');
    if(!links)return;

    var items=links.querySelectorAll('a');
    Array.prototype.forEach.call(items,function(link,index){
      if(index<8){
        link.classList.add('mx-sticker-link');
      }
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',applyMenuStickers);
  }else{
    applyMenuStickers();
  }
})();


/* ============================================================
   SOURCE BLOCK: merteks-projects-addon-script-added
   ============================================================ */
(function(){
'use strict';
/* ---------- menu labels/order, without editing the original HTML ---------- */
function patchMenu(){
 var links=document.getElementById('links');if(!links)return;
 var order=links.querySelector('a.order-link'),admin=links.querySelector('a.admin-menu-link');
 if(order){order.textContent='سفارشات';}
 if(admin){admin.textContent='پنل مدیریت';}
 if(order&&admin&&order.nextElementSibling!==admin)links.insertBefore(order,admin);
}
patchMenu();

/* ---------- project storage (Supabase: table + public Storage bucket, shared for all visitors) ---------- */
var SBU=String((window.MERTEKS_CONFIG&&window.MERTEKS_CONFIG.supabaseUrl)||'').replace(/\/+$/,''),
    SBK=(window.MERTEKS_CONFIG&&window.MERTEKS_CONFIG.supabaseKey)||'',BUCKET='projects',projCache=null;
function adminTok(){try{return sessionStorage.getItem('merteks_admin_token_v2')||''}catch(e){return ''}}
function sbReq(method,path,o){
 o=o||{};
 var h={apikey:SBK};
 if(o.auth){var t=adminTok();if(t)h['Authorization']='Bearer '+t}
 if(o.type)h['Content-Type']=o.type;
 if(o.prefer)h['Prefer']=o.prefer;
 return fetch(SBU+path,{method:method,headers:h,body:o.body,cache:'no-store'}).then(function(r){
  return r.text().then(function(t){
   var d=null;try{d=t?JSON.parse(t):null}catch(e){d=t}
   if(!r.ok){
    if(r.status===401)throw new Error('نشست مدیر تمام شده؛ دوباره وارد شوید');
    throw new Error((d&&typeof d==='object'&&(d.message||d.error||d.msg))||'خطای سرور');
   }
   return d})})}
function allProjects(force){
 if(projCache&&!force)return Promise.resolve(projCache);
 if(!SBU||!SBK)return Promise.reject(new Error('no api'));
 return sbReq('GET','/rest/v1/projects?select=id,name,created_at,project_images(key,pos)&order=created_at.desc&limit=200').then(function(rows){
  projCache=(rows||[]).map(function(p){
   var im=(p.project_images||[]).slice().sort(function(a,b){return a.pos-b.pos});
   return {id:p.id,name:p.name,createdAt:Date.parse(p.created_at)||0,
           keys:im.map(function(x){return x.key}),
           images:im.map(function(x){return SBU+'/storage/v1/object/public/'+BUCKET+'/'+x.key})};
  }).filter(function(p){return p.images.length});
  return projCache})}
function dataUrlToBlob(u){var p=u.split(','),mime=(p[0].match(/:(.*?);/)||[])[1]||'image/jpeg',bin=atob(p[1]),arr=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return new Blob([arr],{type:mime})}
function putProject(p){
 var pid=null,uploaded=[];
 return sbReq('POST','/rest/v1/projects',{auth:true,type:'application/json',prefer:'return=representation',body:JSON.stringify({name:p.name})}).then(function(rows){
  pid=rows[0].id;
  return p.images.reduce(function(chain,img,i){return chain.then(function(){
   var key=pid+'/'+i+'-'+Math.random().toString(36).slice(2,8)+'.jpg';
   return sbReq('POST','/storage/v1/object/'+BUCKET+'/'+key,{auth:true,type:'image/jpeg',body:dataUrlToBlob(img)}).then(function(){
    uploaded.push(key);
    return sbReq('POST','/rest/v1/project_images',{auth:true,type:'application/json',prefer:'return=minimal',body:JSON.stringify({project_id:pid,pos:i,key:key})})})})},Promise.resolve())
 }).then(function(){projCache=null}).catch(function(err){
  projCache=null;
  var undo=Promise.resolve();
  if(uploaded.length)undo=sbReq('DELETE','/storage/v1/object/'+BUCKET,{auth:true,type:'application/json',body:JSON.stringify({prefixes:uploaded})}).catch(function(){});
  if(pid)undo=undo.then(function(){return sbReq('DELETE','/rest/v1/projects?id=eq.'+encodeURIComponent(pid),{auth:true}).catch(function(){})});
  return undo.then(function(){throw err})})}
function deleteProject(id){
 var proj=(projCache||[]).filter(function(x){return x.id===id})[0];
 var keysP=proj?Promise.resolve(proj.keys):sbReq('GET','/rest/v1/project_images?select=key&project_id=eq.'+encodeURIComponent(id)).then(function(rows){return (rows||[]).map(function(r){return r.key})});
 return keysP.then(function(keys){
  if(!keys.length)return;
  return sbReq('DELETE','/storage/v1/object/'+BUCKET,{auth:true,type:'application/json',body:JSON.stringify({prefixes:keys})})
 }).then(function(){return sbReq('DELETE','/rest/v1/projects?id=eq.'+encodeURIComponent(id),{auth:true})}).then(function(){projCache=null})}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function toast2(msg){var t=document.getElementById('merteksOrderToast')||document.getElementById('toast');if(!t){alert(msg);return}t.textContent=msg;t.classList.add('show');clearTimeout(window.__mxProjectToast);window.__mxProjectToast=setTimeout(function(){t.classList.remove('show')},2400)}
function compressImage(file){return new Promise(function(resolve,reject){if(!file.type||file.type.indexOf('image/')!==0){reject(new Error('فایل تصویر نیست'));return}var reader=new FileReader();reader.onload=function(){var img=new Image();img.onload=function(){var max=1800,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale)),c=document.createElement('canvas');c.width=w;c.height=h;var ctx=c.getContext('2d');ctx.drawImage(img,0,0,w,h);resolve(c.toDataURL('image/jpeg',.82))};img.onerror=function(){reject(new Error('خواندن تصویر ناموفق بود'))};img.src=reader.result};reader.onerror=function(){reject(reader.error||new Error('خواندن فایل ناموفق بود'))};reader.readAsDataURL(file)})}

/* ---------- dynamically add Projects tab/pane to existing admin panel ---------- */
var tabs=document.querySelector('.merteks-tabs'),ordersPane=document.getElementById('merteksPaneOrders'),chatsPane=document.getElementById('merteksPaneChats');
if(tabs&&!document.querySelector('[data-admin-tab="projects"]')){
 var ptab=document.createElement('button');ptab.className='merteks-tab';ptab.type='button';ptab.setAttribute('data-admin-tab','projects');ptab.textContent='🖼️ پروژه‌ها';var chatTab=tabs.querySelector('[data-admin-tab="chats"]');if(chatTab)tabs.insertBefore(ptab,chatTab);else tabs.appendChild(ptab);
 var pane=document.createElement('div');pane.id='merteksPaneProjects';pane.hidden=true;
 pane.innerHTML='<div class="mx-project-admin-intro"><strong>مدیریت پروژه‌ها</strong><span>نام پروژه را وارد کنید و حداقل ۱ و حداکثر ۳۰ عکس اضافه کنید.</span></div>'+
 '<form class="mx-project-form" id="mxProjectForm"><div class="merteks-field"><label for="mxProjectName">نام پروژه</label><label class="sr-only" for="mxProjectName">نام پروژه</label><input id="mxProjectName" type="text" maxlength="100" required placeholder="مثلاً طراحی سایت فروشگاهی"></div>'+ 
 '<div class="merteks-field"><label for="mxProjectImages">عکس‌های پروژه <small>(۱ تا ۳۰ عکس)</small></label><label class="sr-only" for="mxProjectImages">تصاویر پروژه</label><input id="mxProjectImages" type="file" accept="image/*" multiple required><div id="mxProjectFileInfo" class="mx-project-file-info">هنوز عکسی انتخاب نشده است.</div><div id="mxProjectPreview" class="mx-project-preview"></div></div>'+ 
 '<div class="merteks-actions"><button class="merteks-btn primary" type="submit" id="mxProjectSaveBtn">➕ افزودن پروژه</button><button class="merteks-btn" type="button" id="mxProjectClearBtn">پاک کردن</button></div></form><div id="mxProjectAdminList" class="mx-project-admin-list"></div>';
 var chatsParent=chatsPane&&chatsPane.parentNode; if(chatsParent)chatsParent.insertBefore(pane,chatsPane); else if(ordersPane&&ordersPane.parentNode)ordersPane.parentNode.appendChild(pane);
}

var selectedFiles=[],fileInput=document.getElementById('mxProjectImages'),fileInfo=document.getElementById('mxProjectFileInfo'),preview=document.getElementById('mxProjectPreview'),form=document.getElementById('mxProjectForm'),adminList=document.getElementById('mxProjectAdminList');
function showSelected(){if(fileInfo)fileInfo.textContent=selectedFiles.length?selectedFiles.length+' عکس انتخاب شده است.':'هنوز عکسی انتخاب نشده است.';if(!preview)return;preview.innerHTML='';selectedFiles.slice(0,30).forEach(function(f){var r=new FileReader();r.onload=function(){var im=document.createElement('img');im.src=r.result;im.alt='پیش‌نمایش';preview.appendChild(im)};r.readAsDataURL(f)})}
if(fileInput)fileInput.addEventListener('change',function(){var files=Array.prototype.slice.call(fileInput.files||[]).filter(function(f){return/^image\//.test(f.type)});if(files.length>30){toast2('حداکثر ۳۰ عکس مجاز است.');files=files.slice(0,30)}selectedFiles=files;showSelected()});
var clearBtn=document.getElementById('mxProjectClearBtn');if(clearBtn)clearBtn.addEventListener('click',function(){selectedFiles=[];if(fileInput)fileInput.value='';var n=document.getElementById('mxProjectName');if(n)n.value='';showSelected()});
function renderAdminProjects(){if(!adminList)return;allProjects().then(function(list){if(!list.length){adminList.innerHTML='<div class="merteks-empty">هنوز پروژه‌ای اضافه نشده است.</div>';return}adminList.innerHTML=list.map(function(p){return'<article class="mx-project-admin-card"><img class="mx-project-admin-cover" src="'+p.images[0]+'" alt="'+esc(p.name)+'" decoding="async"><div><strong>'+esc(p.name)+'</strong><small>'+p.images.length+' عکس · '+new Date(p.createdAt).toLocaleDateString('fa-IR')+'</small></div><button class="merteks-btn merteks-danger" type="button" data-project-delete="'+esc(p.id)+'">حذف پروژه</button></article>'}).join('');adminList.querySelectorAll('[data-project-delete]').forEach(function(btn){btn.addEventListener('click',function(){var id=btn.getAttribute('data-project-delete');if(!confirm('این پروژه و همه عکس‌های آن حذف شود؟'))return;deleteProject(id).then(function(){renderAdminProjects();renderPublicProjects();toast2('پروژه حذف شد')})})})}).catch(function(){adminList.innerHTML='<div class="merteks-empty">بارگذاری پروژه‌ها از سرور انجام نشد.</div>'})}
if(form)form.addEventListener('submit',function(e){e.preventDefault();var name=(document.getElementById('mxProjectName').value||'').trim();if(!name){toast2('نام پروژه را وارد کنید.');return}if(selectedFiles.length<1){toast2('حداقل یک عکس انتخاب کنید.');return}if(selectedFiles.length>30){toast2('حداکثر ۳۰ عکس مجاز است.');return}var btn=document.getElementById('mxProjectSaveBtn');if(btn)btn.disabled=true;toast2('در حال آپلود عکس‌ها؛ چند لحظه صبر کنید…');Promise.all(selectedFiles.map(compressImage)).then(function(images){return putProject({id:'PRJ-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),name:name,images:images,createdAt:Date.now()})}).then(function(){toast2('پروژه با موفقیت اضافه شد.');if(clearBtn)clearBtn.click();renderAdminProjects();renderPublicProjects()}).catch(function(err){console.error(err);toast2(err&&err.message?err.message:'ذخیره پروژه انجام نشد؛ دوباره امتحان کنید.')}).finally(function(){if(btn)btn.disabled=false})});

/* ---------- public projects section ---------- */
var footer=document.querySelector('footer'),servicesSection=document.getElementById('services'),publicSection=document.createElement('section');publicSection.className='mx-public-projects';publicSection.id='mxManagedProjects';publicSection.setAttribute('aria-label','پروژه‌های مرتکس');publicSection.innerHTML='<div class="wrap"><div class="section-head reveal"><span class="kicker">OUR PROJECTS</span><h2 class="section-title">پروژه‌های ما</h2><p class="section-desc">نمونه‌کارهایی که از داخل پنل مدیریت اضافه می‌کنید، اینجا نمایش داده می‌شوند.</p></div><div id="mxProjectsGrid" class="mx-projects-grid"></div><div id="mxProjectsEmpty" class="mx-projects-empty" hidden>هنوز پروژه‌ای اضافه نشده است.</div></div>';if(servicesSection&&servicesSection.parentNode)servicesSection.parentNode.insertBefore(publicSection,servicesSection);else if(footer&&footer.parentNode)footer.parentNode.insertBefore(publicSection,footer);else document.body.appendChild(publicSection);
var publicGrid=document.getElementById('mxProjectsGrid'),publicEmpty=document.getElementById('mxProjectsEmpty');

/* ---------- fullscreen gallery ---------- */
var gallery=document.createElement('div');gallery.className='mx-gallery-modal';gallery.id='mxGalleryModal';gallery.innerHTML='<div class="mx-gallery-shell" role="dialog" aria-modal="true" aria-label="مشاهده عکس‌های پروژه"><div class="mx-gallery-top"><div class="mx-gallery-title" id="mxGalleryTitle"></div><div style="display:flex;align-items:center;gap:8px"><span class="mx-gallery-counter" id="mxGalleryCounter"></span><button class="mx-gallery-close" id="mxGalleryClose" type="button" aria-label="بستن">×</button></div></div><div class="mx-gallery-stage" id="mxGalleryStage"><button class="mx-gallery-nav mx-gallery-prev" id="mxGalleryPrev" type="button" aria-label="عکس قبلی">›</button><img class="mx-gallery-image" id="mxGalleryImage" alt=""><button class="mx-gallery-nav mx-gallery-next" id="mxGalleryNext" type="button" aria-label="عکس بعدی">‹</button></div><div class="mx-gallery-dots" id="mxGalleryDots"></div></div>';document.body.appendChild(gallery);
var galleryImages=[],galleryIndex=0,gTitle=document.getElementById('mxGalleryTitle'),gCounter=document.getElementById('mxGalleryCounter'),gImage=document.getElementById('mxGalleryImage'),gDots=document.getElementById('mxGalleryDots');
function renderGallery(){if(!galleryImages.length)return;gImage.style.opacity='0';setTimeout(function(){gImage.src=galleryImages[galleryIndex];gImage.style.opacity='1'},60);gCounter.textContent=(galleryIndex+1)+' / '+galleryImages.length;gDots.innerHTML=galleryImages.map(function(_,i){return'<button class="mx-gallery-dot '+(i===galleryIndex?'active':'')+'" type="button" data-gallery-dot="'+i+'" aria-label="عکس '+(i+1)+'"></button>'}).join('');gDots.querySelectorAll('[data-gallery-dot]').forEach(function(b){b.addEventListener('click',function(){galleryIndex=+b.getAttribute('data-gallery-dot');renderGallery()})})}
function openGallery(p){galleryImages=p.images||[];galleryIndex=0;gTitle.textContent=p.name||'پروژه';gallery.classList.add('open');document.body.style.overflow='hidden';renderGallery()}
function closeGallery(){gallery.classList.remove('open');document.body.style.overflow=''}
function moveGallery(dir){if(!galleryImages.length)return;galleryIndex=(galleryIndex+dir+galleryImages.length)%galleryImages.length;renderGallery()}
document.getElementById('mxGalleryClose').addEventListener('click',closeGallery);document.getElementById('mxGalleryPrev').addEventListener('click',function(){moveGallery(1)});document.getElementById('mxGalleryNext').addEventListener('click',function(){moveGallery(-1)});gallery.addEventListener('click',function(e){if(e.target===gallery)closeGallery()});document.addEventListener('keydown',function(e){if(!gallery.classList.contains('open'))return;if(e.key==='Escape')closeGallery();if(e.key==='ArrowRight')moveGallery(1);if(e.key==='ArrowLeft')moveGallery(-1)});
var stage=document.getElementById('mxGalleryStage'),sx=0,sy=0;stage.addEventListener('touchstart',function(e){if(e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});stage.addEventListener('touchend',function(e){if(!sx)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=0;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))moveGallery(dx<0?1:-1)},{passive:true});
function renderPublicProjects(){if(!publicGrid)return;allProjects().then(function(list){publicEmpty.hidden=!!list.length;publicGrid.innerHTML=list.map(function(p){return'<article class="mx-project-card reveal"><img class="mx-project-cover" src="'+p.images[0]+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async"><div class="mx-project-info"><h3 class="mx-project-name">'+esc(p.name)+'</h3><p class="mx-project-count">'+p.images.length+' عکس</p><button class="btn btn-ghost mx-project-view" type="button" data-project-view="'+esc(p.id)+'">مشاهده عکس‌ها <span>←</span></button></div></article>'}).join('');publicGrid.querySelectorAll('[data-project-view]').forEach(function(btn){btn.addEventListener('click',function(){var id=btn.getAttribute('data-project-view');allProjects().then(function(a){var p=a.find(function(x){return x.id===id});if(p)openGallery(p)})})});requestAnimationFrame(function(){publicGrid.querySelectorAll('.reveal').forEach(function(el){el.classList.add('show')})})}).catch(function(){if(publicEmpty)publicEmpty.hidden=false})}

/* ---------- extend original admin tabs; original listeners remain untouched ---------- */
var projectTab=document.querySelector('[data-admin-tab="projects"]');
if(projectTab)projectTab.addEventListener('click',function(){var po=document.getElementById('merteksPaneOrders'),pc=document.getElementById('merteksPaneChats'),pp=document.getElementById('merteksPaneProjects');if(po)po.hidden=true;if(pc)pc.hidden=true;if(pp)pp.hidden=false;document.querySelectorAll('[data-admin-tab]').forEach(function(t){t.classList.toggle('is-on',t===projectTab)});renderAdminProjects()});
document.querySelectorAll('[data-admin-tab]').forEach(function(tab){tab.addEventListener('click',function(){var name=tab.getAttribute('data-admin-tab');if(name==='projects')return;var pp=document.getElementById('merteksPaneProjects');if(pp)pp.hidden=true})});
var adminModal=document.getElementById('merteksAdminModal');if(adminModal&&window.MutationObserver)new MutationObserver(function(){if(adminModal.classList.contains('open'))renderAdminProjects()}).observe(adminModal,{attributes:true,attributeFilter:['class']});
renderPublicProjects();

/* صفحه بدون اینترو؛ ورود مستقیم به محتوای سایت */
})();


/* ============================================================
   SOURCE BLOCK: merteks-registered-projects-menu-update
   ============================================================ */
(function(){
  'use strict';
  function updateProjectsMenu(){
    var links=document.getElementById('links');
    if(!links) return;

    /* Remove only the old menu item that points to the static activity section. */
    var old=links.querySelector('a[href="#projects"]');
    if(old) old.remove();

    /* Avoid creating the new item more than once. */
    if(links.querySelector('a[data-registered-projects-link]')) return;

    var contact=links.querySelector('a[href="#contact"]');
    var item=document.createElement('a');
    item.href='#mxManagedProjects';
    item.textContent='پروژه‌های ما';
    item.setAttribute('data-registered-projects-link','true');
    item.classList.add('mx-sticker-link');

    if(contact && contact.parentNode){
      contact.parentNode.insertBefore(item, contact.nextSibling);
    }else{
      links.appendChild(item);
    }

    /* Make sure the new item behaves like the other menu links. */
    item.addEventListener('click',function(){
      var target=document.getElementById('mxManagedProjects');
      if(target){
        setTimeout(function(){target.scrollIntoView({behavior:'smooth',block:'start'});},0);
      }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',updateProjectsMenu);
  else updateProjectsMenu();
})();


/* ============================================================
   SOURCE BLOCK: merteks-final-menu-order-fix-script
   ============================================================ */
(function(){
  'use strict';
  function setupFinalMenu(){
    var links=document.getElementById('links');
    var menuBtn=document.getElementById('menuBtn');
    if(!links)return;

    /* Remove the old static activity/project link and any duplicate registered-project link. */
    Array.prototype.slice.call(links.querySelectorAll('a')).forEach(function(a){
      if(a.getAttribute('href')==='#projects') a.remove();
    });

    var registered=links.querySelector('a[data-registered-projects-link]');
    if(!registered){
      registered=document.createElement('a');
      registered.href='#mxManagedProjects';
      registered.textContent='پروژه‌های ما';
      registered.setAttribute('data-registered-projects-link','true');
    }

    var order=links.querySelector('a.order-link');
    var admin=links.querySelector('a.admin-menu-link');
    var about=links.querySelector('a[href="#about"]');
    var skills=links.querySelector('a[href="#skills"]');
    var services=links.querySelector('a[href="#services"]');
    var contact=links.querySelector('a[href="#contact"]');
    var home=links.querySelector('a[href="#home"]');

    /* Page/menu order:
       خانه → درباره ما → مهارت‌ها → پروژه‌های ما → خدمات → اطلاع‌رسانی → سفارشات → پنل سفارشات */
    [home,about,skills,registered,services,contact,order,admin].forEach(function(a){
      if(a) links.appendChild(a);
    });

    /* Clean label/icon marker classes; the CSS above maps icons by final position. */
    Array.prototype.forEach.call(links.querySelectorAll('a'),function(a){
      a.classList.add('mx-final-menu-item');
    });

    if(menuBtn && !menuBtn.getAttribute('aria-expanded')){
      menuBtn.setAttribute('aria-expanded','false');
    }

    /* Close the menu whenever the user taps/clicks outside the menu itself. */
    if(!document.documentElement.hasAttribute('data-mx-outside-menu-close')){
      document.documentElement.setAttribute('data-mx-outside-menu-close','1');
      document.addEventListener('click',function(e){
        if(!links.classList.contains('open'))return;
        if(links.contains(e.target))return;
        if(menuBtn && menuBtn.contains(e.target))return;
        links.classList.remove('open');
        if(menuBtn)menuBtn.setAttribute('aria-expanded','false');
      },true);
      document.addEventListener('touchstart',function(e){
        if(!links.classList.contains('open'))return;
        if(links.contains(e.target))return;
        if(menuBtn && menuBtn.contains(e.target))return;
        links.classList.remove('open');
        if(menuBtn)menuBtn.setAttribute('aria-expanded','false');
      },{passive:true,capture:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupFinalMenu);
  else setupFinalMenu();
})();


/* ============================================================
   SOURCE BLOCK: merteks-floating-admin-enter-script
   ============================================================ */
(function(){
  'use strict';

  function get(id){return document.getElementById(id);}

  function openAdminFromFab(){
    /* منوی سه‌خط اگر باز باشد، بسته شود */
    var links=get('links');
    var menuBtn=get('menuBtn');
    if(links)links.classList.remove('open');
    if(menuBtn)menuBtn.setAttribute('aria-expanded','false');

    /*
      تابع requireAdmin داخل اسکریپت اصلی عمداً خصوصی است؛
      بنابراین از همان دکمهٔ داخلی پنل استفاده می‌کنیم تا دقیقاً
      همان احراز هویت، نشست و بازشدن داشبورد اجرا شود.
    */
    var bridge=get('merteksAdminOpen');
    if(bridge){
      bridge.click();
      return;
    }

    /* fallback بسیار محدود در صورت نبودن دکمهٔ داخلی */
    var login=get('merteksLoginModal');
    if(login)login.classList.add('open');
  }

  function setup(){
    var fab=get('merteksAdminFab');
    if(!fab)return;

    fab.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      openAdminFromFab();
    });

    /*
      فقط کلید Enter روی ورودی رمز پنل عمل ورود را انجام می‌دهد.
      Escape و سایر کلیدها هیچ کاربردی برای ورود ندارند.
      textareaها و ورودی‌های دیگر عمداً تحت تأثیر این منطق نیستند.
    */
    var password=get('merteksPassword');
    var form=get('merteksLoginForm');

    var passwordToggle=get('merteksPasswordToggle');
    if(password && passwordToggle){
      passwordToggle.addEventListener('click',function(){
        var visible=password.type==='text';
        password.type=visible?'password':'text';
        passwordToggle.classList.toggle('is-visible',!visible);
        passwordToggle.setAttribute('aria-pressed',String(!visible));
        passwordToggle.setAttribute('aria-label',visible?'نمایش رمز عبور':'پنهان کردن رمز عبور');
        password.focus();
      });
    }
    if(password && form){
      password.addEventListener('keydown',function(e){
        if(e.key!=='Enter')return;
        e.preventDefault();
        e.stopPropagation();
        if(typeof form.requestSubmit==='function')form.requestSubmit();
        else{
          var submit=form.querySelector('button[type="submit"]');
          if(submit)submit.click();
        }
      });
    }

    /* اگر اسکریپت‌های قبلی دوباره لینک مدیریت را بسازند، از منو حذف بماند. */
    var links=get('links');
    if(links){
      links.querySelectorAll('.admin-menu-link,[data-open-admin]').forEach(function(el){
        el.remove();
      });
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',setup,{once:true});
  }else{
    setup();
  }
})();


/* ============================================================
   MERTEKS CINEMATIC INTRO + FAST ADMIN ENTRY
   - Intro stays on the public site.
   - Opening admin/login immediately dismisses the intro.
   - Admin UI renders locally before cloud synchronization.
   - Supabase connection is warmed by browser preconnect.
   ============================================================ */
(function(){
  'use strict';
  var intro=document.getElementById('introScreen');
  if(!intro)return;
  var finished=false;
  function finishIntro(){
    if(finished)return;
    finished=true;
    intro.classList.add('is-leaving');
    intro.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('intro-active');
    setTimeout(function(){
      if(intro.parentNode)intro.parentNode.removeChild(intro);
    },520);
  }
  document.documentElement.classList.add('intro-active');
  /* Short, fixed entrance: visual only, never blocks application logic. */
  setTimeout(finishIntro,1450);
  window.addEventListener('pageshow',function(){
    if(document.visibilityState==='visible') setTimeout(finishIntro,1450);
  },{once:true});
  /* Admin can always bypass the intro instantly. */
  document.addEventListener('click',function(e){
    var target=e.target && e.target.closest ? e.target.closest('[data-open-admin],#merteksAdminFab,#merteksAdminOpen') : null;
    if(target)finishIntro();
  },true);
})();

(function(){
  'use strict';
  var cfg=window.MERTEKS_CONFIG||{};
  var api=cfg.supabaseUrl||'';
  if(!api)return;
  /* Warm the TLS/DNS connection without blocking page rendering. */
  if('requestIdleCallback' in window){
    requestIdleCallback(function(){
      try{fetch(api.replace(/\/+$/,'')+'/rest/v1/projects?select=id&limit=1',{headers:{apikey:cfg.supabaseKey||''},cache:'no-store'}).catch(function(){});}catch(e){}
    },{timeout:1800});
  }else{
    setTimeout(function(){
      try{fetch(api.replace(/\/+$/,'')+'/rest/v1/projects?select=id&limit=1',{headers:{apikey:cfg.supabaseKey||''},cache:'no-store'}).catch(function(){});}catch(e){}
    },1200);
  }
})();
