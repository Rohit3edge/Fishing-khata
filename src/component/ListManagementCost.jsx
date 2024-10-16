import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditManagementCost,UpdateManagementCost } from '../store/slices/management-cost';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import Navbarside from './Navbarside';
import Footer from './Footer';
import AdminLayout from './AdminLayout';

const ListManagement = () => {
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const UserID = user?.data?.id;
  const Name = user?.data?.company_name;

  const [units, setUnits] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profile_id: UserID,
    cost1_name: '',
    cost1: '',
    cost2_name: '',
    cost2: '',
    cost3_name: '',
    cost3: '',
    cost4_name: '',
    cost4: '',
    cost5_name: '',
    cost5: '',
    cost6_name: '',
    cost6: '',
  });

  const [showProductDetails, setShowProductDetails] = useState(true);


  useEffect(() => {
    if (UserID) {
      setIsLoading(true);
      dispatch(EditManagementCost({ profile_id: UserID})) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          setFormData({
                id : item?.id || '',
                profile_id : UserID|| '',
                cost1_name:item?.cost1_name || '',
                cost1: item?.cost1 || '',
                cost2_name: item?.cost2_name || '',
                cost2: item?.cost2 || '',
                cost3_name: item?.cost3_name || '',
                cost3: item?.cost3 || '',
                cost4_name: item?.cost4_name || '',
                cost4: item?.cost4 || '',
                cost5_name: item?.cost5_name || '',
                cost5: item?.cost5 || '',
                cost6_name: item?.cost6_name || '',
                cost6: item?.cost6 || '',
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, UserID]);
  

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, type: value });
    setShowProductDetails(value === 'Product');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'sale_price' || name === 'purchase_price') {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  
  const handleSubmit = () => {
    setIsLoading(true);
    dispatch(UpdateManagementCost(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          profile_id: UserID,
          cost1_name: '',
          cost1: '',
          cost2_name: '',
          cost2: '',
          cost3_name: '',
          cost3: '',
          cost4_name: '',
          cost4: '',
          cost5_name: '',
          cost5: '',
          cost6_name: '',
          cost6: '',
        });
        navigate('/management-cost/list');
        EditSumbitdata();
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  const EditSumbitdata = () => {
    if (UserID) {
      setIsLoading(true);
      dispatch(EditManagementCost({ profile_id: UserID})) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          setFormData({
                id : item?.id || '',
                profile_id : UserID|| '',
                cost1_name:item?.cost1_name || '',
                cost1: item?.cost1 || '',
                cost2_name: item?.cost2_name || '',
                cost2: item?.cost2 || '',
                cost3_name: item?.cost3_name || '',
                cost3: item?.cost3 || '',
                cost4_name: item?.cost4_name || '',
                cost4: item?.cost4 || '',
                cost5_name: item?.cost5_name || '',
                cost5: item?.cost5 || '',
                cost6_name: item?.cost6_name || '',
                cost6: item?.cost6 || '',
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Management Cost Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Registers</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                       Management Cost Edit
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={handleSubmit}>
                       Update
                  </button>
                  <button class="btn btn-cancel"  onClick={() => navigate('/registers')} >Cancel</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-8">
                  <div class="card custom-card">
                    <div class="card-body">
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-6">
                                  <label>Management Name 1</label>
                                  <input name="cost1_name" type="text" class="form-control" onChange={handleInputChange} value={formData.cost1_name}></input>
                              </div>
                              <div class="col-md-6">
                                  <label>Management Cost 1</label>
                                  <input name="cost1" type="number" class="form-control" onChange={handleInputChange} value={formData.cost1}></input>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-6">
                                  <label>Management Name 2</label>
                                  <input name="cost2_name" type="text" class="form-control" onChange={handleInputChange} value={formData.cost2_name}></input>
                              </div>
                              <div class="col-md-6">
                                  <label>Management Cost 2</label>
                                  <input name="cost2" type="number" class="form-control" onChange={handleInputChange} value={formData.cost2}></input>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-6">
                                  <label>Management Name 3</label>
                                  <input name="cost3_name" type="text" class="form-control" onChange={handleInputChange} value={formData.cost3_name}></input>
                              </div>
                              <div class="col-md-6">
                                  <label>Management Cost 3</label>
                                  <input name="cost3" type="number" class="form-control" onChange={handleInputChange} value={formData.cost3}></input>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-6">
                                  <label>Management Name 4</label>
                                  <input name="cost4_name" type="text" class="form-control" onChange={handleInputChange} value={formData.cost4_name}></input>
                              </div>
                              <div class="col-md-6">
                                  <label>Management Cost 4</label>
                                  <input name="cost4" type="number" class="form-control"  onChange={handleInputChange} value={formData.cost4}></input>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-6">
                                  <label>Management Name 5</label>
                                  <input name="cost5_name" type="text" class="form-control" onChange={handleInputChange} value={formData.cost5_name}></input>
                              </div>
                              <div class="col-md-6">
                                  <label>Management Cost 5</label>
                                  <input name="cost5" type="number" class="form-control" onChange={handleInputChange} value={formData.cost5}></input>
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-6">
                                  <label>Management Name 6</label>
                                  <input name="cost6_name" type="text" class="form-control" onChange={handleInputChange} value={formData.cost6_name}></input>
                              </div>
                              <div class="col-md-6">
                                  <label>Management Cost 6</label>
                                  <input name="cost6" type="number " class="form-control" onChange={handleInputChange} value={formData.cost6}></input>
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

export default ListManagement;
