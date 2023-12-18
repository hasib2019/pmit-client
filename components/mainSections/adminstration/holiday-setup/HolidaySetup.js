import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useReducer } from 'react';

import { NotificationManager } from 'react-notifications';

import axios from 'axios';
import moment from 'moment';
import { localStorageData } from 'service/common';
import TableComponent from '../../../../service/TableComponent';
import {
  allHolidayInfoOfADoptor,
  allHolidayTypes,
  createHoliday,
  officeName,
  updateHoliday,
} from '../../../../url/ApiList';
import { getApi } from '../../adminstration/product-setup/utils/getApi';

const initialState = {
  localState: {
    holidayType: '',
    officeId: '',
    fromDate: null,
    toDate: null,
    status: true,

    holidayDescription: '',

    openModal: false,
    saveAndEditButtonLevel: 'সংরক্ষণ করুন',
    editPrimaryKeyId: '',
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    searchByDateValue: null,
    searchByTypeValue: '',
    holidayDateForEdit: null,
  },

  apivalues: {
    allHolidayTypes: [],
    officeNames: [],
    allHolidays: [],
    filteredHolidays: [],
  },
  errors: {
    holidayType: '',
    officeId: '',
    fromDate: '',
    toDate: '',
    status: '',
    holidayDateForEdit: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'localState':
      return {
        ...state,
        localState: {
          ...state.localState,
          [action.stateName]: action.value,
        },
      };

    case 'apiState':
      return {
        ...state,
        apiValues: {
          ...state.apiValues,
          [action.stateName]: action.value,
        },
      };
    case 'formError':
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.value,
        },
      };
    case 'setAllOrClearAll':
      return {
        ...state,

        localState: { ...state.localState, ...action.value },
      };
  }
};

