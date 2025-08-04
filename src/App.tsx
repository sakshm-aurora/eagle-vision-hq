import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import Inventory from "./pages/Inventory";
import Costs from "./pages/Costs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Map from "./pages/Map";
import Alerts from "./pages/Alerts";
import PurchaseOrders from "./pages/PurchaseOrders";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import Resources from "./pages/Resources";
import Bom from "./pages/Bom";
import Changes from "./pages/Changes";
import QALogs from "./pages/QALogs";
import DependenciesPage from "./pages/Dependencies";
import CustomerPortal from "./pages/CustomerPortal";
import NotFound from "./pages/NotFound";
import Timeline from "./pages/Timeline";
import Kanban from "./pages/Kanban";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<Map />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:id" element={<VendorDetail />} />
            <Route path="resources" element={<Resources />} />
            <Route path="bom" element={<Bom />} />
            <Route path="changes" element={<Changes />} />
            <Route path="qa-logs" element={<QALogs />} />
            <Route path="dependencies" element={<DependenciesPage />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="customer/:id" element={<CustomerPortal />} />
            <Route path="batches" element={<Batches />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="costs" element={<Costs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
