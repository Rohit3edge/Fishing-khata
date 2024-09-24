import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  ManagementCostService from "../../services/management-cost.servics"



export const EditManagementCost = createAsyncThunk(
    "/post/editmanagementcost",
    async (item,thunkAPI) => {
        try {
            const data = await ManagementCostService.EditManagementCost(item);
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

export const UpdateManagementCost = createAsyncThunk(
    "/post/updatemanagementcost",
    async (item,thunkAPI) => {
        try {
            const data = await ManagementCostService.UpdateManagementCost(item);
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
