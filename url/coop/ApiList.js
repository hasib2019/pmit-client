import { liveIp as coopIp } from '../../config/IpAddress';
const liveIp = coopIp + 'coop/';
export const Login = liveIp + `role/auth/login`;
export const Feature = liveIp + 'role/feature';
export const SamityType = liveIp + 'samity-type?isPagination=false';
export const committeeRole = liveIp + 'committee-role';
export const committeeMember = liveIp + 'committee-member';
export const committeeMemberDeactive = '';
export const samityCorrection1 = liveIp + 'application';
export const samityCorrection2 = liveIp + 'correction/samity-correction/';
export const insertSamityCorrection = liveIp + 'application/samity-correction-out-bylaws/';
export const updateSamityCorrection = liveIp + 'application/samity-correction-out-bylaws/';
export const getSamityCorrection = liveIp + 'application?type=samityCorrectionOutBylaws&samityId=';

liveIp + 'committee-info/member-deactivation/';
export const committeeAddMember = liveIp + 'committee-info/add-member';
export const committeeMemberList = liveIp + 'committee-info/members?samityId=';
export const committeeApp = liveIp + 'application/committee-request';
export const AllDocumentType = liveIp + 'init-document-type';
export const membeerInfoComDeg = liveIp + 'member-info/committee-designation';
export const GlAcList = liveIp + 'gl-list';
export const GlacList = liveIp + 'gl-list?parentChild=C&isPagination=false&glacType=';
export const jobTypeList = liveIp + 'occupation';
export const memberFinancialData = liveIp + 'member-financial-info/';
export const MemberArea = liveIp + 'member-area';
export const WorkingArea = liveIp + 'working-area';
export const particularMembersInfo = liveIp + 'initial-member-info';
export const allDataByCitizen = liveIp + 'samity-reg-steps/all-data-by-citizen';

// single sign on- SSO
export const citizenSignon = coopIp + 'citizen/signon';
export const userSignon = liveIp + 'user/signon';

// committee
export const committeeApply = liveIp + 'application/committee-request';

// refactroing api
export const enterprisingOrg = liveIp + 'master-data/enterprising-org?isPagination=false';
export const enterprising = liveIp + 'master-data/enterprising-org?isPagination=false';
export const projectList = liveIp + 'master-data/';
export const masterData = liveIp + 'master-data/';
export const geoData = liveIp + 'master-data/geo-code?isPagination=false&type=';
export const geoDataRedux = 'master-data/geo-code?isPagination=false&type=';

// uddogi sonostha
export const enterprisingApi = liveIp + 'master-data/enterprising-org?isPagination=false';

// citizen login
export const citizenLogin = liveIp + 'citizen/login';
export const samityStepReg = liveIp + 'samity-reg-steps';

// member registration part init
export const allMemberInfo = liveIp + 'init-member-info';
export const allMenuItem = liveIp + 'citizen-role-feature';
export const isRequiredMemberPass = liveIp + 'init-member-info/isRequiredMemberPass/';
export const dynamicImage = liveIp + 'init-member-info/required-document/';
export const approvedDynamicImage = liveIp + 'member-info/required-document/';

// samity correction paert
export const ConfirmCorrection = liveIp + 'application/confirm-correction/';

//  member correction part
export const ApprovalSamityMemberList = liveIp + 'member-info/';
export const InsertMemCorrectionData = liveIp + 'application/member-information-correction';
export const memberDeactivation = liveIp + 'member-info/member-deactivation/';
export const GetCorrectonMembrData = liveIp + 'application?type=memberInfoCorrection&samityId=';
export const memberInfoCorrectionRequest = liveIp + 'application/application-member-info-correction/';
export const cenNatSamityMemberCor = liveIp + 'member-info/addable-members/';
// member correction working area api
export const CoopWorkingArea = liveIp + 'coop-working-area/';
// byLaws- eamendmnt api
export const byLawsAmendmentApi = liveIp + 'application/bylaws-amendment';
export const byLawsAmendmentGetApiRedux = 'application?type=bylawsAmendment&samityId=';
export const byLawsAmendmentGetApi = liveIp + 'application?type=bylawsAmendment&samityId=';
// audit - accounts api
export const auditAccountApi = liveIp + 'application/audit-accounts';
export const auditAccountGetApi = liveIp + 'application?type=auditAccounts&samityId=';
// committeeApp part
export const committeeInfo = liveIp + 'init-committee-registration';
export const getCommiteeData = liveIp + 'initial-committee-registration/';
export const memberFinInfo = liveIp + 'init-member-financial-info';
export const SamityGlTrans = liveIp + 'init-samity-gl-trans';
export const imcomeExpData = liveIp + 'init-samity-gl-trans?isPagination=false&isIeBudget=E&samityId=';
export const BugetYear = liveIp + 'financial-year-list?isPagination=false';
export const imcomeExpBudgetData = liveIp + 'init-samity-gl-trans?isPagination=false&isIeBudget=B&samityId=';
export const samityDocument = liveIp + 'init-samity-document?isPagination=false&';
export const CoopRegApi = liveIp + 'init-samity-registration';
export const SamityMigration = liveIp + 'application/samity-migration/';
export const CoopRegSubmitApi = liveIp + 'application/samity-migration';
export const SamityMigrationCorrection = liveIp + 'application/samity-migration-correction';
export const SamityMigrationCorrectionApplicationData = liveIp + 'application?type=migrationCorrectionApplicationData&samityId=';

