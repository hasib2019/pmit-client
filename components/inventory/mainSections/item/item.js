/* eslint-disable react/jsx-key */
import { Dialog, DialogContent, Grid, Tooltip } from '@mui/material';
import useModalOpenClose from 'components/inventory/hooks/useModalOpenClose';
import ModalHeader from 'components/inventory/utils/modalHeader';
import SubHeadingComponent from 'components/inventory/utils/subHeadingComponent';
import {
  dataGridActionColumnName,
  dataGridSerialNumberTitle,
  itemCategoryDataGridCategoryNameColumnTitle,
  itemCategoryDataGridGroupNameColumnTitle,
  // itemGroupNameErrorMessage,
  itemCategoryNameErrorMessage,
  itemCodeTextFieldTitle,
  itemCreateButtonTitle,
  itemMeasurementUnitAutocompleteUnselectedTitle,
  itemModalHeaderTitle,
  // itemCodeErrorMessage,
  itemModeErrorMessage,
  itemModelLengthErrorMessage,
  // itemCodeLengthErrorMessage,
  itemNameLengthErrorMessage,
  itemNameTextfieldTitle,
  itemPageListTitle,
  itemPriceColumnTitle,
  // itemDescriptionErrorMessage,
  itemPricePerUnitErrorMessage,
  itemRowEditTitle,
  itemStatusErrorMessage,
  // itemDescriptionLengthErrorMessage,
  itemTypeTextFieldLabelErrorMessage,
  savButtonLabel,
  updateButtonLabel,
} from '../../constants';
// import star from 'components/mainSections/loan-management/loan-application/utils';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DoptorSelectionComponent from './doptorSelectionComponent';
import FormComponent from './formComponent';
// import useItemsTextFieldStateAndFunctionalities from '../../hooks/item/useItemStateAndFunction';
import { Edit } from '@mui/icons-material';
import {
  engToBang,
} from 'components/mainSections/samity-managment/member-registration/validator';
import { fetchAllItemCategory } from 'features/inventory/category/categoryApi';
import { fetchAllItemGroup } from 'features/inventory/item-group/ItemGroupApi';
import { fetchAllDoptor, fetchDoptorItemInfo } from 'features/inventory/item/itemApi';
import { fetchAllMeasurementUnit } from 'features/inventory/measurementUnit/measurementUnitApi';
import { Form, Formik } from 'formik';
import lodash from 'lodash';
import * as yup from 'yup';
import {
  onClearCaseCadingDropDown,
  onSetCategoryDropDownInItemStoreInEditMode,
} from '../../../../features/inventory/category/categorySlice';
import { getAllItemGroup } from '../../../../features/inventory/item-group/ItemGroupSlice';
import {
  createItem,
  emptyCodeMasterTypes,
  getCodeMasterValue,
  getItem,
  onClearDoptorSection,
  // onEditModeChange,
  // onInitializeItemInfo,
  // onSetDoptorSelection,
  updateItem,
} from '../../../../features/inventory/item/itemSlice';
import { getAllMeasurementUnit } from '../../../../features/inventory/measurementUnit/measurementUnitSlice';
const Item = () => {
  const dispatch = useDispatch();
  const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();
  const { isLoading, items, allDoptors } = useSelector((state) => state.itemOrProduct);

  // eslint-disable-next-line no-empty-pattern
  const { } = useSelector((state) => state.measurementUnit);
  const validationSchema = yup.object({
    categoryId: yup
      .object()
      .required(itemCategoryNameErrorMessage)
      .shape({
        id: yup.number().required(itemCategoryNameErrorMessage),
      }),
    itemName: yup.string().max(200, itemNameLengthErrorMessage).required(itemNameLengthErrorMessage),

    model: yup.string().max(200, itemModelLengthErrorMessage).required(itemModeErrorMessage),
    mouId: yup
      .object()
      .required(itemMeasurementUnitAutocompleteUnselectedTitle)
      .shape({
        id: yup.number().required(itemMeasurementUnitAutocompleteUnselectedTitle),
      }),
    unitPrice: yup.number().required(itemPricePerUnitErrorMessage),
    goodsType: yup.string().required(itemTypeTextFieldLabelErrorMessage),
    isAsset: yup.boolean().required('মালামাল স্থায়ী সম্পদ কিনা নির্বাচন করুন'),
    isActive: yup.boolean().required(itemStatusErrorMessage),

    doptorAndFixedAssetInfos: yup.array().of(
      yup.object().shape({
        isAsset: yup.boolean(),
        goodsType: yup.string(),
        isSelected: yup.boolean(),
        doptorId: yup.number().required(),
        prefix: yup.string().when(['isSelected', 'isAsset'], ([isSelected, isAsset], schema) => {
          return isSelected === true && isAsset === true
            ? schema.required('প্রিফিক্স প্রদান করুন')
            : schema.notRequired();
        }),
        slNumberLength: yup.number().when(['isSelected', 'isAsset'], ([isSelected, isAsset], schema) => {
          return isSelected === true && isAsset === true
            ? schema.required('সিরিয়াল নাম্বার প্রদান করুন')
            : schema.notRequired();
        }),
      }),
    ),
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    dispatch(getItem());
    dispatch(getAllItemGroup());
    dispatch(getAllMeasurementUnit());
    dispatch(getCodeMasterValue('GTP'));
    return () => {
      dispatch(emptyCodeMasterTypes());
    };
  }, []);
  return (
    <>
      <Formik
        initialValues={{
          id: '',
          groupId: null,
          categoryId: null,
          itemName: '',
          itemCode: '',
          hsCode: '',
          description: '',
          model: '',
          mouId: null,
          unitPrice: '',
          isAsset: false,
          goodsType: '',
          reorderLevelQuantity: '',
          doptorAndFixedAssetInfos: [],

          isActive: true,
          isEditMode: false,
        }}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={async (values, { resetForm }) => {
          const { doptorAndFixedAssetInfos } = values;
          let requestStatus = '';
          const doptorItems = doptorAndFixedAssetInfos
            .filter((item) => item.isSelected === true)
            .map((doptorItem) => {
              return {
                doptorId: doptorItem.doptorId,
                prefix: doptorItem.prefix ? doptorItem.prefix : null,
                slNumberLength: doptorItem.slNumberLength ? doptorItem.slNumberLength : null,
                maxSl: 0,
              };
            });
          const payload = {
            ...values,
            groupId: values.groupId.id,
            categoryId: values.categoryId.id,
            mouId: values.mouId.id,
            doptorItems: doptorItems,
          };

          values.isEditMode
            ? (requestStatus = await dispatch(
              updateItem(
                lodash.omit(payload, [
                  'isEditMode',
                  'itemCode',
                  'doptorAndFixedAssetInfos',
                  !payload?.reorderLevelQuantity ? 'reorderLevelQuantity' : '',
                  !payload?.hsCode ? 'hsCode' : '',
                  !payload?.description ? 'description' : '',
                ]),
              ),
            ))
            : (requestStatus = await dispatch(
              createItem(
                lodash.omit(payload, [
                  'id',
                  'isEditMode',
                  'itemCode',
                  'doptorAndFixedAssetInfos',
                  !payload?.reorderLevelQuantity ? 'reorderLevelQuantity' : '',
                  !payload?.hsCode ? 'hsCode' : '',
                  !payload?.description ? 'description' : '',
                ]),
              ),
            ));
          if (requestStatus.meta.requestStatus !== 'rejected') {
            resetForm();
            dispatch(onClearDoptorSection());
            handleModalClose();
            dispatch(onClearCaseCadingDropDown());
          }
        }}
      >
        {(props) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [columns] = useState([
            {
              headerName: dataGridSerialNumberTitle,
              width: 100,
              filterable: false,
              align: 'center',
              headerAlign: 'center',
              renderCell: (index) => {
                return engToBang(index.api.getRowIndex(index.row.id) + 1);
              },
            },
            {
              headerName: itemNameTextfieldTitle,
              field: 'itemName',
              width: 280,
              filterable: true,
            },
            {
              headerName: itemCategoryDataGridGroupNameColumnTitle,
              field: 'groupName',
              width: 220,
              filterable: true,
            },
            {
              headerName: itemCategoryDataGridCategoryNameColumnTitle,
              field: 'categoryName',
              width: 150,
              filterable: true,
            },

            {
              headerName: itemCodeTextFieldTitle,
              field: 'itemCode',
              width: 80,
              filterable: true,
              headerAlign: 'center',
              align: 'center',
              valueGetter: (params) => {
                return engToBang(params.row.itemCode);
              },
            },
            {
              headerName: itemPriceColumnTitle,
              field: 'unitPrice',
              width: 100,
              filterable: true,
              headerAlign: 'right',
              align: 'right',
              valueGetter: (params) => engToBang(params.row.unitPrice),
            },
            {
              field: 'actions',
              type: 'actions',
              headerName: dataGridActionColumnName,
              width: 100,

              getActions: ({ row }) => {
                return [
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Tooltip title={itemRowEditTitle} placement="top-start">
                      <Edit
                        className="edit-icon"
                        style={{ cursor: 'pointer' }}
                        onClick={async () => {
                          const itemGroups = await fetchAllItemGroup();

                          const allMouUnits = await fetchAllMeasurementUnit();
                          const itemCategories = await fetchAllItemCategory(`&group_id=${row.groupId}`);
                          dispatch(
                            onSetCategoryDropDownInItemStoreInEditMode({
                              itemCategories: itemCategories.data,
                            }),
                          );
                          const allDoptors = await fetchAllDoptor();
                          const allDoptorInfosData = allDoptors.data.map((doptor) => {
                            return {
                              doptorId: doptor.id,
                              prefix: '',
                              slNumberLength: '',
                              maxSl: 0,
                              isSelected: false,
                              nameBn: doptor.nameBn,
                            };
                          });
                          const doptorItems = await fetchDoptorItemInfo(row.id);
                          let doptorItemObj = {};
                          for (let item of doptorItems.data) {
                            doptorItemObj[item.doptorId] = {
                              prefix: item.prefix,
                              slNumberLength: item.slNumberLength,
                            };
                          }

                          const doptorItemInfos = allDoptorInfosData.map((doptorItem) => {
                            if (doptorItemObj[doptorItem.doptorId]) {
                              return {
                                ...doptorItem,
                                isSelected: true,
                                prefix: doptorItemObj[doptorItem.doptorId]['prefix'],
                                slNumberLength: doptorItemObj[doptorItem.doptorId]['slNumberLength'],
                              };
                            } else {
                              return {
                                ...doptorItem,
                              };
                            }
                          });
                          props.setValues({
                            id: row.id,
                            groupId: itemGroups.data.find((elm) => elm.id == row.groupId),
                            categoryId: itemCategories.data.find((elm) => elm.id == row.categoryId),
                            itemName: row.itemName,
                            itemCode: row.itemCode,
                            hsCode: row.hsCode,
                            description: row.description,
                            model: row.model,
                            mouId: allMouUnits.data.find((elm) => elm.id == row.mouId),
                            unitPrice: row.unitPrice,
                            isAsset: row.isAsset,
                            goodsType: row.goodsType,
                            reorderLevelQuantity: row.reorderLevelQuantity,
                            doptorAndFixedAssetInfos: doptorItemInfos,
                            isActive: row.isActive,
                            isEditMode: true,
                          });

                          // dispatch(onSetDoptorSelection(row.rules.doptorIds));
                          handlModalOpen();
                        }}
                      ></Edit>
                    </Tooltip>
                  </div>,
                ];
              },
            },
          ]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (props?.values?.doptorAndFixedAssetInfos.length === 0 && allDoptors.length > 0) {
              const arrayCopy = lodash.cloneDeep(allDoptors);
              props.setFieldValue('doptorAndFixedAssetInfos', arrayCopy);
            }
          }, [allDoptors]);
          return (
            <>
              <SubHeadingComponent
                onClickCreateButton={() => {
                  handlModalOpen();
                  dispatch(onClearCaseCadingDropDown());
                }}
                subHeadingTitle={itemPageListTitle}
                subHeadingButtonTitle={itemCreateButtonTitle}
              />
              <Dialog open={isModalOpen} fullWidth maxWidth="md">
                <ModalHeader
                  isEditMode={props.values.isEditMode}
                  modalHeaderTitle={itemModalHeaderTitle}
                  onClickCloseIcon={() => {
                    handleModalClose();
                    props.resetForm();
                    dispatch(onClearDoptorSection());
                  }}
                />
                <DialogContent>
                  <Form>
                    <FormComponent />
                    <DoptorSelectionComponent />
                    <Grid container className="btn-container">
                      <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LoadingButton
                          type="submit"
                          className="btn btn-save"
                          loadingPosition="end"
                          disabled={isLoading}
                        >
                          {props.values.isEditMode ? updateButtonLabel : savButtonLabel}
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Form>
                </DialogContent>
              </Dialog>
              <Grid sx={{ width: '100%' }}>
                {items.length > 0 ? (
                  <DataGrid
                    options={{
                      encoding: 'utf-8',
                    }}
                    rows={items
                      ?.map((elm) => {
                        'elm8364',
                        {
                          id: elm.id,
                          groupName: elm.groupName,
                          groupId: elm.groupId,
                          categoryId: elm.categoryId,
                          categoryName: elm.categoryName,
                          itemName: elm.itemName,
                          itemCode: elm.itemCode,
                          unitPrice: elm.unitPrice,
                          rules: elm.rules,
                          isActive: elm.isActive,
                          goodsType: elm.goodsType,
                          description: elm.description,
                          model: elm.model,
                          mouId: elm.mouId,
                          mouName: elm.mouName,
                        };
                        return {
                          id: elm.id,
                          groupName: elm.groupName,
                          groupId: elm.groupId,
                          categoryId: elm.categoryId,
                          categoryName: elm.categoryName,
                          itemName: elm.itemName,
                          itemCode: elm.itemCode,
                          unitPrice: elm.unitPrice,
                          rules: elm.rules,
                          isActive: elm.isActive,
                          goodsType: elm.goodsType,
                          description: elm.description,
                          model: elm.model,
                          mouId: elm.mouId,
                          mouName: elm.mouName,
                          isAsset: elm.isAsset,
                          hsCode: elm.hsCode,
                          reorderLevelQuantity: elm.reorderLevelQuantity,
                        };
                      })
                      ?.filter((item) => item?.isActive === true)}
                    columns={columns}
                    getRowId={(row) => row.id}
                    density="compact"
                    localeText={{
                      toolbarColumns: '',
                      toolbarFilters: '',
                      toolbarDensity: '',
                      toolbarExport: '',
                    }}
                    components={{
                      Toolbar: CustomToolbar,
                    }}
                    autoHeight={true}
                  ></DataGrid>
                ) : (
                  ''
                )}
              </Grid>
            </>
          );
        }}
      </Formik>
    </>
  );
};
export default Item;

