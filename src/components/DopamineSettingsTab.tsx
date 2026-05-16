import { useState } from 'react';
import { RotateCcw, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DopamineSettingsTabProps {
  onDownload: () => void;
  onUpload: () => void;
  onReset: () => void;
}

export function DopamineSettingsTab({
  onDownload,
  onUpload,
  onReset,
}: DopamineSettingsTabProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-2">Settings</h2>
        <p className="text-xs text-muted-foreground">Manage your dopamine menu</p>
      </div>

      <div className="pt-4 border-t border-border flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-muted-foreground"
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download backup
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-muted-foreground"
            onClick={onUpload}
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Restore backup
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={cn('w-full', confirmReset ? 'text-red-400 border-red-400/50' : 'text-muted-foreground')}
          onClick={handleReset}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          {confirmReset ? 'Tap again to confirm' : 'Reset to defaults'}
        </Button>
      </div>
    </div>
  );
}
