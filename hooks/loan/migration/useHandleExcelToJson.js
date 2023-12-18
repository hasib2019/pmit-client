import Exceljs, { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { useCallback, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { isRichValue, richToString } from 'service/common';
const useExcelToJsonFunctionalities = () => {
  const [file, setFile] = useState(null);
  const handleChangeFile = useCallback(({ target: { files } }) => {
    const filee = files[0];
    setFile(filee);
  }, []);

  const areTwoArraySame = (array1, array2) => {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }
        return false;
      });
    }
    return false;
  };
  const createWorkbook = useCallback(async (columnsArray, fileName) => {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('loan_migration');
    worksheet.columns = columnsArray;
    //  [
    //   { header: 'Member Code', key: 'customerOldCode', width: 20 },
    //   { header: 'No of Loan', key: 'noOfLoan', width: 12 },
    //   { header: 'Disbursement Date', key: 'disbursementDate', width: 20 },
    //   { header: 'Loan Term(Month)', key: 'loanTermMonth', width: 12 },
    //   { header: 'No of Instalment', key: 'noOfInstallment', width: 12 },
    //   { header: 'Grace Period', key: 'gracePeriod', width: 12 },
    //   { header: 'Disbursement Amount', key: 'disbursementAmount', width: 12 },
    //   { header: 'Total Service charge', key: 'totalServiceCharge', width: 12 },
    //   {
    //     header: 'Paid Principal Amount',
    //     key: 'paidPrincipalAmount',
    //     width: 12,
    //   },
    //   {
    //     header: 'Paid Service Charge Amount',
    //     key: 'paidServiceChargeAmount',
    //     width: 12,
    //   },
    //   { header: 'Penal Charge', key: 'penalCharge', width: 12 },
    // ];

    await workbook.xlsx.writeBuffer().then(function (data) {
      var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, fileName);
    });
  }, []);
  const handleExcelToJson = useCallback(async (headerMapping, file, handleStateAfterConvertingExcel, handleClose) => {
    console.log('headerMapping', headerMapping);
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.load(file);

    const workSheet = workbook.getWorksheet(1);

    let jsonArray = [];

    workSheet?.eachRow(function (row) {
      const stringValues = row.values.map((v) => (isRichValue(v) ? richToString(v) : v));
      jsonArray.push(stringValues);
    });
    console.log('jsonArray', jsonArray);
    const [[, ...jsonKeys], ...rest] = jsonArray;
    const updloadedXlKeysArray = jsonKeys;
    const headerMappingArray = Object.keys(headerMapping);
    console.log('uploadedArrayAndHeaderMappingArray', updloadedXlKeysArray, headerMappingArray);

    const isTwoArraySame = areTwoArraySame(updloadedXlKeysArray, headerMappingArray);

    if (!isTwoArraySame) {
      NotificationManager.error('সঠিক এক্সেল ফাইল আপলোড করুন');
      handleClose();
      return;
    }
    const obj = rest.map(([, ...s]) => {
      return s.reduce(function (p, c, i) {
        p[headerMapping[jsonKeys[i]]] = c;
        return p;
      }, {});
    });
    handleStateAfterConvertingExcel(obj);

    // this.setState({
    //   data: loanInfoObj.map((m) => {
    //     return {
    //       ...m,
    //       productId: this.getProductId(m.productId),
    //       purposeId: this.getPurposeId(m.purposeId),
    //       disbursementDate: m?.disbursementDate
    //         ? moment(m.disbursementDate, 'DD/MM/YYYY').format('DD MMMM YYYY').toString()
    //         : '',
    //     };
    //   }),
    //   open: false,
    // });
  }, []);
  return {
    handleExcelToJson,

    handleChangeFile,
    file,
    createWorkbook,
  };
};
export default useExcelToJsonFunctionalities;
