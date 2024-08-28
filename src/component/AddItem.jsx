import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListCategories, Additems } from '../store/slices/items';
import { Getunits } from '../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import Navbarside from './Navbarside';
import Footer from './Footer';

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [units, setUnits] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [formData, setFormData] = useState({
    profile_id: id,
    type: 'Product',
    name: '',
    category_id: '',
    serial_no: '',
    unit: '',
    opening_quantity: '',
    opening_stock_value: '',
    opening_stock_date: '',
    sale_price: '',
    sale_price_tax_type: 'Excluding Tax',
    purchase_price: '',
    purchase_price_tax_type: 'Excluding Tax',
    tax: '',
    hsn: '',
    discount_type: 'Percentage',
    discount: '',
    mrp: '',
    mfg_date: '',
    exp_date: '',
    description: '',
    batch_no: '',
    model_no: '',
    item_size: '',
  });

  const [showProductDetails, setShowProductDetails] = useState(true);

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, type: value });
    setShowProductDetails(value === 'Product');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmit = () => {
    console.log(formData);
    setIsLoading(true);
    dispatch(Additems(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
            profile_id: id,
            type: 'Product',
            name: '',
            category_id: '',
            serial_no: '',
            unit: '',
            opening_quantity: '',
            opening_stock_value: '',
            opening_stock_date: '',
            sale_price: '',
            sale_price_tax_type: '',
            purchase_price: '',
            purchase_price_tax_type: '',
            tax: '',
            hsn: '',
            discount_type: '',
            discount: '',
            mrp: '',
            mfg_date: '',
            exp_date: '',
            description: '',
            batch_no: '',
            model_no: '',
            item_size: '',
        });
        navigate('/item');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
    
  };




  React.useEffect(() => {
    dispatch(Getunits())
      .unwrap()
      .then((data) => {
        setUnits(data.data);
      })
      .catch(({ message }) => {
        alert(message);
      });
  }, [dispatch]);

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListCategories({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListCategories(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const renderCategoryOptions = (categories, level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <option value={category.id}>
          {'\u00A0'.repeat(level * 4)} {category.category_name}
        </option>
        {category.children && category.children.length > 0 && renderCategoryOptions(category.children, level + 1)}
      </React.Fragment>
    ));
  };

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
                  <h2 className="main-content-title tx-24 mg-b-5">Item</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Items</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Item
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
                          <div className="col-md-2">
                            <label className="rdiobox">
                              <input name="type" type="radio" value="Product" checked={formData.type === 'Product'} onChange={handleRadioChange} /> <span>Product</span>
                            </label>
                          </div>
                          <div className="col-md-2">
                            <label className="rdiobox">
                              <input name="type" type="radio" value="Service" checked={formData.type === 'Service'} onChange={handleRadioChange} /> <span>Service</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="card">
                            <div className="card-body">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-md-6">
                                    <label>
                                      Item Name <span className="required">*</span>
                                    </label>
                                    <input name="name" type="text" className="form-control" onChange={handleInputChange} value={formData.name} />
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      Category <span className="required">*</span>
                                    </label>
                                    <select name="category_id" className="form-control" onChange={handleInputChange} value={formData.category_id}>
                                      <option value="">Select Category</option>
                                      {renderCategoryOptions(listCategories)}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="row">
                                  <div className="col-md-6">
                                    <label>
                                      Sale/Service Price <span className="required">*</span>
                                    </label>
                                    <div className="input-group">
                                      <span className="input-group-text" id="basic-addon1">
                                        ₹
                                      </span>
                                      <input name="sale_price" type="text" className="form-control" onChange={handleInputChange} value={formData.sale_price} />
                                      <select name="sale_price_tax_type" className="form-control" onChange={handleInputChange} value={formData.sale_price_tax_type}>
                                        <option value="Excluding Tax">Excluding Tax</option>
                                        <option value="Including Tax">Including Tax</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <label>
                                      Tax <span className="required">*</span>
                                    </label>
                                    <select name="tax" className="form-control" onChange={handleInputChange} value={formData.tax}>
                                      <option value="NONE">NONE</option>
                                      <option value="GST@0%">GST@0%</option>
                                      <option value="GST@0.25%">GST@0.25%</option>
                                      <option value="GST@3%">GST@3%</option>
                                      <option value="GST@5%">GST@5%</option>
                                      <option selected="selected" value="GST@12%">
                                        GST@12%
                                      </option>
                                      <option value="GST@18%">GST@18%</option>
                                      <option value="GST@28%">GST@28%</option>
                                      <option value="Exempted">Exempted</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="row">
                                  <div className="col-md-6">
                                    <label>
                                      HSN/SAC <span className="required">*</span>
                                    </label>
                                    <input name="hsn" type="text" className="form-control" onChange={handleInputChange} value={formData.hsn} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {showProductDetails && (
                          <div className="col-md-6">
                            <div className="card">
                              <div className="card-body">
                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label>Opening Quantity </label>
                                      <div className="input-group">
                                        <input name="opening_quantity" type="text" className="form-control" onChange={handleInputChange} value={formData.opening_quantity} />
                                        <select name="unit" className="form-control" style={{ maxWidth: '40%' }} onChange={handleInputChange} value={formData.unit}>
                                          <option value="">Unit</option>
                                          {units?.map((option, index) => (
                                            <option key={index} value={option?.id}>
                                              {option?.unit}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="col-md-6">
                                      <label>Opening Stock Date</label>
                                      <input name="opening_stock_date" type="date" className="form-control" onChange={handleInputChange} value={formData.opening_stock_date} />
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label>Purchase Price</label>
                                      <div className="input-group">
                                        <span className="input-group-text" id="basic-addon1">
                                          ₹
                                        </span>
                                        <input name="purchase_price" type="text" className="form-control" onChange={handleInputChange} value={formData.purchase_price} />
                                        <select name="purchase_price_tax_type" className="form-control" onChange={handleInputChange} value={formData.purchase_price_tax_type}>
                                          <option value="Excluding Tax">Excluding Tax</option>
                                          <option value="Including Tax">Including Tax</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <label>Discount on Sale</label>
                                      <div class="input-group">
                                        <input name="discount" class="form-control" type="text" onChange={handleInputChange} value={formData.discount} />
                                        <select name="discount_type" class="form-control" onChange={handleInputChange} value={formData.discount_type}>
                                          <option value="Percentage">Percentage</option>
                                          <option value="Amount">Amount</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <label>Mfg. Date</label>
                                      <input type="date" name="mfg_date" class="form-control" onChange={handleInputChange} value={formData.mfg_date} />
                                    </div>

                                    <div class="col-md-6">
                                      <label>Exp. Date</label>
                                      <input type="date" name="exp_date" class="form-control" onChange={handleInputChange} value={formData.exp_date} />
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <label>Barcode/Serial No</label>
                                      <input type="text" name="serial_no" class="form-control" onChange={handleInputChange} value={formData.serial_no} />
                                    </div>
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
  );
};

export default AddItem;
