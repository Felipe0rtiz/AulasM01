export const SYMBOLS = ['tiger', 'gem', 'ingot', 'coin', 'lantern', 'orange'];
export const WEIGHTS = [2, 10, 13, 20, 25, 30];
export const MULTIPLIERS = { tiger: 50, gem: 20, ingot: 15, coin: 10, lantern: 5, orange: 3 };
export const PAYLINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [6, 4, 2]];
export const BETS = [5, 10, 25, 50, 100];
export const INITIAL_BALANCE = 1000;
export function generateGrid(random = Math.random) {
  return Array.from({ length: 9 }, () => {
    let pick = random();
    if (!Number.isFinite(pick) || pick < 0 || pick >= 1) throw new RangeError('Sorteio inválido.');
    pick *= 100;
    for (let i = 0; i < SYMBOLS.length; i++) {
      pick -= WEIGHTS[i];
      if (pick < 0) return SYMBOLS[i];
    }
    return SYMBOLS.at(-1);
  });
}
export function resolveRound(grid, bet, balance) {
  if (!BETS.includes(bet) || !Number.isSafeInteger(balance) || balance < bet) throw new RangeError('Créditos insuficientes ou valor inválido.');
  if (!Array.isArray(grid) || grid.length !== 9 || [...grid].some(symbol => !SYMBOLS.includes(symbol))) throw new RangeError('Símbolos inválidos.');
  const winningLines = [];
  const perLine = bet / PAYLINES.length;
  PAYLINES.forEach((cells, index) => {
    const symbols = cells.map(cell => grid[cell]);
    const symbol = symbols.find(value => value !== 'tiger') ?? 'tiger';
    if (symbols.every(value => value === symbol || value === 'tiger')) {
      winningLines.push({ index, cells: [...cells], symbol, payout: perLine * MULTIPLIERS[symbol] });
    }
  });
  const basePayout = winningLines.reduce((sum, line) => sum + line.payout, 0);
  const fullBoard = new Set(grid.filter(symbol => symbol !== 'tiger')).size <= 1;
  const multiplier = fullBoard ? 10 : 1;
  const payout = basePayout * multiplier;
  return { payout, basePayout, multiplier, balance: balance - bet + payout, winningLines };
}
