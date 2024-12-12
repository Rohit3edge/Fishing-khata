import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class JournalService {

    static AddJournalVoucher(item) {
        const api = `${API_PATHS.Addjournalvoucher}`;

    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static JournalVoucherlist(item) {
          const api = `${API_PATHS.journalvoucherlist}`;
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


        static UpdateJournalVoucher(item) {
          const api = `${API_PATHS.Updatejournalvoucher}`;
  
      
          return axios
            .post(api, item, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
            .then((response) => response.data);
        }

        static Getdetailjournalvoucher(item) {
          const api = `${API_PATHS.getdetailjournalvoucher}`;
  
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

        static JournalvoucherDelete(item) {
          const api = `${API_PATHS.JournalvoucherDelete}`;
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

export default JournalService;