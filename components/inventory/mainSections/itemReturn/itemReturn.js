// import { Grid, Tooltip, Typography } from '@mui/material';
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { tokenData } from 'service/common';
// import lodash from 'lodash';
// import { LoadingButton } from '@mui/lab';
// import Joi from 'joi-browser';
// import { useSelector, useDispatch } from 'react-redux';
// import { getReturnableItems } from 'features/inventory/itemReturn/item-return-slice';
// import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
// import { bangToEng } from 'service/numberConverter';
// import UseSentForApprovalStateAndFunctionalites from 'components/inventory/hooks/useSentForApprovalFunctionalitiesAndState/useSentForApprovalFunctionalitiesAndState';
// import SentForApprovalComponent from 'components/inventory/utils/SentForApprovalComponent';
// import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
// import { createApplicationWithWorkflow } from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
// import { useErrorBoundary } from 'react-error-boundary';
// import ReturnItemTable from './returnItemTable';
// const regex = /[০-৯.,0-9]$/;
// const ItemRetun = () => {
//   // eslint-disable-next-line no-empty-pattern
//   const {} = UseOwnOfficesLayerAndOfficeObj();
//   const { showBoundary } = useErrorBoundary();
//   const dispatch = useDispatch();
//   const { returnableItems } = useSelector((state) => state.itemReturn);
//   const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
//   const {
//     handlChangeOfficeLayerData,
//     handleChangeOfficeNamesData,
//     handleAdminEmployeeChange,
//     layerObj,
//     officeObj,
//     adminEmployeeObj,
//   } = UseSentForApprovalStateAndFunctionalites(null);
//   const senForApprovalPropsObj = {
//     handlChangeOfficeLayerData,
//     handleChangeOfficeNamesData,
//     handleAdminEmployeeChange,
//     layerObj,
//     officeObj,
//     adminEmployeeObj,
//   };

//   const [userName] = useState(tokenData());
//   const [returnedItems, setReturnedItems] = useState([
//     {
//       itemId: null,
//       itemCode: '',
//       assetType: '',
//       assetTypeName: '',
//       returnedQuantity: '',
//       itemStatus: '',
//     },
//     {
//       itemId: null,
//       itemCode: '',
//       assetType: '',
//       assetTypeName: '',
//       returnedQuantity: '',
//       itemStatus: '',
//     },
//     {
//       itemId: null,
//       itemCode: '',
//       assetType: '',
//       assetTypeName: '',
//       returnedQuantity: '',
//       itemStatus: '',
//     },
//     {
//       itemId: null,
//       itemCode: '',
//       assetType: '',
//       assetTypeName: '',
//       returnedQuantity: '',
//       itemStatus: '',
//     },
//   ]);
//   const [itemOptionsObj, setItemOptionsObj] = useState({});

//   const [formError, setFormError] = useState({});
//   const validationSchema = {
//     returnedItems: Joi.array().items({
//       itemId: Joi.object({
//         fixedItemUseId: Joi.any().optional(),
//         fixedItemId: Joi.any().optional(),
//         itemId: Joi.number().integer().required(),
//         itemName: Joi.any().optional(),
//         goodsType: Joi.any().optional(),
//         displayValue: Joi.any().optional(),
//         assetCode: Joi.any().optional(),
//         isAsset: Joi.any().optional(),
//       })
//         .required()
//         .error(() => {
//           return { message: 'মালামালের নাম নির্বাচন করুন' };
//         }),

//       itemCode: Joi.any().optional(),
//       assetType: Joi.boolean().optional(),
//       assetTypeName: Joi.any().optional(),
//       returnedQuantity: Joi.number()
//         .integer()
//         .min(1)
//         .required()
//         .error(() => {
//           return { message: 'ফেরতের পরিমান প্রদান করুন' };
//         }),
//       itemStatus: Joi.number()
//         .integer()
//         .required()
//         .error(() => {
//           return { message: 'মালামালের অবস্থা নির্বাচন করুন' };
//         }),
//     }),

//     adminEmployeeObj: Joi.object({
//       designationId: Joi.number().required(),
//       designation: Joi.any().optional(),
//       employeeId: Joi.any().optional(),
//       nameBn: Joi.any().optional(),
//     })
//       .required()
//       .error(() => {
//         return { message: 'পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন' };
//       }),
//   };

