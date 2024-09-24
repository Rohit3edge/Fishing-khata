import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SaleService from "../../services/sale.service"

export const Getsingledetail = createAsyncThunk(
    "/post/getsingledetail",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.Getsingledetail(item);
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


export const GetInvoiceslistpayments = createAsyncThunk(
    "/post/getinvoices",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetInvoiceslistpayments(item);
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
export const Getinvoicesnextnumber = createAsyncThunk(
    "/get/getinvoicesnextnumber",
    async (thunkAPI) => {
        try {
            const data = await SaleService.Getinvoicesnextnumber();
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

export const GetPaymentMethods = createAsyncThunk(
    "/post/getPaymentMethods",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetPaymentMethods(item);
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
export const GetByCustomer = createAsyncThunk(
    "/post/getByCustomer",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetByCustomer(item);
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

export const GetByInvoiceslist = createAsyncThunk(
    "/post/getByInvoiceslist",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetByInvoiceslist(item);
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


export const AddInvoicesPayment = createAsyncThunk(
    "/post/Addinvoicespayment",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.Addinvoicespayment(item);
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

export const AddInvoices = createAsyncThunk(
    "/post/Addinvoicespayment",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.Addinvoices(item);
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

export const GetInvoicesSingleDetails = createAsyncThunk(
    "/post/getinvoicessingledetails",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetInvoicesSingleDetails(item);
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

export const InvoiceUpdate = createAsyncThunk(
    "/post/invoiceUpdate",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.InvoiceUpdate(item);
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


export const GetSinglePaymentDetail = createAsyncThunk(
    "/post/getsinglepaymentdetail",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetSinglePaymentDetail(item);
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

export const UpdatePayment = createAsyncThunk(
    "/post/updatepayment",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.UpdatePayment(item);
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