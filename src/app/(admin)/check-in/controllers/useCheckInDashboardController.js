import {
  dashboardPropertyTypes,
  dashboardRentPaymentSummary,
  dashboardStats,
  dashboardStatusColors,
  dashboardStatusOverview,
  dashboardUpcomingCheckIns,
  dashboardWorkflowSteps,
} from '../models/checkInDashboardModel';

export const useCheckInDashboardController = () => {
  return {
    propertyTypes: dashboardPropertyTypes,
    rentPaymentSummary: dashboardRentPaymentSummary,
    stats: dashboardStats,
    statusColors: dashboardStatusColors,
    statusOverview: dashboardStatusOverview,
    upcomingCheckIns: dashboardUpcomingCheckIns,
    workflowSteps: dashboardWorkflowSteps,
  };
};