//   const handleSubmit = (event) => {
//     try {
//       event.preventDefault();
//       const filterdReturnItems = returnedItems?.filter(
//         (item) => item?.itemId?.itemId || item?.returnedQuantity || item?.itemStatus,
//       );
//       const { error } = Joi.validate(
//         {
//           returnedItems: filterdReturnItems,
//           adminEmployeeObj: adminEmployeeObj,
//         },
//         validationSchema,
//         {
//           abortEarly: false,
//         },
//       );

//       let rIndex = [];
//       returnedItems?.map((rItem, index) => {
//         if (rItem?.itemId?.itemId || rItem?.returnedQuantity || rItem?.itemStatus) {
//           rIndex.push(index);
//         }
//       });

//       if (error) {
//         const errorObj = error.details.reduce((finalObj, currentObj, index) => {
//           if (currentObj?.path?.length > 1) {
//             finalObj[`${rIndex[index]}-${currentObj?.path[2]}`] = currentObj?.message;
//           }
//           return finalObj;
//         }, {});

//         error.details.forEach((error) => {
//           if (error?.path?.includes('adminEmployeeObj')) {
//             errorObj['adminEmployeeObj'] = error?.message;
//           }
//         });
//         setFormError(errorObj);

//         return;
//       }
//       dispatch(
//         createApplicationWithWorkflow({
//           data: {
//             returnedItems: filterdReturnItems,
//             userName: userName?.name,
//             designation: userName?.designationNameBn,
//           },
//           nextAppDesignationId: +adminEmployeeObj.designationId,
//           serviceName: 'inventoryItemReturn',
//         }),
//       );
//       setReturnedItems([
//         {
//           itemId: null,
//           itemCode: '',
//           assetType: '',
//           assetTypeName: '',
//           returnedQuantity: '',
//           itemStatus: '',
//         },
//         {
//           itemId: null,
//           itemCode: '',
//           assetType: '',
//           assetTypeName: '',
//           returnedQuantity: '',
//           itemStatus: '',
//         },
//         {
//           itemId: null,
//           itemCode: '',
//           assetType: '',
//           assetTypeName: '',
//           returnedQuantity: '',
//           itemStatus: '',
//         },
//         {
//           itemId: null,
//           itemCode: '',
//           assetType: '',
//           assetTypeName: '',
//           returnedQuantity: '',
//           itemStatus: '',
//         },
//       ]);
//     } catch (error) {
//       showBoundary(error);
//     }
//   };

//   const addNewItemOptionsToItemOptionsObj = (index) => {
//     try {
//       const returnedItemsCopy = lodash.cloneDeep(returnedItems);
//       const returnableItemsCopy = lodash.cloneDeep(returnableItems);
//       const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);

//       const optinosThatAreAlreadySelected = returnedItemsCopy?.map((returnedItem) => {
//         if (returnedItem?.assetType === true) {
//           return returnableItemsCopy?.find((returnableItem) => returnableItem?.assetCode === returnedItem?.itemCode);
//         } else {
//           return returnableItemsCopy?.find(
//             (returnableItem) => +returnableItem?.itemId === +returnedItem?.itemId?.itemId,
//           );
//         }
//       });

//       const fixedItemUseIdsToRemove = optinosThatAreAlreadySelected.map((item) => item?.fixedItemUseId);

//       // Filter out elements from the first array that have matching fixedItemUseId
//       const filteredArray = returnableItemsCopy.filter(
//         (item) => !fixedItemUseIdsToRemove.includes(item.fixedItemUseId),
//       );

//       itemOptionsObjCopy[index + 1] = filteredArray;
//       setItemOptionsObj(itemOptionsObjCopy);
//     } catch (error) {
//       showBoundary(error);
//     }
//   };