const HolidaySetup = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    getAllHolidayTypes();
    getAllOffices();
    getAllHolidayInfo();
  }, []);
  const getAllHolidayTypes = async () => {
    let holidayTypes = await getApi(allHolidayTypes, 'get');
    dispatch({
      type: 'apiState',
      stateName: 'allHolidayTypes',
      value: holidayTypes?.data?.data,
    });
  };
  const getAllHolidayInfo = async () => {
    let allHolidays = await getApi(allHolidayInfoOfADoptor, 'get');
    dispatch({
      type: 'apiState',
      stateName: 'allHolidays',
      value: allHolidays?.data?.data,
    });
    dispatch({
      type: 'apiState',
      stateName: 'filteredHolidays',
      value: allHolidays?.data?.data,
    });
  };
  const getAllOffices = async () => {
    let allOffices = await getApi(officeName, 'get');

    dispatch({
      type: 'apiState',
      stateName: 'officeNames',
      value: [{ id: 0, nameBn: 'সকল অফিস' }, ...allOffices?.data?.data],
    });
  };
  const checkMandatory = () => {
    let flag = true;
    let obj = {};
    if (!state.localState.officeId) {
      flag = false;
      obj.officeId = 'অফিস নির্বাচন করুন';
    }
    if (!state.localState.holidayType) {
      flag = false;
      obj.holidayType = 'ছুটির ধরণ নির্বাচন করুন';
    }
    if (state.localState.saveAndEditButtonLevel === 'সংরক্ষণ করুন') {
      if (!state.localState.fromDate) {
        flag = false;
        obj.fromDate = 'ছুটি শুরুর তারিখ দিন';
      }
      if (!state.localState.toDate) {
        flag = false;
        obj.toDate = 'ছুটি শেষের তারিখ দিন ';
      }
      if (state.localState.fromDate && state.localState.toDate) {
        const from = Date.parse(state.localState.fromDate);
        const to = Date.parse(state.localState.toDate);
        if (to < from) {
          ('hi');
          flag = false;
          obj.toDate = 'ছুটি শেষের তারিখ শুরুর তারিখ থেকে বড় হতে হবে';
        }
      }
    }
    if (state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন') {
      if (!state.localState.holidayDateForEdit) {
        flag = false;
        obj.holidayDateForEdit = 'ছুটির তারিখ দিন';
      }
      if (!state.localState.status) {
        flag = false;
        obj.status = 'ছুটির স্টেটাস দিন';
      }
    }

    setTimeout(() => {
      dispatch({ type: 'formError', value: obj });
    });
    return flag;
  };
  const config = localStorageData('config');
  const onSubmitData = async () => {
    const checked = checkMandatory();
    // ("checked", checked);
    if (checked) {
      const payload = {
        holidayType: state.localState.holidayType,
        officeId: parseInt(state.localState.officeId),
        ...(state.localState.saveAndEditButtonLevel === 'সংরক্ষণ করুন' && {
          fromDate: state.localState.fromDate,
          toDate: state.localState.toDate,
        }),
        ...(state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' && {
          holiday: moment(state.localState.holidayDateForEdit).format('YYYY-MM-DD'),
        }),
        description: state.localState.holidayDescription,
        ...(state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' && {
          isActive: state.localState.status,
        }),
      };

      try {
        if (state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন') {
          const holidayUpdate = await axios.put(updateHoliday + state.localState.editPrimaryKeyId, payload, config);
          NotificationManager.success(holidayUpdate.data.message);
          dispatch({
            type: 'localState',
            stateName: 'openModal',
            value: false,
          });
          dispatch({
            type: 'localState',
            stateName: 'saveAndEditButtonLevel',
            value: 'সংরক্ষণ করুন',
          });

          clearState();
          getAllHolidayInfo();
        } else {
          const holidayCreate = await axios.post(createHoliday, payload, config);
          NotificationManager.success(holidayCreate.data.message);
          dispatch({
            type: 'localState',
            stateName: 'openModal',
            value: false,
          });
          clearState();

          clearState();
          getAllHolidayInfo();
        }
      } catch (error) {
        'error', error;
        if (error.response) {
          const message = error.response.data.errors[0].message;
          NotificationManager.error(message);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...');
        } else {
          NotificationManager.error(error.toString());
        }
      }
    }
  };
  const clearState = () => {
    dispatch({
      type: 'setAllOrClearAll',
      value: {
        holidayType: '',
        officeId: '',
        fromDate: null,
        toDate: null,
        status: true,

        holidayDescription: '',

        openModal: false,
        saveAndEditButtonLevel: 'সংরক্ষণ করুন',
        editPrimaryKeyId: '',
        page: 0,
        rowsPerPage: 10,
        // searchValue: "নির্বাচন করুন",
        holidayDateForEdit: null,
        // searchByDateValue: null,
        // searchByTypeValue: "নির্বাচন করুন",
      },
    });
  };
  const onEdit = (row) => {
    dispatch({
      type: 'localState',
      stateName: 'openModal',
      value: true,
    });
    dispatch({
      type: 'localState',
      stateName: 'saveAndEditButtonLevel',
      value: 'হালদানাগাদ করুন',
    });

    dispatch({
      type: 'setAllOrClearAll',
      value: {
        holidayType: row.holidayType,
        officeId: row.officeId,
        holidayDateForEdit: row.holiday,
        status: row.isActive,

        holidayDescription: row.description,

        editPrimaryKeyId: row.id,
      },
    });
  };
  const handleChangePage = (event, newPage) => {
    dispatch({
      type: 'localState',
      stateName: 'page',
      value: newPage,
    });
  };
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: 'localState',
      stateName: 'rowsPerPage',
      value: parseInt(event.target.value, 10),
    });
    dispatch({
      type: 'localState',
      stateName: 'page',
      value: 0,
    });
  };
  const columnNames = ['ক্রমিক নং', 'অফিসের নাম', 'ছুটির তারিখ', 'ছুটির ধরণ', 'ছুটির বর্ণনা', 'সম্পাদনা'];
  const tableDataKeys = ['index', 'nameBn', 'holiday', 'holidayType', 'description', 'button'];
  const requestSearch = (e) => {
    const data = parseInt(e.target.value);

    const filteredHoliday = state.apiValues.allHolidays.filter((row) => {
      if (state.localState.searchByDateValue && state.localState.searchByTypeValue) {
        return (
          parseInt(row.officeId) === data &&
          moment(row.holiday).format('YYYY-DD-MM') ===
            moment(state.localState.searchByDateValue).format('YYYY-DD-MM') &&
          row.holidayType === state.localState.searchByTypeValue
        );
      } else if (state.localState.searchByDateValue || state.localState.searchByTypeValue)
        if (state.localState.searchByDateValue) {
          return (
            row.officeId === data && moment(row.holiday).format('YYYY-MM-DD') === state.localState.searchByDateValue
          );
        } else {
          return row.officeId === data && row.holidayType === state.localState.searchByTypeValue;
        }
      'searchRow', row;
      return data === 0 ? row : row.officeId === data;
    });
    if (data === '') {
      dispatch({
        type: 'apiState',
        stateName: 'allHolidays',
        value: state.apiValues.allHolidays,
      });
    } else {
      dispatch({
        type: 'apiState',
        stateName: 'filteredHolidays',
        value: filteredHoliday,
      });
    }
  };
  const requestSearchByDate = (e) => {
    const data = moment(new Date(e)).format('YYYY-MM-DD');
    'searchValue', data;

    const filteredHoliday = state.apiValues.allHolidays.filter((row) => {
      if (state.localState.searchValue && state.localState.searchByTypeValue) {
        return (
          moment(row.holiday).format('YYYY-MM-DD') === data &&
          parseInt(row.officeId) === parseInt(state.localState.searchValue) &&
          row.holidayType === state.localState.searchByTypeValue
        );
      }
      if (state.localState.searchValue || state.localState.searchByTypeValue) {
        if (state.localState.searchValue) {
          return (
            moment(row.holiday).format('YYYY-MM-DD') === data &&
            parseInt(row.officeId) === parseInt(state.localState.searchValue)
          );
        } else {
          return (
            moment(row.holiday).format('YYYY-MM-DD') === data && row.holidayType === state.localState.searchByTypeValue
          );
        }
      }
      return moment(row.holiday).format('YYYY-MM-DD') === data;
    });
    if (data === '') {
      dispatch({
        type: 'apiState',
        stateName: 'allHolidays',
        value: state.apiValues.allHolidays,
      });
    } else {
      dispatch({
        type: 'apiState',
        stateName: 'filteredHolidays',
        value: filteredHoliday,
      });
    }
  };
  const requestSearchByType = (e) => {
    const data = e.target.value;
    'searchValue', data;

    const filteredHoliday = state.apiValues.allHolidays.filter((row) => {
      if (state.localState.searchValue && state.localState.searchByDateValue) {
        return (
          data === row.holidayType &&
          parseInt(row.officeId) === parseInt(state.localState.searchValue) &&
          moment(row.holiday).format('YYYY-MM-DD') === moment(state.localState.searchByDateValue).format('YYYY-MM-DD')
        );
      } else if (state.localState.searchValue || state.localState.searchByDateValue) {
        if (state.localState.searchValue) {
          return data === row.holidayType && parseInt(row.officeId) === parseInt(state.localState.searchValue);
        } else {
          return (
            data === row.holidayType &&
            moment(row.holiday).format('YYYY-MM-DD') === moment(state.localState.searchByDateValue).format('YYYY-MM-DD')
          );
        }
      }

      return data === row.holidayType;
    });
    if (data === '') {
      dispatch({
        type: 'apiState',
        stateName: 'allHolidays',
        value: state.apiValues.allHolidays,
      });
    } else {
      dispatch({
        type: 'apiState',
        stateName: 'filteredHolidays',
        value: filteredHoliday,
      });
    }
  };
  return (
    <>
      <Grid container className="section" spacing={2.5}>
        <Grid item md={4} lg={4} xs={12} sm={12}>
          <TextField
            inputFormat="dd/MM/yyyy"
            fullWidth
            label="অফিসের তালিকা"
            id="officeId"
            name="officeId"
            select
            SelectProps={{ native: true }}
            onChange={(e) => {
              requestSearch(e);
              dispatch({
                type: 'localState',
                stateName: 'searchValue',
                value: e.target.value,
              });
            }}
            type="text"
            variant="outlined"
            size="small"
            value={state.localState.searchValue}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {state.apiValues?.officeNames?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameBn}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} lg={4} xs={12} sm={12}>
          <FormGroup row>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                name="searchByDateValue"
                label="তারিখ"
                value={state.localState.searchByDateValue}
                onChange={(e) => {
                  requestSearchByDate(e);
                  dispatch({
                    type: 'localState',
                    stateName: 'searchByDateValue',
                    value: e,
                  });
                }}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </LocalizationProvider>
          </FormGroup>
        </Grid>
        <Grid item md={4} lg={4} xs={12} sm={12}>
          <TextField
            fullWidth
            label="ছুটির ধরণ"
            name="searchByTypeValue"
            variant="outlined"
            size="small"
            select
            SelectProps={{ native: true }}
            type="text"
            value={state.localState.searchByTypeValue}
            onChange={(e) => {
              requestSearchByType(e);
              dispatch({
                type: 'localState',
                stateName: 'searchByTypeValue',
                value: e.target.value,
              });
            }}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {state.apiValues?.allHolidayTypes?.map((option) => (
              <option key={option.id} value={option.holidayType}>
                {option.holidayDesc}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableComponent
        columnNames={columnNames}
        tableData={state?.apiValues?.filteredHolidays}
        tableDataKeys={tableDataKeys}
        editFunction={onEdit}
        tableTitle="ছুটির তথ্য"
        salaries={[]}
        tableHeaderButtonHandler={() => {
          dispatch({
            type: 'localState',
            stateName: 'openModal',
            value: true,
          });
        }}
        dataYouWantoShowInBanglaDigit={'holiday'}
        isPaginationTable={true}
        page={state.localState.page}
        rowsPerPage={state.localState.rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        paginationTableCount={state.apiValues?.filteredHolidays?.length}
        plusButtonTitle="নতুন ছুটি যোগ করুন"
      />
      <Dialog
        maxWidth="md"
        open={state.localState.openModal}
        onClose={() => {
          clearState();
          state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' &&
            dispatch({
              type: 'localState',
              stateName: 'saveAndEditButtonLevel',
              value: 'সংরক্ষণ করুন',
            });
        }}
        onBackdropClick={() => {
          dispatch({
            type: 'localState',
            stateName: 'openModal',
            value: false,
          });
        }}
      >
        <DialogTitle>{` ${
          state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' ? ' ছুটি হালদানাগাদ' : 'নতুন ছুটি সংযুক্তি '
        } `}</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2.5}>
            <Grid item md={6} lg={6} xs={12} sm={12}>
              <TextField
                fullWidth
                label="ছুটির ধরণ"
                name="holidayType"
                variant="outlined"
                size="small"
                select
                SelectProps={{ native: true }}
                type="text"
                value={state.localState.holidayType}
                onChange={(e) => {
                  dispatch({
                    type: 'localState',
                    stateName: 'holidayType',
                    value: e.target.value,
                  });
                }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {state.apiValues?.allHolidayTypes?.map((option) => (
                  <option key={option.id} value={option.holidayType}>
                    {option.holidayDesc}
                  </option>
                ))}
              </TextField>
              {!state.localState.holidayType && state.errors.holidayType && (
                <span style={{ color: 'red' }}>{state.errors.holidayType}</span>
              )}
            </Grid>

            <Grid item md={6} lg={6} xs={12}>
              <TextField
                required
                id="officeId"
                name="officeId"
                select
                label="অফিসের নাম"
                variant="outlined"
                size="small"
                fullWidth
                value={state.localState.officeId}
                onChange={(e) => {
                  'officeId852963', e.target.value;
                  dispatch({
                    type: 'localState',
                    stateName: 'officeId',
                    value: e.target.value,
                  });
                }}
                SelectProps={{ native: true }}
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {state.apiValues?.officeNames?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.nameBn}
                  </option>
                ))}
              </TextField>
              {!state.localState.officeId && state.errors.officeId && (
                <span style={{ color: 'red' }}>{state.errors.officeId}</span>
              )}
            </Grid>

            {state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' && (
              <Grid item md={6} lg={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    label="ছুটির তারিখ"
                    disablePast="true"
                    value={state.localState.holidayDateForEdit}
                    onChange={(e) => {
                      dispatch({
                        type: 'localState',
                        stateName: 'holidayDateForEdit',
                        value: e,
                      });
                    }}
                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                  />
                </LocalizationProvider>
                {!state.localState.holidayDateForEdit && state.errors.holidayDateForEdit && (
                  <span style={{ color: 'red' }}>{state.errors.holidayDateForEdit}</span>
                )}
              </Grid>
            )}
            {state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' && (
              <Grid item md={6} lg={6} xs={12}>
                <Paper sx={{ paddingLeft: '10px' }}>
                  <FormControl component={'fieldset'}>
                    {/* <FormLabel>স্ট্যাটাস</FormLabel> */}
                    <RadioGroup
                      row
                      name="status"
                      value={state.localState.status}
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'status',
                          value: e.target.value,
                        });
                      }}
                    >
                      <FormControlLabel label="সক্রিয়" value={true} control={<Radio />} />
                      <FormControlLabel label="নিষ্ক্রিয়" value={false} control={<Radio />} />
                    </RadioGroup>
                  </FormControl>
                  {!state.localState.status && state.errors.status && (
                    <span style={{ color: 'red' }}>{state.errors.status}</span>
                  )}
                </Paper>
              </Grid>
            )}
            {state.localState.saveAndEditButtonLevel === 'সংরক্ষণ করুন' && (
              <>
                {' '}
                <Grid item md={6} lg={6} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      // id="holidayStartDate"
                      inputFormat="dd/MM/yyyy"
                      name="holidayStartDate"
                      label="শুরুর তারিখ"
                      disablePast="true"
                      value={state.localState.fromDate}
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'fromDate',
                          value: e,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                    />
                  </LocalizationProvider>
                  {!state.localState.fromDate && state.errors.fromDate && (
                    <span style={{ color: 'red' }}>{state.errors.fromDate}</span>
                  )}
                </Grid>
                <Grid item md={6} lg={6} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      // id="holidayEndDate"
                      inputFormat="dd/MM/yyyy"
                      name="holidayEndDate"
                      label="শেষের তারিখ"
                      disablePast="true"
                      value={state.localState.toDate}
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'toDate',
                          value: e,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                    />
                  </LocalizationProvider>
                  {!state.localState.toDate && state.errors.toDate && (
                    <span style={{ color: 'red' }}>{state.errors.toDate}</span>
                  )}
                  {Date.parse(state.localState.toDate) < Date.parse(state.localState.fromDate) && (
                    <span style={{ color: 'red' }}>{state.errors.toDate}</span>
                  )}
                </Grid>
              </>
            )}
            <Grid item md={12} xs={12}>
              <TextField
                helperText={`বিঃ দ্রঃ সরকারি ছুটি- হলে সরকারি ছুটি লিখুন অথবা ইংরেজিতে Public Holiday লিখুন , 
                সাপ্তাহিক ছুটি- হলে সাপ্তাহিক ছুটি (শুক্রবার ) ও সাপ্তাহিক ছুটি (শনিবার ) অথবা ইংরেজিতে Weekend(Friday) অথবা Weekend(Saturday) লিখুন`}
                fullWidth
                label={'ছুটির বিবরণ'}
                name="holidayDescription"
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#FFF' }}
                value={state.localState.holidayDescription}
                onChange={(e) => {
                  dispatch({
                    type: 'localState',
                    stateName: 'holidayDescription',
                    value: e.target.value,
                  });
                }}
              ></TextField>
            </Grid>

            <Grid container className="btn-container">
              <Tooltip title={state.localState.saveAndEditButtonLevel}>
                <Button
                  variant="contained"
                  className="btn btn-save"
                  onClick={onSubmitData}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  {state.localState.saveAndEditButtonLevel}
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default HolidaySetup;