// import {
//   itemCreateButtonTitle,
//   itemPageListTitle,
//   itemModalHeaderTitle,
//   savButtonLabel,
//   itemGroupNameErrorMessage,
//   itemCategoryNameErrorMessage,
//   itemMeasurementUnitAutocompleteUnselectedTitle,
//   itemCodeErrorMessage,
//   itemModeErrorMessage,
//   itemStatusErrorMessage,
//   itemDescriptionErrorMessage,
//   itemPricePerUnitErrorMessage,
//   itemCodeLengthErrorMessage,
//   itemNameLengthErrorMessage,
//   itemModelLengthErrorMessage,
//   itemDescriptionLengthErrorMessage,
//   itemTypeTextFieldLabelErrorMessage,
//   dataGridSerialNumberTitle,
//   itemCategoryDataGridCategoryNameColumnTitle,
//   itemCategoryDataGridGroupNameColumnTitle,
//   itemNameTextfieldTitle,
//   itemCodeTextFieldTitle,
//   itemPriceColumnTitle,
//   dataGridActionColumnName,
//   itemRowEditTitle,
//   updateButtonLabel,
//   itemHashCodeErrorMessage,
//   itemHashCodeLengthErrorMessage,
//   itemHashCodeTextFieldTitle,
//   reorderLevelQuantityTexfieldTitleErrorMessage,
// } from "../../constants";
// import useModalOpenClose from "components/inventory/hooks/useModalOpenClose";
// import SubHeadingComponent from "components/inventory/utils/subHeadingComponent";
// import { Dialog, DialogContent, Grid, Tooltip } from "@mui/material";
// import ModalHeader from "components/inventory/utils/modalHeader";
// import star from "components/mainSections/loan-management/loan-application/utils";
// import LoadingButton from "@mui/lab/LoadingButton";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   DataGrid,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
//   GridToolbarDensitySelector,
//   GridToolbarExport,
//   GridToolbarFilterButton,
// } from "@mui/x-data-grid";
// import { useEffect, useState } from "react";
// import FormComponent from "./formComponent";
// import DoptorSelectionComponent from "./doptorSelectionComponent";
// import useItemsTextFieldStateAndFunctionalities from "../../hooks/item/useItemStateAndFunction";
// import {
//   createItem,
//   emptyCodeMasterTypes,
//   getCodeMasterValue,
//   getItem,
//   onClearDoptorSection,
//   onEditModeChange,
//   onInitializeItemInfo,
//   onSetDoptorSelection,
//   updateItem,
// } from "../../../../features/inventory/item/itemSlice";
// import {
//   onClearCaseCadingDropDown,
//   onSetCategoryDropDownInItemStoreInEditMode,
// } from "../../../../features/inventory/category/categorySlice";
// import { Edit, Close, PartyMode } from "@mui/icons-material";
// import { getAllItemGroup } from "../../../../features/inventory/item-group/ItemGroupSlice";
// import {
//   engToBang,
//   bangToEng,
// } from "components/mainSections/samity-managment/member-registration/validator";
// import { getAllMeasurementUnit } from "../../../../features/inventory/measurementUnit/measurementUnitSlice";
// import { fetchAllItemGroup } from "features/inventory/item-group/ItemGroupApi";
// import { fetchAllItemCategory } from "features/inventory/category/categoryApi";
// import { fetchAllMeasurementUnit } from "features/inventory/measurementUnit/measurementUnitApi";
// import { useFormik, Formik, Form } from "formik";
// import * as yup from "yup";
// import {
//   editItem,
//   fetchAllDoptor,
//   fetchDoptorItemInfo,
// } from "features/inventory/item/itemApi";
// import lodash, { values } from "lodash";
// const Item = () => {
//   const dispatch = useDispatch();
//   const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();
//   const { isLoading, items, itemInfo, allDoptors } = useSelector(
//     (state) => state.itemOrProduct
//   );

