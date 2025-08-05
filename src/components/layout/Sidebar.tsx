import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  DollarSign, 
  FileText, 
  Settings,
  MapPin,
  ClipboardList,
  Users,
  Calendar,
  Layers,
  GitMerge,
  CheckCircle,
  GitBranch,
  User,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
}

const menuItems = [
  { 
    title: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard,
    exact: true 
  },
  {
    title: 'Map',
    path: '/map',
    icon: MapPin,
  },
  {
    title: 'Purchase Orders',
    path: '/purchase-orders',
    icon: ClipboardList,
  },
  {
    title: 'Vendors',
    path: '/vendors',
    icon: Users,
  },
  {
    title: 'Resources',
    path: '/resources',
    icon: Calendar,
  },
  {
    title: 'BOM',
    path: '/bom',
    icon: Layers,
  },
  {
    title: 'Changes',
    path: '/changes',
    icon: GitMerge,
  },
  {
    title: 'QA Logs',
    path: '/qa-logs',
    icon: CheckCircle,
  },
  {
    title: 'Dependencies',
    path: '/dependencies',
    icon: GitBranch,
  },
  {
    title: 'Timeline',
    path: '/timeline',
    icon: Calendar,
  },
  {
    title: 'Kanban',
    path: '/kanban',
    icon: Layers,
  },
  { 
    title: 'Batches', 
    path: '/batches', 
    icon: Package 
  },
  { 
    title: 'Inventory', 
    path: '/inventory', 
    icon: Warehouse 
  },
  { 
    title: 'Costs', 
    path: '/costs', 
    icon: DollarSign 
  },
  { 
    title: 'Reports', 
    path: '/reports', 
    icon: FileText 
  },
  { 
    title: 'Settings', 
    path: '/settings', 
    icon: Settings 
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  
  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "bg-card border-r transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/*
        Wrap the navigation in an overflow container. When the list of menu
        items grows beyond the viewport height this allows users to scroll
        independently within the sidebar. Without this the list would be
        clipped and inaccessible on smaller displays.
      */}
      <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                "hover:bg-secondary hover:text-foreground",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};