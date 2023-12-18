import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AssignmentIcon from '@mui/icons-material/Assignment';

import {
  Box,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
// import AppTitle from '../../../shared/others/AppTitle';
// import Styles from 'components/mainSections/adminstration/fo-setup/foSetup.module.css';
import {
  dataGridSerialNumberTitle,
  doptorComponentHeadingTitle,
  doptorSelectionComponentColumn1Title,
  doptorSelectionComponentColumn2Title,
} from '../../constants';
// import { onDoptorSelection, onDoptorUnSelection } from '../../../../features/inventory/item/itemSlice';
import { tableCellClasses } from '@mui/material/TableCell';
import SubHeading from 'components/shared/others/SubHeading';
import { useDispatch } from 'react-redux';
import { getAllDoptors } from '../../../../features/inventory/item/itemSlice';
// import lodash from 'lodash';
import { useFormikContext } from 'formik';
// import { array } from 'joi';
import { bangToEng, engToBang } from 'service/numberConverter';
const regex = /[০-৯.,0-9]$/;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.grey,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));
const DoptorSelectionComponent = () => {
  const formik = useFormikContext();
  const { values, setFieldValue, touched, errors } = formik;
  const dispatch = useDispatch();
  const handleCheckAccepted = (isSelected, i) => {
    const arrayCopy = [...values.doptorAndFixedAssetInfos];
    arrayCopy[i].isSelected = !isSelected;
    setFieldValue('doptorAndFixedAssetInfos', arrayCopy);
  };
  useEffect(() => {
    dispatch(getAllDoptors());
  }, []);

  return (
    <>
      <Paper>
        <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item lg={12} md={12} xs={12}>
            <Box>
              <SubHeading>{doptorComponentHeadingTitle}</SubHeading>

              <TableContainer className="table-container" sx={{ maxHeight: 'unset' }}>
                <Table aria-label="customized table" size="small">
                  <TableHead className="table-head">
                    <TableRow>
                      <StyledTableCell sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <ArrowCircleDownIcon sx={{ color: '#203239', fontSize: '16px' }} />
                          &nbsp;{dataGridSerialNumberTitle}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <AssignmentIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                          &nbsp; {doptorSelectionComponentColumn1Title}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 'bold' }}>
                        <span
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <AssignmentIcon sx={{ color: '#D82148', fontSize: '16px' }} />
                          &nbsp; {doptorSelectionComponentColumn2Title}
                        </span>
                      </StyledTableCell>
                      {values.isAsset === true ? (
                        <>
                          {' '}
                          <StyledTableCell>
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              মালামালের প্রিফিক্স
                            </span>
                          </StyledTableCell>
                          <StyledTableCell>
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              সিরিয়ালের দৈর্ঘ্য
                            </span>
                          </StyledTableCell>
                        </>
                      ) : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values?.doptorAndFixedAssetInfos?.length > 0
                      ? values?.doptorAndFixedAssetInfos?.map((doptorInfo, i) => (
                        <StyledTableRow key={doptorInfo.doptorId}>
                          <StyledTableCell scope="row">
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              {i + 1}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell scope="row">{doptorInfo.nameBn}</StyledTableCell>

                          <StyledTableCell scope="row">
                            <span
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Checkbox
                                name="isSelected"
                                checked={doptorInfo.isSelected}
                                onClick={() => {
                                  handleCheckAccepted(doptorInfo.isSelected, i);
                                }}
                              />
                            </span>
                          </StyledTableCell>
                          {values.isAsset === true ? (
                            <>
                              <StyledTableCell scope="row">
                                <span
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="prefix"
                                    value={values.doptorAndFixedAssetInfos[i]?.prefix}
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      const arrayCopy = [...values.doptorAndFixedAssetInfos];
                                      arrayCopy[i].prefix = value;
                                      setFieldValue('doptorAndFixedAssetInfos', arrayCopy);
                                    }}
                                    error={Boolean(
                                      touched.doptorAndFixedAssetInfos &&
                                      errors.doptorAndFixedAssetInfos &&
                                      touched.doptorAndFixedAssetInfos[i]?.prefix &&
                                      errors.doptorAndFixedAssetInfos[i]?.prefix,
                                    )}
                                  />
                                </span>
                              </StyledTableCell>
                              <StyledTableCell scope="row">
                                <span
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <TextField
                                    size="small"
                                    fullWidth
                                    name="slNumberLength"
                                    value={engToBang(values.doptorAndFixedAssetInfos[i]?.slNumberLength)}
                                    onChange={(e) => {
                                      const { value } = e.target;
                                      const engValue = bangToEng(value);
                                      if (regex.test(engValue) || e.target.value == '') {
                                        // const { value } = e.target;
                                        // setInputValue(value);
                                        const arrayCopy = [...values.doptorAndFixedAssetInfos];
                                        arrayCopy[i]['slNumberLength'] = engValue;
                                        setFieldValue('doptorAndFixedAssetInfos', arrayCopy);
                                      }
                                    }}
                                    error={Boolean(
                                      touched.doptorAndFixedAssetInfos &&
                                      errors.doptorAndFixedAssetInfos &&
                                      touched.doptorAndFixedAssetInfos[i]?.slNumberLength &&
                                      errors.doptorAndFixedAssetInfos[i]?.slNumberLength,
                                    )}
                                  />
                                </span>
                              </StyledTableCell>
                            </>
                          ) : null}
                        </StyledTableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default DoptorSelectionComponent;

// import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
// import AssignmentIcon from "@mui/icons-material/Assignment";

// import {
//   Box,
//   Checkbox,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import React, { useEffect, memo, useState } from "react";
// import AppTitle from "../../../shared/others/AppTitle";
// import Styles from "components/mainSections/adminstration/fo-setup/foSetup.module.css";
// import {
//   doptorComponentHeadingTitle,
//   dataGridSerialNumberTitle,
//   doptorSelectionComponentColumn1Title,
//   doptorSelectionComponentColumn2Title,
// } from "../../constants";
// import {
//   onDoptorSelection,
//   onDoptorUnSelection,
// } from "../../../../features/inventory/item/itemSlice";
// import { getAllDoptors } from "../../../../features/inventory/item/itemSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { tableCellClasses } from "@mui/material/TableCell";
// import SubHeading from "components/shared/others/SubHeading";
// import lodash from "lodash";
// import { isEqual } from "lodash";
// import { useFormikContext } from "formik";
// import { array } from "joi";
// const regex = /[০-৯.,0-9]$/;
// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.grey,
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));
// const DoptorSelectionComponent = memo(
//   ({ selectedDoptors, setFieldValue, touched, errors, goodsType, values }) => {
//     // const formik = useFormikContext();
//     // const { values, setFieldValue, touched, errors } = formik;