//   const { allMeasurementUnits } = useSelector((state) => state.measurementUnit);
//   const validationSchema = yup.object({
//     categoryId: yup
//       .object()
//       .required(itemCategoryNameErrorMessage)
//       .shape({
//         id: yup.number().required(itemCategoryNameErrorMessage),
//       }),
//     itemName: yup
//       .string()
//       .max(200, itemNameLengthErrorMessage)
//       .required(itemNameLengthErrorMessage),

//     model: yup
//       .string()
//       .max(200, itemModelLengthErrorMessage)
//       .required(itemModeErrorMessage),
//     mouId: yup
//       .object()
//       .required(itemMeasurementUnitAutocompleteUnselectedTitle)
//       .shape({
//         id: yup
//           .number()
//           .required(itemMeasurementUnitAutocompleteUnselectedTitle),
//       }),
//     unitPrice: yup.number().required(itemPricePerUnitErrorMessage),
//     goodsType: yup.string().required(itemTypeTextFieldLabelErrorMessage),

//     isActive: yup.boolean().required(itemStatusErrorMessage),

//     doptorAndFixedAssetInfos: yup.array().of(
//       yup.object().shape({
//         goodsType: yup.string(),
//         isSelected: yup.boolean(),
//         doptorId: yup.number().required(),
//         prefix: yup
//           .string()
//           .when(
//             ["isSelected", "goodsType"],
//             ([isSelected, goodsType], schema) => {
//               return isSelected === true && +goodsType === 163
//                 ? schema.required("প্রিফিক্স প্রদান করুন")
//                 : schema.notRequired();
//             }
//           ),
//         slNumberLength: yup
//           .number()
//           .when(
//             ["isSelected", "goodsType"],
//             ([isSelected, goodsType], schema) => {
//               return isSelected === true && +goodsType === 163
//                 ? schema.required("সিরিয়াল নাম্বার প্রদান করুন")
//                 : schema.notRequired();
//             }
//           ),
//       })
//     ),
//   });

