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
    
    static Ledgerentires(item) {

        const api = `${API_PATHS.ledgerentires}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }


    static DepositWithdraw(item) {

        const api = `${API_PATHS.Depositwithdraw}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static UpdateCashOpeningBalance(item) {

        const api = `${API_PATHS.updatecashopeningbalance}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }
    static AddClosingStock(item) {

        const api = `${API_PATHS.addclosingstock}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static Deleteclosingstock(item) {

        const api = `${API_PATHS.deleteclosingstock}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }
    static Updateclosingstock(item) {

        const api = `${API_PATHS.updateclosingstock}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }
    static Closingstocklist(item) {

        const api = `${API_PATHS.closingstocklist}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static Getclosingstock(item) {
        // console.log(item)

        const api = `${API_PATHS.Getclosingstock}/${item}`;
        
        return axios
        .get(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

}

export default BankBookService;