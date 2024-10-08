import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Getunits } from '../store/slices/settings';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';
import {GetAdditionalTax } from "../store/slices/purchase"
import ProductSelector from '../common/ProductSelector';
import ItemRow from '../common/ItemRow';

const EditDebitNoteSec = ({ onChildDataChange,data}) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const [state, setState] = useState({
    units: [],
    additionaltax:[],
    itemList: [],
    singleDetail: {},
    selectedProduct: null,
    quantity: 1,
    unit_id: null,
    discount: 0,
    price: 0,
    discount_type: 'Fixed',
    shippingCost:0,
    addedItems: [],
    tax: 0,
    price_tax_type: 'Excluding Tax',
    subtotal: 0,
    taxAmounts: {},
    hsn: null,
    shippingGst: 0,
    add_tax:""
  });

  const fetchUnits = useCallback(async () => {
    try {
      const data = await dispatch(Getunits()).unwrap();
      setState((prevState) => ({ ...prevState, units: data.data }));
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch]);

  const fetchItemList = useCallback(async () => {
    try {
      const data = await dispatch(Listitems({ profile_id: id })).unwrap();
      setState((prevState) => ({ ...prevState, itemList: data?.data }));
    } catch (error) {
      console.error(error.message);
    }
  }, [dispatch, id]);

  const fetchAdditionalTax = useCallback(async () => {
    try {
      const data = await dispatch(GetAdditionalTax({ profile_id: id })).unwrap();
      console.log( data?.data )
      setState((prevState) => ({ ...prevState, additionaltax: data?.data }));
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUnits();
    fetchItemList();
    fetchAdditionalTax();
  }, [fetchUnits, fetchItemList]);


  useEffect(() => {
    // Initialize addedItems from the passed data
    if (data?.items) {
      const initializedItems = data?.items?.map((item) => ({
        id:item.id,
        hsn: item.hsn,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_id: item.unit_id,
        unit_name: item.unit_name, 
        price: item.price,
        price_tax_type: item.price_tax_type || "Including Tax",
        tax: item.tax || 0,
        tax_type: item.tax_type || 'GST' ,
        discount: item.discount || 0,
        discount_type: item.discount_type || "Fixed",
        discount_amount:0,
        tax_amount: item.tax_amount || 0,
        sub_total: item.sub_total || 0,
        total_amount: item.total_amount || 0,
        other_tax: item.other_tax || 0,
        other_tax_type: item.other_tax_type || "",
      }));

      // Calculate initial taxAmounts based on data?.items
      const initialTaxAmounts = initializedItems.reduce((acc, item) => {
        const taxRate = parseFloat(item.tax) || 0;
        const taxAmount = parseFloat(item.tax_amount) || 0;
        console.log("item.tax",item.tax,"item.tax_amount",item.tax_amount)
  
        if (taxRate > 0) {
          if (acc[taxRate]) {
            acc[taxRate] += taxAmount;
          } else {
            acc[taxRate] = taxAmount;
          }
        }
        return acc;
      }, {});
      // Check if shipping cost exists and calculate shipping GST (12%)
      const shippingCost = parseFloat(data?.debit_note?.shipping_amount) || 0;
      if (shippingCost > 0) {
        const shippingTaxRate = 12; // Fixed 12% GST for shipping
        const shippingGst = parseFloat(((shippingCost * shippingTaxRate) / 100).toFixed(2));
        setState((prevState) => ({
          ...prevState,
          shippingGst:shippingGst
        }));
        // Add shipping GST to initialTaxAmounts
        if (initialTaxAmounts[shippingTaxRate]) {
          initialTaxAmounts[shippingTaxRate] += shippingGst;
        } else {
          initialTaxAmounts[shippingTaxRate] = shippingGst;
        }
      }
      setState((prevState) => ({
        ...prevState,
        addedItems: initializedItems,
        taxAmounts: initialTaxAmounts,
        shippingCost: Number(data?.debit_note?.shipping_amount) || 0,

      }));
    }
  }, [data]);


  const handleProductChange = useCallback(
    async (productId) => {
      setState((prevState) => ({
        ...prevState,
        selectedProduct: productId ? productId : null,
      }));

      if (productId) {
        try {
          const data = await dispatch(Getsingledetail({ profile_id: id, item_id: productId })).unwrap();
          setState((prevState) => ({
            ...prevState,
            price:data?.data?.purchase_price,
            singleDetail: data?.data,
            unit_id: data?.data?.unit || '',
            tax: data?.data?.tax || 0,
            price_tax_type: data?.data?.sale_price_tax_type || 'Excluding Tax',
            discount_type: data?.data?.discount_type || "Fixed",
            discount:Number(data?.data?.discount).toFixed(2)||0,
          }));
        } catch (error) {
          console.error(error.message);
        }
      } else {
        // Optionally clear product details if no product is selected
        setState((prevState) => ({
          ...prevState,
          singleDetail: {},
          selectedUnit: '',
          tax: 0,
          price_tax_type: 'Excluding Tax',
        }));
      }
    },
    [dispatch, id]
  );

  const handleInputChange = (field, value) => {
    if (field === 'shippingCost') {
      const shippingCost = parseFloat(value) || 0;
      const shippingTaxRate = 12; // Fixed rate for shipping GST
      const shippingGst = parseFloat(((shippingCost * shippingTaxRate) / 100).toFixed(2)); // Calculate GST for shipping

      // Retrieve the existing shipping GST from the state or set it to 0 if not present
      const existingShippingGst = state.shippingGst || 0;

      // Copy the existing taxAmounts state
      const updatedTaxAmounts = { ...state.taxAmounts };

      // Calculate the difference between the new shipping GST and the existing one
      const difference = shippingGst - existingShippingGst;

      // If there is an existing entry for the 12% tax, adjust it by the difference
      if (updatedTaxAmounts[shippingTaxRate]) {
        updatedTaxAmounts[shippingTaxRate] += difference;
      } else {
        updatedTaxAmounts[shippingTaxRate] = shippingGst; // Initialize shipping GST for the 12% rate if not present
      }

      // Remove the tax rate if the amount becomes zero to avoid negative values
      if (updatedTaxAmounts[shippingTaxRate] <= 0) {
        delete updatedTaxAmounts[shippingTaxRate];
      }

      // Update the state with the new shipping cost and updated taxAmounts
      setState((prevState) => ({
        ...prevState,
        shippingCost,
        shippingGst, // Store the current shipping GST for future use
        taxAmounts: updatedTaxAmounts, // Update the tax amounts including shipping GST
      }));
    } else {
      // For other fields, update state normally
      setState((prevState) => ({ ...prevState, [field]: value }));
    }
  };
   
  

  const calculateTotal = useMemo(() => {
    const { quantity, discount, discount_type, tax, price_tax_type, add_tax } = state; // Include add_tax in destructuring
    let price = Number(state.price) || 0;
    let quantityTotal = price * quantity || 0;
    let taxAmount = 0;
    let totalBeforeTax = quantityTotal;
  
    // Corrected calculation for tax and pre-tax amount when tax is included
    if (price_tax_type === 'Including Tax') {
      totalBeforeTax = +(quantityTotal / (1 + tax / 100)).toFixed(2); // Corrected calculation for pre-tax amount with rounding
      taxAmount = +(quantityTotal - totalBeforeTax).toFixed(2); // Corrected calculation for tax amount with rounding
    } else if (price_tax_type === 'Excluding Tax') {
      taxAmount = +((quantityTotal * tax) / 100).toFixed(2); // Rounding the tax amount
    }
  
    let discountAmount = 0;
    if (discount_type === 'Fixed') {
      discountAmount = Number(discount);
    } else if (discount_type === 'Percentage') {
      discountAmount = +((totalBeforeTax * Number(discount)) / 100).toFixed(2);
    }
    console.log(discountAmount)
    const discountedTotal = +(totalBeforeTax - discountAmount).toFixed(2); // Rounding the discounted total
    // Calculate the additional tax (Cess) if applicable
    const additionalTaxRate = (add_tax?.split('@')[0] || 0); // Get Cess rate
    let additionalTaxAmount = 0;
  
    if (additionalTaxRate > 0) {
      additionalTaxAmount = +(discountedTotal * additionalTaxRate / 100).toFixed(2); // Calculate additional tax based on discounted total
    }
  
    // Final total after applying discount, tax, and additional tax
    const finalTotal = +(discountedTotal + taxAmount + additionalTaxAmount).toFixed(2); // Rounding the final total
    return {
      finalTotal,
      discountedTotal,
      taxAmount,
      additionalTaxAmount, // Return the additional tax amount
      subtotal: discountedTotal,
      discountAmount:discountAmount
    };
  }, [state]);
  

  const handleAddItem = () => {
    const {selectedProduct,quantity, price, unit_id, singleDetail, price_tax_type, tax, discount, discount_type, add_tax } = state;

    if (!selectedProduct || quantity <= 0 || price <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }
    // Find the unit name
    const unitName = state.units.find((unit) => unit.id === unit_id)?.unit || '';
  
    // Calculate the total amounts, including tax, discount, and additional tax (Cess)
    const { taxAmount, subtotal, finalTotal, discountedTotal, additionalTaxAmount,discountAmount } = calculateTotal;
    console.log("calculateTotal",calculateTotal)

    const newItem = {
      hsn: singleDetail.hsn,
      item_id: state.selectedProduct,
      quantity: state.quantity,
      unit_id: unit_id,
      unit_name: unitName,
      price: state.price,
      price_tax_type: price_tax_type,
      tax: tax,
      tax_type: 'GST',
      tax_amount: taxAmount.toFixed(2),
      other_tax: additionalTaxAmount,
      other_tax_type: add_tax,
      discount: discount,
      discount_type: discount_type,
      discount_amount:discountAmount.toFixed(2),
      sub_total: subtotal.toFixed(2),
      total_amount: finalTotal.toFixed(2), // This already includes tax and additional tax
    };
  console.log("newItem",newItem)
    // Logic for recalculating tax and additional tax (Cess)
    const recalculatedTax = taxAmount;
  
    const additionalTaxRate = parseFloat(add_tax?.split('@')[0]) || 0; // Extracting the Cess rate from add_tax
    let additionalTaxToAdd = additionalTaxAmount || 0;
  
    if (additionalTaxRate > 0) {
      additionalTaxToAdd = +(discountedTotal * additionalTaxRate / 100).toFixed(2); // Recalculate additional tax
      console.log("newItem2",newItem.total_amount)
      newItem.total_amount = (parseFloat(newItem.total_amount)).toFixed(2); // Add the additional tax (Cess) to the total amount
    }
  
    // Update the tax amounts in state
    const newTaxAmounts = { ...state.taxAmounts };
    
    // Handling current tax
    const currentTaxRate = parseFloat(tax);
    if (currentTaxRate) {
      if (newTaxAmounts[currentTaxRate]) {
        newTaxAmounts[currentTaxRate] += recalculatedTax;
      } else {
        newTaxAmounts[currentTaxRate] = recalculatedTax;
      }
    }
  
    // Handling additional tax (Cess)
    if (additionalTaxRate > 0) {
      if (newTaxAmounts[additionalTaxRate]) {
        newTaxAmounts[additionalTaxRate] += additionalTaxToAdd;
      } else {
        newTaxAmounts[additionalTaxRate] = additionalTaxToAdd;
      }
    }
  
    // Update the state with the new item and updated tax amounts
    setState((prevState) => ({
      ...prevState,
      addedItems: [...prevState.addedItems, newItem],
      taxAmounts: newTaxAmounts,
    }));
  
    // Clear the input fields
    clearInputs();
  };
  

  const clearInputs = () => {
    setState((prevState) => ({
      ...prevState,
      selectedProduct: null,
      quantity: 1,
      discount: 0,
      discount_type: 'Fixed',
      selectedUnit: '',
      tax: 0,
      price_tax_type: 'Excluding Tax',
      singleDetail: {},
      unit_id: '',
      add_tax:'',
      price:0
    }));
  };

  const handleItemChange = useCallback(
    (field, value, index) => {
      const updatedItems = [...state.addedItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
  
      const itemPrice = parseFloat(updatedItems[index].price) || 0;
      const itemQuantity = parseFloat(updatedItems[index].quantity) || 0;
      let itemTotalWithoutTax = itemPrice * itemQuantity;
  
      const oldGst = parseFloat(state.addedItems[index]?.tax) || 0;
      const newGst = parseFloat(field === 'tax' ? value : updatedItems[index].tax) || 0;
  
      // Add default values if undefined
      const discountValue = parseFloat(updatedItems[index]?.discount) || 0;
      const discountType = updatedItems[index]?.discount_type || 'Percentage'; // Default to 'Percentage'
      const priceTaxType = updatedItems[index]?.price_tax_type || 'Excluding Tax'; // Default to 'Excluding Tax'
  
      let newTaxAmount = 0;
      let discountAmount = 0;
      let discountedTotal = itemTotalWithoutTax; // Start with the item total without tax
  
      console.log('Initial Item Total Without Tax:', itemTotalWithoutTax);
  
      const validNewGst = newGst > 0 ? newGst : 0;
  
      // Calculate discount based on type
      if (discountType === 'Percentage' && discountValue) {
        discountAmount = (discountedTotal * discountValue) / 100; // Calculate discount amount
        discountedTotal -= discountAmount; // Apply discount to discountedTotal
        console.log('Discount Amount (Percentage):', discountAmount);
      } else if (discountType === 'Fixed' && discountValue) {
        discountedTotal -= discountValue; // Apply fixed discount
        console.log('Discount Amount (Fixed):', discountValue);
      }
      updatedItems[index].discount_amount= discountAmount.toFixed(2);
  
      // Tax calculations
      if (priceTaxType === 'Excluding Tax') {
        newTaxAmount = (discountedTotal * validNewGst) / 100; // Apply GST
        discountedTotal += newTaxAmount; // Add tax to discountedTotal
        console.log('GST Amount (Excluding Tax):', newTaxAmount);
      } else if (priceTaxType === 'Including Tax') {
        const totalWithTax = discountedTotal;
        newTaxAmount = (totalWithTax * validNewGst) / (100 + validNewGst); // Calculate tax included in the price
        // discountedTotal -= newTaxAmount; // Adjust discounted total for the tax already included
        console.log('GST Amount (Including Tax):', newTaxAmount);
      }
  
      updatedItems[index].tax_amount= newTaxAmount.toFixed(2);
      updatedItems[index].sub_total=(discountedTotal-newTaxAmount).toFixed(2);
      console.log('Total After GST:', discountedTotal);
  
      // Now, add the 2% Cess calculation if selected

      const additionalTaxRate = typeof updatedItems[index]?.add_tax === 'string' 
      ? parseFloat(updatedItems[index]?.add_tax.split('@')[0]) 
      : 0;
      let additionalTaxAmount = 0; // Initialize additional tax amount
  
      if (additionalTaxRate > 0) {
        if (priceTaxType === 'Excluding Tax') {
          additionalTaxAmount = (itemTotalWithoutTax *parseFloat( additionalTaxRate)) / 100; // Cess based on original item total
          discountedTotal += additionalTaxAmount; // Add additional tax to discountedTotal
          console.log('Cess Amount:', additionalTaxAmount);

        } else if (priceTaxType === 'Including Tax') {
          const finalamount=  discountedTotal - newTaxAmount
        additionalTaxAmount = (finalamount *parseFloat( additionalTaxRate)) / 100; // Cess based on original item total
        // discountedTotal += additionalTaxAmount; // Add additional tax to discountedTotal
        console.log('Cess Amount:', additionalTaxAmount);
        }
       
      }
  
      // Update total amount
      updatedItems[index].total_amount = discountedTotal.toFixed(2);
      console.log('Final Discounted Total with Cess:', discountedTotal.toFixed(2));
  
      // Tax amounts logic
      const newTaxAmounts = { ...state.taxAmounts };
      const oldTaxAmount = Math.floor(((itemTotalWithoutTax * oldGst) / 100) * 100) / 100;
  
      if (newTaxAmounts[oldGst]) {
        newTaxAmounts[oldGst] -= oldTaxAmount;
        if (newTaxAmounts[oldGst] < 0) newTaxAmounts[oldGst] = 0;
      }
  
      if (newTaxAmounts[validNewGst]) {
        newTaxAmounts[validNewGst] += newTaxAmount;
      } else {
        newTaxAmounts[validNewGst] = newTaxAmount;
      }
  
      // Additional 2% Cess tax
      if (additionalTaxRate > 0) {
        if (newTaxAmounts[additionalTaxRate]) {
          newTaxAmounts[additionalTaxRate] += additionalTaxAmount;
        } else {
          newTaxAmounts[additionalTaxRate] = additionalTaxAmount;
        }
      }
  
      const taxAmountsDisplay = Object.entries(newTaxAmounts)
        .filter(([, amount]) => amount > 0)
        .map(([rate, amount]) => `${rate}: ${amount.toFixed(2)}`)
        .join(', ');
  
      setState((prevState) => ({
        ...prevState,
        addedItems: updatedItems,
        taxAmounts: newTaxAmounts,
      }));
    },
    [state.addedItems, state.taxAmounts, state.add_tax] // Include state.add_tax in dependency array
  );
  
  


  const handleRemoveItem = useCallback(
    (index) => {
      const updatedItems = [...state.addedItems];
      const item = updatedItems[index];
  
      // Extract item details for tax calculations
      const gst = parseFloat(item.tax) || 0;
      const price = parseFloat(item.price) || 0;
      const itemQuantity = parseFloat(item.quantity) || 0;
      let taxAmount = 0;
  
      // Calculate the additional tax (Cess) rate if applicable
      const additionalTaxRate = parseFloat(item.add_tax?.split('@')[0]) || 0;
      let additionalTaxAmount = 0;
  
      // Tax calculation based on the item's price type
      if (item.price_tax_type === 'Excluding Tax') {
        taxAmount = (price * itemQuantity * gst) / 100;
      } else if (item.price_tax_type === 'Including Tax') {
        const totalWithTax = price * itemQuantity;
        taxAmount = (totalWithTax * gst) / (100 + gst);
      }
  
      // Calculate additional tax (Cess) amount if applicable
      const itemTotalBeforeTax = item.price_tax_type === 'Including Tax' 
        ? (price * itemQuantity) / (1 + gst / 100)
        : price * itemQuantity;
      
      if (additionalTaxRate > 0) {
        additionalTaxAmount = (itemTotalBeforeTax * additionalTaxRate) / 100;
      }
  
      // Update the GST tax amounts in state
      const newTaxAmounts = { ...state.taxAmounts };
      if (newTaxAmounts[gst]) {
        newTaxAmounts[gst] -= taxAmount;
        if (newTaxAmounts[gst] < 0) {
          newTaxAmounts[gst] = 0; // Ensure no negative tax amounts
        }
      }
  
      // Update the additional tax (Cess) in state if applicable
      if (additionalTaxRate > 0) {
        if (newTaxAmounts[additionalTaxRate]) {
          newTaxAmounts[additionalTaxRate] -= additionalTaxAmount;
          if (newTaxAmounts[additionalTaxRate] < 0) {
            newTaxAmounts[additionalTaxRate] = 0; // Ensure no negative tax amounts
          }
        }
      }
  
      // Remove the item from addedItems
      updatedItems.splice(index, 1);
  
      // Update the state with the new addedItems and updated tax amounts
      setState((prevState) => ({
        ...prevState,
        addedItems: updatedItems,
        taxAmounts: newTaxAmounts,
      }));
    },
    [state.addedItems, state.taxAmounts]
  );
  

  const grandTotal = useMemo(() => {
    // Calculate total of all items and shipping
    const itemsTotal = state.addedItems.reduce((sum, item) => sum + Number(item.total_amount), 0);
    const shipping = Number(state.shippingCost) || 0;
    const shippingGst = (shipping * 12) / 100;

    // Final grand total
    return (itemsTotal + shipping + shippingGst).toFixed(2);
  }, [state.addedItems, state.shippingCost]);

  useEffect(() => {
    // Prepare the final invoice data to send back
    
    const discountAmount = state?.addedItems
      ?.reduce((sum, item) => {
        const discountAmountSubTotal = isNaN(Number(item.discount_amount)) ? 0 : Number(item.discount_amount);
        return sum + discountAmountSubTotal;
      }, 0)
      ?.toFixed(2);
    
    const gstTotal = state?.addedItems
      ?.reduce((sum, item) => {
        const itemSubTotal = isNaN(Number(item.tax_amount)) ? 0 : Number(item.tax_amount);
        return sum + itemSubTotal;
      }, 0)
      ?.toFixed(2);
    // console.log(gstTotal);
    const invoiceData = {
      sub_total: state.addedItems.reduce((sum, item) => sum + Number(item.sub_total), 0).toFixed(2),
      discount_amount:discountAmount,
      taxable_amount: gstTotal,
      shipping_amount: Number(state.shippingCost)?.toFixed(2),
      balance_amount:grandTotal,
      total_amount: grandTotal,
      total_gst: gstTotal,
      debit_note_items: state?.addedItems?.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_id: item.unit_id,
        unit_name: item.unit_name, // Use the unitName here
        price: item.price,
        price_tax_type: item.price_tax_type,
        tax_amount: item.tax_amount,
        tax: item.tax,
        tax_type: 'GST',
        discount: item.discount,
        discount_type: item.discount_type,
        other_tax: 0.00,
        other_tax_type: "",
        sub_total: item.sub_total,
        total_amount: item.total_amount, 
      })),
    };
    // console.log("invoiceData",invoiceData)
    onChildDataChange(invoiceData);
  }, [state.addedItems, state.shippingCost, grandTotal, onChildDataChange]);

  // console.log("addedItems",state.addedItems)
 
  return (
    <div className="row my-3">
      <div className="col-md-12">
        <div className="card custom-card">
          <div className="card-body">
            <table className="table item-table">
              <ProductSelector
                itemList={state?.itemList}
                selectedProduct={state?.selectedProduct}
                handleProductChange={handleProductChange}
                singleDetail={state?.singleDetail}
                handleInputChange={handleInputChange}
                state={state}
                calculateTotal={calculateTotal}
                handleAddItem={handleAddItem}
                isPurchase={false}
                isDiscount={false}
              />
              <tbody>
                <ItemRow
                  addedItems={state?.addedItems}
                  handleAddItem={handleAddItem}
                  handleInputChange={handleInputChange}
                  grandTotal={grandTotal}
                  state={state}
                  handleItemChange={handleItemChange}
                  handleRemoveItem={handleRemoveItem}
                  isPurchase={false}
                  isDiscount={false}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDebitNoteSec;
