import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-hot-toast';
import { ListParties } from '../store/slices/parties';
import {AddPurchaseorder} from '../store/slices/purchase'
import AddPurchaseOrderSec from './AddPurchaseOrderSec';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';


const AddPurchaseOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id; // profile_id
  const Name = user?.data?.company_name;
  // const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [listParties, setListParties] = useState([]);
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '' || null,
    phone: '',
    state: '',
    party_ledger_id: '',
  });
  // State for form data
  const [formData, setFormData] = useState({
    profile_id:id ,
    po_prefix:"",
    party_ledger_id:'',
    fin_year:'2024-2025',
    roundoff:"",
    tcs_amount:"",
    party_gstn: '' ||null,
    po_number: '',
    po_date: "",
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

  });

  const [errors, setErrors] = useState({});

  // Fetch list of parties
  const fetchParties = async () => {
    try {
      const data = await dispatch(ListParties({ profile_id: id })).unwrap();
      setListParties(data?.data);
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };
  const fetchLocalData = async () => {
    setFormData((prevData) => ({
      ...prevData,
      billing_name: user?.data?.company_name,
      billing_address: user?.data?.address,
      billing_state: user?.data?.state,
      billing_gstn: user?.data?.gst,
      billing_phone: user?.data?.phoneno,
      shipping_name: user?.data?.company_name,
      shipping_address: user?.data?.address,
      shipping_city: user?.data?.city,
      shipping_state: user?.data?.state,
      shipping_phone: user?.data?.phoneno,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchParties(), fetchLocalData()]);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id]);

  // Party selection logic
  const partyOptions = listParties.map((party) => ({
    value: party.id,
    label: party.ledger,
  }));

  const handlePartyChange = (selectedOption) => {
    const party = listParties.find((p) => p.id === selectedOption.value);
    if (party) {
      setSelectedPartyDetails({
        address: party.address,
        gstin: party.gstn,
        phone: party.phone,
        state: party.state,
        party_ledger_id: party.id,
      });
      setFormData((prevData) => ({
        ...prevData,
        party_ledger_id:party.id,
        party_gstn:party.gstn,
      }));
    }
  };

  // Handle input changes
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
    if (!selectedPartyDetails?.party_ledger_id) {
      newErrors.customer = 'Customer is required.';
    }
    if (!selectedPartyDetails?.state) {
      newErrors.selectedPartyState = 'Billing state is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  // Submit and show the form data
  const handleSubmit = (e) => {
    e.preventDefault();
    const mergedData = {
      ...formData,
      ...data
    };
      console.log('Form Data:', mergedData);
    if (validateForm()) {

      dispatch(AddPurchaseorder(mergedData))
      .unwrap()
      .then((data) => {
        toast.success('Add Purchase Order Successfully')
        setIsLoading(false);
        navigate('/purchase/purchaseorderlist');
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
                  <h2 className="main-content-title tx-24 mg-b-5">Purchase Order</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Create Purchase Order
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
                          <div class="col-md-6">
                            <div class="row">
                              <div class="col-md-12">
                                <label>
                                  Supplier/Vendor <span class="required">*</span>
                                </label>
                                <Select options={partyOptions} placeholder="--Select Customer--" onChange={handlePartyChange} />
                                {errors.customer && <p className="text-danger">{errors.customer}</p>}
                              </div>
                            </div>

                            <div class="row">
                              <div className="col-md-12">
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

                          <div class="col-md-6">
                            <div class="row">
                              <div class="col-md-6">
                                <label>PO Number </label>
                                <input name="po_number" type="text" class="form-control" value={formData.po_number} onChange={handleInputChange} />
                              </div>

                              <div class="col-md-6">
                                <label>PO Date </label>
                                <input name="po_date" type="date" class="form-control" value={formData.po_date} onChange={handleInputChange} />
                              </div>
                            </div>

                            <div class="row mt-2">
                              <div class="col-md-6">
                                <label>Quotation Number </label>
                                <input name="quotation_number" type="text" class="form-control" value={formData.quotation_number} onChange={handleInputChange} />
                              </div>

                              <div class="col-md-6">
                                <label>Quotation Date </label>
                                <input name="quotation_date" type="date" class="form-control" value={formData.quotation_date} onChange={handleInputChange} />
                              </div>
                            </div>

                            <div class="row mt-2">
                              <div class="col-md-12">
                                <label>Notes</label>
                                <textarea name="notes" class="form-control" rows="4" cols="70" onChange={handleInputChange} value={formData.notes}></textarea>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <div class="row">
                          <div class="col-md-6">
                            <fieldset class="form-group border p-2 mt-3">
                              <legend class="px-2">Billing Address</legend>
                              <div class="row mt-2">
                                <div class="col-md-12">
                                  <label>Billing Name </label>
                                  <input name="billing_name" type="text" class="form-control" onChange={handleInputChange} value={formData.billing_name} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>Address </label>
                                  <input name="billing_address" type="text" class="form-control" onChange={handleInputChange} value={formData.billing_address} />
                                </div>
                                <div class="col-md-6">
                                  <label>State </label>
                                  <input name="billing_state" type="text" class="form-control" onChange={handleInputChange} value={formData.billing_state} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>GSTN </label>
                                  <input name="billing_gstn" type="text" class="form-control" onChange={handleInputChange} value={formData.billing_gstn} />
                                </div>
                                <div class="col-md-6">
                                  <label>Phone </label>
                                  <input name="billing_phone" type="text" class="form-control" onChange={handleInputChange} value={formData.billing_phone} />
                                </div>
                              </div>
                            </fieldset>
                          </div>

                          <div class="col-md-6">
                            <fieldset class="form-group border p-2 mt-3">
                              <legend class="px-2">Delivery Address</legend>
                              <div class="row mt-2">
                                <div class="col-md-12">
                                  <label>Delivery Name </label>
                                  <input name="shipping_name" type="text" class="form-control" onChange={handleInputChange} value={formData.shipping_name} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>Address </label>
                                  <input name="shipping_address" type="text" class="form-control" onChange={handleInputChange} value={formData.shipping_address} />
                                </div>
                                <div class="col-md-6">
                                  <label>City </label>
                                  <input name="shipping_city" type="text" class="form-control" onChange={handleInputChange} value={formData.shipping_city} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>State </label>
                                  <input name="shipping_state" type="text" class="form-control" onChange={handleInputChange} value={formData.shipping_state} />
                                </div>
                                <div class="col-md-6">
                                  <label>Phone </label>
                                  <input name="shipping_phone" type="text" class="form-control" onChange={handleInputChange} value={formData.shipping_phone} />
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <AddPurchaseOrderSec onChildDataChange={setData} onSubmit={handleSubmit} />
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
  );
};

export default AddPurchaseOrder;
