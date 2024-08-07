import { API_PATHS } from "../utils/constants/api.constants";
import {utils, writeFile} from 'xlsx'


export const imageUpload = async (e, type) => {
  try {
    // setLoader(true)
    e.preventDefault();
    var formdata = new FormData();
    formdata.append("file", e.target.files[0]);

    var requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    let response = await fetch(API_PATHS.uploadImage, requestOptions);
    let data = await response.json();
    // setLoader(false)
    return data.data.location
  } catch (e) {
    console.log(e.stack)
    return e.message
  }
}

export const excelDownload = async(data, filename)=>{
  const transformedData = data.map((item) => {
    const userDetails = item["User Details"]
      .split('<br>')
      .reduce((acc, detail) => {
        const [key, value] = detail.split(':');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});

    return {
      "#": item["#"],
      ...userDetails,
      "Message": item["Message"],
      "Category": item["Category"],
      "Date of Enquiry": item["Date of Enquiry"],
      "Status": item["Status"],
    };
  });

  var wb = utils.book_new(),
  ws = utils.json_to_sheet(transformedData)
  utils.book_append_sheet(wb, ws, "MySheet1")
  writeFile(wb,filename)
}


export const limitForPagination =  ()=>{
  const limit =50
  return limit
}

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};