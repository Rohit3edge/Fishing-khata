import React, { useState, useEffect, useMemo } from 'react';
import { Getunits } from '../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';

const UpdateInvoiceSecond = ({ onChildDataChange, onSubmit, data }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [units, setUnits] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [singleDetail, setSingleDetail] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('Fixed');
  const [shippingCost, setShippingCost] = useState(0);
  const [addedItems, setAddedItems] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [taxAmounts, settaxAmounts] = useState({});
  const [tax, setTax] = useState(0);
  const [taxType, setTaxType] = useState('Excluding Tax');
  const [prevGrandTotal, setPrevGrandTotal] = useState(0);
  const [shippingChanged, setShippingChanged] = useState(false);

  // Fetch units from API
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

  // Fetch items list
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

  // Fetch product details when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      dispatch(Getsingledetail({ profile_id: id, item_id: selectedProduct }))
        .unwrap()
        .then((data) => {
          setSingleDetail(data?.data);
          setSelectedUnit(data?.data?.unit || '');
          setTax(data?.data?.tax || 0);
          setTaxType(data?.data?.sale_price_tax_type || 'Excluding Tax');
        })
        .catch(({ message }) => {
          console.log(message);
        });
    }
  }, [dispatch, selectedProduct, id]);

  useEffect(() => {
    if (data) {
      setShippingCost(Number(data?.invoice?.shipping_cost) || 0);
      setAddedItems(data.items || []);
      setPrevGrandTotal(parseFloat(data.invoice?.grand_total || 0));
      setShippingChanged(false); // Mark shipping as unchanged initially
    }
  }, [data]);


  // Recalculate tax on shipping cost change
  useEffect(() => {
    if (shippingChanged) {
      const shippingGst = (shippingCost * 12) / 100;
      const updatedTaxAmounts = { ...taxAmounts };
      if (shippingGst > 0) {
        updatedTaxAmounts[12] = shippingGst;
      } else {
        delete updatedTaxAmounts[12];
      }
      settaxAmounts(updatedTaxAmounts);
    }
  }, [shippingCost, shippingChanged, taxAmounts]);
  
  // Handle shipping cost change
  const handleShippingCostChange = (e) => {
    const newShippingCost = parseFloat(e.target.value) || 0;
    
    // Only mark shipping as changed if the new value is different from the initial shipping cost
    if (newShippingCost !== shippingCost) {
      setShippingChanged(true);
      setShippingCost(newShippingCost);
  
      // Calculate GST on new shipping cost
      const shippingGst = (newShippingCost * 12) / 100;
      const updatedTaxAmounts = { ...taxAmounts };
      if (shippingGst > 0) {
        updatedTaxAmounts[12] = shippingGst;
      } else {
        delete updatedTaxAmounts[12];
      }
      settaxAmounts(updatedTaxAmounts);
    }
  };

  // Calculate total amount for a single item
  const totalAmount = useMemo(() => {
    let price = Number(singleDetail?.sale_price) || 0;
    let gst = Number(tax) || 0;
    let quantityTotal = price * quantity || 0;
    let taxAmount = 0;
    let totalBeforeTax = quantityTotal;

    // Step 1: Calculate tax based on "Including Tax"
    if (taxType === 'Including Tax') {
      taxAmount = (quantityTotal * gst) / (100 + gst); // Calculate tax already included in the price
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

    // Step 4: Final total = discounted total + recalculated tax
    let finalTotal = discountedTotal + parseFloat(recalculatedTax); // Make sure it's a numbe
    
    console.log(discountedTotal)
    return {
      finalTotal: Math.floor(finalTotal * 100) / 100,
      discountedTotal
    };
  }, [quantity, discount, discountType, singleDetail, tax, taxType,addedItems]);
  

  // Add new item to the invoice
  const handleAddItem = () => {
    const gst = parseFloat(tax) || 0;
    const price = parseFloat(singleDetail?.sale_price) || 0;
    let taxAmount = 0;
  
    if (taxType === 'Excluding Tax') {
      taxAmount = (price * quantity * gst) / 100;
    } else if (taxType === 'Including Tax') {
      const priceIncludingTax = price * quantity;
      taxAmount = (priceIncludingTax * gst) / (100 + gst);
    }
  
    const newTaxAmounts = { ...taxAmounts };
    if (newTaxAmounts[gst]) {
      newTaxAmounts[gst] += taxAmount;
    } else {
      newTaxAmounts[gst] = taxAmount;
    }
  
    settaxAmounts(newTaxAmounts);
  
    const newItem = {
      id: selectedProduct,
      name: selectedProduct,
      hsn: singleDetail?.hsn,
      quantity,
      unit: String(units.find((unit) => unit.id === singleDetail?.unit)?.id || ''),
      unit_name: String(units.find((unit) => unit.id === singleDetail?.unit)?.unit || ''),
      price: price,
      gst: gst,
      discount,
      discountType,
      total: Math.floor(totalAmount?.finalTotal * 100) / 100,
      taxType: singleDetail?.sale_price_tax_type,
      tax_amount: taxAmount,
    };
  
    setAddedItems([...addedItems, newItem]);
    clearInputs();
  };
  

  // Remove an item from the invoice
  const handleRemoveItem = (index) => {
    const updatedItems = [...addedItems];
    const item = updatedItems[index];

    const gst = parseFloat(item.gst) || 0;
    const price = parseFloat(item.price) || 0;
    const itemQuantity = parseFloat(item.quantity) || 0;
    let taxAmount = 0;

    if (item.taxType === 'Excluding Tax') {
      taxAmount = (price * itemQuantity * gst) / 100;
    } else if (item.taxType === 'Including Tax') {
      const priceIncludingTax = price * itemQuantity;
      taxAmount = (priceIncludingTax * gst) / 100;
    }

    const newTaxAmounts = { ...taxAmounts };
    if (newTaxAmounts[gst]) {
      newTaxAmounts[gst] -= taxAmount;
      if (newTaxAmounts[gst] < 0) {
        newTaxAmounts[gst] = 0;
      }
    }

    settaxAmounts(newTaxAmounts);
    updatedItems.splice(index, 1);
    setAddedItems(updatedItems);
  };

  // Clear input fields after adding an item
  const clearInputs = () => {
    setSelectedProduct('');
    setQuantity(1);
    setDiscount(0);
    setDiscountType('Fixed');
    setSelectedUnit('');
    setTax(0);
    setTaxType('Excluding Tax');
    setSingleDetail({});
  };

  const currentGrandTotal = useMemo(() => {
    const itemsTotal = addedItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    let total = itemsTotal;
    if (shippingChanged) {
      const shippingGst = (Number(shippingCost) * 12) / 100;
      total += Number(shippingCost) + shippingGst;
    }
    return total;
  }, [addedItems, shippingCost, shippingChanged]);
  
  const finalGrandTotal = useMemo(() => {
    const currentTotal = parseFloat(currentGrandTotal || 0);
    const previousTotal = parseFloat(prevGrandTotal || 0);
    return (currentTotal + previousTotal).toFixed(2);
  }, [currentGrandTotal, prevGrandTotal]);
  

  // Update child data when items or shipping cost change
  useEffect(() => {
    const itemsTotal = addedItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const shippingGst = (shippingCost * 12) / 100;
    const total = itemsTotal + shippingCost + shippingGst;

    onChildDataChange({
      items: addedItems,
      total,
      shipping_cost: shippingCost,
      taxAmounts,
    });
  }, [addedItems, shippingCost, onChildDataChange, taxAmounts]); 


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...addedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    console.log("0",field,value)
  
    const itemPrice = parseFloat(updatedItems[index].price) || 0;
    const itemQuantity = parseFloat(updatedItems[index].quantity) || 0;
    const itemTotalWithoutTax = itemPrice * itemQuantity;
  
    if (field === 'tax' || field === 'price_tax_type') {
      const newTaxAmounts = { ...taxAmounts };
      const oldGst = parseFloat(addedItems[index]?.tax) || 0;
      const newGst = parseFloat(field === 'tax' ? value : updatedItems[index].tax) || 0;
  
      const oldTaxAmount = Math.floor(((itemTotalWithoutTax * oldGst) / 100) * 100) / 100;
      const newTaxAmount = Math.floor(((itemTotalWithoutTax * newGst) / 100) * 100) / 100;

      console.log("1",newTaxAmount,oldTaxAmount)
  
      if (newTaxAmounts[oldGst]) {
        newTaxAmounts[oldGst] -= oldTaxAmount;
        if (newTaxAmounts[oldGst] < 0) {
          newTaxAmounts[oldGst] = 0;
        }
      }
  
      if (newTaxAmounts[newGst]) {
        newTaxAmounts[newGst] += newTaxAmount;
      } else {
        newTaxAmounts[newGst] = newTaxAmount;
      }
  
      settaxAmounts(newTaxAmounts);
      console.log("2",newTaxAmount)
  
      let newTotal;
      if (updatedItems[index]?.taxType === 'Including Tax') {
        newTotal = Math.floor((itemTotalWithoutTax / (1 + newGst / 100)) * 100) / 100;
      } else if (updatedItems[index]?.taxType === 'Excluding Tax') {
        newTotal = Math.floor((itemTotalWithoutTax + newTaxAmount) * 100) / 100;
      }
  
      updatedItems[index].total = newTotal?.toFixed(2);
      console.log("3",newTotal)
    }
  
    if (field === 'discount' || field === 'discountType') {
      let discountValue = parseFloat(updatedItems[index].discount) || 0;
      if (updatedItems[index].discountType === 'Percentage') {
        discountValue = (itemTotalWithoutTax * discountValue) / 100;
      }
  
      updatedItems[index].total = Math.floor((itemTotalWithoutTax - discountValue) * 100) / 100;
      updatedItems[index].total = updatedItems[index].total.toFixed(2);
    }
    console.log("4",updatedItems)
    setAddedItems(updatedItems);
  };
  

  const handleProductChange = (e) => setSelectedProduct(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleDiscountChange = (e) => setDiscount(e.target.value);
  const handleDiscountTypeChange = (e) => setDiscountType(e.target.value);
  const handleUnitChange = (e) => setSelectedUnit(e.target.value);
  const handleTaxSelectChange = (e) => setTax(parseFloat(e.target.value));
  const handleTaxTypeSelectChange = (e) => setTaxType(e.target.value);


// console.log(tax,quantity,taxType)
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
                          {itemList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="align-middle">{singleDetail?.hsn || 'N/A'}</td>
                      <td className="align-middle">
                        <div className="input-group">
                          <input className="form-control" type="text" value={quantity} onChange={handleQuantityChange} />
                          <select className="form-control" value={selectedUnit} onChange={handleUnitChange}>
                            <option value="">--Select Unit--</option>
                            {units.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="align-middle">
                        <input type="text" className="form-control" value={parseFloat(singleDetail?.sale_price || 0).toFixed(2)} readOnly />
                      </td>
                      <td className="align-middle">₹{parseFloat(singleDetail?.sale_price || 0) * quantity || 0}</td>
                      <td className="align-middle">
                        <div className="input-group">
                          <select className="form-control" name="tax" value={parseFloat(tax) || 0} onChange={handleTaxSelectChange}>
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
                          <input type="text" className="form-control" value={discount || 0} onChange={handleDiscountChange} />
                          <select className="form-control" value={discountType} onChange={handleDiscountTypeChange}>
                            <option value="Fixed">Fixed</option>
                            <option value="Percentage">Percentage</option>
                          </select>
                        </div>
                      </td>
                      <td className="align-middle">₹{totalAmount.finalTotal || 0}</td>
                      <td className="align-middle">
                        <button className="btn-sm btn-success" onClick={handleAddItem}>
                          Add
                        </button>
                      </td>
                    </tr>

                    {addedItems.map((item, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <select className="form-control" value={item.name || item.item_id} onChange={(e) => handleItemChange(index, 'name', e.target.value)}>
                            <option value="">--Select Product--</option>
                            {itemList.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="align-middle">{item.hsn_number || 'N/A'}</td>
                        <td className="align-middle">
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="text"
                              style={{ width: '40px', padding: '0.4rem' }}
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            />
                            <select className="form-control" value={item.unit||item.unit_id} onChange={(e) => handleItemChange(index, 'unit', e.target.value)}>
                              <option value="">--Select Unit--</option>
                              {units.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="align-middle">
                          <input type="text" className="form-control" value={parseFloat(item.price || 0).toFixed(2)} onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
                        </td>
                        <td className="align-middle">₹{parseFloat(item.price || 0) * parseFloat(item.quantity || 0) || 0}</td>
                        <td className="align-middle">
                          <div className="input-group">
                            <select className="form-control" name="tax" value={parseFloat(item.gst||item.tax) || 0} onChange={(e) => handleItemChange(index, 'tax', e.target.value)}>
                              <option value="0">Exempted</option>
                              <option value="2.5">2.5%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </select>
                            <select className="form-control" name="price_tax_type" value={item.taxType ||item.price_tax_type} onChange={(e) => handleItemChange(index, 'price_tax_type', e.target.value)}>
                              <option value="Including Tax">Including Tax</option>
                              <option value="Excluding Tax">Excluding Tax</option>
                            </select>
                          </div>
                        </td>
                        <td className="align-middle">
                          <div className="input-group">
                            <input type="text" className="form-control" value={item.discount || 0} onChange={(e) => handleItemChange(index, 'discount', e.target.value)} />
                            <select className="form-control" name="discount_type" value={item.discountType} onChange={(e) => handleItemChange(index, 'discountType', e.target.value)}>
                              <option value="Fixed">Fixed</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </div>
                        </td>
                        <td className="align-middle">₹{(item.total ?? item.total_amount)|| 0}</td>
                        <td className="align-middle">
                          <button className="btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan="7" className="text-right align-middle">
                        <strong>Shipping Cost:</strong>
                        <span className="fw-normal text-muted">(12% GST applicable)</span>
                      </td>
                      <td colSpan="2" className="align-middle">
                        <input type="text" className="form-control" name="shipping_cost" value={shippingCost} onChange={handleShippingCostChange} />
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="7" className="text-right align-middle">
                        <strong>Grand Total:</strong>
                      </td>
                      <td colSpan="2" className="align-middle">
                        ₹{(Number(finalGrandTotal))|| 0}
                      </td>
                    </tr>
                    {/* {Object.entries(taxAmounts).map(
                      ([taxRate, amount]) =>
                        amount > 0 && (
                          <tr key={taxRate}>
                            <td colSpan="7" className="text-right align-middle">
                              <strong>GST {taxRate}%:</strong>
                            </td>
                            <td colSpan="2" className="align-middle">
                              ₹{amount.toFixed(2)}
                            </td>
                          </tr>
                        )
                    )} */}
                  </tbody>
                </table>
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-6">
                      <button type="button" class="btn btn-default" onClick={onSubmit}>
                        Update Invoice
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

export default UpdateInvoiceSecond;
