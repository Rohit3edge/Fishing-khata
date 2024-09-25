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
