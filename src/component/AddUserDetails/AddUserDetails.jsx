import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Updateclients, GetState, Editclients, LicenceCheck } from '../../store/slices/client';
import Select from 'react-select';
import Loader from '../../common/Loader';

const AddUserDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [getState, setGetState] = useState([]);

  const [licenceError, setLicenceError] = useState('');
  const [selectedState, setSelectedstate] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const UserID = user?.data?.id;

  const [formData, setFormData] = useState({
    id: UserID || '',
    name: '',
    address: '',
    email: '',
    phoneno: '',
    lic_validity_days: '',
    gst: '',
    company_name: '',
    da_type: '',
    partner_id: '',
    date_added: currentDate,
    module: '',
    state: '',
    city: '',
    licence_key: '',
  });

  // Fetch parties

  useEffect(() => {
    fetchStates();
  }, [dispatch, UserID]);

  const [errors, setErrors] = useState({});

  const fetchStates = async () => {
    try {
      const data = await dispatch(GetState()).unwrap();
      setGetState(data?.data);
      return data?.data;
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };

  useEffect(() => {
    if (UserID) {
      setIsLoading(true);
      dispatch(Editclients({ id: UserID }))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          console.log('item', item);
          if (item?.state) {
            fetchStates().then((ndata) => {
              handleStateChange(item?.state, ndata, true);
            });
          }
          setFormData((prevFormData) => ({
            ...prevFormData,
            id: UserID || '',
            name: item?.name || '',
            address: item?.address || '',
            email: item?.email || '',
            phoneno: item?.phoneno || '',
            lic_validity_days: item?.lic_validity_days || '',
            gst: item?.gst || '',
            company_name: item?.company_name || '',
            da_type: item?.da_type || '',
            partner_id: item?.partner_id || '',
            date_added: item?.date_added || '',
            state: item?.state || '',
            city: item?.city || '',
            profile_img: item?.profile_img || '',
            licence_key: item?.licence_key || '',
          }));
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, UserID]);

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    // Handle licence_key logic
    if (name === 'licence_key') {
      if (!formData.partner_id) {
        setLicenceError('Select Client Ownership');
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));

        // Dispatch the LicenceCheck action to validate the license key
        dispatch(LicenceCheck({ licence_key: value, partner_id: formData.partner_id }))
          .unwrap()
          .then((response) => {
            if (response.status) {
              setLicenceError('');
            } else {
              setLicenceError(response.message);
            }
          })
          .catch((error) => {
            console.log('Error checking Licence:', error);
          });
      }
      return;
    }

    // GST validation logic
    if (name === 'gst') {
      if (!gstRegex.test(value)) {
        setErrors((prevState) => ({
          ...prevState,
          gst: 'Invalid GST number. Please enter a valid GSTIN.',
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          gst: '',
        }));
      }
    }

    // Handle checkbox selection for modules
    if (checked) {
      setSelectedModules((prev) => [...prev, value]);
    } else {
      setSelectedModules((prev) => prev.filter((module) => module !== value));
    }

    // Handle number validation for opening balance
    if (name === 'opening_balance') {
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
  //   setSelectedstate
  const handleStateChange = (selectedOption, ndata, isData) => {
    const finalSelectedOption = isData ? selectedOption : selectedOption?.value;

    if (!finalSelectedOption) {
      setSelectedstate(null);
      setFormData((prevFormData) => ({ ...prevFormData, state: null }));
      return;
    }

    // Get the correct state data array
    const getStateData = isData ? ndata : getState;
    const matchedParty = getStateData?.find((p) => p?.state_name === finalSelectedOption);
    if (!matchedParty) {
      setSelectedstate(null);
      setFormData((prevFormData) => ({ ...prevFormData, state: null }));
      return;
    }

    setSelectedstate(matchedParty.state_name);
    setFormData((prevFormData) => ({ ...prevFormData, state: matchedParty.state_name }));
  };

  const statesOptions = getState?.map((state) => ({
    value: state?.state_name,
    label: state?.state_name,
  }));

  const [files, setFiles] = useState({
    profile_img: null,
  });
  const [validationErrors, setValidationErrors] = useState({
    profile_img: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let error = null;

    if (file) {
      const allowedExtensions = ['.jpg', '.png', '.jpeg'];
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

  const validate = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.company_name) newErrors.company_name = 'Company Name is required.';
    if (!formData.state) newErrors.state = 'State is required.';
    if (!formData.phoneno) newErrors.phoneno = 'State is required.';
    // if (!formData.email) newErrors.email = 'Email is required.';
    if (!formData.gst) newErrors.gst = 'GST Number is required.';
    if (!formData.address) newErrors.address = 'Address is required.';
    if (!formData.city) newErrors.city = 'City is required.';
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
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

    if (validate()) {
      // Submit the form data
      setIsLoading(true);
      dispatch(Updateclients(submitData)) // Using FormData directly here
        .unwrap()
        .then((data) => {
          console.log(data?.data);
          // Cookies.set('user', JSON.stringify(data?.data));
          // localStorage.setItem("user", JSON.stringify(data?.data));
          setIsLoading(false);
          navigate('/companydocuments');
          setFormData({
            id: UserID || '',
            name: '',
            address: '',
            email: '',
            phoneno: '',
            lic_validity_days: '',
            gst: '',
            company_name: '',
            da_type: '',
            partner_id: '',
            date_added: currentDate,
            module: '',
            state: '',
            city: '',
            licence_key: '',
            profile_img: '',
          });
          setFiles({
            profile_img: null,
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  };

  return (
    <>
  {isLoading && <Loader isLogin={true} />}
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="card custom-card w-50" style={{ border: 'none' }}>
          <div className="card-body">
            <h3 className="font-weight-bold mb-4" style={{ borderBottom: '1px solid' }}>
              Profile Details
            </h3>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label>
                    Company Name <span class="required">*</span>
                  </label>
                  <input name="company_name" type="text" class="form-control" value={formData.company_name} onChange={handleInputChange} />
                  {errors.company_name && <span className="text-danger">{errors.company_name}</span>}
                </div>
                <div class="col-md-6">
                  <label>
                    Name <span class="required">*</span>
                  </label>
                  <input name="name" type="text" className="form-control" value={formData.name} onChange={handleInputChange} />
                  {errors.name && <span className="text-danger">{errors.name}</span>}
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label>
                    Address <span class="required">*</span>
                  </label>
                  <input name="address" rows="2" cols="20" maxlength="150" id="address" class="form-control mt_5" value={formData.address} onChange={handleInputChange}></input>
                  {errors.address && <span className="text-danger">{errors.address}</span>}
                </div>

                <div class="col-md-6">
                  <label>
                    City <span class="required">*</span>
                  </label>
                  <input name="city" type="text" class="form-control" required value={formData.city} onChange={handleInputChange} />
                  {errors.city && <span className="text-danger">{errors.city}</span>}
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label>
                    State<span class="required">*</span>{' '}
                  </label>
                  <Select
                    options={statesOptions}
                    name="state"
                    placeholder="--Select State--"
                    required
                    onChange={handleStateChange}
                    value={statesOptions?.find((option) => option?.value == selectedState) || null}
                  />
                  {errors.state && <span className="text-danger">{errors.state}</span>}
                </div>
                <div class="col-md-6">
                  <label>
                    Phone No <span class="required">*</span>
                  </label>
                  <input name="phoneno" type="number" className="form-control" value={formData.phoneno} onChange={handleInputChange} />
                  {errors.phoneno && <span className="text-danger">{errors.phoneno}</span>}
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label>
                    Email <span class="required">*</span>
                  </label>
                  <input name="email" type="text" class="form-control" value={formData.email} onChange={handleInputChange} readonly="readonly" />
                  {errors.email && <span className="text-danger">{errors.email}</span>}
                </div>
                <div class="col-md-6">
                  <label>
                    GST Number <span class="required">*</span>
                  </label>
                  <input name="gst" type="text" class="form-control" value={formData.gst} onChange={handleInputChange} />
                  {errors.gst && <span className="text-danger">{errors.gst}</span>}
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-md-6">
                  <label>Logo</label>
                  <input name="profile_img" type="file" class="form-control" accept=".jpeg, .png, .jpg, .webp, .svg" onChange={handleFileChange} />{' '}
                </div>
              </div>
              <div className="col-sm-6 ">
                {formData.profile_img &&
                  (/\.(jpeg|jpg|png|webp|svg)$/i.test(formData.profile_img) ? (
                    <img src={formData.profile_img} alt="profile_img" style={{ width: '100px' }} />
                  ) : (
                    <a href={formData.profile_img} download target="_blank">
                      Download Image
                    </a>
                  ))}
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-12 ">
                  <button type="submit" className="btn btn-default" style={{ float: 'right' }} onClick={handleSubmit}>
                    Next
                  </button>
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserDetails;
