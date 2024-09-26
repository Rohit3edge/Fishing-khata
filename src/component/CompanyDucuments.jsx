import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditComapnyDucuments,UpdateComapnyDucuments } from '../store/slices/management-cost';
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
      id:UserID || '' ,
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
              id : UserID  || '',
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
  

  const [files, setFiles] = useState({
    registration_certificate: null,
    memorandum: null,
    association_articles: null,
    pan_file: null,
    tan_file: null,
  });
  const [validationErrors, setValidationErrors] = useState({
    registration_certificate: null,
    memorandum: null,
    association_articles: null,
    pan_file: null,
    tan_file: null,
  });

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
  
  console.log('file',files);

  const handleSubmit = () => {
    const submitData = new FormData();

    for (let key in files) {
      if (files[key]) {
        // Only append if a file is selected
        submitData.append(key, files[key]);
      }
    }
    
    console.log(formData);
    setIsLoading(true);
    dispatch(UpdateComapnyDucuments(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          id: UserID,
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
                                  <input name="registration_certificate" type="file" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" class="form-control" onChange={handleFileChange} ></input>
                                  {validationErrors.registration_certificate && <p className="text-danger">{validationErrors.registration_certificate}</p>}
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
                                  <input name="memorandum" type="file" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" class="form-control" onChange={handleFileChange} ></input>
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
                                  <input name="association_articles" type="file" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" class="form-control" onChange={handleFileChange} ></input>
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
                                  <input name="pan_file" type="file" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" class="form-control" onChange={handleFileChange} ></input>
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
                                  <input name="tan_file" type="file" accept=".jpeg, .png, .jpg, .webp, .svg, .pdf, .doc, .docx" class="form-control" onChange={handleFileChange} ></input>

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
