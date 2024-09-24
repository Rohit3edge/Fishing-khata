import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Getunits } from '../store/slices/settings';
import { Listitems } from '../store/slices/items';
import { Getsingledetail } from '../store/slices/sale';


const AddPurchaseOrderSec = ({ onChildDataChange, onSubmit }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

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
            singleDetail: data?.data,
            unit_id: data?.data?.unit || '',
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
        }));
      }
    },
    [dispatch, id]
  );

  const handleInputChange = (field, value) => {
      // For other fields, update state normally
      setState((prevState) => ({ ...prevState, [field]: value }));

  };




//   const handleAddItem = () => {
//     const { unit_id, singleDetail, price_tax_type, tax, discount, discount_type } = state;

//     // Find the unit name based on the unit_id
//     const unitName = state.units.find((unit) => unit.id === unit_id)?.unit || '';

    // Calculate the total for the current item
    // const newItem = {
    //   hsn: singleDetail.hsn,
    //   item_id: state.selectedProduct,
    //   quantity: state.quantity,
    //   unit_id: unit_id,
    //   unit_name: unitName, // Use the unitName here
    //   price: singleDetail?.sale_price,
    //   total_amount: calculateTotal.finalTotal.toFixed(2),
    // };

//     setState((prevState) => ({
//       ...prevState,
//       addedItems: [...prevState.addedItems, newItem],
//     }));

//     clearInputs(); 
//   };

  const clearInputs = () => {
    setState((prevState) => ({
      ...prevState,
      selectedProduct: null,
      quantity: 1,
      selectedUnit: '',
      singleDetail: {},
      unit_id: '',
    }));
  };
  const handleItemChange = useCallback(
    (field, value, index) => {
      // Create a copy of the items
      const updatedItems = [...state.addedItems];

      // Update the item at the specific index
      updatedItems[index] = { ...updatedItems[index], [field]: value };

      // Get the item price and quantity
      const itemPrice = parseFloat(updatedItems[index].price) || 0;
      const itemQuantity = parseFloat(updatedItems[index].quantity) || 0;
      let itemTotalWithoutTax = itemPrice * itemQuantity;

      setState((prevState) => ({
        ...prevState,
        addedItems: updatedItems,
      }));


    },
    [state.addedItems]
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


      // Update the state with the new addedItems and tax amounts
      setState((prevState) => ({
        ...prevState,
        addedItems: updatedItems,
      }));
    },
    [state.addedItems]
  );

//   const grandTotal = useMemo(() => {
//     // Calculate total of all items and shipping
//     const itemsTotal = state.addedItems.reduce((sum, item) => sum + Number(item.total_amount), 0);
//     // Final grand total
//     return (itemsTotal + shipping ).toFixed(2);
//   }, [state.addedItems, state.shippingCost]);

//   useEffect(() => {
//     // Prepare the final invoice data to send back
//     const gstTotal = state?.addedItems
//       ?.reduce((sum, item) => {
//         const itemSubTotal = isNaN(Number(item.tax_amount)) ? 0 : Number(item.tax_amount);
//         return sum + itemSubTotal;
//       }, 0)
//       ?.toFixed(2);
//     console.log(gstTotal);
//     const invoiceData = {
//       sub_total: state.addedItems.reduce((sum, item) => sum + Number(item.sub_total), 0).toFixed(2),
//       shipping_cost: Number(state.shippingCost)?.toFixed(2),
//       grand_total: grandTotal,
//       total_gst: gstTotal,
//       invoice_items: state?.addedItems?.map((item) => ({
//         item_id: item.item_id,
//         quantity: item.quantity,
//         unit_id: item.unit_id,
//         unit_name: item.unit_name, // Use the unitName here
//         price: item.price,
//         price_tax_type: item.price_tax_type,
//         tax_amount: item.tax_amount,
//         tax: item.tax,
//         tax_type: 'GST',
//         discount: item.discount,
//         discount_type: item.discount_type,
//         sub_total: item.sub_total,
//         total_amount: item.total_amount,
//       })),
//     };
//     onChildDataChange(invoiceData);
//   }, [state.addedItems, state.shippingCost, grandTotal, onChildDataChange]);
 
  return (
    <div class="row my-3">
    <div class="col-md-12">
        <div class="card custom-card">
            <div class="card-body">

                <div class="row">
                    <div class="col-md-12">
                        <table class="table item-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>HSN/SAC</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total Amount</th>
                                    <th>&nbsp;</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td class="align-middle">
                                        <select class="form-control" name="item[]">
                                            <option value="">--Select Product--</option>
                                            {state.itemList?.map((option, index) => (
              <option key={index} value={option?.id}>
                {option?.name}
              </option>
            ))}
                                        </select>
                                    </td>
                                    <td class="align-middle">8320836</td>
                                    <td class="align-middle">
                                        <div class="input-group">
                                            <input class="form-control" type="text"   style={{width:"40px",padding:" 0.4rem"}}/>
                                            <select class="form-control" name="unit[]">
                                                <option value="">--Select Unit--</option>
                                                {state?.units?.map((unit, index) => (
                                               <option key={index} value={unit?.id}>
                                                  {unit?.unit}
                                                   </option>
                                                     ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <input type="text" class="form-control" name="price"  style={{width:"40px",padding:" 0.4rem"}}/>
                                    </td>
                                    <td class="align-middle">₹4,739.00</td>
                                    <td class="align-middle">
                                        <button class="btn-sm btn-success">Add</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="align-middle">
                                        <select class="form-control" name="item[]">
                                            <option value="">--Select Product--</option>
                                            <option value="product1">Aquarium Starter Kit</option>
                                            <option value="product2">Premium Fish Food</option>
                                            <option value="product3">Aquarium Heater</option>
                                            <option value="product4">Water Filtration System</option>
                                            <option value="product5">Decorative Aquarium Plants</option>
                                            <option value="product6">Aquarium LED Lighting</option>
                                            <option value="product7">Fish Tank Cleaning Tools</option>
                                        </select>
                                    </td>
                                    <td class="align-middle">8320836</td>
                                    <td class="align-middle">
                                        <div class="input-group">
                                            <input class="form-control" type="text"  style={{width:"40px",padding:" 0.4rem"}}/>
                                            <select class="form-control" name="unit[]">
                                                <option value="">--Select Unit--</option>
                                                <option value="pieces">Pieces</option>
                                                <option value="kg">Kilograms (kg)</option>
                                                <option value="g">Grams (g)</option>
                                                <option value="liters">Liters (L)</option>
                                                <option value="ml">Milliliters (mL)</option>
                                                <option value="pack">Pack</option>
                                                <option value="box">Box</option>
                                                <option value="set">Set</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <input type="text" class="form-control" name="price"  style={{width:"40px",padding:" 0.4rem"}}/>
                                    </td>
                                    <td class="align-middle">₹4,739.00</td>
                                    <td class="align-middle">
                                        <button class="btn-sm btn-danger">Remove</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="4" class="text-right align-middle"><strong>Shipping Cost:</strong></td>
                                    <td colspan="2" class="align-middle"><input type="text" class="form-control" name="shipping_cost"/></td>
                                </tr>

                                <tr>
                                    <td colspan="4" class="text-right align-middle"><strong>Grand Total:</strong></td>
                                    <td colspan="2" class="align-middle">₹75,836.00</td>
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

export default AddPurchaseOrderSec;
