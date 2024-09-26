import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class LoansService {

    static ListLoans(item) {
        const api = `${API_PATHS.LoansList}`;
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

    static AddLoans(item) {

        const api = `${API_PATHS.LoansAdd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static EditLoans(item) {
      const api = `${API_PATHS.LoansEdit}`;
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


    static UpdateLoans(item) {

        const api = `${API_PATHS.LoansUpdate}`;
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

      

}

export default LoansService;