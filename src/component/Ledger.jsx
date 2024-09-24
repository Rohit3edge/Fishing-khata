import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LedgerList } from '../store/slices/ledger';
import { LedgerEntires } from '../store/slices/bankbook';
import Table from '../common/Table';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';

const Ledger = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerList, setLedgerList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [ledgerEntires, setLedgerEntires] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const[closingBalance,setClosingBalance ]=useState("")

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');

  const [fromDate, setFromDate] = useState(''); // State for from_date
  const [toDate, setToDate] = useState(''); // State for to_date

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const profile_id = user?.data?.id;

  const [item, setItem] = useState({
    profile_id: profile_id,
    ledger_id: ledgerList[0]?.id,
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
    setIsLoading(true);
    dispatch(LedgerList())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setLedgerList(data?.data);
        if (data?.data?.length > 0) {
          const firstLedgerId = data.data?.[0].id;
          setActiveIndex(0);
          setItem({ ...item, ledger_id: firstLedgerId });
        }
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleLedgerClick = async (id, index) => {
    setActiveIndex(index);
    console.log("hiii")
    const newItem = {
      ...item,
      ledger_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };
    console.log("Nwew",newItem)
    setItem(newItem);
  
    const requestId = Date.now();
    const currentRequestId = requestId;
    setIsLoading(true);
  
    try {
      const data = await dispatch(LedgerEntires(newItem)).unwrap();

      if (currentRequestId === requestId) {
        setLedgerEntires(data?.data?.entries || []);
        setClosingBalance(data?.data?.closing_balance || "");
        setFromDate("")
        setToDate("")
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  

  const handleSearchChangeul = (e) => {
    setSearchTerm(e.target.value);
  };


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredLedgerList = ledgerList?.filter(option =>
    option?.ledger?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

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
                <div class="col-md-3">
                  <div class="card custom-card">
                    <div class="card-body p-2">
                    <input
              type="text"
              placeholder="Search..."
              className="form-control mb-2"
              value={searchTerm}
              onChange={handleSearchChangeul}
            />
                      <ul class="ledger-list" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        {filteredLedgerList?.map((option, index) => (
                          <li key={index} onClick={() => handleLedgerClick(option?.id, index)}>
                            <a href="#" className={index === activeIndex ? 'active' : ''}>
                              {option?.ledger}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="col-md-9">
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
                                <button type="submit" class="btn btn-default"   onClick={() => handleLedgerClick(item.ledger_id, activeIndex)}>
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
                          {/* <div class="card custom-card  mb-4" >
                            <div class="card-body">
                              {currentItems?.length == 0 ? <h2 className="text-center">No Record Found !</h2> : null}
                              <table class="table table-bordered border-bottom" id="example1">
                                <thead>
                                  <tr>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Dr</th>
                                    <th>Cr</th>
                                    <th>Closing Balance</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentItems?.map((ledgerEntry, index) => (
                                    <tr key={index}>
                                      <td>{ledgerEntry?.type}</td>
                                      <td>
                                        {ledgerEntry?.description.split('\n').map((line, index) => (
                                          <React.Fragment key={index}>
                                            {line}
                                            <br />
                                          </React.Fragment>
                                        ))}
                                      </td>
                                      <td> {Moment(ledgerEntry?.added_on).format('DD-MM-YYYY')}</td>
                                      <td className={`text-danger`}>{Number(ledgerEntry?.dr) === 0 ? '' : ledgerEntry?.dr}</td>
                                      <td className={`text-success`}>{Number(ledgerEntry?.cr) === 0 ? '' : ledgerEntry?.cr}</td>
                                      <td></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="PaginationContainer">
                                <span className="total-elements">
                                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, ledgerEntires?.length)} of {ledgerEntires?.length} entries
                                </span>
                                <Pagination currentPage={currentPage} totalCount={ledgerEntires?.length} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
                              </div>
                            </div>
                          </div> */}
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

export default Ledger;
