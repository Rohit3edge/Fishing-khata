import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AddShareTransfer } from '../store/slices/share-transfer';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch} from 'react-redux';
import AdminLayout from './AdminLayout';

const DebantureTransfer = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.data?.id;
    const Name = user?.data?.company_name;
  
    const [formData, setFormData] = useState({
          profile_id: id || '',
          no_of_transfer: '',
          transferror_name: '',
          transferror_folio: '',
          date_registration: '',
          date_board_meeting: '',
          share_debenture: '',
          distinctive_from: '',
          distinctive_to: '',
          old_certificate: '',
          amount: '',
          transferee_name: '',
          transferee_folio: '',
          new_certificate: '',
          class: '',
          consideration: '',
          cs_offices: '',
          remarks: '',
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
      if (!formData.no_of_transfer) newErrors.no_of_transfer = 'No. Of Transfer is required.';
      if (!formData.transferror_folio) newErrors.transferror_folio = 'Transferror Folio No is required.';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        setIsLoading(true);
        dispatch(AddShareTransfer(formData))
          .unwrap()
          .then((data) => {
            setIsLoading(false);
              setFormData({
                  profile_id: '',
                  no_of_transfer: '',
                  transferror_name: '',
                  transferror_folio: '',
                  date_registration: '',
                  date_board_meeting: '',
                  share_debenture: '',
                  distinctive_from: '',
                  distinctive_to: '',
                  old_certificate: '',
                  amount: '',
                  transferee_name: '',
                  transferee_folio: '',
                  new_certificate: '',
                  class: '',
                  consideration: '',
                  cs_offices: '',
                  remarks: '',
              });
            navigate('/share-transfer/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Register of Share / Debanture Transfer</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Registers</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Share / Debanture Transfer
                    </li>
                  </ol>
                </div>

                <div class="d-flex justify-content-end">
                  <a class="btn ripple btn-default" onClick={handleSubmit}>
                    Save
                  </a>

                  <a class="btn btn-cancel" onClick={() => navigate('/share-transfer/list')}>
                     Cancel
                  </a>
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
                                  <label>No. Of Transfer<span className="required">*</span> </label>
                                  <input name="no_of_transfer" type="number" className="form-control"  onChange={handleInputChange} value={formData.no_of_transfer}/>
                                  {errors.no_of_transfer && <span className="text-danger">{errors.no_of_transfer}</span>}
                                </div>

                                <div className="col-md-3">
                                  <label>Transferror Name</label>
                                  <input name="transferror_name" type="text" className="form-control" onChange={handleInputChange} value={formData.transferror_name} />
                                </div>

                                <div className="col-md-3">
                                  <label>Transferror Folio No. <span className='required'>*</span> </label>
                                  <input name="transferror_folio" type="number" className="form-control"  onChange={handleInputChange} value={formData.transferror_folio}/>
                                  {errors.transferror_folio && <span className="text-danger">{errors.transferror_folio}</span>}
                                </div>

                                <div className="col-md-3">
                                  <label>Date Of Registration </label>
                                  <input name="date_registration" type="date" className="form-control" onChange={handleInputChange} value={formData.date_registration} />
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>Date of Board Meeting </label>
                                  <input name="date_board_meeting" type="date" className="form-control" onChange={handleInputChange} value={formData.date_board_meeting}/>
                                </div>
                                <div className="col-md-3">
                                  <label>Share Debanture </label>
                                  <input name="share_debenture" type="number" className="form-control" onChange={handleInputChange} value={formData.share_debenture}/>
                                </div>

                                <div className="col-md-3">
                                  <label>Distinctive No. From </label>
                                  <input name="distinctive_from" type="number" className="form-control"  onChange={handleInputChange} value={formData.distinctive_from}/>
                                </div>

                                <div className="col-md-3">
                                  <label>Distinctive No. To </label>
                                  <input name="distinctive_to" type="number" className="form-control"  onChange={handleInputChange} value={formData.distinctive_to} />
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>No. of Old Certificate </label>
                                  <input name="old_certificate" type="number" className="form-control" onChange={handleInputChange} value={formData.old_certificate} />
                                </div>

                                <div className="col-md-3">
                                  <label>Amount </label>
                                  <input name="amount" type="number" className="form-control" onChange={handleInputChange} value={formData.amount} />
                                </div>

                                <div className="col-md-3">
                                  <label>Transferre Name </label>
                                  <input name="transferee_name" type="text" className="form-control"  onChange={handleInputChange} value={formData.transferee_name}/>
                                </div>

                                <div className="col-md-3">
                                  <label>Transferre Folio No. </label>
                                  <input name="transferee_folio" type="number" className="form-control" onChange={handleInputChange} value={formData.transferee_folio}/>
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>New Certification No </label>
                                  <input name="new_certificate" type="number" className="form-control" onChange={handleInputChange} value={formData.new_certificate} />
                                </div>

                                <div className="col-md-3">
                                  <label>Class </label>
                                  <input name="class" type="text" className="form-control" onChange={handleInputChange} value={formData.class} />
                                </div>

                                <div className="col-md-3">
                                  <label>Consideration Involved </label>
                                  <input name="consideration" type="number" className="form-control" onChange={handleInputChange} value={formData.consideration}/>
                                </div>

                                <div className="col-md-3">
                                  <label>CS Offices</label>
                                  <input name="cs_offices" type="text" className="form-control"  onChange={handleInputChange} value={formData.cs_offices}/>
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-8">
                                  <label>Remarks</label>
                                  <input name="remarks" type="text" className="form-control" onChange={handleInputChange} value={formData.remarks}/>
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

export default DebantureTransfer ;
