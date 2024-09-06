import React, { useState,useRef } from 'react';
import Navbarside from './Navbarside';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetSingleBank, LedgerEntires } from '../store/slices/bankbook';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import Footer from './Footer';
import Moment from 'moment';

const BankBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const NewID = id;
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState();
  const [ledgerEntires, setLedgerEntires] = useState();

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const profile_id = user?.data?.id;
  const item = { profile_id: profile_id, ledger_id: id };

  const [columns, setcolumns] = useState([
    { header: 'Description', field: 'description', isMultiline: true },
    { header: 'Date', field: 'added_on', isDate: true },
    { header: 'Dr', field: 'dr', isDrCr: true, isDr: true },
    { header: 'Cr', field: 'cr', isDrCr: true, isDr: false },
    { header: 'Closing Balance', field: 'closing_balance' }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');


  React.useEffect(() => {
    setIsLoading(true);
    dispatch(GetSingleBank(id))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setBankData(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, id]);

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(LedgerEntires(item))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setLedgerEntires(data?.data);
        console.log(data.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, NewID]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data based on search query
  const filteredledgerEntires = ledgerEntires?.filter(party => 
    party?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.added_on?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.dr?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.cr?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.closing_balance?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  return (
    <>
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
                    <h2 class="main-content-title tx-24 mg-b-5 text-uppercase">{bankData?.bank_name}</h2>
                    {/* <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">List</li>
                            </ol> */}
                  </div>
                  <div class="d-flex justify-content-end">
                    <button
                      class="btn ripple btn-default"
                      onClick={() => {
                        navigate(`/bankbookEntry/${bankData.ledger_id ? bankData.ledger_id : null}`, { state: { data: bankData } });
                      }}
                    >
                      Deposit/Withdraw
                    </button>
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
                                  <label class="font-weight-bold">Account Holder Name : </label>
                                  <span>{bankData?.account_holder}</span>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div class="col-md-4 form-inline">
                                <div class="form-group">
                                  <label class="font-weight-bold">Account No : </label>
                                  <span>{bankData?.account_no}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="row mt-3">
                      <div class="col-md-12">
                        {/* <div class="card custom-card mb-4">
                          <div class="card-body">
                            {ledgerEntires?.length == 0 ? <h2 className="text-center">No Record Found !</h2> : null}
                            <table class="table table-bordered border-bottom" id="example1">
                              <thead>
                                <tr>
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
                      />
                        
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
    </>
  );
};

export default BankBook;
