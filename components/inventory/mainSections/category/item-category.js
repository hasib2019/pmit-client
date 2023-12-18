// import useModalOpenClose from "components/inventory/hooks/useModalOpenClose";
// import SubHeadingComponent from "components/inventory/utils/subHeadingComponent";
// import {
//   itemCategoryPageTitle,
//   itemCategorySubHeadingTitle,
//   itemCategorySubHeadingButtonTitle,
//   itemCategoryModalHeaderTitle,
//   itemCategoryGroupAutocompletTitle,
//   itemCategoryCategoryNameTextfieldTitle,
//   measurementIsActiveRadioFieldTitle,
//   itemCategoryAssetTypeRadioTitle,
//   itemCategoryCode,
//   itemCategoryGroupAutocompletErrorMessage,
//   itemCategoryCategoryNameTextfieldErrorMessage,
//   itemCategoryAssetTypeRadioErrorMessage,
//   itemCategoryCodeErrorMessage,
//   itemCategoryDataGridGroupNameColumnTitle,
//   itemCategoryDataGridCategoryNameColumnTitle,
//   itemCategoryDataGridAssetTypeColumnTitle,
//   itemCategoryDataGridCategoryCodeColumnTitle,
//   dataGridSerialNumberTitle,
//   dataGridActionColumnName,
//   itemCategoryRowEditTitle,
//   permanentAssetTitle,
//   nonPermanentAssetTitle,
//   savButtonLabel,
//   updateButtonLabel,
// } from "../../../inventory/constants";
// import {
//   Grid,
//   TextField,
//   Dialog,
//   DialogContent,
//   Tooltip,
//   FormHelperText,
//   FormControl,
//   RadioGroup,
//   FormLabel,
//   FormControlLabel,
//   Radio,
//   Autocomplete,
// } from "@mui/material";

// import ModalHeader from "components/inventory/utils/modalHeader";
// import { useState, useEffect } from "react";
// import star from "components/mainSections/loan-management/loan-application/utils";
// import LoadingButton from "@mui/lab/LoadingButton";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getAllItemCategory,
//   createItemCategory,
//   updateItemCategory,
// } from "features/inventory/category/categorySlice";
// import { getAllItemGroup } from "features/inventory/item-group/ItemGroupSlice";
// import {
//   DataGrid,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
//   GridToolbarDensitySelector,
//   GridToolbarExport,
//   GridToolbarFilterButton,
// } from "@mui/x-data-grid";
// import { Edit, Close, PartyMode } from "@mui/icons-material";
// import {
//   engToBang,
//   bangToEng,
// } from "components/mainSections/samity-managment/member-registration/validator";
// import { fetchAllItemGroup } from "features/inventory/item-group/ItemGroupApi";
// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarColumnsButton />
//       <GridToolbarFilterButton />
//       <GridToolbarDensitySelector />
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }
// export const ItemCategory = () => {
//   const dispatch = useDispatch();
//   const { itemCategories, isLoading, isError, errorMessage, successMessage } =
//     useSelector((state) => state.itemCategory);
//   const { itemGroups } = useSelector((state) => state.itemGroup);
//   const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();

//   const [isEditMode, setIsEditMode] = useState(false);
//   const [groupId, setGroupId] = useState(undefined);
//   const [categoryName, setCategoryName] = useState("");
//   const [assetType, setIsAssetType] = useState("");
//   const [categoryCode, setCategoryCode] = useState("");

//   const [rowData, setRowData] = useState("");
//   const [error, setError] = useState({
//     groupIdError: "",
//     categoryNameError: "",
//     assetTypeError: "",
//     categoryCodeError: "",
//   });

