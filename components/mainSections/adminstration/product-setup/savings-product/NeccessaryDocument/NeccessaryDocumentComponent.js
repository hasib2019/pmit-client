import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Autocomplete, Button, Grid, TextField, Tooltip } from '@mui/material';
import star from 'components/utils/coop/star';
import { FieldArray, Formik } from 'formik';
import { useEffect, useState } from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { useDispatch, useSelector } from 'react-redux';
import { refreshState } from 'redux/feature/savingsProduct/savingsProductSlice';
import * as yup from 'yup';
import NeccessaryDocumentForm from './NeccessaryDocumentForm';
import NeccessaryDocumentTableComponent from './NeccessaryDocumentTableComponent';

import { editProductInfo } from 'redux/feature/savingsProduct/savingsProductSlice';
import { employeeRecordByOffice, officeName } from '../../../../../../url/ApiList';
import { getApi } from '../../utils/getApi';

const NeccessaryDocumentComponent = ({ handlePage }) => {
  const dispatch = useDispatch();
  const { appId, specificProductInfo } = useSelector((state) => state.savingsProduct);
  const [editedId, setEditedId] = useState(null);
  const [officeObj, setOfficeObj] = useState({ id: '', label: '' });
  const [empList, setEmpList] = useState([]);
  const [officeNames, setOfficeNames] = useState([]);
  const [nextAppDesId, setNextAppDesId] = useState('');

  let getOfficeName = async () => {
    try {
      let officeNameData = await getApi(officeName, 'get');
      setOfficeNames(officeNameData.data.data);
    } catch (error) {
      if (error.response) {
        NotificationManager.error(error.message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  };
  const getDeskId = async (id) => {
    try {
      let Data = await getApi(employeeRecordByOffice + '?officeId=' + id, 'get');

      const deskData = Data.data.data;
      setEmpList(deskData);
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
  useEffect(() => {
    getOfficeName();
  }, []);

  const productName = specificProductInfo?.productMaster?.productName;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getAppIdNotification(productName);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [productName]);

  const getAppIdNotification = (foundProduct) => {
    if (!foundProduct) {
      NotificationManager.warning('অনুগ্রহ করে প্রোডাক্ট মাস্টার পেইজ প্ৰথমে সম্পূন্ন করুন।', 'সতর্কতা', 5000);
    }
  };
  const handleNextAppDesig = (e) => {
    setNextAppDesId(e.target.value);
  };
  const validationSchema = yup.object({
    docArray: yup.array().of(
      yup.object().shape({
        docType: yup.string().required('ডকুমেন্ট এর ধরণ আবশ্যক'),
      }),
    ),
  });
  return (
    <>
      <Formik
        key={1}
        initialValues={{
          docArray: [
            {
              status: false,
              docType: '',
            },
          ],
        }}
        validateOnChange={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          let requestStatus = '';

          const { docArray } = values;
          let docArrayWhole = [];
          let payload;
          if (specificProductInfo?.neccessaryDocument) {
            docArrayWhole = [...specificProductInfo?.neccessaryDocument];
          }
          if (editedId != null) {
            docArrayWhole = [...specificProductInfo?.neccessaryDocument];
            docArrayWhole[editedId] = docArray[0];
          } else {
            docArrayWhole = [...docArrayWhole, ...docArray];
          }
          payload = {
            projectId: specificProductInfo.productMaster.projectId,
            data: {
              neccessaryDocument: docArrayWhole,
            },
            nextAppDesId: nextAppDesId,
          };
          requestStatus = await dispatch(
            editProductInfo({
              id: appId,
              data: {
                route: 'neccessaryDocument',
                value: payload,
              },
            }),
          );
          if (requestStatus.meta.requestStatus !== 'rejected') {
            resetForm();
            setEditedId(null);
            await dispatch(refreshState());
            handlePage(1);
          }
        }}
      >
        {(props) => {
          const { handleSubmit, setFieldValue } = props;
          const editDataFunc = (idx) => {
            setEditedId(idx);
            setFieldValue('chargeArray', specificProductInfo?.productCharge);
          };
          return (
            <>
              <NeccessaryDocumentForm />
              <Grid container className="btn-container">
                <FieldArray name="docArray">
                  {(arrayHelpers) => {
                    return (
                      <Tooltip title="প্রয়োজনীয় ডকুমেন্ট যোগ করুন">
                        <Button
                          variant="contained"
                          className="btn btn-primary"
                          onClick={() => {
                            arrayHelpers.push({
                              status: false,
                              docType: '',
                            });
                          }}
                          startIcon={<AddIcon />}
                        >
                          {' '}
                          প্রয়োজনীয় ডকুমেন্ট
                        </Button>
                      </Tooltip>
                    );
                  }}
                </FieldArray>
                <Grid container mt={2} mb={4}>
                  <Grid item md={6} xs={12} sx={{ marginTop: '10px', marginRight: '5px' }}>
                    <Autocomplete
                      disablePortal
                      inputProps={{ style: { padding: 0, margin: 0 } }}
                      name="officeName"
                      onChange={(event, value) => {
                        if (value == null) {
                          setOfficeObj({
                            id: '',
                            label: '',
                          });
                        } else {
                          value &&
                            setOfficeObj({
                              id: value.id,
                              label: value.label,
                            });
                          getDeskId(value.id);
                        }
                      }}
                      options={officeNames.map((option) => {
                        return {
                          id: option.id,
                          label: option.nameBn,
                        };
                      })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label={officeObj.id === '' ? star('কার্যালয় নির্বাচন করুন') : star('কার্যালয়')}
                          variant="outlined"
                          size="small"
                        />
                      )}
                      value={officeObj}
                    />
                  </Grid>
                  <Grid item md={5.5} xs={12} sx={{ marginTop: '10px', marginRight: '5px' }}>
                    <TextField
                      id="projectName"
                      fullWidth
                      label={star('আবেদন গ্রহনকারীর নাম')}
                      name="nextAppDesId"
                      select
                      SelectProps={{ native: true }}
                      value={nextAppDesId ? nextAppDesId : ' '}
                      onChange={handleNextAppDesig}
                      disabled=""
                      variant="outlined"
                      size="small"
                    >
                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                      {empList.map((option, idx) => (
                        <option key={idx} value={option.designationId}>
                          {`${option.nameBn ? option.nameBn : ''} (${option.designation})`}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Tooltip title="সংরক্ষণ করুন">
                  <Button
                    variant="contained"
                    className="btn btn-save"
                    onClick={handleSubmit}
                    startIcon={<SaveOutlinedIcon />}
                  >
                    {' '}
                    সংরক্ষণ করুন
                  </Button>
                </Tooltip>
              </Grid>
              <NeccessaryDocumentTableComponent
                data={specificProductInfo?.neccessaryDocument || []}
                editDataFunc={editDataFunc}
              />
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default NeccessaryDocumentComponent;
