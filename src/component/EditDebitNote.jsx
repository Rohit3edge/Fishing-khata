import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import {toast } from 'react-hot-toast';
import { PaymentOutGetByCustomer, GetPurchaseVoucherDetail, GetSingleDebitnote, UpdateDebitnote } from '../store/slices/purchase';
import moment from 'moment';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import EditDebitNoteSec from './EditDebitNoteSec';

const EditDebitNote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { debitid } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [byCustomer, setByCustomer] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [data, setData] = useState({});
  const [pVoucherData, setVoucherBillData] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id,
    debit_note_id:debitid,
    debit_note_prefix: 'DN',
    debit_note_number: '',
    debit_note_date: '',
    fin_year: '2024-2025',
    customer_id: '',
    ref_id: '',
    ledger_id: '',
    notes: '',
    party_gstn: '',
  });

  const [errors, setErrors] = useState({});

  const partyOptions = listParties?.map((party) => ({
    value: party.id,
    label: party.ledger,
  }));

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchParties()]);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  // Fetch parties
  const fetchParties = async () => {
    try {
      const data = await dispatch(ListParties({ profile_id: id })).unwrap();
      setListParties(data?.data);
      return data?.data;
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetSingleDebitnote({ profile_id: id, debit_note_id: debitid }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log('data to single ', data?.data);
        const debitNote = data?.data?.debit_note;
        console.log('data to single 2', debitNote?.debit_note_number,debitNote?.debit_note_date, debitNote?.purchase_voucher_id);
        if (debitNote) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              debit_note_number: debitNote?.debit_note_number,
              debit_note_date: debitNote?.debit_note_date,
              ref_id: debitNote?.purchase_voucher_id,
              notes: debitNote?.notes,
            }));
          }
        if (debitNote?.ledger_id) {
          fetchParties().then((ndata) => {
            handlePartyChange(debitNote?.ledger_id, ndata, true);
            handleGetCustomer(debitNote?.ledger_id).then((cdata) => {
                handleInvoiceChange(debitNote?.purchase_voucher_id, cdata, true);
              });
          });
        }
          setVoucherBillData(data?.data)
      }).catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [debitid]);

  const handleGetCustomer = async (partyId) => {
    setIsLoading(true);
    try {
      const data = await dispatch(PaymentOutGetByCustomer({ profile_id: id, customer_id: partyId })).unwrap();
      setByCustomer(data?.data || []);
      return data?.data;
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartyChange = (selectedOption, ndata, isData) => {
    setSelectedParty(selectedOption);
    const FinalselectedOption = isData ? selectedOption : selectedOption?.value; // Check if selectedOption exists
    if (!FinalselectedOption) {
      console.error('FinalselectedOption is undefined or invalid');
      return;
    }
    const ListParties = isData ? ndata : listParties;
    const party = ListParties?.find((p) => p?.id == FinalselectedOption);
    setFormData((prevFormData) =>( { ...prevFormData, customer_id: party.id, party_gstn: party?.gstn, ledger_id: party?.id }));
    handleGetCustomer(party.id);
  };

  const handleInvoiceChange = (e, bydata, isOnLoad) => {
    const invoiceNumber = isOnLoad ? e : e.target.value;
    const cdata = bydata?.length > 0 ? bydata : byCustomer;
    const invoice = cdata.find((inv) => inv.id == invoiceNumber);
    fetchPurchaseVoucherDetails(invoice?.id);
    setFormData((prevFormData) =>({ ...prevFormData, ref_id: invoice?.id }));
  };

  const fetchPurchaseVoucherDetails = async (invoice_id) => {
    setIsLoading(true);
    dispatch(GetPurchaseVoucherDetail({ profile_id: id, invoice_id: invoice_id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
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

    setFormData((prevFormData) =>({ ...prevFormData, [name]: value }));
  };

  // Date validation to prevent future dates
  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    return selectedDate <= currentDate;
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
    if ((data.debit_note_items)?.length==0) {
      toast.error('Items is required.')
      return
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const subData = {
      debit_note_id:formData?.debit_note_id,
      profile_id: id,
      debit_note_prefix: 'DN',
      debit_note_number: formData?.debit_note_number,
      debit_note_date: formData?.debit_note_date,
      fin_year: '2024-2025',
      party_ledger_id: formData?.ledger_id,
      party_gstn: formData?.party_gstn,
      purchase_voucher_id: formData?.ref_id,
      notes: formData?.notes,
      roundoff: 0.0,
      tcs_amount: 0.0,
    };
    const meargedata = {
      ...subData,
      ...data,
    };

    console.log('formdata', meargedata);
    if (validateForm()) {
      setIsLoading(true);
      dispatch(UpdateDebitnote(meargedata))
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

//   console.log('invoice', formData);

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
          <div class="row content-body">
            <div class="container">
              <div class="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Debit Note</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Edit Debit Note
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                  <button class="btn ripple btn-default" onClick={handleSubmit}>
                    Save
                  </button>
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
                              Customer <span class="required">*</span>
                            </label>
                            <Select
                              options={partyOptions}
                              placeholder="--Select Customer--"
                              onChange={handlePartyChange}
                              value={partyOptions?.find((option) => option?.value === selectedParty) || null}
                            />
                            {errors.customer_id && <p className="text-danger">{errors.customer_id}</p>}
                          </div>
                          <div class="col-md-6">
                            <label>Purchase Voucher</label>
                            <select name="party" class="form-control" onChange={handleInvoiceChange} value={byCustomer?.find((option) => option?.id == formData?.ref_id)?.id || null} disabled>
                              <option value="">--Select Voucher--</option>
                              {byCustomer?.map((option, index) => (
                                <option key={index} value={option?.id}>
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
                            <label>Debit Note Number</label>
                            <input name="debit_note_number" class="form-control" type="text" value={formData.debit_note_number} onChange={handleInputChange} />
                          </div>
                          <div class="col-md-6">
                            <label>
                              Date <span class="required">*</span>
                            </label>
                            <input name="debit_note_date" type="date" class="form-control" value={formData?.debit_note_date} onChange={handleInputChange} />
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
                            <td>{selectedInvoice?.invoice?.bill_no}</td>
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
                            <td>
                              ₹{' '}
                              {selectedInvoice?.invoice?.balance_amount && selectedInvoice?.invoice?.total_amount
                                ? (parseFloat(selectedInvoice?.invoice?.balance_amount) - parseFloat(selectedInvoice?.invoice?.total_amount))?.toFixed(2)
                                : 0}
                            </td>
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

              <EditDebitNoteSec onChildDataChange={setData} data={pVoucherData} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditDebitNote;
