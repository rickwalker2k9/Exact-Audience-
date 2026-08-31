import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Route-level code splitting keeps the initial Railway payload focused on the requested portal.
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Home = lazy(() => import("./pages/Home"));
const LamborghiniDashboard = lazy(() => import("./pages/LamborghiniDashboard"));
const WarbyDashboard = lazy(() => import("./pages/WarbyDashboard"));
const PolicyGeniusDashboard = lazy(() => import("./pages/PolicyGeniusDashboard"));
const CampaignPlaceholder = lazy(() => import("./pages/CampaignPlaceholder"));
const BuyerProfilePage = lazy(() => import("./pages/BuyerProfilePage"));
const BreezeLeadPortal = lazy(() => import("./pages/BreezeLeadPortal"));
const BreezeStaffLeads = lazy(() => import("./pages/BreezeLeadPortal").then(module => ({ default: module.BreezeStaffLeads })));
const LandRoverDashboard = lazy(() => import("./pages/LandRoverDashboard"));
const BarrettDashboard = lazy(() => import("./pages/BarrettDashboard"));
const NeuroCatchDashboard = lazy(() => import("./pages/NeuroCatchDashboard"));
const SymCheckDashboard = lazy(() => import("@/pages/SymCheckDashboard"));
const InterMedDashboard = lazy(() => import("./pages/InterMedDashboard"));
const ImagineAgencyDashboard = lazy(() => import("./pages/ImagineAgencyDashboard"));
const MogulDashboard = lazy(() => import("./pages/MogulDashboard"));
const LitehouseHealthDashboard = lazy(() => import("./pages/LitehouseHealthDashboard"));
const ProdromeDashboard = lazy(() => import("./pages/ProdromeDashboard"));
const CharlieHatcherDashboard = lazy(() => import("./pages/CharlieHatcherGeneralDashboard"));
const BreezeClientPortal = lazy(() => import("./pages/BreezeClientPortal"));
const BreezeClientAccessReport = lazy(() => import("./pages/BreezeClientAccessReport"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteLoadingState() {
  return <div className="min-h-screen bg-black text-[#fde68a] flex items-center justify-center text-sm font-semibold tracking-[0.08em]">LOADING DASHBOARD…</div>;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<RouteLoadingState />}>
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
      <Route path="/breeze-insurance" component={() => <BreezeLeadPortal showIndividualRecords />} />
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
    </Suspense>
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
