import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class ShareApplicationsService {
   
    static ListShareApplications(item) {
        const api = `${API_PATHS.ShareApplicationslist}`;
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


      static AddShareApplications(item) {

        const api = `${API_PATHS.ShareApplicationsadd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static EditShareApplications(item) {
      const api = `${API_PATHS.ShareApplicationsedit}`;
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

    static updateShareApplications(item) {

      const api = `${API_PATHS.ShareApplicationsupdate}`;
      
      return axios
      .post(api,item,{
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
      })
      .then((response) => response.data);
  }


      

}

export default ShareApplicationsService;