import axios from "axios";
import {CommonImgUploadService_BASE_URL} from "../utils/constants/api.constants";

class CommonImgUploadService {
   
    static CommonimgUpload(item,type) {
        const api = `${CommonImgUploadService_BASE_URL}${type}`;
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

export default CommonImgUploadService;