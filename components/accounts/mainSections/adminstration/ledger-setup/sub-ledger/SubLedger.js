
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import star from 'components/utils/coop/star';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { codeMaster, createSubGl, employeeRecordByOffice, subGlDataRoute } from '../../../../../../url/AccountsApiLIst';

import AddIcons from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SubHeading from 'components/shared/others/SubHeading';
import { Link } from 'react-scroll';
import engToBdNum from '../../../../../../service/englishToBanglaDigit';
const SubLedger = () => {
  ('hiiiiiiiiiiiiii2');
  let accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  //("Access token value is", accessToken);

  let config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  //("config token value is", config);

  useEffect(() => {
    getGlList();
    getDesk();
    getSubGLData();
  }, []);
  const [formErrors, setFormErrors] = useState({});
  const [value, setValue] = useState(false);
  const [glType, setGlType] = useState([]);
  const [glTypeId, setGlTypeId] = useState('');
  const [setDeskList] = useState([]);
  const [refNo, setRefNo] = useState(null);
  const [name, setName] = useState('');
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [setObj] = useState([]);
  const [approvedSubGl, setApprovedSubGL] = useState([]);
  // const [ setOpen] = useState(false);
  const [glId, setGlId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  'isLoading', isLoading;

  // const handleNextDesk = (e) => {
  //   const { name, value } = e.target;
  //   setSelectedDesk(value);
  // };

  // const handleReject = (row, i) => {
  //   let newArray = [...obj];
  //   const filteredArray = newArray.filter((item, ind) => i != ind);
  //   setObj(filteredArray);
  // };

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
  // const addData = (e) => {
  //   setOpen(true);
  //   glTypeId, value, name, refNo;
  //   let newObj = [...obj];
  //   newObj.push({
  //     type: glTypeId,
  //     name: name,
  //     refNo: refNo,
  //     isActive: value,
  //     id: glId,
  //   });
  //   setObj(newObj);
  //   setGlId(null);
  //   setGlTypeId(' ');
  //   setRefNo(null);
  //   setName('');
  //   setValue(false);
  // };
  let checkMandatory = () => {
    let result = true;
    const formErrors = { ...formErrors };

    setFormErrors(formErrors);
    return result;
  };
  const onSubmitData = async () => {
    let result = checkMandatory();
    let payload;
    payload = {
      projectId: null,
      samityId: null,
      data: {
        subGl: [
          {
            type: glTypeId,
            name: name,
            refNo: refNo,
            isActive: value,
            id: glId,
          },
        ],
      },
    };
    if (result) {
      try {
        setIsLoading(true);
        const assignProject = await axios.post(createSubGl, payload, config);
        setGlId(null);
        getSubGLData();
        setIsUpdate(false);
        setIsModalOpen(false);
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
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
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
      if (error.response) {
        'Error Data', error.response;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };

  const getSubGLData = async () => {
    try {
      let Data = await axios.get(subGlDataRoute, config);
      const subGlDataList = Data.data.data;
      setApprovedSubGL(subGlDataList);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const clearState = () => {
    setGlTypeId('');
    setName('');
    setRefNo('');
    setValue(false);
  };
  'Form Errors-------------------', formErrors;
  'Selected Desk---------', selectedDesk;
  return (
    <Fragment>
      <Dialog
        maxWidth="lg"
        open={isModalOpen}
        onClose={() => {
          clearState();
          setIsUpdate(false);
          setIsModalOpen(false);
        }}
        onBackdropClick={() => {
          clearState();
          setIsUpdate(false);
          setIsModalOpen(false);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{`সাব লেজার ${isUpdate ? 'হালদানাগাদ' : 'তৈরী'}`}</DialogTitle>
          <CloseIcon
            sx={{ margin: '10px', cursor: 'pointer' }}
            onClick={() => {
              clearState();
              setIsUpdate(false);
              setIsModalOpen(false);
            }}
          />
        </div>

        <DialogContent>
          <Grid container md={12} xs={12} spacing={1.5}>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="glType">{glTypeId ? star('টাইপ') : star('টাইপ নির্বাচন করুন')}</InputLabel>
                <Select
                  label={glTypeId ? star('টাইপ') : star('টাইপ নির্বাচন করুন')}
                  id="glType"
                  name="GlType"
                  onChange={(e) => handleType(e)}
                  size="small"
                  value={glTypeId != null ? glTypeId : ''}
                >
                  {glType.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.displayValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <TextField
                fullWidth
                label={star("টাইপ")}
                id="glType"
                name="GlType"
                select
                SelectProps={{ native: true }}
                onChange={(e) => handleType(e)}
                type="text"
                variant="outlined"
                size="small"
                value={glTypeId != null ? glTypeId : ""}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {glType.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.displayValue}
                  </option>
                ))}
              </TextField> */}
              {/* {!upozillaId && (
                <span style={{ color: "red" }}>{formErrors.upozillaId}</span>
              )} */}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('নাম')}
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
                label={star('রেফারেন্স নম্বর')}
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
            <Grid container className="btn-container">
              <Tooltip title={isUpdate ? 'হালদানাগাদ করুন' : 'সংরক্ষণ করুন'}>
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
                  {isUpdate ? 'হালদানাগাদ করুন' : 'সংরক্ষণ করুন'}
                </LoadingButton>
              </Tooltip>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Grid container className="section">
            {/* <SubHeading>অনুমোদিত সাব লেজেরের তথ্য সমূহ</SubHeading> */}
            <SubHeading>
              <span>অনুমোদিত সাব লেজারের তথ্য সমূহ</span>

              <Button
                className="btn btn-primary"
                variant="contained"
                onClick={() => {
                  setIsModalOpen(true);
                }}
                size="small"
              // disabled={disableGrantorAdd}
              >
                <AddIcons /> সাব লেজার তৈরি করুন
              </Button>
            </SubHeading>
            <Grid item md={12} xs={12}>
              <TableContainer className="table-container">
                <Table size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell align="center">ক্রমিক</TableCell>
                      <TableCell>টাইপ</TableCell>

                      <TableCell>নাম</TableCell>
                      <TableCell>রেফারেন্স নম্বর</TableCell>
                      <TableCell>স্ট্যাটাস</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>সম্পাদন</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvedSubGl.length > 0
                      ? approvedSubGl.map((row, i) => (
                        <TableRow key={row.i}>
                          <TableCell align="center">{engToBdNum('' + (i + 1) + '')}</TableCell>
                          <TableCell>{row.typeName}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{engToBdNum(row.refNo)}</TableCell>
                          <TableCell>{row.isActive ? 'সচল' : 'সচল নয়'}</TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Link
                              activeClass="active"
                              to="goTo"
                              // spy={true}
                              smooth={true}
                              offset={-70}
                              duration={700}
                            >
                              <EditIcon
                                className="table-icon edit"
                                // eslint-disable-next-line no-unused-vars
                                onClick={(e) => {
                                  setIsUpdate(true);
                                  setIsModalOpen(true);
                                  handleEdit(row, i);
                                }}
                              />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                      : ''}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SubLedger;
