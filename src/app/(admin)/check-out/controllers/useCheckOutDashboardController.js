import {
  checkOutDashboardStats,
  checkOutOverviewCards,
  checkOutProgressSteps,
  checkOutProgressSummary,
  checkOutStatusOverview,
  pendingCheckOuts,
  upcomingCheckOuts,
} from '../models/checkOutDashboardModel';

export const useCheckOutDashboardController = () => {
  return {
    progressSteps: checkOutProgressSteps,
    progressSummary: checkOutProgressSummary,
    stats: checkOutDashboardStats,
    statusOverview: checkOutStatusOverview,
    pendingCheckOuts,
    upcomingCheckOuts,
    overviewCards: checkOutOverviewCards,
  };
};
