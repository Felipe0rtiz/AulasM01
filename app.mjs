import { BETS, INITIAL_BALANCE, SYMBOLS, WEIGHTS, MULTIPLIERS, PAYLINES, generateGrid, resolveRound } from './game-engine.mjs';
const $ = id => document.getElementById(id);
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const format = value => currency.format(value);
const names = { tiger: 'Tigre', gem: 'Jade', ingot: 'Lingote', coin: 'Moeda', lantern: 'Lanterna', orange: 'Tangerina' };
const lineColors = ['#f5bc32', '#f87a6b', '#56bd8c', '#bb87f5', '#60bbec'];
let balance = INITIAL_BALANCE;
let betIndex = 1;
let busy = false;
let automatic = false;
let autoRemaining = 0;
let autoTimer;
let overlayTimer;
let sound = false;
let turbo = false;
let audio;
let history = [];
let displayedGrid = ['ingot', 'orange', 'coin', 'lantern', 'tiger', 'gem', 'orange', 'coin', 'ingot'];
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function makeCell(symbol, cellIndex) {
  const cell = document.createElement('div');
  cell.className = 'slot-symbol';
  cell.dataset.symbol = symbol;
  if (cellIndex !== undefined) {
    cell.dataset.cell = cellIndex;
    cell.setAttribute('aria-label', `${Math.floor(cellIndex / 3) + 1}ª linha, ${cellIndex % 3 + 1}º rolo: ${names[symbol]}`);
  } else cell.setAttribute('aria-hidden', 'true');
  cell.innerHTML = `<svg aria-hidden="true"><use href="assets/symbols.svg#${symbol}"/></svg>${symbol === 'tiger' ? '<span class="wild-label" aria-hidden="true">WILD</span>' : ''}`;
  return cell;
}
const reels = Array.from({ length: 3 }, (_, col) => {
  const reel = document.createElement('div');
  reel.className = 'reel';
  reel.setAttribute('aria-label', `Rolo ${col + 1}`);
  const strip = document.createElement('div');
  strip.className = 'reel-strip';
  reel.append(strip);
  $('reels').append(reel);
  return { reel, strip };
});
function renderColumn(col, grid) {
  reels[col].strip.replaceChildren(...[0, 1, 2].map(row => makeCell(grid[row * 3 + col], row * 3 + col)));
}
reels.forEach((_, col) => renderColumn(col, displayedGrid));
$('payout-list').innerHTML = SYMBOLS.map(symbol => `<div class="payout-item"><svg aria-hidden="true"><use href="assets/symbols.svg#${symbol}"/></svg><span>${names[symbol]}</span><b>×${MULTIPLIERS[symbol]}</b></div>`).join('');
function updateControls() {
  $('balance').textContent = format(balance);
  $('bet').textContent = format(BETS[betIndex]);
  $('per-line').textContent = format(BETS[betIndex] / 5);
  $('bet-minus').disabled = busy || automatic || betIndex === 0;
  $('bet-plus').disabled = busy || automatic || betIndex === BETS.length - 1;
  $('spin').disabled = busy || automatic || balance < BETS[betIndex];
  $('reset').disabled = busy || automatic;
  $('auto').disabled = !automatic && (busy || balance < BETS[betIndex]);
  $('auto').setAttribute('aria-pressed', String(automatic));
  $('auto').setAttribute('aria-label', automatic ? 'Parar modo automático' : 'Jogar 10 rodadas automaticamente');
  $('auto').querySelector('span').textContent = automatic ? 'PARAR' : 'AUTO';
  $('spin').querySelector('span').textContent = busy ? 'GIRANDO' : automatic ? `AUTO ${autoRemaining}` : 'GIRAR';
  $('spin').setAttribute('aria-label', busy ? 'Rolos girando' : 'Girar agora');
  $('reels').setAttribute('aria-busy', String(busy));
}
function message(text, win = false) {
  $('message').textContent = text;
  $('message').classList.toggle('win', win);
}
function tone(kind = 'spin') {
  if (!sound) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    audio.resume().catch(() => {});
    const now = audio.currentTime;
    const notes = kind === 'win' ? [523, 659, 784, 1047] : kind === 'stop' ? [260] : [330, 440];
    notes.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const volume = audio.createGain();
      oscillator.frequency.value = frequency;
      volume.gain.setValueAtTime(0.05, now + index * 0.1);
      volume.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.25);
      oscillator.connect(volume).connect(audio.destination);
      oscillator.start(now + index * 0.1);
      oscillator.stop(now + index * 0.1 + 0.3);
    });
  } catch { /* Audio is optional. */ }
}
function celebrate() {
  if (reducedMotion()) return;
  $('confetti').replaceChildren();
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('i');
    piece.style.setProperty('--x', `${Math.random() * 100}%`);
    piece.style.setProperty('--d', `${Math.random() * 0.5}s`);
    piece.style.background = ['#edc17b', '#ef8061', '#99c8a2', '#fff0c5'][i % 4];
    $('confetti').append(piece);
  }
  setTimeout(() => $('confetti').replaceChildren(), 2500);
}
function clearWin() {
  clearTimeout(overlayTimer);
  $('win-overlay').hidden = true;
  $('paylines').replaceChildren();
  document.querySelectorAll('.winner').forEach(cell => cell.classList.remove('winner'));
  document.querySelectorAll('[data-line]').forEach(line => line.classList.remove('lit'));
}
function highlightWins(result) {
  result.winningLines.forEach(line => {
    line.cells.forEach(index => document.querySelector(`[data-cell="${index}"]`).classList.add('winner'));
    document.querySelector(`[data-line="${line.index}"]`).classList.add('lit');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute('points', line.cells.map(index => `${(index % 3) * 100 + 50},${Math.floor(index / 3) * 100 + 50}`).join(' '));
    path.setAttribute('stroke', lineColors[line.index]);
    $('paylines').append(path);
  });
}
async function animateReel(col, grid) {
  const { reel, strip } = reels[col];
  if (reducedMotion() || typeof strip.animate !== 'function') {
    await wait(60 + col * 40);
    renderColumn(col, grid);
    return;
  }
  const starting = [0, 1, 2].map(row => displayedGrid[row * 3 + col]);
  const filler = Array.from({ length: turbo ? 12 : 24 }, (_, index) => SYMBOLS[(index + col * 2) % SYMBOLS.length]);
  const ending = [0, 1, 2].map(row => grid[row * 3 + col]);
  const symbols = [...starting, ...filler, ...ending];
  strip.replaceChildren(...symbols.map(symbol => makeCell(symbol)));
  reel.classList.add('spinning');
  const distance = (symbols.length - 3) * (reel.clientHeight / 3);
  const animation = strip.animate([{ transform: 'translateY(0)' }, { transform: `translateY(-${distance}px)` }], {
    duration: turbo ? 400 + col * 150 : 1100 + col * 350,
    easing: 'cubic-bezier(.15,.4,.15,1)',
    fill: 'forwards'
  });
  try { await animation.finished; } catch { /* Settle to the already determined result if animation is cancelled. */ }
  renderColumn(col, grid);
  animation.cancel();
  reel.classList.remove('spinning');
  tone('stop');
}
function stopAuto() {
  automatic = false;
  clearTimeout(autoTimer);
  updateControls();
}
async function spin() {
  if (busy || balance < BETS[betIndex]) {
    if (!busy) { stopAuto(); message('Saldo insuficiente. Renove o saldo ou diminua o valor do giro.'); }
    return;
  }
  const bet = BETS[betIndex];
  const resultGrid = generateGrid();
  const result = resolveRound(resultGrid, bet, balance);
  busy = true;
  balance -= bet;
  clearWin();
  message('Solte a sorte... os rolos estão girando!');
  tone();
  updateControls();
  await Promise.all(reels.map((_, col) => animateReel(col, resultGrid)));
  displayedGrid = resultGrid;
  balance = result.balance;
  $('last-win').textContent = format(result.payout);
  highlightWins(result);
  history.unshift({ time: new Date().toLocaleTimeString('pt-BR'), bet, payout: result.payout, balance, lines: result.winningLines.length, multiplier: result.multiplier });
  history = history.slice(0, 50);
  $('history-count').textContent = history.length;
  if ($('dialog').open && $('dialog').dataset.kind === 'history') renderHistory();
  if (result.payout > 0) {
    message(result.multiplier === 10 ? `QUADRO CHEIO ×10! +${format(result.payout)}!` : `${result.winningLines.length} ${result.winningLines.length === 1 ? 'linha premiada' : 'linhas premiadas'}! +${format(result.payout)}.`, true);
    tone('win');
    if (result.payout >= bet * 10 || result.multiplier === 10) {
      $('win-title').textContent = result.multiplier === 10 ? 'FORTUNA ×10!' : 'GRANDE VITÓRIA!';
      $('win-amount').textContent = format(result.payout);
      $('win-overlay').hidden = false;
      celebrate();
      overlayTimer = setTimeout(() => { $('win-overlay').hidden = true; }, 2200);
    }
  } else message(balance >= bet ? 'A próxima combinação está a um giro de distância.' : 'Saldo insuficiente. Renove o saldo ou diminua o valor do giro.');
  busy = false;
  if (automatic) {
    autoRemaining--;
    if (autoRemaining <= 0 || balance < bet) stopAuto();
    else autoTimer = setTimeout(spin, result.payout > 0 ? 2400 : turbo ? 400 : 1000);
  }
  updateControls();
}
$('spin').addEventListener('click', spin);
$('auto').addEventListener('click', () => {
  if (automatic) return stopAuto();
  if (busy || balance < BETS[betIndex]) return;
  automatic = true;
  autoRemaining = 10;
  spin();
});
$('bet-minus').addEventListener('click', () => { if (!busy && !automatic && betIndex > 0) { betIndex--; updateControls(); } });
$('bet-plus').addEventListener('click', () => { if (!busy && !automatic && betIndex < BETS.length - 1) { betIndex++; updateControls(); } });
$('turbo').addEventListener('click', () => {
  turbo = !turbo;
  $('turbo').setAttribute('aria-pressed', String(turbo));
  $('turbo').setAttribute('aria-label', turbo ? 'Desativar giro rápido' : 'Ativar giro rápido');
});
$('sound').addEventListener('click', () => {
  sound = !sound;
  $('sound').setAttribute('aria-pressed', String(sound));
  $('sound').setAttribute('aria-label', sound ? 'Desativar som' : 'Ativar som');
  $('sound').querySelector('.sound-off').hidden = sound;
  if (sound) tone();
});
$('reset').addEventListener('click', () => {
  if (busy || automatic) return;
  balance = INITIAL_BALANCE;
  history = [];
  $('history-count').textContent = '0';
  $('last-win').textContent = format(0);
  clearWin();
  message('Saldo renovado. Que venham os próximos giros!');
  updateControls();
});
function renderHistory() {
  $('dialog-content').innerHTML = history.length ? `<p>As últimas ${history.length} rodadas da sessão.</p><div class="history-scroll"><table class="history-table"><thead><tr><th>Horário</th><th>Giro</th><th>Linhas</th><th>Prêmio</th><th>Saldo</th></tr></thead><tbody>${history.map(round => `<tr><td>${round.time}</td><td>${format(round.bet)}</td><td>${round.lines}${round.multiplier === 10 ? ' · ×10' : ''}</td><td class="${round.payout ? 'positive' : ''}">${round.payout ? '+' : ''}${format(round.payout)}</td><td>${format(round.balance)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">Seu primeiro giro está esperando.<br>As rodadas aparecerão aqui depois de jogar.</div>';
}
function openDialog(kind) {
  stopAuto();
  $('dialog').dataset.kind = kind;
  $('dialog-title').textContent = kind === 'rules' ? 'Regras e tabela de prêmios' : 'Histórico dos giros';
  if (kind === 'rules') $('dialog-content').innerHTML = `<ol><li>Você começa com <strong>${format(INITIAL_BALANCE)} de saldo fictício</strong>. Escolha o valor total do giro com + e −.</li><li>São <strong>5 linhas ativas</strong>: três horizontais e as duas diagonais. O valor de cada linha é o valor do giro ÷ 5. Três símbolos iguais em uma linha pagam o multiplicador abaixo.</li><li>O <strong>tigre é curinga</strong>: substitui qualquer outro símbolo. Três tigres na linha pagam ×50. Os prêmios de todas as linhas vencedoras se somam.</li><li><strong>Quadro cheio ×10:</strong> se os nove símbolos forem iguais, aceitando tigres como substitutos, o prêmio total das linhas é multiplicado por 10.</li></ol><div class="rule-payouts">${SYMBOLS.map(symbol => `<span>${names[symbol]} <strong>×${MULTIPLIERS[symbol]}</strong></span>`).join('')}</div><p><strong>Exemplo:</strong> giro de ${format(10)} = ${format(2)} por linha. Uma linha de moedas paga ${format(2)} × 10 = ${format(20)}. O custo total é descontado uma única vez, ao iniciar o giro.</p><p><strong>Auto:</strong> até 10 rodadas. Parar encerra após o giro atual. <strong>Turbo:</strong> acelera os próximos giros. Espaço também gira os rolos.</p><p>Probabilidade de cada símbolo, por posição independente: ${SYMBOLS.map((symbol, i) => `${names[symbol]} ${WEIGHTS[i]}%`).join(', ')}.</p><p>Demonstração original inspirada em caça-níqueis; não reproduz o algoritmo ou a tabela oficial de Fortune Tiger. Sem depósitos ou saques. Saldo e histórico são reiniciados ao recarregar a página; use Renovar saldo para começar de novo.</p>`;
  else renderHistory();
  if (!$('dialog').open) $('dialog').showModal();
}
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => openDialog(button.dataset.dialog)));
$('close-dialog').addEventListener('click', () => $('dialog').close());
$('dialog').addEventListener('click', event => {
  if (event.target !== $('dialog')) return;
  const rect = $('dialog').getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('dialog').close();
});
$('nav-game').addEventListener('click', () => { $('dialog').close(); $('spin').focus({ preventScroll: true }); document.querySelector('.machine').scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' }); });
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !event.repeat && !$('dialog').open && !['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(document.activeElement.tagName)) {
    event.preventDefault();
    if (!automatic) spin();
  }
});
updateControls();
