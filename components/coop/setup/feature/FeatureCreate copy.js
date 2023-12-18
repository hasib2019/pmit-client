/* eslint-disable no-misleading-character-class */
import { ArrowDropDown } from '@material-ui/icons';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { iconList } from 'service/IconList';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import iconProvider from 'service/icons';
import { GetFeature } from '../../../../url/common/ApiList';

const FeatureCreate = () => {
  const token = localStorageData('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-auth-type': 'DEV',
    },
  };
  const [createFeature, setCreateFeature] = useState({
    featureName: '',
    featureNameBan: '',
    iconId: '',
    url: '',
    type: '',
    parentId: '',
    isActive: '',
    position: '',
    isRoot: '',
    serialNo: '',
  });
  const [listFeature, setListFeature] = useState([]);
  const [update, setUpdate] = useState(false);
  const [serialNo, setSerialNo] = useState([]);
  const columns = [
    {
      headerName: 'ক্রমিক',
      width: 70,
      renderCell: (params) => params.api.getRowIndex(params.row.id) + 1,
    },
    {
      headerName: 'ফিচার নাম (বাংলা)',
      field: 'featureNameBan',
      width: 170,
    },
    {
      headerName: 'আইকন',
      field: 'iconId',
      width: 70,
      renderCell: ({ row }) => <span>{iconProvider(row.iconId)}</span>,
    },

    {
      headerName: 'লিংক',
      field: 'url',
      width: 130,
      editable: false,
    },
    {
      headerName: 'পজিশন',
      field: 'position',
      width: 70,
      editable: false,
    },
    {
      headerName: 'ডিসপ্লে নং',
      field: 'serialNo',
      width: 80,
      editable: false,
    },
    {
      headerName: 'ফিচারের ধরন',
      field: 'type',
      width: 100,
      editable: true,
    },
    {
      headerName: 'সচল কি/না',
      field: 'isActive',
      width: 100,
    },
    {
      headerName: 'রুট কি/না',
      field: 'isRoot',
      width: 100,
    },
    {
      headerName: 'সম্পাদন',
      field: '',
      width: 100,
    },
  ];

  useEffect(() => {
    getFeatureList();
  }, []);

  const getFeatureList = async () => {
    try {
      const getFeatureData = await axios.get(GetFeature + '?isPagination=false', config);
      let arrayData = getFeatureData.data.data;
      var obj = [...arrayData];
      obj.sort((a, b) => a.serialNo - b.serialNo);
      setListFeature(obj);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'type':
        if (value == 'P') {
          setCreateFeature({
            ...createFeature,
            [name]: value,
            parentId: '',
            serialNo: '',
          });
          setSerialNo('');
        }
        if (value == 'C') {
          setCreateFeature({
            ...createFeature,
            [name]: value,
          });
        }
        break;
      case 'featureName':
        setCreateFeature({
          ...createFeature,
          [name]: value.replace(/[^A-Z\s.-_]/gi, '').toUpperCase(),
        });
        break;
      case 'featureNameBan':
        setCreateFeature({
          ...createFeature,
          [name]: value.replace(
            /[^\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FA\s]/gi,
            '',
          ),
        });
        break;
      case 'parentId':
        if (value == 0) {
          setCreateFeature({
            ...createFeature,
            [name]: '',
          });
        } else {
          const allId = listFeature.filter((o) => o.parentId == parseInt(value));
          setSerialNo(allId.map((o) => o.serialNo));
          // setIconId(allId.map((o) => o.iconId));
          setCreateFeature({
            ...createFeature,
            [name]: value,
          });
        }
        break;
      case 'isActive':
        if (value == 0) {
          setCreateFeature({ ...createFeature, [name]: '' });
        } else {
          setCreateFeature({ ...createFeature, [name]: JSON.parse(value) });
        }
        break;
      case 'isRoot':
        if (value == 0) {
          setCreateFeature({ ...createFeature, [name]: '' });
        } else {
          setCreateFeature({ ...createFeature, [name]: JSON.parse(value) });
        }
        break;
      default:
        setCreateFeature({ ...createFeature, [name]: value });
        break;
    }
  };

  const onFeatureCreate = async (e) => {
    e.preventDefault();
    const payload = {
      featureName: createFeature.featureName,
      featureNameBan: createFeature.featureNameBan,
      iconId: createFeature.iconId,
      isActive: JSON.parse(createFeature.isActive),
      isRoot: JSON.parse(createFeature.isRoot),
      parentId: createFeature.parentId ? createFeature.parentId : null,
      position: createFeature.position,
      type: createFeature.type,
      url: createFeature.url,
      serialNo: createFeature.serialNo,
    };
    try {
      if (update) {
        await axios.put(GetFeature + '/' + createFeature.id, payload, config);
        getFeatureList();
      } else {
        await axios.post(GetFeature, payload, config);
        getFeatureList();
      }

      setCreateFeature({
        featureName: '',
        featureNameBan: '',
        iconId: '',
        url: '',
        type: '',
        parentId: '',
        isActive: '',
        position: '',
        isRoot: '',
        serialNo: '',
      });
      setUpdate(false);
      let successMsg = update ? 'সফলভাবে আপডেট হয়েছে।' : 'সফলভাবে ফিচার তৈরি হয়েছে';
      NotificationManager.success(successMsg, '', 5000);
    } catch (error) {
      errorHandler(error);
    }
  };

  const onClose = () => {
    setCreateFeature({
      featureName: '',
      featureNameBan: '',
      iconId: '',
      url: '',
      type: '',
      parentId: '',
      isActive: '',
      position: '',
      isRoot: '',
      serialNo: '',
    });
    setUpdate(false);
  };
  // let onHandleUpdate = (
  //   id,
  //   featureName,
  //   featureNameBan,
  //   iconId,
  //   url,
  //   type,
  //   parentId,
  //   isActive,
  //   position,
  //   isRoot,
  //   serialNo,
  // ) => {
  //   setUpdate(true);
  //   setCreateFeature({
  //     id,
  //     featureName,
  //     featureNameBan,
  //     iconId,
  //     url,
  //     type,
  //     parentId,
  //     isActive,
  //     position,
  //     isRoot,
  //     serialNo,
  //   });
  // };

  // const onFeatureDelete = async (id, index) => {
  //   if (id) {
  //     try {
  //       await Swal.fire({
  //         title: 'আপনি কি নিশ্চিত?',
  //         text: 'আপনি এটি ফিরিয়ে আনতে পারবেন না!',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         cancelButtonText: 'ফিরে যান ।',
  //         confirmButtonText: 'হ্যাঁ, বাতিল করুন!',
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           axios.delete(DeleteFeature + id, config).then((response) => {
  //             if (response.status === 200) {
  //               Swal.fire('বাতিল হয়েছে!', 'ফিচারটি সংরক্ষণাগারে রাখা হয়েছে', 'success');
  //               getFeatureList();
  //             } else {
  //               Swal.fire(' অকার্যকর হয়েছে!', 'প্রক্রিয়াটি অকার্যকর হয়েছে .', 'success');
  //               getFeatureList();
  //             }
  //           });
  //         }
  //       });
  //       getFeatureList();
  //     } catch (error) {
  //       errorHandler(error);
  //     }
  //   }
  // };

  // function CustomToolbar() {
  //   return (
  //     <GridToolbarContainer>
  //       <GridToolbarColumnsButton />
  //       <GridToolbarFilterButton />
  //       <GridToolbarDensitySelector />
  //       {/* <GridToolbarExport /> */}
  //     </GridToolbarContainer>
  //   );
  // }

  return (
    <Fragment>
      <Fragment>
        <Grid container className="section">
          <Grid item xs={12}>
            <Grid container spacing={2.5}>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('ফিচার নাম ইংরেজি বড় হাতের')}
                  name="featureName"
                  onChange={handleChange}
                  type="text"
                  value={createFeature.featureName}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('ফিচার নাম বাংলা')}
                  name="featureNameBan"
                  onChange={handleChange}
                  type="text"
                  value={createFeature.featureNameBan}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>

              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('URL')}
                  name="url"
                  disabled={update}
                  onChange={handleChange}
                  type="text"
                  value={createFeature.url}
                  variant="outlined"
                  size="small"
                ></TextField>
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('টাইপ')}
                  name="type"
                  onChange={handleChange}
                  select
                  disabled={update}
                  SelectProps={{ native: true }}
                  value={createFeature.type || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  <option value="P">Parent</option>
                  <option value="C">Child</option>
                </TextField>
              </Grid>
              {createFeature.type == 'C' && (
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={RequiredFile('প্যারেন্ট আইডি')}
                    name="parentId"
                    onChange={handleChange}
                    select
                    SelectProps={{ native: true }}
                    value={createFeature.parentId || 0}
                    variant="outlined"
                    size="small"
                  >
                    <option value={0}>- নির্বাচন করুন -</option>
                    {listFeature.map((e, index) => {
                      return (
                        <option key={index} value={e.id}>
                          {e.featureNameBan}
                        </option>
                      );
                    })}
                  </TextField>
                </Grid>
              )}
              <Grid item xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel id="icon-dropdown-label" sx={{ display: 'flex', alignItems: 'center' }}>
                    আইকন নির্বাচন করুন
                  </InputLabel>
                  <Select
                    labelId="icon-dropdown-label"
                    label={RequiredFile('আইকন নির্বাচন করুন')}
                    id="icon-dropdown"
                    value={createFeature.iconId}
                    name="iconId"
                    onChange={handleChange}
                    IconComponent={ArrowDropDown}
                    sx={{ height: '40px' }}
                  >
                    {iconList.map((row, i) => (
                      <MenuItem key={i} value={row.id}>
                        <span style={{ paddingRight: '5px' }}>{row.icon}</span>
                        <span>{row.name}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('একাটভ কি?')}
                  name="isActive"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={JSON.stringify(createFeature.isActive) || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  <option value={'true'}>হ্যাঁ</option>
                  <option value={'false'}>না</option>
                </TextField>
              </Grid>
              <Grid item xxl={4} xl={4} lg={4} md={4} sm={12} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('পজিশন')}
                  name="position"
                  onChange={handleChange}
                  select
                  disabled={update}
                  SelectProps={{ native: true }}
                  value={createFeature.position || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  <option value="SIDE">SideBar</option>
                  <option value="NAV">NavBar</option>
                  <option value="CONT">Content</option>
                </TextField>
              </Grid>

              <Grid
                item
                xxl={createFeature.type == 'C' ? 2 : 4}
                xl={createFeature.type == 'C' ? 2 : 4}
                lg={createFeature.type == 'C' ? 2 : 4}
                md={createFeature.type == 'C' ? 2 : 4}
                sm={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label={RequiredFile('রুট কি?')}
                  name="isRoot"
                  onChange={handleChange}
                  select
                  SelectProps={{ native: true }}
                  value={JSON.stringify(createFeature.isRoot) || 0}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  <option value={'true'}>হ্যাঁ</option>
                  <option value={'false'}>না</option>
                </TextField>
              </Grid>
              <Grid
                item
                xxl={createFeature.type == 'C' ? 2 : 4}
                xl={createFeature.type == 'C' ? 2 : 4}
                lg={createFeature.type == 'C' ? 2 : 4}
                md={createFeature.type == 'C' ? 2 : 4}
                sm={12}
                xs={12}
              >
                <TextField
                  fullWidth
                  label={RequiredFile('ডিসপ্লে সিরিয়াল নং')}
                  name="serialNo"
                  onChange={handleChange}
                  type="text"
                  value={createFeature.serialNo}
                  variant="outlined"
                  size="small"
                  helperText={serialNo.length != 0 ? 'বিদ্যমান ডিসপ্লে সিরিয়াল নং [' + serialNo + ']' : ''}
                ></TextField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className="btn-container">
          <Tooltip title={update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}>
            <Button
              variant="contained"
              className="bnt btn-primary"
              onClick={onFeatureCreate}
              startIcon={update ? <KeyboardDoubleArrowDownIcon /> : <SaveOutlinedIcon />}
            >
              {update ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
            </Button>
          </Tooltip>
          <Tooltip title={'মুছে ফেলুন'}>
            <Button variant="contained" className="btn btn-warning" onClick={onClose} startIcon={<HighlightOffIcon />}>
              মুছে ফেলুন
            </Button>
          </Tooltip>
        </Grid>
      </Fragment>
      <Fragment>
        <SubHeading>
          <span>ফিচার তালিকা</span>
        </SubHeading>
        <Grid container mt={2}>
          {/* <TableContainer
            className="table-container"
            sx={{ maxHeight: 470, width: "100%" }}
          >
            <Table
              sx={{ minWidth: 375 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead className="table-head">
                <TableRow>
                  <TableCell align="center">ক্রমিক</TableCell>
                  <TableCell>ফিচার নাম (বাংলা)</TableCell>
                  <TableCell>ফিচার আইকন</TableCell>
                  <TableCell>লিংক</TableCell>
                  <TableCell>পজিশন</TableCell>
                  <TableCell>ডিসপ্লে নং</TableCell>
                  <TableCell>ফিচারের ধরন</TableCell>
                  <TableCell>সচল কি/না </TableCell>
                  <TableCell>রুট কি/না</TableCell>
                  <TableCell align="center">সম্পাদন</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listFeature?.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell align="center" component="th" scope="row">
                      {engToBang("" + (i + 1) + "")}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          <div className="tooltip-title">
                            {data.featureNameBan}
                          </div>
                        }
                        arrow
                      >
                        <div className="data">{data.featureNameBan}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      {iconProvider(data.iconId)}
                    </TableCell>
                    <TableCell className="">
                      <Tooltip
                        arrow
                        title={<div className="tooltip-title">{data.url}</div>}
                      >
                        <div className="data">{data.url}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{data.position}</TableCell>
                    <TableCell align="center">
                      {engToBang("" + data.serialNo + "")}
                    </TableCell>
                    <TableCell>
                      {data.type === "P" ? "Parent" : "Child"}
                    </TableCell>
                    <TableCell>{JSON.stringify(data.isActive)}</TableCell>
                    <TableCell>{JSON.stringify(data.isRoot)}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "center",
                          gap: "4px",
                        }}
                      >
                        <Link
                          activeClass="active"
                          to="goTo"
                          //spy={true}
                          smooth={true}
                          offset={-70}
                          duration={700}
                        >
                          <

                            onClick={() =>
                              onHandleUpdate(
                                data.id,
                                data.featureName,
                                data.featureNameBan,
                                data.iconId,
                                data.url,
                                data.type,
                                data.parentId,
                                data.isActive,
                                data.position,
                                data.isRoot,
                                data.serialNo
                              )
                            }
                            className="table-icon edit"
                          />
                        </Link>

                        <Tooltip title="বাতিল করুন">
                          <CloseIcon
                            className="table-icon delete"
                            onClick={() => onFeatureDelete(data.id)}
                          />
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
        </Grid>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={listFeature}
            columns={columns}
            density="compact"
            autoHeight={true}
            // loading={loadData}
            // experimentalFeatures={{
            //   newEditingApi: true,
            // }}
            // initialState={{ pinnedColumns: { left: ["id"] } }}
            // // processRowUpdate={processRowUpdate}
            localeText={{
              toolbarColumns: 'কলাম ফিল্টার করুন',
              toolbarFilters: 'ফিল্টার করুন',
              toolbarDensity: 'টেবিলের আকার পরিবর্তন করুন',
              toolbarExport: 'এক্সপোর্ট করুন',
            }}
            // components={{
            //   Toolbar: CustomToolbar,
            // }}
          />
        </div>
      </Fragment>
    </Fragment>
  );
};

export default FeatureCreate;