//   const [columns] = useState([
//     {
//       headerName: dataGridSerialNumberTitle,
//       width: 100,
//       filterable: false,
//       align: "center",
//       headerAlign: "center",
//       align: "center",
//       renderCell: (index) => {
//         return engToBang(index.api.getRowIndex(index.row.id) + 1);
//       },
//     },
//     {
//       headerName: itemCategoryDataGridGroupNameColumnTitle,
//       field: "groupName",
//       width: 420,
//       filterable: true,
//     },
//     {
//       headerName: itemCategoryDataGridCategoryNameColumnTitle,
//       field: "categoryName",
//       width: 420,
//       filterable: true,
//       valueFormatter: (params) => {
//         "parmas3", params;
//       },
//     },
//     // {
//     //   headerName: itemCategoryDataGridAssetTypeColumnTitle,
//     //   field: "assetType",
//     //   width: 100,
//     //   filterable: true,
//     //   valueFormatter: (params) => {
//     //     return params.value ? permanentAssetTitle : nonPermanentAssetTitle;
//     //   },
//     // },
//     // {
//     //   headerName: itemCategoryDataGridCategoryCodeColumnTitle,
//     //   field: "categoryCode",
//     //   width: 100,
//     //   filterable: true,
//     // },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: dataGridActionColumnName,
//       width: 100,
//       // cellClassName: "actions",
//       getActions: ({ row }) => {
//         return [
//           <div style={{ display: "flex", justifyContent: "space-between" }}>
//             <Tooltip title={itemCategoryRowEditTitle} placement="top-start">
//               <Edit
//                 className="edit-icon"
//                 style={{ cursor: "pointer" }}
//                 onClick={async () => {
//                   // const itemGroups = await fetchAllItemGroup();
//                   // setGroupId(
//                   //   itemGroups.data.find((elm) => elm.id == row.groupId)
//                   // );

//                   // setIsEditMode(true);
//                   // handlModalOpen();

//                   // setIsAssetType(row.assetType);
//                   // setCategoryName(row.categoryName);
//                   // setCategoryCode(row.categoryCode);
//                   // setRowData(row);
//                   // const itemGroups = await fetchAllItemGroup();
//                   setGroupId(itemGroups.find((elm) => elm.id == row.groupId));

//                   setIsEditMode(true);
//                   handlModalOpen();

//                   setIsAssetType(row.assetType);
//                   setCategoryName(row.categoryName);
//                   setCategoryCode(row.categoryCode);
//                   setRowData(row);
//                 }}
//               ></Edit>
//             </Tooltip>
//           </div>,
//         ];
//       },
//     },
//   ]);
//   const clearState = () => {
//     setIsEditMode(false);

//     setGroupId(undefined);
//     setIsAssetType("");
//     setCategoryName("");
//     setCategoryCode("");
//     setRowData("");
//     setError({
//       groupIdError: "",
//       categoryNameError: "",
//       assetTypeError: "",
//       categoryCodeError: "",
//     });
//   };
//   const checkMandatory = () => {
//     let flag = true;
//     let obj = {};

//     if (groupId == "") {
//       flag = false;
//       obj.groupIdError = itemCategoryGroupAutocompletErrorMessage;
//     }
//     if (categoryName == "") {
//       flag = false;
//       obj.categoryNameError = itemCategoryCategoryNameTextfieldErrorMessage;
//     }
//     // if (categoryCode == "") {
//     //   flag = false;
//     //   obj.categoryCodeError = itemCategoryCodeErrorMessage;
//     // }
//     // if (assetType == "") {
//     //   flag = false;
//     //   obj.assetTypeError = itemCategoryAssetTypeRadioErrorMessage;
//     // }

//     setTimeout(() => {
//       setError(obj);
//     }, 1);

//     return flag;
//   };
//   const onSubmitData = async () => {
//     const isChecked = checkMandatory();
//     let requestStatus = "";
//     if (isChecked) {
//       isEditMode
//         ? (requestStatus = await dispatch(
//             updateItemCategory({
//               id: rowData.id,
//               groupId: groupId.id,
//               // categoryCode: categoryCode,
//               categoryName: categoryName,
//               // assetType: assetType,
//             })
//           ))
//         : (requestStatus = await dispatch(
//             createItemCategory({
//               groupId: groupId.id,
//               // categoryCode: categoryCode.trim(),
//               categoryName: categoryName.trim(),
//               // assetType: assetType,
//             })
//           ));
//       if (requestStatus.meta.requestStatus !== "rejected") {
//         clearState();
//         handleModalClose();
//       }
//     }
//   };
//   useEffect(() => {
//     dispatch(getAllItemCategory());
//     dispatch(getAllItemGroup());
//   }, []);

