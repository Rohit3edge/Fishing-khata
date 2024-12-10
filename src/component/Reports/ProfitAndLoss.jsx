import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GetProfitLoss } from '../../store/slices/reports';
import Loader from '../../common/Loader';
import AdminLayout from '../AdminLayout';

const ProfitAndLoss = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [profitLoss, setProfitLoss] = useState([]);

  // Get today's date
  const today = new Date();

  // Financial year calculation
  const getFinancialYearStartDate = () => {
    const currentYear = today.getFullYear();
    return `${currentYear}-04-01`;
  };

  const getTodayFormatteddate = () => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return today.toLocaleDateString('en-GB', options); // e.g., 31-October-2024
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
    handleProfitLoss();
  }, []);

  const handleProfitLoss = async () => {
    const newItem = {
      profile_id: profile_id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };

    setIsLoading(true);

    try {
      const data = await dispatch(GetProfitLoss(newItem)).unwrap();

      setProfitLoss(data?.data || []); // Update stockSummary with the response
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
              <h2 class="main-content-title tx-24 mg-b-5">Profit and Loss</h2>
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="#">Reports</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Profit and Loss
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
                            <button type="submit" class="btn btn-default" onClick={() => handleProfitLoss()}>
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
                        <h4 style={{ fontWeight: '700' }}>Profit & Loss</h4>
                        <p>{formatDateRange(fromDate, toDate)}</p>
                      </div>

                      <table className="table table-borderless" style={{ width: '100%', fontSize: '12px' }}>
                        <tbody>
                          <tr>
                            <td style={{ border: '1px solid' }}>
                              <div className="d-flex justify-content-between">
                                <span className="font-weight-bold">Particulars</span>
                                <span>as to {getTodayFormatteddate()}</span>
                              </div>
                            </td>
                            <td style={{ border: '1px solid' }}>
                              <div className="d-flex justify-content-between">
                                <span className="font-weight-bold">Particulars</span>
                                <span>as at {getTodayFormatteddate()}</span>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style={{ border: '1px solid' }}>
                              <div className="mb-2">
                                {profitLoss?.income_statement?.Expenses?.map((expense, index) => (
                                  <>
                                    <div className="d-flex justify-content-between font-weight-bold">
                                      <b>{expense?.group}</b>
                                    </div>
                                    <span key={index} className="d-flex justify-content-between ">
                                      <span style={{ paddingLeft: '20px' }}>{expense?.ledger}</span>
                                      <span>₹{parseFloat(expense?.amount?.replace(/,/g, '')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </span>
                                  </>
                                ))}
                              </div>

                              {profitLoss?.income_statement?.['Gross Profit/Loss']?.description == 'Gross Profit' ? (
                                <div className="d-flex justify-content-between">
                                  <b>Gross Profit</b>
                                  <b>₹{parseFloat(profitLoss?.income_statement?.['Gross Profit/Loss']?.amount?.replace(/,/g, '')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>
                                </div>
                              ) : (
                                ''
                              )}

                              

                              <div className="d-flex justify-content-end" style={{ marginBottom: '15px', paddingTop: '10px', paddingBottom: '10px' }}>
                                <div style={{ paddingLeft: '110px', paddingTop: '10px', paddingBottom: '10px', textAlign: 'right', borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  ₹
                                  {(
                                    (profitLoss?.income_statement?.['Gross Profit/Loss']?.description == 'Gross Profit' &&
                                      parseFloat(profitLoss?.income_statement?.['Gross Profit/Loss']?.amount.replace(/,/g, ''))) +
                                    profitLoss?.income_statement?.Expenses?.reduce((acc, expense) => acc + parseFloat(expense?.amount.replace(/,/g, '')), 0)
                                  ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                              {profitLoss?.income_statement?.['Indirect Expenses'] && (
                                <div className="mb-2">
                                  {profitLoss?.income_statement?.['Indirect Expenses']?.map((income, index) => (
                                    <>
                                     {index == 0?
                                      <div className="d-flex justify-content-between font-weight-bold">
                                        <b>{income?.group}</b>
                                      </div>
                                      :
                                      ''
                                     }
                                      <span key={index} className="d-flex justify-content-between ">
                                        <span style={{ paddingLeft: '20px' }}>{income?.ledger}</span>
                                        <span>₹{parseFloat(income?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                      </span>
                                    </>
                                  ))}
                                </div>
                              )}

                              <div className="d-flex justify-content-end" style={{ marginBottom: '15px', paddingTop: '10px', paddingBottom: '10px' }}>
                                <div style={{ paddingLeft: '110px', paddingTop: '10px', paddingBottom: '10px', textAlign: 'right', borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  ₹
                                    {(
                                      ((profitLoss?.income_statement?.['Indirect Expenses']?.description === 'Indirect Expenses' &&
                                        parseFloat(profitLoss?.income_statement?.['Indirect Expenses']?.amount?.replace(/,/g, ''))) ||
                                        0) + (profitLoss?.income_statement?.['Indirect Expenses']?.reduce((acc, income) => acc + parseFloat(income?.amount?.replace(/,/g, '')), 0) || 0)
                                    ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                             {profitLoss?.income_statement?.['Gross Profit/Loss']?.description == 'Gross Loss' ? (
                                <div className="d-flex justify-content-between">
                                  <b>Gross Loss</b>
                                  <b>₹{parseFloat(profitLoss?.income_statement?.['Gross Profit/Loss']?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>
                                </div>
                              ) : (
                                ''
                              )}

                              {profitLoss?.income_statement?.['Net Profit/Loss']?.description == 'Net Profit' ? (
                                <div className="d-flex justify-content-between">
                                  <b>Net Profit</b>
                                  <b>{profitLoss?.income_statement?.['Net Profit/Loss']?.amount}</b>
                                </div>
                              ) : (
                                ''
                              )}
                              {/* <div className="d-flex justify-content-between">
                                <span>Indirect Expenses</span>
                                <span>6,000</span>
                              </div> */}
                            </td>

                            <td style={{ border: '1px solid' }}>
                              <div className="mb-2">
                                {profitLoss?.income_statement?.Income?.map((income, index) => (
                                  <>
                                    <div className="d-flex justify-content-between font-weight-bold">
                                      <b>{income?.group}</b>
                                    </div>
                                    <span key={index} className="d-flex justify-content-between ">
                                      <span style={{ paddingLeft: '20px' }}>{income?.ledger}</span>
                                      <span> ₹{parseFloat(income?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </span>
                                  </>
                                ))}
                              </div>
                              
                              {profitLoss?.income_statement?.['Gross Profit/Loss']?.description == 'Gross Loss' ? (
                                <div className="d-flex justify-content-between">
                                  <b>Gross Loss</b>
                                  <b>₹{parseFloat(profitLoss?.income_statement?.['Gross Profit/Loss']?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>
                                </div>
                              ) : (
                                ''
                              )}
                              

                              <div className="d-flex justify-content-end" style={{ marginBottom: '15px', paddingTop: '10px', paddingBottom: '10px' }}>
                                <div style={{ paddingLeft: '110px', paddingTop: '10px', paddingBottom: '10px', textAlign: 'right', borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  ₹
                                  {(
                                    ((profitLoss?.income_statement?.['Gross Profit/Loss']?.description === 'Gross Loss' &&
                                      parseFloat(profitLoss?.income_statement?.['Gross Profit/Loss']?.amount?.replace(/,/g, ''))) ||
                                      0) + (profitLoss?.income_statement?.Income?.reduce((acc, income) => acc + parseFloat(income?.amount?.replace(/,/g, '')), 0) || 0)
                                  ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                             

                              {profitLoss?.income_statement?.['Indirect Income'] && (
                                <div className="mb-2">
                                  {profitLoss?.income_statement?.['Indirect Income']?.map((income, index) => (
                                    <>
                                    {index == 0 ?
                                      <div className="d-flex justify-content-between font-weight-bold">
                                        <b>{income?.group}</b>
                                      </div>
                                      :
                                      ''
                                    }
                                      <span key={index} className="d-flex justify-content-between ">
                                        <span style={{ paddingLeft: '20px' }}>{income.ledger}</span>
                                        <span>₹{parseFloat(income?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                      </span>
                                    </>
                                  ))}
                                </div>
                              )}

                             

                              <div className="d-flex justify-content-end" style={{ marginBottom: '15px', paddingTop: '10px', paddingBottom: '10px' }}>
                                <div style={{ paddingLeft: '110px', paddingTop: '10px', paddingBottom: '10px', textAlign: 'right', borderTop: '1px solid', borderBottom: '1px solid' }}>
                                  ₹
                                    {(
                                      ((profitLoss?.income_statement?.['Indirect Income']?.description === 'Indirect Income' &&
                                        parseFloat(profitLoss?.income_statement?.['Indirect Income']?.amount?.replace(/,/g, ''))) ||
                                        0) + (profitLoss?.income_statement?.['Indirect Income']?.reduce((acc, income) => acc + parseFloat(income?.amount?.replace(/,/g, '')), 0) || 0)
                                    ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                              {profitLoss?.income_statement?.['Net Profit/Loss']?.description == 'Net Loss' ? (
                                <div className="d-flex justify-content-between">
                                  <b>Net Loss</b>
                                  <b>₹{parseFloat(profitLoss?.income_statement?.['Net Profit/Loss']?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>
                                </div>
                              ) : (
                                ''
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td style={{ border: '1px solid' }}>
                              <div className="d-flex justify-content-between">
                                <span>Total</span>
                                <span className="font-weight-bold">
                                  ₹
                                  {parseFloat(profitLoss?.income_statement?.['Net Profit/Loss']?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </td>

                            <td style={{ border: '1px solid' }}>
                              <div className="d-flex justify-content-between">
                                <span>Total</span>
                                <span className="font-weight-bold">
                                  ₹
                                  {parseFloat(profitLoss?.income_statement?.['Net Profit/Loss']?.amount?.replace(/,/g, '') || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
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

export default ProfitAndLoss;
