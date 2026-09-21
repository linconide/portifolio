const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

const hero = document.querySelector('.hero');
const canvas = document.querySelector('#hero-canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.THREE && canvas && !reducedMotion) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 7;
  const group = new THREE.Group();
  scene.add(group);
  [[-2.5, 1.3, .55], [2.7, .5, .35], [1.6, -1.8, .42], [-1.1, -2.2, .25]].forEach(([x, y, scale]) => {
    const material = new THREE.MeshBasicMaterial({ color: 0xd5aa6d, transparent: true, opacity: 0.28, wireframe: true });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(scale, 2), material);
    mesh.position.set(x, y, 0);
    group.add(mesh);
  });
  const resize = () => { const { width, height } = hero.getBoundingClientRect(); renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); };
  resize(); window.addEventListener('resize', resize);
  let pointerX = 0, pointerY = 0;
  hero.addEventListener('pointermove', (event) => { pointerX = (event.clientX / window.innerWidth - .5) * .35; pointerY = (event.clientY / window.innerHeight - .5) * .2; });
  const render = (time) => { group.rotation.y += (pointerX - group.rotation.y) * .018; group.rotation.x += (pointerY - group.rotation.x) * .018; group.children.forEach((mesh, index) => { mesh.rotation.x = time * .00018 * (index + 1); mesh.rotation.y = time * .00012 * (index + 1); }); renderer.render(scene, camera); requestAnimationFrame(render); };
  requestAnimationFrame(render);
}
