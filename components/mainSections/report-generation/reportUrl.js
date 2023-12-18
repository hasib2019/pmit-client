export const urlGenerator = (selectedValue, selectTedReportList, componentReportBy) => {
  let url = ``;
  if (selectTedReportList?.parameter.length === selectTedReportList?.jasparParameter.length) {
    for (const [index, element] of selectTedReportList.parameter.entries()) {
      url = url + `&${selectTedReportList.jasparParameter[index]}=${selectedValue[convertValue(element)]}`;
    }
  }
  const base64Data = Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

  return componentReportBy + selectTedReportList.reportJasperName + `?id=${base64Data}`;
};

function convertValue(name) {
  if (name == 'samity') {
    return 'samityId';
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
  if (name == 'accountStatus') {
    return 'accountStatus';
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
  if (name == 'fieldOfficer') {
    return 'fieldOfficerId';
  }
  if (name == 'store') {
    return 'storeId';
  }
  if (name == 'item') {
    return 'itemId';
  }
  if (name == 'disbursementDate') {
    return 'disbursementDate';
  }
  if (name == 'realizationDate') {
    return 'realizationDate';
  }
  if (name == 'tranNum') {
    return 'tranNum';
  }
  if (name == 'employeeId') {
    return 'employeeId';
  }
  if (name == 'isMigrated') {
    return 'isMigrated';
  }
  if (name == 'withServiceCharge') {
    return 'withServiceCharge';
  }
  if (name == 'productId') {
    return 'productId';
  }
}
