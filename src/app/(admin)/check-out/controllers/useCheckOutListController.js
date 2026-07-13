import { useMemo, useState } from 'react';
import { checkOutListRecords, checkOutStatusOptions } from '../models/checkOutListModel';

export const useCheckOutListController = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRecords = useMemo(() => {
    return checkOutListRecords.filter((record) => {
      const matchesSearch =
        record.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return {
    records: checkOutListRecords,
    filteredRecords,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusOptions: checkOutStatusOptions,
  };
};
