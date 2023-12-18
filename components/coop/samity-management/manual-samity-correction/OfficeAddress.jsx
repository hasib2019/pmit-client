import { Grid } from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import GetGeoData from 'components/utils/coop/GetGeoData';
import FormControlJSON from 'service/form/FormControlJSON';

export const OfficeAddress = ({ coop, setCoop, formErrors }) => {
  const handleChangeMemberArea = (e) => {
    const { name, value } = e.target;
    let jsonValue = JSON.parse(value);
    switch (name) {
      case 'samityUpaCityIdType':
        setCoop({
          ...coop,
          ['samityUpaCityId']: jsonValue?.upaCityId,
          ['samityUpaCityType']: jsonValue?.upaCityType,
        });
        break;
      case 'samityUniThanaPawIdType':
        setCoop({
          ...coop,
          ['samityUniThanaPawId']: jsonValue?.uniThanaPawId,
          ['samityUniThanaPawType']: jsonValue?.uniThanaPawType,
        });
        break;
    }
  };
  return (
    <Grid container className="section" spacing={1.6}>
      <SubHeading>সমিতির কার্যালয়ের ঠিকানা</SubHeading>
      <GetGeoData
        {...{
          labelName: RequiredFile('বিভাগ'),
          name: 'samityDivisionId',
          caseCadingName: 'division',
          onChange: (e) => handleChangeMemberArea(e),
          value: coop.samityDivisionId,
          isCasCading: true,
          xl: 2,
          lg: 2,
          md: 2,
          xs: 12,
          isDisabled: coop.memberAreaType == 1 ? false : true,
          customClass: '',
          customStyle: {},
          errorMessage: formErrors.divisionIdError,
        }}
      />
      <GetGeoData
        {...{
          labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
          name: 'samityDistrictId',
          caseCadingName: 'district',
          onChange: (e) => handleChangeMemberArea(e),
          value: coop.samityDistrictId,
          isCasCading: true,
          casCadingValue: coop.samityDivisionId,
          xl: 2,
          lg: 2,
          md: 2,
          xs: 12,
          isDisabled: coop.memberAreaType == 1 || coop.memberAreaType == 2 ? false : true,
          customClass: '',
          errorMessage: formErrors.districtIdError,
        }}
      />
      <GetGeoData
        {...{
          labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
          name: 'samityUpaCityIdType',
          caseCadingName: 'upazila',
          onChange: (e) => handleChangeMemberArea(e),
          isCasCading: true,
          casCadingValue: coop.samityDistrictId,
          showMuiltiple: JSON.stringify({
            upaCityId: coop.samityUpaCityId,
            upaCityType: coop.samityUpaCityType,
          }),
          xl: 2,
          lg: 2,
          md: 2,
          xs: 12,
          isDisabled: coop.memberAreaType == 2 || coop.memberAreaType == 3 ? false : true,
          customClass: '',
          errorMessage: formErrors.upaCityIdError,
        }}
      />
      <GetGeoData
        {...{
          labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
          name: 'samityUniThanaPawIdType',
          caseCadingName: 'union',
          onChange: (e) => handleChangeMemberArea(e),
          value: coop.samityDistrictId,
          isCasCading: true,
          casCadingValue: {
            upaCityId: coop.samityUpaCityId,
            upaCityType: coop.samityUpaCityType,
          },
          showMuiltiple: JSON.stringify({
            uniThanaPawId: coop.samityUniThanaPawId,
            uniThanaPawType: coop.samityUniThanaPawType,
          }),
          casCadingValueDis: coop.samityDistrictId,
          xl: 2,
          lg: 2,
          md: 2,
          xs: 12,
          isDisabled: false,
          customClass: '',
          errorMessage: formErrors.uniThanaPawIdError,
        }}
      />

      <FormControlJSON
        arr={[
          {
            labelName: RequiredFile('গ্রাম/মহল্লা'),
            name: 'samityDetailsAddress',
            onChange: (e) => setCoop({ ...coop, ['samityDetailsAddress']: e.target.value }),
            value: coop.samityDetailsAddress,
            size: 'small',
            type: 'text',
            viewType: 'textField',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            placeholder: 'বাড়ি নং, রাস্তা নং, গ্রাম/মহল্লা লিখুন',
            customClass: '',
            customStyle: {},
            errorMessage: formErrors.detailsAddressError,
          },
        ]}
      />
    </Grid>
  );
};
