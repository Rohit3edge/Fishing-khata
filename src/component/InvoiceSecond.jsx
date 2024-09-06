import React, { useState, useEffect, useMemo } from 'react';
import { Getunits } from '../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';

const InvoiceSecond = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [units, setUnits] = useState();
  const [itemList, setItemList] = useState([]);
  const [singleDetail, setSingleDetail] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('Amount');
  const [shippingCost, setShippingCost] = useState(0);
  const [addedItems, setAddedItems] = useState([]); // State to store the added items
  const [selectedUnit, setSelectedUnit] = useState('');
  const [taxAmounts, settaxAmounts]=useState({})

  useEffect(() => {
    dispatch(Getunits())
      .unwrap()
      .then((data) => {
        setUnits(data.data);
      })
      .catch(({ message }) => {
        alert(message);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(Listitems({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setItemList(data?.data);
      })
      .catch(({ message }) => {
        console.log(message);
      });
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      dispatch(Getsingledetail({ profile_id: id, item_id: selectedProduct }))
        .unwrap()
        .then((data) => {
          setSingleDetail(data?.data);
          console.log(data.data)
        })
        .catch(({ message }) => {
          console.log(message);
        });
    }
  }, [dispatch, selectedProduct]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleDiscountChange = (e) => setDiscount(e.target.value);
  const handleDiscountTypeChange = (e) => setDiscountType(e.target.value);
  const handleShippingCostChange = (e) => setShippingCost(e.target.value);
  const handleUnitChange = (e) => setSelectedUnit(e.target.value);

  const totalAmount = useMemo(() => {
    let price = parseFloat(singleDetail?.sale_price) || 0;
    let gst = parseFloat(singleDetail?.tax) || 0;
    let total = price * quantity || 0;

    // Apply discount
    if (discountType === 'Amount' && discount) {
      total -= parseFloat(discount);
    } else if (discountType === 'Percentage' && discount) {
      total -= (total * parseFloat(discount)) / 100;
    }

    // Handle GST if tax is "Excluding"
    // if (singleDetail?.sale_price_tax_type === 'Excluding Tax') {
    //   const taxAmount = (total * gst) / 100;
  
    //   // Check and accumulate tax for different GST rates
    //   console.log(taxAmounts[gst] ,gst)
    //   if (gst==18) {
    //     taxAmounts[gst] = taxAmount;
    //   } else if (gst==12) {
        
    //     taxAmounts[gst] = taxAmount;
    //   }else if (gst==28) {
    
    //     taxAmounts[gst] = taxAmount;
    //   }else if (gst==5) {

    //     taxAmounts[gst] = taxAmount;
    //   }
    //   else if (gst==2.5) {
    //     taxAmounts[gst] = taxAmount;
    //   }
  
  
    //   total += taxAmount;
    // }


    if (singleDetail?.sale_price_tax_type === 'Excluding Tax') {
      const taxAmount = (total * gst) / 100;
  
      // Check and accumulate tax for different GST rates
      if (taxAmounts[gst]) {
        // Accumulate if the tax rate already exists
        taxAmounts[gst] += taxAmount;
      } else {
        // Initialize the tax rate with the first tax amount
        taxAmounts[gst] = taxAmount;
      }
  
      total += taxAmount;
    }
  
    // Example: Log the tax amounts for each rate (5%, 12%, 18%, etc.)
    console.log("Tax amounts by rate:", taxAmounts);

    return total.toFixed(2); // Format to 2 decimal places
  }, [quantity, discount, discountType, singleDetail]);

  const handleAddItem = () => {

    const newTaxAmounts = { ...taxAmounts };

    const gst = parseFloat(singleDetail?.tax) || 0;
    const total = parseFloat(totalAmount) || 0;
    const taxAmount = (total * gst) / 100;

    if (newTaxAmounts[gst]) {
      // Accumulate if the tax rate already exists
      newTaxAmounts[gst] += taxAmount;
    } else {
      // Initialize the tax rate with the first tax amount
      newTaxAmounts[gst] = taxAmount;
    }
  
    // Set updated taxAmounts in state
    settaxAmounts(newTaxAmounts);


    console.log(units.find((unit) => unit.id === singleDetail?.unit)?.id)
    const newItem = {
      id: selectedProduct,
      name: selectedProduct,
      hsn: singleDetail?.hsn,
      quantity,
      unit:String(units.find((unit) => unit.id === singleDetail?.unit)?.id || ""), 
      price: singleDetail?.sale_price,
      gst: singleDetail?.tax,
      discount,
      discountType,
      total: totalAmount,
      taxType: singleDetail?.sale_price_tax_type,
    };
    setAddedItems([...addedItems, newItem]);
    clearInputs(); // Clear the inputs after adding the item
  };

  const clearInputs = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setDiscount(0);
    setDiscountType('Amount');
  };

  const handleRemoveItem = (index) => {
    const updatedItems = addedItems.filter((_, i) => i !== index);
    setAddedItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setAddedItems(updatedItems);
  };


  const grandTotal = useMemo(() => {
    const itemsTotal = addedItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
    return (itemsTotal + parseFloat(shippingCost)).toFixed(2);
  }, [addedItems, shippingCost]);
  
  // console.log(addedItems,singleDetail?.tax);
  return (
    <div className="row my-3">
      <div className="col-md-12">
        <div className="card custom-card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <table className="table item-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>HSN/SAC</th>
                      <th>Quantity</th>
                      {/* <th>Unit</th> Added Unit Column */}
                      <th>Price</th>
                      <th>GST</th>
                      <th>Discount</th>
                      <th>Amount</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select className="form-control" value={selectedProduct} onChange={handleProductChange}>
                          <option value="">--Select Product--</option>
                          {itemList?.map((option, index) => (
                            <option key={index} value={option?.id}>
                              {option?.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{singleDetail?.hsn}</td>
                      <td>
                        <div className='input-group'>
                        <input className="form-control" type="number" value={quantity} onChange={handleQuantityChange} />
                        <select className="form-control" value={singleDetail.unit ?? selectedUnit} onChange={handleUnitChange} readOnly>
                          <option value="">--Select Unit--</option>
                          {units?.map((option, index) => (
                            <option key={index} value={option?.id}>
                              {option?.unit}
                            </option>
                          ))}
                        </select>
                        </div>
                      </td>
                     
                      <td>
                        <input type="text" className="form-control" value={ singleDetail?.sale_price ? parseFloat(singleDetail?.sale_price).toFixed(2) : 0} readOnly />
                      </td>
                      <td>
                        
                        <div class="input-group">
                          <select class="form-control" name="tax" value={parseFloat(singleDetail?.tax)} style={{width:"100px"}}>
                            <option value="0">Exempted</option>
                            <option value="2.5">2.5%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                          <select class="form-control" name="tax_type" value={singleDetail?.sale_price_tax_type}>
                            <option value="Including Tax">Including Tax</option>
                            <option value="Excluding Tax">Excluding Tax</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="input-group">
                          <input type="text" className="form-control" value={discount} onChange={handleDiscountChange} />
                          <select className="form-control" value={discountType} onChange={handleDiscountTypeChange}>
                            <option value="Fixed">Fixed</option>
                            <option value="Percentage">Percentage</option>
                          </select>
                        </div>
                      </td>
                      <td>₹{totalAmount}</td>
                      <td>
                        <button className="btn-sm btn-success" onClick={handleAddItem}>
                          Add
                        </button>
                      </td>
                    </tr>
                   
                    {addedItems?.map((item, index) => (
                      <tr key={index}>
                        {/* Product Name Dropdown */}
                        <td className="align-middle">
                          <select className="form-control" value={item?.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)}>
                            <option value="">--Select Product--</option>
                            {itemList?.map((option, idx) => (
                              <option key={idx} value={option?.id}>
                                {option?.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* HSN Code */}
                        <td className="align-middle">{item?.hsn}</td>

                        {/* Quantity and Unit */}
                        <td className="align-middle">
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="text"
                              style={{ width: '40px', padding: '0.4rem' }}
                              value={item?.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            />
                            <select className="form-control" value={item?.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)}>
                              <option value="">--Select Unit--</option>
                              {units?.map((option, idx) => (
                                <option key={idx} value={option?.id}>
                                  {option?.unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="align-middle">
                          <input
                            type="text"
                            className="form-control"
                            name="price"
                            // style={{ width: '70px', padding: '0.4rem' }}
                            value={parseFloat(item?.price).toFixed(2)}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          />
                        </td>

                        {/* GST and Tax */}
                        <td className="align-middle">
                          <div className="input-group">
                            <select className="form-control" name="tax" value={parseFloat(item?.gst)} onChange={(e) => handleItemChange(index, 'gst', e.target.value)} style={{width:"100px"}}>
                              <option value="0">Exempted</option>
                              <option value="2.5">2.5%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </select>
                            <select className="form-control" name="tax_type" value={item?.taxType} onChange={(e) => handleItemChange(index, 'taxType', e.target.value)}>
                              <option value="Including Tax">Including Tax</option>
                              <option value="Excluding Tax">Excluding Tax</option>
                            </select>
                          </div>
                        </td>

                        {/* Discount */}
                        <td className="align-middle">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              name="discount"
                              style={{ width: '40px', padding: '0.4rem' }}
                              value={item?.discount}
                              onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                            />
                            <select className="form-control" name="discount_type" value={item?.discountType} onChange={(e) => handleItemChange(index, 'discountType', e.target.value)}>
                              <option value="Fixed">Fixed</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="align-middle">₹{item?.total}</td>

                        {/* Remove Button */}
                        <td className="align-middle">
                          <button className="btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colspan="7" class="text-right align-middle">
                        <strong>Shipping Cost:</strong>
                      </td>
                      <td colspan="2" class="align-middle">
                        <input type="text" class="form-control" name="shipping_cost" value={shippingCost} onChange={handleShippingCostChange} />
                      </td>
                    </tr>

                    <tr>
                      <td colspan="7" class="text-right align-middle">
                        <strong>Grand Total:</strong>
                      </td>
                      <td colspan="2" class="align-middle">
                        ₹{grandTotal ? grandTotal : 0}
                      </td>
                    </tr>

                    <tr>
                      <td colspan="7" class="text-right align-middle">
                        <strong>GST 5%:</strong>
                      </td>
                      <td colspan="2" class="align-middle">
                        ₹1,629.00
                      </td>
                    </tr>
                    <tr>
                      <td colspan="7" class="text-right align-middle">
                        <strong>GST 18%:</strong>
                      </td>
                      <td colspan="2" class="align-middle">
                        ₹2,629.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSecond;
