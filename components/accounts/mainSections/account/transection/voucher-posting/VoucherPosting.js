import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import SubHeading from 'components/shared/others/SubHeading';

import { useRef, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import engToBdNum from 'service/englishToBanglaDigit';

import FromControlJSON from 'service/form/FormControlJSON';
import useWorkFlowFunctionalities from '../../../../hooks/useWorkflowFunctionalities';

const VoucherPosting = ({
  tableTitle,

  description,
  handleDescription,
  glList,
  allGlList,
  handleSubGlType,
  subGlType,
  handleSubGlData,
  subGlData,
  handleDrAmount,
  handleCrAmount,
  handleAdd,
  onSubmitData,
  tabValue,

  handleGrantorInfo,
  totalDr,
  totalCr,
  projects,
  handleChangeProject,
  project,
  formErrors,
  handleGl2,
  isLoading,

  officeNameData,
  handleChangeOffice,
  determineDrCrCode,
  selectedGls,
  userOfficeId,

  clearRow,
  openDate,
  projectTextfieldKey,
}) => {
  // eslint-disable-next-line no-empty-pattern
  const {} = useWorkFlowFunctionalities();

  const [enableDr] = useState(false);
  const [enableCr] = useState(false);
  const [crRefs] = useState([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);
  const [drRefs] = useState([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);
  const [ledgerRefs] = useState([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);
  const regex = /[০-৯.,0-9]$/;
  const moveCursorAccordingToBuiseness = (index) => {
    if ((tabValue == 0) & (index == 0)) {
      crRefs[index].current.focus();
    } else if (tabValue == 1 && index == 0) {
      drRefs[index].current.focus();
    } else if (tabValue == 0 || (tabValue == 1 && index != 0)) {
      if (selectedGls[index - 1]) {
        const drcrCode = determineDrCrCode(selectedGls[index - 1]);
        if (drcrCode === 'C') {
          crRefs[index].current.focus();
        } else {
          drRefs[index].current.focus();
        }
      }
    }
  };

  return (
    <>
      <Grid container>
        <Grid container spacing={2} className="section">
          <Grid item xs={12} md={4} lg={4}>
            <Autocomplete
              key={projectTextfieldKey}
              size="small"
              disablePortal
              id="combo-box-demo"
              options={projects}
              getOptionLabel={(option) => option.projectNameBangla}
              onChange={handleChangeProject}
              onFocus={() => {
                if (project === '') {
                  handleChangeProject(null, '');
                }
              }}
              onBlur={() => {
                if (project === null) {
                  handleChangeProject(null, null);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label={project === '' ? 'প্রকল্প নির্বাচন করুন ' : 'প্রকল্প'} />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <TextField
              fullWidth
              id="generalRemarks"
              label="ভাউচারের বিবরণ"
              name="description"
              value={description}
              onChange={handleDescription}
              type="text"
              variant="outlined"
              // style={{ backgroundColor: "#FFF" }}

              size="small"
            />
          </Grid>

          <FromControlJSON
            arr={[
              {
                labelName: 'ওপেন ডেট',
                onChange: () => {},
                value: openDate,
                size: 'small',
                type: 'date',
                viewType: 'date',
                dateFormet: 'dd/MM/yyyy',
                disableFuture: true,
                // MinDate: "01-01-1970",
                xl: 12,
                lg: 4,
                md: 4,
                xs: 12,
                isDisabled: true,
                customClass: '',
                customStyle: {},

                errorMessage: '',
              },
            ]}
          />
        </Grid>

        <Grid container sx={{ paddingTop: '30px' }}>
          <Grid item xs={12} md={12}>
            <Box>
              <SubHeading>{tableTitle}</SubHeading>

              <TableContainer className="table-container">
                <Table className="input-table" aria-label="customized table" size="small">
                  <TableHead className="table-head">
                    <TableRow>
                      {tabValue === 3 && <TableCell width={tabValue == 3 ? '25%' : '13%'}>অফিস</TableCell>}
                      <TableCell width={tabValue === 3 ? '25%' : '25%'}>লেজারের নাম</TableCell>

                      <TableCell>বিবরণ</TableCell>

                      {tabValue != 3 && <TableCell width="12%">সাব-লেজারের ধরন</TableCell>}
                      {tabValue !== 3 && <TableCell width="12%">সাব-লেজারের নাম</TableCell>}
                      <TableCell width="12%" align="right">
                        ডেবিট পরিমাণ
                      </TableCell>
                      <TableCell width="12%" align="right">
                        ক্রেডিট পরিমাণ
                      </TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {glList
                      ? glList.map((item, i) => {
                          'Itmememem201', item?.drAmount;
                          return (
                            <TableRow key={i} className="row-align">
                              {tabValue === 3 && (
                                <TableCell>
                                  <span
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'left',
                                    }}
                                  >
                                    <Autocomplete
                                      key={item.key}
                                      fullWidth
                                      disablePortal
                                      inputProps={{
                                        style: { padding: 0, margin: 0 },
                                      }}
                                      name="officeName"
                                      onChange={(e, value) => {
                                        handleChangeOffice(e, value, i);
                                      }}
                                      options={officeNameData?.filter(
                                        (office) => office.id != selectedGls[0]?.officeId,
                                      )}
                                      getOptionLabel={(option) => option.nameBn}
                                      value={
                                        i === 0
                                          ? officeNameData?.find((office) => office.id == userOfficeId)
                                          : undefined
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          fullWidth
                                          placeholder={'অফিস নির্বাচন করুন '}
                                          variant="outlined"
                                          size="small"
                                          error={selectedGls[i] && !selectedGls[i]?.officeId ? true : false}
                                          sx={{
                                            '& .MuiAutocomplete-input': {
                                              padding: '4px !important',
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </span>
                                </TableCell>
                              )}
                              <TableCell scope="row">
                                <Autocomplete
                                  InputLabelProps={{ shrink: false }}
                                  key={item.key}
                                  fullWidth
                                  size="small"
                                  disablePortal
                                  id="combo-box-demo"
                                  options={allGlList}
                                  getOptionLabel={(option) => option.glacName + ' ' + '(' + `${option.glacCode}` + ')'}
                                  onChange={(e, value) => {
                                    handleGl2(e, value, i);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{
                                        '& .MuiAutocomplete-input': {
                                          padding: '4px !important',
                                        },
                                      }}
                                      error={selectedGls[i] && !selectedGls[i]?.id ? true : false}
                                      {...params}
                                      placeholder={'নির্বাচন করুন'}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell scope="row">
                                {
                                  <TextField
                                    fullWidth
                                    id="number"
                                    placeholder=" বিবরণ"
                                    name="nidNumber"
                                    // value={description}

                                    value={item?.desc ?? ''}
                                    innerHTML="nidNumber"
                                    onChange={(e) => handleGrantorInfo(e, i)}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onKeyDown={(e) => {
                                      // e.preventDefault();
                                      if (e.key === 'Tab' && (tabValue == 0 || tabValue == 1)) {
                                        e.preventDefault();
                                        moveCursorAccordingToBuiseness(i);
                                      }
                                    }}
                                  ></TextField>
                                }
                              </TableCell>
                              {tabValue != 3 && (
                                <TableCell
                                  // width={tabValue === 3 ? "12%" : "14%"}
                                  scope="row"
                                >
                                  <span
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <TextField
                                      fullWidth
                                      id="number"
                                      name="nidNumber"
                                      disabled={selectedGls[i]?.subGl === true ? false : true}
                                      select
                                      SelectProps={{ native: true }}
                                      // value={item.subGlType}
                                      onChange={(e) => handleSubGlType(e, i)}
                                      type="text"
                                      variant="outlined"
                                      className="input-amount"
                                      multiline
                                      size="small"
                                    >
                                      {item?.subGl != null ? (
                                        <option> - নির্বাচন করুন -</option>
                                      ) : (
                                        <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                                      )}

                                      {subGlType.map((option) => (
                                        <option
                                          key={option.id}
                                          value={JSON.stringify({
                                            id: option.id,
                                            subGlType: option.displayValue,
                                          })}
                                        >
                                          {option.displayValue}
                                        </option>
                                      ))}
                                    </TextField>
                                  </span>
                                  {/* {item?.subGl === true &&
                                (item.subGlTypeId === null ||
                                  item.subGlTypeId === "" ||
                                  item.subGlTypeId === undefined) && (
                                  <span style={{ color: "red" }}>
                                    {formErrors.subGlTypeError}
                                  </span>
                                )} */}
                                </TableCell>
                              )}
                              {tabValue != 3 && (
                                <TableCell
                                  // width={tabValue === 3 ? "12%" : "14%"}
                                  scope="row"
                                >
                                  <TextField
                                    fullWidth
                                    select
                                    name="name"
                                    onChange={(e) => handleSubGlData(e, i)}
                                    disabled={selectedGls[i]?.subGl === true ? false : true}
                                    type="text"
                                    variant="outlined"
                                    SelectProps={{ native: true }}
                                    multiline
                                    size="small"
                                  >
                                    {item?.subGlDataName ? (
                                      <option>{item?.subGlDataName}</option>
                                    ) : (
                                      <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                                    )}
                                    {subGlData.map((option) => (
                                      <option
                                        key={option.id}
                                        value={JSON.stringify({
                                          id: option.id,
                                          subGlDataName: option.name,
                                        })}
                                      >
                                        {option.name}
                                      </option>
                                    ))}
                                  </TextField>
                                  {/* {item?.subGl === true &&
                                (item.subGlData === null ||
                                  item.subGlData === "" ||
                                  item.subGlData === undefined) && (
                                  <span style={{ color: "red" }}>
                                    {formErrors.subGlDataError}
                                  </span>
                                )} */}
                                </TableCell>
                              )}

                              <TableCell scope="row">
                                <span
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                  }}
                                >
                                  {
                                    <TextField
                                      fullWidth
                                      id="drAmount"
                                      name="drAmount"
                                      // value={x.nidNumber}
                                      value={
                                        item?.drAmount == '' || item?.crAmount == undefined
                                          ? ''
                                          : engToBdNum(item?.drAmount)
                                      }
                                      innerHTML="nidNumber"
                                      textAlign="right"
                                      onChange={(e) => handleDrAmount(e, i)}
                                      type="text"
                                      variant="outlined"
                                      size="small"
                                      className="input-amount"
                                      // inputRef={drRefs[i]}
                                      onKeyDown={(e) => {
                                        // e.preventDefault();
                                        if (e.key === 'Tab' && (tabValue == 0 || tabValue == 1)) {
                                          e.preventDefault();
                                          ledgerRefs[i + 1]?.current?.focus();
                                        }
                                      }}
                                      InputProps={{
                                        inputProps: {
                                          pattern: regex,
                                        },
                                      }}
                                    />
                                  }
                                </span>
                              </TableCell>
                              <TableCell scope="row">
                                <span
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                  }}
                                >
                                  <TextField
                                    fullWidth
                                    id="crAmount"
                                    name="crAmount"
                                    textAlign="right"
                                    value={
                                      item?.crAmount == '' || item?.crAmount == undefined
                                        ? ''
                                        : engToBdNum(item?.crAmount)
                                    }
                                    innerHTML="nidNumber"
                                    onChange={(e) => {
                                      handleCrAmount(e, i);
                                      'testeteteete', item?.crAmount;
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    className="input-amount"
                                    InputProps={{
                                      inputProps: {
                                        pattern: regex,
                                      },
                                    }}
                                    //  inputRef={crRefs[i]}
                                  />
                                </span>
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'center',
                                  '& .MuiTableCell-root': { marginTop: '8px' },
                                }}
                              >
                                <div
                                  style={{
                                    marginTop: '8px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    cursor: 'pointer',
                                    padding: '8%',
                                  }}
                                  onClick={() => {
                                    clearRow(i);
                                  }}
                                >
                                  <ClearRoundedIcon
                                    sx={{
                                      display: 'block',
                                      color: 'white',
                                      background: 'red',
                                      borderRadius: '50%',
                                      padding: '2px',
                                    }}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : ' '}
                    <TableRow sx={{ verticalAlign: 'baseline', marginTop: '.5rem' }}>
                      <TableCell width="15%">
                        <Button variant="contained" className="btn btn-primary" onClick={handleAdd}>
                          {' '}
                          যোগ করুন
                        </Button>
                      </TableCell>
                      {tabValue === 3 && <TableCell width="13%"></TableCell>}
                      <TableCell></TableCell>

                      {tabValue != 3 && <TableCell width="14%"></TableCell>}
                      {tabValue != 3 && <TableCell width="12%">সর্বমোট:</TableCell>}
                      <TableCell
                        width="12%"
                        align="right"
                        // sx={{
                        //   "& .input-table input": {
                        //     textAlign: "right",
                        //   },
                        // }}
                      >
                        <TextField
                          fullWidth
                          id="number"
                          name="nidNumber"
                          autoFocus={enableDr}
                          // textAlign="right"
                          disabled
                          // value={x.nidNumber}
                          value={engToBdNum(totalDr)}
                          // innerHTML="nidNumber"
                          //onChange={(e) => handleGrantorInfo(e, i)}
                          // onChange={(e) => handleDrAmmount(e, i)}
                          type="text"
                          variant="outlined"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              textAlign: 'right',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell width="12%" align="right">
                        <TextField
                          disabled
                          fullWidth
                          id="number"
                          name="nidNumber"
                          value={engToBdNum(totalCr)}
                          type="text"
                          variant="outlined"
                          size="small"
                          autoFocus={enableCr}
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              textAlign: 'right',
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>

                    <Grid container sx={{ alignItems: 'flex-end' }}>
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {formErrors?.totalDrCrError && (
                          <Grid item>
                            <span style={{ color: 'red' }}>{formErrors.totalDrCrError}</span>
                          </Grid>
                        )}
                      </span>
                    </Grid>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>

        <Grid container className="btn-container">
          <Tooltip title="সংরক্ষন করুন">
            <LoadingButton
              disabled={isLoading}
              loading={isLoading}
              // loadingIndicator={<CircularProgress color="warning" size={16} />}
              variant="contained"
              className="btn btn-save"
              loadingPosition="end"
              onClick={onSubmitData}
              startIcon={<SaveOutlinedIcon />}
            >
              {' '}
              সংরক্ষণ করুন
            </LoadingButton>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
};

export default VoucherPosting;
