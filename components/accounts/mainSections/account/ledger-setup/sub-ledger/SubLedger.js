
import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelIcon from '@mui/icons-material/Cancel';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Grid,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import AppTitle from 'components/shared/others/AppTitle';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-scroll';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { codeMaster, createSubGl, employeeRecordByOffice, subGlDataRoute } from '../../../../../../url/AccountsApiLIst';

const SubLedger = () => {
  let config = localStorageData('config');

  const [formErrors, setFormErrors] = useState({});
  const [value, setValue] = useState(false);
  const [glType, setGlType] = useState([]);
  const [glTypeId, setGlTypeId] = useState('');
  const [deskList, setDeskList] = useState([]);
  const [refNo, setRefNo] = useState(null);
  const [name, setName] = useState('');
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [obj, setObj] = useState([]);
  const [approvedSubGl, setApprovedSubGL] = useState([]);
  const [open, setOpen] = useState(false);
  const [glId, setGlId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getGlList();
    getDesk();
    getSubGLData();
  }, []);

  const handleNextDesk = (e) => {
    const { value } = e.target;
    setSelectedDesk(value);
  };

  const handleReject = (row, i) => {
    let newArray = [...obj];
    const filteredArray = newArray.filter((item, ind) => i != ind);
    setObj(filteredArray);
  };

  const handleEdit = (row) => {
    setGlTypeId(row.type);
    setName(row.name);
    setRefNo(row.refNo);
    setValue(row.isActive);
    setGlId(row.id);
  };

  const handleName = (e) => {
    const { value } = e.target;
    setName(value);
  };
  const handleChange = (e) => {
    const { checked } = e.target;
    setValue(checked);
  };
  const handleRefaranceNumber = (e) => {
    const { value } = e.target;
    setRefNo(value);
  };
  const handleType = (e) => {
    const { value } = e.target;
    setGlTypeId(value);
  };
  const addData = () => {
    setOpen(true);
    glTypeId, value, name, refNo;
    let newObj = [...obj];
    newObj.push({
      type: glTypeId,
      name: name,
      refNo: refNo,
      isActive: value,
      id: glId,
    });
    setObj(newObj);
    setGlId(null);
    setGlTypeId(' ');
    setRefNo(null);
    setName('');
    setValue(false);
  };
  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };
    if (selectedDesk == null || selectedDesk == 'নির্বাচন করুন') {
      result = false;
      formErrors.selectedDesk = 'অনুমোদনকারী/পর্যবেক্ষক নির্বাচন করুন';
    }
    setFormErrors(formErrors);
    return result;
  };
  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    payload = {
      projectId: null,
      samityId: null,
      data: { subGl: obj },
      nextAppDesignationId: selectedDesk,
    };
    if (result) {
      try {
        setIsLoading(true);
        const assignProject = await axios.post(createSubGl, payload, config);
        setIsLoading(false);
        NotificationManager.success(assignProject.data.message, '', 5000);
        setGlTypeId('নির্বাচন করুন');
        setName('');
        setObj([]);
        setSelectedDesk('নির্বাচন করুন');
        setRefNo('');
        setValue(false);
      } catch (error) {
        setIsLoading(false);
        errorHandler(error);
      }
    }
  };

  const getGlList = async () => {
    try {
      const gl = await axios.get(codeMaster + '?codeType=SLG', config);

      let glList = gl.data.data;
      if (glList.length == 1) {
        setGlTypeId(glList[0].id);
        document.getElementById('glType').setAttribute('disabled', 'true');
      }
      setGlType(glList);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getDesk = async () => {
    try {
      let Data = await axios.get(employeeRecordByOffice, config);
      const deskData = Data.data.data;

      // if (deskData.length == 1) {
      //   setSelectedDesk(deskData[0].designationId);
      //   document.getElementById("deskId").setAttribute("disabled", "true");
      // }
      setDeskList(deskData);
    } catch (error) {
      errorHandler(error);
    }
  };

  const getSubGLData = async () => {
    try {
      let Data = await axios.get(subGlDataRoute, config);
      const subGlDataList = Data.data.data;
      setApprovedSubGL(subGlDataList);
    } catch (error) {
      errorHandler(error);
    }
  };
  return (
    <Fragment>
      <Grid container spacing={2} id="goTo">
        <Grid item md={2} xs={12}>
          <TextField
            fullWidth
            label={'টাইপ'}
            id="glType"
            name="GlType"
            select
            SelectProps={{ native: true }}
            onChange={(e) => handleType(e)}
            type="text"
            variant="outlined"
            size="small"
            value={glTypeId != null ? glTypeId : ''}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {glType.map((option) => (
              <option key={option.id} value={option.id}>
                {option.displayValue}
              </option>
            ))}
          </TextField>
          {/* {!upozillaId && (
                <span style={{ color: "red" }}>{formErrors.upozillaId}</span>
              )} */}
        </Grid>
        <Grid item md={3} xs={12}>
          <TextField
            fullWidth
            label="নাম"
            onChange={(e) => handleName(e)}
            type="text"
            variant="outlined"
            size="small"
            value={name}
          ></TextField>
          {/* {!projectId && (
                <span style={{ color: "red" }}>{formErrors.projectId}</span>
              )} */}
        </Grid>
        <Grid item md={2} xs={12}>
          <TextField
            fullWidth
            label="রেফারেন্স নম্বর"
            onChange={(e) => handleRefaranceNumber(e)}
            type="text"
            variant="outlined"
            size="small"
            value={refNo ? refNo : ''}
          ></TextField>
          {/* {!projectId && (
                <span style={{ color: "red" }}>{formErrors.projectId}</span>
              )} */}
        </Grid>
        <Grid item md={2} xs={12} justifyItems="center">
          <Typography
            variant="h6"
            sx={{
              color: '#000',
              textShadow: '1px 1px #FFF',
              fontWeight: 'bold',
            }}
          >
            সচল
            <Switch sx={{}} onChange={handleChange} checked={value} />
          </Typography>
        </Grid>

        <Grid item xs={12} md={3} sm={12}>
          <Tooltip
            title="যুক্ত করুন"
            sx={{
              color: 'blue',
              background: 'blue',
              '& .MuiTooltip-tooltip': {
                opacity: '0',
              },
            }}
          >
            <Button variant="contained" className="btn btn-primary" onClick={addData} startIcon={<AddBoxIcon />}>
              {' '}
              অস্থায়ীভাবে সংযুক্ত করুন
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} style={{ paddingTop: '15px' }}>
        <Grid item lg={12} md={12} xs={12}>
          {open && (
            <Paper>
              <Grid item md={12} xs={12}>
                <AppTitle>
                  <Typography variant="h6">অস্থায়ী সাব লেজেরের তথ্য সমূহ</Typography>
                </AppTitle>
              </Grid>
              <Grid item md={12} xs={12}>
                <Table size="small" aria-label="a dense table">
                  <TableHead sx={{ backgroundColor: '#EFFFFD' }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: '#203239',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        টাইপ
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#203239',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        নাম
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#203239',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        রেফারেন্স নম্বর
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#203239',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        স্ট্যাটাস
                      </TableCell>
                      <TableCell
                        sx={{
                          color: '#203239',
                          fontSize: '16px',
                          fontWeight: 'bold',
                        }}
                      >
                        বাতিল করুন
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {obj.length > 0
                      ? obj.map((row, i) => (
                        <TableRow key={row.i}>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.refNo}</TableCell>
                          <TableCell>{row.isActive ? 'সচল' : 'সচল নয়'}</TableCell>
                          <TableCell>
                            <CancelIcon
                              color="warning"
                              fontSize="medium"
                              onClick={() => {
                                handleReject(row, i);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1.5} style={{ paddingTop: '15px' }}>
        <Grid item lg={12} md={12} xs={12}>
          <Paper style={{ padding: '15px' }}>
            <Grid item md={12} xs={12}>
              <AppTitle>
                <Typography variant="h6">অনুমোদিত সাব লেজেরের তথ্য সমূহ</Typography>
              </AppTitle>
            </Grid>
            <Grid item md={12} xs={12}>
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: '#EFFFFD' }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: '#203239',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      টাইপ
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#203239',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      নাম
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#203239',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      রেফারেন্স নম্বর
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#203239',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      স্ট্যাটাস
                    </TableCell>
                    <TableCell
                      sx={{
                        color: '#203239',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      সম্পাদন
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvedSubGl.length > 0
                    ? approvedSubGl.map((row, i) => (
                      <TableRow key={row.i}>
                        <TableCell>{row.typeName}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.refNo}</TableCell>
                        <TableCell>{row.isActive ? 'সচল' : 'সচল নয়'}</TableCell>
                        <TableCell>
                          <Link
                            activeClass="active"
                            to="goTo"
                            // spy={true}
                            smooth={true}
                            offset={-70}
                            duration={700}
                          >
                            <Tooltip title="হালনাগাদ করুন">
                              <RateReviewIcon
                                color="warning"
                                fontSize="medium"
                                onClick={() => {
                                  handleEdit(row, i);
                                }}
                              />
                            </Tooltip>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                    : ''}
                </TableBody>
              </Table>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={1.5} display="flex">
        <Grid item md={6} xs={12}>
          <Grid xs={12} md={12} sm={12} mx={2} my={2} sx={{ textAlign: 'center' }}>
            <TextField
              fullWidth
              id="deskId"
              label="অনুমোদনকারী/পর্যবেক্ষক"
              name="selectedDesk"
              onChange={handleNextDesk}
              select
              SelectProps={{ native: true }}
              value={selectedDesk ? selectedDesk : ''}
              variant="outlined"
              size="small"
            >
              <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
              {deskList
                ? deskList.map((option) => (
                  <option key={option.designationId} value={option.designationId}>
                    {option.nameBn} - {option.designation}
                  </option>
                ))
                : ''}
            </TextField>
            {(selectedDesk == 'নির্বাচন করুন' || !selectedDesk) && (
              <span style={{ color: 'red' }}>{formErrors.selectedDesk}</span>
            )}
          </Grid>
        </Grid>

        <Grid Grid item md={6} xs={12}>
          <Grid item xs={12} md={12} sm={12} mx={2} my={2} sx={{ textAlign: 'center' }}>
            <Tooltip title="সংরক্ষন করুন">
              <LoadingButton
                disabled={isLoading}
                loading={isLoading}
                loadingPosition="end"
                variant="contained"
                className="btn btn-save"
                onClick={onSubmitData}
                startIcon={<SaveOutlinedIcon />}
              >
                {' '}
                অনুমোদনের জন্য প্রেরণ
              </LoadingButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SubLedger;
