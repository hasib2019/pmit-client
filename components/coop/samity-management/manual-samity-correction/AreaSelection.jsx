import { Add } from '@mui/icons-material';
import Clear from '@mui/icons-material/Clear';
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';
import RequiredFile from 'components/utils/RequiredFile';
import GetGeoData from 'components/utils/coop/GetGeoData';
import FormControlJSON from 'service/form/FormControlJSON';

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

export const AreaSelection = ({
  memberSelectArea,
  workingArea,
  coop,
  setCoop,
  checkedArea,
  handleChangeMemberArea,
  handleAddClicksetMemberSelectArea,
  handleRemoveMemberArea,
  handleChangeMemberAndWorkingArea,
  handleAddClicksetWorkingArea,
  handleChangeWorkingArea,
  handleRemoveWorkingArea,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoop({ ...coop, [name]: value });
  };

  return (
    <Grid container className="section">
      <SubHeading>সদস্য নির্বাচনী এলাকা ও কর্ম এলাকা</SubHeading>
      <Grid container spacing={2.5}>
        {/* //////////////////////////////////////////  সদস্য নির্বাচনী এলাকা ///////////////////////////////////////// */}
        <Grid item md={12} xs={12} sm={12}>
          <Grid container flexDirection={'column'}>
            <Typography
              sx={{
                textDecoration: 'underline',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '.5rem 3rem .5rem .5rem',
              }}
            >
              সদস্য নির্বাচনী এলাকা :{' '}
            </Typography>
            <FormControlJSON
              arr={[
                {
                  labelName: '',
                  name: 'memberAreaType',
                  onChange: handleChange,
                  value: coop.memberAreaType,
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
                  customStyle: {},
                  selectDisable: true,
                },
              ]}
            />
          </Grid>
          {/* ///////////////////////////// Start Member area ////////////////////////////////// */}
          {memberSelectArea.map((row, i) => (
            <Grid container spacing={1.6} pt={2} key={i}>
              {coop.memberAreaType >= 1 ? (
                <GetGeoData
                  {...{
                    labelName: RequiredFile('বিভাগ'),
                    name: 'divisionId',
                    caseCadingName: 'division',
                    onChange: (e) => handleChangeMemberArea(e, i),
                    value: row.divisionId,
                    isCasCading: true,
                    xl:
                      coop.memberAreaType == 1
                        ? 5
                        : coop.memberAreaType == 2
                        ? 3.5
                        : coop.memberAreaType == 3
                        ? 2.5
                        : 2,
                    lg:
                      coop.memberAreaType == 1
                        ? 5
                        : coop.memberAreaType == 2
                        ? 3.5
                        : coop.memberAreaType == 3
                        ? 2.5
                        : 2,
                    md:
                      coop.memberAreaType == 1
                        ? 5
                        : coop.memberAreaType == 2
                        ? 3.5
                        : coop.memberAreaType == 3
                        ? 2.5
                        : 2,
                    xs: 12,
                    isDisabled: coop.memberAreaType == 1 ? false : true,
                    customClass: '',
                    customStyle: {},
                    errorMessage: row.divisionIdError,
                  }}
                />
              ) : (
                ''
              )}
              {coop.memberAreaType >= 1 ? (
                <GetGeoData
                  {...{
                    labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                    name: 'districtId',
                    caseCadingName: 'district',
                    onChange: (e) => handleChangeMemberArea(e, i),
                    value: row.districtId,
                    isCasCading: true,
                    casCadingValue: row.divisionId,
                    xl:
                      coop.memberAreaType == 1
                        ? 6
                        : coop.memberAreaType == 2
                        ? 3.5
                        : coop.memberAreaType == 3
                        ? 2.5
                        : 2,
                    lg:
                      coop.memberAreaType == 1
                        ? 6
                        : coop.memberAreaType == 2
                        ? 3.5
                        : coop.memberAreaType == 3
                        ? 2.5
                        : 2,
                    md:
                      coop.memberAreaType == 1
                        ? 6
                        : coop.memberAreaType == 2
                        ? 3.5
                        : coop.memberAreaType == 3
                        ? 2.5
                        : 2,
                    xs: 12,
                    isDisabled: coop.memberAreaType == 1 || coop.memberAreaType == 2 ? false : true,
                    customClass: '',
                    errorMessage: row.districtIdError,
                  }}
                />
              ) : (
                ''
              )}
              {coop.memberAreaType >= 2 ? (
                <GetGeoData
                  {...{
                    labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                    name: 'samityUpaCityIdType',
                    caseCadingName: 'upazila',
                    onChange: (e) => handleChangeMemberArea(e, i),
                    isCasCading: true,
                    casCadingValue: row.districtId,
                    showMuiltiple: JSON.stringify({
                      upaCityId: parseInt(row.upaCityId),
                      upaCityType: row.upaCityType,
                    }),
                    xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                    lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                    md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                    xs: 12,
                    isDisabled: coop.memberAreaType == 2 || coop.memberAreaType == 3 ? false : true,
                    customClass: '',
                    errorMessage: row.upaCityIdError,
                  }}
                />
              ) : (
                ''
              )}
              {coop.memberAreaType >= 3 ? (
                <GetGeoData
                  {...{
                    labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                    name: 'samityUniThanaPawIdType',
                    caseCadingName: 'union',
                    onChange: (e) => handleChangeMemberArea(e, i),
                    value: row.districtId,
                    isCasCading: true,
                    casCadingValue: {
                      upaCityId: parseInt(row.upaCityId),
                      upaCityType: row.upaCityType,
                    },
                    showMuiltiple: JSON.stringify({
                      uniThanaPawId: parseInt(row.uniThanaPawId),
                      uniThanaPawType: row.uniThanaPawType,
                    }),
                    casCadingValueDis: row.districtId,
                    xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                    lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                    md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                    xs: 12,
                    isDisabled: false,
                    customClass: '',
                    errorMessage: row.uniThanaPawIdError,
                  }}
                />
              ) : (
                ''
              )}
              {coop.memberAreaType >= 4 ? (
                <FormControlJSON
                  arr={[
                    {
                      labelName: coop.memberAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                      name: 'detailsAddress',
                      onChange: (e) => handleChangeMemberArea(e, i),
                      value: row.detailsAddress,
                      size: 'small',
                      type: 'text',
                      viewType: 'textField',
                      xl: 3,
                      lg: 3,
                      md: 3,
                      xs: 12,
                      isDisabled: false,
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
                  display: 'flex',
                  jusityContent: 'flex-end',
                  alignItems: 'flex-start',
                }}
              >
                <Button
                  variant="outlined"
                  disabled={memberSelectArea.length > 1 ? false : true}
                  color="error"
                  onClick={() => handleRemoveMemberArea(row.id, i)}
                  size="small"
                  className="btn-close"
                >
                  <Clear />
                </Button>
              </Grid>
            </Grid>
          ))}
          <Box mt={3}>
            <Button
              className="btn btn-add"
              onClick={handleAddClicksetMemberSelectArea}
              size="small"
              variant="contained"
              endIcon={<Add />}
            >
              একাধিক সদস্য নির্বাচনী এলাকা সংযুক্ত করুন
            </Button>
          </Box>
          {/* //////////////////////////////End Member area //////////////////////////////////// */}
        </Grid>
        {/* ////////////////////////////////////////// //কর্ম এলাকা    //////////////////////////////////////////////*/}
        <Grid item md={12} xs={12} sm={12}>
          <Grid container flexDirection={'column'}>
            <div style={{ display: 'flex' }}>
              <Typography
                sx={{
                  textDecoration: 'underline',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '.5rem',
                }}
              >
                কর্ম এলাকা :{' '}
              </Typography>
              <span>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={checkedArea}
                  name="onChecked"
                  label="সদস্য নির্বাচনী এলাকা একই"
                  onChange={handleChangeMemberAndWorkingArea}
                />
              </span>
            </div>
            {checkedArea ? (
              ''
            ) : (
              <FormControlJSON
                arr={[
                  {
                    labelName: '',
                    name: 'workingAreaType',
                    onChange: handleChange,
                    value: coop.workingAreaType,
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
                    customStyle: {},
                    selectDisable: true,
                  },
                ]}
              />
            )}
          </Grid>

          {/* //////////////////////// start working area /////////////////// */}
          {checkedArea
            ? memberSelectArea.map((row, i) => (
                <Grid container spacing={1.6} pt={2} key={i}>
                  {coop.memberAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: RequiredFile('বিভাগ'),
                        name: 'divisionId',
                        caseCadingName: 'division',
                        value: row.divisionId,
                        isCasCading: true,
                        xl:
                          coop.memberAreaType == 1
                            ? 5
                            : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                            ? 2.5
                            : 2,
                        lg:
                          coop.memberAreaType == 1
                            ? 5
                            : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                            ? 2.5
                            : 2,
                        md:
                          coop.memberAreaType == 1
                            ? 5
                            : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                            ? 2.5
                            : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        customStyle: {},
                        errorMessage: row.divisionIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.memberAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                        name: 'districtId',
                        caseCadingName: 'district',
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: row.divisionId,
                        xl:
                          coop.memberAreaType == 1
                            ? 6
                            : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                            ? 2.5
                            : 2,
                        lg:
                          coop.memberAreaType == 1
                            ? 6
                            : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                            ? 2.5
                            : 2,
                        md:
                          coop.memberAreaType == 1
                            ? 6
                            : coop.memberAreaType == 2
                            ? 3.5
                            : coop.memberAreaType == 3
                            ? 2.5
                            : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        errorMessage: row.districtIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 2 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.memberAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                        name: 'samityUpaCityIdType',
                        caseCadingName: 'upazila',
                        isCasCading: true,
                        casCadingValue: row.districtId,
                        showMuiltiple: JSON.stringify({
                          upaCityId: parseInt(row.upaCityId),
                          upaCityType: row.upaCityType,
                        }),
                        xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        errorMessage: row.upaCityIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 3 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.memberAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                        name: 'samityUniThanaPawIdType',
                        caseCadingName: 'union',
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: {
                          upaCityId: parseInt(row.upaCityId),
                          upaCityType: row.upaCityType,
                        },
                        showMuiltiple: JSON.stringify({
                          uniThanaPawId: parseInt(row.uniThanaPawId),
                          uniThanaPawType: row.uniThanaPawType,
                        }),
                        casCadingValueDis: row.districtId,
                        xl: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        lg: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        md: coop.memberAreaType == 2 ? 4 : coop.memberAreaType == 3 ? 3 : 2,
                        xs: 12,
                        isDisabled: true,
                        customClass: '',
                        errorMessage: row.uniThanaPawIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.memberAreaType >= 4 ? (
                    <FormControlJSON
                      arr={[
                        {
                          labelName: coop.memberAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                          name: 'detailsAddress',
                          value: row.detailsAddress,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          isDisabled: true,
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
                      display: 'flex',
                      jusityContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={true}
                      color="error"
                      onClick={() => handleRemoveMemberArea(row.id, i)}
                      size="small"
                      className="btn-close"
                    >
                      <Clear />
                    </Button>
                  </Grid>
                </Grid>
              ))
            : workingArea.map((row, i) => (
                <Grid container spacing={1.6} pt={2} key={i}>
                  {coop.workingAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: RequiredFile('বিভাগ'),
                        name: 'divisionId',
                        caseCadingName: 'division',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        value: row.divisionId,
                        isCasCading: true,
                        xl:
                          coop.workingAreaType == 1
                            ? 5
                            : coop.workingAreaType == 2
                            ? 3.5
                            : coop.workingAreaType == 3
                            ? 2.5
                            : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 5
                            : coop.workingAreaType == 2
                            ? 3.5
                            : coop.workingAreaType == 3
                            ? 2.5
                            : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 5
                            : coop.workingAreaType == 2
                            ? 3.5
                            : coop.workingAreaType == 3
                            ? 2.5
                            : 2,
                        xs: 12,
                        isDisabled: coop.workingAreaType == 1 ? false : true,
                        customClass: '',
                        customStyle: {},
                        errorMessage: row.divisionIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 1 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.workingAreaType == 1 ? 'জেলা' : RequiredFile('জেলা'),
                        name: 'districtId',
                        caseCadingName: 'district',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: row.divisionId,
                        xl:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 3.5
                            : coop.workingAreaType == 3
                            ? 2.5
                            : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 3.5
                            : coop.workingAreaType == 3
                            ? 2.5
                            : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 3.5
                            : coop.workingAreaType == 3
                            ? 2.5
                            : 2,
                        xs: 12,
                        isDisabled: coop.workingAreaType == 1 || coop.workingAreaType == 2 ? false : true,
                        customClass: '',
                        errorMessage: row.districtIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 2 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.workingAreaType == 2 ? 'উপজেলা/থানা' : RequiredFile('উপজেলা/থানা'),
                        name: 'samityUpaCityIdType',
                        caseCadingName: 'upazila',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        isCasCading: true,
                        casCadingValue: row.districtId,
                        showMuiltiple: JSON.stringify({
                          upaCityId: parseInt(row.upaCityId),
                          upaCityType: row.upaCityType,
                        }),
                        xl:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 4
                            : coop.workingAreaType == 3
                            ? 3
                            : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 4
                            : coop.workingAreaType == 3
                            ? 3
                            : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 4
                            : coop.workingAreaType == 3
                            ? 3
                            : 2,
                        xs: 12,
                        isDisabled: coop.workingAreaType == 2 || coop.workingAreaType == 3 ? false : true,
                        customClass: '',
                        errorMessage: row.upaCityIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 3 ? (
                    <GetGeoData
                      {...{
                        labelName: coop.workingAreaType == 3 ? 'ইউনিয়ন' : RequiredFile('ইউনিয়ন'),
                        name: 'samityUniThanaPawIdType',
                        caseCadingName: 'union',
                        onChange: (e) => handleChangeWorkingArea(e, i),
                        value: row.districtId,
                        isCasCading: true,
                        casCadingValue: {
                          upaCityId: parseInt(row.upaCityId),
                          upaCityType: row.upaCityType,
                        },
                        showMuiltiple: JSON.stringify({
                          uniThanaPawId: parseInt(row.uniThanaPawId),
                          uniThanaPawType: row.uniThanaPawType,
                        }),
                        casCadingValueDis: row.districtId,
                        xl:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 4
                            : coop.workingAreaType == 3
                            ? 3
                            : 2,
                        lg:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 4
                            : coop.workingAreaType == 3
                            ? 3
                            : 2,
                        md:
                          coop.workingAreaType == 1
                            ? 6
                            : coop.workingAreaType == 2
                            ? 4
                            : coop.workingAreaType == 3
                            ? 3
                            : 2,
                        xs: 12,
                        isDisabled: false,
                        customClass: '',
                        errorMessage: row.uniThanaPawIdError,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  {coop.workingAreaType >= 4 ? (
                    <FormControlJSON
                      arr={[
                        {
                          labelName: coop.workingAreaType == 4 ? 'গ্রাম/মহল্লা' : RequiredFile('গ্রাম/মহল্লা'),
                          name: 'detailsAddress',
                          onChange: (e) => handleChangeWorkingArea(e, i),
                          value: row.detailsAddress,
                          size: 'small',
                          type: 'text',
                          viewType: 'textField',
                          xl: 3,
                          lg: 3,
                          md: 3,
                          xs: 12,
                          isDisabled: false,
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
                      display: 'flex',
                      jusityContent: 'flex-end',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Button
                      variant="outlined"
                      disabled={workingArea.length > 1 ? false : true}
                      color="error"
                      onClick={() => handleRemoveWorkingArea(row.id, i)}
                      size="small"
                      className="btn-close"
                    >
                      <Clear />
                    </Button>
                  </Grid>
                </Grid>
              ))}
          {/* ////////////////////////////// End working area ///////////// */}
          <Box mt={3}>
            {checkedArea ? (
              ''
            ) : (
              <Button
                className="btn btn-add"
                onClick={handleAddClicksetWorkingArea}
                size="small"
                variant="contained"
                endIcon={<Add />}
              >
                একাধিক কর্ম এলাকা সংযুক্ত করুন
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
