import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { AddDirector } from '../store/slices/directors';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';

const DirectorStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id || '',
    name: '',
    type: '',
    email: '',
    phone: '',
    father_name: '',
    dob: '',
    din: '',
    date_added: '',
    date_of_resolution: '',
    office_of_director: '',
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
      type: '',
      email: '',
      phone: '',
      father_name: '',
      dob: '',
      din: '',
      date_of_resolution: '',
      office_of_director: '',
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.type) newErrors.type = 'Type is required.';
    if (!formData.name) newErrors.name = 'Name is required.';
     
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(AddDirector(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            profile_id: '',
            name: '',
            type: '',
            email: '',
            phone: '',
            father_name: '',
            dob: '',
            din: '',
            date_of_resolution: '',
            office_of_director: '',
          });
          console.log('Form submitted successfully', data);
          navigate('/directors/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Director Create</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Director Create</a>
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn ripple btn-default"  onClick={handleSubmit}>Save</button>
                    <button className="btn btn-cancel" onClick={handleDiscard}>Cancel</button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                    <div className="card custom-card">
                        <div className="card-body">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Type <span className="required">*</span></label>
                                        <select name="type" className="form-control" value={formData.type} onChange={handleInputChange}>
                                            <option  >Select Type</option>
                                            <option  value="Director">Director</option>
                                            <option   value="Promoter">Promoter</option>
                                            <option  value="Member">Member</option>
                                            <option   value="CEO">CEO</option>
                                            <option   value="Employee">Employee</option>
                                        </select>
                                        {errors.type && <span className="text-danger">{errors.type}</span>}
                                    </div>
                                    <div className="col-md-6">
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Name<span className="required">*</span></label>
                                        <input name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}
                                    </div>
                                    <div className="col-md-6">
                                        <label>Father's Name</label>
                                        <input name="father_name" type="text" className="form-control" value={formData.father_name} onChange={handleInputChange}/>
                                        {errors.father_name && <span className="text-danger">{errors.father_name}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Date of Birth <span className="required">*</span></label>
                                        <input name="dob" type="date" className="form-control" value={formData.dob} onChange={handleInputChange}/>
                                        {errors.dob && <span className="text-danger">{errors.dob}</span>}
                                    </div>
                                    <div className="col-md-6">
                                        <label>DIN</label>
                                        <input name="din" type="text" className="form-control" value={formData.din} onChange={handleInputChange}/>
                                        {errors.din && <span className="text-danger">{errors.din}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Phone Number<span className="required">*</span></label>
                                        <input name="phone" type="text" className="form-control" value={formData.phone} onChange={handleInputChange}/>
                                        {errors.phone && <span className="text-danger">{errors.phone}</span>}
                                    </div>
                                    <div className="col-md-6">
                                        <label>Email Address</label>
                                        <input name="email" type="email" className="form-control" value={formData.email} onChange={handleInputChange}/>
                                        {errors.email && <span className="text-danger">{errors.email}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Date of Board Resolution</label>
                                        <input name="date_of_resolution" type="text" className="form-control"  value={formData.date_of_resolution} onChange={handleInputChange}/>
                                        {errors.date_of_resolution && <span className="text-danger">{errors.date_of_resolution}</span>}
                                    </div>
                                    <div className="col-md-6">
                                        <label>Office of Director</label>
                                        <input name="office_of_director" type="text" className="form-control" value={formData.office_of_director} onChange={handleInputChange}/>
                                        {errors.office_of_director && <span className="text-danger">{errors.office_of_director}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* <button type="submit" className="btn btn-default">Submit</button>&nbsp; */}
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

export default DirectorStore;
