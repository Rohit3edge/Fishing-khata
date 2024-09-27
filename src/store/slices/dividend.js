import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import DividendService from "../../services/dividend.service"


export const ListDividend = createAsyncThunk(
    "/post/listdividend",
    async (item,thunkAPI) => {
        try {
            const data = await DividendService.ListDividend(item);
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


export const AddDividend = createAsyncThunk(
    "/post/adddividend",
    async (item,thunkAPI) => {
        try {
            const data = await DividendService.AddDividend(item);
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

export const EditDividend = createAsyncThunk(
    "/post/editdividend",
    async (item,thunkAPI) => {
        try {
            const data = await DividendService.EditDividend(item);
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

export const UpdateDividend = createAsyncThunk(
    "/post/updatedividend",
    async (item,thunkAPI) => {
        try {
            const data = await DividendService.UpdateDividend(item);
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
