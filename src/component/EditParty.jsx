import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { UpdateParties, EditParties } from '../store/slices/parties';
import Loader from '../common/Loader';

const PartyForm = () => {
  const { id } = useParams();
  const PartyId = id; // Party ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: userId || '',
    id: PartyId || '',
    name: '',
    address: '',
    email: '',
    phone: '',
    state: '',
    gstin: '',
    opening_blance: '',
    isactive: 1,
    ob_date: '',
    party_type: 'Customer',
    ledger_id: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch party details for editing
  useEffect(() => {
    if (PartyId && userId) {
      setIsLoading(true);
      dispatch(EditParties({ profile_id: userId, party_id: PartyId }))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const parties = data?.data;
          setFormData({
            ...formData,
            name: parties?.name || '',
            id: parties?.id || '',
            address: parties?.address || '',
            state: parties?.state || '',
            email: parties?.email || '',
            phone: parties?.phone || '',
            gstin: parties?.gstin || '',
            opening_blance: parties?.opening_blance || '',
            isactive: '1',
            ob_date: parties?.ob_date || '',
            party_type: parties?.party_type || 'Customer',
            ledger_id: parties?.ledger_id || ''
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.error(message);
        });
    }
  }, [dispatch, PartyId]);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validate required fields before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Party name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    dispatch(UpdateParties(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log('Party updated successfully', data);
        navigate('/partymaster'); // Navigate back to party list after update
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.error(message);
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
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Party Edit</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Party Edit</a>
                    </li>
                    {/* <li class="breadcrumb-item active" aria-current="page">
                    Add Party
                    </li> */}
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
                            <input name="ledger_id" type="hidden" className="form-control" value={formData.ledger_id} onChange={handleInputChange} />
                            
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
                          </div>
                          <div class="col-md-6">
                            <label>State</label>
                            <input name="state" type="text" className="form-control" value={formData.state} onChange={handleInputChange} />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Phone Number</label>
                            <input name="phone" type="text" className="form-control" value={formData.phone} onChange={handleInputChange} />
                          </div>
                          <div class="col-md-6">
                            <label>Email Address</label>
                            <input name="email" type="text" className="form-control" value={formData.email} onChange={handleInputChange} />

                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>GST Number</label>
                            <input name="gstin" type="text" class="form-control" value={formData.gstin} onChange={handleInputChange} />
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
                              
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label>As of Date</label>
                            <input name="ob_date" type="date" class="form-control" value={formData.ob_date} onChange={handleInputChange} />
                            
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <button type="submit" class="btn btn-default" onClick={handleSubmit}>
                              Update
                            </button>
                            &nbsp;
                            <button type="submit" class="btn btn-cancel" onClick={() => navigate('/partymaster')} >
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

export default PartyForm;
