// Theme toggle
const body = document.body;
const themeBtn = document.getElementById('themeToggle');
function setTheme(mode){ body.setAttribute('data-theme', mode); localStorage.setItem('theme', mode); themeBtn.textContent = mode==='dark'?'Light':'Dark'; }
setTheme(localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click',()=>setTheme(body.getAttribute('data-theme')==='dark'?'light':'dark'));

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mailto form
document.getElementById('mailForm').addEventListener('submit', e=>{
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const subject = encodeURIComponent(`[Portfolio] ${f.get('name')} — ${f.get('topic')||'Liên hệ'}`);
  const bodyText = encodeURIComponent(`${f.get('message')}\n\n— ${f.get('email')}`);
  window.location.href = `mailto:you@example.com?subject=${subject}&body=${bodyText}`;
});

// Helpers
async function loadJSON(path){ const r = await fetch(path); return r.json(); }

// Projects + filter
const containerP = document.getElementById('projects-container');
const filters = document.querySelectorAll('.filters .chip');
let allProjects = [];
function renderProjects(list){
  containerP.innerHTML = list.map(p=>`
    <article class="card project" data-type="${p.type}">
      <h4>${p.title}</h4>
      <p class="muted">${p.desc}</p>
      <ul class="tags">${p.tech.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div class="project-actions">
        <a class="btn primary" href="${p.repo}" target="_blank">Source</a>
        ${p.demo?`<a class="btn ghost" href="${p.demo}" target="_blank">Demo</a>`:''}
      </div>
    </article>
  `).join('');
}
loadJSON('data/projects.json').then(p=>{ allProjects = p; renderProjects(allProjects); });
filters.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const type = btn.dataset.filter;
    renderProjects(type==='all'?allProjects:allProjects.filter(x=>x.type===type));
  });
});

// Skills
// Skills (hỗ trợ string hoặc object {text, level})
const skillsWrap = document.getElementById('skills-container');
loadJSON('data/skills.json').then(groups=>{
  skillsWrap.innerHTML = groups.map((g,i)=>{
    const chips = g.items.map(it=>{
      // chấp nhận 2 kiểu: string hoặc object
      let text = typeof it === 'string' ? it : it.text;
      let level = typeof it === 'string'
        ? (text.startsWith('~') ? 'basic' : 'main')
        : (it.level || 'main');

      // nếu dùng ký hiệu ~ ở đầu -> bỏ ~ đi
      if (typeof it === 'string' && text.startsWith('~')) text = text.slice(1).trim();

      const cls = level === 'basic' ? 'skill-basic' : '';
      return `<li class="${cls}">${text}</li>`;
    }).join('');

    return `
      <div class="card skill-card ${i===0?'skill-main':''}">
        <h4>${g.title}</h4>
        <ul class="chips">${chips}</ul>
      </div>
    `;
  }).join('');
});


// Experience
const expWrap = document.getElementById('experience-timeline');
loadJSON('data/experience.json').then(rows=>{
  expWrap.innerHTML = rows.map(e=>`
    <li>
      <span class="time">${e.time}</span>
      <h4>${e.title}</h4>
      <p class="muted">${e.desc}</p>
    </li>
  `).join('');
});

// ===== Snowfall background =====
const snowCanvas = document.getElementById('snow-canvas');
const sctx = snowCanvas.getContext('2d');
let sw, sh, flakes;

function resizeSnow(){
  sw = snowCanvas.width = window.innerWidth;
  sh = snowCanvas.height = window.innerHeight;
  flakes = Array.from({length: 120}, () => ({
    x: Math.random()*sw,
    y: Math.random()*sh,
    r: Math.random()*2 + 1,      // kích thước bông tuyết
    d: Math.random()*1 + 0.5     // tốc độ rơi
  }));
}
window.addEventListener('resize', resizeSnow);
resizeSnow();

function drawSnow(){
  sctx.clearRect(0,0,sw,sh);
  sctx.fillStyle = 'rgba(255,255,255,0.9)';
  sctx.beginPath();
  flakes.forEach(f=>{
    sctx.moveTo(f.x, f.y);
    sctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
  });
  sctx.fill();
  updateSnow();
  requestAnimationFrame(drawSnow);
}

function updateSnow(){
  flakes.forEach(f=>{
    f.y += f.d;
    if(f.y > sh){
      f.y = -5;
      f.x = Math.random()*sw;
      f.d = Math.random()*1 + 0.5;
    }
  });
}
drawSnow();

const music = document.getElementById('bg-music');
  const toggleBtn = document.getElementById('musicToggle');

  let isPlaying = false;

  toggleBtn.addEventListener('click', async () => {
    try {
      if (!isPlaying) {
        await music.play();
        isPlaying = true;
        toggleBtn.textContent = '🔇';  // Biểu tượng khi đang phát
      } else {
        music.pause();
        isPlaying = false;
        toggleBtn.textContent = '🎵';  // Biểu tượng khi tắt
      }
    } catch (err) {
      console.log('Không thể phát nhạc tự động:', err);
    }
  });
