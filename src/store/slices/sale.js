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