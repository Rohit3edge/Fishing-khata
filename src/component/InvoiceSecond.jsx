import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Getunits } from '../store/slices/settings';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';
import ProductSelector from '../common/ProductSelector';
import ItemRow from '../common/ItemRow';

const InvoiceSecond = ({ onChildDataChange, onSubmit }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [state, setState] = useState({
    units: [],
    itemList: [],
    singleDetail: {},
    selectedProduct: null,
    quantity: 1,
    discount: 0,
    discountType: 'Fixed',
    shippingCost: 0,
    addedItems: [],
    selectedUnit: '',
    tax: 0,
    taxType: 'Excluding Tax',
    subtotal: 0,
    taxAmounts: {},
  });

  const fetchUnits = useCallback(async () => {
    try {
      const data = await dispatch(Getunits()).unwrap();
      setState((prevState) => ({ ...prevState, units: data.data }));
    } catch (error) {
      alert(error.message);
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

  const handleProductChange = useCallback(async (productId) => {
    setState((prevState) => ({ ...prevState, selectedProduct: productId }));

    if (productId) {
      try {
        const data = await dispatch(Getsingledetail({ profile_id: id, item_id: productId })).unwrap();
        setState((prevState) => ({
          ...prevState,
          singleDetail: data?.data,
          selectedUnit: data?.data?.unit || '',
          tax: data?.data?.tax || 0,
          taxType: data?.data?.sale_price_tax_type || 'Excluding Tax',
        }));
      } catch (error) {
        console.error(error.message);
      }
    }
  }, [dispatch, id]);

  const handleInputChange = (field, value) => {
    setState((prevState) => ({ ...prevState, [field]: value }));
  };

  const calculateTotal = useMemo(() => {
    const { singleDetail, quantity, discount, discountType, tax, taxType } = state;
    let price = Number(singleDetail?.sale_price) || 0;
    let quantityTotal = price * quantity || 0;
    let taxAmount = 0;
    let totalBeforeTax = quantityTotal;

    // Calculate tax based on whether it is included or excluded
    if (taxType === 'Including Tax') {
      taxAmount = (quantityTotal * tax) / (100 + tax);
      totalBeforeTax = quantityTotal - taxAmount;
    } else if (taxType === 'Excluding Tax') {
      taxAmount = (quantityTotal * tax) / 100;
    }

    // Apply discount (fixed or percentage)
    let discountAmount = 0;
    if (discountType === 'Fixed') {
      discountAmount = Number(discount);
    } else if (discountType === 'Percentage') {
      discountAmount = (totalBeforeTax * Number(discount)) / 100;
    }
    
    const discountedTotal = totalBeforeTax - discountAmount;

    // Final total after applying discount and tax
    return {
      finalTotal: discountedTotal + taxAmount,
      discountedTotal,
      taxAmount,
      subtotal: totalBeforeTax,
    };
  }, [state]);

  const handleAddItem = () => {
    console.log("hii")
    const newItem = {
      ...state.singleDetail,
      quantity: state.quantity,
      unit_id: state.selectedUnit,
      tax: state.tax,
      discount: state.discount,
      discount_type: state.discountType,
      sub_total: calculateTotal.subtotal.toFixed(2),
      total_amount: calculateTotal.finalTotal.toFixed(2),
    };
    setState((prevState) => ({
      ...prevState,
      addedItems: [...prevState.addedItems, newItem],
    }));
  };

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
    const invoiceData = {
      sub_total: state.addedItems.reduce((sum, item) => sum + Number(item.sub_total), 0).toFixed(2),
      shipping_cost: state.shippingCost.toFixed(2),
      grand_total: grandTotal,
      invoice_items: state.addedItems.map((item) => ({
        item_id: Number(item.item_id),
        quantity: Number(item.quantity),
        price: item.price,
        total_amount: item.total_amount,
      })),
    };
    onChildDataChange(invoiceData);
  }, [state.addedItems, state.shippingCost, grandTotal, onChildDataChange]);

  console.log("state",state)

  return (
    <div className="row my-3">
      <div className="col-md-12">
        <div className="card custom-card">
          <div className="card-body">
            <ProductSelector
              itemList={state?.itemList}
              selectedProduct={state?.selectedProduct}
              handleProductChange={handleProductChange}
              singleDetail={state?.singleDetail}
              handleInputChange={handleInputChange}
              state={state}
              calculateTotal={calculateTotal}
            />
            <ItemRow
              addedItems={state?.addedItems}
              handleAddItem={handleAddItem}
              handleInputChange={handleInputChange}
              grandTotal={grandTotal}
            />
            <button type="button" className="btn btn-default" onClick={onSubmit}>
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSecond;
