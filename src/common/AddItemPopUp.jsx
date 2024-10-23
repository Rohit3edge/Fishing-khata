import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ListCategories, Additems } from '../store/slices/items';
import { Getunits } from '../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import { FaInfoCircle } from "react-icons/fa";
import Loader from '../common/Loader';


const AddItemPopUp = ({ show, onClose, onCategoryAdded  }) => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;


  const [units, setUnits] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
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
    low_stock_value :''
  });

  const [showProductDetails, setShowProductDetails] = useState(true);


  
  const handleCloseModal = () => {
    onClose(); // Call the function passed from the parent
};


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
  


  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Item Name is required.";
    if (!formData.category_id) newErrors.category_id = "Category is required.";
    if (!formData.sale_price || (parseFloat(formData.sale_price)<= 0))newErrors.sale_price = "Sale/Service Price is required.";    
    if (!formData.tax) newErrors.tax = "Tax is required.";
    if (!formData.hsn) newErrors.hsn = "HSN/SAC is required.";
    if (formData.type === 'Product' && !formData.unit) newErrors.unit = "Unit is required for products.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validate()) {
    setIsLoading(true);
    dispatch(Additems(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        onCategoryAdded()
        handleCloseModal();
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
          low_stock_value :''
        });
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
    }
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


  const handleListCategories = () => {
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
  };

  React.useEffect(() => {
    handleListCategories()
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
<>
{isLoading && <Loader />}
<Modal show={show} onHide={handleCloseModal} size="xl">
        <Modal.Header>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row content-body">
            <div className="container">
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
                                    {errors.name && <p className="alert-message">{errors.name}</p>}
                                  </div>
                                  <div className="col-md-6">
                                    <label>
                                      Category <span className="required">*</span> 
                                    </label>
                                    <select name="category_id" className="form-control" onChange={handleInputChange} value={formData.category_id}>
                                      <option value="">Select Category</option>
                                      {renderCategoryOptions(listCategories)}
                                    </select>
                                    {errors.category_id && <p className="alert-message">{errors.category_id}</p>}
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
                                      {errors.sale_price && <p className="alert-message">{errors.sale_price}</p>}
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
                                    {errors.tax && <p className="alert-message">{errors.tax}</p>}
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
                                    {errors.hsn && <p className="alert-message">{errors.hsn}</p>}
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
                                    <div className="col-md-4">
                                      <label>Opening Quantity </label>
                                      <div className="input-group">
                                        <input name="opening_quantity" type="text" className="form-control" onChange={handleInputChange} value={formData.opening_quantity} />
                                      </div>
                                      {errors.unit && <p className="alert-message">{errors.unit}</p>}
                                    </div>
                                    <div className="col-md-4">
                                      <label>Item Units</label>
                                      <select name="unit" className="form-control" onChange={handleInputChange} value={formData.unit}>
                                          <option value="">Unit</option>
                                          {units?.map((option, index) => (
                                            <option key={index} value={option?.id}>
                                              {option?.unit}
                                            </option>
                                          ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
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
                                    <div className="col-md-6">
                                      <label>Discount on Sale</label>
                                      <div className="input-group">
                                        <input name="discount" className="form-control" type="text" onChange={handleInputChange} value={formData.discount} />
                                        <select name="discount_type" className="form-control" onChange={handleInputChange} value={formData.discount_type}>
                                          <option value="Fixed">Fixed</option>
                                          <option value="Percentage">Percentage</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label>Mfg. Date</label>
                                      <input type="date" name="mfg_date" className="form-control" onChange={handleInputChange} value={formData.mfg_date} />
                                    </div>

                                    <div className="col-md-6">
                                      <label>Exp. Date</label>
                                      <input type="date" name="exp_date" className="form-control" onChange={handleInputChange} value={formData.exp_date} />
                                    </div>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <label>Barcode/Serial No</label>
                                      <input type="text" name="serial_no" className="form-control" onChange={handleInputChange} value={formData.serial_no} />
                                    </div>

                                    <div className="col-md-6">
                                      <label className='d-flex'>
                                        Set Low Value 
                                        <div className="dis_in pl-2" title=" Add low stock value to get alert. Example 1: you listed 100 laptops in stock, &amp; you set low stock value (10) when your laptop stock below 10 you get low stock alert notification."><FaInfoCircle/></div>
                                      </label>
                                      <input type="text" name="low_stock_value" className="form-control" onChange={handleInputChange} value={formData.low_stock_value} />
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

          </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-cancel" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="btn ripple btn-default" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

 </>

  );
};

export default AddItemPopUp;
