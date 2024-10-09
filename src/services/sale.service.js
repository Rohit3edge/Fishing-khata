import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class SaleService {

    static Getsingledetail(item) {
        const api = `${API_PATHS.getsingledetail}`;
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


      static GetInvoiceslistpayments(item) {
        const api = `${API_PATHS.getinvoiceslistpayments}`;
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

      static Getinvoicesnextnumber() {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }
        const api = `${API_PATHS.getinvoicesnextnumber}${id}`;
       
    
        return axios
          .get(api,{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static GetPaymentMethods(item) {
        const api = `${API_PATHS.paymentmethods}`;
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

      static GetByCustomer(item) {
        const api = `${API_PATHS.getbycustomer}`;
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

      static GetByInvoiceslist(item) {
        const api = `${API_PATHS.invoiceslist}`;
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


      static Addinvoicespayment(item) {
        const api = `${API_PATHS.addinvoicespayment}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static Addinvoices(item) {
        const api = `${API_PATHS.addinvoices}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static GetInvoicesSingleDetails(item) {
        const api = `${API_PATHS.getinvoicessingledetails}`;
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

      static InvoiceUpdate(item) {
        const api = `${API_PATHS.invoiceUpdate}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      
      static GetSinglePaymentDetail(item) {
        const api = `${API_PATHS.getsinglepaymentdetail}`;
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

      static UpdatePayment(item) {
        const api = `${API_PATHS.updatepayment}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      // creditnote
      static GetCreditNotelist(item) {
        const api = `${API_PATHS.creditnotelist}`;
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


      static AddCreditnote(item) {
        const api = `${API_PATHS.addcreditnote}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }



      static UpdateCreditnote(item) {
        const api = `${API_PATHS.updatecreditnote}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static GetSingleCreditnote(item) {
        const api = `${API_PATHS.getsinglecreditnote}`;
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




      static GetByQuotationlist(item) {
        const api = `${API_PATHS.QuotationList}`;
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


      static Getquotationnextnumber() {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?.data?.id;  // Safely access id
        
        if (!id) {
            throw new Error("User ID not found");
        }
        const api = `${API_PATHS.getQuotationnextnumber}${id}`;
       
    
        return axios
          .get(api,{
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static AddQuotation(item) {
        const api = `${API_PATHS.addQuotation}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static GetQuotationSingleDetails(item) {
        const api = `${API_PATHS.GetQuotationSingleDetails}`;
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


      static QuotationUpdate(item) {
        const api = `${API_PATHS.QuotationUpdate}`;
    
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }
}

export default SaleService;