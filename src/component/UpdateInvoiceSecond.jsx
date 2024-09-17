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
  const [quantity, setQuantity] = useState(null);
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
  const[itemIndex,setItemIndex]=useState(null)

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
      setShippingChanged(false);
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

  const handleProductChange = (e) => setSelectedProduct(e.target.value);
  const handleQuantityChange = (e) => setQuantity(e.target.value);
  const handleDiscountChange = (e) => setDiscount(e.target.value);
  const handleDiscountTypeChange = (e) => setDiscountType(e.target.value);
  const handleUnitChange = (e) => setSelectedUnit(e.target.value);
  const handleTaxSelectChange = (e) => setTax(parseFloat(e.target.value));
  const handleTaxTypeSelectChange = (e) => setTaxType(e.target.value);
  
  // Handle shipping cost change
  const handleShippingCostChange = (e) => {
    const newShippingCost = parseFloat(e.target.value) || 0;
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
    const item = addedItems[itemIndex];
  
    const itemPrice = parseFloat(item?.price) || 0;
    const itemQuantity = parseFloat(item?.quantity) || 0;
  
    // Use item price and quantity if available; fallback to singleDetail or defaults
    let price = Number(itemPrice || singleDetail?.sale_price || 0);
    let quantityTotal = price * (itemQuantity || quantity || 1);
    let gst = Number(item?.tax || tax || 0); // Prioritize item's tax, fallback to global tax
    
    let taxAmount = 0;
    let totalBeforeTax = quantityTotal;
  
    const itemTaxType = item?.price_tax_type || taxType; // Use item's tax type or fallback to global
  
    // Step 1: Calculate tax based on "Including Tax"
    if (itemTaxType === 'Including Tax') {
      taxAmount = (quantityTotal * gst) / (100 + gst); // Calculate tax included in the price
      taxAmount = Math.floor(taxAmount * 100) / 100; // Truncate to 2 decimal places
      totalBeforeTax = quantityTotal - taxAmount; // Remove tax to get base price
    } else if (itemTaxType === 'Excluding Tax') {
      taxAmount = (quantityTotal * gst) / 100; // Calculate tax separately
      taxAmount = Math.floor(taxAmount * 100) / 100; // Truncate to 2 decimal places
    }
  
    // Step 2: Apply discount on the total before tax
    let discountAmount = 0;
    if (discountType === 'Fixed' && discount) {
      discountAmount = Number(discount); // Fixed discount amount
    } else if (discountType === 'Percentage' && discount) {
      discountAmount = (totalBeforeTax * Number(discount)) / 100; // Percentage discount
    }
    let discountedTotal = totalBeforeTax - discountAmount;
  
    // Step 3: Recalculate tax based on discounted total
    let recalculatedTax = 0;
    if (itemTaxType === 'Including Tax') {
      recalculatedTax = (discountedTotal * gst) / 100; // Calculate recalculated tax for including tax
      recalculatedTax = Math.floor(recalculatedTax * 100) / 100; // Truncate to 2 decimal places
    } else if (itemTaxType === 'Excluding Tax') {
      recalculatedTax = (discountedTotal * gst) / 100; // Recalculate for excluding tax
      recalculatedTax = Math.floor(recalculatedTax * 100) / 100;
    }
  
    // Step 4: Final total = discounted total + recalculated tax
    let finalTotal = discountedTotal + parseFloat(recalculatedTax);
  
    // console.log(finalTotal, "finalTotal");
    return {
      finalTotal: Math.floor(finalTotal * 100) / 100,
      discountedTotal,
    };
  }, [quantity, discount, discountType, singleDetail, tax, taxType, addedItems, itemIndex]);
  
  

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
    console.log(totalAmount?.finalTotal)
    const newItem = {
      id: selectedProduct,
      item_id: selectedProduct,
      hsn: singleDetail?.hsn,
      quantity,
      unit: String(units.find((unit) => unit.id === singleDetail?.unit)?.id || ''),
      unit_name: String(units.find((unit) => unit.id === singleDetail?.unit)?.unit || ''),
      price: price,
      gst: gst,
      discount_type:discount,
      discountType,
      total_amount: Math.floor(totalAmount?.finalTotal * 100) / 100,
      taxType: taxType,
      tax_amount: Math.floor(taxAmount * 100) / 100,
      sub_total:Math.floor(totalAmount?.discountedTotal * 100) / 100
    };
  
    setAddedItems([...addedItems, newItem]);
    clearInputs();
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
    // Calculate the total from addedItems
    const itemsTotal = addedItems.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
  
    // Include the shipping cost if it has changed, along with its GST
    let total = itemsTotal +shippingCost;
  
    if (shippingChanged) {
      const shippingGst = (Number(shippingCost) * 12) / 100;
      total += Number(shippingCost) + shippingGst;
    }
  
    return total;
  }, [addedItems, shippingCost, shippingChanged]);
  




  const handleItemChange = (index, field, value) => {
    setItemIndex(index); // Track which item is being edited
    const updatedItems = [...addedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
  
    const itemPrice = parseFloat(updatedItems[index].price) || 0;
    const itemQuantity = parseFloat(updatedItems[index].quantity) || 0;
    const itemTotalWithoutTax = itemPrice * itemQuantity;
    
    let gst = parseFloat(updatedItems[index].tax) || 0;
    const itemTaxType = updatedItems[index].price_tax_type || taxType;
  
    // Calculate tax based on the tax type
    let taxAmount = 0;
    if (itemTaxType === 'Including Tax') {
      taxAmount = (itemTotalWithoutTax * gst) / (100 + gst); // Tax included in the price
      taxAmount = Math.floor(taxAmount * 100) / 100;
    } else if (itemTaxType === 'Excluding Tax') {
      taxAmount = (itemTotalWithoutTax * gst) / 100; // Tax added separately
      taxAmount = Math.floor(taxAmount * 100) / 100;
    }
  
    // Calculate the discount
    let discountValue = 0;
    if (updatedItems[index].discountType === 'Percentage' && updatedItems[index].discount) {
      discountValue = (itemTotalWithoutTax * parseFloat(updatedItems[index].discount)) / 100;
    } else if (updatedItems[index].discountType === 'Fixed' && updatedItems[index].discount) {
      discountValue = parseFloat(updatedItems[index].discount);
    }
  
    // Apply the discount
    const totalBeforeTaxAfterDiscount = itemTotalWithoutTax - discountValue;
  
    // Recalculate the tax on the discounted amount
    if (itemTaxType === 'Including Tax') {
      taxAmount = (totalBeforeTaxAfterDiscount * gst) / (100 + gst);
      taxAmount = Math.floor(taxAmount * 100) / 100;
    } else if (itemTaxType === 'Excluding Tax') {
      taxAmount = (totalBeforeTaxAfterDiscount * gst) / 100;
      taxAmount = Math.floor(taxAmount * 100) / 100;
    }
  
    // Final total after applying discount and recalculated tax
    let finalTotal = totalBeforeTaxAfterDiscount;
    if (itemTaxType === 'Excluding Tax') {
      finalTotal += taxAmount;
    }
  
    // Update the total and tax amounts for the item
    updatedItems[index].total_amount = Math.floor(finalTotal * 100) / 100;
    updatedItems[index].tax_amount = taxAmount;
  
    // Update the tax amounts object
    const newTaxAmounts = { ...taxAmounts };
    const oldGst = parseFloat(addedItems[index]?.tax) || 0;
    const oldTaxAmount = (itemTotalWithoutTax * oldGst) / 100;
  
    if (newTaxAmounts[oldGst]) {
      newTaxAmounts[oldGst] -= oldTaxAmount;
      if (newTaxAmounts[oldGst] < 0) {
        newTaxAmounts[oldGst] = 0;
      }
    }
    
    if (newTaxAmounts[gst]) {
      newTaxAmounts[gst] += taxAmount;
    } else {
      newTaxAmounts[gst] = taxAmount;
    }
  
    settaxAmounts(newTaxAmounts);
    setAddedItems(updatedItems);
    console.log(updatedItems)
  };
  
  

  // const handleRemoveItem = (index) => {
  //   const updatedItems = [...addedItems];
  //   const item = updatedItems[index];

  //   const gst = parseFloat(item.gst) || 0;
  //   const price = parseFloat(item.price) || 0;
  //   const itemQuantity = parseFloat(item.quantity) || 0;
  //   let taxAmount = 0;

  //   if (item.taxType === 'Excluding Tax') {
  //     taxAmount = (price * itemQuantity * gst) / 100;
  //   } else if (item.taxType === 'Including Tax') {
  //     const priceIncludingTax = price * itemQuantity;
  //     taxAmount = (priceIncludingTax * gst) / 100;
  //   }

  //   const newTaxAmounts = { ...taxAmounts };
  //   if (newTaxAmounts[gst]) {
  //     newTaxAmounts[gst] -= taxAmount;
  //     if (newTaxAmounts[gst] < 0) {
  //       newTaxAmounts[gst] = 0;
  //     }
  //   }

  //   settaxAmounts(newTaxAmounts);
  //   updatedItems.splice(index, 1);
  //   setAddedItems(updatedItems);
  // };

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
      if (newTaxAmounts[gst] < 0) newTaxAmounts[gst] = 0;
    }

    settaxAmounts(newTaxAmounts);
    updatedItems.splice(index, 1);
    setAddedItems(updatedItems);
  };

  useEffect(() => {
    const itemsTotal = addedItems.reduce(
      (sum, item) => sum + (Number(item.total_amount) || 0),
      0
    );
    const shippingGst = (shippingCost * 12) / 100;
    const total = itemsTotal + shippingCost + shippingGst;

    onChildDataChange({
      items: addedItems,
      total,
      shipping_cost: shippingCost,
      taxAmounts,
    });
  }, [addedItems, shippingCost, onChildDataChange, taxAmounts]);


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
                              onChange={(e) => {handleItemChange(index, 'quantity', e.target.value);setQuantity(e.target.value)}}
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
                            <select className="form-control" name="tax" value={parseFloat(item.gst||item.tax) || 0} onChange={(e) => {handleItemChange(index, 'tax', e.target.value);setTax(e.target.value)}}>
                              <option value="0">Exempted</option>
                              <option value="2.5">2.5%</option>
                              <option value="5">5%</option>
                              <option value="12">12%</option>
                              <option value="18">18%</option>
                              <option value="28">28%</option>
                            </select>
                            <select className="form-control" name="price_tax_type" value={item.taxType ||item.price_tax_type} onChange={(e) =>{handleItemChange(index, 'price_tax_type', e.target.value); setTax(e.target.value)} }>
                              <option value="Including Tax">Including Tax</option>
                              <option value="Excluding Tax">Excluding Tax</option>
                            </select>
                          </div>
                        </td>
                        <td className="align-middle">
                          <div className="input-group">
                            <input type="text" className="form-control" value={item.discount || 0} onChange={(e) => {handleItemChange(index, 'discount', e.target.value);setDiscount(e.target.value)}} />
                            <select className="form-control" name="discount_type" value={item.discountType} onChange={(e) => {handleItemChange(index, 'discount_type', e.target.value);setDiscountType(e.target.value)}}>
                              <option value="Fixed">Fixed</option>
                              <option value="Percentage">Percentage</option>
                            </select>
                          </div>
                        </td>
                        <td className="align-middle">₹{(item.total_amount)}</td>
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
                        ₹{(Number(currentGrandTotal))|| 0}
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
