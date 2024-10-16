import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { Getcompanybanks,Depositwithdraw } from '../store/slices/bankbook';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';


const DepositWithdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state || {};
  const [bankData, setBankData] = useState();
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('Withdraw');
  const [errors, setErrors] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

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
 

  const [formData, setFormData] = useState({
    profile_id: id,
    entry_type: paymentMode||"",
    date: '',
    amount: '',
    from_ledger_id: '',
    to_ledger_id: paymentMode === 'BankToBank' && bankData?.length > 0 ? bankData?.[0].id: '',
    remark: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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

 
  const validate = () => {
    let newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount= 'Please enter a valid amount greater than 0.';
    if (!formData.date) newErrors.date = 'Date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
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
    // console.log("NewOne",updatedFormData)
    // console.log("NewOne",data?.ledger_id)
    setIsLoading(true);
    dispatch(Depositwithdraw(updatedFormData))
      .unwrap()
      .then(() => {
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
        navigate(`/bankbook/${data?.ledger_id ?data?.ledger_id:""}`);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
    }
  };

  return (
    <AdminLayout>
        {isLoading && <Loader />}
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
                            {errors.amount && (
        <span className="text-danger">{errors.amount}</span>
      )}
                          </div>
                          <div class="col-md-6">
                            <label>
                              Date <span class="required">*</span>
                            </label>
                            <input name="date" type="date" class="form-control" value={formData.date} onChange={handleInputChange} />
                            {errors.date && (
        <span className="text-danger">{errors.date}</span>
      )}
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
      </AdminLayout>
  );
};

export default DepositWithdraw;
