const menu = {
  cafe: [['Espresso da Casa','R$ 9','Intenso, doce e cremoso','1495474472287-4d71bcdd2085'],['Coado V60','R$ 14','Escolha o grão do dia','1514432324607-a09d9b4aefdd'],['Cappuccino','R$ 16','Leite vaporizado e canela','1498804103079-a6351b050096'],['Flat White','R$ 17','Duplo espresso, leite sedoso','1497636577773-f1231844b336']],
  comida: [['Pão de queijo','R$ 10','Quentinho, porção com 6','1499636136210-6f4ee915583e'],['Croissant','R$ 14','Manteiga francesa','1509440159596-0249088772ff'],['Bolo da casa','R$ 12','Sabor do dia','1578985545062-69928b1d9587'],['Toast de avocado','R$ 23','Pão artesanal e limão','1525351484163-7529414344d8']],
  gelado: [['Cold brew','R$ 16','Extraído por 18 horas','1461023058943-07fcbe16d735'],['Iced latte','R$ 17','Leite e espresso gelado','1495474472287-4d71bcdd2085'],['Tônica cítrica','R$ 18','Café, tônica e laranja','1501339847302-ac426a4a7cbb'],['Affogato','R$ 19','Sorvete de baunilha e café','1461988320302-91bde64fc8e4']]
};
const grid = document.querySelector('#menuGrid');
function renderMenu(kind='cafe') { grid.innerHTML = menu[kind].map(([name,price,text,image]) => `<article class="menu-card"><div class="card-photo"><img src="https://images.unsplash.com/photo-${image}?auto=format&fit=crop&w=700&q=82" alt="${name}" loading="lazy"></div><div><p>${price}</p><h3>${name}</h3><small>${text}</small></div></article>`).join(''); }
renderMenu();
document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active')); button.classList.add('active'); renderMenu(button.dataset.tab); }));
const dialog = document.querySelector('#booking');
document.querySelectorAll('[data-reserve]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
document.querySelector('.close').addEventListener('click', () => dialog.close());
document.querySelector('#bookingForm').addEventListener('submit', event => { event.preventDefault(); event.currentTarget.hidden = true; dialog.querySelector('.confirmation').hidden = false; });
document.querySelector('.menu-toggle').addEventListener('click', event => { const nav = document.querySelector('nav'); nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', nav.classList.contains('open')); });
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => document.querySelector('nav').classList.remove('open')));
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('visible'), Number(entry.target.dataset.delay || 0)); observer.unobserve(entry.target); } }), {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.addEventListener('mousemove', event => { const glow = document.querySelector('.cursor-glow'); glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; });
