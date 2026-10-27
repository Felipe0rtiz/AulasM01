import test from 'node:test';
import assert from 'node:assert/strict';
import { generateGrid, resolveRound } from './game-engine.mjs';
const losing = ['orange', 'coin', 'gem', 'coin', 'lantern', 'orange', 'lantern', 'ingot', 'coin'];
test('a losing round charges only the total bet once', () => {
  const result = resolveRound(losing, 10, 1000);
  assert.equal(result.payout, 0);
  assert.equal(result.balance, 990);
  assert.deepEqual(result.winningLines, []);
});
test('all six symbols pay the displayed multiplier on the per-line stake', () => {
  for (const [symbol, expected] of [['tiger', 100], ['gem', 40], ['ingot', 30], ['coin', 20], ['lantern', 10], ['orange', 6]]) {
    const result = resolveRound([symbol, symbol, symbol, ...losing.slice(3)], 10, 1000);
    assert.equal(result.winningLines[0].payout, expected, symbol);
  }
});
test('tiger substitutes for regular symbols, while three tigers pay their own prize', () => {
  const result = resolveRound(['coin', 'tiger', 'coin', 'gem', 'orange', 'lantern', 'lantern', 'ingot', 'orange'], 10, 1000);
  assert.equal(result.payout, 20);
  assert.equal(result.winningLines[0].symbol, 'coin');
});
test('both diagonals are active and pay independently', () => {
  const result = resolveRound(['coin', 'gem', 'coin', 'lantern', 'coin', 'orange', 'coin', 'ingot', 'coin'], 10, 1000);
  assert.equal(result.payout, 40);
  assert.deepEqual(result.winningLines.map(line => line.index), [3, 4]);
  assert.equal(result.balance, 1030);
});
test('multiple lines add prizes with no extra charge', () => {
  const result = resolveRound(['coin', 'coin', 'coin', 'orange', 'orange', 'orange', 'gem', 'gem', 'gem'], 10, 1000);
  assert.equal(result.payout, 66);
  assert.equal(result.balance, 1056);
  assert.equal(result.multiplier, 1);
});
test('full board multiplies the summed five-line prize by ten, including wild substitution', () => {
  const result = resolveRound(Array(9).fill('orange'), 10, 1000);
  assert.equal(result.basePayout, 30);
  assert.equal(result.multiplier, 10);
  assert.equal(result.payout, 300);
  assert.equal(result.balance, 1290);
  const grid = Array(9).fill('orange'); grid[4] = 'tiger';
  assert.equal(resolveRound(grid, 10, 1000).payout, 300);
  const allWild = resolveRound(Array(9).fill('tiger'), 10, 1000);
  assert.equal(allWild.payout, 5000);
});
test('mixed non-wild symbols do not trigger the full-board bonus', () => {
  assert.equal(resolveRound(['coin', 'coin', 'coin', 'gem', 'gem', 'gem', 'orange', 'orange', 'orange'], 5, 1000).multiplier, 1);
});
test('zero balance, insufficient funds, invalid stake and malformed grids are handled', () => {
  assert.equal(resolveRound(losing, 10, 10).balance, 0);
  for (const [bet, balance] of [[10, 9], [-10, 1000], [10, NaN], [2, 1000]]) assert.throws(() => resolveRound(losing, bet, balance), RangeError);
  for (const grid of [null, [], Array(9), Array(9).fill('bad')]) assert.throws(() => resolveRound(grid, 10, 1000), RangeError);
});
test('weighted sampling reaches every documented symbol and rejects invalid randomness', () => {
  for (const [random, symbol] of [[0, 'tiger'], [.019, 'tiger'], [.02, 'gem'], [.12, 'ingot'], [.25, 'coin'], [.45, 'lantern'], [.70, 'orange'], [.999, 'orange']]) assert.deepEqual(generateGrid(() => random), Array(9).fill(symbol));
  for (const value of [-1, 1, NaN]) assert.throws(() => generateGrid(() => value), RangeError);
});
