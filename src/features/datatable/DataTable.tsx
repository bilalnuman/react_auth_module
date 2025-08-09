import React from 'react';
import { type Column, useDataTable, type DataTableProps } from '../../hooks/useDataTable';
import styles from './DataTable.module.css';

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  options = {},
  loading = false,
  onSelectionChange,
  className = '',
  paginationComponent,
}: DataTableProps<T>) {
  const {
    currentItems,
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
    getItemId,
  } = useDataTable(data, options);

 
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

    
    if (!isSorted) return '↕️';
    return direction === 'asc' ? '↑' : '↓';
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

      
      {paginationComponent && (
        <div className={styles.paginationWrapper}>
          {paginationComponent}
        </div>
      )}

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
