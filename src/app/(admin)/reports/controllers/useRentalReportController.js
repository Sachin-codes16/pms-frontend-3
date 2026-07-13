import { rentalReportContent, rentalReportFilters, rentalReportRows } from '../models/rentalReportModel';

export const useRentalReportController = () => ({
  ...rentalReportContent,
  filters: rentalReportFilters,
  rows: rentalReportRows,
});