//   function CustomToolbar() {
//     return (
//       <GridToolbarContainer>
//         <GridToolbarColumnsButton />
//         <GridToolbarFilterButton />
//         <GridToolbarDensitySelector />
//         <GridToolbarExport />
//       </GridToolbarContainer>
//     );
//   }

//   useEffect(() => {
//     dispatch(getItem());
//     dispatch(getAllItemGroup());
//     dispatch(getAllMeasurementUnit());
//     dispatch(getCodeMasterValue("GTP"));
//     return () => {
//       dispatch(emptyCodeMasterTypes());
//     };
//   }, []);
//   return (
//     <>
//       <Formik
//         initialValues={{
//           id: "",
//           groupId: null,
//           categoryId: null,
//           itemName: "",
//           itemCode: "",
//           hsCode: "",
//           description: "",
//           model: "",
//           mouId: null,
//           unitPrice: "",
//           isAsset: true,
//           goodsType: "",
//           reorderLevelQuantity: "",
//           doptorAndFixedAssetInfos: [],

//           isActive: true,
//           isEditMode: false,
//         }}
//         validationSchema={validationSchema}
//         validateOnChange={true}
//         onSubmit={async (values, { resetForm }) => {
//           const { doptorAndFixedAssetInfos } = values;
//           let requestStatus = "";
//           const doptorItems = doptorAndFixedAssetInfos
//             .filter((item) => item.isSelected === true)
//             .map((doptorItem) => {
//               return {
//                 doptorId: doptorItem.doptorId,
//                 prefix: doptorItem.prefix ? doptorItem.prefix : null,
//                 slNumberLength: doptorItem.slNumberLength
//                   ? doptorItem.slNumberLength
//                   : null,
//                 maxSl: 0,
//               };
//             });
//           const payload = {
//             ...values,
//             groupId: values.groupId.id,
//             categoryId: values.categoryId.id,
//             mouId: values.mouId.id,
//             doptorItems: doptorItems,
//           };

