import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import {AddJournalVoucher} from "../store/slices/journal"

import Select from 'react-select';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';

import Loader from '../common/Loader';

const Journal = () => {
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
    voucher_date: '',
    voucher_name: '',
    debit_entries: [],
    credit_entries: []
  });

  const [debitEntry, setDebitEntry] = useState({
    debit_ledger_id: null,
    debit_amount: ''
  });

  const [creditEntry, setCreditEntry] = useState({
    credit_ledger_id: null,
    credit_amount: ''
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




    // Handle voucher date and name changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };
    
      // Handle debit entry change
      const handleDebitChange = (field, value) => {
        setDebitEntry((prevEntry) => ({
          ...prevEntry,
          [field]: value
        }));
      };
    
      // Handle credit entry change
      const handleCreditChange = (field, value) => {
        setCreditEntry((prevEntry) => ({
          ...prevEntry,
          [field]: value
        }));
      };
    
      // Add debit entry to list
      const addDebitEntry = () => {
        setFormData((prevData) => ({
          ...prevData,
          debit_entries: [...prevData.debit_entries, debitEntry]
        }));
        setDebitEntry({ debit_ledger_id: null, debit_amount: '' }); // Reset entry form
      };
    
      // Add credit entry to list
      const addCreditEntry = () => {
        setFormData((prevData) => ({
          ...prevData,
          credit_entries: [...prevData.credit_entries, creditEntry]
        }));
        setCreditEntry({ credit_ledger_id: null, credit_amount: '' }); // Reset entry form
      };


        // Remove debit entry
  const removeDebitEntry = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      debit_entries: prevData.debit_entries.filter((_, i) => i !== index)
    }));
  };

  // Remove credit entry
  const removeCreditEntry = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      credit_entries: prevData.credit_entries.filter((_, i) => i !== index)
    }));
  };
    

    // Render debit and credit entries
    const renderDebitEntries = () => {
        return formData.debit_entries.map((entry, index) => (
          <div key={index} className="row mt-2">
            <div className="col-md-3">
              <p>{partyOptions.find(p => p.value === entry.debit_ledger_id)?.label}</p>
            </div>
            <div className="col-md-3">
              <p>₹{entry.debit_amount}</p>
            </div>
            <div className="col-md-3">
              <button className="btn-danger" onClick={() => removeDebitEntry(index)}>Remove</button>
            </div>
          </div>
        ));
      };
    
      const renderCreditEntries = () => {
        return formData.credit_entries.map((entry, index) => (
          <div key={index} className="row mt-2">
            <div className="col-md-3">
              <p> {partyOptions.find(p => p.value === entry.credit_ledger_id)?.label}</p>
            </div>
            <div className="col-md-3">
              <p> ₹{entry.credit_amount}</p>
            </div>
            <div className="col-md-3">
              <button className=" btn-danger" onClick={() => removeCreditEntry(index)}>Remove</button>
            </div>
          </div>
        ));
      };

    //   console.log("formData",formData)

      const handleSubmit = async (e) => {
        e.preventDefault();
      
        setIsLoading(true);
      
        try {
          // Use await to wait for the dispatch to finish
          await dispatch(AddJournalVoucher(formData)).unwrap();
          setIsLoading(false);
          navigate('/journallist');
        } catch (error) {
          // Handle the error if the API call fails
          setIsLoading(false);
          console.log(error.message);
        }
      };



  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Journal Voucher</h2>

                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Journal Voucher</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                    Add Journal Voucher
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                            <button class="btn ripple btn-default" onClick={handleSubmit}>Save</button>
                        </div>
                
              </div>
              <div class="row">
                        <div class="col-md-12">
                            <div class="card custom-card">
                                <div class="card-body">

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Voucher Date <span class="required">*</span></label>
                                                <input name="voucher_date" type="date" class="form-control" value={formData.voucher_date} onChange={handleInputChange}/>
                                            </div>
                                            <div class="col-md-3">
                                                <label>Voucher Name <span class="required">*</span></label>
                                                <input name='voucher_name' aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" value={formData.voucher_name} onChange={handleInputChange}/>
                                            </div>
                                            
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <hr/>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Debit Account <span class="required">*</span></label>
                                                <Select options={partyOptions} placeholder="--Select Ledger--" onChange={(option) => handleDebitChange('debit_ledger_id', option.value)} value={partyOptions.find(opt => opt.value === debitEntry.debit_ledger_id)} />
                                            </div>
                                            <div class="col-md-3">
                                                <label>Amount <span class="required">*</span></label>
                                                <input aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" value={debitEntry.debit_amount} onChange={(e) => handleDebitChange('debit_amount', e.target.value)}/>
                                            </div>

                                            <div class="col-md-3">
                                                <a href="#" class="mt-3 pt-4" style={{display:"inline-block"}} onClick={addDebitEntry} >Add More</a>
                                            </div>
                                            
                                        </div>

                                        {renderDebitEntries()}
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <label>Credit Account <span class="required">*</span></label>
                                                <Select options={partyOptions} placeholder="--Select Ledger--" onChange={(option) => handleCreditChange('credit_ledger_id', option.value)} value={partyOptions.find(opt => opt.value === creditEntry.credit_ledger_id)} />
                                            </div>
                                            <div class="col-md-3">
                                                <label>Amount <span class="required">*</span></label>
                                                <input aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" value={creditEntry.credit_amount} onChange={(e) => handleCreditChange('credit_amount', e.target.value)}/>
                                            </div>

                                            <div class="col-md-3">
                                                <a href="#" class="mt-3 pt-4" style={{display:"inline-block"}} onClick={addCreditEntry}>Add More</a>
                                            </div>
                                            
                                        </div>
                                        {renderCreditEntries()}
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

export default Journal;
