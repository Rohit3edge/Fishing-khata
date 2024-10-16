import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {toast } from 'react-hot-toast';
import { Getunits } from '../store/slices/settings';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';
import ProductSelector from '../common/ProductSelector';
import ItemRow from '../common/ItemRow';

const UpdateInvoiceSecond = ({ onChildDataChange, onSubmit,data }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  //  console.log("data",data)
  const [state, setState] = useState({
    units: [],
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

  useEffect(() => {
    fetchUnits();
    fetchItemList();
  }, [fetchUnits, fetchItemList]);


  useEffect(() => {
    // Initialize addedItems from the passed data
    if (data?.items) {
      const initializedItems = data.items.map((item) => ({
        id:item.id,
        hsn: item.hsn,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_id: item.unit_id,
        unit_name: item.unit_name, 
        price: item.price,
        price_tax_type: item.price_tax_type,
        tax: item.tax,
        tax_type: item.tax_type,
        discount: item.discount,
        discount_type: item.discount_type,
        tax_amount: item.tax_amount,
        sub_total: item.sub_total,
        total_amount: item.total_amount,
      }));
  
      // Calculate initial taxAmounts based on data?.items
      const initialTaxAmounts = initializedItems.reduce((acc, item) => {
        const taxRate = parseFloat(item.tax) || 0;
        const taxAmount = parseFloat(item.tax_amount) || 0;
  
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
      const shippingCost = parseFloat(state?.shippingCost) || 0;
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
        shippingCost: Number(data?.invoice?.shipping_cost) || 0,

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
            price: Number(data?.data?.sale_price)?.toFixed(2),
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
    //  console.log("1",shippingCost,shippingGst)
      // Retrieve the existing shipping GST from the state or set it to 0 if not present
      const existingShippingGst = state.shippingGst || 0;
      // console.log("2",existingShippingGst)
      // Copy the existing taxAmounts state
      const updatedTaxAmounts = { ...state.taxAmounts };
      console.log("3",updatedTaxAmounts)
      // Calculate the difference between the new shipping GST and the existing one
      const difference = shippingGst - existingShippingGst;
      // console.log("3",updatedTaxAmounts)
      // Adjust the tax amount for 12% GST based on the shipping GST difference
      if (updatedTaxAmounts[shippingTaxRate]) {
        updatedTaxAmounts[shippingTaxRate] += difference;
      } else {
        updatedTaxAmounts[shippingTaxRate] = shippingGst; // Initialize shipping GST for the 12% rate if not present
      }
      // console.log("4",updatedTaxAmounts,shippingGst,difference)
  
      // Remove the tax rate if the amount becomes zero
      if (updatedTaxAmounts[shippingTaxRate] <= 0) {
        delete updatedTaxAmounts[shippingTaxRate];
      }
      console.log("5",updatedTaxAmounts)
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
    const {quantity, discount, discount_type, tax, price_tax_type } = state;
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

    // console.log("discountAmount", discountAmount);
    const discountedTotal = +(totalBeforeTax - discountAmount).toFixed(2); // Rounding the discounted total
    // console.log("discountedTotal", discountedTotal);

    // Final total after applying discount and tax
    const finalTotal = +(discountedTotal + taxAmount).toFixed(2); // Rounding the final total
    // console.log("finalTotal", finalTotal);

    return {
      finalTotal,
      discountedTotal,
      taxAmount,
      subtotal: discountedTotal,
      discountAmount:discountAmount
    };
  }, [state]);

  const handleAddItem = () => {
    const {selectedProduct, unit_id, singleDetail, price_tax_type, tax, discount, discount_type,price,quantity } = state;

    if (!selectedProduct || quantity <= 0 || Number(price) <= 0) {
      toast.error('Please fill out all fields correctly.');
      return;
    }
    const unitName = state.units.find((unit) => unit.id === unit_id)?.unit || '';

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
      tax_amount: calculateTotal.taxAmount.toFixed(2),
      discount: discount,
      discount_type: discount_type,
      sub_total: calculateTotal.subtotal.toFixed(2),
      total_amount: calculateTotal.finalTotal.toFixed(2),
    };

    const recalculatedTax = calculateTotal.taxAmount;

    const newTaxAmounts = { ...state.taxAmounts };

    const currentTaxRate = parseFloat(tax);
    if (currentTaxRate) {
      if (newTaxAmounts[currentTaxRate]) {
        newTaxAmounts[currentTaxRate] += recalculatedTax;
      } else {
        newTaxAmounts[currentTaxRate] = recalculatedTax;
      }
    }

    setState((prevState) => ({
      ...prevState,
      addedItems: [...prevState.addedItems, newItem],
      taxAmounts: newTaxAmounts,
    }));

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
      const discountValue = parseFloat(updatedItems[index]?.discount) || 0;
      const discountType = updatedItems[index]?.discount_type;

      let newTaxAmount = 0;
      let discountAmount = 0;
      let discountedTotal = itemTotalWithoutTax;

      const validNewGst = newGst > 0 ? newGst : 0;

      if (discountType === 'Percentage' && discountValue) {
        if (updatedItems[index]?.price_tax_type === 'Including Tax') {
          const basePrice = discountedTotal / (1 + validNewGst / 100);
          newTaxAmount = discountedTotal - basePrice;
          discountedTotal = basePrice;
        }
        discountAmount = (discountedTotal * discountValue) / 100;
        discountedTotal -= discountAmount;
      } else if (discountType === 'Fixed' && discountValue) {
        if (updatedItems[index]?.price_tax_type === 'Including Tax') {
          const basePrice = discountedTotal / (1 + validNewGst / 100);
          newTaxAmount = discountedTotal - basePrice;
          discountedTotal = basePrice;
        }
        discountedTotal -= discountValue;
      }

      if (updatedItems[index]?.price_tax_type === 'Including Tax' && validNewGst > 0) {
        newTaxAmount = (discountedTotal * validNewGst) / (100 + validNewGst);
        discountedTotal -= newTaxAmount;
      } else if (updatedItems[index]?.price_tax_type === 'Excluding Tax') {
        newTaxAmount = (discountedTotal * validNewGst) / 100;
        discountedTotal += newTaxAmount;
      }

      updatedItems[index].total_amount = discountedTotal.toFixed(2);

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
    [state.addedItems, state.taxAmounts]
  );


  const handleRemoveItem = useCallback(
    (index) => {
      const updatedItems = [...state.addedItems];
      const item = updatedItems[index];

      // Recalculate the tax for the item being removed
      const gst = parseFloat(item.tax) || 0;
      const price = parseFloat(item.price) || 0;
      const itemQuantity = parseFloat(item.quantity) || 0;
      let taxAmount = 0;

      // Tax calculation based on the item's price type
      if (item.price_tax_type === 'Excluding Tax') {
        taxAmount = (price * itemQuantity * gst) / 100;
      } else if (item.price_tax_type === 'Including Tax') {
        const totalWithTax = price * itemQuantity;
        taxAmount = (totalWithTax * gst) / (100 + gst);
      }

      // Update tax amounts
      const newTaxAmounts = { ...state.taxAmounts };
      if (newTaxAmounts[gst]) {
        newTaxAmounts[gst] -= taxAmount;
        if (newTaxAmounts[gst] < 0) {
          newTaxAmounts[gst] = 0; // Ensure no negative tax amounts
        }
      }

      // Remove the item from addedItems
      updatedItems.splice(index, 1);

      // Update the state with the new addedItems and tax amounts
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
    const invoiceData = {
      sub_total: state.addedItems.reduce((sum, item) => sum + Number(item.sub_total), 0).toFixed(2),
      shipping_cost: Number(state.shippingCost)?.toFixed(2),
      discount_amount:discountAmount,
      grand_total: grandTotal,
      balance_amount:grandTotal,
      total_gst: gstTotal,
      tcs_amount: 0.00,
      invoice_items: state?.addedItems?.map((item) => ({
        id:item.id,
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
                isDiscount={true}
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
                  isDiscount={true}
                />
              </tbody>
              <tr>
                <td colspan="10" className="text-right align-middle">
                  <button type="button" className="btn btn-default" onClick={onSubmit}>
                  Update Invoice
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoiceSecond;
