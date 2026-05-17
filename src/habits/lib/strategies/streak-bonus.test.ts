import { describe, it, expect } from 'vitest';
import { streakBonusStrategy } from './streak-bonus';
import type { Habit, Completion } from '@/habits/types';

const habit: Habit = {
  id: 'h1',
  name: 'Test Habit',
  basePoints: 10,
  color: 'emerald',
  emoji: '✅',
  archived: false,
  createdAt: '2024-01-01',
  sortOrder: 0,
};

function completion(day: number, status: Completion['status'], weekKey = '2024-W01'): Completion {
  return { habitId: 'h1', weekKey, day, completedAt: '2024-01-01', status };
}

const { calculate } = streakBonusStrategy;

describe('checked', () => {
  it('awards base points with no streak bonus on day 1', () => {
    const result = calculate(habit, [completion(0, 'checked')], 0, '2024-W01');
    expect(result.base).toBe(10);
    expect(result.streakBonus).toBe(0);
    expect(result.total).toBe(10);
  });

  it('applies streak bonus after 2 consecutive checked days', () => {
    const completions = [completion(0, 'checked'), completion(1, 'checked')];
    const result = calculate(habit, completions, 1, '2024-W01');
    expect(result.streakLength).toBe(2);
    expect(result.multiplier).toBe(1.25);
    expect(result.total).toBe(13); // round(10 * 1.25) = 13
  });
});

describe('half', () => {
  it('awards 50% points with no streak contribution', () => {
    const result = calculate(habit, [completion(0, 'half')], 0, '2024-W01');
    expect(result.base).toBe(5);
    expect(result.streakBonus).toBe(0);
    expect(result.total).toBe(5);
  });
});

describe('failed', () => {
  it('awards 0 points', () => {
    const result = calculate(habit, [completion(0, 'failed')], 0, '2024-W01');
    expect(result.total).toBe(0);
  });

  it('breaks the streak: checked after failed gets no bonus', () => {
    const completions = [completion(0, 'failed'), completion(1, 'checked')];
    const result = calculate(habit, completions, 1, '2024-W01');
    expect(result.streakLength).toBe(1);
    expect(result.streakBonus).toBe(0);
  });
});

describe('skipped (N/A day)', () => {
  it('awards 0 points', () => {
    const result = calculate(habit, [completion(0, 'skipped')], 0, '2024-W01');
    expect(result.total).toBe(0);
  });

  it('preserves the streak: checked → skipped → checked earns streak bonus', () => {
    const completions = [
      completion(0, 'checked'),
      completion(1, 'skipped'),
      completion(2, 'checked'),
    ];
    // Day 2 has a 3-day streak (0 checked, 1 skipped, 2 checked all preserve)
    const result = calculate(habit, completions, 2, '2024-W01');
    expect(result.streakLength).toBe(3);
    expect(result.multiplier).toBe(1.25);
    expect(result.total).toBeGreaterThan(10);
  });

  it('counts skipped as streak-preserving even after a failed day', () => {
    const completions = [
      completion(0, 'failed'),
      completion(1, 'skipped'),
      completion(2, 'checked'),
    ];
    const result = calculate(habit, completions, 2, '2024-W01');
    // failed at day 0 breaks the streak; days 1 (skipped) + 2 (checked) are
    // both streak-preserving, so streak = 2
    expect(result.streakLength).toBe(2);
  });

  it('clear cell (no completion record) is treated as checked for backwards-compat', () => {
    // No completion stored for day 0 — calculate defaults status to 'checked'
    const result = calculate(habit, [], 0, '2024-W01');
    expect(result.total).toBe(10);
  });
});
