import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetStockSummary } from '../../store/slices/reports';
import Table from '../../common/Table';
import Navbarside from '../Navbarside';
import Loader from '../../common/Loader';
import Footer from '../Footer';

const StockSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [stockSummary, setStockSummary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  // Get today's date
  const today = new Date();

  // Financial year calculation
  const getFinancialYearStartDate = () => {
    const currentYear = today.getFullYear();
    return `${currentYear}-04-01`;
  };

  const getTodayFormattedDate = () => {
    return today.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
  };

  const [fromDate, setFromDate] = useState(getFinancialYearStartDate()); // Financial year start
  const [toDate, setToDate] = useState(getTodayFormattedDate()); // Today's date

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const profile_id = user?.data?.id;

  const [columns, setColumns] = useState([
    { header: 'Item Name', field: 'item_name' },
    { header: 'Current Stock', field: 'current_stock' },
    { header: 'Avg Purchase Price', field: 'avg_purchase_price' },
    { header: 'Current Stock Value', field: 'current_stock_value' },
  ]);

  useEffect(() => {
    handleStockSummary();
  }, []); 

  const handleStockSummary = async () => {
    const newItem = {
      profile_id: profile_id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };

    setIsLoading(true);

    try {
      const data = await dispatch(GetStockSummary(newItem)).unwrap();

      setStockSummary(data?.stock_report || []); // Update stockSummary with the response
    } catch (error) {
      console.error('Error fetching stock summary:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data based on search query
  const filteredStockEntries = (stockSummary || []).filter((item) => {
    const search = searchQuery.toLowerCase() || '';
    return (
      item?.item_name?.toLowerCase().includes(search) ||
      String(item?.current_stock || '').toLowerCase().includes(search) ||
      String(item?.avg_purchase_price || '').toLowerCase().includes(search) ||
      String(item?.current_stock_value || '').toLowerCase().includes(search)
    );
  });


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  return (
    <div>
      <div class="row" style={{ marginLeft: '0', marginRight: '0' }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">{Name}</div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default" onClick={() => navigate('/ledger')}>
                  Ledger
                </button>
                <button type="submit" className="btn btn-default" onClick={() => navigate('/invoice')}>
                  Sale
                </button>
                <button type="submit" className="btn btn-default">
                  Purchase
                </button>
              </div>
            </div>
          </div>
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Stock Summary</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Reports</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      List
                    </li>
                  </ol>
                </div>
                {/* <div class="d-flex justify-content-end">
                  <a class="btn ripple btn-default" onClick={() => navigate('/addLedger')}>
                    Add Ledger
                  </a>
                </div> */}
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="card custom-card">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">From Date</label>
                                <input class="form-control" type="date" value={fromDate}
                                  onChange={(e) => setFromDate(e.target.value)} />
                              </div>
                            </div>
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">To Date</label>
                                <input class="form-control" type="date" value={toDate}
                                  onChange={(e) => setToDate(e.target.value)} />
                              </div>
                            </div>
                            <div class="col-md-3 form-inline">
                              <div class="form-group">
                                <button type="submit" class="btn btn-default"   onClick={() => handleStockSummary()}>
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <div class="row mt-3">
                        <div class="col-md-12">
                        <Table
                            columns={columns}
                            data={filteredStockEntries}
                            tableRef={tableRef}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            currentPage={currentPage}
                            totalCount={filteredStockEntries?.length}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StockSummary;
