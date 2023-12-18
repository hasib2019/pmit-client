import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Grid, TextField } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';
import { glListRoute, loanProject } from '../../../../../url/ApiList';
import { engToBang } from '../../../samity-managment/member-registration/validator';
import { getApi } from '../utils/getApi';

const holidayEffectArray = [
  {
    value: 'NWD',
    label: 'পরবর্তী কার্যদিবস',
  },
  {
    value: 'NMD',
    label: 'পরবর্তী মিটিং এর দিন',
  },
  {
    value: 'NO',
    label: 'প্রযোজ্য নয়',
  },
];
const UpdateProductMaster = ({
  productMasterData,
  earningVal,
  valuePod,
  handleProductMaster,
  handleGracePeriodAllowedToggle,
  handleGracePeriodServiceChargeAllowedToggle,
  handleGraceInsuranceAllowedToggle,
  handleProductMasterDataDate,
  handleIsAdvPaymentToggle,
  handleChequeDisbursementToggle,
  formError,
}) => {


  const [projectsName, setProjectsName] = useState([]);
  const [glAssetList, setGlAssetList] = useState([]);
  const [glIncomeList, setGlIncomeList] = useState([]);

  useEffect(() => {
    getProject();
    getGlAssetList();
    getGlIncomeList();
  }, []);

  const getProject = async () => {
    let projects = await getApi(loanProject, 'get');
    setProjectsName(projects?.data?.data ? projects.data.data : []);
  };

  const getGlAssetList = async () => {
    let getAssetList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=A', 'get');
    setGlAssetList(getAssetList?.data?.data ? getAssetList?.data?.data : []);
  };

  const getGlIncomeList = async () => {
    let getIncomeList = await getApi(glListRoute + '?isPagination=false&parentChild=C&glacType=I', 'get');
    setGlIncomeList(getIncomeList?.data?.data ? getIncomeList?.data?.data : []);
  };


  const filteredValue = (option, idx, ownId) => {
    if (valuePod[option.value].id === ownId)
      return (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      );
    else if (valuePod[option.value].status === 'NOT_TAKEN')
      return (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      );
    else return '';
  };

  const {
    projectId,
    productCode,
    productName,
    openDate,
    minLoanAmt,
    maxLoanAmt,
    repFrq,
    calType,
    productGl,
    allowGracePeriod,
    gracePeriod,
    serCrgAtGracePeriod,
    graceAmtRepayIns,
    serviceChargeGl,
    principalGl,
    allowInsurance,
    insuranceGl,
    insurancePercent,
    realizationSeqOd,
    realizationSeqPrincipal,
    realizationSeqService,
    holidayEffect,
    loanTerm,
    numberOfInstallment,
    isAdvPayBenefit,
    chequeDisbursementFlag,
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
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('সর্বনিম্ন ঋণের পরিমান')}
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
            label={star('সর্বোচ্চ ঋণের পরিমান')}
            name="maxLoanAmt"
            onChange={handleProductMaster}
            id="chargeNumber"
            value={engToBang(maxLoanAmt)}
            variant="outlined"
            size="small"
          ></TextField>
          {!maxLoanAmt ? (
            <span style={{ color: '#FFCC00' }}>{formError.maxLoanAmt}</span>
          ) : maxLoanAmt.length > 0 ? (
            <span style={{ color: '#FFCC00' }}>{formError.maxLoanAmt}</span>
          ) : (
            ''
          )}
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="number"
            label={star('ঋণের মেয়াদ')}
            name="loanTerm"
            placeholder="ঋণের মেয়াদ সংখ্যা একাধিক হলে কমা ব্যবহার করুন"
            onChange={handleProductMaster}
            value={engToBang(loanTerm)}
            variant="outlined"
            size="small"
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('রিপেমেন্ট ফ্রিকোয়েন্সি')}
            name="repFrq"
            select
            SelectProps={{ native: true }}
            value={repFrq}
            variant="outlined"
            size="small"
            onChange={handleProductMaster}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {[
              { value: 'W', label: 'সাপ্তাহিক' },
              { value: 'M', label: 'মাসিক' },
            ].map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('কিস্তি আদায়ের সংখ্যা')}
            name="numberOfInstallment"
            onChange={handleProductMaster}
            value={engToBang(numberOfInstallment)}
            variant="outlined"
            placeholder="ঋণ টার্ম সংখ্যা একাধিক হলে কমা ব্যবহার করুন"
            size="small"
          ></TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('সার্ভিস চার্জ ক্যালকুলেশনের পদ্ধতি')}
            name="calType"
            id="district"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={calType}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {[
              { value: 'F', label: 'ফ্লাট' },
              { value: 'D', label: 'ডিক্লাইন' },
              { value: 'DOC', label: 'কাস্টম' },
              { value: 'DOC-MILK', label: 'গাভী ঋণ-মেহেরপুর,যশোর' },
            ].map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('প্রোডাক্ট জিএল')}
            name="productGl"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={productGl}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {glAssetList.map((option, idx) => (
              <option key={idx} value={option.id}>
                {option.glacName}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid
          item
          md={4}
          xs={12}
          sx={{
            '& .MuiToggleButton-root': {
              boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              transition: '0.3s ease',
              backgroundColor: '#E8F9FD',
              color: 'green',
              borderRadius: '10px',
              border: 'none',
              '&:hover': {
                backgroundColor: '#CDF0EA',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
              },
            },
            '& .MuiToggleButton-root.Mui-selected': {
              color: 'green',
              backgroundColor: '#E7FBBE',
            },
          }}
        >
          <ToggleButton
            value="check"
            fullWidth
            selected={allowGracePeriod}
            onChange={handleGracePeriodAllowedToggle}
            sx={{
              height: '40px',
            }}
          >
            {allowGracePeriod ? (
              <>
                <CheckCircleIcon /> <h3>হ্যাঁ গ্রেস পিরিয়ড এলাউড</h3>
              </>
            ) : (
              <>
                <HelpIcon />
                <h3>গ্রেস পিরিয়ড এলাউড কিনা?</h3>
              </>
            )}
          </ToggleButton>
        </Grid>

        {allowGracePeriod ? (
          <>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('গ্রেস পিরিয়ড')}
                name="gracePeriod"
                onChange={handleProductMaster}
                number
                value={engToBang(gracePeriod)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              sx={{
                '& .MuiToggleButton-root': {
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                  transition: '0.3s ease',
                  backgroundColor: '#E8F9FD',
                  color: 'green',
                  borderRadius: '10px',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: '#CDF0EA',
                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
                  },
                },
                '& .MuiToggleButton-root.Mui-selected': {
                  color: 'green',
                  backgroundColor: '#E7FBBE',
                },
              }}
            >
              <ToggleButton
                value="check"
                fullWidth
                selected={serCrgAtGracePeriod}
                onChange={handleGracePeriodServiceChargeAllowedToggle}
                sx={{
                  height: '40px',
                  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                  border: 'none',
                }}
              >
                {serCrgAtGracePeriod ? (
                  <>
                    <CheckCircleIcon /> <h3>হ্যাঁ গ্রেস পিরিয়ডে সার্ভিস চার্জ প্রযোজ্য</h3>
                  </>
                ) : (
                  <>
                    <HelpIcon />
                    <h3>গ্রেস পিরিয়ডে সার্ভিস চার্জ প্রযোজ্য কিনা?</h3>
                  </>
                )}
              </ToggleButton>
            </Grid>
            {serCrgAtGracePeriod ? (
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label={star('গ্রেস পিরিয়ডে সার্ভিস চার্জ নির্দেশনা')}
                  name="graceAmtRepayIns"
                  disabled=""
                  select
                  SelectProps={{ native: true }}
                  value={graceAmtRepayIns}
                  onChange={handleProductMaster}
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: '#FFF' }}
                >
                  <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                  {[{ value: 'EQUAL', label: 'সমভাবে বণ্টিত' }].map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('মূলধন জিএল')}
            name="principalGl"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={principalGl}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {glAssetList.map((option, idx) => (
              <option key={idx} value={option.id}>
                {option.glacName}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('সার্ভিস চার্জ জিএল')}
            name="serviceChargeGl"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={serviceChargeGl}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {glIncomeList.map((option, idx) => (
              <option key={idx} value={option.id}>
                {option.glacName}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('হলিডে ইফেক্ট')}
            name="holidayEffect"
            select
            SelectProps={{ native: true }}
            value={holidayEffect || ' '}
            variant="outlined"
            size="small"
            sx={{ bgcolor: '#FFF' }}
            onChange={handleProductMaster}
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {holidayEffectArray.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            '& .MuiToggleButton-root': {
              boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              transition: '0.3s ease',
              backgroundColor: '#E8F9FD',
              color: 'green',
              borderRadius: '10px',
              border: 'none',
              '&:hover': {
                backgroundColor: '#CDF0EA',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
              },
            },
            '& .MuiToggleButton-root.Mui-selected': {
              color: 'green',
              backgroundColor: '#E7FBBE',
            },
          }}
        >
          <ToggleButton
            value="check"
            fullWidth
            selected={allowInsurance}
            onChange={handleGraceInsuranceAllowedToggle}
            sx={{
              height: '40px',
              boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
              border: 'none',
            }}
          >
            {allowInsurance ? (
              <>
                <CheckCircleIcon /> <h3>হ্যাঁ ইনস্যুরেন্স এলাউড</h3>
              </>
            ) : (
              <>
                <HelpIcon />
                <h3>ইনস্যুরেন্স এলাউড কিনা?</h3>
              </>
            )}
          </ToggleButton>
        </Grid>

        {allowInsurance ? (
          <>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('ইনস্যুরেন্স জিএল')}
                name="insuranceGl"
                disabled=""
                select
                SelectProps={{ native: true }}
                value={insuranceGl}
                onChange={handleProductMaster}
                variant="outlined"
                size="small"
              >
                <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
                {glAssetList.map((option, idx) => (
                  <option key={idx} value={option.id}>
                    {option.glacName}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                fullWidth
                label={star('ইনস্যুরেন্সের শতকরা হার(%)')}
                name="insurancePercent"
                onChange={handleProductMaster}
                number
                value={engToBang(insurancePercent)}
                variant="outlined"
                size="small"
              ></TextField>
            </Grid>
          </>
        ) : (
          ''
        )}
        <Grid
          item
          md={4}
          xs={12}
          sx={{
            '& .MuiToggleButton-root': {
              boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              transition: '0.3s ease',
              backgroundColor: '#E8F9FD',
              color: 'green',
              borderRadius: '10px',
              border: 'none',
              '&:hover': {
                backgroundColor: '#CDF0EA',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
              },
            },
            '& .MuiToggleButton-root.Mui-selected': {
              color: 'green',
              backgroundColor: '#E7FBBE',
            },
          }}
        >
          <ToggleButton
            value="check"
            fullWidth
            selected={chequeDisbursementFlag}
            onChange={handleChequeDisbursementToggle}
            sx={{
              height: '40px',
              boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
              border: 'none',
            }}
          >
            {chequeDisbursementFlag ? (
              <>
                <CheckCircleIcon /> <h3> হ্যাঁ চেক বিতরণ এলাউড</h3>
              </>
            ) : (
              <>
                <HelpIcon />
                <h3>চেক বিতরণ এলাউড?</h3>
              </>
            )}
          </ToggleButton>
        </Grid>

        <Grid
          item
          md={4}
          xs={12}
          sx={{
            '& .MuiToggleButton-root': {
              boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
              transition: '0.3s ease',
              backgroundColor: '#E8F9FD',
              color: 'green',
              borderRadius: '10px',
              border: 'none',
              '&:hover': {
                backgroundColor: '#CDF0EA',
                boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;',
              },
            },
            '& .MuiToggleButton-root.Mui-selected': {
              color: 'green',
              backgroundColor: '#E7FBBE',
            },
          }}
        >
          <ToggleButton
            value="check"
            fullWidth
            selected={isAdvPayBenefit}
            onChange={handleIsAdvPaymentToggle}
            sx={{
              height: '40px',
              boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
              border: 'none',
            }}
          >
            {isAdvPayBenefit ? (
              <>
                <CheckCircleIcon /> <h3> হ্যাঁ অগ্রিম পেমেন্ট প্রযোজ্য</h3>
              </>
            ) : (
              <>
                <HelpIcon />
                <h3>অগ্রিম পেমেন্ট প্রযোজ্য?</h3>
              </>
            )}
          </ToggleButton>
        </Grid>

        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label={star('আদায়ের ক্রমানুসার মূলধন')}
            id="d1"
            name="realizationSeqPrincipal"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={realizationSeqPrincipal}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>

            {earningVal.map((option, idx) => {
              return filteredValue(option, idx, 'd1');
            })}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="d2"
            label={star('আদায়ের ক্রমানুসার সার্ভিস চার্জ')}
            name="realizationSeqService"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={realizationSeqService}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {earningVal.map((option, idx) => {
              return filteredValue(option, idx, 'd2');
            })}
          </TextField>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            id="d3"
            label={star('আদায়ের ক্রমানুসার বিলম্বিত চার্জ')}
            name="realizationSeqOd"
            disabled=""
            select
            SelectProps={{ native: true }}
            value={realizationSeqOd}
            onChange={handleProductMaster}
            variant="outlined"
            size="small"
          >
            <option value="নির্বাচন করুন">- নির্বাচন করুন -</option>
            {earningVal.map((option, idx) => {
              return filteredValue(option, idx, 'd3');
            })}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateProductMaster;
