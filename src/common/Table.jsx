import React from 'react';
import Pagination from './Pagination';

const Table = ({ columns, data, isFooter, tableRef, pageSize, setPageSize, currentPage, totalCount, onPageChange }) => {
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="card custom-card mb-4">
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <label>
              <select name="pageSize" value={pageSize} onChange={handlePageSizeChange} className="form-select">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              &nbsp;items/page
            </label>
          </div>
          <div className="col-md-6">
            <input type="search" className="form-control" placeholder="Search..." style={{ float: 'right', width: 'auto' }} />
          </div>
        </div>
        <table className="table table-bordered border-bottom" ref={tableRef}>
          <thead className="table-header">
            <tr>
              {columns?.map((column) => (
                <th key={column?.field}>{column?.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.isAction ? (
                      <>
                        <button  className="btn-sm btn-default">
                          Edit
                        </button>
                        <button  className="btn-sm btn-cancel">
                          Delete
                        </button>
                      </>
                    ) : (
                      row[column.field]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {isFooter && (
            <tfoot>
              <tr>
                <td colSpan={columns?.length} className="table-border-bottom"></td>
              </tr>
            </tfoot>
          )}
        </table>
        <div className="PaginationContainer">
          <span className="total-elements">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalCount)} of {totalCount} entries
          </span>
          <Pagination currentPage={currentPage} totalCount={totalCount} itemsPerPage={pageSize} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
};

export default Table;