//   return (
//     <>
//       <SubHeadingComponent
//         onClickCreateButton={handlModalOpen}
//         subHeadingTitle={itemCategorySubHeadingTitle}
//         subHeadingButtonTitle={itemCategorySubHeadingButtonTitle}
//       />
//       <Dialog open={isModalOpen} fullWidth maxWidth="md">
//         <ModalHeader
//           isEditMode={isEditMode}
//           modalHeaderTitle={itemCategoryModalHeaderTitle}
//           onClickCloseIcon={() => {
//             handleModalClose();
//             clearState();
//           }}
//         />
//         <DialogContent>
//           <Grid container spacing={3} className="section">
//             <Grid item md={6} lg={6} xs={12}>
//               <Autocomplete
//                 size="small"
//                 disablePortal
//                 id="combo-box-demo"
//                 value={groupId}
//                 options={itemGroups}
//                 getOptionLabel={(option) => option.groupName}
//                 onChange={(e, value) => {
//                   setGroupId(value);
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label={
//                       groupId === ""
//                         ? `${itemCategoryGroupAutocompletTitle} নির্বাচন করুন `
//                         : `${itemCategoryGroupAutocompletTitle}`
//                     }
//                   />
//                 )}
//               />
//               <FormHelperText error={groupId == "" && error.groupIdError}>
//                 {groupId == "" && error.groupIdError}
//               </FormHelperText>
//             </Grid>
//             <Grid item md={6} lg={6} xs={12}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 name="categoryName"
//                 value={categoryName}
//                 label={star(itemCategoryCategoryNameTextfieldTitle)}
//                 onChange={(e) => {
//                   setCategoryName(e.target.value);
//                 }}
//               />
//               <FormHelperText
//                 error={categoryName == "" && error.categoryNameError}
//               >
//                 {categoryName == "" && error.categoryNameError}
//               </FormHelperText>
//             </Grid>
//             {/* <Grid
//               itme
//               md={6}
//               lg={6}
//               xs={12}
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "flex-end",
//               }}
//             >
//               <FormControl component="fieldset">

//                 <RadioGroup
//                   row
//                   name="assetType"
//                   value={assetType}
//                   onChange={(e) => {
//                     setIsAssetType(e.target.value);
//                   }}
//                 >
//                   <FormControlLabel
//                     value={true}
//                     control={<Radio />}
//                     label={permanentAssetTitle}
//                   />
//                   <FormControlLabel
//                     value={false}
//                     control={<Radio />}
//                     label={nonPermanentAssetTitle}
//                   />
//                 </RadioGroup>
//               </FormControl>
//               <FormHelperText

//                 error={assetType == "" && error.assetTypeError}
//               >
//                 {assetType == "" &&
//                   error.assetTypeError &&
//                   error.assetTypeError}
//               </FormHelperText>
//             </Grid> */}
//             {/* <Grid item md={6} lg={6} xs={12}>
//               <TextField
//                 fullWidth
//                 size="small"
//                 name="categoryCode"
//                 value={categoryCode}
//                 label={star(itemCategoryCode)}
//                 onChange={(e) => {
//                   setCategoryCode(e.target.value);
//                 }}
//               />
//               <FormHelperText
//                 error={categoryCode == "" && error.categoryCodeError}
//               >
//                 {categoryCode == "" && error.categoryCodeError}
//               </FormHelperText>
//             </Grid> */}

//             <Grid container className="btn-container">
//               <Grid
//                 item
//                 md={12}
//                 lg={12}
//                 xs={12}
//                 sx={{ display: "flex", justifyContent: "center" }}
//               >
//                 <LoadingButton
//                   className="btn btn-save"
//                   variant="contained"
//                   loadingPosition="end"
//                   disabled={isLoading}
//                   loading={isLoading}
//                   onClick={onSubmitData}
//                 >
//                   {isEditMode ? updateButtonLabel : savButtonLabel}
//                 </LoadingButton>
//               </Grid>
//             </Grid>
//           </Grid>
//         </DialogContent>
//       </Dialog>
//       <Grid sx={{ width: "100%" }}>
//         {itemCategories.length > 0 ? (
//           <DataGrid
//             rows={itemCategories?.map((elm) => {
//               return {
//                 id: elm.id,
//                 groupId: elm.groupId,
//                 // categoryCode: elm.categoryCode,
//                 categoryName: elm.categoryName,
//                 // assetType: elm.isAsset,
//                 groupName: elm.groupName,
//               };
//             })}
//             columns={columns}
//             getRowId={(row) => row.id}
//             density="compact"
//             localeText={{
//               toolbarColumns: "",
//               toolbarFilters: "",
//               toolbarDensity: "",
//               toolbarExport: "",
//             }}
//             components={{
//               Toolbar: CustomToolbar,
//             }}
//             autoHeight={true}
//           ></DataGrid>
//         ) : (
//           ""
//         )}
//       </Grid>
//     </>
//   );
// };
// export default ItemCategory;
import { Autocomplete, Dialog, DialogContent, FormHelperText, Grid, TextField, Tooltip } from '@mui/material';
import useModalOpenClose from 'components/inventory/hooks/useModalOpenClose';
import SubHeadingComponent from 'components/inventory/utils/subHeadingComponent';
import {
  dataGridActionColumnName,
  dataGridSerialNumberTitle,
  itemCategoryCategoryNameTextfieldErrorMessage,
  itemCategoryCategoryNameTextfieldTitle,
  itemCategoryDataGridCategoryNameColumnTitle,
  itemCategoryDataGridGroupNameColumnTitle,
  itemCategoryGroupAutocompletErrorMessage,
  itemCategoryGroupAutocompletTitle,
  itemCategoryModalHeaderTitle,
  itemCategoryRowEditTitle,
  itemCategorySubHeadingButtonTitle,
  itemCategorySubHeadingTitle,
  savButtonLabel,
  updateButtonLabel
} from '../../../inventory/constants';

import { Edit } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import ModalHeader from 'components/inventory/utils/modalHeader';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { createItemCategory, getAllItemCategory, updateItemCategory } from 'features/inventory/category/categorySlice';
import { fetchAllItemGroup } from 'features/inventory/item-group/ItemGroupApi';
import { getAllItemGroup } from 'features/inventory/item-group/ItemGroupSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
export const ItemCategory = () => {
  const dispatch = useDispatch();
  const { itemCategories, isLoading } = useSelector((state) => state.itemCategory);
  const { itemGroups } = useSelector((state) => state.itemGroup);
  const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();

  const [isEditMode, setIsEditMode] = useState(false);
  const [groupId, setGroupId] = useState(undefined);
  const [categoryName, setCategoryName] = useState('');
  // const [setIsAssetType] = useState('');
  // const [setCategoryCode] = useState('');

  const [rowData, setRowData] = useState('');
  const [error, setError] = useState({
    groupIdError: '',
    categoryNameError: '',
    assetTypeError: '',
    categoryCodeError: '',
  });
  'error', error;
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
      headerName: itemCategoryDataGridGroupNameColumnTitle,
      field: 'groupName',
      width: 420,
      filterable: true,
    },
    {
      headerName: itemCategoryDataGridCategoryNameColumnTitle,
      field: 'categoryName',
      width: 420,
      filterable: true,
      valueFormatter: (params) => {
        'parmas3', params;
      },
    },
    // {
    //   headerName: itemCategoryDataGridAssetTypeColumnTitle,
    //   field: "assetType",
    //   width: 100,
    //   filterable: true,
    //   valueFormatter: (params) => {
    //     return params.value ? permanentAssetTitle : nonPermanentAssetTitle;
    //   },
    // },
    // {
    //   headerName: itemCategoryDataGridCategoryCodeColumnTitle,
    //   field: "categoryCode",
    //   width: 100,
    //   filterable: true,
    // },
    {
      field: 'actions',
      type: 'actions',
      headerName: dataGridActionColumnName,
      width: 100,
      // cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <div key={row?.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip key={row?.id} title={itemCategoryRowEditTitle} placement="top-start">
              <Edit
                key={row?.id}
                className="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  const itemGroups = await fetchAllItemGroup();
                  setGroupId(itemGroups.data.find((elm) => elm.id == row.groupId));

                  setIsEditMode(true);
                  handlModalOpen();

                  // setIsAssetType(row.assetType);
                  setCategoryName(row.categoryName);
                  // setCategoryCode(row.categoryCode);
                  setRowData(row);
                }}
              ></Edit>
            </Tooltip>
          </div>,
        ];
      },
    },
  ]);
  const clearState = () => {
    setIsEditMode(false);

    setGroupId(undefined);
    // setIsAssetType('');
    setCategoryName('');
    // setCategoryCode('');
    setRowData('');
    setError({
      groupIdError: '',
      categoryNameError: '',
      assetTypeError: '',
      categoryCodeError: '',
    });
  };
  const checkMandatory = () => {
    let flag = true;
    let obj = {};

    if (groupId == '') {
      flag = false;
      obj.groupIdError = itemCategoryGroupAutocompletErrorMessage;
    }
    if (categoryName == '') {
      flag = false;
      obj.categoryNameError = itemCategoryCategoryNameTextfieldErrorMessage;
    }
    // if (categoryCode == "") {
    //   flag = false;
    //   obj.categoryCodeError = itemCategoryCodeErrorMessage;
    // }
    // if (assetType == "") {
    //   flag = false;
    //   obj.assetTypeError = itemCategoryAssetTypeRadioErrorMessage;
    // }

    setTimeout(() => {
      setError(obj);
    }, 1);

    return flag;
  };
  const onSubmitData = async () => {
    const isChecked = checkMandatory();
    let requestStatus = '';
    if (isChecked) {
      isEditMode
        ? (requestStatus = await dispatch(
          updateItemCategory({
            id: rowData.id,
            groupId: groupId.id,
            // categoryCode: categoryCode,
            categoryName: categoryName,
            // assetType: assetType,
          }),
        ))
        : (requestStatus = await dispatch(
          createItemCategory({
            groupId: groupId.id,
            // categoryCode: categoryCode.trim(),
            categoryName: categoryName.trim(),
            // assetType: assetType,
          }),
        ));
      if (requestStatus.meta.requestStatus !== 'rejected') {
        clearState();
        handleModalClose();
      }
    }
  };
  useEffect(() => {
    dispatch(getAllItemCategory());
    dispatch(getAllItemGroup());
  }, []);
  return (
    <>
      <SubHeadingComponent
        onClickCreateButton={handlModalOpen}
        subHeadingTitle={itemCategorySubHeadingTitle}
        subHeadingButtonTitle={itemCategorySubHeadingButtonTitle}
      />
      <Dialog open={isModalOpen} fullWidth maxWidth="md">
        <ModalHeader
          isEditMode={isEditMode}
          modalHeaderTitle={itemCategoryModalHeaderTitle}
          onClickCloseIcon={() => {
            handleModalClose();
            clearState();
          }}
        />
        <DialogContent>
          <Grid container spacing={3} className="section">
            <Grid item md={6} lg={6} xs={12}>
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                value={groupId}
                options={itemGroups}
                getOptionLabel={(option) => option.groupName}
                onChange={(e, value) => {
                  setGroupId(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      groupId === ''
                        ? `${itemCategoryGroupAutocompletTitle} নির্বাচন করুন `
                        : `${itemCategoryGroupAutocompletTitle}`
                    }
                  />
                )}
              />
              <FormHelperText error={groupId == '' && error.groupIdError}>
                {groupId == '' && error.groupIdError}
              </FormHelperText>
            </Grid>
            <Grid item md={6} lg={6} xs={12}>
              <TextField
                fullWidth
                size="small"
                name="categoryName"
                value={categoryName}
                label={star(itemCategoryCategoryNameTextfieldTitle)}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              />
              <FormHelperText error={categoryName == '' && error.categoryNameError}>
                {categoryName == '' && error.categoryNameError}
              </FormHelperText>
            </Grid>
            {/* <Grid
              itme
              md={6}
              lg={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <FormControl component="fieldset">
           
                <RadioGroup
                  row
                  name="assetType"
                  value={assetType}
                  onChange={(e) => {
                    setIsAssetType(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label={permanentAssetTitle}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label={nonPermanentAssetTitle}
                  />
                </RadioGroup>
              </FormControl>
              <FormHelperText
     
                error={assetType == "" && error.assetTypeError}
              >
                {assetType == "" &&
                  error.assetTypeError &&
                  error.assetTypeError}
              </FormHelperText>
            </Grid> */}
            {/* <Grid item md={6} lg={6} xs={12}>
              <TextField
                fullWidth
                size="small"
                name="categoryCode"
                value={categoryCode}
                label={star(itemCategoryCode)}
                onChange={(e) => {
                  setCategoryCode(e.target.value);
                }}
              />
              <FormHelperText
                error={categoryCode == "" && error.categoryCodeError}
              >
                {categoryCode == "" && error.categoryCodeError}
              </FormHelperText>
            </Grid> */}

            <Grid container className="btn-container">
              <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <LoadingButton
                  className="btn btn-save"
                  variant="contained"
                  loadingPosition="end"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={onSubmitData}
                >
                  {isEditMode ? updateButtonLabel : savButtonLabel}
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid sx={{ width: '100%' }}>
        {itemCategories.length > 0 ? (
          <DataGrid
            rows={itemCategories?.map((elm) => {
              return {
                id: elm.id,
                groupId: elm.groupId,
                // categoryCode: elm.categoryCode,
                categoryName: elm.categoryName,
                // assetType: elm.isAsset,
                groupName: elm.groupName,
              };
            })}
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
};
export default ItemCategory;
