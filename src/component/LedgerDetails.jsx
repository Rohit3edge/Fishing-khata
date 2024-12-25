import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LedgerEntires } from '../store/slices/bankbook';
import { UpdateOpeningBalance } from '../store/slices/ledger';
import Table from '../common/Table';
import { toast } from 'react-hot-toast';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';

const LedgerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const { ledgerid } = useParams();

  const user = JSON.parse(localStorage.getItem('user'));
  const profile_id = user?.data?.id;

  // console.log("ledgerid",ledgerid)
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerEntires, setLedgerEntires] = useState([]);
  const [ledgerDetails, setLedgerDetails] = useState({});
  const [closingBalance, setClosingBalance] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  const [data, setData] = useState({
    profile_id: profile_id,
    ledger_id: ledgerid,
    opening_balance: "",
    opening_date: "",
    dr_cr: ""
  });

  const [showDateFilters, setShowDateFilters] = useState(true);

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

  // Retrieve saved dates from localStorage or use default values
  const savedFromDate = localStorage.getItem('LedgerfromDate') || getFinancialYearStartDate();
  const savedToDate = localStorage.getItem('LedgertoDate') || getTodayFormattedDate();

  const [fromDate, setFromDate] = useState(savedFromDate); // Financial year start or saved value
  const [toDate, setToDate] = useState(savedToDate); // Today's date or saved value


  const [item, setItem] = useState({
    ledger_id: ledgerid,
    profile_id: profile_id,
    from_date: savedFromDate,
    to_date: savedToDate,
  });

  const [columns, setcolumns] = useState([
    { header: 'Type', field: 'type' },
    { header: 'Description', field: 'description', isMultiline: true },
    { header: 'Date', field: 'ledger_date' },
    { header: 'Dr', field: 'dr', isDrCr: true, isDr: true },
    { header: 'Cr', field: 'cr', isDrCr: true, isDr: false },
    { header: 'Closing Balance', field: 'balance' },
  ]);

  // Save dates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('LedgerfromDate', fromDate);
    localStorage.setItem('LedgertoDate', toDate);
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleLedgerClick(null, ledgerid); // Pass null for event, pass ledgerid directly
  }, [dispatch]);

  const handleLedgerClick = async (e) => {
    if (e) e.preventDefault(); // Prevent default only if `e` is present

    const newItem = {
      ...item,
      ledger_id: ledgerid,
      from_date: fromDate,
      to_date: toDate,
    };
    setItem(newItem);

    const requestId = Date.now();
    const currentRequestId = requestId;
    setIsLoading(true);

    try {
      const data = await dispatch(LedgerEntires(newItem)).unwrap();

      if (currentRequestId === requestId) {
        setLedgerEntires(data?.data?.entries || []);
        setClosingBalance(data?.data?.closing_balance || '');
        setLedgerDetails(data?.data?.ledger_details);
        setData((prevData) => ({
          ...prevData, // Spread the previous form data
          opening_balance: data?.data?.ledger_details?.opening_balance,
          opening_date: data?.data?.ledger_details?.opening_balance_date,
          dr_cr: data?.data?.ledger_details?.opening_balance_type
        }));
      }
    } catch (error) {
      toast.error('No Record Found!!');
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  // Reset Dates Functionality
  const resetDates = async () => {
    const defaultFromDate = getFinancialYearStartDate();
    const defaultToDate = getTodayFormattedDate();

    // Update state
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);

    // Clear local storage
    localStorage.removeItem('fromDate');
    localStorage.removeItem('toDate');

    // Update item object
    const updatedItem = {
      ...item,
      from_date: defaultFromDate,
      to_date: defaultToDate,
    };
    setItem(updatedItem);

    // Re-fetch ledger entries
    setIsLoading(true);
    try {
      const data = await dispatch(LedgerEntires(updatedItem)).unwrap();

      setLedgerEntires(data?.data?.entries || []);
      setClosingBalance(data?.data?.closing_balance || '');
      setLedgerDetails(data?.data?.ledger_details);
    } catch (error) {
      toast.error('No Record Found!!');
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData, // Spread the previous form data
      [name]: value, // Update the specific field
    }));
  };
  
  const UpdateOpeningbalance = async () => {
    // Use the latest 'data' state for the update
    const item = { ...data }; // Make sure 'data' contains the latest values
    
    setIsLoading(true);
  
    try {
      const response = await dispatch(UpdateOpeningBalance(item)).unwrap();
      
      if (response) {
        toast.success('Opening Balance Updated');
        handleLedgerClick(null, ledgerid);  // Refresh or handle the ledger click
      }
    } catch (error) {
      toast.error('No Record Found!!');
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(data)
  // Filter data based on search query
  const filteredledgerEntires = (ledgerEntires || [])?.filter((party) => {
    const search = searchQuery?.toLowerCase() || '';
    return (
      party?.type?.toLowerCase()?.includes(search) ||
      party?.description?.toLowerCase()?.includes(search) ||
      party?.added_on?.toLowerCase()?.includes(search) ||
      String(party?.dr || '')
        .toLowerCase()
        .includes(search) || // Safely convert to string
      String(party?.cr || '')
        .toLowerCase()
        .includes(search) || // Safely convert to string
      String(party?.balance || '')
        .toLowerCase()
        .includes(search) // Safely convert to string
    );
  });
  return (
    <AdminLayout>
      {isLoading && <Loader />}
      <div className="row content-body">
        <div className="container-fluid">
          <div className="page-header">
            <div>
              <h2 class="main-content-title tx-24 mg-b-5">Ledger</h2>
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  List
                </li>
              </ol>
            </div>
            <div class="d-flex justify-content-end">
              <a class="btn ripple btn-default" onClick={() => navigate('/addLedger')}>
                Add Ledger
              </a>
            </div>
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
                            <label class="font-weight-bold">ledger Name</label>
                            <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word', maxWidth: '200px' }}>{ledgerDetails?.ledger_name}</div>
                          </div>
                        </div>
                        <div class="col-md-3 form-inline">
                          <div class="form-group">
                            <label class="font-weight-bold">Group Name</label>
                            <span>{ledgerDetails?.group_name}</span>
                          </div>
                        </div>
                        <div class="col-md-2 form-inline">
                          <div class="form-group">
                            <label class="font-weight-bold">State</label>
                            <span>{ledgerDetails?.state}</span>
                          </div>
                        </div>
                        <div class="col-md-3 form-inline">
                          <div class="form-group">
                            <label class="font-weight-bold">GSTN</label>
                            <span>{ledgerDetails?.gstn}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          {ledgerDetails?.is_default=="1"&&ledgerDetails?.ledger_name!="Cash In Hand"&& ( <div class="card custom-card mt-4">
                <div class="card-body">
                  <div className="row align-content-center">
                    <div className="col-md-4 ">
                      <div className="form-group">
                        <label className="mb-2 font-weight-bold">Date</label>
                        <input name="opening_date" className="form-control" type="date" value={data?.opening_date} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="col-md-4 ">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="col-black mb-2 font-weight-bold" > Opening Balance</label>
                        <div className="ml-2">
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio"  name="dr_cr" id="credit" value="cr" checked={data?.dr_cr == 'cr'} onChange={handleInputChange} />
                            <label className="form-check-label" htmlFor="credit">
                              Cr
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio"  id="debit" value="dr"  name="dr_cr" checked={data?.dr_cr == 'dr'} onChange={handleInputChange}/>
                            <label className="form-check-label" htmlFor="debit">
                              Dr
                            </label>
                          </div>
                        </div>
                      </div>
                      <input name="opening_balance" type="text" className="form-control" placeholder="Enter the amount" value={data?.opening_balance} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 d-flex align-items-center mt-4">
                      <div className="form-group">
                        <button type="submit" className="btn btn-default" onClick={UpdateOpeningbalance}>
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}

              <div className="row mt-3">
                <div className="col-md-12">
                  <div class="row mt-3">
                    <div class="col-md-12">
                      <Table
                        columns={columns}
                        data={filteredledgerEntires}
                        tableRef={tableRef}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        currentPage={currentPage}
                        totalCount={filteredledgerEntires?.length}
                        onPageChange={handlePageChange}
                        handleSearchChange={handleSearchChange}
                        closing_balance={closingBalance}
                        showDateFilters={showDateFilters}
                        fromDate={fromDate}
                        toDate={toDate}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                        resetDates={resetDates}
                        handleSubmit={handleLedgerClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LedgerDetails;
