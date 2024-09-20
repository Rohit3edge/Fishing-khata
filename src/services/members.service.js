import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class MembersService {
   
    static ListMembers(item) {
        const api = `${API_PATHS.memberslist}`;
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


      static AddMembers(item) {

        const api = `${API_PATHS.membersadd}`;
        
        return axios
        .post(api,item,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => response.data);
    }

    static EditMembers(item) {
      const api = `${API_PATHS.membersedit}`;
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

    static Updatemembers(item) {

      const api = `${API_PATHS.membersupdate}`;
      
      return axios
      .post(api,item,{
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
      })
      .then((response) => response.data);
  }


      

}

export default MembersService;