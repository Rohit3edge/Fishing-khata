import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class LedgerService {
    static Getledgergroups() {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }

        const api = `${API_PATHS.getledgergroups}?company_id=${id}`;
        
        return axios
            .get(api)
            .then((response) => response.data);
    }



    static Ledgerlist() {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }

        const api = `${API_PATHS.ledgerlist}${id}`;
        
        return axios
            .get(api)
            .then((response) => response.data);
    }
   

    static LedgerAdd(item) {
 
        const api = `${API_PATHS.ledgeradd}`;
        
        return axios
            .post(api,item,{
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
            .then((response) => response.data);
    }

    static GetState() {
 
        const api = `${API_PATHS.getstate}`;
        
        return axios
            .get(api,{
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
            .then((response) => response.data);
    }

    static Getledgerdetail(item) {
        const api = `${API_PATHS.getledgerdetail}`;
        const formData = new FormData();
    
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            formData.append(key, item[key]);
          }
        }
    
        return axios
          .post(api, formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static UpdateLedger(item) {
 
        const api = `${API_PATHS.updateledger}`;
        
        return axios
            .post(api,item,{
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            })
            .then((response) => response.data);
    }
}



   
export default LedgerService;
