import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';
import { liveIp } from 'config/IpAddress';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import engToBdNum from 'service/englishToBanglaDigit';
import { errorHandler } from './../../../service/errorHandler';

const CreateProject = () => {
  const column = [
    {
      field: 'id',
      headerName: 'ক্রমিক নং',
      width: 150,
      align: 'center',
      renderCell: (params) => {
        return engToBdNum(params.row.id);
      },
    },
    {
      field: 'categoryName',
      headerName: 'ঋণের উদ্দেশ্যের শ্রেণীর নাম',
      width: 250,
      editable: true,
    },
    {
      field: 'subCategoryName',
      headerName: 'ঋণের উদ্দেশ্যের উপশ্রেণীর নাম',
      width: 250,
    },
    {
      field: 'purposeName',
      headerName: 'ঋণের উদ্দেশ্য',
      width: 250,
    },
    {
      field: 'action',
      headerName: 'বরাদ্দ',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 60,
      type: 'actions',
      renderCell: (params) => {
        return (
          <>
            <Checkbox
              sx={{ cursor: 'pointer' }}
              checked={params.row.checkStatus}
              onChange={() => handleCheck(params.row.id)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </>
        );
      },
    },
  ];

  // const [createModal, setCreateModal] = useState(false);
  const [project, setProject] = useState();
  const [projectId, setProjectId] = useState();
  const [dataGridArr, setDataGridArr] = useState([]);

  const handleChange = (e) => {
    setProjectId(e.target.value);
    if (e.target.value == 0) {
      setDataGridArr([]);
      return;
    }
    findProjects(e.target.value);
  };
  const findProjects = (id) => {
    axios
      .get(`${liveIp}loan-purpose/get-loan-purpose-mapping?projectId=${id}`)
      .then((res) => {
        let dataArr = res.data.data.map((item, index) => {
          return { ...item, checkStatus: item.status, id: index + 1 };
        });

        setDataGridArr(dataArr);
      })
      .catch((err) => {
        errorHandler(err);
      });
  };
  const handleCheck = (id) => {
    let temp = dataGridArr.map((item) => {
      if (item.id == id) {
        return { ...item, checkStatus: !item.checkStatus };
      }
      return item;
    });

    setDataGridArr(temp);
  };
  const handleSubmit = () => {
    if (projectId == 0) {
      NotificationManager.error('Error message', 'প্রকল্প নির্বাচন করুন', 5000);
      return;
    }
    NotificationManager.success('Success message', 'ডাটা সংযুক্ত হয়েছে', 5000);
  };
  useEffect(() => {
    axios.get(`${liveIp}master/project/`).then((res) => {
      setProject(res.data.data);
      findProjects(res.data.data[0].id);
      setProjectId(res.data.data[0].id);
    });
  }, []);

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <SubHeading>ঋণের উদ্দেশ্যের শ্রেণি ও তালিকা</SubHeading>
        <Box>
          <FormControl sx={{ width: '45%', marginTop: '25px', marginRight: '10px' }}>
            <InputLabel id="demo-simple-select-label">{star('প্রকল্প বা কর্মসূচীর নাম')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={projectId || 0}
              name="projectId"
              label={star('প্রকল্প বা কর্মসূচীর নাম')}
              onChange={(e) => {
                handleChange(e);
              }}
              className="select"
              defaultValue="--নির্বাচন করুন--"
            >
              <MenuItem value={0}> --নির্বাচন করুন-- </MenuItem>
              {project &&
                project.map((item, i) => {
                  return <MenuItem key={i} value={item.id}> {item.projectNameBangla} </MenuItem>;
                })}
            </Select>
          </FormControl>

          {dataGridArr.length > 0 && (
            <DataGrid
              sx={{ marginTop: '2rem' }}
              autoHeight="ture"
              rows={dataGridArr}
              columns={column}
              components={{ Toolbar: GridToolbar }}
              pageSize={10}
              experimentalFeatures={{ newEditingApi: true }}
              localeText={{
                toolbarColumns: '',
                toolbarFilters: '',
                toolbarDensity: '',
                toolbarExport: '',
              }}
            />
          )}
        </Box>

        <div className="btn-container">
          <Button
            sx={{ margin: 'auto' }}
            className="btn btn-primary"
            onClick={handleSubmit}
            startIcon={<SaveOutlinedIcon />}
          >
            {' '}
            সাবমিট করুন
          </Button>
        </div>
      </Box>
    </Fragment>
  );
};

export default CreateProject;
