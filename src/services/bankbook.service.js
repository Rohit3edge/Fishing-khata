import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class BankBookService {
    static AddBankBook(item) {

        const api = `${API_PATHS.addbank}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static GetCompanyBanks() {

        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }

        const api = `${API_PATHS.getcompanybanks}${id}`;
        
        return axios
        .get(api)
        .then((response) => response.data);
    }

    static Getsinglebank(item) {

        const api = `${API_PATHS.getsinglebank}${item}`;
        
        return axios
        .get(api)
        .then((response) => response.data);
    }
    
}

export default BankBookService;