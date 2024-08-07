export const API_BASE_URL =
  process.env.API_BASE_URL || "https://api.healthonify.com/";

export const API_BASE_URL_HC =
  process.env.API_BASE_URL || "https://api-hc.healthonify.com";

export const API_BASE_URL_WM =
  process.env.API_BASE_URL || "https://api-wm.healthonify.com";

export const API_PATHS = {
  // get Expert list
  ExperList: API_BASE_URL +'/get/expertise',

  // Dashboard Api url 
  dashboard :API_BASE_URL + "dashboard/admin",

  //upload media
  uploadImage: API_BASE_URL_WM + "/upload",
  multiUploadImage: API_BASE_URL + "/multiUpload",


  //authentication
  login: "/login",
  register: "/register",
  verifyOtp: "/verifyOtp",
  getuser: "https://api.healthonify.com/get/user",
  putuser: "/put/user",
  postforgotpass: '/forgotPassword',
  postupdatepassword: "/updatePassword",
  addExpert: "/admin/addExpert",


  //travel category
  getCity: "/get/city?country=India",
  getStates: "/get/state",

  //expert
  getClient: "/getClientList",
  getConsultation: "/get/consultation",
  putConsultationid: "/put/consultation?id=6230c1f39f30124474bfc38e",

  //enquiry
  getEnquiry: "/get/enquiry",
  putEnquiry: "/enquiry/update",
  getWmEnquiry: API_BASE_URL_WM + "/get/wmEnquiry",
  editWmEnquiry: API_BASE_URL_WM + "/put/wmEnquiry",

  //  blog
  getblog: API_BASE_URL_WM + "/get/blog",
  postblog: API_BASE_URL_WM + "/post/blog",
  deleteblog: API_BASE_URL_WM + "/delete/blog",
  putblog: API_BASE_URL_WM + "/put/blog",
  wminitiateConsultation: API_BASE_URL_WM + "/wm/user/initiateFreeConsult",


  // Community
  getcommunity: '/user/getAllPosts',
  postcommunity: '/post/communityPost',
  addlikes: "/user/addLike",
  approve: "/put/communityPost",
  deletepost: "/delete/communityPost",
  getFlaggedPost: "/communityPosts/fetchFlagPosts",

  // HRA Queitionnaire 
  postquestion: API_BASE_URL_HC + "/post/hraQuestions",
  getquestion: API_BASE_URL_HC + "/get/hraQuestions",

  // livewell
  getMasterCategory: API_BASE_URL_HC + "/get/Category?master=1",
  getcontent: API_BASE_URL_HC + "/get/content",
  putcontent: API_BASE_URL_HC + "/put/content",
  getplaylist: API_BASE_URL_HC + "/get/playlist",
  getplaylistcontent: API_BASE_URL_HC + "/get/playlistContent",
  postmastercategory: API_BASE_URL_HC + "/post/category",
  postcontent: API_BASE_URL_HC + "/post/content",
  postplaylist: API_BASE_URL_HC + "/post/playlist",
  getCategory: API_BASE_URL_HC + "/get/Category",
  // -------------------------------------------------------------

  // Labs
  getLabVendorEnquiry: API_BASE_URL_HC + "/get/enquiry?enquiryFor=labVendor",
  getLabVendors: API_BASE_URL + "get/user",
  getLabVendorsDetails: API_BASE_URL + "get/user",
  approveLabVendorEnquiry: API_BASE_URL_HC + "/admin/approveLabvendorRegistrationRequest",
  getLabRevenue: API_BASE_URL_HC + "/get/labRevenue",
  getlabs: API_BASE_URL_HC + "/get/labs",
  getViewlabs: API_BASE_URL + "get/labs",
  listLab: API_BASE_URL_HC + "/vendor/addLab",
  getLabReport: API_BASE_URL_HC + "/get/labReport",
  LabTestOrders: API_BASE_URL_HC + "/fetch/labOrders",

  approveLab: API_BASE_URL_HC + "/admin/approveLab",
  approveLabNew: API_BASE_URL_HC + "/admin/approveLabvendorRegistrationRequest",
  getlabonboardrequest: API_BASE_URL_HC + "/admin/fetchLabRequests",
  getLabOnBoardRequestNew : API_BASE_URL_HC + '/get/enquiry',


  postlabtestcategory: API_BASE_URL_HC + "/post/labTestCategory",
  editlabtestcategory: API_BASE_URL_HC + "/put/labTestCategory",
  getlabtestcategory: API_BASE_URL_HC + "/get/labTestCategory",

  getlabtests: API_BASE_URL_HC + "/get/labTest",
  updatelabtestrequest: API_BASE_URL_HC + "/vendor/updateLabTestRequest",
  addTestReport: API_BASE_URL_HC + "/lab/addLabReport",
  //faq
  faq: "/get/faq",
  postfaq: "/post/faq",
  editFreq: "/put/faq",
  deleteFreq: "/delete/faq",

  nearlabs: API_BASE_URL_HC + "/getNearByLabs?longitude=17.47246428264744&latitude=78.38621445916762",
  addmembers: API_BASE_URL_HC + "/user/addFamilyMember",
  familymembers: API_BASE_URL_HC + "/user/fetchFamilyMembers?relatesTo=628e07c3295cbb2a64996d2d",

  storeLabrating: API_BASE_URL_HC + "/user/storeLabRating",
  labtestrequest: API_BASE_URL_HC + "/user/createLabTestRequest",
  searchlab: API_BASE_URL_HC + "/user/searchLabs",


  getWomenSpecialSetting: API_BASE_URL + "/get/womenSpecialSetting",
  postWomenSpecialSetting: API_BASE_URL + "/post/womenSpecialSetting",
  putWomenSpecialSetting: API_BASE_URL + "/put/womenSpecialSetting",
  deleteWomenSpecialSetting: API_BASE_URL + "/delete/womenSpecialSetting",

  getHealthConditions: API_BASE_URL + "/get/healthCondition",
  postHealthConditions: API_BASE_URL + "/post/healthCondition",
  putHealthConditions: API_BASE_URL + "/put/healthCondition",
  deleteHealthConditions: API_BASE_URL + "/delete/healthCondition",

  getPackageType: API_BASE_URL_WM + "/get/wmPackageType",

  getWmPackage: API_BASE_URL + "/get/wmPackage",
  postWmPackage: API_BASE_URL + "/post/wmPackage",
  editWmPackage: API_BASE_URL + "/put/wmPackage",
  deleteWmPackage: API_BASE_URL + "/delete/wmPackage",

  // ------------------------------------------------------------------
  getspecialist: API_BASE_URL_HC + "/searchHcSpecialist",
  posthcexpert: API_BASE_URL_HC + "/user/assignHcExpert",
  putConsultation: API_BASE_URL + "/admin/updateConsultation",


  getHCconsultation: API_BASE_URL_HC + "/get/hcConsultation",
  getHcPackage: API_BASE_URL + "/get/package?flow=healthcare",
  getPhysioPackage: API_BASE_URL + "/get/package?flow=physio",
  getFitnessPackage: API_BASE_URL + "/get/package?flow=fitness",



  getayurvedaconditions: API_BASE_URL_HC + "/get/ayurvedaConditions",

  getayurvedaplans: API_BASE_URL_WM + "/get/ayurvedaPlans",
  postayurvedaplans: API_BASE_URL_WM + "/post/ayurvedaPlans",
  putayurvedaplans: API_BASE_URL_WM + "/put/ayurvedaPlans",
  deleteayurvedaplans: API_BASE_URL_WM + "/delete/ayurvedaPlans",

  getpartbodygroup: API_BASE_URL + "/get/bodyPartGroup",
  postpartbodygroup: API_BASE_URL_WM + "/post/bodyPartGroup",
  putpartbodygroup: API_BASE_URL_WM + "/put/bodyPartGroup",
  deletepartbodygroup: API_BASE_URL_WM + "/delete/bodyPartGroup",
  getbodypart: API_BASE_URL + "/get/bodyPart",
  postpartbody: API_BASE_URL_WM + "/post/bodyPart",
  putpartbody: API_BASE_URL_WM + "/put/bodyPart",
  deletepartbody: API_BASE_URL_WM + "/delete/bodyPart",


  getexpercise: API_BASE_URL_WM + "/get/exercise?limit=10000",
  postexpercise: API_BASE_URL_WM + "/post/exercise",
  putexpercise: API_BASE_URL_WM + "/put/exercise",

  postmedicalhistory: API_BASE_URL_WM + "/post/medicalHistory",

  getworkoutplan: API_BASE_URL_WM + "/get/workoutPlan",
  postworkoutplan: API_BASE_URL_WM + "/post/workoutPlan",
  uploadworkoutplan: API_BASE_URL_WM + "/excel/store/workoutplan",
  deleteworkoutplan: API_BASE_URL_WM + "/delete/workoutPlan",

  getfitness: API_BASE_URL_WM + "/get/enquiry?status=fitnessCenterRegistrationRequest",
  postapprovefitness: API_BASE_URL_WM + "/admin/approveFitnessCenterRegistrationRequest",
  getfitnessrequest: API_BASE_URL_WM + "/get/fitnessCenter",
  postapproverequest: API_BASE_URL_WM + "/admin/approveFitnessCenter",
  getfitnesscenter: API_BASE_URL_WM + "/get/fitnessCenter",
  deletefitnesscenter: API_BASE_URL_WM + "/delete/fitnessCenter",
  postfitnesscenter: API_BASE_URL_WM + "/fc/createFitnessCenter",
  fitnesscenterRevenue: API_BASE_URL_WM + "/get/fitnessCenterRevenue",

  getrecipes: API_BASE_URL_WM + "/get/recipes",
  postrecipes: API_BASE_URL_WM + "/post/recipes",
  putrecipes: API_BASE_URL_WM + "/put/recipes",
  deleterecipes: API_BASE_URL_WM + "/delete/recipes",

  getfoodcategory: API_BASE_URL_WM + "/get/foodCategory",
  postfoodcategory: API_BASE_URL_WM + "/post/foodCategory",
  getfoodtype: API_BASE_URL_WM + "/get/foodType",
  postfoodtype: API_BASE_URL_WM + "/post/foodType",
  getdish: API_BASE_URL_WM + "/get/dish",
  postdish: API_BASE_URL_WM + "/post/dish",

  onboard: API_BASE_URL + "/get/enquiry?status=companyOnboardingRequest&enquiryFor=companyOnboarding",
  addonboard: API_BASE_URL + "/company/onboard",
  getcompany: API_BASE_URL + "/get/company",

  putenquiry: "/put/enquiry",


  WMConsultations: API_BASE_URL_WM + "/get/wmConsultation",
  WMSessions: API_BASE_URL_WM + "/get/wmSession",

  //hc expert
  GetConsultations: API_BASE_URL_HC + "/fetchExpertConsultations",
  getExpertise: "/get/expertise",

  //get hc expert revemue
  revenue: API_BASE_URL_HC + "/fetch/hcRevenues",
  postHcPrescription: API_BASE_URL_HC + "/expert/storeHcPrescription",

  // Diet
  postdiet: "/post/dietPlan",
  getdietplan: API_BASE_URL_WM + "/get/dietPlan",
  uploadDietPlan: API_BASE_URL_WM + "/excel/store/dietplan",
  deleteDietPlan: API_BASE_URL_WM + "/delete/dietPlan",


  //get fitness services
  getfitnessService: API_BASE_URL_WM + "/get/fitnessServices",
  fcPlannsCategory: API_BASE_URL_WM + "/get/fitnessPlansCategory",
  fcPlanCat: API_BASE_URL + "/get/fitnessPlansCategory",
  fcCreatePlan : API_BASE_URL + "post/fitnessPlans",
  fcEditPlans : API_BASE_URL + "put/fitnessPlans",
  fPlanDelete : API_BASE_URL + "delete/fitnessPlans",

  postFitnessPlan: API_BASE_URL_WM + "/post/fitnessPlans",
  getFitnessPlan: API_BASE_URL_WM + "/get/fitnessPlans",
  putFitnessPlan: API_BASE_URL_WM + "/put/fitnessPlans",

  getfitnesscenterAmenities: API_BASE_URL_WM + "/get/fitnessCenterAmenities",
  postfitnesscenterAmenities: API_BASE_URL_WM + "/post/fitnessCenterAmenities",


  //packages
  addPackage: "/post/package",
  getPackage: "/get/package",
  editPackage: "put/package",
  deletePackage: "delete/package",

  

  //analysis report
  salesAnalysisDetail: "/analysis/salesAnalysis",
  appointmentAnalysisDetail: "/analysis/appointmentAnalysis",
  sessionAnalysisDetail: "/analysis/sessionAnalysis",
  enquiryAnalysisDetails : "/analysis/enquiryAnalysis",
  ConversionAnalysisDetails:"/analysis/conversionAnalysis",
  

  //account report
  accountReport: "/analysis/gstAnalysis",
  salesReport :"/admin/accounts/salesReport",
  exportRecon:'/admin/accounts/expertRecon',
  GSTRecon : "/admin/accounts/gstRecon",


  //challenge
  postChallenge: API_BASE_URL_HC + "/createFitnessChallenge",
  getChallenge: API_BASE_URL_HC + "/get/fitnessChallenge",
  putChallenge: API_BASE_URL_HC + "/put/fitnessChallenge",
  deleteChallenge: API_BASE_URL_HC + "/delete/fitnessChallenge",
  getChallengeCategory: API_BASE_URL_HC + "/get/challengeCategory",


  getlifestyle: API_BASE_URL_WM + "/get/lifestyle",
  getmedicalHistory: API_BASE_URL_WM + "/get/userMedicalHistory",

  //fitness form
  fitnessform: API_BASE_URL_WM + "/get/fitnessAnswers",


  measurements: API_BASE_URL_WM + "/get/bodyMeasurements",
  weightLog: API_BASE_URL_WM + "/get/weightLog",
  surgeryHistory: API_BASE_URL_HC + "/get/userSurgery",
  allergyHistory: API_BASE_URL_HC + "/get/userAllergyLogs",
  familyIllnessHistory: API_BASE_URL_HC + "/get/userFamilyIllnessLogs",
  majorIllnessHistory: API_BASE_URL_HC + "/get/userMajorIllnessLogs",
  socialHabits: API_BASE_URL_HC + "/get/userSocialHabits",

  healthLocker: API_BASE_URL_WM + "/fetch/healthLocker",
  bpLog: API_BASE_URL_WM + "/fetchLogs/userBloodPressure",
  bloodGlucose: API_BASE_URL_WM + "/fetchLogs/userBloodGlucose",
  hba1c: API_BASE_URL_WM + "/fetchLogs/userHba1c",
  userDietPlan: API_BASE_URL_WM + "/get/UserDietPlan",


  expiredSubscription: "/fetchExpiredPlanClients",
  updateComment: API_BASE_URL_HC + "/put/hcConsultation"

};
