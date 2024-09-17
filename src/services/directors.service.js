import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class DirectorsService {
   

    static ListDirectors(item) {
        const api = `${API_PATHS.directorslist}`;
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

      static AddDirector(item) {

        const api = `${API_PATHS.directorsStore}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static EditDirectors(item) {
      const api = `${API_PATHS.directorsEdit}`;
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


      static UpdateDirector(item) {

        const api = `${API_PATHS.directorsUpdate}`;
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
  }

      

}

export default DirectorsService;