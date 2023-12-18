import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, TextField, ToggleButton, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import TableComponent from '../../../../../service/TableComponent';
import {
  createSavingsProduct,
  glListRoute,
  loanProject,
  projectWiseProducts,
  updateSavingsProduct,
} from '../../../../../url/ApiList';
import { getApi } from '../utils/getApi';
import CreateProduct from './CreateProduct';
// import { Button } from "react-scroll";

const initialState = {
  localState: {
    projectName: 0,
    productCode: '',
    productName: '',
    productGl: 0,
    startDate: new Date(),
    openModal: false,
    saveAndEditButtonLevel: 'সংরক্ষণ করুন',
    editPrimaryKeyId: '',
    page: 0,
    rowsPerPage: 10,
    searchValue: '',
    isDefaultProduct: false,
    showIsDefault: false,
  },
  apiValues: {
    projects: [],
    glLists: [],
    productList: [],
    filteredProductList: [],
  },
  errors: {
    projectName: '',
    productCode: '',
    productName: '',
    startDate: '',
    productGl: '',
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

const SavingsPorduct = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [productState, setProductState] = useState('');
  useEffect(() => {
    getProject();
    getGlList();
    getProduct();
  }, []);
  const getProject = async () => {
    let projects = await getApi(loanProject, 'get');
    // setProjectsName(projects.data.data ? projects.data.data : []);

    dispatch({
      type: 'apiState',
      stateName: 'projects',
      value: projects?.data?.data,
    });
  };
  const getGlList = async () => {
    let getList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=L', 'get');
    dispatch({
      type: 'apiState',
      stateName: 'glLists',
      value: getList.data.data,
    });
    // setGlList(getList.data.data ? getList.data.data : []);
  };
  const getProduct = async () => {
    let products = await getApi(projectWiseProducts, 'get');
    dispatch({
      type: 'apiState',
      stateName: 'productList',
      value: products.data.data,
    });
    dispatch({
      type: 'apiState',
      stateName: 'filteredProductList',
      value: products.data.data,
    });
    //let products = axios.get(productList, {params:{projectId: parseInt(selectedProject)}})
    // setAllProduct(products.data.data ? products.data.data : []);
  };
  const submitHandler = () => {
    setProductState(true);
  };
  const checkMandatory = () => {
    let flag = true;
    let obj = {};

    if (state.localState.projectName === '' || state.localState.projectName === 0) {
      flag = false;
      obj.projectName = 'প্রজেক্টের নাম নির্বাচন করুন';
    }
    if (state.localState.productCode === '') {
      if (state.localState.productCode.toString().length < 3 || state.localState.productCode.toString().length > 3) {
        flag = false;
        obj.productCode = 'প্রোডাক্ট কোড অবশ্যই তিন ডিজিটের হতে হবে ';
      } else if (state.localState.productCode === '') {
        flag = false;
        obj.productCode = 'প্রোডাক্ট কোড লিখুন';
      }
    }
    if (state.localState.productName === '') {
      flag = false;
      obj.productName = 'প্রোডাক্ট এর নাম লিখুন';
    }
    if (!state.localState.startDate) {
      flag = false;
      obj.startDate = 'প্ৰডাক্ট শুরুর তারিখ দিন';
    }
    if (!state.localState.productGl) {
      flag = false;
      obj.productGl = 'প্রোডাক্ট জি এল নির্বাচন করুন';
    }

    setTimeout(() => {
      dispatch({ type: 'formError', value: obj });
    });
    return flag;
  };
  const config = localStorageData('config');
  const onSubmitData = async () => {
    const checked = checkMandatory();
    if (checked) {
      const payload = {
        productName: state.localState.productName,
        productCode: state.localState.productCode,
        openDate: state.localState.startDate,
        projectId: state.localState.projectName,
        productGl: state.localState.productGl,

        ...(state.localState.showIsDefault && {
          isDefaultSavings: state.localState.isDefaultProduct,
        }),
      };

      try {
        if (state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন') {
          const savingProductUpdate = await axios.put(
            updateSavingsProduct + state.localState.editPrimaryKeyId,
            payload,
            config,
          );
          NotificationManager.success(savingProductUpdate.data.message);
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
          dispatch({
            type: 'localState',
            stateName: 'saveAndEditButtonLevel',
            value: 'সংরক্ষণ করুন',
          });
          clearState();
          getProduct();
        } else {
          const createSavingsProductData = await axios.post(createSavingsProduct, payload, config);
          NotificationManager.success(createSavingsProductData.data.message);
          dispatch({
            type: 'localState',
            stateName: 'openModal',
            value: false,
          });
          clearState();
          getProduct();
          // ("createSavingsProduct", createGlData);
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
        projectName: 0,
        productCode: '',
        productName: '',
        productGl: 0,
        startDate: new Date(),
        openModal: false,
        saveAndEditButtonLevel: 'সংরক্ষণ করুন',
        editPrimaryKeyId: '',
        showIsDefault: false,
        isDefaultProduct: false,
      },
    });
    dispatch({
      type: 'formError',
      value: {
        ...state.errors,
        projectName: '',
        productCode: '',
        productName: '',
        startDate: '',
        productGl: '',
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
        projectName: row.projectId,
        productCode: row.productCode,
        productName: row.productName,
        productGl: row.productGl,
        startDate: row.openDate,

        editPrimaryKeyId: row.id,
        isDefaultProduct: row.isDefaultSavings ? true : false,
        showIsDefault: row.isDefaultSavings ? true : false,
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
  const columnNames = ['ক্রমিক নং', 'প্রকল্পের নাম', 'প্রোডাক্ট এর নাম', 'কোড', 'শুরুর তারিখ', 'সম্পাদনা'];
  const tableDataKeys = ['index', 'projectNameBangla', 'productName', 'productCode', 'openDate', 'button'];
  return (
    <>
      {productState ? (
        <CreateProduct />
      ) : (
        <>
          <TableComponent
            columnNames={columnNames}
            tableData={state?.apiValues?.filteredProductList}
            tableDataKeys={tableDataKeys}
            editFunction={onEdit}
            tableTitle="সেভিংস প্রোডাক্ট এর তথ্য"
            salaries={[]}
            // tableHeaderButtonHandler={() => {
            //   dispatch({
            //     type: "localState",
            //     stateName: "openModal",
            //     value: true,
            //   });
            // }}
            tableHeaderButtonHandler={submitHandler}
            dataYouWantoShowInBanglaDigit={'glacCode'}
            isPaginationTable={true}
            page={state.localState.page}
            rowsPerPage={state.localState.rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            paginationTableCount={
              state.localState.searchValue === ''
                ? state.apiValues?.productList?.length
                : state.apiValues?.filteredProductList?.length
            }
            plusButtonTitle="সেভিংস প্রোডাক্ট  তৈরী করুন "
            // tableShowHideCondition={salaryInfo.samityName}
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
            {/* <DialogTitle>{`সেভিংস প্রোডাক্ট ${
          state.localState.saveAndEditButtonLevel === "হালদানাগাদ করুন"
            ? "হালদানাগাদ"
            : "সংরক্ষণ "
        }  করুন`}</DialogTitle> */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <DialogTitle>{`সেভিংস প্রোডাক্ট ${
                state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' ? 'হালদানাগাদ' : 'সংরক্ষণ'
              }`}</DialogTitle>
              <CloseIcon
                sx={{ margin: '10px', cursor: 'pointer' }}
                onClick={() => {
                  clearState();
                  dispatch({
                    type: 'localState',
                    stateName: 'saveAndEditButtonLevel',
                    value: 'সংরক্ষণ করুন',
                  });
                  dispatch({
                    type: 'localState',
                    stateName: 'openModal',
                    value: false,
                  });
                }}
              />
            </div>
            <DialogContent>
              <Grid container md={12} xs={12} spacing={2.5}>
                <Grid item md={4} lg={4} xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="প্রোজেক্টের নাম/কোড"
                    name="projectName"
                    value={state.localState.projectName}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      dispatch({
                        type: 'localState',
                        stateName: 'projectName',
                        value: e.target.value,
                      });
                      const projectInfo = state.apiValues.projects.find((projectInfo) => {
                        if (projectInfo.id === id) {
                          return projectInfo;
                        }
                      });
                      'projectINfo', projectInfo;
                      dispatch({
                        type: 'localState',
                        stateName: 'isDefaultProduct',
                        value: projectInfo.isDefaultProduct,
                      });
                      dispatch({
                        type: 'localState',
                        stateName: 'showIsDefault',
                        value: true,
                      });
                    }}
                    variant="outlined"
                    size="small"
                    select
                    SelectProps={{ native: true }}
                    type="text"
                  >
                    <option value={0}>- নির্বাচন করুন -</option>
                    {state.apiValues?.projects?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.projectNameBangla}
                      </option>
                    ))}
                  </TextField>

                  {!state.localState.projectName && state.errors.projectName && (
                    <span style={{ color: 'red' }}>{state.errors.projectName}</span>
                  )}
                </Grid>

                <Grid item md={4} lg={4} xs={12}>
                  <TextField
                    id="productCode"
                    name="productCode"
                    value={state.localState.productCode}
                    onChange={(e) => {
                      if (e.target.value.toString().length !== 3) {
                        dispatch({
                          type: 'formError',

                          value: {
                            ...state.errors,
                            productCode: 'প্রোডাক্ট কোড তিন ডিজিটের হতে হবে',
                          },
                        });
                      }
                      if (e.target.value.toString().length === 3) {
                        dispatch({
                          type: 'formError',

                          value: { ...state.errors, productCode: '' },
                        });
                      }
                      // const regxForNotAllowingSpecialCharacter = RegExp(/[^\w\s]/gi);

                      dispatch({
                        type: 'localState',
                        stateName: 'productCode',
                        value: e.target.value.replace(/[^A-Za-z0-9]/gi, ''),
                      });
                    }}
                    label="প্রোডাক্ট কোড"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  {/* {!state.localState.productCode && state.errors.productCode && (
                <span style={{ color: "red" }}>{state.errors.productCode}</span>
              )} */}
                  {state.localState.productCode.length !== 3 && (
                    <span style={{ color: 'red' }}>{state.errors.productCode}</span>
                  )}
                </Grid>
                <Grid item md={4} lg={4} xs={12}>
                  <TextField
                    id="productName"
                    name="productName"
                    value={state.localState.productName}
                    onChange={(e) => {
                      dispatch({
                        type: 'localState',
                        stateName: 'productName',
                        value: e.target.value,
                      });
                    }}
                    label="প্রোডাক্টের নাম"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  {!state.localState.productName && state.errors.productName && (
                    <span style={{ color: 'red' }}>{state.errors.productName}</span>
                  )}
                </Grid>

                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label={'প্রোডাক্ট জিএল'}
                    name="productGl"
                    disabled=""
                    select
                    SelectProps={{ native: true }}
                    value={state.localState.productGl}
                    onChange={(e) => {
                      'productGlValue', e.target.value;
                      dispatch({
                        type: 'localState',
                        stateName: 'productGl',
                        value: e.target.value,
                      });
                    }}
                    variant="outlined"
                    size="small"
                  >
                    <option value={0}>- নির্বাচন করুন -</option>
                    {state.apiValues?.glLists?.map((option, idx) => {
                      'productGlId', option.id, state.localState.productGl;
                      return (
                        <option key={idx} value={option.id}>
                          {option.glacName}
                        </option>
                      );
                    })}
                  </TextField>
                  {!state.localState.productGl && state.errors.productGl && (
                    <span style={{ color: 'red' }}>{state.errors.productGl}</span>
                  )}
                </Grid>
                <Grid item md={4} lg={4} xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      id="savingsProductStartDate"
                      name="savingsProductStartDate"
                      label="শুরুর তারিখ"
                      value={state.localState.startDate}
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'startDate',
                          value: e,
                        });
                      }}
                      //   disabled = ""
                      renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                    />
                  </LocalizationProvider>
                  {!state.localState.startDate && state.errors.startDate && (
                    <span style={{ color: 'red' }}>{state.errors.startDate}</span>
                  )}
                </Grid>
                {
                  <Grid
                    item
                    md={4}
                    xs={12}
                    sx={{
                      '& .MuiToggleButton-root.Mui-selected': {
                        color: '#357C3C',
                        backgroundColor: '#E7FBBE',
                      },
                    }}
                  >
                    <ToggleButton
                      value="check"
                      fullWidth
                      selected={state.localState.isDefaultProduct}
                      onChange={() => {
                        dispatch({
                          type: 'localState',
                          stateName: 'isDefaultProduct',
                          value: !state.localState.isDefaultProduct,
                        });
                      }}
                      sx={{ height: '40px' }}
                    >
                      {state.localState.isDefaultProduct ? (
                        <>
                          ডিফল্ট প্রোডাক্ট
                          <CheckCircleIcon />
                          <h3>হ্যাঁ</h3>
                        </>
                      ) : (
                        <>
                          ডিফল্ট প্রোডাক্ট
                          <HelpIcon />
                          <h3>না</h3>
                        </>
                      )}
                    </ToggleButton>
                  </Grid>
                }

                <Grid container className="btn-container">
                  <Tooltip title="সংরক্ষণ করুন">
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
      )}
    </>
  );
};
export default SavingsPorduct;
