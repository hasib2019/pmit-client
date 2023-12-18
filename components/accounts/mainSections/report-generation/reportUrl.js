// import { findIndex } from 'lodash';

import { componentReportBy } from '../../../../url/ReportApi';
// const baseUrl = (reportName) => {
//   for (const element of urlBaseOnReport) {
//     if (reportName == element.reportName) {
//       return element.url;
//     }
//   }
//   return '';
// };

export const urlGenerator = (selectedValue, selectTedReportList) => {
  let url = ``;
  if (selectTedReportList.parameter.length === selectTedReportList.jasparParameter.length) {
    // for (const [index, element] of selectTedReportList.parameter.entries()) {
    //   url =
    //     index == 0
    //       ? url +
    //         `${selectTedReportList.jasparParameter[index]}=${
    //           selectedValue[convertValue(element)]
    //         }`
    //       : url +
    //         `&${selectTedReportList.jasparParameter[index]}=${
    //           selectedValue[convertValue(element)]
    //         }`;
    // }
    for (const [index, element] of selectTedReportList.parameter.entries()) {
      url = url + `&${selectTedReportList.jasparParameter[index]}=${selectedValue[convertValue(element)]}`;
    }
  }

  return componentReportBy + selectTedReportList.reportJasperName + `?id=${Buffer.from(url).toString('base64')}`;
};

function convertValue(name) {
  if (name == 'samity') {
    return 'samityId';
  }
  if (name == 'upazilaOffice') {
    return 'officeId';
  }
  if (name == 'project') {
    return 'projectId';
  }
  if (name == 'member') {
    return 'memberId';
  }
  if (name == 'doptor') {
    return 'doptorId';
  }
  if (name == 'accountId') {
    return 'accountId';
  }
  if (name == 'tranId') {
    return 'tranId';
  }
  if (name == 'date') {
    return 'date';
  }
  if (name == 'userName') {
    return 'userName';
  }
  if (name == 'fromDate') {
    return 'fromDate';
  }
  if (name == 'toDate') {
    return 'toDate';
  }
  if (name == 'glType') {
    return 'glType';
  }
}
