import { useCallback, useState } from 'react';
import Exceljs from 'exceljs';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { isRichValue, richToString } from 'service/common';
import { fetchItemsForExcel } from 'features/inventory/storeInWithMigration/storeInMigrationApi';
import { fetchStore } from 'features/inventory/item-store/item-store-api';
// import { useSelector } from 'react-redux';
// import { boolean } from 'joi';

const useModalFunctionalitiesAndValues = ({ setFieldValue }) => {
  // const { allStores } = useSelector((state) => state.itemStore);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [formikKey, setFormikKey] = useState(1);
  // const [data, setData] = useState([]);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const handleChangeFile = ({ target: { files } }) => {
    const file = files[0];

    setFile(file);
  };

  const headerMapping = {
    'গ্রুপের নাম': 'groupName',
    'ক্যাটেগরির নাম': 'categoryName',
    'আইটেমের নাম': 'itemName',
    'আইটেমের আইডি': 'itemId',
    'ইউনিটের নাম': 'unitName',
    'সম্পদের ধরনের কোড': 'assetTypeCode',
    'সম্পদের ধরন': 'assetTypeNameBn',
    'স্থায়ী সম্পদ': 'isAsset',
    পরিমান: 'quantity',
    'Store Name': 'storeName',
  };

  const generateRandomKey = () => {
    let x = Math.floor(Math.random() * 10000 + 1);
    return x;
  };
  const handleExcelToJson = useCallback(async (file) => {
    const workbook = new Exceljs.Workbook();

    await workbook.xlsx.load(file);

    const itemWorkSheet = workbook.getWorksheet(1);
    let itemArray = [];

    itemWorkSheet.eachRow(function (row) {
      const stringValues = row.values.map((v) => (isRichValue(v) ? richToString(v) : v));
      itemArray.push(stringValues);
    });

    const [[, ...itemKeys], ...rest] = itemArray;

    const itemObj = rest.map(([, ...s]) => {
      return s.reduce(function (p, c, i) {
        p[headerMapping[itemKeys[i]]] = c;
        return p;
      }, {});
    });

    const store = await fetchStore();
    const storeInfos = store?.data;

    setFieldValue(
      'excelEntryData',
      itemObj
        .map((item) => {
          return {
            groupName: item.groupName,
            categoryName: item.categoryName,
            itemName: item.itemName,
            itemId: item.itemId,
            unitName: item.unitName,
            quantity: item.quantity,
            storeName: storeInfos?.length === 1 ? storeInfos[0] : null,
            goodsType: item.assetTypeCode,
            isAsset: item?.isAsset === 'true' ? true : false,
          };
        })
        .filter((data) => {
          return data.quantity;
        }),
    );
    // setData(
    //   itemObj.map((item) => {
    //     return {
    //       groupName: item.groupName,
    //       categoryName: item.categoryName,
    //       itemName: item.itemName,
    //       itemId: item.itemId,
    //       unitName: item.mouName,
    //       quantity: item.quantity,
    //       storeName: getStoreObj(item.storeName),
    //     };
    //   })
    // );
    setFormikKey(generateRandomKey());
    setOpen(false);
  }, []);
  const createWorkbook = useCallback(async () => {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('sore_item_migration');

    worksheet.columns = [
      { header: 'গ্রুপের নাম', key: 'groupName', width: 10 },
      { header: 'ক্যাটেগরির নাম', key: 'categoryName', width: 10 },
      { header: 'আইটেমের নাম', key: 'itemName', width: 32 },
      { header: 'আইটেমের আইডি', key: 'itemId', width: 12 },
      { header: 'ইউনিটের নাম', key: 'unitName', width: 12 },
      {
        header: 'সম্পদের ধরনের কোড',
        key: 'assetTypeCode',
        width: 12,
        editable: false,
      },
      {
        header: 'সম্পদের ধরন',
        key: 'assetTypeNameBn',
        width: 20,
        editable: false,
      },
      {
        header: 'স্থায়ী সম্পদ',
        key: 'isAsset',
        width: 20,
        editable: false,
      },
      {
        header: 'পরিমান',
        key: 'quantity',
        width: 12,
      },
    ];
    const excelItems = await fetchItemsForExcel();
    const excelItemsData = excelItems.data.map((item) => {
      return {
        groupName: item.groupName,
        categoryName: item.categoryName,
        itemName: item.itemName,
        itemId: item.itemId,
        unitName: item.mouName,
        quantity: '',
        assetTypeCode: item.assetTypeCode,
        isAsset: item.isAsset ? 'true' : 'false',
        assetTypeNameBn: item.assetTypeNameBn,
      };
    });

    worksheet.addRows(excelItemsData);

    await workbook.xlsx.writeBuffer().then(function (data) {
      var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'storeItem.xlsx');
    });
  }, []);

  return {
    // data,
    open,
    file,
    formikKey,
    handleClickOpen,
    handleClose,
    handleChangeFile,
    handleExcelToJson,
    createWorkbook,
  };
};
export default useModalFunctionalitiesAndValues;
