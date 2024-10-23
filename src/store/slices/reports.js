import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ReportsService from "../../services/reports.service"

export const GetStockSummary = createAsyncThunk(
    "/post/getstocksummary",
    async (item,thunkAPI) => {
        try {
            const data = await ReportsService.GetStockSummary(item);
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

export const GetTrialBalance = createAsyncThunk(
    "/post/gettrialbalance",
    async (item,thunkAPI) => {
        try {
            const data = await ReportsService.GetTrialBalance(item);
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


export const GetProfitLoss = createAsyncThunk(
    "/post/getprofitloss",
    async (item,thunkAPI) => {
        try {
            const data = await ReportsService.GetProfitLoss(item);
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


export const GetAuditlogList = createAsyncThunk(
    "/post/getauditloglist",
    async (item,thunkAPI) => {
        try {
            const data = await ReportsService.Getauditloglist(item);
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
export const GetAuditlogDetail = createAsyncThunk(
    "/post/getauditlogdetail",
    async (item,thunkAPI) => {
        try {
            const data = await ReportsService.Getauditlogdetail(item);
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