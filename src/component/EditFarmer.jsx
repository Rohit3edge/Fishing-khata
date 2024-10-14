import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { Updatefarmer, Editfarmer } from '../store/slices/farmer';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';

const FarmerEdit = () => {
  const { id } = useParams();
  const farmerId = id;
  console.log('farmerId', farmerId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState({
    profile_image: null,
    pan_card: null,
    uaid_doc: null,
  });
  const [validationErrors, setValidationErrors] = useState({
    profile_image: null,
    pan_card: null,
    uaid_doc: null,
  });

  const imgBaseUrl = 'https://updateproject.com/kisaan-khata-api/public/uploads/farmer_documents/';

  const user = JSON.parse(localStorage.getItem('user'));
  const currentDate = new Date().toISOString().split('T')[0];
  const UserID = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: UserID || '',
    id: farmerId || '',
    name: '',
    gender: 'male',
    dob: '',
    father_name: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    product: '',
    land_holding: '',
    khasrano: '',
    pan: '',
    uaid: '',
    bankname: '',
    ifsc: '',
    profile_image: '',
    pan_card: '',
    uaid_doc: '',
    share_amount: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farmerId && UserID) {
      setIsLoading(true);
      dispatch(Editfarmer({ profile_id: UserID, farmer_id: farmerId }))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const Farmer = data?.data;
          setFormData({
            name: Farmer?.name || '',
            id: Farmer?.id || '',
            profile_id: UserID || '',
            gender: Farmer?.gender || '',
            dob: Farmer?.dob || '',
            father_name: Farmer?.father_name || '',
            address: Farmer?.address || '',
            phone: Farmer?.phone || '',
            email: Farmer?.email || '',
            category: Farmer?.category || '',
            product: Farmer?.product || '',
            land_holding: Farmer?.land_holding || '',
            khasrano: Farmer?.khasrano || '',
            pan: Farmer?.pan || '',
            uaid: Farmer?.uaid || '',
            bankname: Farmer?.bankname || '',
            ifsc: Farmer?.ifsc || '',
            share_amount: Farmer?.share_amount || '',
            profile_image: Farmer?.profile_image || '',
            pan_card: Farmer?.pan_card || '',
            uaid_doc: Farmer?.uaid_doc || '',
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, farmerId]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let error = null;

    if (file) {
      const allowedExtensions = ['.jpg', '.png', '.jpeg', '.pdf', '.doc', '.docx'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes('.' + fileExtension)) {
        error = 'Invalid file type.';
      }
    }

    setFiles((prevFiles) => {
      const updatedFiles = {
        ...prevFiles,
        [name]: file,
      };
      console.log('Updated files state:', updatedFiles); // Debugging line
      return updatedFiles;
    });

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

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
      profile_id: UserID || '',
      id: farmerId || '',
      name: '',
      gender: 'male',
      dob: '',
      father_name: '',
      address: '',
      phone: '',
      email: '',
      category: '',
      product: '',
      land_holding: '',
      khasrano: '',
      pan: '',
      uaid: '',
      bankname: '',
      ifsc: '',
      profile_image: '',
      pan_card: '',
      uaid_doc: '',
      share_amount: '',
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    const submitData = new FormData();

    // Append the text data
    for (let key in formData) {
      submitData.append(key, formData[key]);
    }

    // Append the files
    for (let key in files) {
      if (files[key]) {
        // Only append if a file is selected
        submitData.append(key, files[key]);
      }
    }

    e.preventDefault();
    setIsLoading(true);
    dispatch(Updatefarmer(submitData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          profile_id: UserID || '',
          name: '',
          id: farmerId || '',
          gender: 'male',
          dob: '',
          father_name: '',
          address: '',
          phone: '',
          email: '',
          category: '',
          product: '',
          land_holding: '',
          khasrano: '',
          pan: '',
          uaid: '',
          bankname: '',
          ifsc: '',
          share_amount: '',
        });
        console.log('Form submitted successfully', data);
        navigate('/farmer/list');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Farmer Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Farmer Edit</a>
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={handleSubmit}>
                    Update
                  </button>
                  <button className="btn btn-cancel" onClick={() => navigate('/farmer/list')}>
                    Cancel
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card custom-card mb-4">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>
                              Name <span className="required">*</span>
                            </label>
                            <input name="name" type="text" className="form-control" onChange={handleInputChange} value={formData?.name} />
                          </div>

                          <div className="col-md-4">
                            <label>Gender</label>
                            <br />
                            <label className="rdiobox">
                              <input name="gender" value="male" checked={formData?.gender === 'male'} type="radio" onChange={handleInputChange} /> <span>Male</span>
                            </label>
                            <label className="rdiobox">
                              <input name="gender" value="female" checked={formData?.gender === 'female'} type="radio" onChange={handleInputChange} /> <span>Female</span>
                            </label>
                          </div>

                          <div className="col-md-4">
                            <label>Date of Birth</label>
                            <input name="dob" type="date" className="form-control" onChange={handleInputChange} value={formData?.dob} />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Father's Name</label>
                            <input name="father_name" type="text" className="form-control" onChange={handleInputChange} value={formData?.father_name} />
                          </div>
                          <div className="col-md-4">
                            <label>Address</label>
                            <input name="address" type="text" className="form-control" onChange={handleInputChange} value={formData?.address} />
                          </div>
                          <div className="col-md-4">
                            <label>Phone</label>
                            <input name="phone" type="text" className="form-control" onChange={handleInputChange} value={formData?.phone} />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Email Address</label>
                            <input name="email" type="text" className="form-control" onChange={handleInputChange} value={formData?.email} />
                          </div>
                        </div>
                      </div>

                      <br />
                      <hr />
                      <br />

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Category</label>
                            <input name="category" type="text" className="form-control" onChange={handleInputChange} value={formData?.category} />
                          </div>
                          <div className="col-md-8">
                            <label>Farming Product</label>
                            <input name="product" type="text" className="form-control" onChange={handleInputChange} value={formData?.product} />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Land Record</label>
                            <input name="land_record" type="text" className="form-control" onChange={handleInputChange} value={formData?.land_record} />
                          </div>
                          <div className="col-md-4">
                            <label>Land Holding</label>
                            <input name="land_holding" type="text" className="form-control" onChange={handleInputChange} value={formData?.land_holding} />
                          </div>
                          <div className="col-md-4">
                            <label>Khasra Number</label>
                            <input name="khasra_number" type="text" className="form-control" onChange={handleInputChange} value={formData?.khasra_number} />
                          </div>
                        </div>
                      </div>

                      <br />
                      <hr />
                      <br />

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Share Amount</label>
                            <div className="input-group">
                              <span className="input-group-text" id="basic-addon1">
                                ₹
                              </span>
                              <input
                                aria-describedby="basic-addon1"
                                name="share_amount"
                                aria-label="Username"
                                className="form-control"
                                type="text"
                                onChange={handleInputChange}
                                value={formData?.share_amount}
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <label>PAN</label>
                            <input name="pan" type="text" className="form-control" onChange={handleInputChange} value={formData?.pan} />
                          </div>
                          <div className="col-md-4">
                            <label>UIDAI</label>
                            <input name="uaid" type="text" className="form-control" onChange={handleInputChange} value={formData?.uaid} />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Bank Name</label>
                            <input name="bankname" type="text" className="form-control" onChange={handleInputChange} value={formData?.bankname} />
                          </div>
                          <div className="col-md-4">
                            <label>IFSC</label>
                            <input name="ifsc" type="text" className="form-control" onChange={handleInputChange} value={formData?.ifsc} />
                          </div>
                          <div className="col-md-4">
                            <label>Account Number</label>
                            <input name="account_number" type="text" className="form-control" onChange={handleInputChange} value={formData?.account_number} />
                          </div>
                        </div>
                      </div>

                      <br />
                      <hr />
                      <br />

                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-4">
                            <label>Profile Image</label>
                            <input name="profile_image" type="file" className="form-control" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" onChange={handleFileChange} />
                            {validationErrors.profile_image && <p className="text-danger">{validationErrors.profile_image}</p>}

                            {/* Check if the file is an image or document */}
                            {formData.profile_image &&
                              (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.profile_image) ? (
                                <img src={imgBaseUrl + formData.profile_image} alt="profile_image" style={{ width: '200px' }} />
                              ) : (
                                <a href={imgBaseUrl + formData.profile_image} download target='_blank'>
                                  Download Profile Document
                                </a>
                              ))}
                          </div>

                          <div className="col-md-4">
                            <label>PAN Card</label>
                            <input name="pan_card" type="file" className="form-control" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" onChange={handleFileChange} />
                            {validationErrors.pan_card && <p className="text-danger">{validationErrors.pan_card}</p>}

                            {/* Check if the file is an image or document */}
                            {formData.pan_card &&
                              (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.pan_card) ? (
                                <img src={imgBaseUrl + formData.pan_card} alt="pan_card" style={{ width: '200px' }} />
                              ) : (
                                <a href={imgBaseUrl + formData.pan_card} download target='_blank'>
                                  Download PAN Card
                                </a>
                              ))}
                          </div>

                          <div className="col-md-4">
                            <label>UIDAI</label>
                            <input name="uaid_doc" type="file" className="form-control" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" onChange={handleFileChange} />
                            {validationErrors.uaid_doc && <p className="text-danger">{validationErrors.uaid_doc}</p>}

                            {/* Check if the file is an image or document */}
                            {formData.uaid_doc &&
                              (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.uaid_doc) ? (
                                <img src={imgBaseUrl + formData.uaid_doc} alt="uaid_doc" style={{ width: '200px' }} />
                              ) : (
                                <a href={imgBaseUrl + formData.uaid_doc} download target='_blank'>
                                  Download UIDAI Document
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
        </AdminLayout>
  );
};

export default FarmerEdit;
