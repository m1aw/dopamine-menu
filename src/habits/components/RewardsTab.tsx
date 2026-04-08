import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PointsBalance } from './PointsBalance';
import { RewardCard } from './RewardCard';
import { RewardFormDialog } from './RewardFormDialog';
import type { Reward, Redemption } from '@/habits/types';

interface RewardsTabProps {
  rewards: Reward[];
  redemptions: Redemption[];
  pointsBalance: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  onAddReward: (r: Omit<Reward, 'id' | 'createdAt'>) => void;
  onUpdateReward: (id: string, updates: Partial<Omit<Reward, 'id'>>) => void;
  onDeleteReward: (id: string) => void;
  onRedeem: (rewardId: string) => boolean;
}

export function RewardsTab({
  rewards,
  redemptions,
  pointsBalance,
  totalPointsEarned,
  totalPointsSpent,
  onAddReward,
  onUpdateReward,
  onDeleteReward,
  onRedeem,
}: RewardsTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const handleAdd = () => {
    setEditingReward(null);
    setFormOpen(true);
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormOpen(true);
  };

  const handleSave = (data: Omit<Reward, 'id' | 'createdAt'>) => {
    if (editingReward) {
      onUpdateReward(editingReward.id, data);
    } else {
      onAddReward(data);
    }
  };

  return (
    <div className="space-y-4">
      <PointsBalance
        balance={pointsBalance}
        earned={totalPointsEarned}
        spent={totalPointsSpent}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Rewards</h3>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add reward
        </Button>
      </div>

      {rewards.length === 0 && (
        <p className="text-sm text-muted-foreground">No rewards yet. Add one to spend your points on.</p>
      )}

      <div className="space-y-2">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            canAfford={pointsBalance >= reward.cost}
            onRedeem={() => onRedeem(reward.id)}
            onEdit={() => handleEdit(reward)}
            onDelete={() => onDeleteReward(reward.id)}
          />
        ))}
      </div>

      {redemptions.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Recent redemptions</h4>
          <div className="space-y-1">
            {redemptions.slice(-10).reverse().map((r) => (
              <div key={r.id} className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.rewardName}</span>
                <span className="tabular-nums">-{r.cost} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <RewardFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialReward={editingReward}
        onSave={handleSave}
      />
    </div>
  );
}
