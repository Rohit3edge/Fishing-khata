import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class ReportsService {

    static GetStockSummary(item) {
        const api = `${API_PATHS.stocksummary}`;
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


      static GetTrialBalance(item) {
        const api = `${API_PATHS.trialbalance}`;
     
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static GetProfitLoss(item) {
        const api = `${API_PATHS.ProfitLoss}`;
     
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }



      static Getauditloglist(item) {
        const api = `${API_PATHS.getauditloglist}`;
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


      static Getauditlogdetail(item) {
        const api = `${API_PATHS.getauditlogdetail}`;
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


    }

export default ReportsService;