import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class clientsService {

    static Editclients(item) {
      const api = `${API_PATHS.clientEdit}`;
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

    static Updateclients(item) {

      const api = `${API_PATHS.clientUpdate}`;
      
      return axios
      .post(api,item,{
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
      })
      .then((response) => response.data);
  }



    static CheckEmailclients(item) {
      const api = `${API_PATHS.CheckEmailclients}`;
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

    static CheckGSTclients(item) {
      const api = `${API_PATHS.CheckGSTclients}`;
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

  static LicenceCheck(item) {
      const api = `${API_PATHS.LicenceCheck}`;
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

export default clientsService;