export const EmployeeEntrySubmitApi = liveIp + 'application/employee-information';
export const AbasayanSubmitApi = liveIp + 'application/abasayan';
export const InvestmentSubmitApi = liveIp + 'application/investment';
export const AuditSubmitApi = liveIp + 'application/audit';
export const FeeCollectionSubmitApi = liveIp + 'application/feeCollection';
////////////////////////// central national samity data ////////////////
export const CentralNationalSamityData = liveIp + 'init-member-info/';
export const CenNatSamityReg = liveIp + 'init-member-info/central';
///////////////////////////////////////////////////////////////////////////
//////////////// insert working area and member area api///////////////////
export const MemberAreaInsert = liveIp + 'member-area';
export const WorkingAreaInsert = liveIp + 'working-area';

//////////////////////////////////////////////////////////////////////////
export const SamityRegistrationReport = liveIp + 'init-samity-registration/samity-registration-report/';
export const ApplicationSubmit = liveIp + 'application/samity-final-submission/';
export const PendingCoopList = liveIp + 'samity-reg-steps/all-data-by-citizen?status=P';
export const ApproveSamityReportApi = liveIp + `samity-info/samity-registration-report/`;
// ApproveSamityReportApi redux
export const ApproveSamityReportRedux = `samity-info/samity-registration-report/`;
// name clearance
export const getOfficeName = liveIp + 'master-data/office-info';
export const getNamelearance = liveIp + 'name-clearance';
export const Nameclearance = liveIp + 'application/name-clearance';
export const NameclearanceArchive = liveIp + 'application/archive/';
export const NameclearanceCitizen = liveIp + "application/type/name-clearance-citizen?data->>'samity_level'=";
export const NameclearanceList = liveIp + 'application/type/name-clearance-dashboard';
// export const NameclearanceList = liveIp + "application/pending-approval-list/citizen";
// get all approved samity
export const approvedSamityList = liveIp + 'samity-info/userOffice';
export const getByUserAudit = liveIp + 'samity-info/userOfficeAudit';

// approval office
export const officeName = liveIp + 'master-data/approval/office-origin-unit';
export const ownOfficeNames = liveIp + 'master-data/office-origin?userOfficeOrigin=true';
export const ownOfficeNames2 = 'master-data/office-origin?userOfficeOrigin=true';
export const officeNamesUrl = liveIp + 'master-data/office-origin?isPagination=false&userOrigin=true';
export const officeNamesUrl2 = 'master-data/office-origin?isPagination=false&userOrigin=true';
export const ownOfficeUrl = liveIp + 'master-data/office-info?userOffice=true&isPagination=false';
export const ownOfficeUrl2 = 'master-data/office-info?userOffice=true&isPagination=false';
export const branchName = liveIp + 'master-data/office-info?isPagination=false&layerId=';
export const branchName2 = 'master-data/office-info?isPagination=false&layerId=';
export const designationName = liveIp + 'master-data/approval/employee-record?office=';
export const designationName2 = 'master-data/approval/employee-record?office=';
export const designationNameCorrection = liveIp + 'application-approval/need-for-correction/';
export const designationNameCorrection2 = 'application-approval/need-for-correction/';
export const serviceName = liveIp + 'service-info?isPagination=false';
export const serviceName2 = 'service-info?isPagination=false';
export const serviceNameApi = liveIp + 'service-info?isPagination=false';
export const serviceRules = liveIp + 'service-info?id='; //single data fetch and fetaureDetails send
export const pendingList = liveIp + 'application/type/pending-approval-list';
export const pendingListByService = liveIp + 'application/pending-list/';
export const pendingListServiceId = liveIp + 'application/type/pending-approval-list-user';

