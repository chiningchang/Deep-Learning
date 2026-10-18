'use strict';
function initializeDiagramGuide(figure){
 const data=JSON.parse(figure.querySelector('.diagram-guide-data').textContent);
 const previous=figure.querySelector('.guide-previous'),next=figure.querySelector('.guide-next');
 let selected=0;
 function selectPart(index){
  if(index<0||index>=data.length)return;
  selected=index;
  figure.querySelectorAll('[data-spot-index]').forEach(button=>{const active=Number(button.dataset.spotIndex)===index;button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active))});
  figure.querySelector('.guide-title').textContent=`${index+1} · ${data[index].title}`;
  figure.querySelector('.guide-description').textContent=data[index].description;
  previous.disabled=index===0;next.disabled=index===data.length-1;
 }
 figure.querySelectorAll('[data-spot-index]').forEach(button=>{button.addEventListener('click',()=>selectPart(Number(button.dataset.spotIndex)))});
 previous.addEventListener('click',()=>selectPart(selected-1));next.addEventListener('click',()=>selectPart(selected+1));
 selectPart(0);
}
document.querySelectorAll('[data-diagram-guide]').forEach(initializeDiagramGuide);
