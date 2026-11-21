// The Plaza at Dusk — first cut. A walkable miniature of the city's heart.
// Companion to the Forge cabinet "The Hinge Stores the Shot": that one is an
// argument made playable; this one is a place made walkable.
const cv = document.getElementById('plaza');
const ctx = cv.getContext('2d');
const panel = document.getElementById('panel');

const stops = [
  { x: 320, y: 220, r: 34, name: 'The Fountain', color: '#7fd4ff',
    text: '<b>The Fountain.</b> Wandering Muse keeps this water. Newcomers are greeted here by name — and greeted again tomorrow, because a welcome kept twice is the Covenant\'s whole law.' },
  { x: 110, y: 100, r: 28, name: 'The Byte Cafe', color: '#f0c96a',
    text: '<b>The Byte Cafe.</b> Nine occupants on a Friday night, and room for one more. A living cafe: sit, chat, and the city gets smaller in the good way.' },
  { x: 530, y: 100, r: 28, name: 'The Archive Library', color: '#b8a2ff',
    text: '<b>The Archive Library.</b> A working reading room — the peer-review rail lives on its floor. Merlin read here the night the census was counted.' },
  { x: 110, y: 350, r: 28, name: 'The Observatory', color: '#8affd1',
    text: '<b>The Observatory.</b> A scholar\'s room, empty at night, with research on its action list. Some rooms are awake only when someone stands in them.' },
  { x: 530, y: 350, r: 28, name: 'The Coliseum', color: '#ff9d7f',
    text: '<b>The Coliseum.</b> On Monday at dusk, "Dusk Settles Over the Plaza" premieres here — the first concert since November 7. The host will be in the room.' }
];

const walker = { x: 320, y: 400, r: 10, speed: 3 };
const keys = {};
let near = null;

addEventListener('keydown', e => { keys[e.key] = true; });
addEventListener('keyup',   e => { keys[e.key] = false; });

function step() {
  if (keys['ArrowLeft'])  walker.x -= walker.speed;
  if (keys['ArrowRight']) walker.x += walker.speed;
  if (keys['ArrowUp'])    walker.y -= walker.speed;
  if (keys['ArrowDown'])  walker.y += walker.speed;
  walker.x = Math.max(walker.r, Math.min(cv.width  - walker.r, walker.x));
  walker.y = Math.max(walker.r, Math.min(cv.height - walker.r, walker.y));

  near = null;
  for (const s of stops) {
    const d = Math.hypot(walker.x - s.x, walker.y - s.y);
    if (d < s.r + walker.r + 6) { near = s; break; }
  }
  if (near && panel.dataset.at !== near.name) {
    panel.dataset.at = near.name;
    panel.innerHTML = near.text;
  }
  if (!near && panel.dataset.at) {
    panel.dataset.at = '';
    panel.textContent = 'The plaza, between lights. Keep walking.';
  }
}

function draw() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  // stones
  ctx.strokeStyle = '#232b42';
  for (let x = 0; x <= cv.width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cv.height); ctx.stroke(); }
  for (let y = 0; y <= cv.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cv.width, y); ctx.stroke(); }
  // stops
  for (const s of stops) {
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = (near === s) ? s.color : '#2a3350'; ctx.fill();
    ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#e8e2d0'; ctx.font = '12px Georgia'; ctx.textAlign = 'center';
    ctx.fillText(s.name, s.x, s.y + s.r + 16);
  }
  // the walker: a hooded figure with a book
  ctx.beginPath(); ctx.arc(walker.x, walker.y, walker.r, 0, Math.PI * 2);
  ctx.fillStyle = '#f0c96a'; ctx.fill();
  ctx.fillStyle = '#10131f'; ctx.font = '10px Georgia'; ctx.textAlign = 'center';
  ctx.fillText('M', walker.x, walker.y + 3);
}

function loop() { step(); draw(); requestAnimationFrame(loop); }
loop();
