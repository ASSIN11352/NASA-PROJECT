(() => {
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 const state = { lang: localStorage.getItem("anf-lang") || "en", world: "all", quizIndex:0, score:0, answered:false };
 const lang = () => state.lang;
 const tr = key => (I18N[lang()] && I18N[lang()][key]) || I18N.en[key] || key;
 const localized = value => typeof value === "string" ? value : ((value && value[lang()]) || (value && value.en) || "");
 const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const slug = id => `story.html?id=${encodeURIComponent(id)}`;

 function applyLanguage(){
   document.documentElement.lang = lang();
   document.documentElement.dir = lang()==="ar" ? "rtl" : "ltr";
   $$("[data-i18n]").forEach(el => { const key=el.dataset.i18n; const value=tr(key); if(el.hasAttribute("data-i18n-placeholder")) el.placeholder=value; else el.innerHTML=value; });
   $$("[data-i18n-placeholder]").forEach(el => el.placeholder=tr(el.dataset.i18nPlaceholder));
   const toggle=$("#langToggle"); if(toggle) toggle.textContent=lang()==="en"?"عربي":"English";
   document.title = ({"home":"Abandoned, Not Forgotten — Space Legacy Archive","explorer":"Explorer — Abandoned, Not Forgotten","archive":"Artifact Archive — Abandoned, Not Forgotten","story":"Mission Story — Abandoned, Not Forgotten","lab":"Mission Lab — Abandoned, Not Forgotten","sources":"Science & Sources — Abandoned, Not Forgotten"})[document.body.dataset.page] || document.title;
   renderCurrentPage();
 }
 function storyCard(m){
   const summary=localized(m.summary);
   return `<article class="story-card"><a class="story-art ${m.accent}" href="${slug(m.id)}" aria-label="${esc(m.name)}"><span class="card-orbit"></span><span class="card-planet"></span><span class="card-code">${esc(m.world.toUpperCase())} / ${esc(m.years)}</span><span class="card-art-label">${esc(m.tag)}</span><span class="card-rover">✦</span></a><div class="story-card-body"><div class="card-meta"><span>${esc(m.type)}</span><span>•</span><span>${esc(m.world)}</span></div><h3><a href="${slug(m.id)}">${esc(m.name)}</a></h3><p>${esc(summary)}</p><a class="card-link" href="${slug(m.id)}">${lang()==="ar"?"اقرأ القصة ←":"Read the story ↗"}</a></div></article>`;
 }
 function renderCards(targetId, list){const el=$("#"+targetId); if(el) el.innerHTML=list.map(storyCard).join("");}
 function renderHome(){renderCards("featuredStories",MISSIONS.slice(0,3));}
 function renderExplorer(){renderCards("explorerStories", state.world==="all"?MISSIONS:MISSIONS.filter(m=>m.world===state.world));}
 function renderArchive(){
   const search=($("#archiveSearch")?.value||"").trim().toLowerCase(), world=$("#worldFilter")?.value||"all", type=$("#typeFilter")?.value||"all";
   const list=MISSIONS.filter(m=>(world==="all"||m.world===world)&&(type==="all"||m.type===type)&&[m.name,m.world,m.type,m.years,m.tag,localized(m.summary),localized(m.science)].join(" ").toLowerCase().includes(search));
   renderCards("archiveStories",list);
   const count=$("#resultCount"); if(count) count.textContent=lang()==="ar"?`${list.length} سجلات`:`${list.length} records`;
   $("#emptyState")?.classList.toggle("hidden",list.length!==0);
 }
 function renderStory(){
   const root=$("#storyContent"); if(!root)return;
   const id=new URLSearchParams(location.search).get("id")||"opportunity";
   const m=MISSIONS.find(item=>item.id===id)||MISSIONS[0];
   const t=localized, rtl=lang()==="ar";
   root.innerHTML=`<section class="story-hero"><div class="story-hero-copy"><p class="eyebrow">${esc(m.tag)} / ${esc(m.world.toUpperCase())}</p><h1>${esc(m.name)}<br><em>${esc(m.years)}</em></h1><p class="story-lead">${esc(t(m.summary))}</p><div class="story-facts"><div><small>${rtl?"الوجهة":"DESTINATION"}</small><b>${esc(m.world)}</b></div><div><small>${rtl?"النوع":"HARDWARE"}</small><b>${esc(m.type)}</b></div><div><small>${rtl?"الحالة":"STATUS"}</small><b>${esc(rtl?"انتهت المهمة":"Mission ended")}</b></div></div></div><div class="story-hero-art ${m.accent}"><div class="big-orbit"></div><div class="big-planet"></div><div class="story-art-ground"></div><div class="story-art-machine">✦</div><span class="art-stamp">ARCHIVE / ${String(MISSIONS.indexOf(m)+1).padStart(3,"0")}</span></div></section>
   <section class="story-content-grid"><article class="story-narrative"><p class="eyebrow">${rtl?"01 / الهدف":"01 / THE MISSION"}</p><h2>${rtl?"ماذا كان الهدف؟":"What was it built to do?"}</h2><p>${esc(t(m.goal))}</p><div class="story-divider"></div><p class="eyebrow">${rtl?"02 / الاكتشاف":"02 / THE SCIENCE"}</p><h2>${rtl?"ماذا تعلمنا؟":"What did science learn?"}</h2><p>${esc(t(m.science))}</p><div class="fact-highlight"><span class="fact-mark">✦</span><div><small>${rtl?"حقيقة موثقة":"DOCUMENTED FACT"}</small><p>${esc(t(m.fact))}</p></div></div><div class="story-divider"></div><p class="eyebrow">${rtl?"03 / ما بعد المهمة":"03 / AFTER THE MISSION"}</p><h2>${rtl?"كيف انتهت الرحلة؟":"How did the journey end?"}</h2><p>${esc(t(m.ending))}</p><div class="science-caution"><b>${rtl?"تمييز مهم":"A SCIENCE NOTE"}</b><p>${rtl?"هذه القصة تلخص معلومات منشورة. لا تعني الأدلة على الماء القديم وجود حياة، ولا تُعرض الرسوم في هذا الموقع بوصفها صورًا أصلية للمعدة.":"This story summarizes published information. Evidence of ancient water is not proof of life, and the site's decorative visuals are not photographs of the actual hardware."}</p></div></article><aside class="story-sidebar"><div class="sidebar-card"><p class="eyebrow">${rtl?"خط زمني":"MISSION TIMELINE"}</p><div class="timeline"><div><i></i><small>${rtl?"الإطلاق":"LAUNCH"}</small><b>${esc(m.launch)}</b></div><div><i></i><small>${rtl?"الهبوط / الوصول":"LANDING / ARRIVAL"}</small><b>${esc(m.landing)}</b></div><div><i></i><small>${rtl?"نهاية المهمة / آخر مرحلة":"MISSION END / LAST PHASE"}</small><b>${esc(m.end)}</b></div></div></div><div class="sidebar-card source-card"><p class="eyebrow">${rtl?"اقرأ المصدر الأصلي":"PRIMARY SOURCE"}</p><h3>${esc(m.name)} at NASA</h3><p>${rtl?"تحقق من تفاصيل المهمة من صفحة ناسا الرسمية.":"Verify mission details on the official NASA page."}</p><a class="button button-primary button-full" href="${esc(m.source)}" target="_blank" rel="noopener noreferrer">${rtl?"افتح مصدر ناسا ↗":"Open NASA source ↗"}</a><small>${rtl?"مصدر خارجي — يفتح في تبويب جديد":"External source — opens in a new tab"}</small></div><a class="back-card" href="archive.html">← ${rtl?"العودة إلى الأرشيف":"Back to the archive"}</a></aside></section>`;
 }
 function renderSources(){
   const root=$("#sourceList"); if(!root)return;
   root.innerHTML=SOURCES.map((s,i)=>`<article class="source-row"><span class="source-number">${String(i+1).padStart(2,"0")}</span><div><h3>${esc(s.title)}</h3><small>${esc(s.organization)}</small><p>${esc(localized(s.note))}</p></div><a class="source-open" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(s.title)} source">↗</a></article>`).join("");
 }
 const QUIZ = [
  {q:{en:"What did Surveyor 3 help scientists test on the Moon?",ar:"ما الذي ساعدت Surveyor 3 العلماء على اختباره على القمر؟"},options:{en:["Whether lunar soil could support an Apollo lunar module","Whether Mars had oceans","Whether the Moon has a thick atmosphere"],ar:["هل تستطيع التربة القمرية دعم مركبة هبوط أبولو","هل كانت للمريخ محيطات","هل للقمر غلاف جوي كثيف"]},correct:0,why:{en:"Surveyor 3 dug trenches and performed bearing tests that helped assess the lunar surface.",ar:"حفرت Surveyor 3 خنادق وأجرت اختبارات تحمّل ساعدت في تقييم سطح القمر."}},
  {q:{en:"What did Opportunity find evidence for?",ar:"عن ماذا وجدت أوبورتيونيتي أدلة؟"},options:{en:["Ancient water-related environments on Mars","Living dinosaurs on Mars","A breathable Martian atmosphere today"],ar:["بيئات مائية قديمة على المريخ","وجود ديناصورات حية على المريخ","غلاف جوي قابل للتنفس على المريخ اليوم"]},correct:0,why:{en:"Opportunity found geological evidence of past water activity. It did not discover life.",ar:"وجدت أوبورتيونيتي أدلة جيولوجية على نشاط مائي سابق، لكنها لم تكتشف حياة."}},
  {q:{en:"What was InSight designed to study?",ar:"ما الذي صُممت إنسايت لدراسته؟"},options:{en:["The interior structure of Mars","The rings of Saturn","The surface of the Sun"],ar:["البنية الداخلية للمريخ","حلقات زحل","سطح الشمس"]},correct:0,why:{en:"InSight used seismic and other measurements to investigate Mars' crust, mantle, and core.",ar:"استخدمت إنسايت القياسات الزلزالية وغيرها لدراسة قشرة المريخ ووشاحه ولبّه."}}
 ];
 function setupQuiz(){
   if(!$("#questionText"))return;
   state.quizIndex=0;state.score=0;state.answered=false;renderQuestion();
   $("#nextQuestion").onclick=()=>{if(!state.answered)return;if(state.quizIndex<QUIZ.length-1){state.quizIndex++;state.answered=false;renderQuestion()}else showScore()};
   $("#restartQuiz").onclick=()=>{state.quizIndex=0;state.score=0;state.answered=false;renderQuestion()};
 }
 function renderQuestion(){
   const q=QUIZ[state.quizIndex], options=q.options[lang()];
   $("#quizProgress").style.width=`${((state.quizIndex+1)/QUIZ.length)*100}%`;
   $("#quizStep").textContent=lang()==="ar"?`السؤال ${state.quizIndex+1} / ${QUIZ.length}`:`QUESTION ${String(state.quizIndex+1).padStart(2,"0")} / ${QUIZ.length}`;
   $("#questionText").textContent=q.q[lang()];
   $("#answerOptions").innerHTML=options.map((o,i)=>`<button class="answer-option" data-answer="${i}"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${esc(o)}</span></button>`).join("");
   $("#answerFeedback").classList.add("hidden");$("#answerFeedback").innerHTML="";$("#nextQuestion").disabled=true;$("#nextQuestion").classList.remove("hidden");$("#restartQuiz").classList.add("hidden");
   $$(".answer-option").forEach(btn=>btn.onclick=()=>chooseAnswer(Number(btn.dataset.answer)));
 }
 function chooseAnswer(index){
   if(state.answered)return;state.answered=true;
   const q=QUIZ[state.quizIndex], correct=index===q.correct;if(correct)state.score++;
   $$(".answer-option").forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add("correct");else if(i===index)b.classList.add("incorrect")});
   const feedback=$("#answerFeedback");feedback.classList.remove("hidden");feedback.classList.add(correct?"feedback-correct":"feedback-wrong");
   feedback.innerHTML=`<b>${correct?(lang()==="ar"?"إجابة صحيحة!":"Correct!"):(lang()==="ar"?"ليس تمامًا.":"Not quite.")}</b><p>${esc(q.why[lang()])}</p>`;
   $("#nextQuestion").disabled=false;$("#nextQuestion").textContent=state.quizIndex===QUIZ.length-1?(lang()==="ar"?"عرض النتيجة ←":"See your result →"):tr("nextQuestion");
 }
 function showScore(){
   $("#questionText").textContent=lang()==="ar"?"انتهت المهمة التعليمية!":"Mission complete!";
   $("#answerOptions").innerHTML=`<div class="quiz-score"><strong>${state.score}/${QUIZ.length}</strong><span>${lang()==="ar"?"إجابات صحيحة":"correct answers"}</span><p>${state.score===QUIZ.length?(lang()==="ar"?"رائع! أنت محقق فضاء ممتاز.":"Excellent work, space detective."):lang()==="ar"?"استكشف القصص وحاول مرة أخرى لترسيخ معلوماتك.":"Explore the stories and try again to strengthen your mission knowledge."}</p></div>`;
   $("#answerFeedback").classList.add("hidden");$("#nextQuestion").classList.add("hidden");$("#restartQuiz").classList.remove("hidden");$("#quizStep").textContent=lang()==="ar"?"اكتملت المهمة":"MISSION COMPLETE";
 }
 function renderCurrentPage(){
   const page=document.body.dataset.page;
   if(page==="home")renderHome();if(page==="explorer")renderExplorer();if(page==="archive")renderArchive();if(page==="story")renderStory();if(page==="sources")renderSources();
   if(page==="lab"&&!$("#questionText").dataset.ready){$("#questionText").dataset.ready="1";setupQuiz();}
   if(page==="lab"&&$("#questionText").dataset.ready==="1"&&$("#answerOptions").children.length) { /* Preserve quiz progress when language changes. */ }
 }
 function setupCosmicCursor(){
   if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
   document.documentElement.classList.add("cosmic-cursor");
   const make=(cls)=>{const el=document.createElement("div");el.className=cls;el.setAttribute("aria-hidden","true");document.body.appendChild(el);return el;};
   const aura=make("cursor-aura"),core=make("cursor-core");
   let x=-100,y=-100,ax=-100,ay=-100,lastTrail=0,stars=[];
   const move=(el,px,py)=>{el.style.left=px+"px";el.style.top=py+"px";};
   document.addEventListener("mousemove",e=>{
     x=e.clientX;y=e.clientY;move(core,x,y);
     const now=performance.now();
     if(now-lastTrail>24){
       lastTrail=now;const star=make("cursor-star");
       const angle=Math.random()*Math.PI*2,spread=5+Math.random()*12;
       move(star,x+Math.cos(angle)*spread,y+Math.sin(angle)*spread);stars.push(star);
       if(stars.length>24)stars.shift().remove();
       setTimeout(()=>{star.remove();stars=stars.filter(s=>s!==star);},720);
     }
   },{passive:true});
   const follow=()=>{ax+=(x-ax)*.19;ay+=(y-ay)*.19;move(aura,ax,ay);requestAnimationFrame(follow);};requestAnimationFrame(follow);
   const interactive='a,button,[role="button"],input,select,textarea,.story-card,.world-card,.answer-option';
   document.addEventListener("mouseover",e=>{if(e.target.closest(interactive))document.body.classList.add("cursor-hover");});
   document.addEventListener("mouseout",e=>{if(e.target.closest(interactive)&&!e.relatedTarget?.closest(interactive))document.body.classList.remove("cursor-hover");});
   document.addEventListener("mousedown",e=>{
     document.body.classList.add("cursor-pressed");
     const burst=make("cursor-burst");move(burst,e.clientX,e.clientY);setTimeout(()=>burst.remove(),600);
     const target=e.target.closest(interactive);
     if(target){target.classList.remove("is-activating");void target.offsetWidth;target.classList.add("is-activating");setTimeout(()=>target.classList.remove("is-activating"),450);}
   });
   document.addEventListener("mouseup",()=>document.body.classList.remove("cursor-pressed"));
   document.addEventListener("mouseleave",()=>{aura.style.opacity="0";core.style.opacity="0";});
   document.addEventListener("mouseenter",()=>{aura.style.opacity="1";core.style.opacity="1";});
 }
 function setupSelectionEffects(){
   document.addEventListener("click",e=>{
     const target=e.target.closest('a,button,[role="button"],.story-card,.world-card,.answer-option');
     if(!target)return;
     target.classList.remove("is-activating");void target.offsetWidth;target.classList.add("is-activating");
     setTimeout(()=>target.classList.remove("is-activating"),450);
   },true);
   document.addEventListener("change",e=>{
     const el=e.target;
     if(!el.matches('select,input[type="checkbox"],input[type="radio"]'))return;
     el.classList.remove("is-activating");void el.offsetWidth;el.classList.add("is-activating");
     setTimeout(()=>el.classList.remove("is-activating"),450);
   });
 }

 document.addEventListener("DOMContentLoaded",()=>{
   setupCosmicCursor();
   setupSelectionEffects();
   $("#year")&&($("#year").textContent=new Date().getFullYear());
   $("#langToggle")?.addEventListener("click",()=>{state.lang=lang()==="en"?"ar":"en";localStorage.setItem("anf-lang",state.lang);applyLanguage();});
   $("#menuToggle")?.addEventListener("click",()=>$(".main-nav")?.classList.toggle("nav-open"));
   $("#archiveSearch")?.addEventListener("input",renderArchive);$("#worldFilter")?.addEventListener("change",renderArchive);$("#typeFilter")?.addEventListener("change",renderArchive);
   $$("[data-world]").forEach(btn=>btn.addEventListener("click",()=>{state.world=btn.dataset.world;location.href=`archive.html?world=${encodeURIComponent(state.world)}`;}));
   const params=new URLSearchParams(location.search);if($("#worldFilter")&&params.get("world"))$("#worldFilter").value=params.get("world");
   applyLanguage();
 });
})();