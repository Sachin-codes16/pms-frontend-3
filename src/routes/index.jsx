import React from "react";
import { lazy } from "react";

// --- Sidebar Routes ---
const Dashboard = lazy(
  () => import("../app/(admin)/dashboards/analytics/page.jsx"),
);
const PropertyDashboard = lazy(
  () => import("../app/(admin)/property/property-dashboard/page.jsx"),
);
const PropertyGridPage = lazy(
  () => import("../app/(admin)/property/Properties/page.jsx"),
);
const PropertyAddPage = lazy(
  () => import("../app/(admin)/property/add/page.jsx"),
);
const PropertyDetailsPage = lazy(
  () => import("../app/(admin)/property/details/page.jsx"),
);

const CheckInDashboard = lazy(
  () => import("../app/(admin)/check-in/dashboard/page.jsx"),
);
const CheckInList = lazy(
  () => import("../app/(admin)/check-in/check-in-list/page.jsx"),
);
const CheckInStart = lazy(
  () => import("../app/(admin)/check-in/start/page.jsx"),
);
const CheckInInformation = lazy(
  () => import("../app/(admin)/check-in/check-in-information/page.jsx"),
);

const CheckOutDashboard = lazy(
  () => import("../app/(admin)/check-out/dashboard/page.jsx"),
);
const CheckOutList = lazy(
  () => import("../app/(admin)/check-out/list/page.jsx"),
);
const CheckOutStart = lazy(
  () => import("../app/(admin)/check-out/start/page.jsx"),
);
const CheckOutDetails = lazy(
  () => import("../app/(admin)/check-out/details/page.jsx"),
);

const FacilitiesMaster = lazy(
  () => import("../app/(admin)/facilities/page.jsx"),
);
const ChatPage = lazy(() => import("../app/(admin)/messages/page.jsx"));

const RentalReports = lazy(
  () => import("../app/(admin)/reports/rental/page.jsx"),
);
const OccupancyReport = lazy(
  () => import("../app/(admin)/reports/occupancy/page.jsx"),
);

// Agent Routes
const AgentList = lazy(() => import("../app/agents/list-view/page.jsx"));
const AgentDetails = lazy(() => import("../app/agents/details/page.jsx"));
const AgentGrid = lazy(() => import("../app/agents/grid-view/page.jsx"));

// Auth & Other
const Navigate = React.lazy(() =>
  import("react-router-dom").then((module) => ({ default: module.Navigate })),
);
const ComingSoon = lazy(() => import("@/app/(other)/coming-soon/page"));
const Maintenance = lazy(() => import("@/app/(other)/maintenance/page"));
const Error404 = lazy(
  () => import("@/app/(other)/(error-pages)/404-error/page"),
);
const ProfileSettingPage = lazy(
  () =>
    import(
      "../components/layout/TopNavigationBar/components/ProfileSettingPage.jsx"
    ),
);
const SignInPage = lazy(() => import("@/app/auth/sign-in/page.jsx"));
const SignUpPage = lazy(() => import("@/app/auth/sign-up/page.jsx"));

const initialRoutes = [
  {
    path: "/",
    name: "root",
    element: <Navigate to="/auth/sign-in" />,
  },
];

const routes = [
  { path: "/dashboards", name: "Dashboard", element: <Dashboard /> },
  {
    path: "/property-dashboard",
    name: "Property Dashboard",
    element: <PropertyDashboard />,
  },
  {
    path: "/landlord/property-grid",
    name: "Properties",
    element: <PropertyGridPage />,
  },
  {
    path: "/landlord/add-property",
    name: "Add Property",
    element: <PropertyAddPage />,
  },
  {
    path: "/landlord/detailspage",
    name: "Property Details",
    element: <PropertyDetailsPage />,
  },

  {
    path: "/check-in-dashboard",
    name: "Check-In Dashboard",
    element: <CheckInDashboard />,
  },
  { path: "/check-in-list", name: "Check-In List", element: <CheckInList /> },
  {
    path: "/check-in-start",
    name: "Check-In Start",
    element: <CheckInStart />,
  },
  {
    path: "/check-in-information",
    name: "Check-In Information",
    element: <CheckInInformation />,
  },

  {
    path: "/check-out-dashboard",
    name: "Check-Out Dashboard",
    element: <CheckOutDashboard />,
  },
  {
    path: "/check-out-list",
    name: "Check-Out List",
    element: <CheckOutList />,
  },
  {
    path: "/check-out-start",
    name: "Check-Out Start",
    element: <CheckOutStart />,
  },
  {
    path: "/check-out-details",
    name: "Check-Out Details",
    element: <CheckOutDetails />,
  },

  {
    path: "/facilities-master",
    name: "Facilities Master",
    element: <FacilitiesMaster />,
  },
  { path: "/messages", name: "Messages", element: <ChatPage /> },

  {
    path: "/rental-reports",
    name: "Rental Reports",
    element: <RentalReports />,
  },
  {
    path: "/occupancy-report",
    name: "Occupancy Report",
    element: <OccupancyReport />,
  },

  // Agent Routes
  { path: "/agents/list-view", name: "Agent List", element: <AgentList /> },
  { path: "/agents/details", name: "Agent Details", element: <AgentDetails /> },
  { path: "/agents/grid-view", name: "Agent Grid", element: <AgentGrid /> },

  // Header options
  {
    path: "/profile-setting",
    name: "Profile Setting",
    element: <ProfileSettingPage />,
  },
];

export const authRoutes = [
  { name: "Sign In", path: "/auth/sign-in", element: <SignInPage /> },
  { name: "Sign Up", path: "/auth/sign-up", element: <SignUpPage /> },
  { name: "404 Error", path: "/404-error", element: <Error404 /> },
  { name: "Maintenance", path: "/maintenance", element: <Maintenance /> },
  { name: "Coming Soon", path: "/coming-soon", element: <ComingSoon /> },
];

export const appRoutes = [...initialRoutes, ...routes, ...authRoutes];
