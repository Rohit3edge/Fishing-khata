import axios from "axios";
import qs from "qs";  // Import the qs library
import { API_PATHS } from "../utils/constants/api.constants";

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

    
}



export default AuthService;
