import { dashboardUrl, liveIp } from '../config/IpAddress';

const coopIp = liveIp + 'coop/';
const dashBoardIp = dashboardUrl + 'api/v1/';
//============================================================================//
export const memberForGrantor = liveIp + 'samity/memberDetails?memberId';
export const ledger = liveIp + 'ledger/';
export const GlAcList = liveIp + 'gl-list';
export const SamityGlTrans = liveIp + 'samity-gl-trans';
export const authorizedRoute = liveIp + 'user/auth/authorization';
export const GlacList = liveIp + 'gl-list?parentChild=C&isPagination=false&glacType=';
export const SamityRegistrationReport = liveIp + 'samity-registration/samity-registration-report/';
export const jobTypeList = liveIp + 'occupation';
export const projectList = liveIp + 'project';
export const Division = liveIp + 'geo-location?type=division&isPagination=false';
export const District = liveIp + 'master/zone/district';
export const Upazila = liveIp + 'master/zone/upazila';
export const CityCorp = liveIp + 'geo-location?type=cityCorp&isPagination=false';
export const Union = liveIp + 'master/zone/union';
export const memberFinancialData = liveIp + 'member-financial-info/';
export const MemberArea = liveIp + 'member-area';
export const WorkingArea = liveIp + 'working-area';
export const imcomeExpData = liveIp + 'samity-gl-trans?isPagination=false&isIeBudget=E&samityId=';
export const imcomeExpBudgetData = liveIp + 'samity-gl-trans?isPagination=false&isIeBudget=B&samityId=';
export const particularMembersInfo = liveIp + 'initial-member-info';
export const committeeRole = coopIp + 'committee-role';

//fixed asset
export const fixedassetdata = coopIp + 'fixed-asset';
export const purchaseFixedasset = coopIp + 'purchase-fixed-asset/';
export const assetInfo = coopIp + 'asset-data/';
export const updatepurchasefixedasset = coopIp + 'update-purchase-fixed-asset';
export const fixedassetListdata = coopIp + 'listassetdata/';
export const updateaseetinfo = coopIp + 'update-asset-info/';

// single sign on

// step
export const samityStepReg = liveIp + 'samity-reg-steps';
export const samityCorrection = liveIp + 'samity/correction';
export const memberfinancedata = liveIp + 'coop/member-financial-info';

// loan part
export const codeMaster = liveIp + 'master/data/codeMaster';

export const samityReg = liveIp + 'samity';
export const submittedDoc = liveIp + 'sanction/givenDoc';
export const documentListRoute = liveIp + 'master/data/service-wise-documents';
export const particularSamityInfoAll = liveIp + 'samity/samityDetails';
export const memberRegSamity = liveIp + 'samity';
export const samityApproval = liveIp + 'samity/final';
export const samityRejection = liveIp + 'samity/log';
export const memberRegistration = liveIp + 'samity/manualmember';
export const loanProject = liveIp + 'master/project/';
export const fieldOffRoute = liveIp + 'master/employee/fieldOfficer';
export const divisionRoute = liveIp + 'master/zone/division';
export const districtRoute = liveIp + 'master/zone/district';
export const upazilaRoute = liveIp + 'master/zone/upazila';
export const unionRoute = liveIp + 'master/zone/union';
export const chargeTypeListRoute = liveIp + 'product/chargeTypeList';
export const docTypeRoute = liveIp + 'master/data/docType';
export const officeIdRoute = liveIp + 'master/data/office';

export const GlType = liveIp + 'master/data/codeMaster';
export const samityRoute = liveIp + 'reports/samity';
export const getSamityName = liveIp + 'reports/samityNameList';
export const geoDataUrl = liveIp + 'master/zone/';
export const samityNameRoute = liveIp + 'samity/samityname';
export const transactionSamityMemberRoute = liveIp + 'transaction/product';
export const transactionOfMember = liveIp + 'transaction';

export const permissionRoute = liveIp + 'master/data//fieldData';
export const meetingInfo = liveIp + 'master/data/meetingType';

export const loanSamityReg = liveIp + 'application/samityCreate';
export const memberAttendance = liveIp + 'samity/memberAttendance';
export const loanInfoMigration = liveIp + 'application/loanMigrationCreate';
export const updateApplication = liveIp + 'application/updateApplication/';
export const memberCreate = liveIp + 'application/updateApplication/memberCreate';
export const memberCreateForApprovedMember = liveIp + 'samity/member-details-for-update';

