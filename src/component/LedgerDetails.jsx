import React, {useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LedgerEntires } from '../store/slices/bankbook';
import Table from '../common/Table';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import AdminLayout from './AdminLayout';

const LedgerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const {ledgerid}=useParams()
  // console.log("ledgerid",ledgerid)
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerEntires, setLedgerEntires] = useState([]);
  const [ledgerDetails, setLedgerDetails] = useState({});
  const[closingBalance,setClosingBalance ]=useState("")

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  const [showDateFilters, setShowDateFilters] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const profile_id = user?.data?.id;

  const [item, setItem] = useState({
    ledger_id:ledgerid,
    profile_id: profile_id,
    from_date: fromDate, 
    to_date: toDate, 
  });

  const [columns, setcolumns] = useState([
    { header: 'Type', field: 'type' },
    { header: 'Description', field: 'description',isMultiline: true },
    { header: 'Date', field: 'added_on' },
    { header: 'Dr', field: 'dr', isDrCr: true, isDr: true  },
    { header: 'Cr', field: 'cr', isDrCr: true, isDr: false  },
    { header: 'Closing Balance', field: 'balance' },
  ]);

  React.useEffect(() => {
    handleLedgerClick(ledgerid)
  }, [dispatch]);


  const handleLedgerClick = async (id) => {
    const newItem = {
      ...item,
      ledger_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    setItem(newItem);
  
    const requestId = Date.now();
    const currentRequestId = requestId;
    setIsLoading(true);
  
    try {
      const data = await dispatch(LedgerEntires(newItem)).unwrap();

      if (currentRequestId === requestId) {
        setLedgerEntires(data?.data?.entries || []);
        setClosingBalance(data?.data?.closing_balance || "");
        setLedgerDetails(data?.data?.ledger_details)
        setFromDate("")
        setToDate("")
      }
    } catch (error) {
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


  // Filter data based on search query
  const filteredledgerEntires = (ledgerEntires || [])?.filter(party => {
    const search = searchQuery?.toLowerCase() || '';
    return (
      party?.type?.toLowerCase()?.includes(search) ||
      party?.description?.toLowerCase()?.includes(search) ||
      party?.added_on?.toLowerCase()?.includes(search) ||
      String(party?.dr || '').toLowerCase().includes(search) || // Safely convert to string
      String(party?.cr || '').toLowerCase().includes(search) || // Safely convert to string
      String(party?.balance || '').toLowerCase().includes(search) // Safely convert to string
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
                                <span style={{width:"40%",lineHeight:"16px"}}>{ledgerDetails?.ledger_name}</span>
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
