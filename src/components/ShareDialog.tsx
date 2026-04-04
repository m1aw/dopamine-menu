import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Menu } from '../types';
import { encodeMenuToUrl } from '../lib/share';
import { cn } from '../lib/utils';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: Menu;
  sharedMenu?: Menu | null;
  onImportShared?: () => void;
}

export function ShareDialog({ open, onOpenChange, menu, sharedMenu, onImportShared }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeMenuToUrl(menu);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the input
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      input?.select();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share your menu</DialogTitle>
          <DialogDescription>
            Anyone with this link can view and clone your Dopamine Menu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Share link</label>
            <div className="flex gap-2">
              <Input
                id="share-url-input"
                value={shareUrl}
                readOnly
                className="text-xs text-muted-foreground"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                size="icon"
                variant={copied ? 'secondary' : 'default'}
                onClick={handleCopy}
                className={cn(
                  'flex-shrink-0 transition-all',
                  copied && 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-emerald-400 animate-fade-in">Copied to clipboard!</p>
            )}
          </div>

          <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 space-y-1">
            <p className="font-medium text-foreground">How sharing works:</p>
            <p>Your entire menu is encoded into the URL — no account or backend needed. The link contains all your items.</p>
          </div>

          {/* Cloning a shared menu */}
          {sharedMenu && onImportShared && (
            <div className="border border-violet-500/30 bg-violet-500/10 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-violet-300">Someone shared a menu with you!</p>
              <p className="text-xs text-muted-foreground">
                Import it to replace your current menu, or close to keep yours.
              </p>
              <Button
                className="w-full gap-2 bg-violet-500/30 hover:bg-violet-500/40 text-violet-200 border border-violet-500/40"
                variant="outline"
                onClick={() => {
                  onImportShared();
                  onOpenChange(false);
                }}
              >
                <Download className="h-4 w-4" />
                Clone this menu
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
