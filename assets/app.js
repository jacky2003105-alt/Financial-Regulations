(function(){
  // 章節選單：跳到所選章節
  var sel=document.getElementById('chapter');
  if(sel){sel.addEventListener('change',function(){if(sel.value)location.hash=sel.value;});}

  // 每題的解答開關＋全部顯示／隱藏（兩者同步）
  var qs=[].slice.call(document.querySelectorAll('.q'));
  var alls=[].slice.call(document.querySelectorAll('.toggle-all'));
  function setQ(q,open){
    var b=q.querySelector('.toggle'),s=q.querySelector('.sol');
    s.hidden=!open;b.setAttribute('aria-expanded',open?'true':'false');
    b.textContent=open?'隱藏解答':'顯示解答';
  }
  function anyOpen(){return qs.some(function(q){return !q.querySelector('.sol').hidden;});}
  function sync(){var t=anyOpen()?'隱藏全部解答':'顯示全部解答';alls.forEach(function(b){b.textContent=t;});}
  qs.forEach(function(q){
    q.querySelector('.toggle').addEventListener('click',function(){setQ(q,q.querySelector('.sol').hidden);sync();});
  });
  alls.forEach(function(b){b.addEventListener('click',function(){var o=!anyOpen();qs.forEach(function(q){setQ(q,o);});sync();});});
  // 列印時一律展開
  window.addEventListener('beforeprint',function(){qs.forEach(function(q){q.dataset.was=q.querySelector('.sol').hidden?'0':'1';setQ(q,true);});});
  window.addEventListener('afterprint',function(){qs.forEach(function(q){setQ(q,q.dataset.was!=='0');});sync();});

  // 搜尋：關鍵字或題號
  var input=document.getElementById('search'),count=document.getElementById('count'),none=document.getElementById('none');
  var secs=[].slice.call(document.querySelectorAll('.sec')),chs=[].slice.call(document.querySelectorAll('.chapter'));
  function filter(){
    var terms=input.value.toLowerCase().trim().split(/\s+/).filter(Boolean),n=0;
    qs.forEach(function(q){var ok=terms.every(function(t){return q.dataset.search.indexOf(t)>=0;});q.hidden=!ok;if(ok)n++;});
    secs.forEach(function(s){s.hidden=!s.querySelector('.q:not([hidden])');});
    chs.forEach(function(c){c.hidden=!c.querySelector('.sec:not([hidden])');});
    count.textContent=n+' 題';none.hidden=n>0;
  }
  if(input){input.addEventListener('input',filter);}

  // 從舊網址或題號連結進來時，確保該題可見
  function reveal(){
    var id=location.hash.slice(1),el=id&&document.getElementById(id);
    if(el&&el.closest&&el.closest('[hidden]')&&input){input.value='';filter();el.scrollIntoView();}
  }
  window.addEventListener('hashchange',reveal);
})();
