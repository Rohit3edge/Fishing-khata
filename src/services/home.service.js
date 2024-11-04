import axios from 'axios';
import { API_PATHS } from '../utils/constants/api.constants';

class HomeService {
  static GetTotalSales(item) {
    const api = `${API_PATHS.gettotalsales}`;

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

  static GetTotalPurchase(item) {
    const api = `${API_PATHS.gettotalpurchase}`;

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

  static GetTotalbankbalance(item) {
    const api = `${API_PATHS.gettotalbankbalance}`;

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
  static GetTotalCash(item) {
    const api = `${API_PATHS.gettotalcash}`;

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
  static GetTotalSundryDebtors(item) {
    const api = `${API_PATHS.gettotalsundrydebtors}`;

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
  static GetTotalSundryCreditors(item) {
    const api = `${API_PATHS.gettotalsundrycreditors}`;

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

// HomeService.js
static GetStockInventoryTotal(item) {
  const api = `${API_PATHS.stockinventorytotal}`;
  const formData = new URLSearchParams();

  for (const key in item) {
    if (item.hasOwnProperty(key)) {
      formData.append(key, item[key]);
    }
  }

  return axios
    .post(api, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;  // Handle error if necessary
    });
}

}

export default HomeService;
