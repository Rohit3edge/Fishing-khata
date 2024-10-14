import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { AddBankBook } from '../store/slices/bankbook';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';

const AddParty = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id,
    date: '',
    display_name: '',
    account_no: '',
    account_holder: '',
    bank_name: '',
    ifsc: '',
    opening_balance: Number(''),
    date_as_of: '',
    type: 'Regular',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    setFormData((prevData) => ({
      ...prevData,
      date: formattedDateTime,
      date_as_of: formattedDate,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'opening_balance') {
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

  // Discard handler
  const handleDiscard = () => {
    setFormData({
      profile_id: id,
      date: '',
      display_name: '',
      account_no: '',
      account_holder: '',
      bank_name: '',
      ifsc: '',
      opening_balance: '',
      date_as_of: currentDate,
      type: '',
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.display_name) newErrors.display_name = 'Display Name is required.';
    if (!formData.account_no) newErrors.account_no = 'Account No is required.';
    if (!formData.ifsc) newErrors.ifsc = 'IFSC is required.';
    if (!formData.type) newErrors.type = 'Account Type is required.';
    if (!formData.account_holder) newErrors.account_holder = 'Account Holder Name is required.';
    if (!formData.opening_balance || (parseFloat(formData.opening_balance)<= 0)) newErrors.opening_balance='Please enter a valid amount greater than 0.'; 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(AddBankBook(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            profile_id: '',
            date: '',
            display_name: '',
            account_no: '',
            account_holder: '',
            bank_name: '',
            ifsc: '',
            opening_balance: Number(''),
            date_as_of: '',
            type: '',
          });
          console.log('Form submitted successfully', data);
          navigate('/ledger');
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
                  <h2 class="main-content-title tx-24 mg-b-5">Bank Book</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Bank Book</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Add Bank
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
                          <div class="col-md-2">
                            <label class="rdiobox">
                              <input name="type" type="radio" value="Regular" checked={formData.type === 'Regular'} onChange={handleInputChange} /> <span>Regular</span>
                            </label>
                          </div>
                          <div class="col-md-2">
                            <label class="rdiobox">
                              <input name="type" type="radio" value="OD/OCC" checked={formData.type === 'OD/OCC'} onChange={handleInputChange} /> <span>OD/OCC</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-12">
                            <label>
                              Display Name <span class="required">*</span>
                            </label>
                            <input name="display_name" type="text" class="form-control" onChange={handleInputChange} value={formData.display_name}/>
                            {errors.display_name && <span className="alert-message">{errors.display_name}</span>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>
                              Account No <span class="required">*</span>
                            </label>
                            <input name="account_no" type="text" class="form-control" onChange={handleInputChange}  value={formData.account_no}/>
                            {errors.account_no && <p className="alert-message">{errors.account_no}</p>}
                          </div>
                          <div class="col-md-6">
                            <label>Bank Name</label>
                            <input name="bank_name" type="text" class="form-control" onChange={handleInputChange} value={formData.bank_name}/>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Account Holder Name</label>
                            <input name="account_holder" type="text" class="form-control" onChange={handleInputChange} value={formData.account_holder} />
                          </div>
                          <div class="col-md-6">
                            <label>
                              IFSC <span class="required">*</span>
                            </label>
                            <input name="ifsc" type="text" class="form-control" onChange={handleInputChange}  value={formData.ifsc}/>
                            {errors.ifsc && <p className="alert-message">{errors.ifsc}</p>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Opening Balance</label>

                            <div class="input-group">
                              <span class="input-group-text" id="basic-addon1">
                                ₹
                              </span>
                              <input name="opening_balance" class="form-control" type="text" onChange={handleInputChange} value={formData.opening_balance} />
                              {errors.opening_balance && <p className="alert-message">{errors.opening_balance}</p>}
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label>
                              As of Date <span class="required">*</span>
                            </label>
                            <input name="as_of_date" type="date" class="form-control" value={currentDate} onChange={handleInputChange} />
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
                            &nbsp;
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

export default AddParty;
