/* eslint-disable no-unused-vars */
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UseSentForApprovalStateAndFunctionalites from 'components/inventory/hooks/useSentForApprovalFunctionalitiesAndState/useSentForApprovalFunctionalitiesAndState';
import SentForApprovalComponent from 'components/inventory/utils/SentForApprovalComponent';
import UseOwnOfficesLayerAndOfficeObj from 'components/inventory/utils/UseOwnOfficesLayerAndOfficeObj';
import {
  checkIfMemberExistInTheMemory,
  getProductByProject,
  getProjects,
  getSamityByProject,
} from 'features/loan/dpsFdrMigration/dpsFdrMigrationSlice';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UploadExcelModalComponent from 'reusableComponents/loan/migration/UploadExcelModal';
import { bangToEng, engToBang } from 'service/numberConverter';
import star from '../loan-management/loan-application/utils';
const SelectField = ({ fieldName, handleChange, options, value }) => {
  return (
    <Select size="small" fullWidth name={fieldName} onChange={handleChange} value={value}>
      {options.map((option) => (
        <MenuItem key={option?.id} value={option}>
          {option?.productName}
        </MenuItem>
      ))}
    </Select>
  );
};
const UploadDpsFdr = () => {
  console.log('renderCaollllllllled');
  const dispatch = useDispatch();
  const { projects, samityList, products } = useSelector((state) => state.dpsAndFdrMigration);
  // eslint-disable-next-line no-empty-pattern
  const {} = UseOwnOfficesLayerAndOfficeObj();
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
  console.log('products', products);
  const [rows, setRows] = useState([]);
  console.log('rowwwwwwwwwwwwws', rows);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSamity, setSelectedSamity] = useState('');
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState({});
  const handleModalOpen = useCallback(() => {
    setOpen(true);
  });
  const handleModalClose = useCallback(() => {
    setOpen(false);
  });
  const handleChangeForProduct = (e, params) => {
    const { name, value } = e.target;
    const rowCopy = [...rows];
    const index = rows?.findIndex((row) => row?.index === params?.id);
    rowCopy[index] = { ...rowCopy[index], [name]: value };
    setRows(rowCopy);
  };
  const handleChangeForProject = (e) => {
    const { value } = e.target;
    setSelectedProject(value);
    dispatch(getSamityByProject({ projectId: value }));
    dispatch(getProductByProject({ projectId: value }));
  };
  const handleChangeForSamity = (e) => {
    const { value } = e.target;
    setSelectedSamity(value);
  };
  // const handleSubmit = async ()=>{

  // }
  const columns = useMemo(
    () => [
      {
        headerName: 'ক্রমিক নং',
        headerAlign: 'center',
        field: 'index',
        editable: false,
        type: 'number',
        width: 100,
        valueFormatter: (params) => {
          if (!params?.value) {
            return params?.value;
          }
          return engToBang(params?.value);
        },
      },
      {
        headerName: 'সদস্য কোড',
        headerAlign: 'center',
        align: 'center',
        field: 'customerOldCode',
        width: 140,
        editable: false,
        type: 'string',
        valueFormatter: (params) => {
          if (!params?.value) {
            return params?.value;
          }
          return engToBang(params?.value);
        },
      },
      {
        headerName: 'প্রোডাক্টের নাম',
        headerAlign: 'center',
        align: 'center',
        type: 'string',
        field: 'productName',
        width: 220,
        editable: true,
        renderCell: (params) => {
          const productData = products?.find((product) => {
            return product?.productName?.toString() === params?.value?.toString().trim();
          });

          return (
            <SelectField
              fieldName="productName"
              handleChange={(e) => {
                handleChangeForProduct(e, params);
              }}
              value={productData?.id ? productData : params?.value}
              options={products}
            />
          );
        },
      },
      {
        headerName: 'খোলার তারিখ',
        headerAlign: 'center',
        align: 'center',
        field: 'openingDate',
        type: 'date',
        width: 160,
        editable: true,
        valueFormatter: (params) => {
          const formatedDate = moment(params?.value).format('DD/MM/YYYY');
          return engToBang(formatedDate);
        },
        valueParser: (value, params) => {
          const rowCopy = [...rows];
          const index = rows?.findIndex((row) => row?.index === params?.id);
          rowCopy[index] = { ...rowCopy[index], openingDate: bangToEng(moment(value).format('DD/MM/YYYY')) };
          setRows(rowCopy);
          return value;
        },
      },
      {
        headerName: 'সঞ্চয় মেয়াদ (মাস)',
        editable: true,
        headerAlign: 'center',
        align: 'center',
        field: 'savingsTerm',
        type: 'number',
        width: 140,
        valueFormatter: (params) => {
          return engToBang(params?.value);
        },
        valueParser: (value, params) => {
          const rowCopy = [...rows];
          const index = rows?.findIndex((row) => row?.index === params?.id);
          rowCopy[index] = { ...rowCopy[index], savingsTerm: bangToEng(value) };
          setRows(rowCopy);
          return value;
        },
      },
      {
        headerName: 'জমা কিস্তি',
        headerAlign: 'center',
        align: 'center',
        field: 'depositInstallment',
        type: 'number',
        width: 120,
        editable: true,
        valueFormatter: (params) => {
          return engToBang(params?.value);
        },
        valueParser: (value, params) => {
          const rowCopy = [...rows];
          const index = rows?.findIndex((row) => row?.index === params?.id);
          rowCopy[index] = { ...rowCopy[index], depositInstallment: bangToEng(value) };
          setRows(rowCopy);
          return value;
        },
      },
      {
        headerName: 'মোট জমার পরিমাণ',
        editable: true,
        headerAlign: 'center',
        align: 'center',
        field: 'totalDepositAmount',
        type: 'number',
        width: 140,
        valueFormatter: (params) => {
          if (!params?.value) {
            return params?.value;
          }
          return engToBang(params?.value);
        },
        valueParser: (value, params) => {
          const rowCopy = [...rows];
          const index = rows?.findIndex((row) => row?.index === params?.id);
          rowCopy[index] = { ...rowCopy[index], totalDepositAmount: bangToEng(value) };
          setRows(rowCopy);
          return value;
        },
      },
      {
        headerName: 'পরিশেধিত পেনাল চার্জ',
        editable: true,
        headerAlign: 'center',
        field: 'paidPenal',
        align: 'center',
        type: 'number',
        width: 160,
        valueFormatter: (params) => {
          if (!params?.value) {
            return params?.value;
          }
          return engToBang(params?.value);
        },
        valueParser: (value, params) => {
          const rowCopy = [...rows];
          const index = rows?.findIndex((row) => row?.index === params?.id);
          rowCopy[index] = { ...rowCopy[index], paidPenal: bangToEng(value) };
          setRows(rowCopy);
          return value;
        },
      },
    ],
    [rows],
  );
  const headerMapping = {
    'Member Code': 'customerOldCode',
    'Product Name': 'productName',
    'Opening Date': 'openingDate',
    'Savings Term(Month)': 'savingsTerm',
    'Deposit Instalment': 'depositInstallment',
    'Total Deposit Amount': 'totalDepositAmount',
    'Paid Penal': 'paidPenal',
  };
  const handleStateAfterConvertingExcel = (obj) => {
    const dpsFdrArray = obj.map((m, index) => {
      return {
        ...m,
        index: index + 1,
        customerOldCode: bangToEng(m?.customerOldCode),
        openingDate: m?.openingDate ? moment(m.openingDate, 'DD/MM/YYYY').format('DD MMMM YYYY').toString() : '',
        savingsTerm: bangToEng(m?.savingsTerm),
        depositInstallment: bangToEng(m?.depositInstallment),
        totalDepositAmount: bangToEng(m?.totalDepositAmount),
        // disbursementAmount: bangToEng(m?.disbursementAmount),
        paidPenal: bangToEng(m?.paidPenal),
        productName: products?.find((product) => product?.productName === m.productName?.toString().trim()),
      };
    });

    setRows(dpsFdrArray);
    handleModalClose();
    const customerOldCodes = dpsFdrArray?.map((dpsFdr) => {
      return { customerOldCode: dpsFdr?.customerOldCode?.toString() };
    });
    const payloadForMemberCheck = {
      memberCodes: customerOldCodes,
      samityId: selectedSamity,
    };
    dispatch(checkIfMemberExistInTheMemory(payloadForMemberCheck));
  };
  useEffect(() => {
    dispatch(getProjects());
  }, []);
  return (
    <>
      <UploadExcelModalComponent
        headerMapping={headerMapping}
        handleStateAfterConvertingExcel={handleStateAfterConvertingExcel}
        open={open}
        handleModalClose={handleModalClose}
      />
      <Grid container spacing={2.5}>
        <Grid item md={12} xs={12} lg={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{
              mr: '5px',
            }}
            variant="outlined"
            onClick={handleModalOpen}
            disabled={!selectedProject || !selectedSamity}
          >
            এক্সেল আপলোড
          </Button>
          {rows.length > 0 ? (
            <Button
              // disabled={this.state.uploadButton}
              variant="outlined"
              onClick={() => {}}
            >
              সংরক্ষণ
            </Button>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel>{selectedProject ? star('প্রকল্পের নাম') : star('প্রকল্পের নাম নির্বাচন করুন')}</InputLabel>
            <Select
              size="small"
              required
              id={selectedProject}
              name="selectedProject"
              label={selectedProject ? star('প্রকল্পের নাম') : star('প্রকল্পের নাম নির্বাচন করুন')}
              value={selectedProject}
              onChange={handleChangeForProject}
            >
              {projects?.map((project) => (
                <MenuItem key={project?.id} value={project?.id}>
                  {project?.projectNameBangla}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel>{selectedSamity ? star('সামিতির নাম') : star('সামিতির নাম নির্বাচন করুন')}</InputLabel>
            <Select
              size="small"
              required
              id={selectedSamity}
              name="selectedSamity"
              label={selectedSamity ? star('সামিতির নাম') : star('সামিতির নাম নির্বাচন করুন')}
              value={selectedSamity}
              onChange={handleChangeForSamity}
            >
              {samityList?.map((samity) => (
                <MenuItem key={samity?.id} value={samity?.id}>
                  {samity?.samityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} lg={12} md={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact"
            getRowId={(row) => row.index}
            disableColumnFilter={true}
            disableColumnMenu={true}
            disableColumnSelector={true}
            disableDensitySelector={true}
            disableExtendRowFullWidth={true}
            disableIgnoreModificationsIfProcessingProps={true}
            // disableSelectionOnClick={true}
            disableVirtualization={true}
            autoHeight={true}
            pageSize={8}
          />
        </Grid>
        <Grid item md={12} lg={12} xs={12}>
          <SentForApprovalComponent {...senForApprovalPropsObj} formError={formError} />
        </Grid>
      </Grid>
    </>
  );
};
export default UploadDpsFdr;