//     const dispatch = useDispatch();
//     const handleCheckAccepted = (isSelected, i) => {
//       const arrayCopy = lodash.cloneDeep(selectedDoptors);
//       arrayCopy[i].isSelected = !isSelected;
//       setFieldValue("doptorAndFixedAssetInfos", [...arrayCopy]);
//     };
//     useEffect(() => {
//       dispatch(getAllDoptors());
//     }, []);

//     return (
//       <>
//         <Paper>
//           <Grid
//             container
//             style={{ display: "flex", justifyContent: "space-between" }}
//           >
//             <Grid item lg={12} md={12} xs={12}>
//               <Box>
//                 <SubHeading>{doptorComponentHeadingTitle}</SubHeading>

//                 <TableContainer
//                   className="table-container"
//                   sx={{ maxHeight: "unset" }}
//                 >
//                   <Table aria-label="customized table" size="small">
//                     <TableHead className="table-head">
//                       <TableRow>
//                         <StyledTableCell sx={{ fontWeight: "bold" }}>
//                           <span
//                             style={{ display: "flex", alignItems: "center" }}
//                           >
//                             <ArrowCircleDownIcon
//                               sx={{ color: "#203239", fontSize: "16px" }}
//                             />
//                             &nbsp;{dataGridSerialNumberTitle}
//                           </span>
//                         </StyledTableCell>
//                         <StyledTableCell sx={{ fontWeight: "bold" }}>
//                           <span
//                             style={{ display: "flex", alignItems: "center" }}
//                           >
//                             <AssignmentIcon
//                               sx={{ color: "#D82148", fontSize: "16px" }}
//                             />
//                             &nbsp; {doptorSelectionComponentColumn1Title}
//                           </span>
//                         </StyledTableCell>
//                         <StyledTableCell sx={{ fontWeight: "bold" }}>
//                           <span
//                             style={{
//                               display: "flex",
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <AssignmentIcon
//                               sx={{ color: "#D82148", fontSize: "16px" }}
//                             />
//                             &nbsp; {doptorSelectionComponentColumn2Title}
//                           </span>
//                         </StyledTableCell>
//                         {goodsType === 163 ? (
//                           <>
//                             {" "}
//                             <StyledTableCell>
//                               <span
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 মালামালের প্রিফিক্স
//                               </span>
//                             </StyledTableCell>
//                             <StyledTableCell>
//                               <span
//                                 style={{
//                                   display: "flex",
//                                   justifyContent: "center",
//                                   alignItems: "center",
//                                 }}
//                               >
//                                 সিরিয়ালের দৈর্ঘ্য
//                               </span>
//                             </StyledTableCell>
//                           </>
//                         ) : null}
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {selectedDoptors?.length > 0
//                         ? selectedDoptors?.map((doptorInfo, i) => (
//                             <StyledTableRow key={doptorInfo.doptorId}>
//                               <StyledTableCell scope="row">
//                                 <span
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                   }}
//                                 >
//                                   {i + 1}
//                                 </span>
//                               </StyledTableCell>
//                               <StyledTableCell scope="row">
//                                 {doptorInfo.nameBn}
//                               </StyledTableCell>

