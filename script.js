document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const delay = Number(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add("visible"), delay);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
window.__paraisoScriptLoaded = true;

const canvas = document.querySelector("#reefCanvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduceMotion) {
  let usedFallback = false;
  const fallbackTimer = setTimeout(() => {
    usedFallback = true;
    drawCanvasFallback(canvas);
  }, 1400);

  import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js")
    .then((THREE) => {
      if (usedFallback) return;
      clearTimeout(fallbackTimer);
      initThreeScene(THREE);
    })
    .catch(() => {
      usedFallback = true;
      clearTimeout(fallbackTimer);
      drawCanvasFallback(canvas);
    });
}

function drawCanvasFallback(targetCanvas) {
  const context = targetCanvas.getContext("2d");
  if (!context) return;

  const resize = () => {
    const rect = targetCanvas.getBoundingClientRect();
    const width = rect.width || targetCanvas.clientWidth || window.innerWidth;
    const height = rect.height || targetCanvas.clientHeight || window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
    targetCanvas.width = Math.floor(width * ratio);
    targetCanvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const paint = (time = 0) => {
    const width = targetCanvas.clientWidth || window.innerWidth;
    const height = targetCanvas.clientHeight || window.innerHeight;

    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;

    for (let layer = 0; layer < 7; layer += 1) {
      context.beginPath();
      context.strokeStyle = layer % 2 ? "rgba(255,216,172,.22)" : "rgba(158,233,223,.25)";
      const base = height * (0.56 + layer * 0.035);

      for (let x = -20; x <= width + 20; x += 18) {
        const y = base + Math.sin(x * 0.012 + time * 0.001 + layer) * (18 + layer * 2);
        if (x === -20) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.stroke();
    }

    requestAnimationFrame(paint);
  };

  window.addEventListener("resize", resize);
  targetCanvas.dataset.renderer = "canvas-fallback";
  targetCanvas.classList.add("is-fallback");
  resize();
  paint();
}

function initThreeScene(THREE) {
  canvas.dataset.renderer = "three";
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  const clock = new THREE.Clock();
  const rig = new THREE.Group();
  const pointer = { x: 0, y: 0 };

  camera.position.set(0, 1.2, 7);
  scene.add(rig);

  const waveGeometry = new THREE.PlaneGeometry(14, 4.2, 90, 18);
  const waveMaterial = new THREE.MeshBasicMaterial({
    color: 0x9ee9df,
    transparent: true,
    opacity: 0.2,
    wireframe: true
  });
  const waves = new THREE.Mesh(waveGeometry, waveMaterial);
  waves.rotation.x = -Math.PI / 2.45;
  waves.position.set(1.1, -2.45, -0.5);
  rig.add(waves);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd8ac,
    transparent: true,
    opacity: 0.18,
    wireframe: true
  });

  for (let index = 0; index < 7; index += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35 + index * 0.25, 0.008, 8, 80), ringMaterial);
    ring.position.set(2.5 + index * 0.08, 0.8 - index * 0.1, -index * 0.22);
    ring.rotation.set(Math.PI / 2.8, 0.15, index * 0.08);
    rig.add(ring);
  }

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.clientWidth || window.innerWidth;
    const height = rect.height || canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.22;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.16;
  });

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    const positions = waveGeometry.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      positions.setZ(index, Math.sin(x * 1.25 + elapsed * 0.9) * 0.1 + Math.cos(y * 2.2 + elapsed) * 0.05);
    }

    positions.needsUpdate = true;
    rig.rotation.y += (pointer.x - rig.rotation.y) * 0.04;
    rig.rotation.x += (pointer.y - rig.rotation.x) * 0.04;
    rig.children.forEach((child, index) => {
      if (child === waves) return;
      child.rotation.z += 0.0018 + index * 0.00018;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  resize();
  animate();
}
