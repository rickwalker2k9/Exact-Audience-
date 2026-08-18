import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Campaigns from "./pages/Campaigns";
import Home from "./pages/Home";
import LamborghiniDashboard from "./pages/LamborghiniDashboard";
import WarbyDashboard from "./pages/WarbyDashboard";
import PolicyGeniusDashboard from "./pages/PolicyGeniusDashboard";
import CampaignPlaceholder from "./pages/CampaignPlaceholder";
import BuyerProfilePage from "./pages/BuyerProfilePage";
import BreezeLeadPortal, { BreezeStaffLeads } from "./pages/BreezeLeadPortal";
import LandRoverDashboard from "./pages/LandRoverDashboard";
import BarrettDashboard from "./pages/BarrettDashboard";
import NeuroCatchDashboard from "./pages/NeuroCatchDashboard";
import SymCheckDashboard from "@/pages/SymCheckDashboard";
import InterMedDashboard from "./pages/InterMedDashboard";
import ImagineAgencyDashboard from "./pages/ImagineAgencyDashboard";
import MogulDashboard from "./pages/MogulDashboard";
import LitehouseHealthDashboard from "./pages/LitehouseHealthDashboard";
import ProdromeDashboard from "./pages/ProdromeDashboard";
import CharlieHatcherDashboard from "./pages/CharlieHatcherGeneralDashboard";
import BreezeClientPortal from "./pages/BreezeClientPortal";
import BreezeClientAccessReport from "./pages/BreezeClientAccessReport";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Campaign directory — post-login home */}
      <Route path="/campaigns" component={Campaigns} />

      {/* Full dashboards */}
      <Route path="/" component={Home} />
      <Route path="/lamborghini" component={LamborghiniDashboard} />
      <Route path="/warby-parker" component={WarbyDashboard} />
      <Route path="/policygenius" component={PolicyGeniusDashboard} />
      <Route path="/breeze-client" component={BreezeClientPortal} />
      <Route path="/breeze-client-access" component={BreezeClientAccessReport} />
      <Route path="/breeze-insurance/staff" component={BreezeStaffLeads} />
      <Route path="/breeze-insurance" component={() => <BreezeLeadPortal />} />
      <Route path="/land-rover" component={LandRoverDashboard} />
      <Route path="/barrett-financial" component={BarrettDashboard} />
      <Route path="/neurocatch" component={NeuroCatchDashboard} />
      <Route path="/intermed-healthtrust" component={InterMedDashboard} />
      <Route path="/symcheck" component={SymCheckDashboard} />
        <Route path="/intermed" component={InterMedDashboard} />
      <Route path="/imagine-agency" component={ImagineAgencyDashboard} />
      <Route path="/mogul" component={MogulDashboard} />
      <Route path="/litehouse" component={LitehouseHealthDashboard} />
      <Route path="/prodrome" component={ProdromeDashboard} />
      <Route path="/charlie-hatcher" component={CharlieHatcherDashboard} />

      {/* Placeholder for campaigns without a full dashboard */}
      <Route path="/campaign/:slug" component={CampaignPlaceholder} />

      {/* Buyer profile detail pages */}
      <Route path="/buyer/:id" component={BuyerProfilePage} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
