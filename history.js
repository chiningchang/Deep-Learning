(()=>{
const root=document.getElementById('learning-history');
if(!root)return;
const detail=root.querySelector('#history-detail');
const data={
ann:['ANN foundations · 1943 & 1958','McCulloch and Pitts described an early artificial neuron model in 1943. Rosenblatt’s 1958 perceptron paper was another milestone in learning from examples.','https://doi.org/10.1007/BF02478259'],
cnn:['CNN milestones · 1980 & 1989','Fukushima’s 1980 Neocognitron was an important precursor. In 1989, LeCun and colleagues demonstrated a convolutional network trained to recognize handwritten digits.','https://doi.org/10.1162/neco.1989.1.4.541'],
rnn:['RNN milestones · 1986 & 1990','Jordan’s and Elman’s networks were influential developments in sequence processing. These are selected milestones, rather than the beginning of all recurrent-network research.','https://doi.org/10.1207/s15516709cog1402_1'],
lstm:['LSTM · 1997','Hochreiter and Schmidhuber introduced Long Short-Term Memory to help networks learn relationships between information separated by many steps.','https://doi.org/10.1162/neco.1997.9.8.1735'],
transformer:['Transformer · 2017','Vaswani and colleagues introduced the Transformer in Attention Is All You Need. The original architecture used an encoder and decoder built around attention.','https://arxiv.org/abs/1706.03762']
};
root.querySelectorAll('[data-era]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.era,item=data[key];
 root.querySelectorAll('[data-era]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 detail.querySelector('h3').textContent=item[0];detail.querySelector('p').textContent=item[1];
 const links=detail.querySelectorAll('a');links[0].href=''+key+'.html';links[0].textContent='Explore '+(key==='transformer'?'Transformer':key.toUpperCase())+' →';links[1].href=item[2];
}));
})();
