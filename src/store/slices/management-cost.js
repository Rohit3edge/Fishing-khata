import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import  ManagementCostService from "../../services/management-cost.servics"


export const ListManagementCost = createAsyncThunk(
    "/post/listmembers",
    async (item,thunkAPI) => {
        try {
            const data = await ManagementCostService.ListManagementCost(item);
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

// export const AddMembers  = createAsyncThunk(
//     "/post/addmembers",
//     async (item,thunkAPI) => {
//         try {
//             const data = await ManagementCostService.AddMembers(item);
//             return data;
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue({ message });
//         }
//     }
// );


// export const EditMembers = createAsyncThunk(
//     "/post/editfarmer",
//     async (item,thunkAPI) => {
//         try {
//             const data = await ManagementCostService.EditMembers(item);
//             return data;
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue({ message });
//         }
//     }
// );

// export const Updatemembers  = createAsyncThunk(
//     "/post/updatefarmer",
//     async (item,thunkAPI) => {
//         try {
//             const data = await ManagementCostService.Updatemembers(item);
//             return data;
//         } catch (error) {
//             const message =
//                 (error.response &&
//                     error.response.data &&
//                     error.response.data.message) ||
//                 error.message ||
//                 error.toString();
//             return thunkAPI.rejectWithValue({ message });
//         }
//     }
// );
