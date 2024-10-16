import React, { useState, useEffect,useMemo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {toast } from 'react-hot-toast';
import { ListParties } from '../../store/slices/parties';
import { GetPurchaseVoucherDetail,UpdatePurchaseVoucher,GetSingleDetailsPurchaseorders } from '../../store/slices/purchase';
import { GetPurchaseOrderlist } from '../../store/slices/purchase';
import EditPurchaseBillSec from './EditPurchaseBillSec';
import moment from 'moment';
import Select from 'react-select';
import AdminLayout from '../AdminLayout';
import Loader from '../../common/Loader';

import { useDispatch, useSelector } from 'react-redux';

const EditPurchaseBill = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {id}=useParams()

  const user = JSON.parse(localStorage.getItem('user'));
  const Id = user?.data?.id; // profile_id
  const Name = user?.data?.company_name;
  // const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [pVoucherData, setVoucherBillData] = useState({});
  const [listParties, setListParties] = useState([]);
  const [purchaseOrderlist, setPurchaseOrderlist] = useState([]);
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
    ledger_id: '',
  });
  // State for form data
  const [formData, setFormData] = useState({
    profile_id: Id,
    po_prefix: null,
    ledger_id: '',
    fin_year: '2024-2025',
    roundoff: '',
    tcs_amount: '',
    party_gstn: '',
    po_number: '',
    po_date: '',
    quotation_number: '',
    quotation_date: '',
    notes: '',
    billing_name: '',
    billing_address: '',
    billing_state: '',
    billing_gstn: '',
    billing_phone: '',
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_phone: '',
    bill_no: '',
    bill_date: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch list of parties
  const fetchParties = async () => {
    try {
      const data = await dispatch(ListParties({ profile_id: Id })).unwrap();
      setListParties(data?.data);
      return data?.data;
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };

  const fetchPurchaseOrderlist = async () => {
    try {
      const data = await dispatch(GetPurchaseOrderlist({ profile_id: Id })).unwrap();
      setPurchaseOrderlist(data?.data);
      return data?.data; // Make sure you return the data
    } catch (error) {
      console.log(error.message);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchParties(), fetchPurchaseOrderlist(),fetchPurchaseVoucherDetails(id)]);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, Id]);

  // Party selection logic
  const partyOptions = useMemo(() => listParties.map((party) => ({
    value: party.id,
    label: party.ledger,
  })), [listParties]);

  const handlePartyChange = (selectedOption, ndata, isData) => {
    // console.log("selectedOption, ndata, isData",selectedOption, ndata, isData)
    const FinalselectedOption = isData ? selectedOption : selectedOption?.value; // Check if selectedOption exists
    if (!FinalselectedOption) {
      console.error('FinalselectedOption is undefined or invalid');
      return;
    }
    const ListParties = isData ? ndata : listParties;
    const party = ListParties?.find((p) => p?.id == FinalselectedOption);
    // console.log("party",party)
    if (party) {
      setSelectedPartyDetails({
        address: party?.address,
        gstin: party?.gstn,
        phone: party?.phone,
        state: party?.state,
        ledger_id: party?.id,
      });
      setFormData((prevData) => ({
        ...prevData,
        party_id: party?.id,
        ledger_id: party?.id,
        party_gstn: party?.gstn,
      }));
    } else {
      console.error('Party not found');
    }
  };

  const fetchPurchaseOrderDetails = async (po_id) => {

    setIsLoading(true);
    dispatch(GetSingleDetailsPurchaseorders({ profile_id: Id, po_id: po_id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        const purchaseorder = data?.data?.purchase_order;
        setSelectedPartyDetails({
          party_gstn: purchaseorder?.party_gstn || '',
          ledger_id: purchaseorder?.ledger_id || '',
        });
        if (purchaseorder?.party_id) {
          fetchParties().then((ndata) => {
            handlePartyChange(purchaseorder?.ledger_id, ndata, true);
          });
        }
        setFormData((prevData) => ({
          ...prevData,
          ledger_id: purchaseorder?.ledger_id || '',
          party_gstn: purchaseorder?.party_gstn || '',
          po_number: purchaseorder?.po_number || '',
          po_date: purchaseorder?.po_date || '',
          quotation_number: purchaseorder?.quotation_number || '',
          quotation_date: purchaseorder?.quotation_date || '',
          notes: purchaseorder?.notes || '',
          billing_name: purchaseorder?.billing_name || '',
          billing_address: purchaseorder?.billing_address || '',
          billing_state: purchaseorder?.billing_state || '',
          billing_gstn: purchaseorder?.billing_gstn || '',
          billing_phone: purchaseorder?.billing_phone || '',
          shipping_name: purchaseorder?.shipping_name || '',
          shipping_address: purchaseorder?.shipping_address || '',
          shipping_city: purchaseorder?.shipping_city || '',
          shipping_state: purchaseorder?.shipping_state || '',
          shipping_phone: purchaseorder?.shipping_phone || '',
        }));

      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  const fetchPurchaseVoucherDetails = async (id) => {
    dispatch(GetPurchaseVoucherDetail({ profile_id: Id, invoice_id: id }))
      .unwrap()
      .then((data) => {
        const purchasevoucher = data?.data?.invoice;
        setSelectedPartyDetails({
          party_gstn: purchasevoucher?.party_gstn || '',
          ledger_id: purchasevoucher?.ledger_id || '',
        });
        if (purchasevoucher?.ledger_id) {
          fetchParties().then((ndata) => {
            handlePartyChange(purchasevoucher?.ledger_id, ndata, true);
          });
        }
        if(purchasevoucher?.po_no ){
          fetchPurchaseOrderlist().then((newdata) => {
            const edata = newdata?.find((option) => option?.po_number == purchasevoucher?.po_no).id; // Fix here
            // console.log("edata", edata); // Check if newdata is correct
            if (edata) {
              fetchPurchaseOrderDetails(edata); // Now handle the PO change correctly
            } else {
              console.error('PO not found in the list');
            }})
        }
        setFormData((prevData) => ({
          ...prevData,
          party_id: purchasevoucher?.party_id || '',
          ledger_id: purchasevoucher?.ledger_id || '',
          party_gstn: purchasevoucher?.party_gstn || '',
          po_number: purchasevoucher?.po_no || '',
          po_date: purchasevoucher?.po_date || '',
          bill_no: purchasevoucher?.bill_no || '',
          bill_date: purchasevoucher?.bill_date || '',
        }));

        setVoucherBillData(data?.data);
      })
      .catch(({ message }) => {
        console.log(message);
      });
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};
    if (!selectedPartyDetails?.ledger_id) {
      newErrors.ledger_id = 'Supplier/Vendor is required.';
    }
    if (!selectedPartyDetails?.state) {
      toast.error('Supplier/Vendor State is required')
       return
    }
    if ((data?.invoice_items)?.length==0) {
      toast.error('Item is required')
       return
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit and show the form data
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataNew={
      invoice_id: id,
      profile_id: formData?.profile_id,
      bill_no: formData?.bill_no,
      bill_date: formData?.bill_date,
      ledger_id:formData?.ledger_id,
      party_gstn:formData?.party_gstn,
      po_no:formData?.po_number,
      roundoff: 0.00,
      bank_name: "",

    }
    const mergedData = {
      ...dataNew,
      ...data
    };

    if (validateForm()) {
      // console.log('Form Data:', mergedData);

      dispatch(UpdatePurchaseVoucher(mergedData))
      .unwrap()
      .then((data) => {
        toast.success('Update Purchase Voucher Successfully')
        setIsLoading(false);
        navigate('/purchase/purchasevoucherlist');
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
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Purchase Voucher</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Purchase Voucher
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={handleSubmit}>
                    Save
                  </button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="card custom-card">
                    <div class="card-body">
                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="row">
                              <div class="col-md-6">
                                <label>PO Number</label>
                                <select name="party" class="form-control"  value={purchaseOrderlist?.find((option) => (option?.po_number == formData.po_number))?.id || null} disabled>
                                  <option value="">--Select PO--</option>
                                  {purchaseOrderlist?.map((option, index) => (
                                    <option key={index} value={option?.id}>
                                      {option?.po_number}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div class="col-md-6">
                                <label>
                                  Supplier/Vendor <span class="required">*</span>
                                </label>
                                <Select
                                  options={partyOptions}
                                  placeholder="--Select Customer--"
                                  onChange={handlePartyChange}
                                  value={partyOptions?.find((option) => option?.value === selectedPartyDetails?.ledger_id) || null}
                                />
                                {errors.ledger_id && <p className="text-danger">{errors.ledger_id}</p>}  
                              </div>
                            </div>

                            <div class="row mt-3">
                              <div class="col-md-6">
                                <label>Party Invoice No </label>
                                <input name="bill_no" type="text" class="form-control" onChange={handleInputChange} value={formData.bill_no}/>
                              </div>
                              <div class="col-md-6">
                                <label>Party Invoice Date </label>
                                <input name="bill_date" type="date" class="form-control" onChange={handleInputChange} value={formData.bill_date}/>
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-12">
                                <br />
                                <p>
                                  <strong>Supplier/Vendor Billing Address</strong>
                                </p>
                                {selectedPartyDetails && (
                                  <>
                                    {selectedPartyDetails?.address}
                                    <br />
                                    {selectedPartyDetails?.state}
                                    <br />
                                    GSTN: {selectedPartyDetails?.gstin}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                           {formData?.po_number&&(<div class="col-md-6">
                            <div class="row mt-4">
                              <div class="col-md-6">
                                <strong>PO Number:</strong>&nbsp;{formData?.po_number}
                              </div>
                              <div class="col-md-6">
                                <strong>Quotation Number:</strong>&nbsp;{formData?.quotation_number}
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-6">
                                <strong>PO Date:</strong>&nbsp;{moment(formData?.po_date).format('DD-MM-YYYY')}
                              </div>
                              <div class="col-md-6">
                                <strong>Quotation Date:</strong>&nbsp;{moment(formData?.quotation_date).format('DD-MM-YYYY')}
                              </div>
                            </div>

                            <div class="row mt-3">
                              <div class="col-md-6">
                                <strong>Billing Address:</strong>
                                <br />
                                {formData?.billing_address} ,{formData?.billing_state},<br />
                                Phone: {formData?.billing_phone}
                                <br />
                                GSTN: {formData?.billing_gstn}
                              </div>
                              <div class="col-md-6">
                                <strong>Delivery Address:</strong>
                                <br />
                                {formData?.shipping_address} ,{formData?.shipping_state},<br />
                                Phone: {formData?.shipping_phone}
                                <br />
                              </div>
                            </div>

                            <div class="row mt-2">
                              <div class="col-md-12">
                                <strong>Notes</strong>
                                <br />
                                {formData?.notes}
                              </div>
                            </div>
                          </div>)}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <EditPurchaseBillSec onChildDataChange={setData}  data={pVoucherData} />
                </div>
              </div>
            </div>
          </div>
          </AdminLayout>
  );
};

export default EditPurchaseBill;
