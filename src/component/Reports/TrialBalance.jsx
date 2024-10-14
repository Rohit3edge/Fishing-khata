import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetTrialBalance } from '../../store/slices/reports';
import Navbarside from '../Navbarside';
import Loader from '../../common/Loader';
import Footer from '../Footer';
import { BorderBottom } from '@mui/icons-material';

const TrialBalance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [trialBalance, setTrialBalance] = useState([]);

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
                                <input class="form-control" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                              </div>
                            </div>
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">To Date</label>
                                <input class="form-control" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
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
                            <h3>DEENDYAL PAREEK</h3>
                            <h4>Trial Balance</h4>
                            <p>{formatDateRange(fromDate,toDate)}</p>
                          </div>
                          <table className="table" >
                            <thead >
                              <tr style={{BorderBottom:"2px solid black"}}>
                                <th >Particulars</th>
                                <th >Dr</th>
                                <th >Cr</th>
                              </tr>
                            </thead>
                            <tbody>
      {Object.entries(trialBalance)?.map(([group, items]) => (
        <React.Fragment key={group}>
          <tr>
            <td colSpan="3" style={{ textAlign: 'left', fontWeight: 'bold', border: 'none' }}>
              {group}
            </td>
            <td style={{ border: 'none' }}></td>
            <td style={{ border: 'none' }}>{items?.reduce((sum, item) => sum + Number(item?.credit), 0)}</td>
          </tr>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ paddingLeft: '40px', border: 'none' }}>{item.ledger}</td>
              <td style={{ border: 'none' }}>{item.debit > 0 ? item.debit : ''}</td>
              <td style={{ border: 'none' }}>{item.credit > 0 ? item.credit : ''}</td>
            </tr>
          ))}
        </React.Fragment>
      ))}
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrialBalance;
