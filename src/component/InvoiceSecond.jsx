import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {toast } from 'react-hot-toast';
import { Getunits } from '../store/slices/settings';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';
import ProductSelector from '../common/ProductSelector';
import ItemRow from '../common/ItemRow';
import AddItemPopUp from '../common/AddItemPopUp';

const InvoiceSecond = ({ onChildDataChange, onSubmit }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    shippingCost: 0,
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
      setState((prevState) => ({ ...prevState, units: data?.data }));
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

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

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
            price:Number(data?.data?.sale_price)?.toFixed(2),
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
    const { quantity, discount, discount_type, tax, price_tax_type } = state;
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

    // console.log("taxAmount", taxAmount);
    // console.log("totalBeforeTax", totalBeforeTax);

    // Apply discount (fixed or percentage)
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
    const { selectedProduct,quantity, price,unit_id, singleDetail, price_tax_type, tax, discount, discount_type } = state;
    
    if (!selectedProduct || quantity <= 0 || Number(price) <= 0) {
      toast.error('Please fill out all fields correctly.');
      return;
    }
    // Find the unit name based on the unit_id
    const unitName = state?.units?.find((unit) => unit.id === unit_id)?.unit || '';

    // Calculate the total for the current item
    const newItem = {
      hsn: singleDetail.hsn,
      item_id: state.selectedProduct,
      quantity: state.quantity,
      unit_id: unit_id,
      unit_name: unitName, // Use the unitName here
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

    // Calculate the tax amount for this item
    const recalculatedTax = calculateTotal.taxAmount;

    // Copy the existing taxAmounts state
    const newTaxAmounts = { ...state.taxAmounts };

    // Update the taxAmounts state for the specific GST rate (assuming GST is stored as the tax value)
    const currentTaxRate = parseFloat(tax);
    if (currentTaxRate) {
      if (newTaxAmounts[currentTaxRate]) {
        newTaxAmounts[currentTaxRate] += recalculatedTax; // Add to existing tax amount for that rate
      } else {
        newTaxAmounts[currentTaxRate] = recalculatedTax; // Initialize new tax amount for that rate
      }
    }

    // Update the state with the new item and updated tax amounts
    setState((prevState) => ({
      ...prevState,
      addedItems: [...prevState.addedItems, newItem],
      taxAmounts: newTaxAmounts,
    }));

    clearInputs(); // Clear the form inputs for the next item
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

      // console.log('field', field, value, index);
      // Create a copy of the items
      const updatedItems = [...state.addedItems];

      // Update the item at the specific index
      updatedItems[index] = { ...updatedItems[index], [field]: value };

      // Get the item price and quantity
      const itemPrice = parseFloat(updatedItems[index].price) || 0;
      const itemQuantity = parseFloat(updatedItems[index].quantity) || 0;
      let itemTotalWithoutTax = itemPrice * itemQuantity;
      // console.log('Before Change1:', itemPrice, itemQuantity, itemTotalWithoutTax);
      // Get current tax and discount values
      const oldGst = parseFloat(state.addedItems[index]?.tax) || 0;
      const newGst = parseFloat(field === 'tax' ? value : updatedItems[index].tax) || 0;
      const discountValue = parseFloat(updatedItems[index]?.discount) || 0;
      const discountType = updatedItems[index]?.discount_type;
      // console.log('Before Change2:', oldGst, newGst, discountValue, discountType);
      // console.log('price_tax_type', updatedItems[index]?.price_tax_type);

      let newTaxAmount = 0;
      let discountAmount = 0;
      let discountedTotal = itemTotalWithoutTax;

      // Check if newGst is valid to avoid NaN errors
      const validNewGst = newGst > 0 ? newGst : 0;

      // Discount Calculation
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

      // Tax Calculation
      if (updatedItems[index]?.price_tax_type === 'Including Tax' && validNewGst > 0) {
        newTaxAmount = (discountedTotal * validNewGst) / (100 + validNewGst);
        discountedTotal += newTaxAmount; // Discounted total before tax
        // console.log("discountedTotal111",discountedTotal,newTaxAmount,)
      } else if (updatedItems[index]?.price_tax_type === 'Excluding Tax') {
        newTaxAmount = (discountedTotal * validNewGst) / 100;
        discountedTotal += newTaxAmount; // Add tax to total
      }

      // console.log("discountedTotal",discountedTotal)
      // Update item with new total amount
      updatedItems[index].total_amount = discountedTotal.toFixed(2);



 // Calculate `oldDiscountedTotal` for old tax removal
let oldDiscountAmount = 0;
let oldDiscountedTotal = itemTotalWithoutTax;

if (discountType === 'Percentage' && discountValue) {
  if (state.addedItems[index]?.price_tax_type === 'Including Tax') {
    const basePrice = oldDiscountedTotal / (1 + oldGst / 100);
    oldDiscountedTotal = basePrice;
  }
  oldDiscountAmount = (oldDiscountedTotal * discountValue) / 100;
  oldDiscountedTotal -= oldDiscountAmount;
} else if (discountType === 'Fixed' && discountValue) {
  if (state.addedItems[index]?.price_tax_type === 'Including Tax') {
    const basePrice = oldDiscountedTotal / (1 + oldGst / 100);
    oldDiscountedTotal = basePrice;
  }
  oldDiscountedTotal -= discountValue;
}

let oldTaxAmount = 0;
if (state.addedItems[index]?.price_tax_type === 'Including Tax' && oldGst > 0) {
  const basePriceWithTax = oldDiscountedTotal / (1 + oldGst / 100);
  oldTaxAmount = oldDiscountedTotal - basePriceWithTax;
} else if (state.addedItems[index]?.price_tax_type === 'Excluding Tax') {
  oldTaxAmount = (oldDiscountedTotal * oldGst) / 100;
}

// Format oldTaxAmount to two decimal places
oldTaxAmount = parseFloat(oldTaxAmount.toFixed(2));

const newTaxAmounts = { ...state.taxAmounts };
if (newTaxAmounts[oldGst]) {
  newTaxAmounts[oldGst] -= oldTaxAmount;
  if (newTaxAmounts[oldGst] <= 0) delete newTaxAmounts[oldGst];
}

// Format newTaxAmount to two decimal places
newTaxAmount = parseFloat(newTaxAmount.toFixed(2));

if (newTaxAmounts[validNewGst]) {
  newTaxAmounts[validNewGst] += newTaxAmount;
} else {
  newTaxAmounts[validNewGst] = newTaxAmount;
}

// Remove any tax amounts that are zero to avoid rendering them
Object.keys(newTaxAmounts).forEach((key) => {
  if (newTaxAmounts[key] === 0) {
    delete newTaxAmounts[key];
  } else {
    // Format each tax amount to two decimal places
    newTaxAmounts[key] = parseFloat(newTaxAmounts[key].toFixed(2));
  }
});

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
      sub_total: state?.addedItems?.reduce((sum, item) => sum + Number(item.sub_total), 0).toFixed(2),
      shipping_cost: Number(state?.shippingCost)?.toFixed(2),
      discount_amount:discountAmount,
      grand_total: grandTotal,
      balance_amount:grandTotal,
      total_gst: gstTotal,
      invoice_items: state?.addedItems?.map((item) => ({
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
    onChildDataChange(invoiceData);
  }, [state.addedItems, state.shippingCost, grandTotal, onChildDataChange]);

  return (
    <>
          {isModalOpen && <AddItemPopUp show={isModalOpen} onClose={handleCloseModal}  onCategoryAdded={fetchItemList} />}
    <div className="row my-3">
      <div className="col-md-12">
        <div className="card custom-card">
          <div className="card-body">
          <div className="d-flex justify-content-end mb-2">
                  <button className="btn ripple btn-default" onClick={handleOpenModal} >
                    Add Item
                  </button>
                </div>
            <table className="table item-table">

              <ProductSelector
                handleProductChange={handleProductChange}
                singleDetail={state?.singleDetail}
                handleInputChange={handleInputChange}
                state={state}
                calculateTotal={calculateTotal}
                handleAddItem={handleAddItem}
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
                  isDiscount={true}
                />
              </tbody>
              <tr>
                <td colspan="10" className="text-right align-middle">
                  <button type="button" className="btn btn-default" onClick={onSubmit}>
                    Generate Invoice
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default InvoiceSecond;
