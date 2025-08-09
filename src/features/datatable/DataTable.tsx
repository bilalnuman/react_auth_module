import React from 'react';
import { type Column, useDataTable, type DataTableProps } from '../../hooks/useDataTable';
import styles from './DataTable.module.css';

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  options = {},
  loading = false,
  onSelectionChange,
  className = ''
}: DataTableProps<T>) {
  const {
    currentItems,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    sortKey,
    sortDirection,
    handleSort,
    selectedItems,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate,
    getItemId
  } = useDataTable(data, options);

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }, [selectedItems, onSelectionChange]);

  const getSortIcon = (column: Column<T>) => {
    const isSorted = sortKey === column.key;
    const direction = isSorted ? sortDirection : null;

    if (column.getSortIcon) {
      return column.getSortIcon(direction);
    }

    // Fallback default icons
    if (!isSorted) return '↕️';
    return direction === 'asc' ? '↑' : '↓';
  };


  const renderPaginationInfo = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `${start}-${end} of ${totalItems}`;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  if (loading && data.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {options.enableSelection && (
                <th className={styles.checkboxColumn}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={() => isAllSelected ? clearSelection() : selectAll()}
                    disabled={loading}
                    className={styles.checkbox}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={String(column.key)} className={styles.th}>
                  {column.sortable !== false ? (
                    <button
                      className={styles.sortButton}
                      onClick={() => handleSort(column.key)}
                      disabled={loading}
                    >
                      <span>{column.label}</span>
                      <span className={styles.sortIcon}>
                        {getSortIcon(column)}
                      </span>
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (options.enableSelection ? 1 : 0)}
                  className={styles.emptyCell}
                >
                  No data available
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const id = getItemId(item);
                return (
                  <tr
                    key={String(id)}
                    className={`${styles.row} ${isSelected(id) ? styles.selectedRow : ''}`}
                  >
                    {options.enableSelection && (
                      <td className={styles.checkboxColumn}>
                        <input
                          type="checkbox"
                          checked={isSelected(id)}
                          onChange={() => toggleSelection(id)}
                          disabled={loading}
                          className={styles.checkbox}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={String(column.key)} className={styles.td}>
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            {renderPaginationInfo()}
          </div>

          <div className={styles.paginationControls}>
            <button
              onClick={prevPage}
              disabled={!canGoPrev || loading}
              className={styles.navButton}
            >
              ← Previous
            </button>

            {renderPaginationButtons()}

            <button
              onClick={nextPage}
              disabled={!canGoNext || loading}
              className={styles.navButton}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {options.enableSelection && selectedItems.size > 0 && (
        <div className={styles.selectionSummary}>
          <span>{selectedItems.size} item(s) selected</span>
          <button
            onClick={clearSelection}
            className={styles.clearButton}
            disabled={loading}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;