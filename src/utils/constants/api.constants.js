export const API_BASE_URL =
  process.env.API_BASE_URL || "https://kisaan-khata-api.updateproject.com";

export const X_API_KEY="z3rlamk8xyv4r79x5wb8t35x3ot49yzg"


export const API_PATHS = {
  
  // // get Expert list
  // ExperList: API_BASE_URL +'/get/expertise',

  // // Dashboard Api url 
  // dashboard :API_BASE_URL + "dashboard/admin",

  // //upload media
  // uploadImage: API_BASE_URL_WM + "/upload",
  // multiUploadImage: API_BASE_URL + "/multiUpload",


  //authentication
  login: "/client/login",

  getledgergroups: "/common/getledgergroups",
  getsettings:"/client/getsettings",
  getunits: "/common/getunits",
  updatesettings:"client/updatesettings/",
  addbank:"/client/add-bank-book",

  getcompanybanks:"/client/get-company-banks/",
  getsinglebank:"/client/get-bank/",
  ledgerlist:"/ledger/list/",
  ledgeradd:"/ledger/add",
  ledgerentires:"/ledger/get-ledger-entires",
  Depositwithdraw:"/ledger/add-bank-entry",
  listcategories:"/items/list-categories",
  addcategory:"/items/add-category",
  additems:"/items/add",
  listitems:"/items/list"


}