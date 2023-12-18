/* eslint-disable no-unused-vars */

import { Autocomplete, Grid, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  applicationNameSelected,
  defaultValueSelected,
  designationSelected,
  fetchBranchNames,
  fetchDesignationNameNew,
  fetchDesignationNames,
  fetchOfficeNames,
  officeSelected,
  officerIdSelected,
  originUnitSelected,
  ownAndOthersSelected,
  servicActionIdSelected,
  serviceSelected,
} from 'redux/feature/approvalOfficeSelectionlSlice';
import { inputRadioGroup } from 'service/fromInput';
import RequiredFile from '../../utils/RequiredFile';

const RefactoredToOfficeSelectItem = ({ formErrors, approvalInfo, id }) => {
  const dispatch = useDispatch();
  const {
    originUnitId,
    officeId,
    designationId,
    officerId,
    serviceActionId,
    applicationName: appName,
    defaultValue: defValue,
    ownOrOthers: ownOther,
    serviceNames,
    officeNames,
    designationNames,
    branchNames,
  } = useSelector((state) => state.officeSelectApproval);
  useEffect(() => {
    dispatch(fetchOfficeNames({ ownOrOthers: ownOther }));
    ownOther === 'own' && dispatch(fetchBranchNames({ value: null, ownAndOthers: ownOther }));
  }, [ownOther]);

  useEffect(() => {
    officeId && officeId !== '0' && dispatch(fetchDesignationNames({ branchId: officeId }));
  }, [officeId]);

  const handleChangeSAI = (e) => {
    if (e?.target?.value) {
      let sAID = JSON.parse(e.target.value);
      let id = sAID.id;
      let applicationStatus = sAID.applicationStatus;
      let name = sAID.name;
      dispatch(applicationNameSelected(name));
      dispatch(defaultValueSelected(applicationStatus));
      dispatch(serviceSelected(id));

      if (applicationStatus == 'C') {
        dispatch(fetchDesignationNameNew({ approvalInfo: approvalInfo.id }));
      }
    }
  };
  const handleChangeOffice = (e, value) => {
    dispatch(originUnitSelected(value && value.id));
    ownOther === 'others' && dispatch(designationSelected(''));
    ownOther === 'others' && dispatch(officeSelected(''));
    dispatch(
      fetchBranchNames({
        value: e.target.value ? e.target.value : value ? value.id : '',
        ownAndOthers: ownOther,
      }),
    );
  };
  const handleChange = (e, officeValue) => {
    const { name, value } = e.target;

    if (value && value === '0') {
      dispatch(officeSelected(0));
      dispatch(designationSelected(0));
      0;
      return;
    }

    if (name == 'office_id') {
      if (value && value !== '0') {
        dispatch(
          fetchDesignationNames({
            branchId: value,
          }),
        );
      }
      if (officeValue) {
        dispatch(
          fetchDesignationNames({
            branchId: officeValue.id,
          }),
        );
      }
    }
    value && value !== '0' && dispatch(officeSelected(officeValue ? officeValue.id : value));
    officeValue && dispatch(officeSelected(officeValue.id));

    dispatch(designationSelected(value ? 0 : ''));
    value ? 0 : '';
  };
  const handleChangeSelect = (e, value) => {
    if (value) {
      let desData = JSON.parse(value);
      let designationIdd = desData.designationId;

      dispatch(designationSelected(designationIdd));
      designationIdd;

      return;
    }
    let desData = e.target.value && !e.target.value.includes('- নির্বাচন করুন -') && JSON.parse(e.target.value);
    let designationIdd = desData.designationId;
    dispatch(designationSelected(designationIdd));
    designationIdd;
  };
  const handleChangeForOwnOrOthers = (e) => {
    dispatch(ownAndOthersSelected(e.target.value));

    if (e.target.value === 'others') {
      dispatch(originUnitSelected(''));
      dispatch(officeSelected(''));
      dispatch(designationSelected(''));
      ('');
      dispatch(originUnitSelected(''));
      dispatch(officerIdSelected(''));
      dispatch(servicActionIdSelected(''));
    }
  };
  return (
    <>
      <Grid container spacing={2.5}>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          {inputRadioGroup(
            'ownOrOthers',
            handleChangeForOwnOrOthers,
            ownOther,
            [
              {
                value: 'own',
                color: '#007bff',
                rcolor: 'primary',
                label: 'নিজ অফিস',
              },
              {
                value: 'others',
                color: '#9c27b0',
                rColor: 'secondary',
                label: 'অন্য অফিস',
              },
            ],
            12,
            12,
            12,
            12,

            false,
          )}
        </Grid>
      </Grid>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={2.5} mt={1.5}>
            {id && (
              <Grid item lg={3} md={3} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('কর্মকান্ড')}
                  name="serviceActionId"
                  onChange={handleChangeSAI}
                  required
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                >
                  <option>- নির্বাচন করুন -</option>
                  {serviceNames &&
                    serviceNames.map((option) => (
                      <option
                        key={option.id}
                        value={JSON.stringify({
                          id: option.id,
                          applicationStatus: option.applicationStatus,
                          name: option.name,
                        })}
                      >
                        {option.name}
                      </option>
                    ))}
                </TextField>
              </Grid>
            )}
            {defValue != 'A' && defValue != 'R' ? (
              <>
                {defValue != 'C' ? (
                  <>
                    <Grid item lg={id ? 3 : 4} md={id ? 3 : 4} xs={12}>
                      {ownOther && ownOther === 'others' && officeNames.length > 0 ? (
                        <Autocomplete
                          key={serviceActionId}
                          disablePortal
                          inputProps={{ style: { padding: 0, margin: 0 } }}
                          name="origin_unit_id"
                          value={
                            officeNames
                              ?.map((office) => {
                                return { label: office.nameBn, id: office.id };
                              })
                              .find((office) => office.id === originUnitId) ?? ''
                          }
                          onChange={(e, value) => {
                            handleChangeOffice(e, value);
                          }}
                          options={officeNames.map((option) => {
                            return { label: option.nameBn, id: option.id };
                          })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label={RequiredFile(originUnitId === '' ? 'দপ্তর/অফিস ধরণ নির্বাচন করুন' : 'দপ্তর/অফিস ধরণ')}
                              onFocus={() => {
                                if (originUnitId === '') {
                                  dispatch(originUnitSelected(null));
                                }
                              }}
                              onBlur={() => {
                                if (originUnitId === null) {
                                  dispatch(originUnitSelected(''));
                                }
                              }}
                              variant="outlined"
                              size="small"
                              style={{ backgroundColor: '#FFF', margin: '5dp' }}
                              error={!originUnitId && formErrors?.originUnitError ? true : false}
                              helperText={
                                !originUnitId && formErrors?.originUnitError ? formErrors?.originUnitError : ''
                              }
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label={RequiredFile(id ? 'দপ্তর/অফিস' : 'দপ্তর/অফিস ধরণ')}
                          name="origin_unit_id"
                          select
                          value={originUnitId}
                          SelectProps={{ native: true }}
                          variant="outlined"
                          size="small"
                          error={!originUnitId && formErrors?.originUnitError ? true : false}
                          helperText={!originUnitId && formErrors?.originUnitError ? formErrors?.originUnitError : ''}
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          <option key={officeNames.id} value={officeNames.id}>
                            {officeNames.nameBn}
                          </option>
                        </TextField>
                      )}
                      {/* {!originUnitId && (
                        <span style={{ color: "red" }}>
                          {formErrors?.originUnitError &&
                            formErrors?.originUnitError}
                        </span>
                      )} */}
                    </Grid>
                    <Grid item lg={id ? 3 : 4} md={id ? 3 : 4} xs={12}>
                      {ownOther && ownOther === 'own' ? (
                        <TextField
                          fullWidth
                          label={RequiredFile('অফিসের তালিকা')}
                          name="office_id"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                          value={officeId ? officeId : '0'}
                          size="small"
                          error={(!officeId || officeId === '0') && formErrors?.officeError ? true : false}
                          helperText={
                            !officeId && formErrors?.officeError
                              ? formErrors?.officeError
                              : officeId === '0' && formErrors?.officeError
                                ? formErrors?.officeError
                                : ''
                          }
                        >
                          <option value={0}>- নির্বাচন করুন -</option>
                          {branchNames.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.nameBn}
                            </option>
                          ))}
                        </TextField>
                      ) : (
                        <Autocomplete
                          key={[originUnitId, serviceActionId]}
                          disablePortal
                          inputProps={{ style: { padding: 0, margin: 0 } }}
                          name="office_id"
                          value={
                            branchNames
                              ?.map((br) => {
                                return { label: br.nameBn, id: br.id };
                              })
                              .find((brn) => brn.id === officeId) ?? ''
                          }
                          onChange={(e, value) => {
                            handleChange(e, value);
                          }}
                          options={branchNames?.map((option) => {
                            return { label: option.nameBn, id: option.id };
                          })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label={RequiredFile(officeId === '' ? 'অফিসের তালিকা নির্বাচন করুন' : 'অফিসের তালিকা')}
                              onFocus={() => {
                                if (officeId === '') {
                                  dispatch(officeSelected(null));
                                }
                              }}
                              onBlur={() => {
                                if (officeId === null) {
                                  dispatch(officeSelected(''));
                                }
                              }}
                              variant="outlined"
                              size="small"
                              style={{ backgroundColor: '#FFF', margin: '5dp' }}
                              error={(!officeId || officeId === '0') && formErrors?.officeError ? true : false}
                              helperText={
                                !officeId && formErrors?.officeError
                                  ? formErrors?.officeError
                                  : officeId === '0' && formErrors?.officeError
                                    ? formErrors?.officeError
                                    : ''
                              }
                            />
                          )}
                        />
                      )}
                      {/* {!officeId && (
                        <span style={{ color: "red" }}>
                          {formErrors?.officeError && formErrors?.officeError}
                        </span>
                      )}
                      {officeId === "0" && (
                        <span style={{ color: "red" }}>
                          {formErrors?.officeError && formErrors?.officeError}
                        </span>
                      )} */}
                    </Grid>
                  </>
                ) : (
                  ''
                )}

                <Grid item lg={id ? 3 : 4} md={id ? 3 : 4} xs={12}>
                  {ownOther && ownOther === 'own' ? (
                    <TextField
                      //   key={officerId}
                      fullWidth
                      label={RequiredFile('কর্মকর্তা ও পদবী')}
                      name="officerId"
                      onChange={handleChangeSelect}
                      select
                      SelectProps={{ native: true }}
                      value={JSON.stringify({
                        designationId: designationId,
                      })}
                      variant="outlined"
                      size="small"
                      error={
                        (!designationId || designationId === '- নির্বাচন করুন -') && formErrors?.designationError
                          ? true
                          : false
                      }
                      helperText={
                        !designationId && formErrors?.designationError
                          ? formErrors?.designationError
                          : designationId === '- নির্বাচন করুন -' && formErrors?.designationError
                            ? formErrors?.designationError
                            : ''
                      }
                    >
                      <option value={0}>- নির্বাচন করুন -</option>
                      {designationNames?.map((option) => {
                        return (
                          <option
                            key={option.selectId}
                            value={JSON.stringify({
                              designationId: option.designationId,
                            })}
                          >
                            {option.designation}
                            {' - '}
                            {option.nameBn}
                          </option>
                        );
                      })}
                    </TextField>
                  ) : (
                    <Autocomplete
                      key={[officeId, originUnitId, serviceActionId]}
                      disablePortal
                      inputProps={{ style: { padding: 0, margin: 0 } }}
                      name="officerId"
                      value={
                        designationNames
                          ?.map((des) => {
                            return {
                              label: des.nameBn + ' - ' + des.designation,
                              id: des.designationId,
                              employeeId: des.employeeId,
                            };
                          })
                          .find((desg) => desg.id === designationId) ?? ''
                      }
                      onChange={(e, value) => {
                        handleChangeSelect(
                          e,
                          JSON.stringify({
                            designationId: value ? value.id : '',
                            employeeId: value ? value.employeeId : '',
                          }),
                        );
                      }}
                      options={designationNames.map((option) => {
                        if (option.nameBn && option.designation) {
                          return {
                            label: option.nameBn + ' - ' + option.designation,
                            id: option.designationId,
                            employeeId: option.employeeId,
                          };
                        } else {
                          return {
                            label: option.nameBangla + ' - ' + option.employeeName,
                            id: option.designationId,
                            employeeId: option.employeeId,
                          };
                        }
                      })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          label={RequiredFile(officerId === '' ? 'কর্মকর্তা ও পদবী নির্বাচন করুন' : 'কর্মকর্তা ও পদবী')}
                          onFocus={() => {
                            if (officerId === '') {
                              dispatch(officerIdSelected(null));
                            }
                          }}
                          onBlur={() => {
                            if (officerId === null) {
                              dispatch(officerIdSelected(''));
                            }
                          }}
                          variant="outlined"
                          size="small"
                          style={{ backgroundColor: '#FFF', margin: '5dp' }}
                          error={
                            (!designationId || designationId === '- নির্বাচন করুন -') && formErrors?.designationError
                              ? true
                              : false
                          }
                          helperText={
                            !designationId && formErrors?.designationError
                              ? formErrors?.designationError
                              : designationId === '- নির্বাচন করুন -' && formErrors?.designationError
                                ? formErrors?.designationError
                                : ''
                          }
                        />
                      )}
                    />
                  )}

                  {/* {!designationId && (
                    <span style={{ color: "red" }}>
                      {formErrors?.designationError &&
                        formErrors?.designationError}
                    </span>
                  )}
                  {designationId === "- নির্বাচন করুন -" && (
                    <span style={{ color: "red" }}>
                      {formErrors?.designationError &&
                        formErrors?.designationError}
                    </span>
                  )} */}
                </Grid>
              </>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default RefactoredToOfficeSelectItem;
