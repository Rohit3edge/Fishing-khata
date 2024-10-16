import axios from "axios";
import qs from "qs";  // Import the qs library
import { API_PATHS } from "../utils/constants/api.constants";

// const secretKey = 'z3rlamk8xyv4r79x5wb8t35x3ot49yzg'; // Use a strong secret key

// // Function to encrypt the payload
// const encryptPayload = (data) => {
//     const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
//     return encryptedData;
// };

class AuthService {
    static login({ email, password }) {
        return axios.post(API_PATHS.login, qs.stringify({
            email,
            password,
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then((response) => {
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
    }

    static GetClientsDetail(item) {
        const api = `${API_PATHS.getdetailclients}`;
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



export default AuthService;
