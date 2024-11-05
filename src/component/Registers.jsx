import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import AdminLayout from './AdminLayout';

const  Registers= () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.data?.id;
    const Name = user?.data?.company_name;
    const [isLoading, setIsLoading] = useState(false);

    return (
      <AdminLayout>
            {isLoading && <Loader />}
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
                                        <a onClick={() => navigate('/directors/list')} className="btn register-link">Directors &amp; Key Members</a><br></br>
                                        <a onClick={() => navigate('/farmer/list')}  className="btn register-link">Farmer's Data</a><br></br>
                                        <a  className="btn register-link">Share Certificates</a><br></br>
                                        <a  className="btn register-link">Compliance</a><br></br>
                                        <a   onClick={() => navigate('/company/ducuments')} className="btn register-link">Company Documents</a><br></br>
                                        <a  onClick={() => navigate('/management-cost/list')} className="btn register-link" >Management Cost</a><br></br>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <a  onClick={() => navigate('/share-applications/list')} className="btn register-link">Share Application</a><br></br>
                                        <a  onClick={() => navigate('/members/list')} className="btn register-link">Members</a><br></br>
                                        <a  className="btn register-link" onClick={() => navigate('/share-transfer/list')} >Share/Debenture Transfer</a><br></br>
                                        <a  className="btn register-link" onClick={() => navigate('/dividend/list')}>Dividend</a><br></br>
                                        <a  className="btn register-link" onClick={() => navigate('/loans/list')}>Loans, Guarantee</a><br></br>
                                    </div>
                                    <div className="col-md-4 text-center">
                                        <a  className="btn register-link" onClick={() => navigate('/assets/list')}>Assets</a><br></br>
                                        <a  className="btn register-link">Deposits</a><br></br>
                                        <a  className="btn register-link">Seal Book</a><br></br>
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

}

export default Registers;