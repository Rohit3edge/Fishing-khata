import axios from 'axios';
import { API_PATHS } from '../utils/constants/api.constants';

class ItemsService {
  static ListCategories(item) {
    const api = `${API_PATHS.listcategories}`;
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

  static AddCategory(item) {
    const api = `${API_PATHS.addcategory}`;

    return axios
      .post(api, item, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }


  static AddItems(item) {
    const api = `${API_PATHS.additems}`;

    return axios
      .post(api, item, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

  static ListItems(item) {
    const api = `${API_PATHS.listitems}`;
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


  static Edititems(item) {
    const api = `${API_PATHS.edititems}`;
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


  static Updateitems(item) {
    const api = `${API_PATHS.updateitems}`;

    return axios
      .post(api, item, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((response) => response.data);
  }

}



export default ItemsService;
