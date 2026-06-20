import { useMemo, useState } from 'react';
import { checkInRecords, checkInStats, checkInStatusOptions, checkInStatusStyles, checkInTypeOptions } from '../models/checkInListModel';

export const useCheckInListController = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredRecords = useMemo(() => {
    return checkInRecords.filter((item) => {
      const haystack = `${item.id} ${item.tenant} ${item.property} ${item.assigned}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesType = typeFilter === 'All' || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  return {
    records: checkInRecords,
    stats: checkInStats,
    statusStyles: checkInStatusStyles,
    statusOptions: checkInStatusOptions,
    typeOptions: checkInTypeOptions,
    filteredRecords,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
  };
};
