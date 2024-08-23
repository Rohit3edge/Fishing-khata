import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { AddBankBook } from '../store/slices/bankbook';
import Loader from '../common/Loader';

const AddNewStock = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { data } = location.state || {};
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log(data);

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
    type: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const { display_name, account_no, ifsc, type, account_holder } = formData;

    if (!display_name || !account_no || !ifsc || !type || !account_holder) {
      alert('Please fill all the mandatory fields: Display Name, Account No, IFSC, and Account Type.');
      return;
    }
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
        navigate('/');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        alert(message);
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
                  <h2 class="main-content-title tx-24 mg-b-5">Add New Stock</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Stock</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Stock
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
                              <input name="type" type="radio" value="Regular" checked={formData.type === 'Regular'} onChange={handleInputChange} /> <span>Product</span>
                            </label>
                          </div>
                          <div class="col-md-2">
                            <label class="rdiobox">
                              <input name="type" type="radio" value="Service" checked={formData.type === 'Service'} onChange={handleInputChange} /> <span>Service</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="row">
                          <div className="col-md-12">
                            <label>
                              Product Name <span class="required">*</span>
                            </label>
                            <input name="account_holder" type="text" class="form-control" onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Category</label>
                            <select
                              name="invoice_account_type"
                              class="form-control form-control-sm"
                              //   value={
                              //     setting?.invoice_account_type ??
                              //     data?.invoice_account_type
                              //   }
                              //   onChange={(e) => {
                              //     dispatch(
                              //       updateSettingsField({
                              //         invoice_account_type: e.target.value,
                              //       })
                              //     );
                              //   }}
                            >
                              <option value="General" className="text-uppercase">
                                General
                              </option>
                            </select>
                          </div>
                          <div class="col-md-6">
                            <label>Sub Category</label>
                            <input name="account_no" type="text" class="form-control text-uppercase" disabled value="" />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Opening Quantity</label>
                            <div class="input-group">
                              <input name="opening_balance" aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" onChange={handleInputChange} />
                            </div>
                          </div>

                          <div class="col-md-6">
                            <label>Date</label>
                            <input name="as_of_date" type="date" class="form-control" value={currentDate} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Sale Price</label>
                            <div class="input-group">
                              <span class="input-group-text" id="basic-addon1">
                                ₹
                              </span>
                              <input name="account_holder" type="text" class="form-control" onChange={handleInputChange} />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label>Purchase Price</label>
                            <div class="input-group">
                              <span class="input-group-text" id="basic-addon1">
                                ₹
                              </span>
                              <input name="account_holder" type="text" class="form-control" onChange={handleInputChange} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-12">
                            <label>Barcode/Serial No</label>
                            <input name="account_holder" type="text" class="form-control" onChange={handleInputChange} />
                          </div>
                          <div class="col-md-6"></div>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddNewStock;
