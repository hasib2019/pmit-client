import { Autocomplete, Grid, TextField } from '@mui/material';
import RequiredFile from '../../utils/RequiredFile';
const ToOfficeSelectItems = (props) => {
  const {
    serviceNames,
    defaultValue,
    officeNames,
    designationNames,
    handleChangeSAI,
    handleChangeOffice,
    handleChange,
    handleChangeSelect,
    branchNames,
    approval,
    ownOrOthers,
    setApproval,
    formErrors,
  } = props;

  const serviceList = serviceNames ? serviceNames.filter((e) => e.status) : [];
  return (
    <>
      <Grid container pt={3}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container spacing={2.5}>
            {props.id && (
              <Grid item lg={3} md={3} xs={12}>
                <TextField
                  fullWidth
                  label={RequiredFile('কর্মকান্ড')}
                  name="serviceActionId"
                  onChange={handleChangeSAI}
                  select
                  SelectProps={{ native: true }}
                  variant="outlined"
                  size="small"
                >
                  <option value={0}>- নির্বাচন করুন -</option>
                  {serviceList &&
                    serviceList.map((option) => (
                      <option
                        key={option.id}
                        value={JSON.stringify({
                          id: option.id,
                          applicationStatus: option.applicationStatus,
                          isFinalAction: option.isFinalAction,
                          name: option.name,
                          text: option.text,
                        })}
                      >
                        {option.name}
                      </option>
                    ))}
                </TextField>
              </Grid>
            )}
            {defaultValue != 'A' && defaultValue != 'R' && defaultValue != 'O' ? (
              <>
                {defaultValue != 'C' ? (
                  <>
                    <Grid item lg={props.id ? 3 : 4} md={props.id ? 3 : 4} xs={12}>
                      {ownOrOthers && ownOrOthers === 'others' && officeNames.length > 0 ? (
                        <Autocomplete
                          key={approval.serviceActionId}
                          disablePortal
                          inputProps={{ style: { padding: 0, margin: 0 } }}
                          name="origin_unit_id"
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
                              label={RequiredFile(
                                approval.origin_unit_id === '' ? 'দপ্তর/অফিস নির্বাচন করুন' : 'দপ্তর/অফিস',
                              )}
                              onFocus={() => {
                                if (approval.origin_unit_id === '') {
                                  setApproval({
                                    ...approval,
                                    origin_unit_id: null,
                                  });
                                }
                              }}
                              onBlur={() => {
                                if (approval.origin_unit_id === null) {
                                  setApproval({
                                    ...approval,
                                    origin_unit_id: '',
                                  });
                                }
                              }}
                              variant="outlined"
                              size="small"
                              style={{ backgroundColor: '#FFF', margin: '5dp' }}
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          label={RequiredFile(props.id ? 'দপ্তর/অফিস নির্বাচন করুন' : 'দপ্তর/অফিস')}
                          name="origin_unit_id"
                          select
                          value={approval.origin_unit_id}
                          SelectProps={{ native: true }}
                          variant="outlined"
                          size="small"
                        >
                          <option>- নির্বাচন করুন -</option>
                          <option key={officeNames.id} value={officeNames.id}>
                            {officeNames.nameBn}
                          </option>
                        </TextField>
                      )}
                      {!approval.origin_unit_id && (
                        <span style={{ color: 'red' }}>
                          {formErrors?.originUnitError && formErrors?.originUnitError}
                        </span>
                      )}
                    </Grid>
                    
                    <Grid item lg={props.id ? 3 : 4} md={props.id ? 3 : 4} xs={12}>
                      {ownOrOthers && ownOrOthers === 'own' ? (
                        <TextField
                          fullWidth
                          label={RequiredFile('অফিসের তালিকা')}
                          name="office_id"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          variant="outlined"
                          value={approval.office_id ? approval.office_id : '0'}
                          size="small"
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
                          key={[approval.origin_unit_id, approval.serviceActionId]}
                          disablePortal
                          inputProps={{ style: { padding: 0, margin: 0 } }}
                          name="office_id"
                          onChange={(e, value) => {
                            handleChange(e, value);
                          }}
                          options={branchNames.map((option) => {
                            return { label: option.nameBn, id: option.id };
                          })}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label={RequiredFile(
                                approval.office_id === '' ? 'অফিসের তালিকা নির্বাচন করুন' : 'অফিসের তালিকা',
                              )}
                              onFocus={() => {
                                if (approval.office_id === '') {
                                  setApproval({
                                    ...approval,
                                    office_id: null,
                                  });
                                }
                              }}
                              onBlur={() => {
                                if (approval.office_id === null) {
                                  setApproval({
                                    ...approval,
                                    office_id: '',
                                  });
                                }
                              }}
                              variant="outlined"
                              size="small"
                              style={{ backgroundColor: '#FFF', margin: '5dp' }}
                            />
                          )}
                        />
                      )}
                      {!approval.office_id && (
                        <span style={{ color: 'red' }}>{formErrors?.officeError && formErrors?.officeError}</span>
                      )}
                      {approval.office_id === '0' && (
                        <span style={{ color: 'red' }}>{formErrors?.officeError && formErrors?.officeError}</span>
                      )}
                    </Grid>
                  </>
                ) : (
                  ''
                )}

                <Grid item lg={props.id ? 3 : 4} md={props.id ? 3 : 4} xs={12}>
                  {ownOrOthers && ownOrOthers === 'own' ? (
                    <TextField
                      key={approval.officerId}
                      fullWidth
                      label={RequiredFile('কর্মকর্তা ও পদবী')}
                      name="officerId"
                      onChange={handleChangeSelect}
                      select
                      SelectProps={{ native: true }}
                      value={JSON.stringify({
                        designationId: approval.designationId,
                      })}
                      variant="outlined"
                      size="small"
                    >
                      <option>- নির্বাচন করুন -</option>
                      {designationNames.map((option) => {
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
                      key={[approval.office_id, approval.origin_unit_id, approval.serviceActionId]}
                      disablePortal
                      inputProps={{ style: { padding: 0, margin: 0 } }}
                      name="officerId"
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
                          label={RequiredFile(
                            approval.officerId === '' ? 'কর্মকর্তা ও পদবী নির্বাচন করুন' : 'কর্মকর্তা ও পদবী',
                          )}
                          onFocus={() => {
                            if (approval.office_id === '') {
                              setApproval({
                                ...approval,
                                officerId: null,
                              });
                            }
                          }}
                          onBlur={() => {
                            if (approval.office_id === null) {
                              setApproval({
                                ...approval,
                                officerId: '',
                              });
                            }
                          }}
                          variant="outlined"
                          size="small"
                          style={{ backgroundColor: '#FFF', margin: '5dp' }}
                        />
                      )}
                    />
                  )}

                  {!approval.designationId && (
                    <span style={{ color: 'red' }}>{formErrors?.designationError && formErrors?.designationError}</span>
                  )}
                  {approval.designationId === '- নির্বাচন করুন -' && (
                    <span style={{ color: 'red' }}>{formErrors?.designationError && formErrors?.designationError}</span>
                  )}
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
export default ToOfficeSelectItems;
