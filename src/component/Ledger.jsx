import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LedgerList } from '../store/slices/ledger';
import { LedgerEntires } from '../store/slices/bankbook';
import Pagination from '../common/Pagination';
import Moment from 'moment';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';

const Ledger = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ledgerList, setLedgerList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ledgerEntires, setLedgerEntires] = useState();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Set the number of items you want per page

  // Calculate the current items based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ledgerEntires?.slice(indexOfFirstItem, indexOfLastItem);

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const profile_id = user?.data?.id;

  const [item, setItem] = useState({
    profile_id: profile_id,
    ledger_id: ledgerList[0]?.id,
  });

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

  React.useEffect(() => {
    if (item.ledger_id) {
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
    }
  }, [dispatch, item]);

  const handleLedgerClick = (id, index) => {
    setActiveIndex(index);
    setItem({ ...item, ledger_id: id });
  };

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
                <button type="submit" className="btn btn-default">
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
                <div class="col-md-2">
                  <div class="card custom-card">
                    <div class="card-body p-2">
                      <ul class="ledger-list">
                        {ledgerList?.map((option, index) => (
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

                <div class="col-md-10">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="card custom-card">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">From Date</label>
                                <input class="form-control" required="" type="date" />
                              </div>
                            </div>
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">To Date</label>
                                <input class="form-control" required="" type="date" />
                              </div>
                            </div>
                            <div class="col-md-3 form-inline">
                              <div class="form-group">
                                <button type="submit" class="btn btn-default">
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
                          <div class="card custom-card  mb-4" >
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
                                {/* <tbody>
                                {ledgerEntires?.map((ledgerEntires, index) => (
                                  <tr key={index}>
                                    <td>{ledgerEntires?.type}</td>
                                    <td>
                                      {ledgerEntires?.description.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                          {line}
                                          <br />
                                        </React.Fragment>
                                      ))}
                                    </td>
                                    <td> {Moment(ledgerEntires?.added_on).format('DD-MM-YYYY')}</td>
                                    <td className={`text-danger`}>{Number(ledgerEntires?.dr) === 0 ? '' : ledgerEntires?.dr}</td>
                                    <td className={`text-success`}>{Number(ledgerEntires?.cr) === 0 ? '' : ledgerEntires?.cr}</td>
                                    <td></td>
                                  </tr>
                                ))}
                                </tbody> */}
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
      </div>
      <Footer />
    </div>
  );
};

export default Ledger;
