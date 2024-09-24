import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ShareTransferService from "../../services/share-transfer.service"


export const ListShareTransfer = createAsyncThunk(
    "/post/listsharetransfer",
    async (item,thunkAPI) => {
        try {
            const data = await ShareTransferService.ListShareTransfer(item);
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

export const AddShareTransfer  = createAsyncThunk(
    "/post/addsharetransfer",
    async (item,thunkAPI) => {
        try {
            const data = await ShareTransferService.AddShareTransfer(item);
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


export const EditShareTransfer = createAsyncThunk(
    "/post/editfarmer",
    async (item,thunkAPI) => {
        try {
            const data = await ShareTransferService.EditShareTransfer(item);
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

export const UpdateShareTransfer  = createAsyncThunk(
    "/post/updatefarmer",
    async (item,thunkAPI) => {
        try {
            const data = await ShareTransferService.UpdateShareTransfer(item);
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
