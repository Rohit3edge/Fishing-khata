import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AddShareApplications } from '../store/slices/share-applications';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch} from 'react-redux';
import AdminLayout from './AdminLayout';

const ShareApplications = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.data?.id;

    const [formData, setFormData] = useState({
        profile_id: id || '',
        date_of_receipt: '',
        application_no: '',
        name_address: '',
        name: '',
        occupation: '',
        no_applied_share: '',
        share_value: '',
        amount: '',
        board_resolution: '',
        no_of_share: '',
        distinctive_no_from: '',
        distinctive_no_to: '',
        allotment_letter: '',
        date_of_intimation: '',
        folio: '',
        share_certificate: '',
        total_amount_due: '',
        amount_received: '',
        amount_payable: '',
        further_amount: '',
        amount_refundable: '',
        refund_letter: '',
        remarks: '',
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
  
    const validate = () => {
      let newErrors = {};
      if (!formData.date_of_receipt) newErrors.date_of_receipt = 'Date of Receipt  is required.';
      if (!formData.application_no) newErrors.application_no = 'Application No is required.';
      if (!formData.name) newErrors.name = 'name is required.';
       
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        setIsLoading(true);
        dispatch(AddShareApplications(formData))
          .unwrap()
          .then((data) => {
            setIsLoading(false);
            setFormData({
                profile_id: '',
                date_of_receipt: '',
                application_no: '',
                name_address: '',
                name: '',
                occupation: '',
                no_applied_share: '',
                share_value: '',
                amount: '',
                board_resolution: '',
                no_of_share: '',
                distinctive_no_from: '',
                distinctive_no_to: '',
                allotment_letter: '',
                date_of_intimation: '',
                folio: '',
                share_certificate: '',
                total_amount_due: '',
                amount_received: '',
                amount_payable: '',
                further_amount: '',
                amount_refundable: '',
                refund_letter: '',
                remarks: '',
            });
            console.log('Form submitted successfully', data);
            navigate('/share-applications/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Share Applications Create</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Share Applications List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Share Applications Create
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                  <a class="btn ripple btn-default" onClick={handleSubmit} >Save</a>
                  <a class="btn btn-cancel" onClick={() => navigate('/share-applications/list')}>Cancel</a>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                <div className="card custom-card">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="row">
                              <div className="col-md-2">
                                    <label>Date of Receipt  <span className="required">*</span> </label>
                                    <input name="date_of_receipt" type="date" className="form-control" value={formData.date_of_receipt} onChange={handleInputChange} />
                                     {errors.date_of_receipt && <span className="text-danger">{errors.date_of_receipt}</span>}
                              </div>
                              <div className="col-md-2">
                                <label>Application No <span className="required">*</span> </label>
                                <input name="application_no" type="text" className="form-control"  value={formData.application_no} onChange={handleInputChange}/>
                                {errors.application_no && <span className="text-danger">{errors.application_no}</span>}
                              </div>
                              <div className="col-md-2">
                                    <label>Name <span className="required">*</span> </label>
                                    <input name="name" type="text" className="form-control"  value={formData.name} onChange={handleInputChange}/>
                                    {errors.name && <span className="text-danger">{errors.name}</span>}

                              </div>
                              <div className="col-md-4">
                                    <label>Address  </label>
                                    <input name="name_address" type="text" className="form-control"  value={formData.name_address} onChange={handleInputChange}/>
                                    {errors.name_address && <span className="text-danger">{errors.name_address}</span>}

                              </div>
                              <div className="col-md-2">
                                    <label>Occupation  </label>
                                    <input name="occupation" type="text" className="form-control"  value={formData.occupation} onChange={handleInputChange}/>
                                    {errors.occupation && <span className="text-danger">{errors.occupation}</span>}

                              </div>
                              <div className="col-md-2  mt-2">
                                    <label>No of Shares Applied  </label>
                                    <input name="no_applied_share" type="text" className="form-control"  value={formData.no_applied_share} onChange={handleInputChange}/>
                                    {errors.no_applied_share && <span className="text-danger">{errors.no_applied_share}</span>}

                              </div>
                              <div className="col-md-2  mt-2">
                                    <label>Value/Share  </label>
                                    <input name="share_value" type="text" className="form-control"  value={formData.share_value} onChange={handleInputChange}/>
                                    {errors.share_value && <span className="text-danger">{errors.share_value}</span>}

                              </div>
                              <div className="col-md-2  mt-2">
                                    <label>Amount  </label>
                                    <input name="amount" type="number" className="form-control"  value={formData.amount} onChange={handleInputChange}/>
                                    {errors.amount && <span className="text-danger">{errors.amount}</span>}

                              </div>
                            </div>
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">Allotment</legend>
                              <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Board Resolution No <span className="required">*</span> </label>
                                    <input name="board_resolution" type="text" className="form-control" value={formData.board_resolution} onChange={handleInputChange} />
                                    {errors.board_resolution && <span className="text-danger">{errors.board_resolution}</span>}
                                    
                                </div>
                                <div className="col-md-3">
                                    <label>No. of Shares Allotted </label>
                                    <input name="no_of_share" type="text" className="form-control" value={formData.no_of_share} onChange={handleInputChange}  />
                                </div>
                                <div className="col-md-3">
                                    <label>Distinctive No From</label>
                                    <input name="distinctive_no_from" type="text" className="form-control" value={formData.distinctive_no_from} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3">
                                    <label>Distinctive No To </label>
                                    <input name="distinctive_no_to" value={formData.distinctive_no_to} onChange={handleInputChange}  type="text" className="form-control"  />
                                </div>
                              </div>
                              <div className="row mt-4">
                                <div className="col-md-3">
                                    <label>Allotment Letter </label>
                                    <input name="allotment_letter" value={formData.allotment_letter} onChange={handleInputChange}  type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>Date of Intimation </label>
                                    <input name="date_of_intimation" value={formData.date_of_intimation} onChange={handleInputChange} type="date" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>Folio </label>
                                    <input name="folio"  value={formData.folio} onChange={handleInputChange} type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>Share Certificate </label>
                                    <input name="share_certificate" value={formData.share_certificate} onChange={handleInputChange} type="text" className="form-control" />
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <hr />
                        <div className="row mt-6">
                            <div className="col-md-2">
                                <label> Total Amount Due </label>
                                <input name="total_amount_due"  value={formData.total_amount_due} onChange={handleInputChange} type="text" className="form-control" />
                            </div>
                            <div className="col-md-2">
                                <label>Amount Received </label>
                                <input name="amount_received" value={formData.amount_received} onChange={handleInputChange} type="number" className="form-control" />
                            </div>
                            <div className="col-md-2">
                                <label>Amount Payable </label>
                                <input name="amount_payable" value={formData.amount_payable} onChange={handleInputChange} type="number" className="form-control" />
                            </div>
                            <div className="col-md-2">
                                <label>Further Amount </label>
                                <input name="further_amount" value={formData.further_amount} onChange={handleInputChange} type="number" className="form-control" />
                            </div>
                            <div className="col-md-2">
                                <label>Amount Refundable </label>
                                <input name="amount_refundable" value={formData.amount_refundable} onChange={handleInputChange} type="number" className="form-control" />
                            </div>
                            <div className="col-md-2">
                                <label>Refund Letter </label>
                                <input name="refund_letter" value={formData.refund_letter} onChange={handleInputChange} type="text" className="form-control" />
                            </div>
                            <div className="col-md-6 mt-2">
                                <label>Remarks </label>
                                <input name="remarks" value={formData.remarks} onChange={handleInputChange} type="text" className="form-control" />
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div><br/>
        </AdminLayout>
  );                                                                            
};

export default ShareApplications;
