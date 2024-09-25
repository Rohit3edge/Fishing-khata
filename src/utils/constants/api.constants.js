export const API_BASE_URL =
  process.env.API_BASE_URL || "https://kisaan-khata-api.updateproject.com";

export const X_API_KEY="z3rlamk8xyv4r79x5wb8t35x3ot49yzg"
 // CommonImgUploadService
export const CommonImgUploadService_BASE_URL="https://updateproject.com/kisaan-khata-api/uploads"


export const API_PATHS = {
  
  // // get Expert list
  // ExperList: API_BASE_URL +'/get/expertise',

  // // Dashboard Api url 
  // dashboard :API_BASE_URL + "dashboard/admin",

  // //upload media
  // uploadImage: API_BASE_URL_WM + "/upload",
  // multiUploadImage: API_BASE_URL + "/multiUpload",


  //  /farmer_documents

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
  updateitems:"/items/update",
  listitems:"/items/list",
  edititems:"/items/get-detail",

  addparties:"/parties/add",
  updateparties:"/parties/update",
  partieslist:"/parties/list",
  partiesEdit:"/parties/get-detail",
  synctoledger:"/parties/sync-to-ledger",
  getsingledetail:"/items/get-detail",
  getinvoiceslistpayments: "invoice/list-payments",
  getinvoicesnextnumber:"/invoices/next-number/",
  paymentmethods:"/client/payment-methods",
  getbycustomer:"/invoice/get-by-customer",
  invoiceslist:"/invoices/list",
  addinvoicespayment:"/invoice/payment/add",
  addinvoices: "/invoices/add",
  getinvoicessingledetails:"/invoice/get",
  getinvoicessingledetails:"/invoice/get",

  getsinglepaymentdetail:"/invoice/payment-detail",
  updatepayment:"/invoice/update-payment",
  
  // Directors 
  directorslist:"/directors/list",
  directorsStore:"/directors/add",
  directorsEdit:"/directors/detail",
  directorsUpdate:"/directors/update",
  invoiceUpdate:"/invoice/update",


  // farmer
  farmerlist :"/farmer/list",
  farmerAdd :"/farmer/add",
  farmerEdit :"/farmers/get-detail",
  farmerUpdate :"/farmer/update",

  // Members
  memberslist :"/members/list",
  membersadd :"/members/add",
  membersedit :"/members/get-detail",
  membersupdate :"/members/update",

  // Management Cost
  Managementedit :"/client/get-management-cost",
  Managementupdate :"/client/update-management-cost",

  // Share Applications
  ShareApplicationslist :"/share-applications/list",
  ShareApplicationsadd :"/share-applications/add",
  ShareApplicationsedit :"/share-applications/get-detail",
  ShareApplicationsupdate :"/share-applications/update",

  // Share Transfer

  ShareTransferList :"/share-transfer/list",
  ShareTransferAdd :"/share-transfer/add",
  ShareTransferEdit :"/share-transfer/detail",
  ShareTransferUpdate :"/share-transfer/update",

  // ComapnyDucuments
  ComapnyDucumentsedit :"/client/documents",


  

}