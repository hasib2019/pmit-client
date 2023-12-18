import { liveIp as coopIp } from '../../config/IpAddress';
const liveIp = coopIp + 'coop/';
export const LoanLoginAPI = liveIp + `user/login`;
export const LoginAPI = liveIp + `role/auth/login`;
export const GetFeature = liveIp + `role/feature`;
export const DeleteFeature = liveIp + `role/feature/`;
export const RoleCreate = liveIp + `role/`;
export const ApproveOrRejectRole = liveIp + `role/approval/`;
export const GetAllMenu = liveIp + `role/feature/roleFeature`;

export const GetAllRole = liveIp + `role/`;
export const GetAllUser = liveIp + `user/`;
export const GetUserRole = liveIp + `user-role`;
export const UserRoleCreate = liveIp + `user-role/`;
export const PutUserRole = liveIp + `user-role/`;
export const roleFeatureTreeListRought = liveIp + 'role/feature/assign';