//   const filterReturnableItems = (itemId, assetCode, arrayToBeFiltered) => {
//     try {
//       return arrayToBeFiltered?.filter((elm) => {
//         if (assetCode && elm?.assetCode) {
//           return elm?.assetCode !== assetCode;
//         } else {
//           return elm?.itemId != itemId;
//         }
//       });
//     } catch (error) {
//       showBoundary(error);
//     }
//   };
//   const updateItemOptionsObj = (index, itemId, assetCode, value) => {
//     try {
//       const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);
//       for (let key in itemOptionsObjCopy) {
//         if (key != index) {
//           const filteredItems = filterReturnableItems(itemId, assetCode, itemOptionsObjCopy[key], value);
//           itemOptionsObjCopy[key] = filteredItems;
//           if (
//             assetCode &&
//             returnedItems[index]?.itemCode !== '' &&
//             returnedItems[index]?.itemCode?.toString() !== assetCode?.toString()
//           ) {
//             const founObj = returnableItems?.find((item) => item?.assetCode === returnedItems[index]?.itemCode);
//             itemOptionsObjCopy[key] = [...itemOptionsObjCopy[key], founObj];
//           } else if (
//             !assetCode &&
//             returnedItems[index]?.itemId?.itemId !== null &&
//             returnedItems[index]?.itemId?.itemId != itemId
//           ) {
//             const founObj = returnableItems?.find((item) => item?.itemId === returnedItems[index]?.itemId?.itemId);
//             itemOptionsObjCopy[key] = [...itemOptionsObjCopy[key], founObj];
//           }
//         }
//       }
//       setItemOptionsObj(itemOptionsObjCopy);
//     } catch (error) {
//       showBoundary(error);
//     }
//   };
//   const removeRow = useCallback(
//     (index) => {
//       try {
//         const selectedObj = returnedItems[index];
//         if (selectedObj?.itemId?.itemId) {
//           const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);
//           let founObj;
//           if (+selectedObj?.assetType === true) {
//             founObj = returnableItems?.find((item) => item?.assetType === returnedItems[index]?.assetType);
//           } else {
//             founObj = returnableItems?.find((item) => item?.itemId === returnedItems[index]?.itemId?.itemId);
//           }

//           delete itemOptionsObjCopy[index];
//           for (let key in itemOptionsObj) {
//             if (key > index) {
//               itemOptionsObjCopy[key - 1] = [...itemOptionsObj[key], founObj];
//             } else {
//               itemOptionsObjCopy[key] = [...itemOptionsObj[key], founObj];
//             }
//           }
//           setItemOptionsObj(itemOptionsObjCopy);
//           const tempArray = lodash.cloneDeep(returnedItems);
//           tempArray.splice(index, 1);

//           setReturnedItems(tempArray);
//         } else {
//           const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);
//           delete itemOptionsObjCopy[index];
//           setItemOptionsObj(itemOptionsObjCopy);
//           const tempArray = lodash.cloneDeep(returnedItems);
//           tempArray.splice(index, 1);

//           setReturnedItems(tempArray);
//         }
//       } catch (error) {
//         showBoundary(error);
//       }
//     },
//     [returnedItems],
//   );
//   const handleChandeForItem = useCallback(
//     (e, value, index) => {
//       try {
//         const returnableItemsCopy = lodash.cloneDeep(returnedItems);
//         if (value) {
//           returnableItemsCopy[index] = {
//             ...returnableItemsCopy[index],
//             itemId: value,
//             ...(value.isAsset === true && {
//               itemCode: value.assetCode,
//               returnedQuantity: 1,
//             }),
//             assetType: value.isAsset,
//             assetTypeName: value.displayValue,
//           };

//           setFormError({
//             ...formError,
//             [`${index}-itemId`]: '',
//           });
//         }
//         updateItemOptionsObj(index, value?.itemId, value?.assetCode, value);
//         setReturnedItems(returnableItemsCopy);
//       } catch (error) {
//         showBoundary(error);
//       }
//     },
//     [returnedItems],
//   );
//   const handleChangeForReturnedQuantity = useCallback(
//     (e, index) => {
//       console.log('handleChangeForReturnedQuantityIsCalled');
//       try {
//         const { value } = e.target;
//         if (regex.test(value) || value == '') {
//           const engValue = bangToEng(value);
//           const returnableItemsCopy = lodash.cloneDeep(returnedItems);
//           returnableItemsCopy[index] = {
//             ...returnableItemsCopy[index],
//             returnedQuantity: engValue,
//           };
//           if (+engValue) {
//             setFormError({
//               ...formError,
//               [`${index}-returnedQuantity`]: '',
//             });
//           }
//           setReturnedItems(returnableItemsCopy);
//         }
//       } catch (error) {
//         showBoundary(error);
//       }
//     },
//     [returnedItems],
//   );
//   const handleChangeForItemStatus = useCallback((e, index) => {
//     try {
//       const { value } = e.target;
//       const returnableItemsCopy = lodash.cloneDeep(returnedItems);
//       returnableItemsCopy[index] = {
//         ...returnableItemsCopy[index],
//         itemStatus: +value,
//       };
//       setReturnedItems(returnableItemsCopy);
//       setFormError({
//         ...formError,
//         [`${index}-itemStatus`]: '',
//       });
//     } catch (error) {
//       showBoundary(error);
//     }
//   }, []);
//   const onClickAddButton = useCallback(
//     (index) => {
//       try {
//         addNewItemOptionsToItemOptionsObj(index);
//         const tempArray = lodash.cloneDeep(returnedItems);

