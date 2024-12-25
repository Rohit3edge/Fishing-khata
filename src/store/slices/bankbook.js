import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BankBookService from "../../services/bankbook.service"

export const AddBankBook = createAsyncThunk(
    "/post/addbankbook",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.AddBankBook(item);
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
export const Getcompanybanks = createAsyncThunk(
    "/get/companybanks",
    async (thunkAPI) => {
        try {
            const data = await BankBookService.GetCompanyBanks();
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


export const GetSingleBank = createAsyncThunk(
    "/get/getsinglebank",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.Getsinglebank(item);
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


export const LedgerEntires = createAsyncThunk(
    "/post/ledgerentires",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.Ledgerentires(item);
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


export const Depositwithdraw = createAsyncThunk(
    "/post/depositwithdraw",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.DepositWithdraw(item);
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

export const UpdateCashOpeningBalance = createAsyncThunk(
    "/post/updatecashopeningbalance",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.UpdateCashOpeningBalance(item);
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

export const AddClosingstock = createAsyncThunk(
    "/post/addclosingstock",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.AddClosingStock(item);
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

export const Closingstocklist = createAsyncThunk(
    "/post/closingstocklist",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.Closingstocklist(item);
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

export const Deleteclosingstock = createAsyncThunk(
    "/post/deleteclosingstock",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.Deleteclosingstock(item);
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

export const Updateclosingstock = createAsyncThunk(
    "/post/deleteclosingstock",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.Updateclosingstock(item);
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

export const Getclosingstock = createAsyncThunk(
    "/post/getclosingstock",
    async (item,thunkAPI) => {
        try {
            const data = await BankBookService.Getclosingstock(item);
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



const initialState = {
    loading: false,
    error: "",
    user: null,
};

const BankbookSlice = createSlice({
    name: "Bankbook",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(AddBankBook.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.user = null;
            })
            .addCase(AddBankBook.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(AddBankBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

const { reducer } = BankbookSlice;
export default reducer;
