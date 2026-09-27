function goTo(id){
    document.querySelectorAll('.stage').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function openEnvelope(){
    const wrap = document.getElementById('envelope');
    if(wrap.classList.contains('open'))return;
    wrap.classList.add('open');
    setTimeout(()=> goTo('stage-1'),750);
}
function celebrate(){
    goTo('stage-final');
    bursHearts(28);
}
function bursHearts(count){
    const layer = document.getElementById('heart-layer');
    const emojis = ['💖','💗','💘','💝','💞','💕'];
    for(let i=0;i<count;i++){
        const h = document.createElement('span');
        h.className = 'heart';
        h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        h.style.left = Math.random()*100+'vw';
        h.style.setProperty('--dx',(Math.random()*80-40) + 'px');
        h.style.setProperty('--rot',(Math.random()*60-30) + 'deg');
        h.style.animationDuration = (2.4 + Math.random()*1.6)+'s';
        h.style.fontSize = (16 + Math.random()*16)+'px';
        layer.appendChild(h);
        setTimeout(()=> h.remove(),4500);
    }
}
//Boton no puedo, que se escapa
(function(){
    const btn = document.getElementById('btn-no');
    const actions = document.querySelector('#stage-4 .rsvp-actions');
    const note = document.getElementById('dodge-note');
    const frases = ['¡No puedes decir que no!','¡Vamos, anímate!'];
    let dodges = 0;
    function dodge(){
        const bounds = actions.getBoundingClientRect();
        const maxX = Math.max(bounds.width - btn.offsetWidth - 8, 20);
        const x = (Math.random()*2-1)* maxX * 0.5;
        const y = (Math.random()*2-1) * 40;
        btn.style.transform = `translate(${x}px, ${y}px)`;
        dodges++;
        note.textContent = frases[Math.min(dodges-1, frases.length-1)];
    }
    btn.addEventListener('mouseenter', dodge);
    btn.addEventListener('touchstart', e => { e.preventDefault(); dodge(); }, {passive:false});
    btn.addEventListener('click', e => e.preventDefault());
})();

//Nombre dinámico desde la URL (?nombre=Argeli)
(function(){
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get('nombre');
    if(nombre){
        document.querySelectorAll('.guest-name').forEach(el => el.textContent = nombre);
    }
})();