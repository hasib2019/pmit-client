import { localStorageData } from 'service/common';
import { liveIp } from '../config/IpAddress';

const componentName = localStorageData('componentName');
export const componentReportBy = liveIp + 'jasper/' + componentName + '/';