//         tempArray.push({
//           itemId: null,
//           itemCode: '',
//           assetType: '',
//           assetTypeName: '',
//           returnedQuantity: '',
//           itemStatus: '',
//         });
//         setReturnedItems(tempArray);
//       } catch (error) {
//         showBoundary(error);
//       }
//     },
//     [returnedItems],
//   );
//   useEffect(() => {
//     dispatch(getReturnableItems());
//     dispatch(getCodeMasterValue('AST'));
//     return () => {
//       dispatch(emptyCodeMasterTypes());
//     };
//   }, []);
//   useEffect(() => {
//     try {
//       const objectLength = Object.values(itemOptionsObj)?.length;
//       if (objectLength === 0 && returnableItems?.length > 0) {
//         let itemOptionsObjCopy = {};
//         for (let i = 0; i < returnedItems?.length; i++) {
//           itemOptionsObjCopy[i] = returnableItems;
//         }

//         setItemOptionsObj(itemOptionsObjCopy);
//       }
//     } catch (error) {
//       showBoundary(error);
//     }
//   }, [returnableItems?.length]);
//   // const memoizedReturnedItems = useMemo(() => returnedItems, [returnableItems]);
//   // const memoizedItmeOptionsObj = useMemo(() => itemOptionsObj, [itemOptionsObj]);
//   const memoizedCodeMasterTypes = useMemo(() => codeMasterTypes, [codeMasterTypes]);

