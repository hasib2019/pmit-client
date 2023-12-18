/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Clear from '@mui/icons-material/Clear';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import RequiredFile from 'components/utils/RequiredFile';
import GetGeoData from 'components/utils/coop/GetGeoData';
// import dynamic from 'next/dynamic';
import { Fragment } from 'react';
import 'react-quill/dist/quill.snow.css';
import FromControlJSON from 'service/form/FormControlJSON';
import { engToBang } from 'service/numberConverter';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// function createMarkup(value) {
//   return {
//     __html: value,
//   };
// }

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
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
const MemberAddress = ({
  element,
  memberArea,
  defaultMemberAreaType,
  newAmendmentData,
  setNewAmendmentData,
  memberSelectArea,
  setMemberSelectArea,
  isApproval,
  setByLawsData,
  index,
  i,
}) => {
  const handleChangeMemberAreaType = (e) => {
    const { name, value } = e.target;
    setNewAmendmentData({
      ...newAmendmentData,
      samityInfo: {
        ...newAmendmentData.samityInfo,
        [name]: parseInt(value),
      },
    });
  };
  const handleChangeMemberArea = async (e, ind, index, i) => {
    const { name, value } = e.target;
    const list = [...memberSelectArea];
    let upaData, unionData;
    switch (name) {
      case 'divisionId':
        list[ind][name] = value == '0' ? '' : parseInt(value);
        list[ind]['divisionIdError'] = list[ind][name] == '' ? 'বিভাগ নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'districtId':
        list[ind][name] = value == '0' ? '' : parseInt(value);
        list[ind]['districtIdError'] = list[ind][name] == '' ? 'জেলা নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'samityUpaCityIdType':
        upaData = JSON.parse(e.target.value);
        list[ind]['upaCityId'] = upaData.upaCityId ? upaData.upaCityId : '';
        list[ind]['upaCityType'] = upaData.upaCityType ? upaData.upaCityType : '';
        list[ind]['upaCityIdError'] = list[ind]['upaCityId'] == '' ? 'উপজেলা/সিটি  নির্বাচন করুন' : '';
        setMemberSelectArea(list);
        break;
      case 'samityUniThanaPawIdType':
        unionData = JSON.parse(e.target.value);
        list[ind]['uniThanaPawId'] = unionData.uniThanaPawId ? unionData.uniThanaPawId : '';
        list[ind]['uniThanaPawType'] = unionData.uniThanaPawType ? unionData.uniThanaPawType : '';
        list[ind]['uniThanaPawIdError'] =
          list[ind]['uniThanaPawId'] == '' && newAmendmentData?.samityInfo?.memberAreaType >= 4
            ? 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন'
            : '';
        setMemberSelectArea(list);
        break;
      case 'detailsAddress':
        list[ind][name] = value;
        list[ind]['detailsAddressError'] =
          list[ind]['detailsAddress'] == '' && newAmendmentData?.samityInfo?.memberAreaType == 5 ? 'ঠিকানা লিখুন' : '';
        setMemberSelectArea(list);
        break;
    }
    setByLawsData((draft) => {
      draft[index].data[i].isEdit = true;
    });
  };
  const handleAddClicksetMemberSelectArea = () => {
    setMemberSelectArea([
      ...memberSelectArea,
      newAmendmentData?.samityInfo?.memberAreaType == 1
        ? {
          divisionId: newAmendmentData?.samityInfo?.samityDivisionId
            ? newAmendmentData?.samityInfo?.samityDivisionId
            : '',
          divisionIdError: '',
          status: 'A',
        }
        : newAmendmentData?.samityInfo?.memberAreaType == 2
          ? {
            divisionId: newAmendmentData?.samityInfo?.samityDivisionId
              ? newAmendmentData?.samityInfo?.samityDivisionId
              : '',
            divisionIdError: '',
            districtId: newAmendmentData?.samityInfo?.samityDistrictId
              ? newAmendmentData?.samityInfo?.samityDistrictId
              : '',
            districtIdError: '',
            status: 'A',
          }
          : newAmendmentData?.samityInfo?.memberAreaType == 3
            ? {
              divisionId: newAmendmentData?.samityInfo?.samityDivisionId
                ? newAmendmentData?.samityInfo?.samityDivisionId
                : '',
              divisionIdError: '',
              districtId: newAmendmentData?.samityInfo?.samityDistrictId
                ? newAmendmentData?.samityInfo?.samityDistrictId
                : '',
              districtIdError: '',
              upaCityId: newAmendmentData?.samityInfo?.samityUpaCityId
                ? newAmendmentData?.samityInfo?.samityUpaCityId
                : '',
              upaCityIdError: '',
              upaCityType: newAmendmentData?.samityInfo?.samityUpaCityType
                ? newAmendmentData?.samityInfo?.samityUpaCityType
                : '',
              status: 'A',
            }
            : newAmendmentData?.samityInfo?.memberAreaType == 4
              ? {
                divisionId: newAmendmentData?.samityInfo?.samityDivisionId
                  ? newAmendmentData?.samityInfo?.samityDivisionId
                  : '',
                divisionIdError: '',
                districtId: newAmendmentData?.samityInfo?.samityDistrictId
                  ? newAmendmentData?.samityInfo?.samityDistrictId
                  : '',
                districtIdError: '',
                upaCityId: newAmendmentData?.samityInfo?.samityUpaCityId
                  ? newAmendmentData?.samityInfo?.samityUpaCityId
                  : '',
                upaCityIdError: '',
                upaCityType: newAmendmentData?.samityInfo?.samityUpaCityType ? newAmendmentData.samityUpaCityType : '',
                uniThanaPawId: '',
                uniThanaPawIdError: '',
                uniThanaPawType: '',
                status: 'A',
              }
              : newAmendmentData?.samityInfo?.memberAreaType == 5
                ? {
                  divisionId: newAmendmentData?.samityInfo?.samityDivisionId
                    ? newAmendmentData?.samityInfo?.samityDivisionId
                    : '',
                  divisionIdError: '',
                  districtId: newAmendmentData?.samityInfo?.samityDistrictId
                    ? newAmendmentData?.samityInfo?.samityDistrictId
                    : '',
                  districtIdError: '',
                  upaCityId: newAmendmentData?.samityInfo?.samityUpaCityId
                    ? newAmendmentData?.samityInfo?.samityUpaCityId
                    : '',
                  upaCityIdError: '',
                  upaCityType: newAmendmentData?.samityInfo?.samityUpaCityType
                    ? newAmendmentData?.samityInfo?.samityUpaCityType
                    : '',
                  uniThanaPawId: '',
                  uniThanaPawIdError: '',
                  uniThanaPawType: '',
                  detailsAddress: '',
                  status: 'A',
                }
                : '',
    ]);
  };
  const handleRemoveMemberArea = async (index) => {
    let list = [...memberSelectArea];
    list.splice(index, 1);
    setMemberSelectArea(list);
  };
  return (
    <Accordion
      expanded={element?.isOpen}
      onChange={() =>
        setByLawsData((draft) => {
          draft[index].data[i].isOpen = !draft[index].data[i].isOpen;
        })
      }
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        sx={{ backgroundColor: element?.isOpen && '#e1f6ff' }}
      >
        <Typography>{engToBang(element?.sectionNo) + ') ' + element?.sectionName}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0, m: 0 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2} pb={1}>
              <Grid item sm={12} md={6} xs={12}>
                <Typography align="center" sx={{ color: '#FF0000' }}>
                  বিদ্যমান
                </Typography>
                <FromControlJSON
                  arr={[
                    {
                      labelName: '',
                      name: 'memberAreaType',
                      onChange: handleChangeMemberAreaType,
                      value: defaultMemberAreaType,
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
                      isDisabled: true,
                      customClass: '',
                      customStyle: '',
                      selectDisable: true,
                    },
                  ]}
                />
                <Grid container spacing={1} my={1} p={1} sx={{ border: '1px solid gray' }}>
                  {memberArea?.map((member, i) => (
                    <Fragment key={i}>
                      <FromControlJSON
                        arr={[
                          {
                            labelName: 'বিভাগ',
                            name: '',
                            onChange: '',
                            value: member.divisionNameBangla,
                            size: 'small',
                            type: 'text',
                            viewType: 'textField',
                            xl: 6,
                            lg: 6,
                            md: 6,
                            xs: 12,
                            autoComplete: 'off',
                            isDisabled: true,
                            placeholder: '',
                            customClass: '',
                            customStyle: {},
                            errorMessage: '',
                          },
                          {
                            labelName: 'জেলা',
                            name: '',
                            onChange: '',
                            value: member.districtNameBangla,
                            size: 'small',
                            type: 'text',
                            viewType: 'textField',
                            xl: 6,
                            lg: 6,
                            md: 6,
                            xs: 12,
                            autoComplete: 'off',
                            isDisabled: true,
                            placeholder: '',
                            customClass: '',
                            customStyle: {},
                            errorMessage: '',
                          },
                          {
                            labelName: 'উপজেলা/সিটি কর্পোরেশন',
                            name: '',
                            onChange: '',
                            value: member.upaCityNameBangla,
                            size: 'small',
                            type: 'text',
                            viewType: 'textField',
                            xl: 6,
                            lg: 6,
                            md: 6,
                            xs: 12,
                            autoComplete: 'off',
                            isDisabled: true,
                            placeholder: '',
                            customClass: '',
                            customStyle: {},
                            errorMessage: '',
                          },
                          {
                            labelName: 'ইউানয়ন/পৌরসভা/ওয়ার্ড',
                            name: '',
                            onChange: '',
                            value: member.uniThanaPawNameBangla,
                            size: 'small',
                            type: 'text',
                            viewType: 'textField',
                            xl: 6,
                            lg: 6,
                            md: 6,
                            xs: 12,
                            autoComplete: 'off',
                            isDisabled: true,
                            placeholder: '',
                            customClass: '',
                            customStyle: {},
                            errorMessage: '',
                          },
                          {
                            labelName: 'গ্রাম/মহল্লা',
                            name: '',
                            onChange: '',
                            value: member.detailsAddress,
                            size: 'small',
                            type: 'text',
                            viewType: 'textField',
                            xl: 12,
                            lg: 12,
                            md: 12,
                            xs: 12,
                            autoComplete: 'off',
                            isDisabled: true,
                            placeholder: '',
                            customClass: '',
                            customStyle: {},
                            errorMessage: '',
                          },
                        ]}
                      />
                    </Fragment>
                  ))}
                </Grid>
              </Grid>
              <Grid item sm={12} md={6} xs={12}>
                <Typography align="center" sx={{ color: '#2b7936' }}>
                  আবেদিত
                </Typography>
                <FromControlJSON
                  arr={[
                    {
                      labelName: '',
                      name: 'memberAreaType',
                      onChange: handleChangeMemberAreaType,
                      value: newAmendmentData?.samityInfo?.memberAreaType,
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
                      isDisabled: isApproval,
                      customClass: '',
                      customStyle: '',
                      selectDisable: true,
                    },
                  ]}
                />
                {/* **************************** member area start ***************************  */}
                {memberSelectArea?.map((row, ind) => (
                  <Grid container spacing={1} key={ind} my={1} p={1} sx={{ border: '1px solid gray' }}>
                    {newAmendmentData?.samityInfo?.memberAreaType >= 1 ? (
                      <GetGeoData
                        {...{
                          labelName: RequiredFile('বিভাগ'),
                          name: 'divisionId',
                          caseCadingName: 'division',
                          onChange: (e) => handleChangeMemberArea(e, ind, index, i),
                          value: row.divisionId,
                          isCasCading: true,
                          xl:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? 12
                              : newAmendmentData?.samityInfo?.memberAreaType == 2
                                ? 6
                                : newAmendmentData?.samityInfo?.memberAreaType == 3
                                  ? 6
                                  : 6,
                          lg:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? 12
                              : newAmendmentData?.samityInfo?.memberAreaType == 2
                                ? 6
                                : newAmendmentData?.samityInfo?.memberAreaType == 3
                                  ? 6
                                  : 6,
                          md:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? 12
                              : newAmendmentData?.samityInfo?.memberAreaType == 2
                                ? 6
                                : newAmendmentData?.samityInfo?.memberAreaType == 3
                                  ? 6
                                  : 6,
                          xs: 12,
                          isDisabled:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? false
                              : row.divisionId == ''
                                ? false
                                : true,
                          customClass: '',
                          customStyle: {},
                          errorMessage: row.divisionIdError,
                        }}
                      />
                    ) : (
                      ''
                    )}
                    {newAmendmentData?.samityInfo?.memberAreaType >= 1 ? (
                      <GetGeoData
                        {...{
                          labelName: newAmendmentData?.samityInfo?.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                          name: 'districtId',
                          caseCadingName: 'district',
                          onChange: (e) => handleChangeMemberArea(e, ind, index, i),
                          value: row.districtId,
                          isCasCading: true,
                          casCadingValue: row.divisionId,
                          xl:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 2
                                ? 6
                                : newAmendmentData?.samityInfo?.memberAreaType == 3
                                  ? 6
                                  : 6,
                          lg:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 2
                                ? 6
                                : newAmendmentData?.samityInfo?.memberAreaType == 3
                                  ? 6
                                  : 6,
                          md:
                            newAmendmentData?.samityInfo?.memberAreaType == 1
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 2
                                ? 6
                                : newAmendmentData?.samityInfo?.memberAreaType == 3
                                  ? 6
                                  : 6,
                          xs: 12,
                          isDisabled:
                            newAmendmentData?.samityInfo?.memberAreaType == 1 ||
                              newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? false
                              : row.districtId == ''
                                ? false
                                : true,
                          customClass: '',
                          errorMessage: row.districtIdError,
                        }}
                      />
                    ) : (
                      ''
                    )}
                    {newAmendmentData?.samityInfo?.memberAreaType >= 2 ? (
                      <GetGeoData
                        {...{
                          labelName:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 'উপজেলা/থানা'
                              : RequiredFile('উপজেলা/থানা'),
                          name: 'samityUpaCityIdType',
                          caseCadingName: 'upazila',
                          onChange: (e) => handleChangeMemberArea(e, ind, index, i),
                          isCasCading: true,
                          casCadingValue: row.districtId,
                          showMuiltiple: JSON.stringify({
                            upaCityId: row.upaCityId,
                            upaCityType: row.upaCityType,
                          }),
                          xl:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 3
                                ? 6
                                : 6,
                          lg:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 3
                                ? 6
                                : 6,
                          md:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 3
                                ? 6
                                : 6,
                          xs: 12,
                          isDisabled: !isApproval
                            ? newAmendmentData?.samityInfo?.memberAreaType == 2 ||
                              newAmendmentData?.samityInfo?.memberAreaType == 3
                              ? false
                              : row.upaCityId == ''
                                ? false
                                : true
                            : true,
                          customClass: '',
                          errorMessage: row.upaCityIdError,
                        }}
                      />
                    ) : (
                      ''
                    )}
                    {newAmendmentData?.samityInfo?.memberAreaType >= 3 ? (
                      <GetGeoData
                        {...{
                          labelName:
                            newAmendmentData?.samityInfo?.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                          name: 'samityUniThanaPawIdType',
                          caseCadingName: 'union',
                          onChange: (e) => handleChangeMemberArea(e, ind, index, i),
                          value: row.districtId,
                          isCasCading: true,
                          casCadingValue: {
                            upaCityId: row.upaCityId,
                            upaCityType: row.upaCityType,
                          },
                          showMuiltiple: JSON.stringify({
                            uniThanaPawId: row.uniThanaPawId,
                            uniThanaPawType: row.uniThanaPawType,
                          }),
                          casCadingValueDis: row.districtId,
                          xl:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 3
                                ? 6
                                : 6,
                          lg:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 3
                                ? 6
                                : 6,
                          md:
                            newAmendmentData?.samityInfo?.memberAreaType == 2
                              ? 6
                              : newAmendmentData?.samityInfo?.memberAreaType == 3
                                ? 6
                                : 6,
                          xs: 12,
                          isDisabled: isApproval ? true : false,
                          customClass: '',
                          errorMessage: row.uniThanaPawIdError,
                        }}
                      />
                    ) : (
                      ''
                    )}
                    {newAmendmentData?.samityInfo?.memberAreaType >= 4 ? (
                      <FromControlJSON
                        arr={[
                          {
                            labelName:
                              newAmendmentData?.samityInfo?.memberAreaType == 4
                                ? 'গ্রাম/মহল্লা'
                                : RequiredFile('গ্রাম/মহল্লা'),
                            name: 'detailsAddress',
                            onChange: (e) => handleChangeMemberArea(e, ind, index, i),
                            value: row.detailsAddress,
                            size: 'small',
                            type: 'text',
                            viewType: 'textField',
                            xl: 10,
                            lg: 10,
                            md: 10,
                            xs: 10,
                            isDisabled: isApproval ? true : false,
                            placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                            customClass: '',
                            customStyle: {},
                            errorMessage: row.detailsAddressError,
                          },
                        ]}
                      />
                    ) : (
                      ''
                    )}

                    <Grid
                      item
                      sx={{
                        jusityContent: 'flex-end',
                        alignItems: 'flex-start',
                        display: isApproval ? 'none' : 'flex',
                      }}
                    >
                      <Button
                        variant="outlined"
                        disabled={memberSelectArea.length > 1 ? false : true}
                        color="error"
                        onClick={() => handleRemoveMemberArea(ind)}
                        size="small"
                        className="btn-close"
                      >
                        <Clear />
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  className="btn btn-add"
                  onClick={handleAddClicksetMemberSelectArea}
                  size="small"
                  endIcon={<AddIcon />}
                  sx={{ marginTop: '1rem', display: isApproval && 'none' }}
                >
                  একাধিক সদস্য নির্বাচনী এলাকা সংযুক্ত করুন{' '}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};

export default MemberAddress;
