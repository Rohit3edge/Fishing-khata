import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class ShareTransferService {
   
    static ListShareTransfer(item) {
        const api = `${API_PATHS.ShareTransferList}`;
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


      static AddShareTransfer(item) {

        const api = `${API_PATHS.ShareTransferAdd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static EditShareTransfer(item) {
      const api = `${API_PATHS.ShareTransferEdit}`;
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

    static UpdateShareTransfer(item) {

      const api = `${API_PATHS.ShareTransferUpdate}`;
      
      return axios
      .post(api,item,{
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
      })
      .then((response) => response.data);
  }


      

}

export default ShareTransferService;