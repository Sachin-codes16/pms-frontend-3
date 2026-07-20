import { occupancyReportFilters, occupancyReportRows, occupancyReportStats } from '../models/occupancyReportModel';

export const useOccupancyReportController = () => {
  return {
    filters: occupancyReportFilters,
    rows: occupancyReportRows,
    stats: occupancyReportStats,
  };
};
