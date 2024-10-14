import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetTrialBalance } from '../../store/slices/reports';
import Navbarside from '../Navbarside';
import Loader from '../../common/Loader';
import Footer from '../Footer';
import AdminLayout from '../AdminLayout';

const TrialBalance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [trialBalance, setTrialBalance] = useState([]);
  const [totaldebits, setTotaldebits] = useState([]);
  const [totalcredits, setTotalcredits] = useState([]);

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

  useEffect(() => {
    handleTrialBalance();
  }, []);

  const handleTrialBalance = async () => {
    const newItem = {
      profile_id: profile_id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };

    setIsLoading(true);

    try {
      const data = await dispatch(GetTrialBalance(newItem)).unwrap();

      setTrialBalance(data?.data?.trial_balance || []); // Update stockSummary with the response
      setTotaldebits(data?.data?.total_debits);
      setTotalcredits(data?.data?.total_credits);
      console.log(data?.data?.trial_balance);
    } catch (error) {
      console.error('Error fetching stock summary:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  function formatDateRange(startDate, endDate) {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };

    const formattedStartDate = new Date(startDate).toLocaleDateString('en-GB', options);
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-GB', options);

    return `${formattedStartDate} to ${formattedEndDate}`;
  }

  return (

    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Trial Balance</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Reports</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Trial Balance
                    </li>
                  </ol>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="card custom-card">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">From Date</label>
                                <input class="form-control" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                              </div>
                            </div>
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">To Date</label>
                                <input class="form-control" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                              </div>
                            </div>
                            <div class="col-md-3 form-inline">
                              <div class="form-group">
                                <button type="submit" class="btn btn-default" onClick={() => handleTrialBalance()}>
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
                      <div className="card custom-card">
                        <div className="card-body">
                          {/* Trial Balance Table */}
                          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontWeight: '700' }} className="text-capitalize">
                              {Name}
                            </h3>
                            <h4 style={{ fontWeight: '700' }}>Trial Balance</h4>
                            <p>{formatDateRange(fromDate, toDate)}</p>
                          </div>
                          <table className="table">
                            <thead>
                              <tr style={{ BorderBottom: '2px solid black' }}>
                                <th>Particulars</th>
                                <th style={{ textAlign: 'center', width: '125px' }}>Dr</th>
                                <th style={{ textAlign: 'center', width: '125px' }}>Cr</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(trialBalance)?.map(([group, items]) => (
                                <React.Fragment key={group}>
                                  <tr>
                                    <td style={{ textAlign: 'left', fontWeight: 'bold', border: 'none' }}>{group}</td>
                                    <td style={{ border: 'none', fontWeight: 'bold',textAlign:"center" }}>
                                      {' '}
                                      {items?.reduce((sum, item) => {
                                        const debitValue = Number(item?.debit.toString().replace(/,/g, '')); // Remove commas if any
                                        return isNaN(debitValue) ? sum : sum + debitValue;
                                      }, 0) > 0
                                        ? items
                                            .reduce((sum, item) => {
                                              const debitValue = Number(item?.debit.toString().replace(/,/g, ''));
                                              return isNaN(debitValue) ? sum : sum + debitValue;
                                            }, 0)
                                            .toLocaleString('en-US', { minimumFractionDigits: 2 })
                                        : ''}{' '}
                                      {/* Render blank if total is 0 */}
                                    </td>
                                    <td style={{ border: 'none', fontWeight: 'bold',textAlign:"center" }}>
                                      {' '}
                                      {items?.reduce((sum, item) => {
                                        const creditValue = Number(item?.credit.toString().replace(/,/g, '')); // Remove commas if any
                                        return isNaN(creditValue) ? sum : sum + creditValue;
                                      }, 0) > 0
                                        ? items
                                            .reduce((sum, item) => {
                                              const creditValue = Number(item?.credit.toString().replace(/,/g, ''));
                                              return isNaN(creditValue) ? sum : sum + creditValue;
                                            }, 0)
                                            .toLocaleString('en-US', { minimumFractionDigits: 2 })
                                        : ''}{' '}
                                      {/* Render blank if total is 0 */}
                                    </td>
                                  </tr>

                                  {items.map((item, index) => (
                                    <tr key={index} style={{ border: 'none' }}>
                                      <td style={{ padding: '2px 0px 2px 40px', border: 'none'}}>{item.ledger}</td>
                                      <td style={{ borderBottom: index === items.length - 1 ? '2px solid black' : 'none', borderTop: 'none', padding: '2px 0px 2px 0px',textAlign:"center" }}>
                                        {Number(item.debit) > 0 ? item.debit : ''}
                                      </td>
                                      <td style={{ borderBottom: index === items.length - 1 ? '2px solid black' : 'none', borderTop: 'none', padding: '2px 0px 2px 0px' ,textAlign:"center"}}>
                                        {Number(item.credit.toString().replace(/,/g, '')) > 0 ? item.credit : ''}
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ))}
                              <tr>
                                <td className="td1" style={{ borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  <b>Total</b>
                                </td>
                                <td className="td2" style={{ borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  {totaldebits}
                                </td>
                                <td className="td2" style={{ borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  {totalcredits}
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default TrialBalance;