//   return (
//     <Grid container spacing={3}>
//       <Grid item lg={4} md={4} xs={12}>
//         <div style={{ dispaly: 'flex', justifyContent: 'space-around' }}>
//           <Typography variant="h7" fontWeight="bold">
//             নাম :
//           </Typography>
//           <Typography variant="h7" style={{ marginLeft: '5px' }}>{`${userName?.name}`}</Typography>
//         </div>
//       </Grid>
//       <Grid item lg={8} md={8} xs={12}>
//         <div style={{ dispaly: 'flex', justifyContent: 'space-around' }}>
//           <Typography variant="h7" fontWeight="bold">
//             পদবী :
//           </Typography>
//           <Typography variant="h7" style={{ marginLeft: '5px' }}>
//             {userName?.designationNameBn}
//           </Typography>
//         </div>
//       </Grid>
//       <ReturnItemTable
//         returnedItems={returnedItems}
//         itemOptionsObj={itemOptionsObj}
//         handleChandeForItem={handleChandeForItem}
//         formError={formError}
//         handleChangeForReturnedQuantity={handleChangeForReturnedQuantity}
//         handleChangeForItemStatus={handleChangeForItemStatus}
//         codeMasterTypes={memoizedCodeMasterTypes}
//         removeRow={removeRow}
//         onClickAddButton={onClickAddButton}
//         subHeadingTitle="স্থায়ী সম্পদ সমূহের বিবরণ"
//       />
//       <Grid item md={12} lg={12} xs={12}>
//         <SentForApprovalComponent {...senForApprovalPropsObj} formError={formError} />
//       </Grid>
//       <Grid container className="btn-container">
//         <Tooltip title="সংরক্ষন করুন">
//           <LoadingButton variant="contained" className="btn btn-save" loadingPosition="end" onClick={handleSubmit}>
//             সংরক্ষণ করুন
//           </LoadingButton>
//         </Tooltip>
//       </Grid>
//     </Grid>
//   );
// };
// export default ItemRetun;
import {
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  Autocomplete,
  TextField,
  Select,
  Tooltip,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import { tokenData } from 'service/common';
import lodash from 'lodash';
import { LoadingButton } from '@mui/lab';
import Joi from 'joi-browser';
import { useSelector, useDispatch } from 'react-redux';
import { getReturnableItems } from 'features/inventory/itemReturn/item-return-slice';
import { emptyCodeMasterTypes, getCodeMasterValue } from 'features/inventory/item/itemSlice';
import { bangToEng, engToBang } from 'service/numberConverter';
import UseSentForApprovalStateAndFunctionalites from 'components/inventory/hooks/useSentForApprovalFunctionalitiesAndState/useSentForApprovalFunctionalitiesAndState';
import SentForApprovalComponent from 'components/inventory/utils/SentForApprovalComponent';
import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
import { createApplicationWithWorkflow } from 'features/inventory/storeInWithMigration/storeInMigrationSlice';
import { useErrorBoundary } from 'react-error-boundary';
const regex = /[০-৯.,0-9]$/;
const ItemRetun = () => {
  // eslint-disable-next-line no-empty-pattern
  const {} = UseOwnOfficesLayerAndOfficeObj();
  const { showBoundary } = useErrorBoundary();
  const dispatch = useDispatch();
  const { returnableItems } = useSelector((state) => state.itemReturn);
  const { codeMasterTypes } = useSelector((state) => state.itemOrProduct);
  const {
    handlChangeOfficeLayerData,
    handleChangeOfficeNamesData,
    handleAdminEmployeeChange,
    layerObj,
    officeObj,
    adminEmployeeObj,
  } = UseSentForApprovalStateAndFunctionalites(null);
  const senForApprovalPropsObj = {
    handlChangeOfficeLayerData,
    handleChangeOfficeNamesData,
    handleAdminEmployeeChange,
    layerObj,
    officeObj,
    adminEmployeeObj,
  };

  const [userName] = useState(tokenData());
  const [returnedItems, setReturnedItems] = useState([
    {
      itemId: null,
      itemCode: '',
      assetType: '',
      assetTypeName: '',
      returnedQuantity: '',
      itemStatus: '',
    },
    {
      itemId: null,
      itemCode: '',
      assetType: '',
      assetTypeName: '',
      returnedQuantity: '',
      itemStatus: '',
    },
    {
      itemId: null,
      itemCode: '',
      assetType: '',
      assetTypeName: '',
      returnedQuantity: '',
      itemStatus: '',
    },
    {
      itemId: null,
      itemCode: '',
      assetType: '',
      assetTypeName: '',
      returnedQuantity: '',
      itemStatus: '',
    },
  ]);
  const [itemOptionsObj, setItemOptionsObj] = useState({});

  const [formError, setFormError] = useState({});
  const validationSchema = {
    returnedItems: Joi.array().items({
      itemId: Joi.object({
        fixedItemUseId: Joi.any().optional(),
        fixedItemId: Joi.any().optional(),
        itemId: Joi.number().integer().required(),
        itemName: Joi.any().optional(),
        goodsType: Joi.any().optional(),
        displayValue: Joi.any().optional(),
        assetCode: Joi.any().optional(),
        isAsset: Joi.any().optional(),
      })
        .required()
        .error(() => {
          return { message: 'মালামালের নাম নির্বাচন করুন' };
        }),

      itemCode: Joi.any().optional(),
      assetType: Joi.boolean().optional(),
      assetTypeName: Joi.any().optional(),
      returnedQuantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .error(() => {
          return { message: 'ফেরতের পরিমান প্রদান করুন' };
        }),
      itemStatus: Joi.number()
        .integer()
        .required()
        .error(() => {
          return { message: 'মালামালের অবস্থা নির্বাচন করুন' };
        }),
    }),

    adminEmployeeObj: Joi.object({
      designationId: Joi.number().required(),
      designation: Joi.any().optional(),
      employeeId: Joi.any().optional(),
      nameBn: Joi.any().optional(),
    })
      .required()
      .error(() => {
        return { message: 'পর্যবেক্ষক/অনুমোদনকারীর নাম নির্বাচন করুন' };
      }),
  };

  const handleSubmit = (event) => {
    try {
      event.preventDefault();
      const filterdReturnItems = returnedItems?.filter(
        (item) => item?.itemId?.itemId || item?.returnedQuantity || item?.itemStatus,
      );
      const { error } = Joi.validate(
        {
          returnedItems: filterdReturnItems,
          adminEmployeeObj: adminEmployeeObj,
        },
        validationSchema,
        {
          abortEarly: false,
        },
      );

      let rIndex = [];
      returnedItems?.map((rItem, index) => {
        if (rItem?.itemId?.itemId || rItem?.returnedQuantity || rItem?.itemStatus) {
          rIndex.push(index);
        }
      });

      if (error) {
        const errorObj = error.details.reduce((finalObj, currentObj, index) => {
          if (currentObj?.path?.length > 1) {
            finalObj[`${rIndex[index]}-${currentObj?.path[2]}`] = currentObj?.message;
          }
          return finalObj;
        }, {});

        error.details.forEach((error) => {
          if (error?.path?.includes('adminEmployeeObj')) {
            errorObj['adminEmployeeObj'] = error?.message;
          }
        });
        setFormError(errorObj);

        return;
      }
      dispatch(
        createApplicationWithWorkflow({
          data: {
            returnedItems: filterdReturnItems,
            userName: userName?.name,
            designation: userName?.designationNameBn,
          },
          nextAppDesignationId: +adminEmployeeObj.designationId,
          serviceName: 'inventoryItemReturn',
        }),
      );
      setReturnedItems([
        {
          itemId: null,
          itemCode: '',
          assetType: '',
          assetTypeName: '',
          returnedQuantity: '',
          itemStatus: '',
        },
        {
          itemId: null,
          itemCode: '',
          assetType: '',
          assetTypeName: '',
          returnedQuantity: '',
          itemStatus: '',
        },
        {
          itemId: null,
          itemCode: '',
          assetType: '',
          assetTypeName: '',
          returnedQuantity: '',
          itemStatus: '',
        },
        {
          itemId: null,
          itemCode: '',
          assetType: '',
          assetTypeName: '',
          returnedQuantity: '',
          itemStatus: '',
        },
      ]);
    } catch (error) {
      showBoundary(error);
    }
  };

  const addNewItemOptionsToItemOptionsObj = (index) => {
    try {
      const returnedItemsCopy = lodash.cloneDeep(returnedItems);
      const returnableItemsCopy = lodash.cloneDeep(returnableItems);
      const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);

      const optinosThatAreAlreadySelected = returnedItemsCopy?.map((returnedItem) => {
        if (returnedItem?.assetType === true) {
          return returnableItemsCopy?.find((returnableItem) => returnableItem?.assetCode === returnedItem?.itemCode);
        } else {
          return returnableItemsCopy?.find(
            (returnableItem) => +returnableItem?.itemId === +returnedItem?.itemId?.itemId,
          );
        }
      });

      const fixedItemUseIdsToRemove = optinosThatAreAlreadySelected.map((item) => item?.fixedItemUseId);

      // Filter out elements from the first array that have matching fixedItemUseId
      const filteredArray = returnableItemsCopy.filter(
        (item) => !fixedItemUseIdsToRemove.includes(item.fixedItemUseId),
      );

      itemOptionsObjCopy[index + 1] = filteredArray;
      setItemOptionsObj(itemOptionsObjCopy);
    } catch (error) {
      showBoundary(error);
    }
  };

  const filterReturnableItems = (itemId, assetCode, arrayToBeFiltered) => {
    try {
      return arrayToBeFiltered?.filter((elm) => {
        if (assetCode && elm?.assetCode) {
          return elm?.assetCode !== assetCode;
        } else {
          return elm?.itemId != itemId;
        }
      });
    } catch (error) {
      showBoundary(error);
    }
  };
  const updateItemOptionsObj = (index, itemId, assetCode, value) => {
    try {
      const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);
      for (let key in itemOptionsObjCopy) {
        if (key != index) {
          const filteredItems = filterReturnableItems(itemId, assetCode, itemOptionsObjCopy[key], value);
          itemOptionsObjCopy[key] = filteredItems;
          if (
            assetCode &&
            returnedItems[index]?.itemCode !== '' &&
            returnedItems[index]?.itemCode?.toString() !== assetCode?.toString()
          ) {
            const founObj = returnableItems?.find((item) => item?.assetCode === returnedItems[index]?.itemCode);
            itemOptionsObjCopy[key] = [...itemOptionsObjCopy[key], founObj];
          } else if (
            !assetCode &&
            returnedItems[index]?.itemId?.itemId !== null &&
            returnedItems[index]?.itemId?.itemId != itemId
          ) {
            const founObj = returnableItems?.find((item) => item?.itemId === returnedItems[index]?.itemId?.itemId);
            itemOptionsObjCopy[key] = [...itemOptionsObjCopy[key], founObj];
          }
        }
      }
      setItemOptionsObj(itemOptionsObjCopy);
    } catch (error) {
      showBoundary(error);
    }
  };
  const removeRow = (index) => {
    try {
      const selectedObj = returnedItems[index];
      if (selectedObj?.itemId?.itemId) {
        const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);
        let founObj;
        if (+selectedObj?.assetType === true) {
          founObj = returnableItems?.find((item) => item?.assetType === returnedItems[index]?.assetType);
        } else {
          founObj = returnableItems?.find((item) => item?.itemId === returnedItems[index]?.itemId?.itemId);
        }

        delete itemOptionsObjCopy[index];
        for (let key in itemOptionsObj) {
          if (key > index) {
            itemOptionsObjCopy[key - 1] = [...itemOptionsObj[key], founObj];
          } else {
            itemOptionsObjCopy[key] = [...itemOptionsObj[key], founObj];
          }
        }
        setItemOptionsObj(itemOptionsObjCopy);
        const tempArray = lodash.cloneDeep(returnedItems);
        tempArray.splice(index, 1);

        setReturnedItems(tempArray);
      } else {
        const itemOptionsObjCopy = lodash.cloneDeep(itemOptionsObj);
        delete itemOptionsObjCopy[index];
        setItemOptionsObj(itemOptionsObjCopy);
        const tempArray = lodash.cloneDeep(returnedItems);
        tempArray.splice(index, 1);

        setReturnedItems(tempArray);
      }
    } catch (error) {
      showBoundary(error);
    }
  };
  useEffect(() => {
    dispatch(getReturnableItems());
    dispatch(getCodeMasterValue('AST'));
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);
  useEffect(() => {
    try {
      const objectLength = Object.values(itemOptionsObj)?.length;
      if (objectLength === 0 && returnableItems?.length > 0) {
        let itemOptionsObjCopy = {};
        for (let i = 0; i < returnedItems?.length; i++) {
          itemOptionsObjCopy[i] = returnableItems;
        }

        setItemOptionsObj(itemOptionsObjCopy);
      }
    } catch (error) {
      showBoundary(error);
    }
  }, [returnableItems?.length]);
  return (
    <Grid container spacing={3}>
      <Grid item lg={4} md={4} xs={12}>
        <div style={{ dispaly: 'flex', justifyContent: 'space-around' }}>
          <Typography variant="h7" fontWeight="bold">
            নাম :
          </Typography>
          <Typography variant="h7" style={{ marginLeft: '5px' }}>{`${userName?.name}`}</Typography>
        </div>
      </Grid>
      <Grid item lg={8} md={8} xs={12}>
        <div style={{ dispaly: 'flex', justifyContent: 'space-around' }}>
          <Typography variant="h7" fontWeight="bold">
            পদবী :
          </Typography>
          <Typography variant="h7" style={{ marginLeft: '5px' }}>
            {userName?.designationNameBn}
          </Typography>
        </div>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <SubHeading>মালামাল সমূহের বিবরণ</SubHeading>
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <TableContainer className="table-container">
          <Table className="input-table table-alt" aria-label="customized table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '50%' }}>মালামালের নাম</TableCell>
                <TableCell sx={{ width: '20%' }} align="center">
                  ধরন
                </TableCell>
                <TableCell sx={{ width: '10%' }} align="center">
                  ফেরতের পরিমাণ
                </TableCell>
                <TableCell sx={{ width: '15%' }} align="center">
                  অবস্থা
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returnedItems?.map((returnedItem, index) => {
                return (
                  <TableRow key={returnedItem?.itemCode ? returnedItem?.itemCode : returnedItem?.itemId?.itemId}>
                    <TableCell>
                      <Autocomplete
                        key={[
                          returnedItem?.itemCode ? returnedItem?.itemCode : returnedItem?.itemId?.itemId,
                          itemOptionsObj[index]?.length,
                        ]}
                        name="itemId"
                        size="small"
                        fullWidth
                        options={itemOptionsObj[index]?.length > 0 ? itemOptionsObj[index] : []}
                        value={returnedItem?.itemId}
                        onChange={(e, value) => {
                          try {
                            const returnableItemsCopy = lodash.cloneDeep(returnedItems);
                            if (value) {
                              returnableItemsCopy[index] = {
                                ...returnableItemsCopy[index],
                                itemId: value,
                                ...(value.isAsset === true && {
                                  itemCode: value.assetCode,
                                  returnedQuantity: 1,
                                }),
                                assetType: value.isAsset,
                                assetTypeName: value.displayValue,
                              };

                              setFormError({
                                ...formError,
                                [`${index}-itemId`]: '',
                              });
                            }
                            updateItemOptionsObj(index, value?.itemId, value?.assetCode, value);
                            setReturnedItems(returnableItemsCopy);
                          } catch (error) {
                            showBoundary(error);
                          }
                        }}
                        getOptionLabel={(option) =>
                          option?.assetCode ? option.itemName + ` ` + `(` + option.assetCode + ` )` : option.itemName
                        }
                        noOptionsText="কোনো মালামাল নেই"
                        renderInput={(params) => (
                          <TextField {...params} error={Boolean(formError[`${index}-itemId`])} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        name="assetTypeName"
                        value={returnedItem?.assetTypeName}
                        disabled
                        error={Boolean(formError[`${index}-assetTypeName`])}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        disabled={returnedItem?.assetType}
                        name="returnedQuantity"
                        value={engToBang(returnedItem?.returnedQuantity)}
                        onChange={(e) => {
                          try {
                            const { value } = e.target;
                            if (regex.test(value) || value == '') {
                              const engValue = bangToEng(value);
                              const returnableItemsCopy = lodash.cloneDeep(returnedItems);
                              returnableItemsCopy[index] = {
                                ...returnableItemsCopy[index],
                                returnedQuantity: engValue,
                              };
                              if (+engValue) {
                                setFormError({
                                  ...formError,
                                  [`${index}-returnedQuantity`]: '',
                                });
                              }
                              setReturnedItems(returnableItemsCopy);
                            }
                          } catch (error) {
                            showBoundary(error);
                          }
                        }}
                        error={Boolean(formError[`${index}-returnedQuantity`])}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        fullWidth
                        name="itemStatus"
                        onChange={(e) => {
                          try {
                            const { value } = e.target;
                            const returnableItemsCopy = lodash.cloneDeep(returnedItems);
                            returnableItemsCopy[index] = {
                              ...returnableItemsCopy[index],
                              itemStatus: +value,
                            };
                            setReturnedItems(returnableItemsCopy);
                            setFormError({
                              ...formError,
                              [`${index}-itemStatus`]: '',
                            });
                          } catch (error) {
                            showBoundary(error);
                          }
                        }}
                        value={+returnedItem?.itemStatus}
                        error={Boolean(formError[`${index}-itemStatus`])}
                      >
                        {codeMasterTypes?.map((code) => {
                          return (
                            <MenuItem key={code.id} value={code.id}>
                              {code.displayValue}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                      >
                        {index !== 0 ? (
                          <RemoveIcon
                            className="table-icon delete"
                            onClick={() => {
                              removeRow(index);
                            }}
                          />
                        ) : (
                          ''
                        )}
                        <AddIcon
                          className="table-icon add"
                          onClick={() => {
                            try {
                              addNewItemOptionsToItemOptionsObj(index);
                              const tempArray = lodash.cloneDeep(returnedItems);

                              tempArray.push({
                                itemId: null,
                                itemCode: '',
                                assetType: '',
                                assetTypeName: '',
                                returnedQuantity: '',
                                itemStatus: '',
                              });
                              setReturnedItems(tempArray);
                            } catch (error) {
                              showBoundary(error);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item md={12} lg={12} xs={12}>
        <SentForApprovalComponent {...senForApprovalPropsObj} formError={formError} />
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষন করুন">
          <LoadingButton variant="contained" className="btn btn-save" loadingPosition="end" onClick={handleSubmit}>
            সংরক্ষণ করুন
          </LoadingButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
export default ItemRetun;