//           values.isEditMode
//             ? (requestStatus = await dispatch(
//                 updateItem(
//                   lodash.omit(payload, [
//                     "isEditMode",
//                     "itemCode",
//                     "doptorAndFixedAssetInfos",
//                     !payload?.reorderLevelQuantity
//                       ? "reorderLevelQuantity"
//                       : "",
//                     !payload?.hsCode ? "hsCode" : "",
//                   ])
//                 )
//               ))
//             : (requestStatus = await dispatch(
//                 createItem(
//                   lodash.omit(payload, [
//                     "id",
//                     "isEditMode",
//                     "itemCode",
//                     "doptorAndFixedAssetInfos",
//                     !payload?.reorderLevelQuantity
//                       ? "reorderLevelQuantity"
//                       : "",
//                     !payload?.hsCode ? "hsCode" : "",
//                   ])
//                 )
//               ));
//           if (requestStatus.meta.requestStatus !== "rejected") {
//             resetForm();
//             dispatch(onClearDoptorSection());
//             handleModalClose();
//             dispatch(onClearCaseCadingDropDown());
//           }
//         }}
//       >
//         {(props) => {
//           const [columns] = useState([
//             {
//               headerName: dataGridSerialNumberTitle,
//               width: 100,
//               filterable: false,
//               align: "center",
//               headerAlign: "center",
//               renderCell: (index) => {
//                 return engToBang(index.api.getRowIndex(index.row.id) + 1);
//               },
//             },
//             {
//               headerName: itemNameTextfieldTitle,
//               field: "itemName",
//               width: 280,
//               filterable: true,
//             },
//             {
//               headerName: itemCategoryDataGridGroupNameColumnTitle,
//               field: "groupName",
//               width: 220,
//               filterable: true,
//             },
//             {
//               headerName: itemCategoryDataGridCategoryNameColumnTitle,
//               field: "categoryName",
//               width: 150,
//               filterable: true,
//             },

