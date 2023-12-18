import { liveIp } from 'config/IpAddress';

export const DeleteFeature = liveIp + `role/feature/`;
export const GetFeature = liveIp + `role/feature`;
export const RoleCreate = liveIp + `coop/role/`;
export const roleFeatureTreeListRought = liveIp + 'role/feature/assign';
export const ApproveOrRejectRole = liveIp + `role/approval/`;

console.log({ liveIp });

///Data Sync Api /////
export const doptorSyncApi = liveIp + 'doptor-sync';
export const geoDataSyncApi = liveIp + 'geo-code-sync';
export const roleSyncApi = liveIp + 'role-sync';
export const associationSyncApi = liveIp + 'association-sync';
export const masterDataSyncApi = liveIp + 'master-data-sync';