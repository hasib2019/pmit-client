import CloseIcon from '@mui/icons-material/Close';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { Fragment, useEffect, useReducer } from 'react';
import { NotificationManager } from 'react-notifications';
import engToBdNum from 'service/englishToBanglaDigit';
import TableComponent from 'service/tableComponent2';
import { createGl, glListRoute, updateGl } from '../../../../../../url/AccountsApiLIst';

import lodash from 'lodash';
import { localStorageData } from 'service/common';
const star = (dialoge) => {
  return (
    <>
      <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
    </>
  );
};
const initialState = {
  localState: {
    glAccountType: '',
    glParrentId: '',
    isChildOrParentId: '',
    glAccountName: '',
    glCode: '',
    isManualDrAllow: false,
    isManualCrAllow: false,
    isSubGlAllow: false,
    isGeneradlHead: false,
    isBankBalance: false,
    isCashInHand: false,
    isReceivable: false,
    isPayable: false,
    isProductGl: false,
    levelCode: '',
    glNature: '',
    isActive: '',
    parentGlCode: '',
    openModal: false,
    saveAndEditButtonLevel: 'সংরক্ষণ করুন',
    editPrimaryKeyId: '',
    parentLevel: '',
    searchValue: '',
    page: 0,
    rowsPerPage: 10,
    isBudgetHead: false,
    usedBy: 'A',
    isLoading: false,
  },
  apiValues: {
    glAccountTypes: [],
    glParrentIds: [],
    glDataOfDoptor: [],
    filteredGlDataOfDoptor: [],
  },
  errors: {
    glAccountType: '',
    glParrentId: '',
    isChildOrParentId: '',
    glAccountName: '',
    glCode: '',
    isManualDrAllow: '',
    isManualCrAllow: '',
    isSubGlAllow: '',
    isGeneradlHead: '',
    isBankBalance: '',
    isCashInHand: '',
    isReceivable: '',
    isPayable: '',
    levelCode: '',
    glNature: '',
    isActive: '',
    usedBy: '',
  },
};

const usedBy = [
  {
    value: 'H',
    title: 'হেড অফিস ',
  },
  {
    value: 'B',
    title: 'শাখা অফিস',
  },
  {
    value: 'A',
    title: 'সকল অফিস',
  },
];
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

