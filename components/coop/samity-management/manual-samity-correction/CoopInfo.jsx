import { Grid } from '@mui/material';
import RequiredFile from 'components/utils/RequiredFile';
import FormControlJSON from 'service/form/FormControlJSON';

export const CoopInfo = ({
  handleChange,
  handleDateChage,
  coop,
  formErrors,
  samityType,
  enterprisingOrg,
  projects,
}) => {
  return (
    <Grid container spacing={2.5} className="section">
      <FormControlJSON
        arr={[
          {
            labelName: 'samityLevel',
            name: 'samityLevel',
            onChange: handleChange,
            value: coop.samityLevel,
            size: 'small',
            type: 'text',
            viewType: 'inputRadio',
            inputRadioGroup: [
              { value: 'P', color: '#007bff', rcolor: 'primary', label: 'প্রাথমিক' },
              { value: 'C', color: '#ed6c02', rColor: 'warning', label: 'কেন্দ্রীয়' },
              { value: 'N', color: '#28a745', rColor: 'success', label: 'জাতীয়' },
            ],
            defaultVal: 'P',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: true,
            customClass: '',
            customStyle: {},
          },
          {
            labelName: RequiredFile('সমিতির নাম'),
            name: 'samityName',
            onChange: handleChange,
            value: coop.samityName,
            size: 'small',
            type: 'text',
            viewType: 'textField',
            xl: 8,
            lg: 8,
            md: 8,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
            errorMessage: formErrors.samityName,
          },
          {
            labelName: 'সমিতি গঠনের তারিখ',
            onChange: (date) => handleDateChage(date, 'samityFormationDate'),
            value: coop.samityFormationDate,
            size: 'small',
            type: 'date',
            viewType: 'date',
            dateFormet: 'dd/MM/yyyy',
            disableFuture: true,
            MinDate: '01-01-1970',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
          },
          {
            labelName: RequiredFile('সমিতি নিবন্ধনের তারিখ'),
            onChange: (date) => handleDateChage(date, 'samityRegistrationDate'),
            value: coop.samityRegistrationDate,
            size: 'small',
            type: 'date',
            viewType: 'date',
            dateFormet: 'dd/MM/yyyy',
            disableFuture: true,
            MinDate: '01-01-1970',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
            errorMessage: formErrors.regDate,
          },
          {
            labelName: RequiredFile('সমিতির মূল নিবন্ধন নম্বর'),
            name: 'oldRegistrationNo',
            onChange: handleChange,
            value: coop.oldRegistrationNo,
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
            errorMessage: formErrors.oldRegistrationNo,
          },
          {
            labelName: RequiredFile('সমিতির ধরন'),
            name: 'samityTypeId',
            onChange: handleChange,
            value: coop.samityTypeId,
            size: 'small',
            type: 'text',
            viewType: 'select',
            optionData: samityType,
            optionValue: 'id',
            optionName: 'typeName',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
            errorMessage: formErrors.samityTypeId,
          },
          {
            labelName: RequiredFile('উদ্দ্যেগী সংস্থার নাম'),
            name: 'enterprisingId',
            onChange: handleChange,
            value: coop.enterprisingId,
            size: 'small',
            type: 'text',
            viewType: 'select',
            optionData: enterprisingOrg,
            optionValue: 'id',
            optionName: 'orgNameBangla',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
            errorMessage: formErrors.enterprisingId,
          },
          {
            ...(projects.length > 0 && {
              labelName: 'প্রকল্পের নাম',
              name: 'projectId',
              onChange: handleChange,
              value: coop.projectId,
              size: 'small',
              type: 'text',
              viewType: 'select',
              optionData: projects,
              optionValue: 'id',
              optionName: 'projectNameBangla',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: false,
              customClass: '',
              customStyle: {},
              errorMessage: formErrors.enterprisingOrg,
            }),
          },
          {
            labelName: 'samityEffectiveness',
            name: 'samityEffectiveness',
            onChange: handleChange,
            value: coop.samityEffectiveness,
            size: 'small',
            type: 'text',
            viewType: 'inputRadio',
            inputRadioGroup: [
              { value: 'A', color: '#007bff', rcolor: 'primary', label: 'কার্যকর' },
              { value: 'E', color: '#ed6c02', rColor: 'warning', label: 'অকার্যকর' },
              { value: 'I', color: '#28a745', rColor: 'success', label: 'অবসায়নে ন্যাস্ত' },
            ],
            defaultVal: 'P',
            xl: 4,
            lg: 4,
            md: 4,
            xs: 12,
            isDisabled: false,
            customClass: '',
            customStyle: {},
          },
        ]}
      />
    </Grid>
  );
};
