import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HomeService from "../../services/home.service"

export const GetTotalSales = createAsyncThunk(
    "/post/gettotalsales",
    async (item,thunkAPI) => {
        try {
            const data = await HomeService.GetTotalSales(item);
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

export const GetTotalPurchase = createAsyncThunk(
    "/post/gettotalpurchase",
    async (item,thunkAPI) => {
        try {
            const data = await HomeService.GetTotalPurchase(item);
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

export const GetTotalbankbalance = createAsyncThunk(
    "/post/gettotalbankbalance",
    async (item,thunkAPI) => {
        try {
            const data = await HomeService.GetTotalbankbalance(item);
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
export const GetTotalCash = createAsyncThunk(
    "/post/GetTotalCash",
    async (item,thunkAPI) => {
        try {
            const data = await HomeService.GetTotalCash(item);
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
export const GetTotalSundryDebtors = createAsyncThunk(
    "/post/GetTotalSundryDebtors",
    async (item,thunkAPI) => {
        try {
            const data = await HomeService.GetTotalSundryDebtors(item);
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
export const GetTotalSundryCreditors = createAsyncThunk(
    "/post/GetTotalSundryCreditors",
    async (item,thunkAPI) => {
        try {
            const data = await HomeService.GetTotalSundryCreditors(item);
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

export const GetStockInventoryTotal = createAsyncThunk(
    "stock/getStockInventoryTotal",
    async (item, thunkAPI) => {
      try {
        const data = await HomeService.GetStockInventoryTotal(item);
        return data;
      } catch (error) {
        const message = 
          error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue({ message });
      }
    }
  );
  