const GeneralLedger2 = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getGlAccountTypes();
  }, []);
  useEffect(() => {
    getGlParentIds(state.localState.glAccountType);
  }, [state.localState.glAccountType]);

  const config = localStorageData('config');
  const getGlAccountTypes = async () => {
    try {
      const glAccountTypes = await axios.get(glListRoute + '?isPagination=false&parentId=0', config);
      const glAccountTypeList = glAccountTypes.data.data;
      const glDataOfTheDoptor = await axios.get(glListRoute + '?isPagination=false', config);
      const glDataOfDoptorResult = lodash.orderBy(glDataOfTheDoptor.data.data, ['glacType'], ['asc']);
      dispatch({
        type: 'apiState',
        stateName: 'glDataOfDoptor',
        value: glDataOfDoptorResult,
      });
      dispatch({
        type: 'apiState',
        stateName: 'filteredGlDataOfDoptor',
        value: glDataOfDoptorResult,
      });
      dispatch({
        type: 'apiState',
        stateName: 'glAccountTypes',
        value: glAccountTypeList,
      });
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getGlParentIds = async (glAccountType) => {
    if (glAccountType) {
      try {
        const glParentIdResult = await axios.get(
          glListRoute + '?isPagination=false&parentChild=P' + '&glacType=' + glAccountType,
          config,
        );
        const glParentIds = glParentIdResult.data.data;
        dispatch({
          type: 'apiState',
          stateName: 'glParrentIds',
          value: glParentIds,
        });
      } catch (error) {
        if (error.response) {
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
  const checkMandatory = () => {
    let flag = true;
    let obj = {};
    if (state.localState.glAccountType === '') {
      flag = false;
      obj.glAccountType = 'লেজারের ধরণ নির্বাচন করুন';
    }
    // if (state.localState.isChildOrParentId === "") {
    //   flag = false;
    //   obj.isChildOrParentId = "জি এল এর পেরেন্ট চাইল্ড নির্বাচন করুন";
    // }
    if (state.localState.glParrentId === '') {
      flag = false;
      obj.glParrentId = 'প্যারেন্ট লেজার নির্বাচন করুন';
    }
    if (state.localState.glAccountName === '') {
      flag = false;
      obj.glAccountName = 'লেজারের নাম লিখুন';
    }
    if (state.localState.usedBy === '') {
      flag = false;
      obj.usedBy = 'ব্যবহারকারীর অফিস নির্বাচন করুন';
    }

    // if (state.localState.glCode === "") {
    //   flag = false;
    //   obj.glCode = "জি এল কোড লিখুন ";
    // }

    setTimeout(() => {
      dispatch({ type: 'formError', value: obj });
    }, 1);
    return flag;
  };

  const onSubmitData = async () => {
    let payload;
    const isMandatoryChecked = checkMandatory();

    if (isMandatoryChecked) {
      payload = {
        // glacCode: state.localState.glacCode,
        glacName: state.localState.glAccountName,
        parentChild: state.localState.isChildOrParentId,
        parentId: parseInt(state.localState.glParrentId),
        glacType: state.localState.glAccountType.toString(),
        // levelCode: state.localState.levelCode + 1,
        glNature: state.localState.glNature,
        isActive: state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' ? state.localState.isActive : true,
        authorize_status: 'N',
        parentGlCode: parseInt(state.localState.parentGlCode),
        useOffice: state.localState.usedBy,

        allowManualDr: state.localState.isChildOrParentId == 'P' ? false : state.localState.isManualDrAllow,
        allowManualCr: state.localState.isChildOrParentId == 'P' ? false : state.localState.isManualCrAllow,
        subGl: state.localState.isChildOrParentId == 'P' ? false : state.localState.isSubGlAllow,
        isGeneralHead: state.localState.isChildOrParentId == 'P' ? false : state.localState.isGeneradlHead,
        isBankBalance: state.localState.isChildOrParentId == 'P' ? false : state.localState.isBankBalance,
        isCashInHand: state.localState.isChildOrParentId == 'P' ? false : state.localState.isCashInHand,
        isReceivable: state.localState.isChildOrParentId == 'P' ? false : state.localState.isReceivable,
        isPayable: state.localState.isChildOrParentId == 'P' ? false : state.localState.isPayable,
        isBudgetHead: state.localState.isChildOrParentId == 'P' ? false : state.localState.isBudgetHead,
        isSavingsProductGl: state.localState.isChildOrParentId == 'P' ? false : state.localState.isProductGl,
      };

      try {
        dispatch({
          type: 'localState',
          stateName: 'isLoading',
          value: true,
        });
        setTimeout(() => {}, 10000);
        if (state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন') {
          const updateGlj = await axios.put(updateGl + state.localState.editPrimaryKeyId, payload, config);
          dispatch({
            type: 'localState',
            stateName: 'isLoading',
            value: false,
          });
          NotificationManager.success(updateGlj.data.message);
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
          getGlAccountTypes();
        } else {
          const createGlData = await axios.post(createGl, payload, config);
          dispatch({
            type: 'localState',
            stateName: 'isLoading',
            value: false,
          });
          NotificationManager.success(createGlData.data.message);
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
          getGlAccountTypes();
        }
      } catch (error) {
        dispatch({
          type: 'localState',
          stateName: 'isLoading',
          value: false,
        });

        if (error.response) {
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
        glAccountType: row.glacType,
        glParrentId: row.parentId,
        isChildOrParentId: row.parentChild,
        glAccountName: row.glacName,
        glCode: row.glacCode,
        isManualDrAllow: row.allowManualDr,
        isManualCrAllow: row.allowManualCr,
        isSubGlAllow: row.subGl,
        isGeneradlHead: row.isGeneralHead,
        isBankBalance: row.isBankBalance,
        isCashInHand: row.isCashInHand,
        isReceivable: row.isReceivable,
        isPayable: row.isPayable,
        levelCode: row.levelCode,
        glNature: row.glNature,
        isActive: row.isActive,
        parentGlCode: row.glacCode,
        editPrimaryKeyId: row.id,
        parentLevel: row.levelCode,
        usedBy: row.useOffice,
      },
    });
    //("rowwwwwwwwwww", row);
  };
  const clearState = () => {
    dispatch({
      type: 'setAllOrClearAll',
      value: {
        glAccountType: '',
        glParrentId: '',
        isChildOrParentId: '',
        glAccountName: '',
        glCode: '',
        isManualDrAllow: false,
        isManualCrAllow: false,
        isSubGlAllow: false,
        isGeneradlHead: false,
        isBankBalance: false,
        isCashInHand: false,
        isReceivable: false,
        isPayable: false,
        levelCode: '',
        glNature: '',
        isActive: '',
        parentGlCode: '',
        editPrimaryKeyId: '',
        usedBy: '',
      },
    });
    dispatch({
      type: 'localState',
      stateName: 'searchValue',
      value: '0',
    });
    dispatch({
      type: 'formError',
      value: {
        glAccountType: '',
        glParrentId: '',
        isChildOrParentId: '',
        glAccountName: '',
        glCode: '',
        isManualDrAllow: '',
        isManualCrAllow: '',
        isSubGlAllow: '',
        isGeneradlHead: '',
        isBankBalance: '',
        isCashInHand: '',
        isReceivable: '',
        isPayable: '',
        levelCode: '',
        glNature: '',
        isActive: '',
        usedBy: '',
      },
    });
  };
  const requestSearch = (e) => {
    dispatch({
      type: 'localState',
      stateName: 'page',
      value: 0,
    });
    dispatch({
      type: 'localState',
      stateName: 'rowsPerPage',
      value: 10,
    });

    const data = e.target.value == 10000000 ? e.target.value : e.target.value.toUpperCase();

    const filteredGlDataOfDoptor =
      data == 10000000
        ? state.apiValues.glDataOfDoptor
        : state.apiValues.glDataOfDoptor.filter((row) => {
            return row.glacType.includes(data);
          });

    if (data === '') {
      dispatch({
        type: 'apiState',
        stateName: 'filteredGlDataOfDoptor',
        value: state.apiValues.glDataOfDoptor,
      });
    } else {
      dispatch({
        type: 'apiState',
        stateName: 'filteredGlDataOfDoptor',
        value: filteredGlDataOfDoptor,
      });
    }
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
  const columnNames = ['ক্রমিক নং', ' লেজার কোড', ' লেজারের নাম', 'প্যারেন্ট / চাইল্ড', ' লেজারের ধরণ', 'সংশোধন'];
  const tableDataKeys = ['index', 'glacCode', 'glacName', 'parentChild', 'glNature', 'button'];

  return (
    <Fragment>
      <FormControl fullWidth>
        <InputLabel id="glAccountType">
          {state.localState.searchValue ? 'লেজারের ধরণ' : 'লেজারের ধরণ নির্বাচন করুন'}
        </InputLabel>
        <Select
          id="glAccountType"
          name="glAccountType"
          value={state.localState.searchValue}
          size="small"
          label={state.localState.searchValue ? 'লেজারের ধরণ' : 'লেজারের ধরণ নির্বাচন করুন'}
          onChange={(e) => {
            requestSearch(e);
            dispatch({
              type: 'localState',
              stateName: 'searchValue',
              value: e.target.value,
            });
          }}
          sx={{
            width: '30%',
            float: 'right',
            mb: '10px',
          }}
          // value={state.localState.searchValue}
        >
          {state.apiValues.glAccountTypes.map((option) => (
            <MenuItem key={option.id} value={option.glacType}>
              {option.glacName}
            </MenuItem>
          ))}
          <MenuItem value={10000000}>সকল লেজার</MenuItem>
        </Select>
      </FormControl>

      <TableComponent
        columnNames={columnNames}
        tableData={state.apiValues.filteredGlDataOfDoptor}
        tableDataKeys={tableDataKeys}
        editFunction={onEdit}
        tableTitle=" লেজারের তথ্য"
        salaries={[]}
        tableHeaderButtonHandler={() => {
          dispatch({
            type: 'localState',
            stateName: 'openModal',
            value: true,
          });
        }}
        dataYouWantoShowInBanglaDigit={'glacCode'}
        isPaginationTable={true}
        page={state.localState.page}
        rowsPerPage={state.localState.rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        paginationTableCount={state.apiValues.filteredGlDataOfDoptor.length}
        plusButtonTitle="জেনারেল লেজার তৈরি"
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
          dispatch({
            type: 'localState',
            stateName: 'saveAndEditButtonLevel',
            value: 'সংরক্ষণ করুন',
          });
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{`জেনারেল লেজার ${
            state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' ? 'হালদানাগাদ' : 'তৈরি'
          }`}</DialogTitle>
          <CloseIcon
            sx={{ margin: '10px', cursor: 'pointer' }}
            onClick={() => {
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
            }}
          />
        </div>

        <DialogContent>
          <Grid container md={12} xs={12} spacing={1.5}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="glAccountType">
                  {star(state.localState.glAccountType ? 'লেজারের ধরণ' : 'লেজারের ধরণ নির্বাচন করুন')}
                </InputLabel>
                <Select
                  label={star(state.localState.glAccountType ? 'লেজারের ধরণ' : 'লেজারের ধরণ নির্বাচন করুন')}
                  id="glAccountType"
                  name="glAccountType"
                  onChange={(e) => {
                    'glType', e.target.value;
                    dispatch({
                      type: 'localState',
                      stateName: 'glAccountType',
                      value: JSON.parse(e.target.value).glAccountTypeId,
                    });
                    // dispatch({
                    //   type: "localState",
                    //   stateName: "levelCode",
                    //   value: JSON.parse(e.target.value).levelCode,
                    // });
                    dispatch({
                      type: 'localState',
                      stateName: 'glNature',
                      value: JSON.parse(e.target.value).glNature,
                    });
                    // dispatch({
                    //   type: "localState",
                    //   stateName: "isActive",
                    //   value: JSON.parse(e.target.value).isActive,
                    // });
                  }}
                  size="small"
                  style={{ backgroundColor: '#FFF' }}
                  value={
                    state.localState.glAccountType != ''
                      ? JSON.stringify({
                          glAccountTypeId: state.localState.glAccountType,
                          // levelCode: state.localState.levelCode,
                          glNature: state.localState.glNature,
                          // isActive: state.localState.isActive,
                        })
                      : ''
                  }
                >
                  {state.apiValues.glAccountTypes.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={JSON.stringify({
                        glAccountTypeId: option.glacType,
                        // levelCode: option.levelCode,
                        glNature: option.glNature,
                        // isActive: option.isActive,
                      })}
                    >
                      {option.glacName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!state.localState.glAccountType && state.errors.glAccountType}>
                  {!state.localState.glAccountType && state.errors.glAccountType}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="glParrentId">
                  {state.localState.glParrentId ? star('প্যারেন্ট  লেজার') : star('প্যারেন্ট  লেজার নির্বাচন করুন')}
                </InputLabel>
                <Select
                  label={
                    state.localState.glParrentId ? star('প্যারেন্ট  লেজার') : star('প্যারেন্ট  লেজার নির্বাচন করুন')
                  }
                  id="glParrentId"
                  name="glParrentId"
                  onChange={(e) => {
                    'parentId', e.target.value;
                    const id = parseInt(e.target.value);
                    dispatch({
                      type: 'localState',
                      stateName: 'glParrentId',
                      value: e.target.value,
                    });

                    const parentGlInfo = state.apiValues.glParrentIds.find((glInfo) => {
                      if (glInfo.id === id) {
                        return glInfo;
                      }
                    });

                    dispatch({
                      type: 'localState',
                      stateName: 'parentGlCode',
                      value: parentGlInfo.glacCode,
                    });
                    dispatch({
                      type: 'localState',
                      stateName: 'parentLevel',
                      value: parentGlInfo.levelCode,
                    });
                    dispatch({
                      type: 'localState',
                      stateName: 'isChildOrParentId',
                      value: parentGlInfo.levelCode <= 2 ? 'P' : 'C',
                    });
                  }}
                  //onChange={(e) => handleType(e)}

                  size="small"
                  style={{ backgroundColor: '#FFF' }}
                  value={state.localState.glParrentId}
                  // value={glTypeId != null ? glTypeId : ""}
                >
                  {state.apiValues.glParrentIds.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.glacName + ' ' + '(' + engToBdNum(option.glacCode) + ')'}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!state.localState.glParrentId && state.errors.glParrentId}>
                  {!state.localState.glParrentId && state.errors.glParrentId}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              {' '}
              <TextField
                fullWidth
                label={star('লেজারের নাম')}
                id="glAccountName"
                name="glAccountName"
                onChange={(e) => {
                  dispatch({
                    type: 'localState',
                    stateName: 'glAccountName',
                    value: e.target.value,
                  });
                }}
                type="text"
                variant="outlined"
                size="small"
                style={{ backgroundColor: '#FFF' }}
                value={state.localState.glAccountName}
              ></TextField>
              <FormHelperText error={!state.localState.glAccountName && state.errors.glAccountName}>
                {!state.localState.glAccountName && state.errors.glAccountName}
              </FormHelperText>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="glParrentId">
                  {state.localState.usedBy ? star('ব্যবহারকারীর অফিস') : star('ব্যবহারকারীর অফিস নির্বাচন করুন')}
                </InputLabel>
                <Select
                  label={state.localState.usedBy ? star('ব্যবহারকারীর অফিস') : star('ব্যবহারকারীর অফিস নির্বাচন করুন')}
                  id="glParrentId"
                  name="glParrentId"
                  onChange={(e) => {
                    'parentId', e.target.value;
                    // const id = parseInt(e.target.value);
                    dispatch({
                      type: 'localState',
                      stateName: 'usedBy',
                      value: e.target.value,
                    });
                  }}
                  //onChange={(e) => handleType(e)}

                  size="small"
                  style={{ backgroundColor: '#FFF' }}
                  value={state.localState.usedBy}
                >
                  {usedBy.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.title}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!state.localState.usedBy && state.errors.usedBy}>
                  {!state.localState.usedBy && state.errors.usedBy}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl component="fieldset" disabled>
                <RadioGroup
                  row
                  name="isChildOrParentId"
                  // value={transectionTypevalue}
                  value={state.localState.isChildOrParentId}
                  onChange={(e) => {
                    dispatch({
                      type: 'localState',
                      stateName: 'isChildOrParentId',
                      value: e.target.value,
                    });
                  }}
                >
                  <FormControlLabel value="P" control={<Radio />} label="প্যারেন্ট" />
                  <FormControlLabel value="C" control={<Radio />} label="চাইল্ড" />
                </RadioGroup>
              </FormControl>

              <span style={{ color: 'red' }}>
                {!state.localState.isChildOrParentId && state.errors.isChildOrParentId}
              </span>
            </Grid>

            {state.localState.isChildOrParentId === 'C' && (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                    <FormLabel id="isManualDrAllow">ম্যানুয়াল ডেবিটের অনুমতি আছে?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="isManualDrAllow"
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'isManualDrAllow',
                          value: e.target.value,
                        });
                      }}
                      value={state.localState.isManualDrAllow}
                    >
                      <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                      <FormControlLabel value={false} control={<Radio />} label="না" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                    <FormLabel id="isManualCrAllow">ম্যানুয়াল ক্রেডিটের অনুমতি আছে?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="isManualCrAllow"
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'isManualCrAllow',
                          value: e.target.value,
                        });
                      }}
                      value={state.localState.isManualCrAllow}
                    >
                      <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                      <FormControlLabel value={false} control={<Radio />} label="না" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {state.localState.glAccountType === 'L' && (
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">সাব লেজারের অনুমতি আছে?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isSubGlAllow"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isSubGlAllow',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isSubGlAllow}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                {state.localState.glAccountType === 'L' && (
                  <Grid item md={4} xs={12}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel id="isGeneradlHead">জেনারেল লেজার কিনা?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isGeneradlHead"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isGeneradlHead',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isGeneradlHead}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                {state.localState.glAccountType === 'A' && (
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel>ব্যাংক ব্যালেন্স কিনা?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isBankBalance"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isBankBalance',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isBankBalance}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                {state.localState.glAccountType === 'A' && (
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel>হাতে নগদ কিনা?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isCashInHand"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isCashInHand',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isCashInHand}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                {state.localState.glAccountType === 'I' && (
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel>রিসিভেবল কিনা?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isReceivable"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isReceivable',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isReceivable}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                {(state.localState.glAccountType === 'L' || state.localState.glAccountType === 'A') && (
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel>প্রোডাক্ট লেজার কিনা?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isProductGl"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isProductGl',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isProductGl}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                    <FormLabel>বাজেট লেজার কিনা ?</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="isPayable"
                      onChange={(e) => {
                        dispatch({
                          type: 'localState',
                          stateName: 'isBudgetHead',
                          value: e.target.value,
                        });
                      }}
                      value={state.localState.isBudgetHead}
                    >
                      <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                      <FormControlLabel value={false} control={<Radio />} label="না" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {state.localState.saveAndEditButtonLevel === 'হালদানাগাদ করুন' && (
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '10px' }}>
                      <FormLabel>সক্রিয় কিনা?</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="isPayable"
                        onChange={(e) => {
                          dispatch({
                            type: 'localState',
                            stateName: 'isActive',
                            value: e.target.value,
                          });
                        }}
                        value={state.localState.isActive}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="হ্যাঁ" />
                        <FormControlLabel value={false} control={<Radio />} label="না" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )}
              </>
            )}
            <Grid container className="btn-container">
              <Tooltip title={state.localState.saveAndEditButtonLevel}>
                <LoadingButton
                  disabled={state.localState.isLoading}
                  loading={state.localState.isLoading}
                  loadingPosition="end"
                  variant="contained"
                  className="btn btn-save"
                  onClick={onSubmitData}
                  startIcon={<SaveOutlinedIcon />}
                >
                  {' '}
                  {state.localState.saveAndEditButtonLevel}
                </LoadingButton>
              </Tooltip>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
export default GeneralLedger2;
