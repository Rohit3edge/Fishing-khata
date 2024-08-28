import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { Getcompanybanks,Depositwithdraw } from '../store/slices/bankbook';
import Loader from '../common/Loader';


const DepositWithdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state || {};
  const [bankData, setBankData] = useState();
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Withdraw');

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  // console.log("newdata",data)
  React.useEffect(() => {
    dispatch(Getcompanybanks())
      .unwrap()
      .then((data) => {
        setBankData(data.data);
        if (paymentMode === 'BankToBank' && data.data.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            to_ledger_id: data.data[0].id,
          }));
        }
      })
      .catch(({ message }) => {
        console.log(message);
      });
  }, [dispatch,paymentMode]);
 
  console.log(paymentMode === 'BankToBank',bankData.length)
  const [formData, setFormData] = useState({
    profile_id: id,
    entry_type: paymentMode||"",
    date: '',
    amount: '',
    from_ledger_id: '',
    to_ledger_id: paymentMode === 'BankToBank' && bankData.length > 0 ? bankData?.[0].id: '',
    remark: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaymentModeChange = (e) => {
    const selectedMode = e.target.value;
  setPaymentMode(selectedMode);
  setFormData((prevFormData) => ({
    ...prevFormData,
    entry_type: selectedMode,
  }));
  };

  const handleDiscard = () => {
    setFormData({
      profile_id: id,
      entry_type: paymentMode,
      date: '',
      amount: '',
      from_ledger_id: '',
      to_ledger_id: '',
      remark: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedFormData = { ...formData };

    if (paymentMode === 'Withdraw') {
      updatedFormData.from_ledger_id = data?.ledger_id || '';
      updatedFormData.to_ledger_id = '';
    } else if (paymentMode === 'Deposit') {
      updatedFormData.from_ledger_id = '';
      updatedFormData.to_ledger_id = data?.ledger_id || '';
    } else if (paymentMode === 'BankToBank') {
      updatedFormData.from_ledger_id = data?.ledger_id || '';
      updatedFormData.to_ledger_id = formData.to_ledger_id; 
    }
    console.log("NewOne",updatedFormData)
    setIsLoading(true);
    dispatch(Depositwithdraw(updatedFormData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          profile_id: id,
          entry_type: paymentMode,
          date: '',
          amount: '',
          from_ledger_id: '',
          to_ledger_id: '',
          remark: '',
        });
        navigate('/');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
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
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Deposit / Withdraw</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Bank Book</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Bank Book Entry
                    </li>
                  </ol>
                </div>
              </div>
              <div class="row">
                <div class="col-md-8">
                  <div class="card custom-card">
                    <div class="card-body">
                      <div class="form-group">
                        <div class="row">
                          <div className="col-md-12">
                            <label>
                              Payment Mode <span class="required">*</span>
                            </label>
                            <select name="invoice_account_type" class="form-control form-control-sm" value={paymentMode} onChange={handlePaymentModeChange}>
                              <option value="Withdraw">Withdraw</option>
                              <option value="Deposit">Deposit</option>
                              <option value="BankToBank">Bank to Bank</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          {paymentMode === 'Withdraw' && (
                            <>
                              <div class="col-md-6">
                                <label>
                                  From <span class="required">*</span>
                                </label>
                                <input name="from_ledger_id" type="text" class="form-control text-uppercase" disabled value={data?.bank_name  || ''} />
                              </div>
                              <div class="col-md-6">
                                <label>
                                  To <span class="required">*</span>
                                </label>
                                <input name="to_ledger_id" type="text" class="form-control" disabled value="Cash" />
                              </div>
                            </>
                          )}
                          {paymentMode === 'Deposit' && (
                            <>
                              <div class="col-md-6">
                                <label>
                                  From <span class="required">*</span>
                                </label>
                                <input name="from_ledger_id" type="text" class="form-control" disabled value="Cash" />
                              </div>
                              <div class="col-md-6">
                                <label>
                                  To <span class="required">*</span>
                                </label>
                                <input name="to_ledger_id" type="text" class="form-control text-uppercase" disabled value={data?.bank_name } />
                              </div>
                            </>
                          )}
                          {paymentMode === 'BankToBank' && (
                            <>
                              <div class="col-md-6">
                                <label>
                                  From <span class="required">*</span>
                                </label>
                                <input name="from_ledger_id" type="text" class="form-control text-uppercase" disabled value={data?.bank_name  || ""} />
                              </div>
                              <div class="col-md-6">
                                <label>
                                  To <span class="required">*</span>
                                </label>
                                <select name="to_ledger_id" class="form-control" onChange={handleInputChange}>
                                  {bankData?.map((option, index) => (
                                    <option value={option.id} key={index}>
                                      {option.ledger}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>
                              Amount <span class="required">*</span>
                            </label>
                            <input name="amount" type="text" class="form-control" onChange={handleInputChange} value={formData.amount}/>
                          </div>
                          <div class="col-md-6">
                            <label>
                              Date <span class="required">*</span>
                            </label>
                            <input name="date" type="date" class="form-control" value={formData.date} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-12">
                            <label>Remark</label>
                            <div class="input-group">
                              <input name="remark" aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" onChange={handleInputChange} value={formData.remark} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <button type="button" class="btn btn-default" onClick={handleSubmit}>
                              Submit
                            </button>
                            &nbsp;
                            <button type="button" class="btn btn-cancel" onClick={handleDiscard}>
                              Cancel
                            </button>
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

export default DepositWithdraw;
