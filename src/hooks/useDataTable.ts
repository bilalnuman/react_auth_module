import { useState, useMemo, useCallback } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface DataTableOptions {
  itemsPerPage?: number;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  enableSelection?: boolean;
}

export interface UseDataTableReturn<T> {
  // Data
  currentItems: T[];
  totalItems: number;
  totalPages: number;
  
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  
  // Sorting
  sortKey: keyof T | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (key: keyof T) => void;
  
  // Selection
  selectedItems: Set<string | number>;
  isSelected: (id: string | number) => boolean;
  toggleSelection: (id: string | number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  
  // Utility
  getItemId: (item: T) => string | number;
}

export function useDataTable<T extends Record<string, any>>(
  data: T[],
  options: DataTableOptions = {}
): UseDataTableReturn<T> {
  const {
    itemsPerPage = 10,
    defaultSortKey = null,
    defaultSortDirection = 'asc',
    enableSelection = false
  } = options;

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSortKey as keyof T);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());

  // Get unique ID for each item (assumes 'id' field exists)
  const getItemId = useCallback((item: T): string | number => {
    return item.id || JSON.stringify(item);
  }, []);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedData.slice(startIndex, endIndex);

  // Pagination functions
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  // Sorting functions
  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey]);

  // Selection functions
  const isSelected = useCallback((id: string | number) => {
    return selectedItems.has(id);
  }, [selectedItems]);

  const toggleSelection = useCallback((id: string | number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = new Set(currentItems.map(getItemId));
    setSelectedItems(allIds);
  }, [currentItems, getItemId]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  // Selection state calculations
  const currentItemIds = new Set(currentItems.map(getItemId));
  const selectedCurrentItems = Array.from(selectedItems).filter(id => currentItemIds.has(id));
  const isAllSelected = currentItems.length > 0 && selectedCurrentItems.length === currentItems.length;
  const isIndeterminate = selectedCurrentItems.length > 0 && selectedCurrentItems.length < currentItems.length;

  // Reset page when data changes
  useState(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  });

  return {
    // Data
    currentItems,
    totalItems,
    totalPages,
    
    // Pagination
    currentPage,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    
    // Sorting
    sortKey,
    sortDirection,
    handleSort,
    
    // Selection
    selectedItems,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate,
    
    // Utility
    getItemId
  };
}