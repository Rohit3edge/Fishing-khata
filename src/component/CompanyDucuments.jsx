import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditComapnyDucuments,UpdateComapnyDucuments } from '../store/slices/management-cost';
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

  console.log("formData.id",UserID)

  const imgBaseUrl = 'https://updateproject.com/kisaan-khata-api/public/uploads/farmer_documents/';
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

  const fetchComapnyDucuments = async () => {
    if (UserID) {
      setIsLoading(true);
      dispatch(EditComapnyDucuments({ profile_id: UserID}))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.documents;
          console.log('item',item);
          setFormData((prevState) =>( {
             ...prevState, 
              registration_certificate: item?.registration_certificate || '',
              memorandum: item?.memorandum || '',
              association_articles: item?.association_articles || '',
              pan_file: item?.pan_file || '',
              tan_file: item?.tan_file || '',
          }));
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  };
  useEffect(() => {
    fetchComapnyDucuments()
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
  


  const handleSubmit = () => {
    const submitData = new FormData();
    
  console.log("formData.id",formData.id)
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
  
    // Submit the form data
    setIsLoading(true);
    dispatch(UpdateComapnyDucuments(submitData))  // Using FormData directly here
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          registration_certificate: '',
          memorandum: '',
          association_articles: '',
          pan_file: '',
          tan_file: '',
        });
        setFiles({
          registration_certificate: null,
          memorandum: null,
          association_articles: null,
          pan_file: null,
          tan_file: null,
        })
        fetchComapnyDucuments()
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
                                    <img src={ formData.registration_certificate} alt="registration_certificate" style={{ width: '100px' }} />
                                ) : (
                                    <a href={ formData.registration_certificate} download target='_blank'>
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
                                    <img src={formData.memorandum} alt="memorandum" style={{ width: '100px' }} />
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
                                            <img src={formData.association_articles} alt="association_articles" style={{ width: '100px' }} />
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
                                            <img src={formData.pan_file} alt="pan_file" style={{ width: '100px' }} />
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
                                            <img src={formData.tan_file} alt="tan_file" style={{ width: '100px' }} />
                                        ) : (
                                            <a href={ formData.tan_file} download target='_blank'>
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
        </AdminLayout>
  );
};

export default ListManagement;
