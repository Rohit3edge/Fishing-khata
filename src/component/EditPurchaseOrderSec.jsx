import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Getunits } from '../store/slices/settings';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';

const EditPurchaseOrderSec = ({ onChildDataChange, data }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [state, setState] = useState({
    units: [],
    itemList: [],
    singleDetail: {},
    selectedProduct: '',
    quantity: 1,
    unit_id: '',
    price: 0,
    shippingCost: 0,
    addedItems: [],
    hsn: '',
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

  useEffect(() => {
    if (data?.purchase_order_items) {
      const initializedItems = data?.purchase_order_items?.map((item) => ({
        id: item?.id,
        item_id: item?.item_id,
        po_id: item?.po_id,
        quantity: item?.quantity,
        unit_id: item?.unit_id,
        unit_name: item?.unit_name,
        price: item?.price,
        sub_total: item?.sub_total,
      }));
      setState((prevState) => ({
        ...prevState,
        addedItems: initializedItems,
        shippingCost: Number(data?.purchase_order?.shipping_cost) || 0,
      }));
    }
  }, [data]);

  const handleProductChange = useCallback(
    async (e) => {
      const productId = e.target.value;
      setState((prevState) => ({
        ...prevState,
        selectedProduct: productId,
      }));

      if (productId) {
        try {
          const data = await dispatch(Getsingledetail({ profile_id: id, item_id: productId })).unwrap();
          setState((prevState) => ({
            ...prevState,
            singleDetail: data?.data,
            price: data?.data?.sale_price || 0,
            hsn: data?.data?.hsn || '',
            unit_id: data?.data?.unit || '',
          }));
        } catch (error) {
          console.error(error.message);
        }
      }
    },
    [dispatch, id]
  );

  const handleInputChange = (field, value) => {
    setState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleAddItem = () => {
    const { selectedProduct, quantity, unit_id, price, hsn } = state;

    if (!selectedProduct || quantity <= 0 || !unit_id || price <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    // Find the unit name based on the unit_id
    const unitName = state.units.find((unit) => unit.id === unit_id)?.unit || '';

    const newItem = {
      item_id: selectedProduct,
      quantity: parseFloat(quantity),
      unit_id,
      unit_name: unitName,
      price: parseFloat(price),
      hsn,
      sub_total: (price * quantity).toFixed(2),
    };

    setState((prevState) => ({
      ...prevState,
      addedItems: [...prevState.addedItems, newItem],
      selectedProduct: '', // Reset fields
      quantity: 1,
      unit_id: '',
      price: 0,
      hsn: '',
      // Ensure itemList remains intact
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...state.addedItems];
    updatedItems[index][field] = value;

    // If the item_id (product) is changed, update the price, unit, and hsn accordingly
    if (field === 'item_id') {
      const selectedProduct = state.itemList.find((item) => item.id === value);
      updatedItems[index].price = selectedProduct?.sale_price || 0;
      updatedItems[index].hsn = selectedProduct?.hsn || '';
      updatedItems[index].unit_id = selectedProduct?.unit || '';
    }

    // Update total amount for the item
    if (field === 'price' || field === 'quantity') {
      updatedItems[index].sub_total = (updatedItems[index].price * updatedItems[index].quantity).toFixed(2);
    }

    setState((prevState) => ({
      ...prevState,
      addedItems: updatedItems,
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...state.addedItems];
    updatedItems.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      addedItems: updatedItems,
    }));
  };

  useEffect(() => {
    const subTotal = state.addedItems.reduce((sum, item) => sum + parseFloat(item.sub_total), 0);
    const shippingCost = parseFloat(state.shippingCost) || 0;
    const grandTotal = (subTotal + shippingCost).toFixed(2);

    const orderData = {
      sub_total: subTotal.toFixed(2),
      shipping_cost: shippingCost,
      grand_total: grandTotal,
      purchase_order_items: state.addedItems?.map((item) => ({
        id: item?.id,
        item_id: item?.item_id,
        po_id: item?.po_id,
        quantity: item?.quantity,
        unit_id: item?.unit_id,
        unit_name: item?.unit_name,
        price: item?.price,
        sub_total: item?.sub_total,
      })),
    };

    // Pass the formatted data to the parent component
    onChildDataChange(orderData);
  }, [state.addedItems, state.shippingCost, onChildDataChange]);

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
                      <th>Price</th>
                      <th>Total Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="align-middle">
                        <select className="form-control" onChange={handleProductChange} value={state?.selectedProduct}>
                          <option value="">--Select Product--</option>
                          {state?.itemList?.map((option, index) => (
                            <option key={index} value={option?.id}>
                              {option?.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="align-middle">{state?.hsn}</td>
                      <td className="align-middle">
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="number"
                            value={state?.quantity}
                            onChange={(e) => handleInputChange('quantity', e.target.value)}
                            style={{ width: '40px', padding: '0.4rem' }}
                          />
                          <select className="form-control" value={state?.unit_id} onChange={(e) => handleInputChange('unit_id', e.target.value)}>
                            <option value="">--Select Unit--</option>
                            {state?.units?.map((unit, index) => (
                              <option key={index} value={unit?.id}>
                                {unit?.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="align-middle">
                        <input type="number" className="form-control" value={state?.price} onChange={(e) => handleInputChange('price', e.target.value)} style={{ width: '80px', padding: '0.4rem' }} />
                      </td>
                      <td className="align-middle">₹{(state?.price * state?.quantity)?.toFixed(2)}</td>
                      <td className="align-middle">
                        <button className="btn-sm btn-success" onClick={handleAddItem}>
                          Add
                        </button>
                      </td>
                    </tr>

                    {/* Render the added items dynamically */}
                    {state.addedItems?.map((item, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <select className="form-control" value={item?.item_id} onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}>
                            <option value="">--Select Product--</option>
                            {state?.itemList?.map((option, idx) => (
                              <option key={idx} value={option?.id}>
                                {option?.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="align-middle">{item?.hsn}</td>
                        <td className="align-middle">
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="number"
                              value={item?.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              style={{ width: '40px', padding: '0.4rem' }}
                            />
                            <select className="form-control" value={item?.unit_id} onChange={(e) => handleItemChange(index, 'unit_id', e.target.value)}>
                              <option value="">--Select Unit--</option>
                              {state?.units?.map((unit, idx) => (
                                <option key={idx} value={unit?.id}>
                                  {unit?.unit}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="align-middle">
                          <input
                            type="number"
                            className="form-control"
                            value={item?.price}
                            onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            style={{ width: '80px', padding: '0.4rem' }}
                          />
                        </td>
                        <td className="align-middle">₹{item?.sub_total}</td>
                        <td className="align-middle">
                          <button className="btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan="4" className="text-right align-middle">
                        <strong>Shipping Cost:</strong>
                      </td>
                      <td colSpan="2" className="align-middle">
                        <input type="number" className="form-control" value={state?.shippingCost} onChange={(e) => handleInputChange('shippingCost', e.target.value)} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-right align-middle">
                        <strong>Grand Total:</strong>
                      </td>
                      <td colSpan="2" className="align-middle">
                        ₹{(state?.addedItems.reduce((sum, item) => sum + parseFloat(item?.sub_total), 0) + parseFloat(state?.shippingCost || 0))?.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                  <tr>
                    {/* <td colspan="10" className="text-right align-middle">
                  <button type="button" className="btn btn-default" onClick={handleSubmit}>
                  Save
                  </button>
                </td> */}
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPurchaseOrderSec;
