import React, { useState, useEffect, useMemo } from 'react';
import { Getunits } from '../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';

const InvoiceSecond = ({ onChildDataChange, onSubmit }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [units, setUnits] = useState();
  const [itemList, setItemList] = useState([]);
  const [singleDetail, setSingleDetail] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('Fixed');
  const [shippingCost, setShippingCost] = useState(0);
  const [addedItems, setAddedItems] = useState([]); // State to store the added items
  const [selectedUnit, setSelectedUnit] = useState('');
  const [taxAmounts, settaxAmounts] = useState({});
  const [tax, setTax] = useState(singleDetail?.tax || 0); // State to track tax
  const [taxType, setTaxType] = useState(singleDetail?.sale_price_tax_type || 'Excluding Tax');
  const [subtotal, setSubtotal] = useState(0);

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
          setSelectedUnit(data?.data?.unit || '');
          setTax(data?.data?.tax || '');
          setTaxType(data?.data?.sale_price_tax_type || '');
        })
        .catch(({ message }) => {
          console.log(message);
        });
    }
  }, [dispatch, selectedProduct, id]);
  useEffect(() => {
    // Calculate GST on the new shipping cost
    const shippingGst = (shippingCost * 12) / 100;

    // Update tax amounts
    const updatedTaxAmounts = { ...taxAmounts };
    if (shippingGst > 0) {
      updatedTaxAmounts[12] = shippingGst;
    } else {
      delete updatedTaxAmounts[12];
    }

    settaxAmounts(updatedTaxAmounts);
  }, [shippingCost]);

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleDiscountChange = (e) => setDiscount(e.target.value);
  const handleDiscountTypeChange = (e) => setDiscountType(e.target.value);
  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value); // Just update the unit
  };
  const handleTaxSelectChange = (e) => {
    setTax(parseFloat(e.target.value)); // Set the selected tax value
    // console.log('selected tax', e.target.value);
  };
  const handleTaxTypeSelectChange = (e) => {
    setTaxType(e.target.value);
  };

  const handleShippingCostChange = (e) => {
    const newShippingCost = parseFloat(e.target.value) || 0;
    setShippingCost(newShippingCost);

    // Recalculate GST on the new shipping cost
    const shippingGst = (newShippingCost * 12) / 100;

    // Update tax amounts
    const updatedTaxAmounts = { ...taxAmounts };
    if (shippingGst > 0) {
      updatedTaxAmounts[12] = shippingGst;
    } else {
      delete updatedTaxAmounts[12]; // Remove the entry if the shipping GST is zero
    }

    settaxAmounts(updatedTaxAmounts);
  };

  const totalAmount = useMemo(() => {

    let price = Number(singleDetail?.sale_price) || 0;
    let gst = Number(tax) || 0;
    let quantityTotal = price * quantity || 0;
    let taxAmount = 0;
    let totalBeforeTax = quantityTotal;

    // Step 1: Calculate tax based on "Including Tax"
    if (taxType === 'Including Tax') {
      taxAmount = (quantityTotal * gst) / (100); 
      taxAmount = Math.floor(taxAmount * 100) / 100; 
      totalBeforeTax = quantityTotal - taxAmount;
    } else if (taxType === 'Excluding Tax') {
      taxAmount = (quantityTotal * gst) / 100; 
      taxAmount = Math.floor(taxAmount * 100) / 100; 
    }

    // Step 2: Apply discount on the total before tax
    let discountAmount = 0;
    if (discountType === 'Fixed' && discount) {
      discountAmount = Number(discount);
    } else if (discountType === 'Percentage' && discount) {
      discountAmount = (totalBeforeTax * Number(discount)) / 100; 
    }
    let discountedTotal = totalBeforeTax - discountAmount;

    // Step 3: Recalculate tax based on discounted total
    let recalculatedTax = 0;
    if (taxType === 'Including Tax') {
      recalculatedTax = (discountedTotal * gst) / 100;
      recalculatedTax = Math.floor(recalculatedTax * 100) / 100; // Truncate to 2 decimal places
    } else if (taxType === 'Excluding Tax') {
      recalculatedTax = (discountedTotal * gst) / 100;
      recalculatedTax = Math.floor(recalculatedTax * 100) / 100; // Truncate to 2 decimal places
    }

    // Step 4: Final total = discounted total + recalculated tax
    let finalTotal = discountedTotal + parseFloat(recalculatedTax); // Make sure it's a numbe
    
    console.log(discountedTotal)
    return {
      finalTotal: Math.floor(finalTotal * 100) / 100,
      discountedTotal
    };
  }, [quantity, discount, discountType, singleDetail, tax, taxType]);



  const handleAddItem = () => {
    const gst = parseFloat(tax) || 0;
    const price = parseFloat(singleDetail?.sale_price) || 0;
    let taxAmount = 0;
    let quantityTotal = price * quantity || 0;
     let totalBeforeTax = quantityTotal;

    if (taxType === 'Including Tax') {
      taxAmount = (quantityTotal * gst) / (100); // Calculate tax already included in the price
      taxAmount = Math.floor(taxAmount * 100) / 100; // Truncate to 2 decimal places without rounding
      totalBeforeTax = quantityTotal - taxAmount; // Remove tax to get the base price
    } else if (taxType === 'Excluding Tax') {
      taxAmount = (quantityTotal * gst) / 100; // Tax is not included in the price, calculate separately
      taxAmount = Math.floor(taxAmount * 100) / 100; // Truncate to 2 decimal places
    }

    // Step 2: Apply discount on the total before tax
    let discountAmount = 0;
    if (discountType === 'Fixed' && discount) {
      discountAmount = Number(discount); // Fixed discount amount
    } else if (discountType === 'Percentage' && discount) {
      discountAmount = (totalBeforeTax * Number(discount)) / 100; // Discount as a percentage
    }
    let discountedTotal = totalBeforeTax - discountAmount;

    // Step 3: Recalculate tax based on discounted total
    let recalculatedTax = 0;
    if (taxType === 'Including Tax') {
      recalculatedTax = (discountedTotal * gst) / 100;
      recalculatedTax = Math.floor(recalculatedTax * 100) / 100; // Truncate to 2 decimal places
    } else if (taxType === 'Excluding Tax') {
      recalculatedTax = (discountedTotal * gst) / 100;
      recalculatedTax = Math.floor(recalculatedTax * 100) / 100; // Truncate to 2 decimal places
    }
    const newTaxAmounts = { ...taxAmounts };
    if (newTaxAmounts[gst]) {
      newTaxAmounts[gst] += recalculatedTax;
    } else {
      newTaxAmounts[gst] = recalculatedTax;
    }

    settaxAmounts(newTaxAmounts);
    const newItem = {
      id: selectedProduct,
      item_id: selectedProduct,
      hsn: singleDetail?.hsn,
      quantity,
      unit_id: String(units.find((unit) => unit.id === singleDetail?.unit)?.id || ''),
      unit_name: String(units.find((unit) => unit.id === singleDetail?.unit)?.unit || ''),
      price: price,
      tax: gst,
      discount,
      discount_type:discountType,
      total_amount: Math.floor(totalAmount.finalTotal * 100) / 100,
      price_tax_type:taxType,
      tax_amount: Math.floor(taxAmount * 100) / 100,
      sub_total:Math.floor(totalAmount?.discountedTotal * 100) / 100
    };

    setAddedItems([...addedItems, newItem]);
    clearInputs();
  };

  // Handle removing item and update the taxAmounts state accordingly
  const handleRemoveItem = (index) => {
    const updatedItems = [...addedItems];
    const item = updatedItems[index];

    // Recalculate the tax for the item being removed
    const gst = parseFloat(item.tax) || 0;
    const price = parseFloat(item.price) || 0;
    const itemQuantity = parseFloat(item.quantity) || 0;
    let taxAmount = 0;
    
    if (item.price_tax_type === 'Excluding Tax') {
      taxAmount = (price * itemQuantity * gst) / 100;
    } else if (item.price_tax_type === 'Including Tax') {
      const totalWithTax = price * itemQuantity;
      taxAmount = (totalWithTax * gst) / (100 + gst);
    }

    // Subtract the tax amount from taxAmounts
    const newTaxAmounts = { ...taxAmounts };
    if (newTaxAmounts[gst]) {
      newTaxAmounts[gst] -= taxAmount;
      if (newTaxAmounts[gst] < 0) {
        newTaxAmounts[gst] = 0; // Ensure no negative tax amounts
      }
    }

    settaxAmounts(newTaxAmounts);

    // Remove the item from addedItems
    updatedItems.splice(index, 1);
    setAddedItems(updatedItems);
  };

  const clearInputs = () => {
    setSelectedProduct('');
    setQuantity(1);
    setDiscount(0);
    setDiscountType('Fixed');
    setSelectedUnit('');
    setTax(0);
    setTaxType('Excluding Tax');
    setSingleDetail('');
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
  
    // Get the item price and quantity
    const itemPrice = parseFloat(updatedItems[index].price) || 0;
    const itemQuantity = parseFloat(updatedItems[index].quantity) || 0;
    let itemTotalWithoutTax = itemPrice * itemQuantity;
  
    // Get current tax and discount values
    const oldGst = parseFloat(addedItems[index]?.tax) || 0;
    const newGst = parseFloat(field === 'tax' ? value : updatedItems[index].tax) || 0;
    const discountValue = parseFloat(updatedItems[index]?.discount) || 0;
    const discountType = updatedItems[index]?.discount_type; 
    // Initialize variables for tax and discount calculations
    let newTaxAmount = 0;
    let discountAmount = 0;
    let discountedTotal = itemTotalWithoutTax;
  
    // Discount Calculation
    if (discountType === 'Percentage' && discountValue) {
      if (updatedItems[index]?.price_tax_type === 'Including Tax') {
        // For including tax, first find base price excluding tax
        const basePrice = discountedTotal * newGst/ 100;
        newTaxAmount = discountedTotal - basePrice;
        newTaxAmount = Math.floor(newTaxAmount * 100) / 100;
        discountedTotal = newTaxAmount;
      }
      discountAmount = (discountedTotal * discountValue) / 100;
      discountedTotal -= discountAmount;
      
    } else if (discountType === 'Fixed' && discountValue) {
      if (updatedItems[index]?.price_tax_type === 'Including Tax') {
        // For including tax, first find base price excluding tax
        const basePrice = discountedTotal * newGst/ 100;
        newTaxAmount = discountedTotal - basePrice;
        // newTaxAmount = Math.floor(newTaxAmount * 100) / 100;
        discountedTotal = newTaxAmount;
      }
      discountAmount = (discountedTotal - discountValue);
      discountedTotal = discountAmount;
    }
  
    // Tax Calculation
    if (updatedItems[index]?.price_tax_type === 'Including Tax') {
      // Recalculate tax on the discounted total
      newTaxAmount = (discountedTotal * newGst) / (100);
      newTaxAmount = Math.floor(newTaxAmount * 100) / 100;
      if (discountValue){
        discountedTotal += newTaxAmount;
      }else{
        discountedTotal = discountedTotal;
      }
      
    } else if (updatedItems[index]?.price_tax_type === 'Excluding Tax') {
      newTaxAmount = (discountedTotal * newGst) / 100;
      newTaxAmount = Math.floor(newTaxAmount * 100) / 100;
      discountedTotal += newTaxAmount; // Add tax to total
    }
  

  
    // Update item with new total amount
    updatedItems[index].total_amount = Math.floor(discountedTotal * 100) / 100;
    updatedItems[index].total_amount = updatedItems[index].total_amount.toFixed(2);
  
    // Update tax amounts
    const newTaxAmounts = { ...taxAmounts };
    const oldTaxAmount = Math.floor(((itemTotalWithoutTax * oldGst) / 100) * 100) / 100;
    if (newTaxAmounts[oldGst]) {
      newTaxAmounts[oldGst] -= oldTaxAmount;
      if (newTaxAmounts[oldGst] < 0) newTaxAmounts[oldGst] = 0; // Ensure no negative tax amounts
    }
  
    // Add the new tax amount
    if (newTaxAmounts[newGst]) {
      newTaxAmounts[newGst] += newTaxAmount;
    } else {
      newTaxAmounts[newGst] = newTaxAmount;
    }
  
    // Update state
    settaxAmounts(newTaxAmounts);
    setAddedItems(updatedItems);
  };
  
  
  
  

  const grandTotal = useMemo(() => {
    const itemsTotal = addedItems.reduce((sum, item) => sum + Number(item.total_amount), 0);
    const shipping = Number(shippingCost) || 0;
    const shippingGst = (shipping * 12) / 100; // GST on shipping cost

    return (itemsTotal + shipping + shippingGst).toFixed(2);
  }, [addedItems, shippingCost, taxAmounts]);

  useEffect(() => {
    const mainSubTotal = addedItems
    ?.reduce((sum, item) => {
      const itemSubTotal = isNaN(Number(item.sub_total)) ? 0 : Number(item.sub_total);
      return sum + itemSubTotal;
    }, 0)
    ?.toFixed(2); 
    const gstTotal = addedItems
    ?.reduce((sum, item) => {
      const itemSubTotal = isNaN(Number(item.tax_amount)) ? 0 : Number(item.tax_amount);
      return sum + itemSubTotal;
    }, 0)
    ?.toFixed(2); 
 
    const invoiceData = {
      sub_total: mainSubTotal,
      shipping_cost: isNaN(Number(shippingCost)) ? '0.00' : shippingCost.toFixed(2),
      grand_total: isNaN(Number(grandTotal)) ? '0.00' : grandTotal,
      total_gst:gstTotal,
      invoice_items: addedItems.map((item) => ({
        item_id: Number(item.item_id),
        quantity: Number(item.quantity),
        unit_id: Number(item.unit_id),
        unit_name: item.unit_name,
        price: item.price,
        price_tax_type: item.price_tax_type,
        discount: item.discount,
        discount_type: item.discount_type,
        sub_total:item.sub_total,
        tax: item.tax,
        tax_type: 'GST',
        tax_amount: isNaN(Number(item.tax_amount)) ? 0 : item.tax_amount,
        total_amount: isNaN(Number(item.total_amount)) ? 0 : item.total_amount,
      })),
    };

    onChildDataChange(invoiceData);
  }, [addedItems, shippingCost, grandTotal, taxAmounts, onChildDataChange]);

  console.log("addedItems",addedItems)
  


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
                      <th>Cost</th>
                      <th>GST</th>
                      <th>Discount</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="align-middle">
                        <select className="form-control" value={selectedProduct} onChange={handleProductChange}>
                          <option value="">--Select Product--</option>
                          {itemList?.map((option, index) => (
                            <option key={index} value={option?.id}>
                              {option?.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="align-middle">{singleDetail?.hsn}</td>
                      <td className="align-middle">
                        <div className="input-group">
                          <input className="form-control" type="text" value={quantity} onChange={handleQuantityChange} />
                          <select className="form-control" value={selectedUnit} onChange={handleUnitChange}>
                            <option value="">--Select Unit--</option>
                            {units?.map((option, index) => (
                              <option key={index} value={option?.id}>
                                {option?.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="align-middle">
                        <input type="text" className="form-control" value={singleDetail?.sale_price ? parseFloat(singleDetail?.sale_price).toFixed(2) : 0} />
                      </td>
                      <td className="align-middle">₹{((singleDetail?.sale_price || 0) * (quantity || 0)).toFixed(2).toString().replace(/^-/, '₹')}</td>
                      <td className="align-middle">
                        <div className="input-group">
                          <select className="form-control" name="tax" value={parseFloat(tax)} onChange={handleTaxSelectChange}>
                            <option value="0">Exempted</option>
                            <option value="2.5">2.5%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                          <select className="form-control" name="tax_type" value={taxType} onChange={handleTaxTypeSelectChange}>
                            <option value="Including Tax">Including Tax</option>
                            <option value="Excluding Tax">Excluding Tax</option>
                          </select>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="input-group">
                          <input type="text" className="form-control" value={discount} onChange={handleDiscountChange} />
                          <select className="form-control" value={discountType} onChange={handleDiscountTypeChange}>
                            <option value="Fixed">Fixed</option>
                            <option value="Percentage">Percentage</option>
                          </select>
                        </div>
                      </td>
                      <td className="align-middle">₹{(totalAmount?.finalTotal).toFixed(2).toString().replace(/^-/, '₹')}</td>
                      <td className="align-middle">
                        <button className="btn-sm btn-success" onClick={handleAddItem}>
                          Add
                        </button>
                      </td>
                    </tr>

                    {addedItems?.map((item, index) => (
                      <tr key={index}>
                        {/* Product Name Dropdown */}
                        <td className="align-middle">
                          <select className="form-control" value={item?.item_id} onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}>
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
                            <select className="form-control" value={item?.unit_id} onChange={(e) => handleItemChange(index, 'unit_id', e.target.value)}>
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
                        <td className="align-middle">₹{((item?.price || 0) * (item?.quantity || 0)).toFixed(2).toString().replace(/^-/, '₹')}</td>

                        {/* GST and Tax */}
                        <td className="align-middle">
                          <div className="input-group">
                            <select className="form-control" name="tax" value={parseFloat(item?.tax)} onChange={(e) => handleItemChange(index, 'tax', e.target.value)} style={{ width: '100px' }}>
                              <option value="0">Exempted</option>
                              <option value="2.5">2.5%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </select>
                            <select className="form-control" name="price_tax_type" value={item?.price_tax_type} onChange={(e) => handleItemChange(index, 'price_tax_type', e.target.value)}>
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
                              value={item?.discount }
                              onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                            />
                            <select className="form-control" name="discount_type" value={item?.discount_type} onChange={(e) => handleItemChange(index, 'discount_type', e.target.value)}>
                              <option value="Fixed">Fixed</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="align-middle">₹{(Number(item?.total_amount) || 0).toFixed(2).toString().replace(/^-/, '₹')}</td>

                        {/* Remove Button */}
                        <td className="align-middle">
                          <button className="btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colspan="7" className="text-right align-middle">
                        <strong>Shipping Cost:</strong>
                        <span className="fw-normal text-muted">(12% GST applicable)</span>
                      </td>
                      <td colspan="2" className="align-middle">
                        <input type="text" className="form-control" name="shipping_cost" value={shippingCost} onChange={handleShippingCostChange} />
                      </td>
                    </tr>

                    <tr>
                      <td colspan="7" className="text-right align-middle">
                        <strong>Grand Total:</strong>
                      </td>
                      <td colspan="2" className="align-middle">
                        ₹{grandTotal ? grandTotal : 0}
                      </td>
                    </tr>
                    {Object.entries(taxAmounts).map(([taxRate, amount], index) => {
                      if (amount > 0) {
                        // Only show taxes with a non-zero amount
                        return (
                          <tr key={index}>
                            <td colSpan="7" className="text-right align-middle">
                              <strong>GST {taxRate}%:</strong>
                            </td>
                            <td colSpan="2" className="align-middle">
                              ₹{amount.toFixed(2)}
                            </td>
                          </tr>
                        );
                      }
                      return null; // Do not render rows with zero tax amounts
                    })}
                  </tbody>
                </table>
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-6">
                      <button type="button" class="btn btn-default" onClick={onSubmit}>
                        Generate Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSecond;
