
(()=>{
const root=document;
const reducedMotion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const C={ink:'#172026',gold:'#ffb300',blue:'#006894',green:'#0b652e',pink:'#c94880',purple:'#7442a5',muted:'#59636b',line:'#a7aeb4',soft:'#f1f3f4'};
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},mix=(a,b,t)=>a+(b-a)*t;
const txt=(x,y,t,size=18,color=C.ink,anchor='middle')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}">${t}</text>`;
const box=(x,y,w,h,fill='#fff',stroke=C.ink,r=9,sw=1.5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line=(x1,y1,x2,y2,color=C.line,sw=1.5)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"/>`;
const stepAmount=(s,p,i)=>s>i?1:s===i?ease(p):0;
function arrow(d,p=1,color=C.ink,id='cnn',sw=2.2){return `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="1.3"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100*(1-clamp(p))}" ${p>.96?`marker-end="url(#head-${id})"`:''}/>`}
function wrap(id,w,h,body){if(w>=900)body=body.replace(/font-size="(?:12|13|14|15)"/g,'font-size="16"');return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Redrawn ${id.toUpperCase()} process animation"><defs><marker id="head-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${C.ink}"/></marker></defs><rect width="${w}" height="${h}" fill="white"/>${body}</svg>`}
function cat(cx,cy,scale=1){return `<g transform="translate(${cx} ${cy}) scale(${scale})"><path d="M-44-13L-47-62L-13-39Q0-44 15-39L48-62L44-12" fill="#959ca5" stroke="${C.ink}" stroke-width="2"/><path d="M-39-46L-22-34L-38-28Z M23-34L39-47L37-28Z" fill="#e5b7bd"/><ellipse cy="2" rx="48" ry="43" fill="#a4abb3" stroke="${C.ink}" stroke-width="2"/><path d="M0-38Q-14-8-31 12Q-18 44 0 44Q21 43 32 12Q14-8 0-38" fill="white"/><ellipse cx="-21" cy="-3" rx="11" ry="8" fill="#a5c976" stroke="${C.ink}" stroke-width="1.5"/><ellipse cx="21" cy="-3" rx="11" ry="8" fill="#a5c976" stroke="${C.ink}" stroke-width="1.5"/><ellipse cx="-21" cy="-3" rx="3" ry="7" fill="${C.ink}"/><ellipse cx="21" cy="-3" rx="3" ry="7" fill="${C.ink}"/><path d="M-6 16L0 22L6 16Z" fill="#d88a94"/><path d="M0 22v8m0-1q-9 8-15 1m15-1q9 8 15 1" fill="none" stroke="${C.ink}" stroke-width="1.5"/><path d="M-14 20L-55 16M-14 26L-54 30M14 20L55 16M14 26L54 30" stroke="${C.ink}" stroke-width="1.3"/></g>`}
function feature(x,y,size,index,opacity=1){let art=index%3===0?`M${size*.2} ${size*.8}L${size*.8} ${size*.2}`:index%3===1?`M${size*.15} ${size*.7}Q${size*.5} ${size*.1} ${size*.85} ${size*.7}`:`M${size*.25} ${size*.8}V${size*.3}H${size*.75}V${size*.8}`;return `<g transform="translate(${x} ${y})" opacity="${opacity}">${box(0,0,size,size,'#e5f0f7',C.blue,3)}<path d="${art}" fill="none" stroke="${C.blue}" stroke-width="2.7"/></g>`}
function net(cx,cy,s,p,scale=1){let a=stepAmount(s,p,3),b='';for(let i=0;i<3;i++)for(let j=0;j<3;j++){b+=line(cx-28*scale,cy+(i-1)*28*scale,cx+28*scale,cy+(j-1)*28*scale,a>j*.2?C.ink:C.line,a>j*.2?1.8:1)}for(let i=0;i<3;i++)for(const dx of [-28,28])b+=`<circle cx="${cx+dx*scale}" cy="${cy+(i-1)*28*scale}" r="${9*scale}" fill="${a>(i*.22+(dx>0?.2:0))?C.gold:'#fff'}" stroke="${C.ink}" stroke-width="1.6"/>`;return b}
function drawCNN(s,p,narrow){
let w=narrow?360:1000,h=narrow?770:350,centers=narrow?Array.from({length:5},(_,i)=>[180,85+i*150]):[90,290,490,690,900].map(x=>[x,160]);let b='';
for(let i=0;i<4;i++){let [x,y]=centers[i],[nx,ny]=centers[i+1];b+=arrow(narrow?`M${x} ${y+53}V${ny-57}`:`M${x+65} ${y}H${nx-70}`,stepAmount(s,p,i+1),C.ink,'cnn')}
centers.forEach(([x,y],i)=>{const active=s===i,done=s>i,label=['Input','Convolution','Pooling','Fully connected','Output'][i];if(narrow)b+=box(23,y-55,314,111,active?'#fff7df':'#fff',active?C.gold:C.line,10,active?3:1);if(narrow){b+=txt(42,y-30,`${i+1} · ${label}`,16,C.ink,'start')}else{b+=txt(x,65,`${i+1} · ${label}`,17)}
if(i===0){b+=cat(narrow?110:x,y+(narrow?19:4),narrow?.64:.95);if(narrow)b+=txt(238,y+8,'A cat picture',15);if(s===1){let scan=(Math.sin(p*Math.PI*2)+1)/2;b+=`<rect x="${(narrow?87:x-34)+scan*28}" y="${y-22+Math.sin(p*Math.PI)*25}" width="27" height="27" fill="${C.gold}" fill-opacity=".25" stroke="${C.ink}" stroke-width="2"/>`}}
if(i===1){const size=narrow?33:39,startX=narrow?188:x-55;for(let k=0;k<4;k++){const reveal=done?1:active?clamp(p*5-k*.65):.15;b+=feature(startX+(k%2)*(size+7),y-30+Math.floor(k/2)*(size+7),size,k,reveal)}if(narrow)b+=txt(100,y+14,'Find clues',14)}
if(i===2){const t=stepAmount(s,p,2);for(let k=0;k<3;k++){let size=mix(39,26,t),dx=mix((k-1)*39,(k-1)*21,t),dy=mix(k%2?18:-16,k*5-10,t);b+=feature((narrow?232:x)+dx-size/2,y+dy-size/2,size,k,s>=2?1:.2)}if(narrow)b+=txt(101,y+15,'Summarize',14)}
if(i===3){b+=net(narrow?231:x,y+5,s,p,narrow?.85:1.35);if(narrow)b+=txt(101,y+15,'Combine clues',14)}
if(i===4){const ox=narrow?230:x;['DOG','CAT','LION'].forEach((t,k)=>{const selected=k===1&&s===4,yy=y+(k-1)*35;b+=box(ox-48,yy-15,96,29,selected?C.gold:'#fff',selected?C.ink:C.line,5,selected?2:1)+txt(ox,yy+5,(selected?'✓ ':'')+t,16)})}
});if(!narrow)b+=txt(500,300,'Find visual clues → simplify → combine → classify',18,C.muted);return wrap('cnn',w,h,b)}
function stateBars(x,y,i,a){let b=box(x-57,y-26,114,52,a>0?'#fff0f6':'#fff',a>0?C.pink:C.line,8);for(let k=0;k<4;k++){const height=[12,22,16,27][(i+k)%4],col=a>k*.16?C.pink:'#d6dadd';b+=`<rect x="${x-36+k*22}" y="${y+13-height}" width="13" height="${height}" rx="3" fill="${col}"/>`}return b}
function drawRNN(s,p,narrow){let w=narrow?360:1000,h=narrow?720:370,b='',words=['The','bear','chased','Nick'];
for(let i=0;i<4;i++){const a=stepAmount(s,p,i),x=narrow?181:130+i*245,y=narrow?93+i*181:200,hot=s===i;let rise=s===i?ease(Math.min(1,p*2))*24:s>i?24:0;
if(i>0){const px=narrow?181:x-245,py=narrow?y-181:y;b+=arrow(narrow?`M181 ${py+34}V${y-37}`:`M${px+65} ${y}H${x-70}`,a,C.ink,'rnn')}
b+=box(x-(narrow?50:62),y-34,narrow?100:124,68,a>0?'#dceedd':'#fff',C.green,8,hot?3:1.5)+txt(x,y+7,'RNN',21,C.green);
if(narrow){b+=box(18,y-22,85,45,a>0?'#e0f1f8':'#fff',C.blue,5)+txt(60,y+5,words[i],17);b+=arrow(`M104 ${y}H${x-65}`,a,C.blue,'rnn');b+=stateBars(291,y,i,a);b+=line(x+51,y,234,y,C.pink,2);b+=txt(40,y-50,'Step '+(i+1),14,C.muted,'start')}else{let inputY=y+103-rise;b+=box(x-57,inputY-23,114,46,a>0?'#e0f1f8':'#fff',C.blue,6)+txt(x,inputY+6,words[i],18);b+=arrow(`M${x} ${inputY-25}V${y+37}`,a,C.blue,'rnn');b+=stateBars(x,93,i,a);b+=arrow(`M${x} ${y-35}V122`,a,C.pink,'rnn');b+=txt(x,42,'Step '+(i+1),15,C.muted)}
}
b+=txt(w/2,h-14,narrow?'Blue: input · Green: RNN · Pink: state':'One shared network. A changing summary at every step.',narrow?13:18,C.muted);return wrap('rnn',w,h,b)}
function wordCard(x,y,label,opacity=1,fill='#fff'){let width=label.length*8+25;return `<g opacity="${opacity}">${box(x,y,width,31,fill,C.ink,6)}${txt(x+width/2,y+21,label,14)}</g>`}
function drawLSTM(s,p,narrow){const w=narrow?360:1000,h=narrow?690:450;let b='';const gateLabels=['Forget gate','Input gate','Output gate'];
if(narrow){
 for(let i=0;i<3;i++){let y=80+i*210,a=stepAmount(s,p,i),active=s===i;b+=box(18,y-49,324,168,'#f5faf4',C.green,12,active?3:1.5)+txt(180,y-21,gateLabels[i],20,C.green);if(i<2)b+=arrow(`M180 ${y+120}V${y+157}`,stepAmount(s,p,i+1),C.ink,'lstm');if(i===0){b+=wordCard(38,y+5,'New York',1,'#fff0bd')+wordCard(177,y+5,'Knicks',1,'#fff0bd')+wordCard(38,y+51,'Weather',1-a*.9);b+=txt(245,y+75,a>.65?'Keep useful clues':'Earlier details',13,C.muted)}if(i===1){b+=wordCard(38,y+8,'New York',1,'#fff0bd')+wordCard(177,y+8,'Knicks',1,'#fff0bd');b+=wordCard(76,y+75-ease(a)*22,'Ticket ready',a,'#e0f1f8')}if(i===2){b+=txt(180,y+12,'Memory can stay available',15);b+=box(62,y+33,236,49,a>0?'#ffefb9':'#fff',C.ink,7)+txt(180,y+63,a>.45?'Attend the Knicks game':'Current output',16)}}
 if(s===3)b+=txt(180,668,'Useful information carries to the next step.',14,C.green);
}else{
 b+=box(35,50,930,325,'#f7faf6',C.green,18,2)+txt(83,81,'LSTM cell',18,C.green,'start');b+=txt(500,116,'Cell state · information carried over time',17,C.muted);
 b+=line(75,164,925,164,C.line,5);for(let i=0;i<3;i++){const x=245+i*255,hot=s===i;b+=box(x-89,216,178,77,hot?C.gold:'#fff',C.green,9,hot?3:1.5)+txt(x,248,gateLabels[i],20,C.green)+txt(x,274,['Keep / reduce','Add new information','Expose an output'][i],13,C.muted);b+=line(x,216,x,165,C.green,2);const open=stepAmount(s,p,i);b+=`<path d="M${x-15} 154L${x-15+open*10} ${184-open*10}M${x+15} 154L${x+15-open*10} ${184-open*10}" stroke="${C.green}" stroke-width="4"/>`}
 let forgotten=stepAmount(s,p,0),added=stepAmount(s,p,1),shared=stepAmount(s,p,2),forward=stepAmount(s,p,3);
 b+=wordCard(90,145,'New York',1,'#fff0bd')+wordCard(363,145,'Knicks',1,'#fff0bd')+wordCard(90,188,'Weather',1-forgotten*.93);
 b+=wordCard(455,330-added*185,'Ticket ready',added,'#e0f1f8');
 b+=box(700,315,230,44,shared>0?'#ffefb9':'#fff',C.ink,7)+txt(815,343,shared>.45?'Attend the Knicks game':'Current output',16);
 b+=arrow('M755 296V311',shared,C.ink,'lstm');b+=arrow('M835 164H940',forward,C.ink,'lstm');b+=txt(906,199,forward>.4?'Next step':'',14,C.green);
 b+=txt(500,416,'Earlier plan: New York + Knicks · New detail: the ticket is ready',17,C.muted);
}
return wrap('lstm',w,h,b)}
function textBlock(x,y,w,h,label,active,color,small=false){return box(x,y,w,h,active?'#fff0bd':'#fff',active?C.ink:color,7,active?2.7:1.5)+txt(x+w/2,y+h/2+6,label,small?14:17,color)}
function drawTransformer(s,p,narrow){if(narrow)return drawTransformerNarrow(s,p);const w=narrow?360:1000,h=narrow?985:580,big=narrow?false:true;let b='';const ex=narrow?25:65,dx=narrow?25:555,ey=narrow?20:75,dy=narrow?485:75,bw=narrow?310:380;
 b+=box(ex,ey,bw,narrow?427:433,'#faf7fd',C.purple,13,2)+txt(ex+20,ey+31,'Encoder',22,C.purple,'start');
 b+=box(dx,dy,bw,narrow?435:433,'#f5faf4',C.green,13,2)+txt(dx+20,dy+31,'Decoder',22,C.green,'start');
 const centerE=ex+bw/2,centerD=dx+bw/2;
 const rowsE=[ey+337,ey+236,ey+134],rowsD=[dy+337,dy+236,dy+134,dy+49];
 b+=textBlock(ex+25,rowsE[0],bw-50,53,'Words + order',s===0,C.purple);
 b+=textBlock(ex+25,rowsE[1],bw-50,53,'Attention',s===1,C.purple);
 b+=textBlock(ex+25,rowsE[2],bw-50,53,'Refine the input',s===2,C.purple);
 b+=arrow(`M${centerE} ${rowsE[0]-2}V${rowsE[1]+56}`,stepAmount(s,p,1),C.purple,'transformer');b+=arrow(`M${centerE} ${rowsE[1]-2}V${rowsE[2]+56}`,stepAmount(s,p,2),C.purple,'transformer');
 const sourceWords=['The','bear','chased','Nick'],tileW=narrow?57:65,gap=5,start=centerE-(tileW*4+gap*3)/2;
 sourceWords.forEach((word,i)=>{const x=start+i*(tileW+gap),y=ey+398,a=stepAmount(s,p,0);b+=box(x,y,tileW,26,'#fff',C.purple,4)+txt(x+tileW/2,y+18,word,narrow?12:14);if(s===0){let yy=mix(y,rowsE[0]+15,ease(p));b+=`<g opacity="${Math.sin(p*Math.PI)*.8}">${box(x,yy,tileW,24,'#e8ddf4',C.purple,3)}${line(x+10,yy+8,x+tileW-10,yy+8,C.purple,2)}${line(x+10,yy+16,x+tileW-20,yy+16,C.purple,2)}</g>`}});
 // Attention relationships become visible as multiple connections, not a moving point.
 if(s>=1){let a=s===1?ease(p):1;for(let i=0;i<3;i++){const x1=start+i*(tileW+gap)+tileW/2,x2=start+3*(tileW+gap)+tileW/2,y=rowsE[1]-15;b+=`<path d="M${x1} ${y}Q${(x1+x2)/2} ${y-40-i*5} ${x2} ${y}" fill="none" stroke="${C.purple}" stroke-width="1.8" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100*(1-a)}"/>`}}
 b+=textBlock(dx+25,rowsD[0],bw-50,53,'Masked attention',s===3,C.green);
 b+=textBlock(dx+25,rowsD[1],bw-50,53,'Refer to the input',s===2,C.green);
 b+=textBlock(dx+25,rowsD[2],bw-50,53,'Refine the output',s===3||s===4,C.green);
 b+=textBlock(dx+25,rowsD[3],bw-50,53,'Choose the next piece',s===3||s===4,C.green,narrow);
 for(let i=0;i<3;i++)b+=arrow(`M${centerD} ${rowsD[i]-2}V${rowsD[i+1]+56}`,stepAmount(s,p,3),C.green,'transformer');
 const contextPath=narrow?`M${ex+bw-10} ${rowsE[2]+25}H348V${rowsD[1]+25}H${dx+bw-20}`:`M${ex+bw-20} ${rowsE[2]+25}H${dx-14}V${rowsD[1]+25}H${dx+20}`;
 b+=arrow(contextPath,stepAmount(s,p,2),C.purple,'transformer',3);
 const transfer=stepAmount(s,p,2);if(s===2){const xx=narrow?331:mix(ex+bw+3,dx-30,transfer),yy=narrow?mix(rowsE[2]+10,rowsD[1]+10,transfer):mix(rowsE[2]+10,rowsD[1]+10,transfer);b+=box(xx,yy,18,26,'#e8ddf4',C.purple,3)}
 const out=s<3?'':s===3?(p>.48?'熊':''):p<.48?'熊追':'熊追尼克';
 const outY=narrow?dy+395:34;b+=arrow(`M${centerD} ${rowsD[3]-2}V${outY+19}`,stepAmount(s,p,3),C.green,'transformer');b+=box(centerD-100,outY-23,200,39,out?'#ffb300':'#fff',C.ink,7)+txt(centerD,outY+3,out||'Output',out?23:17);
 const prefix=s<3?'〈start〉':s===3?'〈start〉':p<.48?'熊':'熊追';b+=txt(centerD,dy+411,'Available output: '+prefix,narrow?14:16,C.muted);
 if(s===4){const cycle=p<.48?p/.48:(p-.48)/.52,level=Math.floor(cycle*3);const yy=[rowsD[0],rowsD[2],rowsD[3]][Math.min(2,level)];b+=`<rect x="${dx+25}" y="${yy}" width="${bw-50}" height="53" rx="7" fill="${C.gold}" fill-opacity=".24" stroke="${C.ink}" stroke-width="2"/>`}
 if(!narrow)b+=txt(500,558,'Input representations guide generation; output grows one piece at a time.',17,C.muted);
 return wrap('transformer',w,h,b)}
function drawTransformerNarrow(s,p){
 const w=360,h=1000;let b=box(20,15,320,340,'#faf7fd',C.purple,12,2)+txt(40,44,'Encoder',22,C.purple,'start');
 ['The','bear','chased','Nick'].forEach((t,i)=>{b+=box(32+i*75,64,70,27,'#fff',C.purple,4)+txt(67+i*75,83,t,13)});
 const ex=[112,190,268];['Words + order','Attention','Refine the input'].forEach((t,i)=>{b+=textBlock(45,ex[i],270,49,t,s===i,C.purple);if(i)b+=arrow(`M180 ${ex[i-1]+51}V${ex[i]-3}`,stepAmount(s,p,i),C.purple,'transformer')});
 if(s>=1){const a=s===1?ease(p):1;for(let i=0;i<3;i++)b+=`<path d="M${65+i*75} 98Q${170+i*20} ${110-i*2} 289 98" fill="none" stroke="${C.purple}" stroke-width="1.6" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100*(1-a)}"/>`}
 b+=box(20,410,320,550,'#f5faf4',C.green,12,2)+txt(40,443,'Decoder',22,C.green,'start');
 const prefix=s<3?'〈start〉':s===3?'〈start〉':p<.48?'熊':'熊追';b+=txt(180,478,'Available output: '+prefix,15,C.muted);
 const dy=[510,595,680,765],labels=['Masked attention','Refer to the input','Refine the output','Choose the next piece'];
 labels.forEach((t,i)=>{const active=i===1?s===2:s===3||s===4;b+=textBlock(45,dy[i],270,51,t,active,C.green);if(i)b+=arrow(`M180 ${dy[i-1]+54}V${dy[i]-3}`,stepAmount(s,p,3),C.green,'transformer')});
 b+=arrow('M315 292H349V620H318',stepAmount(s,p,2),C.purple,'transformer',2.8);
 if(s===2)b+=box(340,mix(300,590,ease(p)),15,26,'#e8ddf4',C.purple,3);
 const out=s<3?'':s===3?(p>.48?'熊':''):p<.48?'熊追':'熊追尼克';
 b+=arrow('M180 820V869',stepAmount(s,p,3),C.green,'transformer');b+=box(70,876,220,49,out?C.gold:'#fff',C.ink,7)+txt(180,908,out||'Output',out?25:17);
 if(s===4){const q=p<.48?p/.48:(p-.48)/.52,k=Math.min(2,Math.floor(q*3)),y=[dy[0],dy[2],dy[3]][k];b+=`<rect x="45" y="${y}" width="270" height="51" rx="7" fill="${C.gold}" fill-opacity=".25" stroke="${C.ink}" stroke-width="2"/>`}
 return wrap('transformer',w,h,b);
}
const configs={
cnn:{duration:40000,draw:drawCNN,steps:[["Start with a picture", "The network receives a picture of a cat. At this point, it has not chosen a label: the picture is the information it will examine."], ["Convolution · look for visual clues", "The small window scans parts of the picture. The blue tiles represent clues such as edges and curves. Convolution means looking for useful patterns in different parts of an image."], ["Pooling · keep a smaller summary", "Watch the clue tiles become smaller. Pooling reduces the amount of information while keeping useful signals, so the network can work with a simpler summary."], ["Fully connected · combine the clues", "The connections light up as the network combines the clues. A fully connected layer brings information together to help decide which category best fits the picture."], ["Output · choose a category", "The CAT label is selected from the possible categories. This is classification: using the clues in an image to choose a label. The model learned how to do this during training."]]},
rnn:{duration:32000,draw:drawRNN,steps:[["Read the first word", "The word “The” enters the RNN. The pink bars show its state: a small, changing summary of what it has read so far."], ["Carry a summary to the next word", "Now the RNN reads “bear” while receiving the previous summary. It combines what came before with the new word, instead of treating every word as a separate input."], ["Update the summary", "As “chased” arrives, the pink bars change again. This is the same network at a later moment, updating its summary to reflect the growing sentence."], ["Continue through the sentence", "Finally, “Nick” is added to the context. An RNN repeats this process one step at a time. Its summary is limited, so earlier details can become harder to retain."]]},
lstm:{duration:32000,draw:drawLSTM,steps:[["Forget gate · reduce less useful details", "The student plans to visit New York to watch the Knicks. Watch “Weather” fade while “New York” and “Knicks” remain. The forget gate controls how much earlier information to keep."], ["Input gate · add useful information", "A new detail arrives: the ticket is ready. The input gate controls what new information enters the cell state, the memory carried forward over time. The earlier plan remains available."], ["Output gate · use what matters now", "The current output draws on the student’s plan: attend the Knicks game. The output gate controls which information from memory helps form the output at this step."], ["Carry useful memory forward", "The useful information continues to the next step. These gates help an LSTM retain relevant context across a sequence. The labeled cards are a teaching metaphor for numerical memory."]]},
transformer:{duration:40000,draw:drawTransformer,steps:[["Encoder · represent words and their order", "The encoder receives “The bear chased Nick.” It represents words with numbers and adds information about their positions, so word order can help distinguish who did what."], ["Attention · connect relevant words", "The curved connections show words relating to other words in the input. Attention lets each word draw on relevant context, helping the encoder build a more useful representation of the sentence."], ["Decoder · refer back to the input", "Information from the encoder becomes available to the decoder. While building a translation, the decoder can attend to relevant parts of the original sentence. The purple connection shows that access."], ["Generate the first piece", "The decoder uses the input and the output available so far to choose the next piece. Masked attention means it can use earlier output pieces, without looking at future ones."], ["Repeat · build the output gradually", "Watch the translation grow: 熊 → 熊追 → 熊追尼克. Each new piece becomes context for the next choice. This illustrates generation one piece at a time in the original encoder–decoder Transformer."]]}
};
const controllers=[];
root.querySelectorAll('.concept-animation[data-model]').forEach(panel=>{
 const cfg=configs[panel.dataset.model],scene=panel.querySelector('[data-scene]'),play=panel.querySelector('[data-play]'),replay=panel.querySelector('[data-replay]'),caption=panel.querySelector('[data-caption]'),time=panel.querySelector('[data-time]'),progress=panel.querySelector('.progress'),bar=panel.querySelector('.progress-bar');
 let elapsed=0,playing=false,lastTime=null,frame=null,lastStep=-1,lastSub=-1;
 function render(){const q=Math.min(1,elapsed/cfg.duration),t=q*cfg.steps.length,s=Math.min(cfg.steps.length-1,Math.floor(t)),p=q===1?1:t-s,narrow=(scene.clientWidth||900)<700;scene.innerHTML=cfg.draw(s,reducedMotion?1:Math.min(1,p*1.6),narrow);if(lastStep!==s){caption.innerHTML=`<div class="dl-caption-title">Step ${s+1} of ${cfg.steps.length} · ${cfg.steps[s][0]}</div><div class="dl-caption-body">${cfg.steps[s][1]}</div>`;lastStep=s}const v=Math.round(q*100);bar.style.width=v+'%';progress.setAttribute('aria-valuenow',v);time.textContent=(elapsed/1000).toFixed(1)+' / '+(cfg.duration/1000).toFixed(1)+' s'}
 function pause(){playing=false;lastTime=null;if(frame!==null)cancelAnimationFrame(frame);frame=null;play.textContent=elapsed>=cfg.duration?'Play again':'Play';play.setAttribute('aria-pressed','false')}
 function tick(now){if(!playing)return;if(lastTime!==null)elapsed=Math.min(cfg.duration,elapsed+Math.max(0,now-lastTime));lastTime=now;render();if(elapsed>=cfg.duration){pause();return}frame=requestAnimationFrame(tick)}
 function start(){controllers.forEach(c=>c.pause());if(elapsed>=cfg.duration){elapsed=0;lastStep=-1}playing=true;lastTime=null;play.textContent='Pause';play.setAttribute('aria-pressed','true');render();frame=requestAnimationFrame(tick)}
 play.addEventListener('click',()=>playing?pause():start());replay.addEventListener('click',()=>{pause();elapsed=0;lastStep=-1;render();start()});new MutationObserver(()=>{if(panel.hidden)pause()}).observe(panel,{attributes:true,attributeFilter:['hidden']});if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>render()).observe(scene);controllers.push({pause,render});render();
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)controllers.forEach(c=>c.pause())});
})();
