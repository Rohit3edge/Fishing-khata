import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditComapnyDucuments,UpdateManagementCost } from '../store/slices/management-cost';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import Navbarside from './Navbarside';
import Footer from './Footer';

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
    registration_certificate: '',
    memorandum: '',
    association_articles: '',
    pan_file: '',
    tan_file: '',
  });

  const [showProductDetails, setShowProductDetails] = useState(true);


  useEffect(() => {
    if (UserID) {
      setIsLoading(true);
      dispatch(EditComapnyDucuments({ profile_id: UserID})) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.documents;
          console.log('item',item);
          setFormData({
                id : item?.id || '',
                profile_id : UserID|| '',
                cost1_name:item?.cost1_name || '',
                registration_certificate: item?.registration_certificate || '',
                memorandum: item?.memorandum || '',
                association_articles: item?.association_articles || '',
                pan_file: item?.pan_file || '',
                tan_file: item?.tan_file || '',
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
    console.log(formData);
    setIsLoading(true);
    dispatch(UpdateManagementCost(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          profile_id: UserID,
          registration_certificate: '',
            memorandum: '',
            association_articles: '',
            pan_file: '',
            tan_file: '',
        });
        navigate('/management-cost/list');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  return (
    <div>
      <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
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
                  <h2 className="main-content-title tx-24 mg-b-5">Company Documents Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Registers</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Company Documents Edit
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
                              <div class="col-md-8">
                                  <label>Certificate of Registration</label>
                                  <input name="registration_certificate" type="file" class="form-control" onChange={handleInputChange} ></input>
                              </div>
                              <div className="col-sm-4 my-4">
                              {formData.registration_certificate &&
                                (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.registration_certificate) ? (
                                    <img src={formData.registration_certificate} alt="registration_certificate" style={{ width: '200px' }} />
                                ) : (
                                    <a href={formData.registration_certificate} download target='_blank'>
                                       Download Certificate of Registration
                                    </a>
                                ))}
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-8">
                                  <label>Memorandum</label>
                                  <input name="memorandum" type="file" class="form-control" onChange={handleInputChange} ></input>
                              </div>
                              <div className="col-sm-4 my-4">
                                {formData.memorandum &&
                                (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.memorandum) ? (
                                    <img src={formData.memorandum} alt="memorandum" style={{ width: '200px' }} />
                                ) : (
                                    <a href={formData.memorandum} download target='_blank'>
                                       Download Memorandum
                                    </a>
                                ))}
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-8">
                                  <label>Articles of Association</label>
                                  <input name="association_articles" type="file" class="form-control" onChange={handleInputChange} ></input>
                              </div>
                              <div className="col-sm-4 my-4">
                                   {formData.association_articles &&
                                        (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.association_articles) ? (
                                            <img src={formData.association_articles} alt="association_articles" style={{ width: '200px' }} />
                                        ) : (
                                            <a href={formData.association_articles} download target='_blank'>
                                            Download Articles of Association
                                            </a>
                                    ))}
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-8">
                                  <label>Company PAN</label>
                                  <input name="pan_file" type="file" class="form-control" onChange={handleInputChange} ></input>
                              </div>
                              <div className="col-sm-4 my-4">
                                   {formData.pan_file &&
                                        (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.pan_file) ? (
                                            <img src={formData.pan_file} alt="pan_file" style={{ width: '200px' }} />
                                        ) : (
                                            <a href={formData.pan_file} download target='_blank'>
                                            Download Company PAN
                                            </a>
                                    ))}
                              </div>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-8">
                                  <label>Company TAN</label>
                                  <input name="tan_file" type="file" class="form-control" onChange={handleInputChange} ></input>

                              </div>
                              <div className="col-sm-4 my-4">
                                   {formData.tan_file &&
                                        (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.tan_file) ? (
                                            <img src={formData.tan_file} alt="tan_file" style={{ width: '200px' }} />
                                        ) : (
                                            <a href={formData.tan_file} download target='_blank'>
                                            Download Company PAN
                                            </a>
                                    ))}
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

export default ListManagement;
