import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class ListManagementCost {
   
    static EditManagementCost(item) {
      const api = `${API_PATHS.Managementedit}`;
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

  static UpdateManagementCost(item) {
        const api = `${API_PATHS.Managementupdate}`;
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
  }


  static EditComapnyDucuments(item) {
    const api = `${API_PATHS.ComapnyDucumentsedit}`;
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

  static UpdateComapnyDucuments(item) {
    const api = `${API_PATHS.ComapnyDucumentsUpdate}`;
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

export default ListManagementCost;