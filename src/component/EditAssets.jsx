import React, { useState,useEffect} from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { UpdateAsset ,EditAsset } from '../store/slices/assets';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch} from 'react-redux';
import AdminLayout from './AdminLayout';

const Registermembers = () => {
    const { id } = useParams();
    const assets_id = id; 

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.data?.id;
    const Name = user?.data?.company_name;
  
    const [formData, setFormData] = useState({
        id:assets_id || '',
        profile_id: userId || '',
        voucher: '',
        particulars: '',
        classification: '',
        specification: '',
        location: '',
        invoice_value: '',
        custom_duty: '',
        incidental_expenses: '',
        installation_expenses: '',
        total_cost: '',
        value: '',
        dep_rate: '',
        current_year_depreciation: '',
        accumulated: '',
        section_current_year_depreciation	: '',
        section_accumulated: '',
        value_ca13: '',
        section_rate :'',
        value_section32: '',
        adjustment: '',
        total_depreciation: '',
        profilt_loss: '',
        remarks: '',
    });
  
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (assets_id && userId) {
          setIsLoading(true);
          dispatch(EditAsset({ profile_id: userId, id: assets_id }))
            .unwrap()
            .then((data) => {
              setIsLoading(false);
              const member = data?.data;
              setFormData({
                ...formData,
                id: member?.id || '',
                profile_id: userId || '',
                voucher: member?.voucher || '',
                particulars: member?.particulars || '',
                classification: member?.classification || '',
                specification: member?.specification || '',
                location: member?.location || '',
                invoice_value: member?.invoice_value || '',
                custom_duty: member?.custom_duty || '',
                incidental_expenses: member?.incidental_expenses || '',
                installation_expenses: member?.installation_expenses || '',
                total_cost: member?.total_cost || '',
                value: member?.value || '',
                dep_rate: member?.dep_rate || '',
                current_year_depreciation: member?.current_year_depreciation || '',
                accumulated: member?.accumulated || '',
                section_current_year_depreciation	: member?.section_current_year_depreciation || '',
                section_accumulated: member?.section_accumulated || '',
                value_ca13: member?.value_ca13 || '',
                section_rate :member?.section_rate || '',
                value_section32: member?.value_section32 || '',
                adjustment: member?.adjustment || '',
                total_depreciation: member?.total_depreciation || '',
                profilt_loss: member?.profilt_loss || '',
                remarks: member?.remarks || '',
              });
            })
            .catch(({ message }) => {
              setIsLoading(false);
              console.error(message);
            });
        }
      }, [dispatch, assets_id]);
  
  
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
      if (!formData.voucher) newErrors.voucher = 'voucher is required.';
      if (!formData.invoice_value) newErrors.invoice_value = 'invoice value is required.';
       
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        setIsLoading(true);
        dispatch(UpdateAsset(formData))
          .unwrap()
          .then((data) => {
            setIsLoading(false);
            setFormData({
                profile_id: '',
                voucher: '',
                particulars: '',
                classification: '',
                specification: '',
                location: '',
                invoice_value: '',
                custom_duty: '',
                incidental_expenses: '',
                installation_expenses: '',
                total_cost: '',
                value: '',
                section_rate :'',
                dep_rate: '',
                current_year_depreciation: '',
                accumulated: '',
                section_current_year_depreciation	: '',
                section_accumulated: '',
                value_ca13: '',
                value_section32: '',
                adjustment: '',
                total_depreciation: '',
                profilt_loss: '',
                remarks: '',
            });
            console.log('Form submitted successfully', data);
               navigate('/assets/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Fixed Assets Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Assets List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                         Assets Edit
                    </li>
                  </ol>
                </div>

                <div class="d-flex justify-content-end">
                    <a class="btn ripple btn-default" onClick={handleSubmit} >Update</a>
                    <a class="btn btn-cancel" onClick={() => navigate('/assets/list')}>Cancel</a>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                <div className="card custom-card">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-12">
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">Description of Assets</legend>
                              <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>Voucher No/Date <span className="required">*</span> </label>
                                  <input name="voucher" type="text" className="form-control" value={formData.voucher} onChange={handleInputChange} />
                                  {errors.voucher && <span className="text-danger">{errors.voucher}</span>}

                                </div>

                                <div className="col-md-3">
                                  <label>Particulars </label>
                                  <input name="particulars" type="text" className="form-control" value={formData.particulars} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-3">
                                  <label>Classification </label>
                                  <input name="classification" type="text" className="form-control" value={formData.classification} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-3">
                                  <label>Specification Marks No To  </label>
                                  <input name="specification" type="text" className="form-control" value={formData.specification} onChange={handleInputChange} />
                                </div>
                              </div>

                              <div className="row mt-4">
                                <div className="col-md-3">
                                  <label>Location</label>
                                  <input name="location" type="text" className="form-control" value={formData.location} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-3">
                                  <label>Invoice Value <span className="required">*</span> </label>
                                  <input name="invoice_value" type="number" className="form-control"  value={formData.invoice_value} onChange={handleInputChange}/>
                                  {errors.invoice_value && <span className="text-danger">{errors.invoice_value}</span>}

                                </div>
                                  
                                <div className="col-md-3">
                                  <label>Customs Duty </label>
                                  <input name="custom_duty" type="number" className="form-control" value={formData.custom_duty} onChange={handleInputChange} />
                                </div>
                                
                                <div className="col-md-3">
                                  <label>Other Incidental Expanses </label>
                                  <input name="incidental_expenses" type="number" className="form-control" value={formData.incidental_expenses} onChange={handleInputChange} />
                                </div>
                              </div>

                              <div className="row mt-4">
                                <div className="col-md-3">
                                  <label>Installation Expanses</label>
                                  <input name="installation_expenses" type="number" className="form-control" value={formData.installation_expenses} onChange={handleInputChange}/>
                                </div>
                                <div className="col-md-3">
                                  <label>Total Cost </label>
                                  <input name="total_cost" type="number" className="form-control" value={formData.total_cost} onChange={handleInputChange}/>
                                </div>
                                  
                                <div className="col-md-3">
                                  <label>Value</label>
                                  <input name="value" type="number" className="form-control" value={formData.value} onChange={handleInputChange}/>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>

                          
                        

{/* second form details members */}

                        <div className="row">
                          <div className="col-md-12">
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">Allotment</legend>
                             
                        <div className="row">
                          <div className="col-md-12">
                            <fieldset className="form-group border p-3 mt-2">
                              <legend className="px-2">Depreciation under Provisions of the companies, Act, 2013</legend>
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <label>Rate</label>
                                  <input name="dep_rate" type="number" className="form-control"  value={formData.dep_rate} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-4">
                                  <label>Current Year Depreciation</label>
                                  <input name="current_year_depreciation" type="number" className="form-control"  value={formData.current_year_depreciation} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-4">
                                  <label>Accumulated Depreciation </label>
                                  <input name="accumulated" type="number" className="form-control"  value={formData.accumulated} onChange={handleInputChange}/>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-12">
                            <fieldset className="form-group border p-3 mt-3">
                              <legend className="px-2">Depreciation under section 32 of Income Tax Act, 1996</legend>
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <label>Rate</label>
                                  <input name="section_rate" type="number" className="form-control" value={formData.section_rate} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-4">
                                  <label>Current Year Depreciation</label>
                                  <input name="section_current_year_depreciation" type="number" className="form-control"  value={formData.section_current_year_depreciation} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-4">
                                  <label>Accumulated Depreciation </label>
                                  <input name="section_accumulated" type="number" className="form-control"  value={formData.section_accumulated} onChange={handleInputChange}/>
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>  
                        <div className="row">
                          <div className="col-md-12">
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <label>Value (Companies Act, 2013)</label>
                                  <input name="value_ca13" type="number" className="form-control"  value={formData.value_ca13} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-4">
                                  <label>Value (Section 32)</label>
                                  <input name="value_section32" type="number" className="form-control" value={formData.value_section32} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-4">
                                  <label>Sale / Transfer / Adjustment </label>
                                  <input name="adjustment" type="number" className="form-control"  value={formData.adjustment} onChange={handleInputChange}/>
                                </div>
                              </div>

                              <div className="row mt-4">
                              <div className="col-md-4">
                                  <label>Total Depreciation </label>
                                  <input name="total_depreciation" type="number" className="form-control" value={formData.total_depreciation} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-4">
                                  <label>Profit / Loss on Sale / Transfer Adjustment</label>
                                  <input name="profilt_loss" type="text" className="form-control" value={formData.profilt_loss} onChange={handleInputChange}/>
                                </div>
                                <div className="col-md-4">
                                  <label>Remarks</label>
                                  <input name="remarks" type="text" className="form-control" value={formData.remarks} onChange={handleInputChange} />
                                </div>
                              </div>
                          </div>
                        </div>    
                            </fieldset>
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
