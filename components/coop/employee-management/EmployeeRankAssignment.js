import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Divider, Grid, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import RequiredFile from 'components/utils/RequiredFile';
import useGetDesignation from 'hooks/coop/employee/useGetAllDesignation';
import Joi from 'joi-browser';
import { useEffect, useReducer, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import TableComponent from 'service/employee/TableComponent';
import { inputRadioGroup } from 'service/fromInput';
import { employeeDesignationApiUrl, employeeDesignationUpdatetApiUrl } from '../../../url/coop/ApiList';
const initialState = {
  rankInfo: {
    designationId: '',
    // samityId: 0,
    designationName: '',
    status: '',
    rank: '',
  },
  apiValues: {
    // allSamityData: [],
    allDesignationData: [],
  },
  // formErrors: {
  //   samityNameError,
  // },
  isEdit: false,
};

const rankReducer = (state, action) => {
  switch (action.type) {
    case 'inputValues':
      return {
        ...state,
        rankInfo: {
          ...state.rankInfo,
          [action.fieldName]: action.value,
        },
      };
    case 'apiValues':
      return {
        ...state,
        apiValues: {
          ...state.apiValues,
          [action.apiName]: action.value,
        },
      };

    case 'setAllOrClearAll':
      return {
        ...state,

        rankInfo: {
          ...action.value,
        },
      };

    case 'others':
      return {
        ...state,
        [action.fieldName]: action.value,
      };
  }
};
const EmployeeRankAssignment = () => {
  // const { currentUrl } = UseCurrentUrl();
  const userData = tokenData();
  // const localData = localStorageData('samityInfo');
  const [errors, setErrors] = useState('');

  const schema = Joi.object({
    designationId: Joi.any().optional(),
    designationName: Joi.string()
      .max(50)
      .error(() => {
        return {
          message: 'পদবীর নাম ৫০ অক্ষরের বেশি হতে পারবেনা',
        };
      })
      .required()
      .error(() => {
        return {
          message: 'পদবীর নাম প্রদান করুন',
        };
      }),
    status: Joi.any().optional(),
    rank: Joi.number()
      .integer()
      .error(() => {
        return {
          messag: 'পদমর্যাদাক্রম পূর্ণ সংখ্যায় প্রদান করুন',
        };
      })
      .required()
      .error(() => {
        return {
          message: 'পদমর্যাদাক্রম প্রদান করুন',
        };
      }),
  });
  const [state, dispatch] = useReducer(rankReducer, initialState);
  const { getAllDesignation, allDesignation } = useGetDesignation();
  // state.rankInfo.samityId
  //   ? state.rankInfo.samityId === "নির্বাচন করুন"
  //     ? null
  //     : state.rankInfo.samityId
  //   : null
  // const { allSamity, getSamity } = useGetSamityName();
  // useEffect(() => {
  //   if (userData?.type === "user") {
  //     getSamity();
  //   }
  // }, []);

  useEffect(() => {
    getAllDesignation();
  }, []);
  // useEffect(() => {
  //   if (userData?.type === "citizen") {
  //     dispatch({
  //       type: "inputValues",
  //       fieldName: "samityId",
  //       value: localData.id,
  //     });
  //   }
  // }, []);

  const config = localStorageData('config');

  const onEdit = (row) => {
    dispatch({ type: 'others', fieldName: 'isEdit', value: true });
    const value = {
      designationId: row.id,
      // samityId: row.samityId,
      designationName: row.designationName,
      status: row.status,
      rank: row.rank,
    };
    dispatch({
      type: 'setAllOrClearAll',

      value: value,
    });
  };

  const onSubmitData = async () => {
    const { error } = Joi.validate(state.rankInfo, schema, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const validationErrors = {};
      error.details.forEach((error) => {
        validationErrors[error.path[0]] = error.message;
      });
      setErrors(validationErrors);
    } else {
      const payload = {
        // samityId: state.rankInfo.samityId,
        designationName: state.rankInfo.designationName,
        status: state.rankInfo.status,
        rank: state.rankInfo.rank,
      };

      try {
        const designationPostResult = state.isEdit
          ? await axios.put(employeeDesignationUpdatetApiUrl + state.rankInfo.designationId, payload, config)
          : await axios.post(employeeDesignationApiUrl, payload, config);
        NotificationManager.success(designationPostResult?.data?.message, '');
        dispatch({ type: 'others', fieldName: 'isEdit', value: false });
        dispatch({
          type: 'setAllOrClearAll',

          value: {
            designationId: '',
            // samityId: 0,
            designationName: '',
            status: '',
            rank: '',
          },
        });
        setErrors('');
        if (userData?.type === 'citizen') {
          getAllDesignation();
        }
        dispatch({ type: 'others', fieldName: 'isEdit', value: false });
        getAllDesignation();
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message);
        }
      }
    }
  };
  const columnNames = [
    'ক্রমিক নং',
    // "সমিতির নাম",
    'পদবী',
    'স্ট্যাটাস',
    'র‍্যাংক নং',
    'সম্পাদনা',
  ];
  // const tableDataKeys = ["samityName"];
  const tableDataKeys = [
    'index',
    // "samityName",
    'designationName',
    'status',
    'rank',
    'button',
  ];

  return (
    <Grid container px={1} py={2}>
      <Grid container spacing={2.5} px={2} py={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            fullWidth
            label={'পদবী'}
            name="designationName"
            // onChange={handleChangeOffice}
            onChange={(e) => {
              dispatch({
                type: 'inputValues',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
            required
            // select
            // value={""}
            value={state?.rankInfo?.designationName}
            SelectProps={{ native: true }}
            variant="outlined"
            size="small"
            error={Boolean(errors.designationName) && !state.rankInfo.designationName}
            helperText={errors.designationName && !state.rankInfo.designationName && errors.designationName}
          ></TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <TextField
            fullWidth
            label={RequiredFile('র‍্যাংক নং')}
            name="rank"
            variant="outlined"
            value={state.rankInfo.rank}
            size="small"
            type="number"
            onChange={(e) => {
              dispatch({
                type: 'inputValues',
                fieldName: e.target.name,
                value: e.target.value,
              });
            }}
            error={Boolean(errors.rank) && !state.rankInfo.rank}
            helperText={errors.rank && !state.rankInfo.rank && errors.rank}
          ></TextField>
        </Grid>

        {inputRadioGroup(
          'status',
          (e) => {
            dispatch({
              type: 'inputValues',
              fieldName: e.target.name,
              value: e.target.value,
            });
          },
          state.rankInfo.status,
          [
            {
              value: true,
              color: '#007bff',
              rcolor: 'primary',
              label: 'সক্রিয়',
            },
            {
              value: false,
              color: '#FFBF00',
              rColor: 'warning',
              label: 'নিষ্ক্রিয়',
            },
          ],
          4,
          4,
          12,
          12,
          false,
        )}
      </Grid>
      <Divider />
      <Grid container className="btn-container">
        <Tooltip title={state.isEdit ? 'হালদানাগাদ করুন' : 'সংরক্ষন করুন'}>
          <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
            {' '}
            {state.isEdit ? 'হালদানাগাদ করুন' : 'সংরক্ষন করুন'}
          </Button>
        </Tooltip>
      </Grid>
      <Divider />

      <TableComponent
        columnNames={columnNames}
        tableData={allDesignation}
        tableDataKeys={tableDataKeys}
        editFunction={onEdit}
        tableTitle="পদবি বরাদ্দের তথ্য"
        // conditionData={state.rankInfo.samityId}
      />
    </Grid>
  );
};
export default EmployeeRankAssignment;
