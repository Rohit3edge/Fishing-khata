import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class LedgerService {
    static Getledgergroups() {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }

        const api = `${API_PATHS.getledgergroups}?company_id=${id}`;
        
        return axios
            .get(api)
            .then((response) => response.data);
    }
}

export default LedgerService;
