import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class SaleService {

    static Getsingledetail(item) {
        const api = `${API_PATHS.getsingledetail}`;
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

export default SaleService;