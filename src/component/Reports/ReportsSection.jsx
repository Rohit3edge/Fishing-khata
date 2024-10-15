import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from '../Navbarside';
import Loader from '../../common/Loader';
import Footer from '../Footer';


const  ReportsSection= () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.data?.id;
    const Name = user?.data?.company_name;
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
          <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
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
                      <h2 className="main-content-title tx-24 mg-b-5">Registers</h2>
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <a href="#">Registers Master</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                        Registers List
                        </li>
                      </ol>
                    </div>
                    {/* <div className="d-flex justify-content-end">
                      <button className="btn ripple btn-default" onClick={() => navigate('/addparty')}>
                        Add Party
                      </button>
                    </div> */}
                  </div>
    
                  <div className="row">
                    <div className="col-md-12"> 
                        <div className="card custom-card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 text-center">
                                        <a onClick={() => navigate('')} className="btn register-link">Transaction Report</a><br></br>
                                        <a onClick={() => navigate('')}  className="btn register-link">Sale</a><br></br>
                                        <a  className="btn register-link">Purchase</a><br></br>
                                        <a  className="btn register-link" onClick={() => navigate('/reports/trialbalance')} >Trial Balance</a><br></br>
                                        <a   onClick={() => navigate('/reports/profitandloss')} className="btn register-link">Profit and Loss</a><br></br>
                                        <a  onClick={() => navigate('')} className="btn register-link" >Balance Sheet</a><br></br>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <a  onClick={() => navigate('/reports/stocksummary')} className="btn register-link">Stock Summary</a><br></br>
                                        <a  onClick={() => navigate('')} className="btn register-link">Low Stock</a><br></br>
                                        <a  className="btn register-link" onClick={() => navigate('')} >Fast Moving Items</a><br></br>
                                        <a  className="btn register-link" onClick={() => navigate('')}>Items Not Moving</a><br></br>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <a  className="btn register-link">GSTR1</a><br></br>
                                        <a  className="btn register-link">GSTR2</a><br></br>
                                        <a  className="btn register-link">GSTR3 B</a><br></br>
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

}

export default ReportsSection;