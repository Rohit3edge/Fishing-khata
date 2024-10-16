import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import {toast } from 'react-hot-toast';
import {PaymentOutGetByCustomer,GetPurchaseVoucherDetail,AddDebitnote} from "../store/slices/purchase"
import moment from 'moment';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import AddDebitNoteSec from "./AddDebitNoteSec"
import AdminLayout from './AdminLayout';

const AddDebitNote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [byCustomer, setByCustomer] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [data, setData] = useState({});
  const [pVoucherData, setVoucherBillData] = useState({});


  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const currentDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    profile_id: id,
    debit_note_prefix: "DN",
    debit_note_number:"",
    debit_note_date:currentDate ,
    fin_year: "2024-2025",
    customer_id: '',
    ref_id: '',
    ledger_id: "",
    notes: '',
    party_gstn:""
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
    const partygst = listParties?.find((inv) => inv.id == partyId);

    setFormData({ ...formData, customer_id: partyId,party_gstn:partygst?.gstn,ledger_id:partygst?.id});
    handleGetCustomer(partyId);
  };

  const handleInvoiceChange = (e) => {
    const invoiceNumber = e.target.value;
    const invoice = byCustomer?.find((inv) => inv.bill_no == invoiceNumber);
    fetchPurchaseVoucherDetails(invoice?.id)
    setFormData({ ...formData, ref_id: invoice?.id });
  };


  const fetchPurchaseVoucherDetails = async (Id) => {
    setIsLoading(true);
    dispatch(GetPurchaseVoucherDetail({ profile_id: id, invoice_id: Id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        const purchasevoucher = data?.data;
        setSelectedInvoice(purchasevoucher);
        setVoucherBillData(purchasevoucher)
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
      setFormData({ ...formData, [name]: value });

  };
  


  const validateForm = () => {
    let newErrors = {};
  
    // Validate customer_id
    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer is required.';
    }
  
    // Validate credit_note_date
    if (!formData.debit_note_date) {
      newErrors.debit_note_date = 'Date is required.';
    }
    if (!formData.debit_note_number) {
      newErrors.debit_note_number = 'Debit Note Number is required.';
    }
    
    if ((data.debit_note_items)?.length==0) {
      toast.error('Items is required.')
      return
    }
  
    // Set errors state
    setErrors(newErrors);
  
    // Return true if no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();


    const subData={
        profile_id:id,
        debit_note_prefix: "DN",
        debit_note_number: formData?.debit_note_number,
        debit_note_date:formData?.debit_note_date,
        fin_year: "2024-2025",
        party_ledger_id:formData?.ledger_id,
        party_gstn:formData?.party_gstn,
        purchase_voucher_id:formData?.ref_id,
        notes: formData?.notes,
        roundoff: 0.00,
        tcs_amount:0.00
    }
 const meargedata={
    ...subData,
    ...data
 }

// console.log("formdata",meargedata)
    if (validateForm()) {
      setIsLoading(true);
      dispatch(AddDebitnote(meargedata))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          navigate('/purchase/debitnotelist');
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  };

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div class="row content-body">
                <div class="container">
                    <div class="page-header">
                        <div>
                            <h2 class="main-content-title tx-24 mg-b-5">Debit Note</h2>
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Purchase</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Add Debit Note</li>
                            </ol>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn ripple btn-default" onClick={handleSubmit}>Save</button>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-8">
                            <div class="card custom-card">
                                <div class="card-body">

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Customer <span class="required">*</span></label>
                                                <Select options={partyOptions} placeholder="--Select Customer--" onChange={handlePartyChange} value={selectedParty} />
                                                {errors.customer_id && <p className="text-danger">{errors.customer_id}</p>}          
                                            </div>
                                            <div class="col-md-6">
                                                <label>Purchase Voucher</label>
                                                <select name="party" class="form-control" value={selectedInvoice?.ref_id} onChange={handleInvoiceChange}> 
                                                    <option value="">--Select Voucher--</option>
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
                                                  Debit Note Number <span class="required">*</span>
                                                  </label>
                                                <input name='debit_note_number' class="form-control" type="text"  onChange={handleInputChange}/>
                                                {errors.debit_note_number && <p className="text-danger">{errors.debit_note_number}</p>} 
                                            </div>
                                            <div class="col-md-6">
                                                <label>
                                                  Date 
                                                  <span class="required">*</span></label>
                                                <input name="debit_note_date" type="date" class="form-control" value={formData?.debit_note_date} onChange={handleInputChange}/>
                                                {errors.debit_note_date && <p className="text-danger">{errors.debit_note_date}</p>} 
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

                                </div>
                            </div> 
                        </div>
                        {selectedInvoice ? (
                  <div class="col-md-4">
                    <div class="card custom-card">
                      <div class="card-body">
                        <table className="table">
                        <tr>
                            <th>Voucher Number</th>
                            <td>{selectedInvoice?.invoice?.bill_no }</td>
                          </tr>
                          <tr>
                            <th>Voucher Date</th>
                            <td>{selectedInvoice?.invoice?.bill_date}</td>
                          </tr>
                          <tr>
                            <th>Party Bill Number</th>
                            <td>{moment(selectedInvoice?.invoice?.date_added).format('DD-MM-YYYY')}</td>
                          </tr>
                          <tr>
                            <th>Party Bill Date</th>
                            <td>{selectedInvoice?.invoice?.bill_date}</td>
                          </tr>
                          <tr>
                            <th>Invoice Amount</th>
                            <td>₹ {selectedInvoice?.invoice?.total_amount}</td>
                          </tr>
                          <tr>
                            <th>Paid Amount</th>
                            <td>₹ {selectedInvoice?.invoice?.balance_amount&&selectedInvoice?.invoice?.total_amount? (parseFloat(selectedInvoice?.invoice?.balance_amount)- parseFloat(selectedInvoice?.invoice?.total_amount))?.toFixed(2):0}</td>
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

                    <AddDebitNoteSec onChildDataChange={setData}  data={pVoucherData} />
                </div>
            </div>
      </AdminLayout>
  );
};

export default AddDebitNote;
