import { FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';
import { loanProject } from '../../../../../url/ApiList';
import { engToBang } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';

const defaulterActionArray = [
  {
    value: 'C',
    label: 'ক্লোজ',
  },
  {
    value: 'W',
    label: 'সতর্ক করা',
  },
];

const maturityProcessArray = [
  {
    value: 'F',
    label: 'নির্দিষ্ট পরিমাণ',
  },
  {
    value: 'P',
    label: 'মুনাফা হার',
  },
];
const profitPostingPeriodArray = [
  {
    value: 'H',
    label: 'অর্ধ বার্ষিক',
  },
  {
    value: 'Y',
    label: 'বার্ষিক',
  },
  {
    value: 'M',
    label: 'ম্যাচুরিটি',
  },
];
const UpdateProductMaster = ({
  productMasterData,
  handleProductMaster,
  handleProductMasterDataDate,
  formError,
}) => {

  const [projectsName, setProjectsName] = useState([]);
  // const [glAssetList, setGlAssetList] = useState([]);
  // const [glIncomeList, setGlIncomeList] = useState([]);

  useEffect(() => {
    getProject();
    // getGlAssetList();
    // getGlIncomeList();
  }, []);

  const getProject = async () => {
    let projects = await getApi(loanProject, 'get');
    setProjectsName(projects?.data?.data ? projects.data.data : []);
  };

  // const getGlAssetList = async () => {
  //   let getAssetList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=A', 'get');
  //   setGlAssetList(getAssetList?.data?.data ? getAssetList?.data?.data : []);
  // };

  // const getGlIncomeList = async () => {
  //   let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
  //   setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  // };

  const {
    projectId,
    productCode,
    productName,
    openDate,
    minLoanAmt,
    maxLoanAmt,
    insStartDay,
    insEndDay,
    realizableSavings,
    repFrq,
    fineAllow,
    depositNature,
    insHolidayConsideration,
    maxDefaultInsAllow,
    defaultAction,
    depMultiplyBy,
    maturityAmtInstruction,
    afterMaturityInsAllow,
    maturityMaxDay,
    intPostPeriod,
  } = productMasterData;
  const star = (dialoge) => {
    return (
      <>
        <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2.5} className="section">
        <Grid item md={4} xs={12}>
          <TextField
            id="projectId"
            fullWidth
            label={star('প্রোজেক্টের নাম/কোড')}
            name="projectId"
            select
            SelectProps={{ native: true }}
            value={projectId}
            variant="outlined"
            size="small"
            onChange={handleProductMaster}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {projectsName.map((option, idx) => (
              <option key={idx} value={option.id}>
                {option.projectNameBangla}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('প্রোডাক্ট কোড')}
            name="productCode"
            number
            id="number"
            disabled={true}
            value={productCode}
            variant="outlined"
            size="small"
            onChange={handleProductMaster}
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('প্রোডাক্টের নাম')}
            name="productName"
            onChange={handleProductMaster}
            number
            disabled={true}
            value={productName}
            variant="outlined"
            size="small"
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={star('শুরুর তারিখ')}
              value={openDate}
              disabled=""
              onChange={(e) => handleProductMasterDataDate(e)}
              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
            />
          </LocalizationProvider>
        </Grid>
        {depositNature == 'C' && (
          <Grid item md={4} xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                {intPostPeriod === ''
                  ? star('মুনাফা পোস্টিং পিরিয়ড নির্বাচন করুন')
                  : star('মুনাফা পোস্টিং পিরিয়ডের নাম')}
              </InputLabel>
              <Select
                name="intPostPeriod"
                id="demo-simple-select"
                value={intPostPeriod}
                label={
                  intPostPeriod === ''
                    ? star('মুনাফা পোস্টিং পিরিয়ড নির্বাচন করুন')
                    : star('মুনাফা পোস্টিং পিরিয়ডের নাম')
                }
                onChange={handleProductMaster}
                size="small"
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {profitPostingPeriodArray
                  .filter((profitElement) => (depositNature == 'D' ? profitElement.value == 'MAT' : true))
                  .map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item md={4} xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-labels">
              {repFrq === '' ? star('কিস্তির ফ্রিকোয়েন্সি নির্বাচন করুন') : star('কিস্তির ফ্রিকোয়েন্সি')}
            </InputLabel>
            <Select
              labelId="demo-simple-select-labels"
              id="demo-simple-selects"
              name="repFrq"
              value={repFrq == 'W' ? 'W' : repFrq == 'M' ? 'M' : ''}
              label={repFrq === '' ? star('ডিফল্টার অ্যাকশন নির্বাচন করুন') : star('ডিফল্টার অ্যাকশন নাম')}
              onChange={handleProductMaster}
              size="small"
            >
              <MenuItem value={'W'}>সাপ্তাহিক</MenuItem>
              <MenuItem value={'M'}>মাসিক</MenuItem>
            </Select>
          </FormControl>
          {/* <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {repFrq == ""
                ? star("কিস্তির ফ্রিকোয়েন্সি নির্বাচন করুন")
                : star("কিস্তির ফ্রিকোয়েন্সি")}
            </InputLabel>
            <Select
              name="repFrq"
              id="demo-simple-select"
              value={"M"}
              label={
                repFrq == ""
                  ? star("কিস্তির ফ্রিকোয়েন্সি নির্বাচন করুন")
                  : star("কিস্তির ফ্রিকোয়েন্সি")
              }
              onChange={handleProductMaster}
              size="small"
              sx={{
                "& .MuiSelect-select": {
                  textDecoration: "none",
                },
              }}
            >
              {[
                { value: "W", label: "সাপ্তাহিক" },
                { value: "M", label: "মাসিক" },
              ].map((option) => (
                <MenuItem value={option.value} key={option.value}>
                  {option.label + option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Grid>
        {depositNature == 'R' && (
          <Grid item md={4} xs={12}>
            <TextField
              fullWidth
              label={star('আদায়যোগ্য সঞ্চয়')}
              name="realizableSavings"
              value={engToBang(realizableSavings)}
              id="numberWithCharge"
              variant="outlined"
              onChange={handleProductMaster}
              size="small"
            ></TextField>
          </Grid>
        )}
        {depositNature == 'C' && (
          <>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  control={<Switch checked={fineAllow} onChange={handleProductMaster} name="fineAllow" />}
                  label="বিলম্বিত চার্জ?"
                  labelPlacement="start"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('কিস্তির শুরুর দিন')}
                name="insStartDay"
                onChange={handleProductMaster}
                value={engToBang(insStartDay)}
                variant="outlined"
                size="small"
              // error={Boolean(touched.installmentStartingDate && errors.installmentStartingDate)}
              // helperText={touched.installmentStartingDate && errors.installmentStartingDate}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('কিস্তির শেষের দিন')}
                name="insEndDay"
                onChange={handleProductMaster}
                value={engToBang(insEndDay)}
                variant="outlined"
                size="small"
              // error={Boolean(formErrors.installmentClosingDate)}
              // helperText={formErrors.installmentClosingDate}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={insHolidayConsideration}
                      onChange={handleProductMaster}
                      name="insHolidayConsideration"
                    />
                  }
                  label="ছুটির দিন বিবেচনা?"
                  labelPlacement="start"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সর্বোচ্চ ডিফল্ট কিস্তির সংখ্যা')}
                name="maxDefaultInsAllow"
                onChange={handleProductMaster}
                value={engToBang(maxDefaultInsAllow)}
                variant="outlined"
                size="small"
              // error={Boolean(formErrors.maxDefaultInsAllow)}
              // helperText={formErrors.maxDefaultInsAllow}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {defaultAction === '' ? star('ডিফল্টার অ্যাকশন নির্বাচন করুন') : star('ডিফল্টার অ্যাকশন নাম')}
                </InputLabel>
                <Select
                  name="defaultAction"
                  id="demo-simple-select"
                  value={defaultAction}
                  label={defaultAction === '' ? star('ডিফল্টার অ্যাকশন নির্বাচন করুন') : star('ডিফল্টার অ্যাকশন নাম')}
                  onChange={handleProductMaster}
                  size="small"
                  sx={{
                    '& .MuiSelect-select': {
                      textDecoration: 'none',
                    },
                  }}
                >
                  {defaulterActionArray.map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  control={
                    <Switch
                      checked={afterMaturityInsAllow}
                      onChange={handleProductMaster}
                      name="afterMaturityInsAllow"
                    />
                  }
                  label="মেয়াদপূর্তির পর কিস্তির অনুমতি?"
                  labelPlacement="start"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন)')}
                name="maturityMaxDay"
                placeholder="মেয়াদপূর্তির পর কিস্তির দেয়ার সর্বোচ্চ সময় সীমা (দিন)"
                onChange={handleProductMaster}
                value={engToBang(maturityMaxDay)}
                variant="outlined"
                size="small"
              // error={Boolean(touched.maxLimitAfterMaturity && errors.maxLimitAfterMaturity)}
              // helperText={touched.maxLimitAfterMaturity && errors.maxLimitAfterMaturity}
              ></TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {maturityAmtInstruction === ''
                    ? star('ম্যাচুরিটি প্রক্রিয়া নির্বাচন করুন')
                    : star('ম্যাচুরিটি প্রক্রিয়ার নাম')}
                </InputLabel>
                <Select
                  name="maturityProcess"
                  id="demo-simple-select"
                  value={maturityAmtInstruction}
                  label={
                    maturityAmtInstruction === ''
                      ? star('ম্যাচুরিটি প্রক্রিয়া নির্বাচন করুন')
                      : star('ম্যাচুরিটি প্রক্রিয়ার নাম')
                  }
                  onChange={handleProductMaster}
                  size="small"
                  sx={{
                    '& .MuiSelect-select': {
                      textDecoration: 'none',
                    },
                  }}
                >
                  {maturityProcessArray.map((option) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সর্বনিম্ন কিস্তির পরিমান')}
                name="minLoanAmt"
                onChange={handleProductMaster}
                id="chargeNumber"
                value={engToBang(minLoanAmt)}
                variant="outlined"
                size="small"
              ></TextField>
              {!minLoanAmt ? (
                <span style={{ color: '#FFCC00' }}>{formError.minLoanAmt}</span>
              ) : minLoanAmt.length > 0 ? (
                <span style={{ color: '#FFCC00' }}>{formError.minLoanAmt}</span>
              ) : (
                ''
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('সর্বোচ্চ কিস্তির পরিমান')}
                name="maxLoanAmt"
                onChange={handleProductMaster}
                id="chargeNumber"
                value={engToBang(maxLoanAmt)}
                variant="outlined"
                size="small"
              ></TextField>
              {!maxLoanAmt ? <span style={{ color: '#FFCC00' }}>{formError.maxLoanAmt}</span> : ''}
            </Grid>

            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('কিস্তির হারের গুণিতক')}
                name="depMultiplyBy"
                onChange={handleProductMaster}
                value={engToBang(depMultiplyBy)}
                variant="outlined"
                size="small"
              // error={Boolean(touched.installmentRateMultiplier && errors.installmentRateMultiplier)}
              // helperText={touched.installmentRateMultiplier && errors.installmentRateMultiplier}
              ></TextField>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default UpdateProductMaster;
