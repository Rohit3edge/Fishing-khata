import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import { GetPaymentMethods} from '../store/slices/sale';
import {PaymentOutGetByCustomer,AddPaymentout,GetPurchaseVoucherDetail} from "../store/slices/purchase"
import Select from 'react-select';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';

const AddPaymentOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [byCustomer, setByCustomer] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id,
    party_ledger_id: '',
    ref_id: '',
    amount_paid: '',
    payment_date: '',
    ledger_id: "",
    payment_mode: '',
    transaction_number: '',
    notes: '',
    bank_name: ""
  });


  const [errors, setErrors] = useState({});

  const partyOptions = listParties.map((party) => ({
    value: party.id,
    label: party.ledger,
  }));

  // Fetch parties
  useEffect(() => {
    setIsLoading(true);
    dispatch(ListParties({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListParties(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, id]);

  // Fetch payment methods
  useEffect(() => {
    setIsLoading(true);
    dispatch(GetPaymentMethods({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setPaymentMethods(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, id]);

  const handleGetCustomer = async (partyId) => {
    setIsLoading(true);
    try {
      const data = await dispatch(PaymentOutGetByCustomer({ profile_id: id, customer_id: partyId })).unwrap();
      setByCustomer(data?.data || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartyChange = (selectedOption) => {
    setSelectedParty(selectedOption);
    const partyId = selectedOption.value;
    setFormData({ ...formData, party_ledger_id: partyId});
    handleGetCustomer(partyId);
  };

  const handleInvoiceChange = (e) => {
    const invoiceNumber = e.target.value;
    const invoice = byCustomer?.find((inv) => inv?.bill_no == invoiceNumber);
    fetchPurchaseVoucherDetails(invoice?.id)
    setFormData({ ...formData, ref_id: invoiceNumber });
  };


  const fetchPurchaseVoucherDetails = async (Id) => {
    setIsLoading(true);
    dispatch(GetPurchaseVoucherDetail({ profile_id: id, invoice_id: Id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log('data data', data?.data);
        const purchasevoucher = data?.data;
        setSelectedInvoice(purchasevoucher);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the name is payment_mode
    if (name === "payment_mode") {
      // Find the ledger based on the selected value
      const PaymentMethods = paymentMethods?.find((p) => p.id === value)?.ledger;
      const uPaymentMethods= PaymentMethods=="Cash" ?"Cash":"Bank"
      const bankname =PaymentMethods=="Cash" ? " ":PaymentMethods
      setFormData((prevData) => ({
        ...prevData,
        payment_mode: uPaymentMethods, 
        ledger_id: value, 
        bank_name:bankname,            
      }));
      
      console.log("Payment Mode (Ledger):", PaymentMethods);
      console.log("Ledger ID:", value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  // Date validation to prevent future dates
  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    return selectedDate <= currentDate;
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.party_ledger_id) newErrors.party_ledger_id = 'Customer is required.';
    if (!formData.amount_paid || isNaN(formData.amount_paid) || formData.amount_paid <= 0) newErrors.amount_paid = 'Valid amount is required.';
    if (!formData.payment_date || !validateDate(formData.payment_date)) newErrors.payment_date = 'Please select a valid date (not in the future).';
    if (!formData.payment_mode) newErrors.payment_mode = 'Payment mode is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        setIsLoading(true);
        const data = await dispatch(AddPaymentout(formData)).unwrap();
        console.log(data)
        setIsLoading(false);
        navigate('/purchase/paymentoutlist');
        
      } catch (error) {
        setIsLoading(false);
        console.error(error.message); // or show a toast or error message
      }
    }
  };
  
  const handleDiscard = () => {
    navigate('/purchase/paymentoutlist');
  };
  return (
    <div>
      <div class="row" style={{ marginLeft: '0', marginRight: '0' }}>
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
                  <h2 class="main-content-title tx-24 mg-b-5">Payment</h2>

                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                     Payment Out
                    </li>
                  </ol>
                </div>
                
              </div>
              <div class="row">
                <div class="col-md-8">
                  <div class="card custom-card">
                    <div class="card-body">
                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>
                              Customer <span className="required">*</span>
                            </label>
                            <Select options={partyOptions} placeholder="--Select Customer--" onChange={handlePartyChange} value={selectedParty} />
                            {errors.party_ledger_id && <p className="text-danger">{errors.party_ledger_id}</p>}
                          </div>

                          <div class="col-md-6">
                            <label>
                            Purchase Voucher
                            </label>
                            <select name="ref_id" class="form-control" onChange={handleInvoiceChange} value={selectedInvoice?.ref_id}>
                              <option value="">--Select Invoice--</option>
                              {byCustomer?.map((option, index) => (
                                <option key={index} value={option?.bill_no}>
                                  {option?.bill_no}
                                </option>
                              ))}
                            
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label> 
                              Amount Paid <span class="required">*</span>
                              </label>
                            <div class="input-group">
                              <span class="input-group-text" id="basic-addon1">
                                ₹
                              </span>
                              <input name='amount_paid' aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" value={formData.amount_paid} onChange={handleInputChange}></input>
                              
                            </div>
                            {errors.amount_paid && <p className="text-danger">{errors.amount_paid}</p>}
                          </div>
                          <div class="col-md-6">
                            <label>
                              Payment Date <span class="required" >*</span>
                            </label>
                            <input name="payment_date" type="date" class="form-control" value={formData.payment_date} onChange={handleInputChange} ></input>
                            {errors.payment_date && <p className="text-danger">{errors.payment_date}</p>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>
                              Payment Mode  <span class="required">*</span>
                              </label>

                            <select name="payment_mode" class="form-control" value={formData.ledger_id} onChange={handleInputChange}>
                              <option value="">--Payment Mode--</option>
                              {paymentMethods?.map((option, index) => (
                                <option key={index} value={option?.id}>
                                  {option?.ledger}
                                </option>
                              ))}
                            </select>
                            {errors.payment_mode && <p className="text-danger">{errors.payment_mode}</p>}
                          </div>
                          <div class="col-md-6">
                            <label>Transaction ID</label>
                            <input name="transaction_number" type="text" class="form-control" value={formData.transaction_number} onChange={handleInputChange}></input>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-12">
                            <label>Notes</label>
                            <textarea name="notes" rows="5" cols="70" class="form-control" value={formData.notes} onChange={handleInputChange}></textarea>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <button type="button" class="btn btn-default" onClick={handleSubmit}>
                              Submit
                            </button>
                            &nbsp;
                            <button type="button" class="btn btn-cancel" onClick={handleDiscard}>
                              Cancel
                            </button>
                            &nbsp;
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedInvoice ? (
                  <div class="col-md-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <table className="table">
                        <tr>
                            <th>Name</th>
                            <td>{selectedInvoice?.party?.name }</td>
                          </tr>
                          <tr>
                            <th>Phone Number</th>
                            <td>{selectedInvoice?.party?.phone}</td>
                          </tr>
                          <tr>
                            <th>Billing Address</th>
                            <td>{selectedInvoice?.party?.state}</td>
                          </tr>
                          <tr>
                            <th>Bill Date</th>
                            <td>{selectedInvoice?.invoice?.bill_date}</td>
                          </tr>
                          <tr>
                            <th>Invoice Amount</th>
                            <td>₹ {selectedInvoice?.invoice?.total_amount}</td>
                          </tr>
                          <tr>
                            <th>Paid Amount</th>
                            <td>₹ {selectedInvoice?.invoice?.balance_amount&&selectedInvoice?.invoice?.total_amount?parseFloat(selectedInvoice?.invoice?.balance_amount)- parseFloat(selectedInvoice?.invoice?.total_amount):0}</td>
                          </tr>
                          <tr>
                            <th>Balance Amount</th>
                            <td>₹ {selectedInvoice?.invoice?.balance_amount}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddPaymentOut;
