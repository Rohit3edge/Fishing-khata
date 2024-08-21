import React,{useState} from 'react'
import Navbarside from './Navbarside' 
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetSingleBank } from '../store/slices/bankbook';
import Loader from "../common/Loader"
import Footer from './Footer'

const BankBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState();

  const user = JSON.parse(localStorage.getItem("user"));
  const Name = user?.data?.company_name;

  React.useEffect(() => {
    setIsLoading(true)
    dispatch(GetSingleBank(id))
      .unwrap()
      .then((data) => {
        setIsLoading(false)
        setBankData(data?.data);
        console.log(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false)
        alert(message);
      });
  }, [dispatch,id]);
  
  return (
    <>
    <div>
      <div class="row" style={{marginLeft:"0",marginRight:"0"}}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">
                {Name}
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default" onClick={()=>navigate("/ledger")}>
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
                            <h2 class="main-content-title tx-24 mg-b-5 text-uppercase">{bankData?.bank_name}</h2>
                            {/* <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">List</li>
                            </ol> */}
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn ripple btn-default" onClick={() => navigate("/bankbookEntry", { state: { data: bankData?.bank_name } })} >Deposit/Withdraw</button>
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
                                    <div class="card custom-card">
                                        <div class="card-body">
                                            <table class="table table-bordered border-bottom" id="example1">
                                              <thead>
                                                <tr>
                                                  <th>Transaction Type</th>
                                                  <th>Bank</th>
                                                  <th>Name</th>
                                                  <th>Date</th>
                                                  <th>Dr</th>
                                                  <th>Cr</th>
                                                  <th>Closing Balance</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  <td>{bankData?.type}</td>
                                                  <td><span className="text-uppercase">{bankData?.bank_name}</span> Bank</td>
                                                  <td>{bankData?.account_holder}</td>
                                                  <td>{bankData?.date_as_of}</td>
                                                  <td></td>
                                                  <td>1000.0</td>
                                                  <td>Dr50000.00</td>
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
        </div>
      </div>
      <Footer />
    </div>
    </>
  )
}

export default BankBook