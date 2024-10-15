import React from 'react';
import Pagination from './Pagination';
import Moment from 'moment';

const Table = ({
  columns,
  data,
  tableRef,
  pageSize,
  setPageSize,
  currentPage,
  totalCount,
  onPageChange,
  handleSearchChange,
  closing_balance,
  handleEdit,
  handleView,
  showDateFilters,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  handleSubmit,
}) => {
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const renderCellContent = (column, row) => {
    const formatAmount = (value) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    if (column.isAction) {
      return (
        <>
          {column.actionButtons?.map((button, index) => (
            <button
              key={index}
              className={`btn-sm ${button.className}`}
              style={button.className === 'btn-default' ? { marginBottom: '5px' } : {}}
              onClick={() => {
                if (button.name === 'Edit') {
                  handleEdit(row);
                } else if (button.name === "View Ledger Entries") {
                  handleView(row);
                }
              }}
            >
              {button.name}
            </button>
          ))}
        </>
      );
    }

    switch (column.field) {
      case 'invoice_combined':
        return row.invoice_prefix == null ? `${row.invoice_number}` : `${row.invoice_prefix}${row.invoice_number}`;
      case 'debit_note_date':
      case 'quotation_combined':
         if (row.quotation_prefix==null)return`${row.quotation_date}`
       return `${row.quotation_prefix}${row.quotation_date}`;
      case 'added_on':
      case 'date_added':
      case 'payment_date':
      case 'invoice_date':
        return Moment(row[column.field]).format('DD-MM-YYYY');
      case 'dr':
        return Number(row[column.field]) === 0 ? '' : <span className="text-danger">{formatAmount(row[column.field])}</span>;
      case 'cr':
        return Number(row[column.field]) === 0 ? '' : <span className="text-success">{formatAmount(row[column.field])}</span>;
      case 'amount':
      case 'grand_total':
      case 'balance':
      case 'sale_price':
        return formatAmount(row[column.field]);
        case 'purchase_price':
          return formatAmount(row[column.field]);
      case 'description':
        const trimmedDescription = row[column.field].trim();
        return trimmedDescription.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
      default:
        return row[column.field];
    }
  };

  return (
    <div className="card custom-card mb-4">
      {showDateFilters && ( // Conditionally render the date filter section
      <div class="card custom-card">
      <div class="card-body">
        <div className="row">
          <div className="col-md-3 form-inline">
            <div className="form-group">
              <label>From Date</label>
              <input className="form-control" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3 form-inline">
            <div className="form-group">
              <label>To Date</label>
              <input className="form-control" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3 form-inline">
            <div className="form-group">
              <button type="submit" className="btn btn-default" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
      )}

      {data?.length === 0 && !handleSearchChange ? (
        <div className="card-body">
          <h2 className="text-center">No Record Found!!</h2>
        </div>
      ) : (
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
              <input type="search" className="form-control" placeholder="Search..." style={{ float: 'right', width: 'auto' }} onChange={handleSearchChange} />
            </div>
          </div>
          {closing_balance ? (
            <div className="text-right" style={{ padding: '10px 0 10px 0px', fontWeight: '700' }}>
              Closing Balance: ₹ {closing_balance}
            </div>
          ) : null}
          {data?.length === 0 ? (
            <h2 className="text-center">No Record Found!!</h2>
          ) : (
            <>
              <table className="table table-bordered border-bottom" ref={tableRef}>
                <thead className="table-header">
                  <tr>
                    {columns?.map((column) => (
                      <th key={column?.field} style={column?.field === 'added_on' || column?.field === 'payment_date' || column?.field === 'invoice_date' ? { width: '8rem' } : {}}>
                        {column?.header}{' '}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} style={column?.actionButtons ? { textAlign: 'center' } : {}}>
                          {renderCellContent(column, row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="PaginationContainer">
                <span className="total-elements">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalCount)} of {totalCount} entries
                </span>
                <Pagination currentPage={currentPage} totalCount={totalCount} itemsPerPage={pageSize} onPageChange={onPageChange} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Table;
