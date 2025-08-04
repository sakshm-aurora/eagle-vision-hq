import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TopNavProps {
  onToggleSidebar: () => void;
  onToggleNotifications: () => void;
  sidebarCollapsed: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  onToggleSidebar, 
  onToggleNotifications,
  sidebarCollapsed 
}) => {
  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Eagle's Eye</span>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search batches, inventory, reports..."
            className="pl-10 bg-secondary border-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleNotifications}
          className="relative hover:bg-secondary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>John Doe</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Factory Manager
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};