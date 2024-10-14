import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {EditDirectors } from '../store/slices/directors';
import { UpdateDirector } from '../store/slices/directors';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch} from 'react-redux';
import AdminLayout from './AdminLayout';

const UpdateDirectors = () => {
  const { id } = useParams();
  const directorId = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.data?.id; // profile_id
  const Name = user?.data?.company_name;
  const currentDate = new Date().toISOString().split('T')[0];
  const [isLoading, setIsLoading] = useState(false);
 

  const [formData, setFormData] = useState({
    profile_id: userId,
    id:directorId,
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

  useEffect(() => {
    if (directorId && userId) {
      setIsLoading(true);
      dispatch(EditDirectors({ profile_id: userId, director_id: directorId }))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const director = data?.data;
          setFormData({
                name: director?.name || '',
                id: director?.id || '',
                type: director?.type || '',
                din: director?.din || '',
                email: director?.email || '',
                phone: director?.phone || '',
                father_name: director?.father_name || '',
                dob: director?.dob || currentDate,
                date_of_resolution: director?.date_of_resolution || '',
                office_of_director: director?.office_of_director || '',
            });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, directorId]);



  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      setIsLoading(true);
      dispatch(UpdateDirector(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            profile_id: '',
            id:'',
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
                    <button class="btn ripple btn-default"  onClick={handleSubmit}>Update</button>
                    <button class="btn btn-cancel"  onClick={() => navigate('/directors/list')} >Cancel</button>
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
                                        
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <label>Father's Name</label>
                                        <input name="father_name" type="text" className="form-control" value={formData.father_name} onChange={handleInputChange}/>
                                       
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Date of Birth <span className="required">*</span></label>
                                        <input name="dob" type="date" className="form-control" value={formData.dob} onChange={handleInputChange}/>
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <label>DIN</label>
                                        <input name="din" type="text" className="form-control" value={formData.din} onChange={handleInputChange}/>
                                       
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Phone Number<span className="required">*</span></label>
                                        <input name="phone" type="text" className="form-control" value={formData.phone} onChange={handleInputChange}/>
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <label>Email Address</label>
                                        <input name="email" type="email" className="form-control" value={formData.email} onChange={handleInputChange}/>
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Date of Board Resolution</label>
                                        <input name="date_of_resolution" type="text" className="form-control"  value={formData.date_of_resolution} onChange={handleInputChange}/>
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <label>Office of Director</label>
                                        <input name="office_of_director" type="text" className="form-control" value={formData.office_of_director} onChange={handleInputChange}/>
                                       
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

export default UpdateDirectors;