//             {
//               headerName: itemCodeTextFieldTitle,
//               field: "itemCode",
//               width: 80,
//               filterable: true,
//               headerAlign: "center",
//               align: "center",
//               valueGetter: (params) => {
//                 return engToBang(params.row.itemCode);
//               },
//             },
//             {
//               headerName: itemPriceColumnTitle,
//               field: "unitPrice",
//               width: 100,
//               filterable: true,
//               headerAlign: "right",
//               align: "right",
//               valueGetter: (params) => engToBang(params.row.unitPrice),
//             },
//             {
//               field: "actions",
//               type: "actions",
//               headerName: dataGridActionColumnName,
//               width: 100,

//               getActions: ({ row }) => {
//                 return [
//                   <div
//                     style={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Tooltip title={itemRowEditTitle} placement="top-start">
//                       <Edit
//                         className="edit-icon"
//                         style={{ cursor: "pointer" }}
//                         onClick={async () => {
//                           const itemGroups = await fetchAllItemGroup();

//                           const allMouUnits = await fetchAllMeasurementUnit();
//                           const itemCategories = await fetchAllItemCategory(
//                             `&group_id=${row.groupId}`
//                           );
//                           dispatch(
//                             onSetCategoryDropDownInItemStoreInEditMode({
//                               itemCategories: itemCategories.data,
//                             })
//                           );
//                           const allDoptors = await fetchAllDoptor();
//                           const allDoptorInfosData = allDoptors.data.map(
//                             (doptor) => {
//                               return {
//                                 doptorId: doptor.id,
//                                 prefix: "",
//                                 slNumberLength: "",
//                                 maxSl: 0,
//                                 isSelected: false,
//                                 nameBn: doptor.nameBn,
//                               };
//                             }
//                           );
//                           const doptorItems = await fetchDoptorItemInfo(row.id);
//                           let doptorItemObj = {};
//                           for (let item of doptorItems.data) {
//                             doptorItemObj[item.doptorId] = {
//                               prefix: item.prefix,
//                               slNumberLength: item.slNumberLength,
//                             };
//                           }
//
//                           const doptorItemInfos = allDoptorInfosData.map(
//                             (doptorItem) => {
//
//                               if (doptorItemObj[doptorItem.doptorId]) {
//                                 return {
//                                   ...doptorItem,
//                                   isSelected: true,
//                                   prefix:
//                                     doptorItemObj[doptorItem.doptorId][
//                                       "prefix"
//                                     ],
//                                   slNumberLength:
//                                     doptorItemObj[doptorItem.doptorId][
//                                       "slNumberLength"
//                                     ],
//                                 };
//                               } else {
//                                 return {
//                                   ...doptorItem,
//                                 };
//                               }
//                             }
//                           );
//                           props.setValues({
//                             id: row.id,
//                             groupId: itemGroups.data.find(
//                               (elm) => elm.id == row.groupId
//                             ),
//                             categoryId: itemCategories.data.find(
//                               (elm) => elm.id == row.categoryId
//                             ),
//                             itemName: row.itemName,
//                             itemCode: row.itemCode,
//                             hsCode: row.hsCode,
//                             description: row.description,
//                             model: row.model,
//                             mouId: allMouUnits.data.find(
//                               (elm) => elm.id == row.mouId
//                             ),
//                             unitPrice: row.unitPrice,
//                             isAsset: row.isAsset,
//                             goodsType: row.goodsType,
//                             reorderLevelQuantity: row.reorderLevelQuantity,
//                             doptorAndFixedAssetInfos: doptorItemInfos,
//                             isActive: row.isActive,
//                             isEditMode: true,
//                           });

