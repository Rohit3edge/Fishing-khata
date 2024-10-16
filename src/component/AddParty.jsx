import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { AddParties } from '../store/slices/parties';
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
    profile_id: id || '',
    name: '',
    address: '',
    email: '',
    phone: '',
    state: '',
    gstin: '',
    opening_blance: Number(''),
    isactive: 1,
    ob_date: '',
    party_type: 'Customer',
  });

  const [errors, setErrors] = useState({});


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'opening_blance') {
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

  const handleDiscard = () => {
    setFormData({
      profile_id: id || '',
      name: '',
      address: '',
      email: '',
      phone: '',
      state: '',
      gstin: '',
      opening_blance: Number(''),
      isactive: 1,
      ob_date: currentDate,
      party_type: 'Customer',
    });
  };

  const validate = () => {
    let newErrors = {};
    const phoneNumberPattern = /^[0-9]{10}$/;
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.email) newErrors.email = 'Email is required.';

    if (!formData.phone || !phoneNumberPattern.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
  
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.gstin) newErrors.gstin = 'GSTIN is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(AddParties(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            profile_id: '',
            name: '',
            address: '',
            email: '',
            phone: '',
            state: '',
            gstin: '',
            opening_blance: Number(''),
            isactive: 1,
            ob_date: '',
            party_type: 'Customer',
          });
          navigate('/partymaster');
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
                  <h2 class="main-content-title tx-24 mg-b-5">Party Master Create</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Party Master List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Party Master Create
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
                          <div class="col-md-3">
                            <label class="rdiobox">
                              <input name="party_type" type="radio" value="Customer" checked={formData.party_type === 'Customer'} onChange={handleInputChange} /> <span>Customer/Buyer</span>
                            </label>
                          </div>
                          <div class="col-md-3">
                            <label class="rdiobox">
                              <input name="party_type" type="radio" value="Vendor" checked={formData.party_type === 'Vendor'} onChange={handleInputChange} /> <span>Vendor/Seller</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-12">
                            <label>
                              Party Name <span class="required">*</span>
                            </label>
                            <input name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} />
                            {errors.name && <span className="text-danger">{errors.name}</span>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>
                              Address <span class="required">*</span>
                            </label>
                            <input name="address" type="text" className="form-control" value={formData.address} onChange={handleInputChange} />
                            {errors.address && <span className="text-danger">{errors.address}</span>}
                          </div>
                          <div class="col-md-6">
                            <label>State</label>
                            <input name="state" type="text" className="form-control" value={formData.state} onChange={handleInputChange} />
                            {errors.state && <span className="text-danger">{errors.state}</span>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Phone Number</label>
                            <input name="phone" type="text"  className={`form-control ${errors.phone ? 'is-invalid' : ''}`} value={formData.phone} onChange={handleInputChange} />
                            {errors.phone && <span className="text-danger">{errors.phone}</span>}
                          </div>
                          <div class="col-md-6">
                            <label>Email Address</label>
                            <input name="email" type="text" className="form-control" value={formData.email} onChange={handleInputChange} />
                            {errors.email && <span className="text-danger">{errors.email}</span>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>GST Number</label>
                            <input name="gstin" type="text" class="form-control" value={formData.gstin} onChange={handleInputChange} />
                            {errors.gstin && <span className="text-danger">{errors.gstin}</span>}
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
                              <input name="opening_blance" class="form-control" type="text" value={formData.opening_blance} onChange={handleInputChange} />
                              {errors.opening_blance && <span className="text-danger">{errors.opening_blance}</span>}
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label>As of Date</label>
                            <input name="ob_date" type="date" class="form-control" value={formData.ob_date} onChange={handleInputChange} />
                            {errors.ob_date && <span className="text-danger">{errors.ob_date}</span>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <button type="submit" class="btn btn-default" onClick={handleSubmit}>
                              Submit
                            </button>
                            &nbsp;
                            <button type="submit" class="btn btn-cancel" onClick={() => navigate('/partymaster')}>
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
