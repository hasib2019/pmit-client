import { Grid } from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import { Fragment } from 'react';
import FormControlJSON from 'service/form/FormControlJSON';
import { engToBang } from 'service/numberConverter';

export const SamityMemberInfo = ({ samityMemberData, setSamityMemberData, formErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the state for authorizedPersonName within personAsAMember
    setSamityMemberData((prevData) => ({
      ...prevData,
      personAsAMember: {
        ...prevData.personAsAMember,
        [name]: value, // Assuming 'name' corresponds to 'authorizedPersonName'
      },
    }));
  };

  return (
    <Fragment>
      <SubHeading>অথরাইজড / অনুমোদিত ব্যক্তি</SubHeading>
      <Grid container spacing={2.5} pt={2} pb={2}>
        <FormControlJSON
          arr={[
            {
              labelName: RequiredFile('অথরাইজড / অনুমোদিত ব্যক্তির নাম (বাংলায়)'),
              name: 'authorizedPersonName',
              onChange: handleChange,
              value: samityMemberData.personAsAMember.authorizedPersonName,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: false,
              customClass: '',
              customStyle: {},
              errorMessage: formErrors.authorizedPersonName,
            },
            {
              labelName: RequiredFile('জাতীয় পরিচয়পত্র'),
              name: 'authorizedPersonNid',
              onChange: handleChange,
              value: engToBang('' + samityMemberData.personAsAMember.authorizedPersonNid + ''),
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: false,
              customClass: '',
              customStyle: {},
              errorMessage: formErrors.authorizedPersonNid,
            },
            {
              labelName: RequiredFile('মোবাইল নম্বর'),
              name: 'authorizedPersonmobile',
              onChange: handleChange,
              value: engToBang('' + samityMemberData.personAsAMember.authorizedPersonmobile + ''),
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: false,
              customClass: '',
              customStyle: {},
              errorMessage: formErrors.authorizedPersonmobile,
            },
          ]}
        />
      </Grid>
    </Fragment>
  );
};
