import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class DividendService {
   

    static ListDividend(item) {
        const api = `${API_PATHS.DividendList}`;
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

    static AddDividend(item) {

        const api = `${API_PATHS.DividendAdd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static EditDividend(item) {
      const api = `${API_PATHS.DividendEdit}`;
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


    static UpdateDividend(item) {

        const api = `${API_PATHS.DividendUpdate}`;
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

      

}

export default DividendService;