import React, { useState, useEffect } from 'react';
import Navbarside from './Navbarside';
import { useDispatch } from 'react-redux';
import { LedgerAdd, Getledgergroups } from '../store/slices/ledger';
import { useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import Footer from './Footer';

const AddLedger = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ledgerGroups, setLedgerGroups] = useState([]);
  const [ledgerName, setLedgerName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('cr');
  const [isdefault, setIsdefault] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    type:'Regular',
    account_no: '',
    bank_name: '',
    account_holder: '',
    ifsc: '',
    date: "",
    date_as_of:""
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const parsedObject = groupName ? JSON.parse(groupName) : {};
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsLoading(true);
    dispatch(Getledgergroups())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setLedgerGroups(data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        alert(message);
      });
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'ledger_name':
        setLedgerName(value);
        break;
      case 'group_name':
        const group = JSON.parse(value);
        setGroupId(group.id);
        setIsdefault(group.is_default);
        setGroupName(value);
        break;
      case 'opening_date':
        setOpeningDate(value);
        break;
      case 'amount':
        setAmount(value);
        break;
      case 'transactionType':
        setTransactionType(value);
        break;
      default:
        setAccountDetails((prevState) => ({
          ...prevState,
          [name]: value,
          date:openingDate,
          date_as_of:openingDate
        }));
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!ledgerName) formErrors.ledger_name = 'Ledger name is required';
    if (!groupId) formErrors.group_name = 'Group name is required';
    if (!openingDate) formErrors.opening_date = 'Opening date is required';
    if (!amount) formErrors.amount = 'Amount is required';
    if (!transactionType) formErrors.transactionType = 'Transaction type is required';

    if (parsedObject.group_name === 'Bank Accounts') {
      if (!accountDetails.account_no) formErrors.account_no = 'Account number is required';
      if (!accountDetails.ifsc) formErrors.ifsc = 'IFSC is required';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const ledgerData = {
      profile_id: Number(user?.data?.id),
      group_id: Number(groupId),
      is_default: Number(isdefault),
      ledger: ledgerName,
      address: user?.data?.address,
      phone_number: user?.data?.phoneno,
      state: user?.data?.state,
      gst_type: "Regular",
      gstn: user?.data?.gst,
      opening_balance: parseFloat(amount),
      dr_cr: transactionType.toUpperCase(),
      opening_date: openingDate,
      ...accountDetails, // Include account details if they were entered
    };
    
    setIsLoading(true);
    dispatch(LedgerAdd(ledgerData))
      .unwrap()
      .then((response) => {
        setIsLoading(false);
        alert('Ledger added successfully!');
        navigate('/ledger');
      })
      .catch((error) => {
        setIsLoading(false);
        alert('Failed to add ledger: ' + error.message);
      });

    setLedgerName('');
    setGroupId('');
    setOpeningDate('');
    setAmount('');
    setTransactionType('');
    setIsdefault('');
    setGroupName('');
    setAccountDetails({
      account_no: '',
      bank_name: '',
      account_holder: '',
      ifsc: '',
    });
  };

  const renderOptions = (groups, level = 0) => {
    return groups.map((group) => (
      <React.Fragment key={group.id}>
        <option value={JSON.stringify({ id: group.id, is_default: group.is_default, group_name: group.group_name })}>
          {'\u00A0'.repeat(level * 4)} {group.group_name}
        </option>
        {group.children && group.children.length > 0 && renderOptions(group.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <>
      <div className="">
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
                  <button type="submit" className="btn btn-default">
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
                    <h2 className="main-content-title tx-24 mg-b-5">Add Ledger</h2>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Ledger</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add Ledger
                      </li>
                    </ol>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn ripple btn-default" onClick={handleSubmit}>
                      Save
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="card custom-card">
                      <div className="card-body">
                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-3">
                              <label>
                                Name <span className="required">*</span>
                              </label>
                              <input name="ledger_name" type="text" placeholder="Enter the name" className="form-control" value={ledgerName} onChange={handleInputChange} />
                              <p className="alert-message">{errors.ledger_name}</p>
                            </div>
                            <div className="col-md-3">
                              <label>
                                Group Name <span className="required">*</span>
                              </label>
                              <select name="group_name" className="form-control" value={groupName} onChange={handleInputChange}>
                                <option value="">Select</option>
                                {renderOptions(ledgerGroups)}
                              </select>
                              <p className="alert-message">{errors.group_name}</p>
                            </div>
                            <div className="col-md-3">
                              <label>
                                Opening Date <span className="required">*</span>
                              </label>
                              <input name="opening_date" type="date" className="form-control" value={openingDate} onChange={handleInputChange} />
                              <p className="alert-message">{errors.opening_date}</p>
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="col-black mb-0">
                                  Amount <span className="required">*</span>
                                </label>
                                <div className="ml-2">
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="transactionType" id="credit" value="cr" checked={transactionType === 'cr'} onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="credit">
                                      Cr
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="transactionType" id="debit" value="dr" checked={transactionType === 'dr'} onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="debit">
                                      Dr
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <input name="amount" type="text" className="form-control" placeholder="Enter the amount" value={amount} onChange={handleInputChange} />
                              <p className="alert-message">{errors.amount}</p>
                            </div>
                          </div>

                          {/* Conditionally render additional fields */}
                          {/* parsedObject.group_name === 'Bank Accounts' && */}
                          {parsedObject.group_name === 'Bank Accounts' && (
                            <div class="ledger_info row">
                              <div class="col-md-12">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-2">
                                      <label class="rdiobox">
                                        <input name="type" type="radio" value="Regular" checked={accountDetails.type === 'Regular'} onChange={handleInputChange} /> <span>Regular</span>
                                      </label>
                                    </div>
                                    <div class="col-md-2">
                                      <label class="rdiobox">
                                        <input name="type" type="radio" value="OD/OCC" checked={accountDetails.type === 'OD/OCC'} onChange={handleInputChange} /> <span>OD/OCC</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div className="col-md-6">
                                      <label>Account No <span className="required">*</span></label>
                                      <input name="account_no" type="text" className="form-control" placeholder="Enter account no" value={accountDetails.account_no} onChange={handleInputChange} />
                                      <p className="alert-message">{errors.account_no}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <label>Bank Name</label>
                                      <input name="bank_name" type="text" className="form-control" placeholder="Enter bank name" value={accountDetails.bank_name} onChange={handleInputChange} />
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div className="col-md-6">
                                      <label>Account Holder Name</label>
                                      <input
                                        name="account_holder"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter account holder name"
                                        value={accountDetails.account_holder}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <label>IFSC <span className="required">*</span></label>
                                      <input name="ifsc" type="text" className="form-control" placeholder="Enter IFSC" value={accountDetails.ifsc} onChange={handleInputChange} />
                                      <p className="alert-message">{errors.ifsc}</p>
                                    </div>
                                  </div>
                                </div>

                                
                              </div>
                            </div>
                          )}
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
    </>
  );
};

export default AddLedger;
