import React, { useState,useEffect} from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Updatemembers,EditMembers } from '../store/slices/members';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch} from 'react-redux';
import AdminLayout from './AdminLayout';

const Registermembers = () => {
    const { id } = useParams();
    const memberId = id; 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userID = user?.data?.id;
    const Name = user?.data?.company_name;
  
    const [formData, setFormData] = useState({
        profile_id: userID || '',
        nominal_value_share:'',
        share_heald:'',
        folio_no: '',
        member_name: '',
        address: '',
        email: '',
        cin: '',
        father: '',
        pan: '',
        name_gauardian: '',
        dob_minor: '',
        date_of_becoming: '',
        date_of_declaration: '',
        name_beneficial: '',
        date_of_receipt: '',
        name_of_nominee: '',
        no_of_share: '',
        lien_on_share: '',
        date_of_cessation: '',
        particulars: '',
        instruction: '',
        address_beneficial: '',
    });
    
    useEffect(() => {
        if (memberId && userID) {
          setIsLoading(true);
          dispatch(EditMembers({ profile_id: userID, id: memberId }))
            .unwrap()
            .then((data) => {
              setIsLoading(false);
              const member = data?.data;
              setFormData({
                ...formData,
                id: member?.id || '',
                profile_id: userID || '',
                nominal_value_share:member?.nominal_value_share ||'',
                share_heald:member?.share_heald ||'',
                folio_no:member?.folio_no || '',
                member_name: member?.member_name ||'',
                address: member?.address ||'',
                email:member?.email || '',
                cin: member?.cin ||'',
                father:member?.father || '',
                pan: member?.pan || '',
                name_gauardian:member?.name_gauardian || '',
                dob_minor: member?.dob_minor ||'',
                date_of_becoming: member?.date_of_becoming ||'',
                date_of_declaration: member?.date_of_declaration ||'',
                name_beneficial:member?.name_beneficial || '',
                date_of_receipt:member?.date_of_receipt || '',
                name_of_nominee: member?.name_of_nominee ||'',
                no_of_share: member?.no_of_share ||'',
                lien_on_share:member?.lien_on_share || '',
                date_of_cessation:member?.date_of_cessation ||  '',
                particulars: member?.particulars || '',
                instruction:member?.instruction ||  '',
                address_beneficial:member?.address_beneficial || '',
              });
            })
            .catch(({ message }) => {
              setIsLoading(false);
              console.error(message);
            });
        }
      }, [dispatch, memberId]);

  
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
      if (!formData.nominal_value_share) newErrors.nominal_value_share = 'Nominal Value Per Share is required.';
      if (!formData.share_heald) newErrors.share_heald = 'Total Shares Held is required.';
      if (!formData.folio_no) newErrors.folio_no = 'Follo No. is required.';
      if (!formData.member_name) newErrors.member_name = 'Name is required.';
       
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        setIsLoading(true);
        dispatch(Updatemembers(formData))
          .unwrap()
          .then((data) => {
            setIsLoading(false);
            setFormData({
                profile_id: '',
                nominal_value_share: '',
                share_heald: '',
                folio_no: '',
                member_name: '',
                address: '',
                email: '',
                cin: '',
                father: '',
                pan: '',
                name_gauardian: '',
                dob_minor: '',
                date_of_becoming: '',
                date_of_declaration: '',
                name_beneficial: '',
                date_of_receipt: '',
                name_of_nominee: '',
                no_of_share: '',
                lien_on_share: '',
                date_of_cessation: '',
                particulars: '',
                instruction: '',
                address_beneficial: '',
            });
            console.log('Form submitted successfully', data);
            navigate('/members/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Member Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Member List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                         Member Edit
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                  <a class="btn ripple btn-default" onClick={handleSubmit} >Update</a>
                  <a class="btn btn-cancel" onClick={() => navigate('/members/list')}>Cancel</a>
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
                              <div className="col-md-4">
                                    <label>Nominal Value Per Share  <span className="required">*</span> </label>
                                    <input name="nominal_value_share" type="text" className="form-control" value={formData?.nominal_value_share} onChange={handleInputChange} />
                                     {errors.nominal_value_share && <span className="text-danger">{errors.nominal_value_share}</span>}
                              </div>
                              <div className="col-md-4">
                                <label>Total Shares Held <span className="required">*</span> </label>
                                <input name="share_heald" type="text" className="form-control"  value={formData?.share_heald} onChange={handleInputChange}/>
                                {errors.share_heald && <span className="text-danger">{errors.share_heald}</span>}
                              </div>
                              <div className="col-md-4">
                                    <label>Follo No. <span className="required">*</span> </label>
                                    <input name="folio_no" type="number" className="form-control"  value={formData?.folio_no} onChange={handleInputChange}/>
                                    {errors.folio_no && <span className="text-danger">{errors.folio_no}</span>}

                              </div>
                            </div>
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">Personal Details</legend>
                              <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Name <span className="required">*</span> </label>
                                    <input name="member_name" type="text" className="form-control" value={formData?.member_name} onChange={handleInputChange} />
                                    {errors.member_name && <span className="text-danger">{errors.member_name}</span>}
                                    
                                </div>
                                <div className="col-md-3">
                                    <label>Address </label>
                                    <input name="address" type="text" className="form-control" value={formData?.address} onChange={handleInputChange}  />
                                </div>
                                <div className="col-md-3">
                                    <label>E-mail </label>
                                    <input name="email" type="Email" className="form-control" value={formData?.email} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3">
                                    <label>CIN|Reg.No|UID </label>
                                    <input name="cin" value={formData?.cin} onChange={handleInputChange}  type="text" className="form-control"  />
                                </div>
                              </div>
                              <div className="row mt-4">
                                <div className="col-md-3">
                                    <label>Father's/Mother's Name </label>
                                    <input name="father" value={formData?.father} onChange={handleInputChange}  type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>PAN </label>
                                    <input name="pan" value={formData?.pan} onChange={handleInputChange} type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>Name Of Guardian </label>
                                    <input name="name_gauardian"  value={formData?.name_gauardian} onChange={handleInputChange} type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>DOB Of Mionr </label>
                                    <input name="dob_minor" value={formData?.dob_minor} onChange={handleInputChange} type="date" className="form-control" />
                                </div>
                              </div>
                            </fieldset>
                          </div>

                        <div className="col-md-12">
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">Details Of Members</legend>
                              <div className="row mt-2">
                                <div className="col-md-3">
                                    <label>Date Of Becoming Members </label>
                                    <input name="date_of_becoming" value={formData?.date_of_becoming} onChange={handleInputChange} type="date" className="form-control"  />
                                </div>
                                <div className="col-md-3">
                                    <label>Date Of Declaration </label>
                                    <input name="date_of_declaration" value={formData?.date_of_declaration} onChange={handleInputChange} type="date" className="form-control"  />
                                </div>
                                <div className="col-md-3">
                                    <label>Name </label>
                                    <input name="name_beneficial" value={formData?.name_beneficial} onChange={handleInputChange} type="text" className="form-control"  />
                                </div>
                                <div className="col-md-3">
                                    <label>Address </label>
                                    <input name="address_beneficial" value={formData?.address_beneficial} onChange={handleInputChange} type="text" className="form-control"  />
                                </div>
                              </div>
                              <div className="row mt-4">
                                <div className="col-md-3">
                                    <label>Date Of Receipt </label>
                                    <input name="date_of_receipt" value={formData?.date_of_receipt} onChange={handleInputChange} type="date" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>Name/Address Of Nominee </label>
                                    <input name="name_of_nominee" value={formData?.name_of_nominee} onChange={handleInputChange}  type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>No Of Shares Kept In Abeyance</label>
                                    <input name="no_of_share" value={formData?.no_of_share} onChange={handleInputChange} type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                    <label>Lien Of Shares </label>
                                    <input name="lien_on_share" value={formData?.lien_on_share} onChange={handleInputChange} type="text" className="form-control" />
                                </div>
                                <div className="col-md-3 p-2">
                                    <label>Date Of Cessation </label>
                                    <input name="date_of_cessation" value={formData?.date_of_cessation} onChange={handleInputChange} type="date" className="form-control" />
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <hr />
                        <div className="row mt-6">
                            <div className="col-md-3">
                                <label>Particulars Of Dividend </label>
                                <input name="particulars"  value={formData?.particulars} onChange={handleInputChange} type="text" className="form-control" />
                            </div>
                            <div className="col-md-3">
                                <label>Instrction </label>
                                <input name="instruction" value={formData?.instruction} onChange={handleInputChange} type="text" className="form-control" />
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

export default Registermembers;
