import { Grid3X3, Gift, CalendarDays, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type Tab = 'grid' | 'rewards' | 'history' | 'settings';

const TABS: { id: Tab; label: string; icon: typeof Grid3X3 }[] = [
  { id: 'grid', label: 'Grid', icon: Grid3X3 },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'history', label: 'History', icon: CalendarDays },
];

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onSettingsClick }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border">
      <div className="max-w-2xl mx-auto px-3">
        <div className="flex w-full gap-2 py-2 mb-safe">
          {/* Main tabs */}
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ring-offset-0',
                  isActive
                    ? 'ring-2 ring-primary/50 bg-primary/10 text-primary'
                    : 'ring-1 ring-border text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="leading-none text-[10px]">{tab.label}</span>
              </button>
            );
          })}

          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ring-offset-0',
                  'ring-1 ring-border text-muted-foreground hover:text-foreground',
                )}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="leading-none text-[10px]">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={onSettingsClick}>
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/">
                  <span>Menu</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
