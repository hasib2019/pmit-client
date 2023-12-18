
import { Edit } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Dialog, DialogContent, FormHelperText, Grid, TextField, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import {
  dataGridActionColumnName,
  dataGridSerialNumberTitle,
  itemGroupDataGridGroupNameColumnTitle,
  itemGroupGroupNameErrorMessage,
  itemGroupGroupNameTextfieldTitle,
  itemGroupModalHeaderTitle,
  itemGroupRowEditTitle,
  itemGroupSubHeading,
  itemGroupSubHeadingButtonTitle,
  savButtonLabel,
  updateButtonLabel,
} from 'components/inventory/constants.js';
import useModalOpenClose from 'components/inventory/hooks/useModalOpenClose';
import star from 'components/mainSections/loan-management/loan-application/utils';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { createItemGroup, getAllItemGroup, updateItemGroup } from 'features/inventory/item-group/ItemGroupSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubHeadingComponent from '../../../inventory/utils/subHeadingComponent';
import ModalHeader from '../../utils/modalHeader';
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
const ItemGroup = () => {
  const { itemGroups, isLoading } = useSelector((state) => state.itemGroup);
  const dispatch = useDispatch();
  const { isModalOpen, handlModalOpen, handleModalClose } = useModalOpenClose();
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowData, setRowData] = useState('');
  const [itemGroupName, setItemGroupName] = useState('');
  const [nameError, setNameError] = useState('');
  const [columns] = useState([
    {
      headerName: dataGridSerialNumberTitle,
      width: 100,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (index) => {
        'index', index;
        return engToBang(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      headerName: itemGroupDataGridGroupNameColumnTitle,
      field: 'groupName',
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
          <div key={row.groupName} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={itemGroupRowEditTitle} placement="top-start">
              <Edit
                className="edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setIsEditMode(true);
                  handlModalOpen();
                  setItemGroupName(row.groupName);
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
    setItemGroupName('');
    isEditMode && setIsEditMode(false);
    const rowDataType = typeof rowData;
    rowDataType == 'object' && setRowData('');
    nameError && setNameError('');
  };
  const closeModal = () => {
    handleModalClose();
  };
  const checkMandatory = () => {
    let flag = true;
    // let obj = {};

    if (itemGroupName == '') {
      flag = false;
      setNameError(itemGroupGroupNameErrorMessage);
    }

    return flag;
  };
  const onSubmitData = async () => {
    const isChecked = checkMandatory();
    let requestStatus = '';

    if (isChecked) {
      isEditMode
        ? (requestStatus = await dispatch(
          updateItemGroup({
            groupName: itemGroupName.toString().trim(),
            id: rowData.id,
          }),
        ))
        : (requestStatus = await dispatch(createItemGroup(itemGroupName.toString().trim())));
      if (requestStatus.meta.requestStatus !== 'rejected') {
        clearState();
        closeModal();
      }
    }
  };
  useEffect(() => {
    dispatch(getAllItemGroup());
  }, []);
  return (
    <>
      <SubHeadingComponent
        onClickCreateButton={handlModalOpen}
        subHeadingTitle={itemGroupSubHeading}
        subHeadingButtonTitle={itemGroupSubHeadingButtonTitle}
      />

      <Dialog open={isModalOpen} fullWidth maxWidth="md">
        <ModalHeader
          isEditMode={isEditMode}
          modalHeaderTitle={itemGroupModalHeaderTitle}
          onClickCloseIcon={() => {
            handleModalClose(), clearState();
          }}
        />
        <DialogContent>
          <Grid container spacing={3} className="section">
            <Grid item md={12} lg={12} sm={12} xs={12}>
              <TextField
                label={star(itemGroupGroupNameTextfieldTitle)}
                fullWidth
                size="small"
                name="itemGroupName"
                value={itemGroupName}
                onChange={(e) => {
                  setItemGroupName(e.target.value);
                }}
              />
              <FormHelperText error={itemGroupName == '' && nameError}>
                {itemGroupName == '' && nameError && itemGroupGroupNameErrorMessage}
              </FormHelperText>
            </Grid>

            <Grid container className="btn-container">
              <Grid item md={12} lg={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
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
        {itemGroups.length > 0 ? (
          <DataGrid
            rows={itemGroups?.map((group) => {
              return {
                id: group.id,
                groupName: group.groupName,
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
          />
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};
export default ItemGroup;
