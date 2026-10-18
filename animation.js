'use strict';
const learningDefaults={w1:.8,w2:-.4,bh:.1,v:.7,bo:-.2};
let animParams={...learningDefaults},animStage=0,animPlaying=false,animTimer=null,animCommitted=false,animRound=0;
const animSigmoid=x=>1/(1+Math.exp(-x));
function learningSnapshot(params,target=1){
 const x1=.6,x2=.4,zh=params.w1*x1+params.w2*x2+params.bh,h=animSigmoid(zh),zo=params.v*h+params.bo,yhat=animSigmoid(zo),loss=.5*(yhat-target)**2;
 const dout=(yhat-target)*yhat*(1-yhat),dh=dout*params.v*h*(1-h);
 return{x1,x2,zh,h,zo,yhat,loss,target,dout,dh,grads:{w1:dh*x1,w2:dh*x2,bh:dh,v:dout*h,bo:dout}};
}
let animBefore={...animParams},animSnapshot=learningSnapshot(animBefore);
const fmt=(n,d=4)=>Number(n).toFixed(d);
function stopAnimation(){animPlaying=false;if(animTimer!==null)clearTimeout(animTimer);animTimer=null;$('cycle-play').textContent='▶ Play animation';$('learning-animation').classList.add('animation-paused')}
function prepareCycle(){animBefore={...animParams};animSnapshot=learningSnapshot(animBefore,+$('cycle-target').value);animCommitted=false;}
function commitLearning(){if(animCommitted)return;for(const k of Object.keys(animParams))animParams[k]=animBefore[k]-.5*animSnapshot.grads[k];animCommitted=true;animRound++;}
function selectStage(stage){if(stage<5&&animCommitted){animParams={...animBefore};animCommitted=false;animRound=Math.max(0,animRound-1)}animStage=stage;if(stage===5)commitLearning();renderLearningAnimation()}
const stageContent=[
 ['Forward pass · hidden neuron','Combine the inputs in the hidden neuron.','The two inputs are multiplied by their weights. Add the hidden bias bₕ, then apply sigmoid to produce the hidden neuron’s output h.'],
 ['Forward pass · output neuron','Turn the hidden signal into a prediction.','Multiply h by the output weight v, add the output bias bₒ, and apply sigmoid. We have made a prediction; no parameter has changed yet.'],
 ['Compare · calculate the loss','Compare the prediction with the target.','The target is the known answer for this example. Squared-error loss measures the mismatch. The weights and biases are still unchanged.'],
 ['Backpropagate · output gradients','Compute the output error signal.','Backpropagation applies the chain rule. At the output, δₒ gives the bias gradient directly. Multiplying δₒ by h gives the gradient for the output connection v. Gradients are calculated here; updates come later.'],
 ['Backpropagate · hidden gradients','Send the gradient through the hidden neuron.','The hidden error signal uses δₒ, the current output weight v, and the hidden sigmoid derivative. It gives the hidden bias gradient. Multiplying by each input gives the input-weight gradients. Both biases now have their own gradients.'],
 ['Update · gradient descent','Use the gradients to update every parameter.','Subtract learning rate × gradient from each weight and bias. Recompute the prediction with the updated parameters. The gold rows show how both biases changed.']
];
function renderLearningAnimation(){
 const a=animSnapshot,b=animBefore,after=animStage===5?learningSnapshot(animParams,a.target):null;
 $('cycle-stage').textContent=`${stageContent[animStage][0]} · step ${animStage+1} / 6`;$('cycle-title').textContent=stageContent[animStage][1];$('cycle-description').textContent=stageContent[animStage][2];
 document.querySelectorAll('[data-cycle]').forEach(el=>{const n=+el.dataset.cycle,active=n===0?animStage<=1:n===3?animStage===3||animStage===4:n===animStage;el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active))});
 const stepMath=[
 [`zₕ = 0.60 × ${fmt(b.w1)} + 0.40 × ${fmt(b.w2)} + ${fmt(b.bh)} = ${fmt(a.zh)}`,`h = sigmoid(zₕ) = ${fmt(a.h)}`],
 [`zₒ = ${fmt(b.v)} × ${fmt(a.h)} + ${fmt(b.bo)} = ${fmt(a.zo)}`,`ŷ = sigmoid(zₒ) = ${fmt(a.yhat)}`],
 [`L = ½(${fmt(a.yhat)} − ${a.target})² = ${fmt(a.loss,6)}`,`Prediction ŷ = ${fmt(a.yhat)}; target y = ${a.target}`],
 [`δₒ = (ŷ − y) × ŷ(1 − ŷ) = ${fmt(a.dout,6)}`,`∂L/∂bₒ = δₒ = ${fmt(a.grads.bo,6)}`,`∂L/∂v = δₒ × h = ${fmt(a.grads.v,6)}`],
 [`δₕ = δₒ × v × h(1 − h) = ${fmt(a.dh,6)}`,`∂L/∂bₕ = δₕ = ${fmt(a.grads.bh,6)}`,`∂L/∂w₁ = δₕ × 0.60 = ${fmt(a.grads.w1,6)}`,`∂L/∂w₂ = δₕ × 0.40 = ${fmt(a.grads.w2,6)}`],
 [`bₒ: ${fmt(b.bo)} − 0.50 × (${fmt(a.grads.bo,6)}) = ${fmt(animParams.bo,6)}`,`bₕ: ${fmt(b.bh)} − 0.50 × (${fmt(a.grads.bh,6)}) = ${fmt(animParams.bh,6)}`,`All three connection weights use the same update rule.`]
 ];
 $('cycle-math').innerHTML=stepMath[animStage].map(t=>`<div><code>${t}</code></div>`).join('');
 const rows=[['w1','Input weight w₁'],['w2','Input weight w₂'],['bh','Hidden bias bₕ'],['v','Output weight v'],['bo','Output bias bₒ']];
 $('parameter-rows').innerHTML=rows.map(([k,label])=>{const known=animStage>=4||(animStage===3&&(k==='v'||k==='bo'));return `<tr class="${k==='bh'||k==='bo'?'bias-row':''}"><th scope="row">${label}</th><td>${fmt(b[k])}</td><td>${known?fmt(a.grads[k],6):'Not computed yet'}</td><td>${animStage===5?fmt(animParams[k],6):'Not updated yet'}</td></tr>`}).join('');
 $('cycle-result').textContent=after?`Update ${animRound} complete. Prediction: ${fmt(a.yhat)} → ${fmt(after.yhat)}. Loss on this example: ${fmt(a.loss,6)} → ${fmt(after.loss,6)}. This improvement is specific to this example and learning rate.`:'The inputs and target stay fixed. Only weights and biases are learned. No updates happen until the final step.';
 renderCycleDiagram(a,b,after);
 $('cycle-next').textContent=animStage===5?'Start next cycle →':'Next step →';
}
function renderCycleDiagram(a,b,after){
 const forward=animStage<=1,backward=animStage===3||animStage===4,update=animStage===5;
 const edge=(x1,y1,x2,y2,active,back=false)=>`<path d="M ${back?x2:x1} ${back?y2:y1} L ${back?x1:x2} ${back?y1:y2}" fill="none" stroke="${active?(back?'#006894':'#111'):'#9a9a9a'}" stroke-width="${active?4:2}" marker-end="url(#${active&&back?'arrow-blue':'arrow-dark'})" class="${active?'gradient-flow':''}"/>`;
 const label=(x,y,text,size=16,fill='#111',anchor='middle')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${text}</text>`;
 let svg=`<defs><marker id="arrow-dark" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#111"/></marker><marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#006894"/></marker></defs><rect width="1040" height="390" fill="#fafafa"/>`;
 svg+=edge(155,120,344,173,animStage===0||animStage===4,animStage===4)+edge(155,250,344,197,animStage===0||animStage===4,animStage===4)+edge(449,185,650,185,animStage===1||backward,backward)+edge(760,185,885,185,animStage===1||animStage===2,false);
 // Bias connections reverse during their respective backpropagation stages.
 svg+=edge(397,85,397,132,animStage===0||animStage===4,animStage===4)+edge(706,85,706,132,animStage===1||animStage===3,animStage===3);
 svg+=label(240,111,`w₁ = ${fmt(update?animParams.w1:b.w1,3)}`,15)+label(240,274,`w₂ = ${fmt(update?animParams.w2:b.w2,3)}`,15)+label(548,158,`v = ${fmt(update?animParams.v:b.v,3)}`,16);
 const bias=(x,key,title,active)=>`<rect x="${x-67}" y="31" width="134" height="55" fill="#ffb300" stroke="#111" stroke-width="${active?3:1.5}" class="${active?'pulse-ring':''}"/>${label(x,52,title,14)}${label(x,73,fmt(update?animParams[key]:b[key],4),17)}`;
 svg+=bias(397,'bh','Hidden bias bₕ',animStage===4||update)+bias(706,'bo','Output bias bₒ',animStage===3||update);
 svg+=`<rect x="40" y="90" width="115" height="60" fill="white" stroke="#111" stroke-width="2"/><rect x="40" y="220" width="115" height="60" fill="white" stroke="#111" stroke-width="2"/>`+label(97,126,'x₁ = 0.60',18)+label(97,256,'x₂ = 0.40',18);
 const node=(cx,title,value,active)=>`<circle cx="${cx}" cy="185" r="53" fill="${active?'#ffb300':'white'}" stroke="#111" stroke-width="3"/>${label(cx,175,title,14)}${label(cx,200,value,19)}`;
 svg+=node(397,'Hidden h',animStage>=0?fmt(update?after.h:a.h):'?',animStage===0||animStage===4||update)+node(706,'Output ŷ',animStage>=1?fmt(update?after.yhat:a.yhat):'…',animStage===1||animStage===3||update);
 svg+=`<rect x="885" y="135" width="125" height="100" fill="${animStage===2?'#ffb300':'white'}" stroke="#111" stroke-width="2"/>`+label(948,163,`Target y = ${a.target}`,15)+label(948,190,'Loss',14)+label(948,215,animStage>=2?fmt(update?after.loss:a.loss,5):'…',18);
 svg+=label(397,268,'sigmoid(w₁x₁ + w₂x₂ + bₕ)',14)+label(706,268,'sigmoid(vh + bₒ)',14);
 if(animStage===3)svg+=label(706,306,`Output bias gradient = ${fmt(a.grads.bo,6)}`,17,'#005779');
 if(animStage===4)svg+=label(397,306,`Hidden bias gradient = ${fmt(a.grads.bh,6)}`,17,'#005779');
 svg+=label(520,354,backward?'BLUE ARROWS: gradients move backward through the computation':update?'UPDATE: each parameter subtracts its own learning-rate-scaled gradient':forward?'FORWARD: inputs and biases contribute to the prediction':'COMPARE: the prediction is evaluated against the known target',15);
 $('learning-animation').innerHTML=svg;$('learning-animation').classList.toggle('animation-paused',!animPlaying);$('learning-animation').setAttribute('aria-label',`${stageContent[animStage][0]}. Hidden bias ${fmt(update?animParams.bh:b.bh)}, output bias ${fmt(update?animParams.bo:b.bo)}. ${animStage>=2?'Loss '+fmt(update?after.loss:a.loss,6):''}`);
}
function advanceLearning(){if(animStage===5){prepareCycle();animStage=0;renderLearningAnimation()}else selectStage(animStage+1)}
function scheduleLearning(){if(!animPlaying)return;animTimer=setTimeout(()=>{if(!animPlaying)return;if(animStage===5){stopAnimation();return}advanceLearning();if(animStage===5){stopAnimation();return}scheduleLearning()},+$('cycle-speed').value)}
$('cycle-play').onclick=()=>{if(animPlaying){stopAnimation();return}if(animStage===5){prepareCycle();animStage=0}animPlaying=true;$('cycle-play').textContent='Ⅱ Pause animation';renderLearningAnimation();scheduleLearning()};
$('cycle-next').onclick=()=>{stopAnimation();advanceLearning()};
function resetLearningAnimation(){stopAnimation();animParams={...learningDefaults};animRound=0;animStage=0;prepareCycle();renderLearningAnimation()}
$('cycle-reset').onclick=resetLearningAnimation;$('cycle-target').onchange=resetLearningAnimation;
$('cycle-speed').onchange=()=>{if(animPlaying){if(animTimer!==null)clearTimeout(animTimer);scheduleLearning()}};
document.querySelectorAll('[data-cycle]').forEach(b=>b.onclick=()=>{stopAnimation();selectStage(+b.dataset.cycle)});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAnimation()});
resetLearningAnimation();
