import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class SettingsService {
    static Getsettings() {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }

        const api = `${API_PATHS.getsettings}?client_id=${id}`;
        
        return axios
            .post(api)
            .then((response) => response.data);
    }
    
    static Updatesettings(item) {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }

        const api = `${API_PATHS.updatesettings}${id}`;
        console.log(api)
        
        return axios
            .post(api,item,{
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
            .then((response) => response.data);
    }


    static Getunits() {     
        return axios
            .get(API_PATHS.getunits)
            .then((response) => response.data);
    }
}

export default SettingsService;