export const divisionSamiteeSummary = liveIp + 'application/division-samitee/';

// get Application
export const samityRegister = liveIp + 'application/samity-registration';
export const samityTypeData = liveIp + 'samity-doc-type?';
// detelete application
export const deleteApplication = liveIp + 'application/';
export const ApplicationEdit = liveIp + 'application/temp-samity-edit/';

// ******************* Dashboard *****************
export const dashboardData = liveIp + `dashboard`;
export const dashboardSamityInfo = liveIp + `dashboard/samity-info`;

// get manual samity report
export const applicationGetById = liveIp + 'application?id=';
export const applicationGetByService = liveIp + 'application?serviceid=';

// Authorized-person API List
export const aPSamity = liveIp + 'samity-info/authorized-person-samity';
export const samityInfo = liveIp + 'samity-info/';
export const memberInfoData = liveIp + 'member-info/';

// frontpage  all samity data
export const AllSamityReport = liveIp + 'application/all-data-byCitizen';
export const AllSamityReports = liveIp + 'application/type/all-data-byCitizen';
export const DownloadCer = liveIp + 'samity-info/samity-registration-report/';
export const certificateVerify = liveIp + 'samity-certificate-verify?samityId=';
export const educationalQualifications = liveIp + 'master-data/education-level?isPagination=false';
export const religion = liveIp + 'master-data/religion?isPagination=false';
export const maritalStatusApiUrl = liveIp + 'master-data/marital-status?isPagination=false';

//Employee Management API
export const employeeUpdateApiUrl = liveIp + 'application/employee-information/';
// export const employeeDesignationApiUrl = liveIp + "employee-designation";

// Notification manager
export const notifiationData = coopIp + 'notification/component/';
export const readNotificationData = coopIp + `notification/component/read/`;
//report
export const byLawsReportApi = liveIp + 'report/by-laws/';
export const byLawsInfoReportApi = liveIp + 'report/by-laws-info/';

export const samityReportGet = liveIp + 'report?isPagination=false&formName=';
export const processGet = liveIp + 'process?isPagination=false&processName=';
export const processCreate = liveIp + 'process';
export const districtOfficeByuser = liveIp + 'master-data/districtOffice';
export const upozilaOffice = liveIp + 'master-data/upazilaOffice';
export const allDoptor = liveIp + 'master-data/doptor/list';
export const officeLayer = liveIp + 'master-data/office/layer-list'; //"master/data/officeLayer";
export const childOffice = liveIp + 'master-data/child/office-list'; //"master/data/childOfficeList";
export const samityByOffice = liveIp + 'samity-info?officeId=';
export const samityByAudit = liveIp + 'samity-info/getSamityByAudit?officeId=';
export const allSamityByAudit = liveIp + 'samity-info/getAllSamityByAudit?officeId=';
export const auditInfoBySamity = liveIp + 'samity-info/getAuditBySamity?samityId=';
export const employeeDesignationGetApiUrl = liveIp + 'employee-designation';
export const employeeDesignationApiUrl = liveIp + 'employee-designation';
export const employeeDesignationUpdatetApiUrl = liveIp + 'employee-designation/';
// export const employeeDesignationGetApiUrl = liveIp + "employee-designation";
export const applicationSamitySummary = liveIp + 'application/samity-registration-summary';
export const samitySummaryReport = liveIp + 'report';

// dashboard samity subscribe
export const samitySubscribe = liveIp + `subscribe/`;

// Registration fee
export const RegFee =
  liveIp + `service-info?serviceNameEnglish=samity_registration&isPagination=false&key=id,serviceRules`;
export const RegFeeSubmit = liveIp + `init-samity-registration/registration-fee/`;
export const employeeInfoGetUrl = liveIp + `employee-information/`;
export const employeeSalaryPostUrl = liveIp + `employee-salary-info`;
export const employeeSalaryGetByYearMonthUrl = liveIp + `employee-salary-info/`;

// Authorization api
export const authorizedRoute = coopIp + 'user/auth/authorization';

//audit
export const auditInfoById = liveIp + 'audit/';
