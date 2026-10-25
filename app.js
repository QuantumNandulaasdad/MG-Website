'use strict';
document.documentElement.classList.add('js');
const demo=document.getElementById('phoneDemo');
const modeButtons=[...document.querySelectorAll('[data-mode]')];
modeButtons.forEach(button=>button.addEventListener('click',()=>{
 const mg=button.dataset.mode==='mg';
 demo.classList.toggle('mg',mg);
 modeButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.getElementById('receiverChat').textContent=mg?'Receiving problem.':'Message received.';
 document.getElementById('receiverStatus').textContent=mg?'Response less reliable':'Response follows';
 document.getElementById('demoDescription').textContent=mg?'With MG: blocked, missing or damaged receiving structures can make the muscle response less reliable. Some messages can still trigger a response.':'Without MG: working receptors receive ACh, helping the muscle reach the level needed to respond.';
}));
const progress=document.getElementById('progress');
const links=[...document.querySelectorAll('.contents nav a')];
const sections=links.map(link=>document.querySelector(link.getAttribute('href')));
let ticking=false;
function updateReading(){
 const height=document.documentElement.scrollHeight-innerHeight;
 progress.style.width=(height>0?Math.min(100,Math.max(0,scrollY/height*100)):100)+'%';
 let active=0;
 sections.forEach((section,index)=>{if(section.getBoundingClientRect().top<innerHeight*.38)active=index;});
 links.forEach((link,index)=>{link.classList.toggle('active',index===active);if(index===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateReading);ticking=true;}},{passive:true});
addEventListener('resize',updateReading);
const wordCount=document.getElementById('article').innerText.split(/\s+/).length;
document.getElementById('readTime').textContent=Math.max(1,Math.ceil(wordCount/220))+' min read';
updateReading();
