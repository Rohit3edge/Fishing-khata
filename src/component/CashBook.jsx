import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import {GetClientsDetail} from '../store/slices/auth'
import { UpdateCashOpeningBalance } from '../store/slices/bankbook';
import Loader from '../common/Loader';

const CashBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    id:id,
    cash_opening_balance: '',
    cash_opening_balance_date: '',
  });

  const [errors, setErrors] = useState({});


  useEffect(() => {

    fetchClientDetails()
    // Get the current date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
    // Set date and date_as_of to the current date in formData
    setFormData((prevData) => ({
      ...prevData,
      cash_opening_balance_date: formattedDate,
    }));
  }, []);


  const fetchClientDetails = async () => {
    try {
      const data = await dispatch(GetClientsDetail({ id: id })).unwrap();
      setFormData((prevData) => ({
        ...prevData,
        cash_opening_balance: data?.user?.data?.cash_opening_balance,
        cash_opening_balance_date: data?.user?.data?.cash_opening_balance_date,
      }));
    } catch (error) {
      console.log('Error fetching ClientDetails:', error.message);
    }
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cash_opening_balance') {
      // Allow only numbers with 2 decimal places
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
      id:id,
      cash_opening_balance: '',
      cash_opening_balance_date: currentDate,
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.cash_opening_balance || parseFloat(formData.cash_opening_balance) <= 0) newErrors.cash_opening_balance = 'Please enter a valid amount greater than 0.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      dispatch(UpdateCashOpeningBalance(formData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData({
            id:id,
            cash_opening_balance: '',
            cash_opening_balance_date: currentDate,
          });
          fetchClientDetails()
          console.log('Form submitted successfully', data);
          navigate('/');
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  };
  console.log(formData)

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
                  <h2 className="main-content-title tx-24 mg-b-5">Cash Book</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Cash Book</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add CashBook Opening Balance
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
                            <label>
                              Opening Balance <span className="required">*</span>
                            </label>
                            <input
                              name="cash_opening_balance"
                              type="text"
                              className="form-control"
                              onChange={handleInputChange}
                              value={Number(formData.cash_opening_balance) || 0.00}
                            />
                            {errors.cash_opening_balance && <span className="alert-message">{errors.cash_opening_balance}</span>}
                          </div>
                          <div className="col-md-6">
                            <label>
                              Date <span className="required">*</span>
                            </label>
                            <input
                              name="cash_opening_balance_date"
                              type="date"
                              className="form-control"
                              onChange={handleInputChange}
                              value={formData.cash_opening_balance_date || currentDate}
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CashBook;
