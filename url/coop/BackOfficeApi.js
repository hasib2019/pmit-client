import { liveIp as coopIp } from '../../config/IpAddress';
const liveIp = coopIp + 'coop/';
export const userLoginApi = liveIp + `user/login`;
// approval part
export const finalApproval = liveIp + `application-approval`;
export const getAppWorkflow = liveIp + `application-approval/`;

// doc maping setup
export const getAllDocTypeApi = liveIp + `samity-doc-type/all`;
export const createDocMapping = liveIp + `doc-mapping`;

//office Head Select
export const officeHeadSelectApi = liveIp + `office-head-select`;

// samity suthorization
export const getSamityDataByUser = liveIp + `samity-info/userOffice`;
export const getSamityDataByUserLevelCategory = liveIp + `samity-info/userOffice?samityLevel=`;
export const getAuthorizer = liveIp + `setup/samity-authorizer/`;

// user report
export const DocumentDownloadUser = liveIp + `samity-info/filter?dataFrom=all&isPagination=false&`;
