/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023/05/02 10:13:48
 * @modify date 2023-02-02 10:13:48
 * @desc [description]
 */

import { Clear } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import RequiredFile from 'components/utils/RequiredFile';
import { Fragment, useEffect, useState } from 'react';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { geoData } from '../../url/coop/ApiList';
const area = [
  {
    value: 1,
    label: 'বিভাগ',
  },
  {
    value: 2,
    label: 'জেলা',
  },
  {
    value: 3,
    label: 'উপজেলা/সিটি-কর্পোরেশন',
  },
  {
    value: 4,
    label: 'ইউনিয়ন/পৌরসভা/থানা',
  },

  {
    value: 5,
    label: 'গ্রাম/মহল্লা',
  },
];
const CasecadeAddress = ({ initialState, stateKeyName, setInitialState, geoState, setGeoState, isFilter, coop }) => {
  const config = localStorageData('config');
  const userData = tokenData();
  const [divisionData, setDivisionData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [upaThanaData, setUpaThanaData] = useState([]);
  const [unionData, setUnionData] = useState([]);

  useEffect(() => {
    getDivision();
  }, []);

  const getDivision = async () => {
    try {
      if (isFilter) {
        let divisionAllData = await axios.get(geoData + 'division', config);
        let onlinePermittedDoptors = divisionAllData?.data?.data.filter(
          (elem) => elem?.rules?.onlinePermittedDoptor[0] == userData.doptorId,
        );
        setDivisionData(onlinePermittedDoptors);
      } else {
        const data = await axios.get(geoData + 'division');
        setDivisionData(data.data.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const getDistrict = async (divisionId) => {
    try {
      if (isFilter) {
        let data = await axios.get(geoData + `district&divisionId=${divisionId}`, config);
        let onlinePermittedDoptors = data?.data?.data.filter((elem) => elem?.rules?.onlinePermittedDoptor[0] == 3);
        setDistrictData(onlinePermittedDoptors);
      } else {
        const districtData = await axios.get(geoData + `district&divisionId=${divisionId}`);
        setDistrictData(districtData.data.data);
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const getUpazila = async (districtId) => {
    try {
      const upazilaData = await axios.get(geoData + `upa-city&districtId=${districtId}`);
      setUpaThanaData(upazilaData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getUnion = async (districtId, upaCityId, upaCityType) => {
    try {
      const unionData = await axios.get(
        geoData + `uni-thana-paurasabha&districtId=${districtId}&upaCityId=${upaCityId}&upaCityType=${upaCityType}`,
      );
      setUnionData(unionData.data.data);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialState({ ...initialState, [name]: value });
  };

  const handleChangeArea = (e, index) => {
    const { name, value } = e.target;
    const list = [...geoState];
    switch (name) {
      case 'divisionId':
        list[index][name] = value == '0' ? '' : value;
        list[index]['divisionIdError'] = list[index][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        getDistrict(value);
        setGeoState(list);
        break;
      case 'districtId':
        list[index][name] = value == '0' ? '' : value;
        list[index]['districtIdError'] = list[index][name] == '' ? 'জেলা নির্বাচন করুন' : '';
        getUpazila(value);
        setGeoState(list);
        break;
      case 'samityUpaCityIdType':
        let upaData = upaThanaData?.find((row) => row.upaCityId === parseInt(value));
        list[index]['upaCityId'] = upaData?.upaCityId;
        list[index]['upaCityType'] = upaData?.upaCityType;
        list[index]['upaCityIdError'] = list[index]['upaCityId'] == '' ? 'উপজেলা/সিটি  নির্বাচন করুন' : '';
        getUnion(list[index]['districtId'], upaData?.upaCityId, upaData?.upaCityType);
        setGeoState(list);
        break;
      case 'samityUniThanaPawIdType':
        let unionDataFind = unionData?.find((row) => row.uniThanaPawId === parseInt(value));
        list[index]['uniThanaPawId'] = unionDataFind.uniThanaPawId ? unionDataFind.uniThanaPawId : '';
        list[index]['uniThanaPawType'] = unionDataFind.uniThanaPawType ? unionDataFind.uniThanaPawType : '';
        list[index]['uniThanaPawIdError'] =
          list[index]['uniThanaPawId'] == '' && initialState[stateKeyName] >= 4
            ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন'
            : '';
        setGeoState(list);
        break;
      case 'detailsAddress':
        list[index][name] = value;
        list[index]['detailsAddressError'] =
          list[index]['detailsAddress'] == '' && initialState[stateKeyName] == 5 ? 'ঠিকানা লিখুন' : '';
        setGeoState(list);
        break;
    }
  };
  const handleAddClicksetArea = () => {
    setGeoState([
      ...geoState,
      coop.workingAreaType == 1
        ? {
          divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
          divisionIdError: '',
          status: 'A',
        }
        : coop.workingAreaType == 2
          ? {
            divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
            divisionIdError: '',
            districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
            districtIdError: '',
            status: 'A',
          }
          : coop.workingAreaType == 3
            ? {
              divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
              divisionIdError: '',
              districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
              districtIdError: '',
              upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
              upaCityIdError: '',
              upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
              status: 'A',
            }
            : coop.workingAreaType == 4
              ? {
                divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
                divisionIdError: '',
                districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
                districtIdError: '',
                upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
                upaCityIdError: '',
                upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
                uniThanaPawId: '',
                uniThanaPawIdError: '',
                uniThanaPawType: '',
                status: 'A',
              }
              : coop.workingAreaType == 5
                ? {
                  divisionId: coop.samityDivisionId ? coop.samityDivisionId : '',
                  divisionIdError: '',
                  districtId: coop.samityDistrictId ? coop.samityDistrictId : '',
                  districtIdError: '',
                  upaCityId: coop.samityUpaCityId ? coop.samityUpaCityId : '',
                  upaCityIdError: '',
                  upaCityType: coop.samityUpaCityType ? coop.samityUpaCityType : '',
                  uniThanaPawId: '',
                  uniThanaPawIdError: '',
                  uniThanaPawType: '',
                  detailsAddress: '',
                  detailsAddressError: '',
                  status: 'A',
                }
                : '',
    ]);
  };
  const handleRemoveArea = async (id, index) => {
    if (id) {
      // try {
      //     await Swal.fire({
      //         title: "আপনি কি নিশ্চিত?",
      //         text: "আপনি এটি ফিরিয়ে আনতে পারবেন না!",
      //         icon: "warning",
      //         showCancelButton: true,
      //         confirmButtonColor: "#3085d6",
      //         cancelButtonColor: "#d33",
      //         cancelButtonText: "ফিরে যান ।",
      //         confirmButtonText: "হ্যাঁ, বাতিল করুন!",
      //     }).then((result) => {
      //         if (result.isConfirmed) {
      //             axios
      //                 .delete(MemberAreaInsert + "/" + id, config)
      //                 .then((response) => {
      //                     if (response.status === 200) {
      //                         Swal.fire(
      //                             "বাতিল হয়েছে!",
      //                             "আপনার মেম্বার এরিয়া বাতিল করা হয়েছে.",
      //                             "success"
      //                         );
      //                         getEditSamity();
      //                     } else {
      //                         Swal.fire(
      //                             " অকার্যকর হয়েছে!",
      //                             "প্রক্রিয়াটি অকার্যকর হয়েছে .",
      //                             "success"
      //                         );
      //                         getEditSamity();
      //                     }
      //                 });
      //         }
      //     });
      //     getEditSamity();
      // } catch (error) {
      //     errorHandler(error);
      // }
    } else {
      let list = [...geoState];
      list.splice(index, 1);
      setGeoState(list);
    }
  };
  return (
    <Fragment>
      <FromControlJSON
        arr={[
          {
            labelName: '',
            name: 'memberAreaType',
            onChange: handleChange,
            value: initialState[stateKeyName],
            size: 'small',
            type: 'text',
            viewType: 'select',
            optionData: area,
            optionValue: 'value',
            optionName: 'label',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: { padding: '.5rem 0 0' },
            selectDisable: true,
          },
        ]}
      />
      {geoState.map((row, i) => (
        <Grid container spacing={1.5} key={i} my={1}>
          {/* ************************************* বিভাগ ****************************  */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled={false}
              className={''}
              label={'বিভাগ'}
              name={'divisionId'}
              onChange={(e) => handleChangeArea(e, i)}
              select
              SelectProps={{ native: true }}
              value={row?.divisionId || 0}
              variant="outlined"
              size="small"
              sx={''}
              error={row?.divisionIdError ? true : false}
              helperText={row?.divisionIdError}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {divisionData.map((option, i) => (
                <option key={i} value={option.id}>
                  {option?.divisionNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          {/* ************************************** জেলা ***************************  */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled={false}
              className={''}
              label={'জেলা'}
              name={'districtId'}
              onChange={(e) => handleChangeArea(e, i)}
              select
              SelectProps={{ native: true }}
              value={row?.districtId || 0}
              variant="outlined"
              size="small"
              sx={''}
              error={row?.districtIdError ? true : false}
              helperText={row?.districtIdError}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {districtData.map((option, i) => (
                <option key={i} value={option.id}>
                  {option?.districtNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          {/* *********************************** উপজেলা/থানা *********************** */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled={false}
              className={''}
              label={'উপজেলা/থানা'}
              name={'samityUpaCityIdType'}
              onChange={(e) => handleChangeArea(e, i)}
              select
              SelectProps={{ native: true }}
              value={row?.upaCityId || 0}
              variant="outlined"
              size="small"
              sx={''}
              error={row?.districtIdError ? true : false}
              helperText={row?.districtIdError}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {upaThanaData.map((option, i) => (
                <option key={i} value={option.upaCityId}>
                  {option?.upaCityNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          {/* *********************************** ইউনিয়ন **************************** */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              disabled={false}
              className={''}
              label={'ইউনিয়ন'}
              name={'samityUniThanaPawIdType'}
              onChange={(e) => handleChangeArea(e, i)}
              select
              SelectProps={{ native: true }}
              value={row?.uniThanaPawId || 0}
              variant="outlined"
              size="small"
              sx={''}
              error={row?.districtIdError ? true : false}
              helperText={row?.districtIdError}
            >
              <option value={0}>- নির্বাচন করুন -</option>
              {unionData.map((option, i) => (
                <option key={i} value={option.uniThanaPawId}>
                  {option?.uniThanaPawNameBangla}
                </option>
              ))}
            </TextField>
          </Grid>
          {/* ********************************** গ্রাম/মহল্লা *************************** */}
          <FromControlJSON
            arr={[
              {
                labelName: initialState[stateKeyName] == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                name: 'detailsAddress',
                onChange: (e) => handleChangeArea(e, i),
                value: row.detailsAddress,
                size: 'small',
                type: 'text',
                viewType: 'textField',
                xl: 6,
                lg: 6,
                md: 6,
                xs: 6,
                isDisabled: false,
                placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                customClass: '',
                customStyle: {},
                errorMessage: row.detailsAddressError,
              },
            ]}
          />
          <Grid
            item
            sx={{
              display: 'flex',
              jusityContent: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Button
              variant="outlined"
              disabled={true}
              color="error"
              onClick={() => handleRemoveArea(row.id, i)}
              size="small"
              className="btn-close"
            >
              <Clear />
            </Button>
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button
          className="btn btn-add"
          onClick={handleAddClicksetArea}
          size="small"
          endIcon={<AddIcon />}
          sx={{ marginTop: '1rem' }}
        >
          একাধিক কর্ম এলাকা সংযুক্ত করুন{' '}
        </Button>
      </Grid>
    </Fragment>
  );
};

export default CasecadeAddress;
