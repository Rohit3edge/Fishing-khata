import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class FarmerService {
   

    static ListFarmer(item) {
        const api = `${API_PATHS.farmerlist}`;
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
      static AddFarmer(item) {

        const api = `${API_PATHS.farmerAdd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }


      

}

export default FarmerService;