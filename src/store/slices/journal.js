import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import JournalService from "../../services/journal.service"

export const AddJournalVoucher = createAsyncThunk(
    "/post/addjournalvoucher",
    async (item,thunkAPI) => {
        try {
            const data = await JournalService.AddJournalVoucher(item);
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

export const JournalVoucherList = createAsyncThunk(
    "/post/journalvoucherlist",
    async (item,thunkAPI) => {
        try {
            const data = await JournalService.JournalVoucherlist(item);
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

export const UpdateJournalVoucher = createAsyncThunk(
    "/post/updatejournalvoucher",
    async (item,thunkAPI) => {
        try {
            const data = await JournalService.UpdateJournalVoucher(item);
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

export const Getdetailjournalvoucher = createAsyncThunk(
    "/post/getdetailjournalvoucher",
    async (item,thunkAPI) => {
        try {
            const data = await JournalService.Getdetailjournalvoucher(item);
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

export const JournalvoucherDelete = createAsyncThunk(
    "/post/journalvoucherDelete",
    async (item,thunkAPI) => {
        try {
            const data = await JournalService.JournalvoucherDelete(item);
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