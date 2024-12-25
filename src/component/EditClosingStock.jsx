import React, { useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Updateclosingstock ,Getclosingstock} from '../store/slices/bankbook';
import Loader from '../common/Loader';
import AdminLayout from './AdminLayout';

const EditClosingStock = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closingstockid } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const profileId = user?.data?.id;

  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id: closingstockid,
    profile_id: profileId,
    closing_value: '',
    dr_cr: 'CR',
    closing_date: currentDate,
  });

  const [errors, setErrors] = useState({});


  useEffect(() => {
    setIsLoading(true);
    dispatch(Getclosingstock(closingstockid))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log(data.data);

        // Update formData with the received response
        setFormData((prevState) => ({
          ...prevState,
          closing_value: data.data.closing_value || '',
          dr_cr: data.data.dr_cr || prevState.dr_cr,
          closing_date: data.data.closing_date || prevState.closing_date,
        }));
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [closingstockid, dispatch]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      dr_cr: e.target.value.toUpperCase(),
    }));
  };

  const handleDiscard = () => {
    setFormData({
      profile_id: profileId,
      closing_value: '',
      dr_cr: 'DR',
      closing_date: currentDate,
    });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.closing_value || parseFloat(formData.closing_value) <= 0) {
      newErrors.closing_value = 'Please enter a valid closing value greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    if (validate()) {
      setIsLoading(true);
      dispatch(Updateclosingstock(formData))
        .unwrap()
        .then(() => {
          setIsLoading(false);
          navigate('/closingstocklist');
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
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
              <h2 className="main-content-title tx-24 mg-b-5">Closing Stock</h2>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Closing Stock</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Closing Stock
                </li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="card custom-card">
                <div className="card-body">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="col-black mb-0">
                            Closing Value <span className="required">*</span>
                          </label>
                          <div className="ml-2">
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="transactionType"
                                id="credit"
                                value="CR"
                                onChange={handleRadioChange}
                                checked={formData.dr_cr === 'CR'}
                              />
                              <label className="form-check-label" htmlFor="credit">
                                Cr
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="transactionType"
                                id="debit"
                                value="DR"
                                onChange={handleRadioChange}
                                checked={formData.dr_cr === 'DR'}
                              />
                              <label className="form-check-label" htmlFor="debit">
                                Dr
                              </label>
                            </div>
                          </div>
                        </div>
                        <input
                          name="closing_value"
                          type="text"
                          className="form-control"
                          onChange={handleInputChange}
                          value={formData.closing_value}
                        />
                        {errors?.closing_value && (
                          <span className="alert-message">{errors.closing_value}</span>
                        )}
                      </div>
                      <div className="col-md-6">
                        <label>
                          Closing Date <span className="required">*</span>
                        </label>
                        <input
                          name="closing_date"
                          type="date"
                          className="form-control"
                          onChange={handleInputChange}
                          value={formData.closing_date}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <button type="button" className="btn btn-default" onClick={handleSubmit}>
                          Submit
                        </button>
                        &nbsp;
                        <button type="button" className="btn btn-cancel" onClick={handleDiscard}>
                          Cancel
                        </button>
                        &nbsp;
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

export default EditClosingStock;
