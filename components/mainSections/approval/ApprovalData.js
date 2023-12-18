import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import { Grid, TextField } from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import axios from 'axios';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { loanProject, pendingList, serviceName } from '../../../url/ApiList';
import star from '../loan-management/loan-application/utils';
export function ApprovalData() {
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [approvalInfo, setApprovalInfo] = useState({
    projectName: '',
    serviceId: '',
  });
  const [projectName, setProjectName] = useState([]);
  const [serviceNames, setServiceName] = useState([]);
  const router = useRouter();
  const config = localStorageData('config');
  const compoName = localStorageData('componentName');
  useEffect(() => {
    getPendingApprovalList();
    getServiceName();
    getProject();
  }, []);

  useEffect(() => {
    // setTableHead([
    //   ...tableHead,
    //   {
    //     headerName: "বিস্তারিত",
    //     width: 120,
    //     field: "actions",
    //     type: "actions",
    //     cellClassName: "actions",
    //     getActions: ({ row }) => (
    //       <WysiwygIcon
    //         className="view-icon"
    //         onClick={() => onGoingPage(item)}
    //       />
    //     ),
    //   },
    // ]);
  }, [tableData]);
  const getSamityRegisterFromProjectSheba = async (name, value) => {
    let getSamityRegisterData;
    try {
      if (name == 'projectName' && !approvalInfo.serviceId) {
        getSamityRegisterData = await axios.get(pendingList + '/' + compoName + '?projectId=' + Number(value), config);
        setTableHead([
          ...Object.keys(_.omit(getSamityRegisterData.data.data[0], 'id', 'serviceId', 'createdBy')).map((e) =>
            interceptor(e),
          ),
          {
            headerName: 'বিস্তারিত',
            field: 'serviceId',
            width: 150,
            flex: 1,
            align: 'center',

            renderCell: (params) => (
              <WysiwygIcon
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  'parmasss', params;
                  onGoingPage({
                    id: params.row.id,
                    serviceId: params.row.serviceId,
                  });
                }}
              />
            ),
          },
        ]);

        setTableData(
          getSamityRegisterData.data.data.map((e, i) => {
            e.index = i;
            return e;
          }),
        );
      } else if (name == 'serviceId' && approvalInfo.projectName) {
        getSamityRegisterData = await axios.get(
          pendingList +
            '/' +
            compoName +
            '?projectId=' +
            Number(approvalInfo.projectName) +
            '&serviceId=' +
            Number(value),
          config,
        );
        setTableHead([
          ...Object.keys(_.omit(getSamityRegisterData.data.data[0], 'id', 'serviceId', 'createdBy')).map((e) =>
            interceptor(e),
          ),
          {
            headerName: 'বিস্তারিত',
            field: 'serviceId',
            width: 150,
            flex: 1,
            align: 'center',

            renderCell: (params) => (
              <WysiwygIcon
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  onGoingPage({
                    id: params.row.id,
                    serviceId: params.row.serviceId,
                  });
                }}
              />
            ),
          },
        ]);

        setTableData(
          getSamityRegisterData.data.data.map((e, i) => {
            e.index = i;
            return e;
          }),
        );
      } else if (name == 'serviceId' && !approvalInfo.projectName) {
        getSamityRegisterData = await axios.get(pendingList + '/' + compoName + '?serviceId=' + Number(value), config);
        setTableHead([
          ...Object.keys(_.omit(getSamityRegisterData.data.data[0], 'id', 'serviceId', 'createdBy')).map((e) =>
            interceptor(e),
          ),
          {
            headerName: 'বিস্তারিত',
            field: 'serviceId',
            width: 150,
            flex: 1,
            align: 'center',

            renderCell: (params) => (
              <WysiwygIcon
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  'parmasss', params;
                  onGoingPage({
                    id: params.row.id,
                    serviceId: params.row.serviceId,
                  });
                }}
              />
            ),
          },
        ]);

        setTableData(
          getSamityRegisterData.data.data.map((e, i) => {
            e.index = i;
            return e;
          }),
        );
      } else if (name == 'projectName' && approvalInfo.serviceId) {
        getSamityRegisterData = await axios.get(
          pendingList +
            '/' +
            compoName +
            '?projectId=' +
            Number(value) +
            '&serviceId=' +
            Number(approvalInfo.serviceId),
          config,
        );
        setTableHead([
          ...Object.keys(_.omit(getSamityRegisterData.data.data[0], 'id', 'serviceId', 'createdBy')).map((e) =>
            interceptor(e),
          ),
          {
            headerName: 'বিস্তারিত',
            field: 'serviceId',
            width: 150,
            flex: 1,
            align: 'center',

            renderCell: (params) => (
              <WysiwygIcon
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  'parmasss', params;
                  onGoingPage({
                    id: params.row.id,
                    serviceId: params.row.serviceId,
                  });
                }}
              />
            ),
          },
        ]);

        setTableData(
          getSamityRegisterData.data.data.map((e, i) => {
            e.index = i;
            return e;
          }),
        );
      }

      //("SamityRegisterData", getSamityRegisterData.data.data);

      // setAllSamityData(getSamityRegisterData.data.data);
      // setFilterSamityData(getSamityRegisterData.data.data);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getProject = async () => {
    try {
      const project = await axios.get(loanProject, config);
      let projectList = project.data.data;
      setProjectName(projectList);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const getServiceName = async () => {
    try {
      const serviceNameData = await axios.get(serviceName + '/' + compoName, config);
      //("Service Name---", serviceNameData.data.data);
      setServiceName(serviceNameData.data.data);
    } catch (error) {
      'error found', error.message;
      if (error.response) {
        'error found', error.response.data;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value != 'নির্বাচন করুন') {
      getSamityRegisterFromProjectSheba(name, value);
    }
    setApprovalInfo({
      ...approvalInfo,
      [name]: value,
    });
  };
  const getPendingApprovalList = async () => {
    try {
      let data = await axios.get(pendingList + '/' + compoName, config);

      setTableHead([
        ...Object.keys(
          _.omit(
            data.data.data[0],
            'id',
            'serviceId',
            'createdBy',
            compoName === 'inventory' ? 'samityName' : '',
            compoName === 'inventory' ? 'projectNameBangla' : '',
          ),
        ).map((e) => interceptor(e)),
        {
          headerName: 'বিস্তারিত',
          field: 'serviceId',
          width: 150,
          flex: 1,
          align: 'center',
          headerAlign: 'center',
          renderCell: (params) => (
            <WysiwygIcon
              sx={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
              }}
              onClick={() => {
                console.log('paramsRow', params.row);
                onGoingPage({
                  id: params.row.id,
                  serviceId: params.row.serviceId,
                  serviceName: params.row?.serviceName,
                });
              }}
            />
          ),
        },
      ]);

      setTableData(
        data.data.data.map((e, i) => {
          e.index = i;
          return e;
        }),
      );
    } catch (ex) {
      //
    }
  };

  const onGoingPage = (payload) => {
    console.log('payload', payload);
    let base64Data = JSON.stringify({
      id: payload.id,
      serviceId: payload.serviceId,
      serviceName: payload?.serviceName,
    });
    base64Data = encodeURIComponent(base64Data);
    router.push({
      pathname: '/approval/approvalData',
      query: {
        data: base64Data,
      },
    });
  };
  function getProjectNameBangla(params) {
    return params.row.projectNameBangla ? params.row.projectNameBangla : 'বিদ্যমান নেই';
  }
  function getSamityNameBangla(params) {
    return params.row.samityName ? params.row.samityName : 'বিদ্যমান নেই';
  }
  function getDescriptionBangla(params) {
    return params.row.description ? params.row.description : 'বিদ্যমান নেই';
  }
  function interceptor(name) {
    'intercepName', name;
    if (name == 'projectNameBangla') {
      return {
        headerName: 'প্রকল্পের নাম',
        field: 'projectNameBangla',
        width: 150,
        valueGetter: getProjectNameBangla,
      };
    } else if (name == 'serviceName') {
      return {
        headerName: 'সেবা সমূহ',
        field: 'serviceName',
        width: 180,
      };
    } else if (name == 'samityName') {
      return {
        headerName: 'সমিতির নাম',
        field: 'samityName',
        width: 200,
        valueGetter: getSamityNameBangla,
      };
    } else if (name == 'description') {
      return {
        headerName: 'বর্ণনা',
        field: 'description',
        width: 250,
        valueGetter: getDescriptionBangla,
      };
    } else if (name == 'applicationDate') {
      return {
        headerName: 'আবেদনের তারিখ',
        field: 'applicationDate',
        width: 150,
      };
    } else if (name == 'sender') {
      return {
        headerName: 'আবেদনকারীর নাম',
        field: 'sender',
        width: 180,
      };
    }
  }
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
  return (
    <>
      <Grid container p={3}>
        {compoName !== 'inventory' ? (
          <Grid item md={6} xs={12} sm={12} sx={{ mb: 5, paddingRight: '10px' }}>
            <TextField
              fullWidth
              label={star('প্রকল্পের নাম')}
              name="projectName"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              variant="outlined"
              size="small"
              value={approvalInfo.projectName ? approvalInfo.projectName : ' '}
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {projectName
                ? projectName.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.projectNameBangla}
                    </option>
                  ))
                : ' '}
            </TextField>
            {/* {projectId=="নির্বাচন করুন" && <span style={{ color: "red" }}>{formErrors.samityName}</span>} */}
          </Grid>
        ) : null}

        <Grid item sm={12} md={6} xs={12} sx={{ mb: 5 }}>
          <TextField
            fullWidth
            label={star('সেবাসমূহের তালিকা')}
            name="serviceId"
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={approvalInfo.serviceId ? approvalInfo.serviceId : ' '}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {serviceNames.map((option) => (
              <option key={option.id} value={option.id}>
                {option.serviceName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={12} xs={12}>
          {tableData.length > 0 ? (
            <Grid sx={{ width: '100%' }}>
              <DataGrid
                rows={tableData}
                columns={tableHead}
                getRowId={(row) => row.index}
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
                // localeText={{
                //   filterOperatorIsNullOrNot: "is null or not",
                // }}
                // disableColumnFilter={true}
                // disableColumnMenu={true}
                // disableColumnSelector={true}
                // disableDensitySelector={true}
                // disableExtendRowFullWidth={true}
                // disableIgnoreModificationsIfProcessingProps={true}
                // disableSelectionOnClick={true}
                // disableVirtualization={true}
                autoHeight={true}
              />
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
}
export default ApprovalData;