export const approvedMemberCreate = liveIp + 'application/memberCreate';
export const approveSamityList = liveIp + 'application/temp-samity/members';
export const samityRegUpdate = liveIp + 'samity/samityinfo';
export const memberApproval = liveIp + 'samity/final';
export const memberRejection = liveIp + 'samity/log';
export const memberCorrection = liveIp + 'samity/correction';
export const samityGetRouteFromCoop = coopIp + 'samity-info?officeId=';

export const memberFromSurvey = liveIp + 'samity/member';

export const memberParticularRoute = liveIp + 'samity/memberDetails';
export const getSamityForReport = liveIp + 'reports/samityName';
export const getSamityByZone = liveIp + 'reports/samityNameList';
export const groupForApprove = liveIp + 'samity/dol';
export const manualMemberEdit = liveIp + 'samity/manual-member-edit?memberId=';
export const dollDetails = liveIp + 'samity/dolDetails';
export const dolReject = liveIp + 'samity/rejectDol';
export const acceptDall = liveIp + 'samity/finalDol';
export const getDolMember = liveIp + 'samity/memberBySamity';
export const dalEdit = liveIp + 'samity/dolInfo';
export const product = liveIp + 'sanction/product';
export const districtOffice = liveIp + 'master/data/districtOffice';
export const officeName = liveIp + 'master/data/childOfficeList';
export const upozilaOffice = liveIp + 'master/data/upazilaOffice';
export const samityAndMember = liveIp + 'samity';
export const loanPurposeList = liveIp + 'master/data/loanPurpose';
export const sendApplyLoan = liveIp + 'application/sanction';
export const productSave = liveIp + 'application/product';
export const productUpdate = liveIp + 'application/updateProduct';
export const savingsProductUpdate = liveIp + 'application/savingsProductUpdate';

export const getOfficeLayer = liveIp + 'master/data/officeLayer';
export const sendApplySamityUpdate = liveIp + 'application/samityUpdate';
export const productList = liveIp + 'product';
export const productSingle = liveIp + 'product/singleProduct';
export const getApprovedSavingsProduct = liveIp + 'savings/approved-savings-product';
export const prodcutDataUpdate = liveIp + 'application/updateApplication/';
export const serviceName = liveIp + 'service-info';
export const pendingList = liveIp + 'application/pending-approval-list';
export const specificApplication = liveIp + 'application/';
export const schedules = liveIp + 'schedule';
export const roleFeatureTreeListRought = liveIp + 'role/feature/assign';
export const mainMemberUpdate = liveIp + 'application/memberUpdate';
export const doptorDetails = liveIp + 'master/data/doptorDetails';
export const userData = liveIp + 'user';
//Use for reverse main tran data show
export const reverseRequestInfo = liveIp + 'transaction/reverse-requst-info';
// Product Nature Wise Member Account
export const productWiseAccount = liveIp + 'samity/productWiseAccount';

// from coop api data
export const memberFromCoop = coopIp + 'member-info';
export const coopSamityRemove = coopIp + 'samity-info/used-for-loan/';
export const employeeRecord = liveIp + 'master/data/employeeRecord?officeId=';
export const designationName = liveIp + 'master-data/approval/employee-record?office=';
export const aplicationDetailRoute = liveIp + 'application/user/application/allList';
export const deskId = liveIp + 'master/employee/officeEmployee';
export const serviceChargeRoute = liveIp + 'service-charge';
export const sanctionHelper = liveIp + 'sanction/message';
export const senctionDoc = liveIp + 'sanction/documentType';
export const userRoute = liveIp + 'master/project/userByDoptor';
export const assignProjectRoute = liveIp + 'application/projectAssign';
export const allProjectRoute = liveIp + 'master/project/projectByOffice';
export const projectAssignPostRoute = liveIp + 'application/projectAssign';

//report
export const samityReportGet = liveIp + 'report?isPagination=false&formName=';
export const officeByUserToken = liveIp + 'master/data/officeInfo?officeFromToken=true';
export const samityByOffice = liveIp + 'samity?isPagination=false&officeId=';
export const customerAccountInfo = liveIp + 'samity/customerAccountInfo';

