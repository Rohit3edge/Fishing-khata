import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import LoansService from "../../services/loans.service"


export const ListLoans = createAsyncThunk(
    "/post/listloans",
    async (item,thunkAPI) => {
        try {
            const data = await LoansService.ListLoans(item);
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


export const AddLoans = createAsyncThunk(
    "/post/addloans",
    async (item,thunkAPI) => {
        try {
            const data = await LoansService.AddLoans(item);
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

export const EditLoans = createAsyncThunk(
    "/post/editloans",
    async (item,thunkAPI) => {
        try {
            const data = await LoansService.EditLoans(item);
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

export const UpdateLoans = createAsyncThunk(
    "/post/updateloans",
    async (item,thunkAPI) => {
        try {
            const data = await LoansService.UpdateLoans(item);
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
