import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListCategories, Updateitems ,Edititems } from '../store/slices/items';
import { Getunits } from '../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import Navbarside from './Navbarside';
import Footer from './Footer';

const UpdateItem = () => {
  const { id } = useParams();
  const itemId = id;  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const UserID = user?.data?.id;
  const Name = user?.data?.company_name;

  const [units, setUnits] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [listCategories, setListCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profile_id: UserID,
    type: 'Product',
    name: '',
    category_id: "",
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


  useEffect(() => {
    if (itemId && UserID) {
      setIsLoading(true);
      dispatch(Edititems({ profile_id: UserID, item_id: itemId })) 
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const item = data?.data;
          console.log('item',item);
          setFormData({
                id : id || '',
                name: item?.name || '',
                category_id: item?.category_id || '',
                serial_no: item?.serial_no || '',
                type: item?.type || '',
                unit: item?.unit || '',
                opening_quantity: item?.opening_quantity || '',
                opening_stock_value: item?.opening_stock_value || '',
                opening_stock_date: item?.opening_stock_date || currentDate,
                sale_price: item?.sale_price || '',
                sale_price_tax_type: item?.sale_price_tax_type || '',
                purchase_price: item?.purchase_price || '',
                purchase_price_tax_type: item?.purchase_price_tax_type || '',
                tax: item?.tax || '',
                hsn: item?.hsn || '',
                discount_type: item?.discount_type || '',
                discount: item?.discount || '',
                mfg_date: item?.mfg_date || currentDate,
                description: item?.description || '',
                batch_no: item?.batch_no || '',
                exp_date: item?.exp_date || currentDate,
                model_no: item?.model_no || '',
                item_size: item?.item_size || '',
          });
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, itemId]);
  

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, type: value });
    setShowProductDetails(value === 'Product');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'sale_price' || name === 'purchase_price') {
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  
  const handleSubmit = () => {
    console.log(formData);
    setIsLoading(true);
    dispatch(Updateitems(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setFormData({
          profile_id: id,
          type: 'Product',
          name: '',
          category_id: "",
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
    dispatch(ListCategories({ profile_id: UserID }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListCategories(data?.data);
        if (data?.data.length > 0) {
          setFormData(prevState => ({
            ...prevState,
            category_id: data.data[0].id
          }));
        }
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
                  <h2 className="main-content-title tx-24 mg-b-5">Item Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Items List</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                       Item Edit
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={handleSubmit}>
                       Update
                  </button>
                  <button class="btn btn-cancel"  onClick={() => navigate('/item')} >Cancel</button>
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
                              <input name="type" type="radio" value="Product" checked={formData?.type === 'Product'} onChange={handleRadioChange} /> <span>Product</span>
                            </label>
                          </div>
                          <div className="col-md-2">
                            <label className="rdiobox">
                              <input name="type" type="radio" value="Service" checked={formData?.type === 'Service'} onChange={handleRadioChange} /> <span>Service</span>
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
                                    <input name="name" type="text" className="form-control" onChange={handleInputChange} value={formData?.name} />
                                    {errors.name && <p className="alert-message">{errors?.name}</p>}
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      Category <span className="required">*</span>
                                    </label>
                                    <select name="category_id" className="form-control" onChange={handleInputChange} value={formData?.category_id}>
                                      <option value="">Select Category</option>
                                      {renderCategoryOptions(listCategories)}
                                    </select>
                                    {errors?.category_id && <p className="alert-message">{errors?.category_id}</p>}
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
                                      <input name="sale_price" type="text" className="form-control" onChange={handleInputChange} value={formData?.sale_price} />
                                      <select name="sale_price_tax_type" className="form-control" onChange={handleInputChange} value={formData?.sale_price_tax_type}>
                                        <option value="Excluding Tax">Excluding Tax</option>
                                        <option value="Including Tax">Including Tax</option>
                                      </select>
                                      {errors.sale_price && <p className="alert-message">{errors?.sale_price}</p>}
                                    </div>
                                  </div>

                                  <div className="col-md-6">
                                    <label>
                                      Tax <span className="required">*</span>
                                    </label>
                                    <select name="tax" className="form-control" onChange={handleInputChange} value={`GST@${Number(formData?.tax).toFixed(2)}%`}>
                                      <option value="NONE">NONE</option>
                                      <option value="GST@0.00%">GST@0%</option>
                                      <option value="GST@0.25%">GST@0.25%</option>
                                      <option value="GST@3.00%">GST@3%</option>
                                      <option value="GST@5.00%">GST@5%</option>
                                      <option selected="selected" value="GST@12.00%">
                                        GST@12%
                                      </option>
                                      <option value="GST@18.00%">GST@18%</option>
                                      <option value="GST@28.00%">GST@28%</option>
                                      <option value="Exempted">Exempted</option>
                                    </select>
                                    {errors.tax && <p className="alert-message">{errors?.tax}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="row">
                                  <div className="col-md-6">
                                    <label>
                                      HSN/SAC 
                                    </label>
                                    <input name="hsn" type="text" className="form-control" onChange={handleInputChange} value={formData?.hsn} />
                                    
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
                                        <input name="opening_quantity" type="text" className="form-control" onChange={handleInputChange} value={formData?.opening_quantity} />
                                        <select name="unit" className="form-control" style={{ maxWidth: '40%' }} onChange={handleInputChange} value={formData?.unit}>
                                          <option value="">Unit</option>
                                          {units?.map((option, index) => (
                                            <option key={index} value={option?.id}>
                                              {option?.unit}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      {errors?.unit && <p className="alert-message">{errors?.unit}</p>}
                                    </div>

                                    <div className="col-md-6">
                                      <label>Opening Stock Date</label>
                                      <input name="opening_stock_date" type="date" className="form-control" onChange={handleInputChange} value={formData?.opening_stock_date} />
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
                                        <input name="purchase_price" type="text" className="form-control" onChange={handleInputChange} value={formData?.purchase_price} />
                                        <select name="purchase_price_tax_type" className="form-control" onChange={handleInputChange} value={formData?.purchase_price_tax_type}>
                                          <option value="Excluding Tax">Excluding Tax</option>
                                          <option value="Including Tax">Including Tax</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div class="col-md-6">
                                      <label>Discount on Sale</label>
                                      <div class="input-group">
                                        <input name="discount" class="form-control" type="text" onChange={handleInputChange} value={formData?.discount} />
                                        <select name="discount_type" class="form-control" onChange={handleInputChange} value={formData?.discount_type}>
                                        <option value="Fixed">Fixed</option>
                                        <option value="Percentage">Percentage</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <label>Mfg. Date</label>
                                      <input type="date" name="mfg_date" class="form-control" onChange={handleInputChange} value={formData?.mfg_date} />
                                    </div>

                                    <div class="col-md-6">
                                      <label>Exp. Date</label>
                                      <input type="date" name="exp_date" class="form-control" onChange={handleInputChange} value={formData?.exp_date} />
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-6">
                                      <label>Barcode/Serial No</label>
                                      <input type="text" name="serial_no" class="form-control" onChange={handleInputChange} value={formData?.serial_no} />
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

export default UpdateItem;
