import { BackupActions } from '@/components/BackupActions';

interface DopamineSettingsTabProps {
  onDownload: () => void;
  onUpload: () => void;
  onReset: () => void;
}

export function DopamineSettingsTab({ onDownload, onUpload, onReset }: DopamineSettingsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-2">Settings</h2>
        <p className="text-xs text-muted-foreground">Manage your dopamine menu</p>
      </div>

      <BackupActions
        onDownload={onDownload}
        onUpload={onUpload}
        onReset={onReset}
      />
    </div>
  );
}
