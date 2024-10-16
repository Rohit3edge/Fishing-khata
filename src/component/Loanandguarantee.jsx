import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { AddLoans } from '../store/slices/loans';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';


const Loanandguarantee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id || '',
    transaction_nature: '',
    loan_date: '',
    name: '',
    loan_amount: '',
    name_address: '',
    time_period: '',
    purpose: '',
    board_passing_date: '',
    special_passing_date: '',
    interest_rate: '',
    securities_no: '',
    no_paidup: '',
    acquisition_cost: '',
    selling_date: '',
    selling_price: '',
    remarks: '',
    loan_perc: '',
    maturity_date:'',
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
    if (!formData.loan_date) newErrors.loan_date = 'Loan Date is required.';
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.loan_perc) newErrors.loan_perc = '% Of Loan is required.';
     
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(AddLoans(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            profile_id: '',
            transaction_nature: '',
            loan_date: '',
            name: '',
            loan_amount: '',
            name_address: '',
            time_period: '',
            purpose: '',
            board_passing_date: '',
            special_passing_date: '',
            interest_rate: '',
            securities_no: '',
            no_paidup: '',
            acquisition_cost: '',
            selling_date: '',
            selling_price: '',
            remarks: '',
            loan_perc: '',
            maturity_date:'',
          });
          navigate('/loans/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Loan & Guarantee Security Create</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Loans List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Loan & Guarantee Security Create
                    </li>
                  </ol>
                </div>

                <div class="d-flex justify-content-end">
                  <button className="btn ripple btn-default"  onClick={handleSubmit}>Save</button>
                  <button className="btn btn-cancel" onClick={() => navigate('/loans/list')}>Cancel</button>
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
                              <legend className="px-2">Loan Application</legend>
                              <div className="row mt-2">
                              <div className="col-md-3">
                                  <label>Nature Of Transaction </label>
                                  <input name="transaction_nature" type="text" className="form-control" value={formData.transaction_nature} onChange={handleInputChange} />
                                </div>
                              <div class="form-group col-md-3">
                                <label class="">Loan Date    <span className="required">*</span></label>
                                <input class="form-control" name="loan_date" required="" type="date" value={formData.loan_date} onChange={handleInputChange} />
                                {errors.loan_date && <span className="text-danger">{errors.loan_date}</span>}
                              </div>
                                

                                <div className="col-md-3">
                                  <label>Name <span className="required">*</span> </label>
                                  <input name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} />
                                  {errors.name && <span className="text-danger">{errors.name}</span>}
                                </div>

                                <div className="col-md-3">
                                  <label>Loan Amount </label>
                                  <input name="loan_amount" type="number" className="form-control"  value={formData.loan_amount} onChange={handleInputChange}/>
                                </div>
                              </div>

                              <div className="row mt-4">
                                <div className="col-md-4">
                                  <label>Address </label>
                                  <input name="name_address" type="text" className="form-control" value={formData.name_address} onChange={handleInputChange}/>
                                </div>
                                <div className="col-md-3">
                                  <label>Time Preiod</label>
                                  <input name="time_period" type="number" className="form-control" value={formData.time_period} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-3">
                                  <label>Perpose</label>
                                  <input name="purpose" type="text" className="form-control" value={formData.purpose} onChange={handleInputChange}/>
                                </div>
                                <div className="col-md-2">
                                  <label>% Of Loan <span className="required">*</span></label>
                                  <input name="loan_perc" type="number" className="form-control" value={formData.loan_perc} onChange={handleInputChange}/>
                                  {errors.loan_perc && <span className="text-danger">{errors.loan_perc}</span>}
                                </div>

                              </div>

                              <div className="row mt-5">
                                <div className="col-md-3">
                                  <label>Date Of Passing (Borad Resolution)</label>
                                  <input class="form-control" name="board_passing_date" required="" type="date" value={formData.board_passing_date} onChange={handleInputChange}/>
                                </div>
                                <div className="col-md-3">
                                  <label>Date Of Passing (Spacial Resolution)</label>
                                  <input class="form-control" name="special_passing_date" required="" type="date" value={formData.special_passing_date} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-3">
                                  <label>Loan Rate Of Interest</label>
                                  <input name="interest_rate" type="number" className="form-control"  value={formData.interest_rate} onChange={handleInputChange}/>
                                </div>
                                <div className="col-md-3">
                                  <label>Loan Date of Maturity</label>
                                  <input name="maturity_date" type="number" className="form-control"  value={formData.maturity_date} onChange={handleInputChange}/>
                                </div>
                              </div>

                            </fieldset>
                          </div>
                                 <div className="col-md-12">
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">For Acauisition</legend>
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <label>No Of Securities </label>
                                  <input name="securities_no" type="number" className="form-control" value={formData.securities_no} onChange={handleInputChange}/>
                                </div>

                                <div className="col-md-4">
                                  <label>No & Paid Up Value </label>
                                  <input name="no_paidup" type="number" className="form-control" value={formData.no_paidup} onChange={handleInputChange} />
                                </div>
                              

                                <div className="col-md-4">
                                  <label>Cost OD Acquisition</label>
                                  <input name="acquisition_cost" type="munber" className="form-control" value={formData.acquisition_cost} onChange={handleInputChange} />
                                </div>
                                
                              </div>

                              <div className="row mt-4">

                              <div class="form-group col-md-3">
                                <label class="">Selling Date</label>
                                <input class="form-control" name="selling_date" required="" type="date"  value={formData.selling_date} onChange={handleInputChange}/>
                              </div>
                              <div className="col-md-3">
                                  <label>Selling Price </label>
                                  <input name="selling_price" type="number" className="form-control" value={formData.selling_price} onChange={handleInputChange} />
                                </div>
                              
                                <div className="col-md-6">
                                  <label>Remark </label>
                                  <input name="remarks" type="text" className="form-control" value={formData.remarks} onChange={handleInputChange}  />
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
          </div>
        </AdminLayout>
  );
};

export default Loanandguarantee;
