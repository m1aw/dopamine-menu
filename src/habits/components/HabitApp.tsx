import { useState } from 'react';
import { BottomNav, type Tab } from './BottomNav';
import { GridTab } from './GridTab';
import { RewardsTab } from './RewardsTab';
import { HistoryTab } from './HistoryTab';
import { SettingsTab } from './SettingsTab';
import { useHabits } from '@/habits/hooks/useHabits';
import { downloadJson } from '@/lib/download';

export function HabitApp() {
  const [activeTab, setActiveTab] = useState<Tab>('grid');
  const {
    habits,
    allHabits,
    store,
    activeStrategy,
    getCompletionStatus,
    toggleCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    rewards,
    redemptions,
    pointsBalance,
    totalPointsEarned,
    totalPointsSpent,
    addReward,
    updateReward,
    deleteReward,
    redeemReward,
    resetAll,
  } = useHabits();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        {activeTab === 'grid' && (
          <GridTab
            habits={habits}
            completions={store.completions}
            strategy={activeStrategy}
            getCompletionStatus={getCompletionStatus}
            onToggle={toggleCompletion}
          />
        )}
        {activeTab === 'rewards' && (
          <RewardsTab
            rewards={rewards}
            redemptions={redemptions}
            pointsBalance={pointsBalance}
            totalPointsEarned={totalPointsEarned}
            totalPointsSpent={totalPointsSpent}
            onAddReward={addReward}
            onUpdateReward={updateReward}
            onDeleteReward={deleteReward}
            onRedeem={redeemReward}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab
            habits={habits}
            completions={store.completions}
            strategy={activeStrategy}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            habits={allHabits}
            onAddHabit={addHabit}
            onUpdateHabit={updateHabit}
            onDeleteHabit={deleteHabit}
            onDownload={() => downloadJson(store, `habits-backup-${new Date().toISOString().slice(0, 10)}.json`)}
            onReset={resetAll}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onSettingsClick={() => setActiveTab('settings')} />
    </div>
  );
}
