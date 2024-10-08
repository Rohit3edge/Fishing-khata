import axios from "axios";
import { API_PATHS } from "../utils/constants/api.constants";

class PurchaseService {

    static AddPurchaseOrder(item) {
        const api = `${API_PATHS.addpurchaseorders}`;
   
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }
      
      static UpdatePurchaseOrder(item) {
        const api = `${API_PATHS.updatepurchaseorders}`;
   
        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }
      

      static GetPurchaseOrderlist(item) {
        const api = `${API_PATHS.purchaseorderslist}`;
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

      static GetSingleDetailsPurchaseorders(item) {
        const api = `${API_PATHS.singledetailspurchaseorders}`;
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

      static GetAdditionalTax (item) {
        const api = `${API_PATHS.add_tax}`;

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


      // purchasevouche

      static CreatePurchaseVoucher (item) {
        const api = `${API_PATHS.createpurchasevoucher}`;

        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static CreatePurchaseVoucherList (item) {
        const api = `${API_PATHS.purchasevouchelist}`;

        const formData = new FormData();
    
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            formData.append(key, item[key]);
          }
        }

        return axios
          .post(api,formData, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static UpdatePurchaseVoucher (item) {
        const api = `${API_PATHS.updatepurchasevoucher}`;
        

        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static GetPurchaseVoucherDetail (item) {
        const api = `${API_PATHS.GetPurchaseVoucherDetail}`;

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

      static PaymentOutgetbycustomer (item) {
        const api = `${API_PATHS.PaymentOutgetbycustomer}`;

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


      static AddPaymentout (item) {
        const api = `${API_PATHS.addpaymentout}`;
        

        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }


      static PaymentOutList (item) {
        const api = `${API_PATHS.paymentoutlist}`;

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


      static UpdatePaymentOut (item) {
        const api = `${API_PATHS.updatepaymentout}`;
        

        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static GetPaymentdetail (item) {
        const api = `${API_PATHS.getpaymentdetail}`;

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

      // debitnotelist


      static DebitNotelist (item) {
        const api = `${API_PATHS.debitnotelist}`;

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


      static AddDebitnote (item) {
        const api = `${API_PATHS.adddebitnote}`;
        

        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static UpdateDebitnote (item) {
        const api = `${API_PATHS.updatedebitnote}`;
        

        return axios
          .post(api, item, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then((response) => response.data);
      }

      static GetSingleDebitnote (item) {
        const api = `${API_PATHS.getsingledebitnote}`;

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

export default PurchaseService;