import axios from "axios";
import { API_BASE_URL } from "../constants/api.constants";

export function AxiosSetup() {
  axios.defaults.baseURL = API_BASE_URL;

  // axios.interceptors.request.use((value) => {
  //   // get token here from local-storeage or cookies
  //   const accessToken = "";
  //   value.headers["Authorization"] = `Bearer ${accessToken}`;
  // });
}
