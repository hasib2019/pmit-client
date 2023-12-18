import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Loader from 'components/Loader';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';
import { liveIp } from 'config/IpAddress';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import engToBdNum from 'service/englishToBanglaDigit';
import { useImmer } from 'use-immer';
import { errorHandler } from './../../../service/errorHandler';
const CreatePurpose = () => {
  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      align: 'center',
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'categoryName',
      headerName: 'ঋণের উদ্দেশ্যের শ্রেণীর নাম',
      editable: true,
    },
    {
      field: 'subCategoryName',
      headerName: 'ঋণের উদ্দেশ্যের উপশ্রেণীর নাম',
      width: 350,
    },
    {
      field: 'purposeName',
      headerName: ' ঋণের উদ্দেশ্যের নাম',
      width: 350,
    },
    {
      field: 'status',
      headerName: 'অবস্থা',
      width: 150,
    },

    {
      field: 'action',
      headerName: '',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      type: 'actions',
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="table-icon edit"
              onClick={() => {
                handleEdit(
                  params.row.id,
                  params.row.categoryId,
                  params.row.subCategoryId,
                  params.row.purposeName,
                  params.row.status,
                );
                handleUpdateModal();
              }}
            />
            <DeleteIcon className="table-icon delete" />
          </>
        );
      },
    },
  ];

  //data for create
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useImmer({
    categoryId: 0,
    subCategoryId: 0,
    purposeName: '',
    catErr: false,
    subCatErr: false,
    purposeErr: false,
  });
  const [tableData, setTableData] = useImmer();
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [subCatList, setSubcatList] = useState();
  const [dataGrid, setDataGrid] = useState();

  //data for update
  const [updateOpen, setUpdateopen] = useState(false);
  const [catId, setCatId] = useState(null);
  const [subCatId, setsubCatId] = useState(null);

  //functions for create
  const handleClose = () => {
    setCreateOpen(false);
    setUpdateopen(false);
    setCreateData({
      categoryId: 0,
      subCategoryId: 0,
      purposeName: '',
      catErr: false,
      subCatErr: false,
      purposeErr: false,
    });
  };
  const openCreateModal = () => {
    setCreateOpen(true);
  };
  const selectCatData = (e) => {
    setCreateData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      catErr: e.target.value == 10000 ? true : false,
      subCatErr: e.target.value == 10000 ? true : false,
    }));
    if (e.target.value == 10000) {
      setSubcatList([]);
      setCreateData((prev) => ({ ...prev, subCategoryId: 10000 }));
      return;
    }
    let temp = tableData.filter((item) => item.id == e.target.value);
    setSubcatList(temp[0].subCategories);
    setCreateData((prev) => ({ ...prev, subCategoryId: 10000 }));
  };
  const selectSubCatdata = (e) => {
    setCreateData({
      ...createData,
      [e.target.name]: e.target.value,
      subCatErr: e.target.value == 10000 ? true : false,
    });
  };
  const setPurpose = (e) => {
    setCreateData({
      ...createData,
      [e.target.name]: e.target.value,
      purposeErr: e.target.value == '' ? true : false,
    });
  };
  const submitData = () => {
    let error = false;
    if (createData.categoryId == 10000) {
      setCreateData((prev) => ({ ...prev, catErr: true }));
      error = true;
      NotificationManager.error('', 'ক্যাটাগরির নাম নির্বাচন লিখুন', 2000);
    }

    if (createData.subCategoryId == 10000) {
      setCreateData((prev) => ({ ...prev, subCatErr: true }));
      NotificationManager.error('', 'সাব ক্যাটাগরির নাম নির্বাচন লিখুন', 2000);
      error = true;
    }

    if (createData.purposeName == '') {
      setCreateData((prev) => ({ ...prev, purposeErr: true }));
      NotificationManager.error('', 'উদ্দেশ্যের নাম লিখুন', 2000);
      error = true;
    }

    if (error == true) return;

    let data = { ...createData };
    delete data.catErr;
    delete data.subCatErr;
    delete data.purposeErr;
    axios
      .post(`${liveIp}loan-purpose/create-loan-purpose`, data)
      .then(() => {
        NotificationManager.success('Success message', 'ডাটা সংযুক্ত হয়েছে', 5000);
        setToggle(!toggle);
        handleClose();
        setCreateData({
          categoryId: 0,
          subCategoryId: 0,
          purposeName: '',
          catErr: false,
          subCatErr: false,
          purposeErr: false,
        });
      })
      .catch((err) => errorHandler(err));
  };

  //function for update
  const handleUpdateModal = () => {
    setUpdateopen(true);
  };
  const handleEdit = (id, catid, subcatid, purposeName, isActive) => {
    setCatId(catid);
    setsubCatId(subcatid);
    setCreateData({
      ...createData,
      id: id,
      categoryId: catid,
      subCategoryId: subcatid,
      purposeName: purposeName,
      isActive: isActive,
    });
    let temp = tableData.filter((item) => item.id == catid);
    setSubcatList(temp[0].subCategories);
  };
  const ChangeStatus = (e) => {
    setCreateData({ ...createData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${liveIp}loan-purpose/get-category`)
      .then((res) => {
        setTableData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
        errorHandler(err);
      });

    axios
      .get(`${liveIp}loan-purpose/get-loan-purpose`)
      .then((res) => {
        setDataGrid(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        errorHandler(err);
      });
  }, [toggle]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <SubHeading>ঋণের উদ্দেশ্যের শ্রেণি ও তালিকা</SubHeading>
        <Button
          className="btn btn-primary"
          onClick={() => {
            openCreateModal();
          }}
        >
          ঋণের উদ্দেশ্যে তৈরি
          <AddIcon sx={{ marginLeft: '.5rem' }} />
        </Button>

        <DataGrid
          // className= "table-container"
          sx={{ marginTop: '2rem' }}
          autoHeight
          rows={dataGrid}
          columns={column}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
          pageSizeOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
          localeText={{
            toolbarColumns: '',
            toolbarFilters: '',
            toolbarDensity: '',
            toolbarExport: '',
          }}
        />
      </Box>

      <Dialog open={createOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>ঋণের উদ্দেশ্যে তৈরি</span>{' '}
          <ClearIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleClose} />{' '}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '45%', marginTop: '25px', marginRight: '10px' }} fullWidth>
                <InputLabel id="demo-simple-select-label">{star('ঋণের উদ্দেশ্যের শ্রেণীর নাম')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={createData?.categoryId || 10000}
                  name="categoryId"
                  label={star('ঋণের উদ্দেশ্যের শ্রেণীর নাম')}
                  error={createData.catErr}
                  onChange={(e) => selectCatData(e)}
                  className="select"
                  defaultValue="--নির্বাচন করুন--"
                >
                  <MenuItem value={10000}> --নির্বাচন করুন-- </MenuItem>
                  {tableData &&
                    tableData.map((item, index) => {
                      return (
                        <MenuItem value={item.id} key={index}>
                          {item.categoryName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '45%', marginTop: '25px' }} fullWidth>
                <InputLabel id="demo-simple-select-label">{star('ঋণের উদ্দেশ্যের উপশ্রেণীর নাম')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={createData?.subCategoryId || 10000}
                  name="subCategoryId"
                  label={star('ঋণের উদ্দেশ্যের উপশ্রেণীর নাম')}
                  error={createData?.subCatErr}
                  onChange={(e) => selectSubCatdata(e)}
                  className="select"
                >
                  <MenuItem value={10000}> --নির্বাচন করুন-- </MenuItem>

                  {subCatList &&
                    subCatList.map((item, index) => {
                      return (
                        <MenuItem value={item.id} key={index}>
                          {item.subCategoryName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={star('ঋণের উদ্দেশ্যের নাম')}
                size="small"
                variant="outlined"
                name="purposeName"
                value={createData?.purposeName || ''}
                sx={{ width: '45%', marginTop: '25px' }}
                error={createData?.purposeErr}
                onChange={(e) => setPurpose(e)}
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button className="btn btn-primary" onClick={submitData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সাবমিট করুন
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={updateOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>ঋণের উদ্দেশ্য সংশোধন</span>{' '}
          <ClearIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleClose} />{' '}
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ width: '45%', marginTop: '25px', marginRight: '10px' }}>
            <InputLabel id="demo-simple-select-label">{star('ঋণের উদ্দেশ্যের শ্রেণীর নাম')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={createData?.categoryId || catId}
              name="categoryId"
              label={star('ঋণের উদ্দেশ্যের শ্রেণীর নাম')}
              error={createData.catErr}
              onChange={(e) => selectCatData(e)}
              className="select"
              defaultValue="--নির্বাচন করুন--"
            >
              <MenuItem value={10000}> --নির্বাচন করুন-- </MenuItem>
              {tableData &&
                tableData.map((item, index) => {
                  return (
                    <MenuItem value={item.id} key={index}>
                      {item.categoryName}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <FormControl sx={{ width: '45%', marginTop: '25px' }}>
            <InputLabel id="demo-simple-select-label">{star('ঋণের উদ্দেশ্যের উপশ্রেণীর নাম')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={createData?.subCategoryId || subCatId}
              name="subCategoryId"
              label={star('ঋণের উদ্দেশ্যের উপশ্রেণীর নাম')}
              error={createData?.subCatErr}
              onChange={(e) => selectSubCatdata(e)}
              className="select"
            >
              <MenuItem value={10000}> --নির্বাচন করুন-- </MenuItem>

              {subCatList &&
                subCatList.map((item, index) => {
                  return (
                    <MenuItem value={item.id} key={index}>
                      {item.subCategoryName}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <TextField
            id="outlined-basic"
            label={star('ঋণের উদ্দেশ্যের নাম')}
            size="small"
            variant="outlined"
            name="purposeName"
            value={createData?.purposeName || ''}
            sx={{ width: '45%', marginTop: '25px' }}
            error={createData?.purposeErr}
            onChange={(e) => setPurpose(e)}
            style={{ marginRight: '10px' }}
          />

          <FormControl sx={{ width: '45%', marginTop: '25px' }}>
            <InputLabel id="demo-simple-select-label">অবস্থা</InputLabel>

            <Select
              labelId="demo-simple-select-label"
              value={createData?.isActive}
              name="isActive"
              label="অবস্থা"
              onChange={(e) => ChangeStatus(e)}
              className="select"
            >
              <MenuItem value={true}> Active </MenuItem>
              <MenuItem value={false}> InActive </MenuItem>
            </Select>
          </FormControl>

          <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              className="btn btn-primary"
              onClick={submitData}
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              সাবমিট করুন
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default CreatePurpose;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
