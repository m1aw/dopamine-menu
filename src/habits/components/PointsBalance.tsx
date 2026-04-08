interface PointsBalanceProps {
  balance: number;
  earned: number;
  spent: number;
}

export function PointsBalance({ balance, earned, spent }: PointsBalanceProps) {
  return (
    <div className="text-center py-4">
      <div className="text-3xl font-bold text-foreground tabular-nums">{balance}</div>
      <div className="text-xs text-muted-foreground mt-1">points available</div>
      <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{earned} earned</span>
        <span className="tabular-nums">{spent} spent</span>
      </div>
    </div>
  );
}
