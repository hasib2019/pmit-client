// const baseUrl = (reportName) => {
//   for (const element of urlBaseOnReport) {
//     if (reportName == element.reportName) {
//       return element.url;
//     }
//   }
//   return '';
// };

export const urlGenerator = (selectedValue, selectTedReportList, componentReportBy) => {
  let url = ``;
  if (selectTedReportList.parameter.length === selectTedReportList.jasparParameter.length) {
    for (const [index, element] of selectTedReportList.parameter.entries()) {
      url =
        index == 0
          ? url + `${selectTedReportList.jasparParameter[index]}=${selectedValue[convertValue(element)]}`
          : url + `&${selectTedReportList.jasparParameter[index]}=${selectedValue[convertValue(element)]}`;
    }
  }

  return componentReportBy + selectTedReportList.reportJasperName + `?id=${Buffer.from(url).toString('base64')}`;
};

function convertValue(name) {
  if (name == 'samity') {
    return 'samityId';
  }
  if (name == 'serviceInfo') {
    return 'serviceId';
  }
  if (name == 'office') {
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
  if (name == 'glType') {
    return 'glType';
  }
  if (name == 'title') {
    return 'title';
  }
}