//                           // dispatch(onSetDoptorSelection(row.rules.doptorIds));
//                           handlModalOpen();
//                         }}
//                       ></Edit>
//                     </Tooltip>
//                   </div>,
//                 ];
//               },
//             },
//           ]);
//           useEffect(() => {
//             if (
//               props?.values?.doptorAndFixedAssetInfos.length === 0 &&
//               allDoptors.length > 0
//             ) {
//               const arrayCopy = lodash.cloneDeep(allDoptors);
//               props.setFieldValue("doptorAndFixedAssetInfos", arrayCopy);
//             }
//           }, [allDoptors]);
//           return (
//             <>
//               <SubHeadingComponent
//                 onClickCreateButton={() => {
//                   handlModalOpen();
//                   dispatch(onClearCaseCadingDropDown());
//                 }}
//                 subHeadingTitle={itemPageListTitle}
//                 subHeadingButtonTitle={itemCreateButtonTitle}
//               />
//               <Dialog open={isModalOpen} fullWidth maxWidth="md">
//                 <ModalHeader
//                   isEditMode={props.values.isEditMode}
//                   modalHeaderTitle={itemModalHeaderTitle}
//                   onClickCloseIcon={() => {
//                     handleModalClose();
//                     props.resetForm();
//                     dispatch(onClearDoptorSection());
//                   }}
//                 />
//                 <DialogContent>
//                   <Form>
//                     <FormComponent />
//                     <DoptorSelectionComponent
//                       goodsType={props.values.goodsType}
//                       setFieldValue={props.setFieldValue}
//                       touched={props.touched}
//                       errors={props.errors}
//                       selectedDoptors={lodash.cloneDeep(
//                         props.values.doptorAndFixedAssetInfos
//                       )}
//                     />
//                     <Grid container className="btn-container">
//                       <Grid
//                         item
//                         md={12}
//                         lg={12}
//                         xs={12}
//                         sx={{ display: "flex", justifyContent: "center" }}
//                       >
//                         <LoadingButton
//                           type="submit"
//                           className="btn btn-save"
//                           loadingPosition="end"
//                           disabled={isLoading}
//                         >
//                           {props.values.isEditMode
//                             ? updateButtonLabel
//                             : savButtonLabel}
//                         </LoadingButton>
//                       </Grid>
//                     </Grid>
//                   </Form>
//                 </DialogContent>
//               </Dialog>
//               <Grid sx={{ width: "100%" }}>
//                 {items.length > 0 ? (
//                   <DataGrid
//                     options={{
//                       encoding: "utf-8",
//                     }}
//                     rows={items
//                       ?.map((elm) => {
//                         "elm8364",
//                           {
//                             id: elm.id,
//                             groupName: elm.groupName,
//                             groupId: elm.groupId,
//                             categoryId: elm.categoryId,
//                             categoryName: elm.categoryName,
//                             itemName: elm.itemName,
//                             itemCode: elm.itemCode,
//                             unitPrice: elm.unitPrice,
//                             rules: elm.rules,
//                             isActive: elm.isActive,
//                             goodsType: elm.goodsType,
//                             description: elm.description,
//                             model: elm.model,
//                             mouId: elm.mouId,
//                             mouName: elm.mouName,
//                           };
//                         return {
//                           id: elm.id,
//                           groupName: elm.groupName,
//                           groupId: elm.groupId,
//                           categoryId: elm.categoryId,
//                           categoryName: elm.categoryName,
//                           itemName: elm.itemName,
//                           itemCode: elm.itemCode,
//                           unitPrice: elm.unitPrice,
//                           rules: elm.rules,
//                           isActive: elm.isActive,
//                           goodsType: elm.goodsType,
//                           description: elm.description,
//                           model: elm.model,
//                           mouId: elm.mouId,
//                           mouName: elm.mouName,
//                           isAsset: elm.isAsset,
//                           hsCode: elm.hsCode,
//                           reorderLevelQuantity: elm.reorderLevelQuantity,
//                           rules: elm.rules,
//                         };
//                       })
//                       ?.filter((item) => item?.isActive === true)}
//                     columns={columns}
//                     getRowId={(row) => row.id}
//                     density="compact"
//                     localeText={{
//                       toolbarColumns: "",
//                       toolbarFilters: "",
//                       toolbarDensity: "",
//                       toolbarExport: "",
//                     }}
//                     components={{
//                       Toolbar: CustomToolbar,
//                     }}
//                     autoHeight={true}
//                   ></DataGrid>
//                 ) : (
//                   ""
//                 )}
//               </Grid>
//             </>
//           );
//         }}
//       </Formik>
//     </>
//   );
// };
// export default Item;
