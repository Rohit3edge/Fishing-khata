import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LedgerService from "../../services/ledger.service";

export const Getledgergroups = createAsyncThunk(
    "/get/Getledgergroups",
    async (thunkAPI) => {
        try {
            const data = await LedgerService.Getledgergroups();
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


export const Ledgerlist = createAsyncThunk(
    "/get/ledgerlist",
    async (thunkAPI) => {
        try {
            const data = await LedgerService.Ledgerlist();
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



export const LedgerAdd = createAsyncThunk(
    "/post/ledgeradd",
    async (item,thunkAPI) => {
        try {
            const data = await LedgerService.LedgerAdd(item);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue( error.response.data.messages.error);
        }
    }
);

export const GetState = createAsyncThunk(
    "/post/getstate",
    async (thunkAPI) => {
        try {
            const data = await LedgerService.GetState();
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


export const Getledgerdetail = createAsyncThunk(
    "/post/getledgerdetail",
    async (item,thunkAPI) => {
        try {
            const data = await LedgerService.Getledgerdetail(item);
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

export const UpdateLedger = createAsyncThunk(
    "/post/updateledger",
    async (item,thunkAPI) => {
        try {
            const data = await LedgerService.UpdateLedger(item);
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

export const UpdateOpeningBalance = createAsyncThunk(
    "/post/UpdateOpeningBalance",
    async (item,thunkAPI) => {
        try {
            const data = await LedgerService.UpdateOpeningBalance(item);
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

const LedgerSlice = createSlice({
    name: "Getledgergroups",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(Getledgergroups.pending, (state) => {
                state.loading = true;
                state.error = "";
                state.user = null;
            })
            .addCase(Getledgergroups.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(Getledgergroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

const { reducer } = LedgerSlice;
export default reducer;
