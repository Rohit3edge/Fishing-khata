import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import { GetPaymentMethods, GetByCustomer,GetSinglePaymentDetail ,UpdatePayment} from '../store/slices/sale';
import Moment from 'moment';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../common/Loader';

const EditInvoicePayment = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [byCustomer, setByCustomer] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const Id = user?.data?.id;
  const Name = user?.data?.company_name;


  const [formData, setFormData] = useState({
    profile_id: Id,
    customer_id: '',
    ref_id: '',
    amount_received: '',
    payment_date: '',
    payment_mode: '',
    transaction_number: '',
    notes: '',
    pay_mode:'',
    payment_id:"",
    bank_name: "",
    ledger_id: "",
  });


  const [errors, setErrors] = useState({});

  const partyOptions = listParties.map((party) => ({
    value: party.id,
    label: party.name,
  }));


    // Fetch Single Payment details
    useEffect(() => {
      setIsLoading(true);
      dispatch(GetSinglePaymentDetail({ profile_id: Id,id: id }))
        .unwrap()
        .then((data) => {
          setIsLoading(false); 
          const party = listParties.find(party => party.id === data.data.party_id);
          // console.log(party)
          if (party) {
            setSelectedParty({ value: party.id, label: party.name });
             handleGetCustomer(party.id).then((ndata)=>{
             handleInvoiceChange(data?.data?.ref_id,ndata,true)
            })
            
          }
          
          if (data && data?.data) {
            setFormData({
              customer_id: data?.data?.party_id || '', 
              ref_id: data.data.ref_id || '', 
              amount_received: data.data.amount || '', 
              payment_date: data.data.payment_date || '', 
              payment_mode: data.data.pay_mode || '', 
              transaction_number: data.data.transaction_id || '', 
              notes: data.data.remark || '',
              pay_mode: data.data.pay_mode,
              payment_id:data.data.id,
              ledger_id:data.data.ledger_id
            });
            
          }
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }, [Id,listParties]);
    console.log(formData)

  // Fetch parties
  useEffect(() => {
    setIsLoading(true);
    dispatch(ListParties({ profile_id: Id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListParties(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [Id]);

  // Fetch payment methods
  useEffect(() => {
    setIsLoading(true);
    dispatch(GetPaymentMethods({ profile_id: Id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setPaymentMethods(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [Id]);

  const handleGetCustomer = async (partyId) => {
    setIsLoading(true);
    try {
      const data = await dispatch(GetByCustomer({ profile_id: Id, customer_id: partyId })).unwrap();
      setByCustomer(data?.data || []);
      return data?.data || []
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartyChange = (selectedOption) => {
    setSelectedParty(selectedOption);
    const partyId = selectedOption.value;
    setFormData({ ...formData, customer_id: partyId });
    handleGetCustomer(partyId);
  };

  const handleInvoiceChange = (e,bydata,isOnLoad) => {
    const invoiceNumber = isOnLoad ?e :e.target.value;
    const cdata=bydata?.length>0 ? bydata : byCustomer
    const invoice = cdata.find((inv) => inv.invoice_number == invoiceNumber);
    setSelectedInvoice(invoice);
    setFormData({ ...formData, ref_id: invoiceNumber });
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
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required.';
    if (!formData.amount_received || isNaN(formData.amount_received) || formData.amount_received <= 0) newErrors.amount_received = 'Valid amount is required.';
    if (!formData.payment_date || !validateDate(formData.payment_date)) newErrors.payment_date = 'Please select a valid date (not in the future).';
    // if (!formData.payment_mode) newErrors.payment_mode = 'Payment mode is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    const subdata={
      profile_id:Number(Id),
      payment_id:formData.payment_id,
      customer_id:Number(formData.customer_id ),
      ref_id:Number(formData.ref_id ),
      amount_received:Number(formData.amount_received),
      payment_date:formData.payment_date ,
      payment_mode:formData.payment_mode,
      transaction_number:formData.transaction_number ,
      notes:formData.notes ,
      ledger_id: formData.ledger_id, 
      bank_name:formData.bank_name,      
    }
    console.log("data",subdata)
    if (validateForm()) {
      setIsLoading(true);
      dispatch(UpdatePayment(subdata))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          setFormData(
            {
              profile_id: Id,
              customer_id: '',
              ref_id: '',
              amount_received: '',
              payment_date: '',
              payment_mode: '',
              transaction_number: '',
              notes: '',
              pay_mode:''
            }
          )
          navigate('/invoicepaymentlist');
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  };


  const handleDiscard = () => {
    navigate('/invoicepaymentlist');
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
                      <a href="#">Payment</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Receive Payment
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
                            {errors.customer_id && <p className="text-danger">{errors.customer_id}</p>}
                          </div>

                          <div class="col-md-6">
                            <label>
                              Invoice
                            </label>
                            <select name="ref_id" class="form-control" onChange={handleInvoiceChange} value={formData.ref_id}>
                              <option value="">--Select Invoice--</option>
                              {byCustomer?.map((option, index) => (
                                <option key={index} value={option?.invoice_number}>
                                  {option?.invoice_number}
                                </option>
                              ))}
                            
                            </select>
                            {errors.invoice_id && <p className="text-danger">{errors.invoice_id}</p>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>
                              Amount Received  <span class="required">*</span>
                              </label>
                            <div class="input-group">
                              <span class="input-group-text" id="basic-addon1">
                                ₹
                              </span>
                              <input name='amount_received' aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" value={formData.amount_received} onChange={handleInputChange}></input>
                              
                            </div>
                            {errors.amount_received && <p className="text-danger">{errors.amount_received}</p>}
                          </div>
                          <div class="col-md-6">
                            <label>
                              Payment Date <span class="required" >*</span>
                            </label>
                            <input name="payment_date" type="date" class="form-control"   value={formData.payment_date ? Moment(formData.payment_date, 'DD-MM-YYYY').format('YYYY-MM-DD') : ''} onChange={handleInputChange} ></input>
                            {errors.payment_date && <p className="text-danger">{errors.payment_date}</p>}
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <label>Payment Mode</label>

                            <select name="payment_mode" class="form-control" value={formData.ledger_id} onChange={handleInputChange}>

                              <option value="">--Payment Mode--</option>
                              {paymentMethods?.map((option, index) => (
                                <option key={index} value={ option?.id  }>
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
                            <td>{selectedInvoice?.customer_name}</td>
                          </tr>
                          <tr>
                            <th>Phone Number</th>
                            <td>{selectedInvoice?.billing_phone
                            }</td>
                          </tr>
                          <tr>
                            <th>Billing Address</th>
                            <td>{selectedInvoice?.billing_address}</td>
                          </tr>
                          <tr>
                            <th>Invoice Date</th>
                            <td>{selectedInvoice?.invoice_date}</td>
                          </tr>
                          <tr>
                            <th>Invoice Amount</th>
                            <td>₹ {selectedInvoice?.grand_total}</td>
                          </tr>
                          <tr>
                            <th>Paid Amount</th>
                            <td>₹ {selectedInvoice?.grand_total&&selectedInvoice?.balace_amount?parseFloat(selectedInvoice?.grand_total)- parseFloat(selectedInvoice?.balace_amount):0}</td>
                          </tr>
                          <tr>
                            <th>Balance Amount</th>
                            <td>₹ {selectedInvoice?.balace_amount}</td>
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

export default EditInvoicePayment;