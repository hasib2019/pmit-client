/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Card, CardContent, Grid, Typography } from '@mui/material';
import 'react-quill/dist/quill.snow.css';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// function createMarkup(value) {
//   return {
//     __html: value,
//   };
// }

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import RequiredFile from 'components/utils/RequiredFile';
import GetGeoData from 'components/utils/coop/GetGeoData';
// import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import FromControlJSON from 'service/form/FormControlJSON';
import { engToBang } from 'service/numberConverter';
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
const OfficeAddress = ({
  element,
  samityInfo,
  newAmendmentData,
  setNewAmendmentData,
  isApproval,
  setByLawsData,
  index,
  i,
}) => {
  const [upaDefault, setUpaDefault] = useState();
  const [unionDefault, setUnionDefault] = useState();
  const [formErrors, setFormErrors] = useState({
    samityDivisionId: '',
    samityDistrictId: '',
    samityUpaCityId: '',
    samityUpaCityType: '',
    samityUniThanaPawId: '',
    samityUniThanaPawType: '',
    samityDetailsAddress: '',
  });
  useEffect(() => {
    setUpaDefault(
      JSON.stringify({
        upaCityId: newAmendmentData?.samityInfo?.samityUpaCityId,
        upaCityType: newAmendmentData?.samityInfo?.samityUpaCityType,
      }),
    );
    setUnionDefault(
      JSON.stringify({
        uniThanaPawId: newAmendmentData?.samityInfo?.samityUniThanaPawId,
        uniThanaPawType: newAmendmentData?.samityInfo?.samityUniThanaPawType,
      }),
    );
  }, [newAmendmentData?.samityInfo?.samityUpaCityId, newAmendmentData?.samityInfo?.samityUniThanaPawId]);
  const handleChangeOfficeAddress = (e, index, i) => {
    const { name, value } = e.target;
    let data, unionData;
    switch (name) {
      case 'samityUpaCityIdType':
        setUpaDefault(value);
        data = JSON.parse(value);
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            samityUpaCityId: data.upaCityId,
            samityUpaCityType: data.upaCityType,
          },
        });
        if (value == '0') {
          setFormErrors({
            ...formErrors,
            samityUpaCityId: 'উপজেলা/সিটি নির্বাচন করুন',
          });
        } else {
          setFormErrors({ ...formErrors, samityUpaCityId: '' });
        }
        break;
      case 'samityUniThanaPawIdType':
        setUnionDefault(value);
        unionData = JSON.parse(value);
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            samityUniThanaPawId: unionData.uniThanaPawId,
            samityUniThanaPawType: unionData.uniThanaPawType,
          },
        });
        if (value == '0') {
          setFormErrors({
            ...formErrors,
            samityUniThanaPawId: 'ইউনিয়ন/থানা/পৌরসভা নির্বাচন করুন',
          });
        } else {
          setFormErrors({ ...formErrors, samityUniThanaPawId: '' });
        }
        break;
      default:
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            [name]: value,
          },
        });
        if (value != 0) {
          if (name === 'samityDivisionId') {
            setFormErrors({ ...formErrors, [name]: '' });
          } else if (name === 'samityDistrictId') {
            setFormErrors({ ...formErrors, [name]: '' });
          } else if (name === 'samityDetailsAddress') {
            setFormErrors({ ...formErrors, [name]: '' });
          }
        } else {
          if (name === 'samityDivisionId') {
            setFormErrors({ ...formErrors, [name]: 'বিভাগ নির্বাচন করুন' });
          } else if (name === 'samityDistrictId') {
            setFormErrors({ ...formErrors, [name]: 'জেলা নির্বাচন করুন' });
          } else if (name === 'samityDetailsAddress') {
            setFormErrors({ ...formErrors, [name]: 'সমিতির ঠিকানা লিখুন' });
          }
        }
    }
    setByLawsData((draft) => {
      draft[index].data[i].isEdit = true;
    });
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
        <Card sx={{ p: 0, m: 0 }}>
          <CardContent sx={{ padding: 1 }}>
            <Grid container spacing={2} pb={1}>
              <Grid item sm={12} md={6} xs={12}>
                <Typography align="center" sx={{ color: '#FF0000' }}>
                  বিদ্যমান
                </Typography>
                <div
                  style={{ padding: '5px', color: 'red', opacity: '0.5' }}
                  dangerouslySetInnerHTML={{ __html: unescape(element?.data) }}
                ></div>
                <Grid container spacing={2}>
                  <FromControlJSON
                    arr={[
                      {
                        labelName: 'বিভাগ',
                        name: '',
                        onChange: '',
                        value: samityInfo?.officeDivisionNameBangla || '',
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
                        value: samityInfo?.officeDistrictNameBangla || '',
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
                        value: samityInfo?.upaCityNameBangla || '',
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
                        value: samityInfo?.uniThanaPawNameBangla || '',
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
                        value: samityInfo?.samityDetailsAddress || '',
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
                </Grid>
                <div
                  style={{ padding: '5px', color: 'red', opacity: '0.5' }}
                  dangerouslySetInnerHTML={{ __html: unescape(element?.noted) }}
                ></div>
              </Grid>
              <Grid item sm={12} md={6} xs={12}>
                <Typography align="center" sx={{ color: '#2b7936' }}>
                  আবেদিত
                </Typography>
                <Grid container spacing={2} paddingTop={4}>
                  <GetGeoData
                    {...{
                      labelName: RequiredFile('বিভাগ'),
                      name: 'samityDivisionId',
                      caseCadingName: 'division',
                      onChange: (e) => handleChangeOfficeAddress(e, index, i),
                      value: newAmendmentData?.samityInfo?.samityDivisionId,
                      isCasCading: false,
                      xl: 6,
                      lg: 6,
                      md: 6,
                      xs: 12,
                      isDisabled: isApproval,
                      customClass: '',
                      customStyle: {},
                      errorMessage: formErrors.samityDivisionId,
                    }}
                  />

                  <GetGeoData
                    {...{
                      labelName: RequiredFile('জেলা'),
                      name: 'samityDistrictId',
                      caseCadingName: 'district',
                      onChange: (e) => handleChangeOfficeAddress(e, index, i),
                      value: newAmendmentData?.samityInfo?.samityDistrictId,
                      isCasCading: true,
                      casCadingValue: newAmendmentData?.samityInfo?.samityDivisionId,
                      xl: 6,
                      lg: 6,
                      md: 6,
                      xs: 12,
                      isDisabled: isApproval,
                      customClass: '',
                      errorMessage: formErrors.samityDistrictId,
                    }}
                  />

                  <GetGeoData
                    {...{
                      labelName: RequiredFile('উপজেলা/থানা'),
                      name: 'samityUpaCityIdType',
                      caseCadingName: 'upazila',
                      onChange: (e) => handleChangeOfficeAddress(e, index, i),
                      value: newAmendmentData?.samityInfo?.samityDistrictId,
                      isCasCading: true,
                      casCadingValue: newAmendmentData?.samityInfo?.samityDistrictId,
                      showMuiltiple: upaDefault,
                      xl: 6,
                      lg: 6,
                      md: 6,
                      xs: 12,
                      isDisabled: isApproval,
                      customClass: '',
                      errorMessage: formErrors.samityUpaCityId,
                    }}
                  />

                  <GetGeoData
                    {...{
                      labelName: RequiredFile('ইউনিয়ন'),
                      name: 'samityUniThanaPawIdType',
                      caseCadingName: 'union',
                      onChange: (e) => handleChangeOfficeAddress(e, index, i),
                      value: newAmendmentData?.samityInfo?.samityDistrictId,
                      isCasCading: true,
                      casCadingValue: {
                        upaCityId: newAmendmentData?.samityInfo?.samityUpaCityId,
                        upaCityType: newAmendmentData?.samityInfo?.samityUpaCityType,
                      },
                      showMuiltiple: unionDefault,
                      casCadingValueDis: newAmendmentData?.samityInfo?.samityDistrictId,
                      xl: 6,
                      lg: 6,
                      md: 6,
                      xs: 12,
                      isDisabled: isApproval,
                      customClass: '',
                      errorMessage: formErrors.samityUniThanaPawId,
                    }}
                  />

                  <FromControlJSON
                    arr={[
                      {
                        labelName: RequiredFile('ঠিকানা'),
                        name: 'samityDetailsAddress',
                        onChange: (e) => handleChangeOfficeAddress(e, index, i),
                        value: newAmendmentData?.samityInfo?.samityDetailsAddress,
                        size: 'small',
                        type: 'text',
                        viewType: 'textField',
                        xl: 12,
                        lg: 12,
                        md: 12,
                        xs: 12,
                        isDisabled: isApproval,
                        placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
                        customClass: '',
                        customStyle: {},
                        errorMessage: formErrors.samityDetailsAddress,
                      },
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};

export default OfficeAddress;
