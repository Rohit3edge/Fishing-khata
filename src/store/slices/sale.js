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

export const GetCreditNotelist = createAsyncThunk(
    "/post/creditnotelist",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetCreditNotelist(item);
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

export const AddCreditnote = createAsyncThunk(
    "/post/addcreditnote",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.AddCreditnote(item);
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

export const GetSingleCreditnote = createAsyncThunk(
    "/post/getsinglecreditnote",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetSingleCreditnote(item);
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

export const UpdateCreditnote = createAsyncThunk(
    "/post/updatecreditnote",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.UpdateCreditnote(item);
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


export const GetByQuotationlist = createAsyncThunk(
    "/post/getByQuotationlist",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetByQuotationlist(item);
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

export const Getquotationnextnumber = createAsyncThunk(
    "/get/getquotationnextnumber",
    async (thunkAPI) => {
        try {
            const data = await SaleService.Getquotationnextnumber();
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


export const AddQuotation = createAsyncThunk(
    "/post/addQuotation",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.AddQuotation(item);
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

export const GetQuotationSingleDetails = createAsyncThunk(
    "/post/getQuotationSingleDetails",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.GetQuotationSingleDetails(item);
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


export const QuotationUpdate = createAsyncThunk(
    "/post/quotationUpdate",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.QuotationUpdate(item);
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

export const invoicesDelete = createAsyncThunk(
    "/post/invoicesdelete",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.invoicesDelete(item);
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

export const creditNoteDelete = createAsyncThunk(
    "/post/creditnotedelete",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.creditNoteDelete(item);
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

export const quotationDelete = createAsyncThunk(
    "/post/quotationDelete",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.quotationDelete(item);
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


export const invoicePaymentDelete = createAsyncThunk(
    "/post/invoicepaymentdelete",
    async (item,thunkAPI) => {
        try {
            const data = await SaleService.invoicePaymentDelete(item);
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

