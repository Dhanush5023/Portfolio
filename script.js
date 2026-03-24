/* ─── Cursor & Interactivity ─── */
const cc = document.getElementById('cc'), cd = document.getElementById('cd');
let mx=0, my=0, cx=0, cy=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; 
  my = e.clientY;
  cd.style.left = mx + 'px'; 
  cd.style.top = my + 'px';
});

(function lp(){
  cx += (mx - cx) * 0.11; 
  cy += (my - cy) * 0.11;
  cc.style.left = cx + 'px'; 
  cc.style.top = cy + 'px';
  requestAnimationFrame(lp);
})();

document.querySelectorAll('a, button, .sk-cell, .pj-item, .ct-card, .edu-card, .edu-wide, .rs-box').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('lh'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('lh'));
});

/* ─── 3D Background (Three.js) ─── */
let scene, camera, renderer, particles;

function initBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const geo = new THREE.BufferGeometry();
  const count = 1200;
  const posArr = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    posArr[i] = (Math.random() - 0.5) * 15;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.015,
    color: 0xc9b99a, // var(--accent)
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geo, mat);
  scene.add(particles);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  
  // Subtle drift
  particles.rotation.y += 0.0008;
  particles.rotation.x += 0.0003;

  // Mouse Parallax
  particles.position.x += (mx / window.innerWidth - 0.5) * 0.05;
  particles.position.y += -(my / window.innerHeight - 0.5) * 0.05;

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

initBg();

/* ─── 3D Tilt for Projects ─── */
document.querySelectorAll('.pj-item').forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const dx = (x - xc) / xc; // -1 to 1
    const dy = (y - yc) / yc; // -1 to 1
    
    item.style.transform = `perspective(1000px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) translateY(-8px) scale(1.02)`;
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)`;
  });
});

/* ─── Loader ─── */
setTimeout(() => {
  const l = document.getElementById('loader');
  if (l) l.classList.add('loader-hide');
  setTimeout(() => { if (l) l.style.display = 'none'; }, 800);
}, 2400);

/* ─── Marquee ─── */
const words = ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'Data Science', 'Scikit-learn', 'XGBoost', 'Deep Learning', 'SQL', 'MLOps', 'Computer Vision'];
const track = document.getElementById('mqt');
if (track) {
  const all = [...words, ...words, ...words];
  track.innerHTML = all.map(w => `<span class="mq-item">${w}<span class="mq-sep">✦</span></span>`).join('');
}

/* ─── Scroll Reveal ─── */
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('v'), i * 70);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.r').forEach(el => obs.observe(el));
