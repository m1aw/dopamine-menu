/**
 * Streak-bonus strategy behaviour by status:
 *
 * | Status  | Points        | Streak effect                          |
 * |---------|---------------|----------------------------------------|
 * | checked | Full + bonus  | Increments streak count                |
 * | half    | 50%, no bonus | Transparent (bridges, doesn't count)   |
 * | skipped | 0             | Transparent (bridges, doesn't count)   |
 * | failed  | 0             | Resets streak                          |
 * | clear   | —             | Resets streak                          |
 *
 * "Transparent" means the walk continues past the day when computing
 * streak length, so checked → skipped → checked gives streak = 2.
 */

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
  it('awards 50% points', () => {
    const result = calculate(habit, [completion(0, 'half')], 0, '2024-W01');
    expect(result.base).toBe(5);
    expect(result.streakBonus).toBe(0);
    expect(result.total).toBe(5);
  });

  it('is transparent: checked → half → checked bridges the streak', () => {
    const completions = [
      completion(0, 'checked'),
      completion(1, 'half'),
      completion(2, 'checked'),
    ];
    // half on day 1 doesn't count toward or against the streak; streak = 2 checked days
    const result = calculate(habit, completions, 2, '2024-W01');
    expect(result.streakLength).toBe(2);
    expect(result.multiplier).toBe(1.25);
  });

  it('does not increment the streak on its own', () => {
    // Only half days — no checked days so streak = 0
    const completions = [completion(0, 'half'), completion(1, 'half'), completion(2, 'checked')];
    const result = calculate(habit, completions, 2, '2024-W01');
    expect(result.streakLength).toBe(1); // only the 1 checked day counts
  });
});

describe('failed', () => {
  it('awards 0 points', () => {
    const result = calculate(habit, [completion(0, 'failed')], 0, '2024-W01');
    expect(result.total).toBe(0);
  });

  it('resets the streak: checked after failed gets no bonus', () => {
    const completions = [completion(0, 'failed'), completion(1, 'checked')];
    const result = calculate(habit, completions, 1, '2024-W01');
    expect(result.streakLength).toBe(1);
    expect(result.streakBonus).toBe(0);
  });
});

describe('clear (no completion record)', () => {
  it('resets the streak: checked after clear gets no bonus', () => {
    // day 0 has no record (clear); day 1 is checked
    const result = calculate(habit, [completion(1, 'checked')], 1, '2024-W01');
    expect(result.streakLength).toBe(1);
    expect(result.streakBonus).toBe(0);
  });
});

describe('skipped (N/A day)', () => {
  it('awards 0 points', () => {
    const result = calculate(habit, [completion(0, 'skipped')], 0, '2024-W01');
    expect(result.total).toBe(0);
  });

  it('is transparent: checked → skipped → checked bridges the streak', () => {
    const completions = [
      completion(0, 'checked'),
      completion(1, 'skipped'),
      completion(2, 'checked'),
    ];
    // skipped on day 1 is transparent; streak = 2 checked days (days 0 and 2)
    const result = calculate(habit, completions, 2, '2024-W01');
    expect(result.streakLength).toBe(2);
    expect(result.multiplier).toBe(1.25);
  });

  it('does not increment the streak on its own', () => {
    // Only skipped days before the checked day — streak = 1 (only day 2 is checked)
    const completions = [
      completion(0, 'skipped'),
      completion(1, 'skipped'),
      completion(2, 'checked'),
    ];
    const result = calculate(habit, completions, 2, '2024-W01');
    expect(result.streakLength).toBe(1);
  });

  it('is still stopped by a failed day before it', () => {
    const completions = [
      completion(0, 'failed'),
      completion(1, 'skipped'),
      completion(2, 'checked'),
    ];
    // Walk: day 2 checked (+1), day 1 skipped (transparent), day 0 failed (STOP) → streak = 1
    const result = calculate(habit, completions, 2, '2024-W01');
    expect(result.streakLength).toBe(1);
  });

  it('clear cell (no completion record) is treated as checked for backwards-compat', () => {
    const result = calculate(habit, [], 0, '2024-W01');
    expect(result.total).toBe(10);
  });
});