export const getAllSamity = liveIp + 'samity';
export const getMemberBySamity = liveIp + 'samity/mainMember?page=1&limit=1000&samityId=';
export const officeTypeRoute = liveIp + 'master/data/officeOrigin';
export const officeRoute = liveIp + 'master/data/officeInfo';
export const employeeRecordByOffice = liveIp + 'master/data/employeeRecord';
export const memberByOffice = liveIp + 'master/data/facilitator/';
export const fieldOfficerApplication = liveIp + 'application/fieldOfficer';
export const subGlApplication = liveIp + 'application/subGl';
export const loanDetailsRoute = liveIp + 'samity/customerLoanInfo';
export const dueLoanAmountInfo = liveIp + 'samity/customer/due-loan-amount-info';
export const appliedLoanMember = liveIp + 'samity/loanMembers';
export const bankInfoRoute = liveIp + 'master/data/bankInfo';
export const loanLimitRoute = liveIp + 'user-limit';
export const subGlDataRoute = liveIp + 'ledger/subGlData';
export const glListRoute = liveIp + 'accounts/ledger/getGlList';
export const sectorList = liveIp + 'product/serCrgSegList';
export const allNotificationRoute = liveIp + 'notification/component/user';
export const dataSyncGeoRoute = liveIp + 'geo-code-sync';
export const ssoIpRoute = liveIp + 'user/signon/';
export const dayOpenCloseRoute = liveIp + 'day-open-close';
export const createGl = liveIp + 'ledger/createGl';
export const updateGl = liveIp + 'ledger/updateGl/';
export const createSavingsProduct = liveIp + 'product/createSavingsProduct';
export const projectWiseProducts = liveIp + 'product/projectWiseProduct';
export const updateSavingsProduct = liveIp + 'product/updateSavingsProduct/';
export const allHolidayTypes = liveIp + 'holiday-setup/allHolidayTypes';
export const createHoliday = liveIp + 'holiday-setup/createHolidays';
export const allHolidayInfoOfADoptor = liveIp + 'holiday-setup/allHolidayInfoOfADoptor';
export const updateHoliday = liveIp + 'holiday-setup/updateHoliday/';
export const documentRought = liveIp + 'master/serviceWiseDocuments';
export const processGetByTypeApi = liveIp + 'process/';

///Data Sync Api /////
export const milkvitaRoute = liveIp + 'doptor-sync/milkvitaSamity/loan';
export const milkvitaMember = liveIp + 'doptor-sync/milkvitaMember/loan';

/////// Api from Dash board /////////

export const milkVitaSamityGetRought = dashBoardIp + 'doptors/';
export const milkVitaMemberGetRought = dashBoardIp + 'associations/';

////////// surver From DashBoard //////////

//////////////////////Login Related Api/////////////////
export const LoanLoginAPI = liveIp + `user/login`;
export const Login = liveIp + `role/auth/login`;
export const ApproveOrRejectRole = liveIp + `role/approval/`;
//  export const userSignon = liveIp + "user/signon";

/////////////////////Feature related Api////////////////
export const GetFeature = liveIp + `role/feature`;
export const DeleteFeature = liveIp + `role/feature/`;
export const RoleCreate = liveIp + `role/`;

/////////////////////User related Api////////////////
export const approveUser = liveIp + 'user/approve/';
export const GetAllUser = liveIp + `master/project/userByDoptor/`;

////////////////////Workflow Api/////////////////////
export const finalApproval = liveIp + `application-approval`;

//samity-migration
export const dpsFdrMigrationMemberCheckUrl = liveIp + `migration/dpsFdr`;
export const samityMigration = liveIp + `migration/samity`;
export const migratedSamityLoanInfo = liveIp + `migration/loan-info-from-application/`;
export const getUnionByUpazilaId = liveIp + `master/zone/union?address=1`;
export const balanceMigration = liveIp + `application/balanceMigration`;
export const approvedMigratedSamity = liveIp + `migration/approve-samity`;
export const reportFromDatabase = liveIp + 'reports';
export const serviceRules = liveIp + 'service-info?id=';

// loan Dashboard
export const loanDashboard = liveIp + 'dashboard';
export const getAllDoptor = liveIp + 'master/doptor';

//////////DPS///////////
export const getInstallmentAmount = liveIp + 'dps/installmentAmount';
export const getsevingsProductDetails = liveIp + 'dps/interest-details';
export const getSingleDpsAccountDetails = liveIp + 'dps/dps-accounts-details';

/////////FDR///////////
export const getSingleFdrAccountDetails = liveIp + 'fdr/fdr-accounts-details';
export const customerLoanInfoUrl = liveIp + 'migration/loan-info-from-application-of-a-customer/';
export const fronEndErrorLogUrl = liveIp + 'activity/front-end-error-log/';
