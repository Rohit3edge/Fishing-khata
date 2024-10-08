import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PurchaseService from "../../services/purchase.service"

export const AddPurchaseorder = createAsyncThunk(
    "/post/addpurchaseorder",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.AddPurchaseOrder(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const UpdatePurchaseOrder = createAsyncThunk(
    "/post/updatepurchaseorder",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.UpdatePurchaseOrder(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);
export const GetPurchaseOrderlist = createAsyncThunk(
    "/post/purchaseorderlist",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.GetPurchaseOrderlist(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const GetSingleDetailsPurchaseorders = createAsyncThunk(
    "/post/purchaseorderlist",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.GetSingleDetailsPurchaseorders(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const GetAdditionalTax = createAsyncThunk(
    "/post/addtax",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.GetAdditionalTax(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


 // purchasevouche

 export const CreatePurchaseVoucher = createAsyncThunk(
    "/post/createpurchasevoucher",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.CreatePurchaseVoucher(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const CreatePurchaseVoucherList = createAsyncThunk(
    "/post/createpurchasevoucherlist",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.CreatePurchaseVoucherList(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const UpdatePurchaseVoucher = createAsyncThunk(
    "/post/updatepurchasevoucher",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.UpdatePurchaseVoucher(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const GetPurchaseVoucherDetail = createAsyncThunk(
    "/post/getpurchasevoucherdetail",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.GetPurchaseVoucherDetail(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const PaymentOutGetByCustomer = createAsyncThunk(
    "/post/paymentoutgetbycustomer",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.PaymentOutgetbycustomer(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const AddPaymentout = createAsyncThunk(
    "/post/addpaymentout",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.AddPaymentout(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const PaymentOutlist = createAsyncThunk(
    "/post/addpaymentout",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.PaymentOutList(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const UpdatePaymentOut = createAsyncThunk(
    "/post/updatepaymentout",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.UpdatePaymentOut(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const GetPaymentdetail = createAsyncThunk(
    "/post/getpaymentdetail",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.GetPaymentdetail(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const DebitNotelist = createAsyncThunk(
    "/post/debitnotelist",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.DebitNotelist(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);

export const AddDebitnote = createAsyncThunk(
    "/post/adddebitnote",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.AddDebitnote(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const UpdateDebitnote = createAsyncThunk(
    "/post/updatedebitnote",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.UpdateDebitnote(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const GetSingleDebitnote = createAsyncThunk(
    "/post/getsingledebitnote",
    async (item,thunkAPI) => {
        try {
            const data = await PurchaseService.GetSingleDebitnote(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue({ message });
        }
    }
);