//                               <StyledTableCell scope="row">
//                                 <span
//                                   style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                   }}
//                                 >
//                                   <Checkbox
//                                     name="isSelected"
//                                     checked={doptorInfo.isSelected}
//                                     onClick={(e) => {
//                                       handleCheckAccepted(
//                                         doptorInfo.isSelected,
//                                         i
//                                       );
//                                     }}
//                                   />
//                                 </span>
//                               </StyledTableCell>
//                               {goodsType === 163 ? (
//                                 <>
//                                   <StyledTableCell scope="row">
//                                     <span
//                                       style={{
//                                         display: "flex",
//                                         justifyContent: "center",
//                                       }}
//                                     >
//                                       <TextField
//                                         size="small"
//                                         fullWidth
//                                         name="prefix"
//                                         value={selectedDoptors[i]?.prefix}
//                                         onChange={(e) => {
//                                           const { value } = e.target;
//                                           const arrayCopy =
//                                             lodash.cloneDeep(selectedDoptors);
//                                           arrayCopy[i].prefix = value;
//                                           setFieldValue(
//                                             "doptorAndFixedAssetInfos",
//                                             [...arrayCopy]
//                                           );
//                                         }}
//                                         error={Boolean(
//                                           touched.doptorAndFixedAssetInfos &&
//                                             errors.doptorAndFixedAssetInfos &&
//                                             touched.doptorAndFixedAssetInfos[i]
//                                               ?.prefix &&
//                                             errors.doptorAndFixedAssetInfos[i]
//                                               ?.prefix
//                                         )}
//                                       />
//                                     </span>
//                                   </StyledTableCell>
//                                   <StyledTableCell scope="row">
//                                     <span
//                                       style={{
//                                         display: "flex",
//                                         justifyContent: "center",
//                                       }}
//                                     >
//                                       <TextField
//                                         size="small"
//                                         fullWidth
//                                         name="slNumberLength"
//                                         value={
//                                           selectedDoptors[i]?.slNumberLength
//                                         }
//                                         onChange={(e) => {
//                                           if (
//                                             regex.test(e.target.value) ||
//                                             e.target.value == ""
//                                           ) {
//                                             const { value } = e.target;
//                                             // setInputValue(value);
//                                             const arrayCopy =
//                                               lodash.cloneDeep(selectedDoptors);
//                                             arrayCopy[i]["slNumberLength"] =
//                                               value;
//                                             setFieldValue(
//                                               "doptorAndFixedAssetInfos",
//                                               [...arrayCopy]
//                                             );
//                                           }
//                                         }}
//                                         error={Boolean(
//                                           touched.doptorAndFixedAssetInfos &&
//                                             errors.doptorAndFixedAssetInfos &&
//                                             touched.doptorAndFixedAssetInfos[i]
//                                               ?.slNumberLength &&
//                                             errors.doptorAndFixedAssetInfos[i]
//                                               ?.slNumberLength
//                                         )}
//                                       />
//                                     </span>
//                                   </StyledTableCell>
//                                 </>
//                               ) : null}
//                             </StyledTableRow>
//                           ))
//                         : ""}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>
//       </>
//     );
//   },
//   (prevProps, nextProps) => {
//     return isEqual(prevProps.selectedDoptors, nextProps.selectedDoptors);
//   }
// );

// export default DoptorSelectionComponent;
