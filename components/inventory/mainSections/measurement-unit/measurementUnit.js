import {
  Dialog,
  DialogContent,
  FormControl,
  // FormLabel,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import useModalOpenClose from 'components/inventory/hooks/useModalOpenClose';
import SubHeadingComponent from 'components/inventory/utils/subHeadingComponent';
import {
  dataGridActionColumnName,
  dataGridSerialNumberTitle,
  itemGroupRowEditTitle,
  measurementIsActiveTitle,
  measurementIsInActiveTitle,
  measurementModalHeaderTitle,
  measurementSubHeadingButtonTitle,
  measurementSubHeadingTitle,
  measurementUnitDataGridMeasurementNameTitle,
  measurementUnitIsActiveErrorMessage,
  measurementUnitNameErrorMessage,
  measurementUnitNameTextFieldTitle,
  // measurementIsActiveRadioFieldTitle,
  savButtonLabel,
  updateButtonLabel,
} from '../../../inventory/constants';

import { Edit } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import ModalHeader from 'components/inventory/utils/modalHeader';
import star from 'components/mainSections/loan-management/loan-application/utils';
import {
  engToBang,
} from 'components/mainSections/samity-managment/member-registration/validator';
import {
  createMeasurementUnit,
  getAllMeasurementUnit,
  updataeMeasurementUnit,
} from 'features/inventory/measurementUnit/measurementUnitSlice';
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

export const MesaurmentUnit = () => {
  const dispatch = useDispatch();
  const { allMeasurementUnits, isLoading } = useSelector((state) => state.measurementUnit);

  const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();

  const [isEditMode, setIsEditMode] = useState(false);
  const [unitName, setUnitName] = useState('');
  const [isActive, setIsActive] = useState('');
  const [rowData, setRowData] = useState('');
  const [error, setError] = useState({
    unitNameError: '',
    isActiveError: '',
  });

  const [columns] = useState([
    {
      headerName: dataGridSerialNumberTitle,
      width: 100,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (index) => {
        'index', index;
        return engToBang(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      headerName: measurementUnitDataGridMeasurementNameTitle,
      field: 'mouName',
      width: 700,
      filterable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: dataGridActionColumnName,
      width: 300,
      // cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <div key={row?.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={itemGroupRowEditTitle} placement="top-start">
              <Edit
                className="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setIsEditMode(true);
                  handlModalOpen();
                  setUnitName(row.mouName);
                  setIsActive(row.isActive);
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
    setUnitName('');
    setIsActive('');
    setError({
      unitNameError: '',
      isActive: '',
    });
  };
  const checkMandatory = () => {
    let flag = true;
    let obj = {};

    if (unitName === '') {
      flag = false;
      obj.unitNameError = measurementUnitNameErrorMessage;
    }

    if (isActive === '') {
      flag = false;
      obj.isActiveError = measurementUnitIsActiveErrorMessage;
    }

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
          updataeMeasurementUnit({
            unitName: unitName.toString().trim(),
            id: rowData.id,
            isActive: isActive,
          }),
        ))
        : (requestStatus = await dispatch(
          createMeasurementUnit({
            unitName: unitName.toString().trim(),
            isActive: isActive,
          }),
        ));

      if (requestStatus.meta.requestStatus !== 'rejected') {
        clearState();
        handleModalClose();
      }
    }
  };
  useEffect(() => {
    dispatch(getAllMeasurementUnit());
  }, []);
  return (
    <>
      <SubHeadingComponent
        onClickCreateButton={handlModalOpen}
        subHeadingTitle={measurementSubHeadingTitle}
        subHeadingButtonTitle={measurementSubHeadingButtonTitle}
      />
      <Dialog open={isModalOpen} fullWidth maxWidth="md">
        <ModalHeader
          isEditMode={isEditMode}
          modalHeaderTitle={measurementModalHeaderTitle}
          onClickCloseIcon={() => {
            handleModalClose();
            clearState();
          }}
        />
        <DialogContent>
          <Grid container spacing={3} className="section">
            <Grid item md={6} lg={6} xs={12}>
              <TextField
                fullWidth
                size="small"
                name="unitName"
                value={unitName}
                label={star(measurementUnitNameTextFieldTitle)}
                onChange={(e) => {
                  setUnitName(e.target.value);
                }}
              />
              <FormHelperText error={unitName == '' && error.unitNameError}>
                {unitName == '' && error.unitNameError}
              </FormHelperText>
            </Grid>
            <Grid
              itme
              md={6}
              lg={6}
              xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}
            >
              <FormControl component="fieldset">
                {/* <FormLabel>{measurementIsActiveRadioFieldTitle}</FormLabel> */}
                <RadioGroup
                  row
                  name="activeStatus"
                  value={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.value);
                  }}
                >
                  <FormControlLabel value={true} control={<Radio />} label={measurementIsActiveTitle} />
                  <FormControlLabel value={false} control={<Radio />} label={measurementIsInActiveTitle} />
                </RadioGroup>
              </FormControl>
              <FormHelperText
                // sx={{
                //   display: "flex",
                //   justifyContent: "start",
                //   alignItems: "flex-end",
                // }}
                error={isActive == '' && error.isActiveError}
              >
                {isActive == '' && error.isActiveError && error.isActiveError}
              </FormHelperText>
            </Grid>
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
        {allMeasurementUnits.length > 0 ? (
          <DataGrid
            rows={allMeasurementUnits?.map((elm) => {
              return {
                id: elm.id,
                mouName: elm.mouName,
                isActive: elm.isActive,
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
export default MesaurmentUnit;
