import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { AddDividend } from '../store/slices/dividend';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';

const DividendRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id || '',
    name: '',
    folio: '',
    name_address: '',
    pan: '',
    amount_paid_on_share: '',
    dividend_amount_paid: '',
    period: '',
    declaration_date: '',
    gross_dividend: '',
    tds: '',
    payable_amount: '',
    warrant_no: '',
    payment_date: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});


  const handleInputChange = (e) => {
    const { name, value } = e.target;

      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
  };



  const validate = () => {
    let newErrors = {};
    if (!formData.folio) newErrors.folio = 'Folio is required.';
     
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(AddDividend(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            profile_id: '',
            name: '',
            folio: '',
            name_address: '',
            pan: '',
            amount_paid_on_share: '',
            dividend_amount_paid: '',
            period: '',
            declaration_date: '',
            gross_dividend: '',
            tds: '',
            payable_amount: '',
            warrant_no: '',
            payment_date: '',
            remarks: ''
          });
          navigate('/dividend/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Dividend Create</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Dividend List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Dividend Create
                    </li>
                  </ol>
                </div>

                <div class="d-flex justify-content-end">
                  <button className="btn ripple btn-default"  onClick={handleSubmit}>Save</button>
                  <button className="btn btn-cancel" onClick={() => navigate('/dividend/list')}>Cancel</button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                <div className="card custom-card">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-12">
                              <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>Folio No.<span className="required">*</span> </label>
                                  <input name="folio" type="number" className="form-control" value={formData.folio} onChange={handleInputChange} />
                                  {errors.folio && <span className="text-danger">{errors.folio}</span>}
                                </div>

                                <div className="col-md-3">
                                  <label>Name</label>
                                  <input name="name" type="text" className="form-control"  value={formData.name} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-6">
                                  <label>Address</label>
                                  <input name="name_address" type="text" className="form-control"  value={formData.name_address} onChange={handleInputChange}/>
                                </div>
                              </div>

                              <div className="row mt-2">
                              <div className="col-md-3">
                                  <label>PAN No.</label>
                                  <input name="pan" type="text" className="form-control"  value={formData.pan} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-3">
                                  <label>Amount Paid on Shares</label>
                                  <input name="amount_paid_on_share" type="number" className="form-control" value={formData.amount_paid_on_share} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3">
                                  <label>Divident Amount Paid</label>
                                  <input name="dividend_amount_paid" type="number" className="form-control" value={formData.dividend_amount_paid} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-3">
                                  <label>Period For Payment</label>
                                  <input name="period" type="number" className="form-control" value={formData.period} onChange={handleInputChange} />
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>Date of Declaration</label>
                                  <input name="declaration_date" type="date" className="form-control" value={formData.declaration_date} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-3">
                                  <label>Gross Dividend</label>
                                  <input name="gross_dividend" type="number" className="form-control" value={formData.gross_dividend} onChange={handleInputChange}  />
                                </div>

                                <div className="col-md-3">
                                  <label>Tax Deducted (TDS)</label>
                                  <input name="tds" type="number" className="form-control" value={formData.tds} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-3">
                                  <label>Net Amount Payable</label>
                                  <input name="payable_amount" type="number" className="form-control" value={formData.payable_amount} onChange={handleInputChange} />
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>Dividend Warrent No.</label>
                                  <input name="warrant_no" type="number" className="form-control"  value={formData.warrant_no} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-3">
                                  <label>Date Of Payment</label>
                                  <input name="payment_date" type="date" className="form-control" value={formData.payment_date} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-6">
                                  <label>Remarks</label>
                                  <input name="remarks" type="text" className="form-control" value={formData.remarks} onChange={handleInputChange}/>
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
        </AdminLayout>
   
  );
};

export default DividendRegister ;
