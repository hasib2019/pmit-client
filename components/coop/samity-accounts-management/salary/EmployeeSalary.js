import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Autocomplete, Button, Divider, Grid, TextField, Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TableComponent from '../../../../service/employee/TableComponent';
import {
  employeeInfoGetUrl,
  employeeSalaryGetByYearMonthUrl,
  employeeSalaryPostUrl,
} from '../../../../url/coop/ApiList';
import useGetSamityName from '../../../../hooks/coop/useGetSamityName';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
const EmployeeSalary = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [salaryInfo, setSalaryInfo] = useState({
    samityName: '',
    paidSalary: '',
    salaryMonthYear: '',
  });
  const { allSamity, getSamity } = useGetSamityName();
  const [formErrors, setFormErrors] = useState({
    samityName: '',
    salaryMonthYear: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getSamity();
  }, []);
  useEffect(() => {
    getEmployeeInfoBySamityId();

    // getAllDesignationData();
  }, [salaryInfo.samityName?.id]);
  const [allEmployees, setAllEmployee] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const config = localStorageData('config');

  const getEmployeeInfoBySamityId = async () => {
    try {
      if (salaryInfo.samityName.id) {
        const result = await axios.get(employeeInfoGetUrl + salaryInfo.samityName?.id, config);
        setAllEmployee(result.data.data);
        const salaryArray = [];
        result.data.data.forEach((value) => {
          salaryArray.push({
            employee_info_id: value.id,
            samity_id: value.samityId,
            salary: value.grossSalary,
          });
        });
        setSalaries(salaryArray);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const handlePaidSalary = (index, e) => {
    let array = [...salaries];

    array[index]['salary'] = e.target.value.replace(/\D/g, '');

    setSalaries(array);
  };
  const checkMandatory = () => {
    let flag = true;
    let newObj = {};
    if (salaryInfo.samityName === '') {
      flag = false;
      newObj.samityName = 'সমিতির নাম নির্বাচন করুন';
    }
    if (salaryInfo.salaryMonthYear.length !== 6) {
      flag = false;
      newObj.salaryMonthYear = 'বেতনের বছর এবং মাস প্রদান করুন';
    }
    setTimeout(() => {
      setFormErrors({ ...newObj });
    }, 1);

    return flag;
  };

  const chekIsSalaryPaidBefore = async () => {
    try {
      const salaryCheckResult = await axios.get(employeeSalaryGetByYearMonthUrl + salaryInfo.salaryMonthYear, config);

      if (salaryCheckResult.data.data) {
        setIsOpen(true);
      }
      return salaryCheckResult.data.data;
    } catch (error) {
      errorHandler(error);
    }
  };

  const onSubmitData = async () => {
    try {
      const payload = {
        salaries: salaries,
        salary_month_year: salaryInfo.salaryMonthYear,
      };
      const result = await axios.post(employeeSalaryPostUrl, payload, config);
      setSalaryInfo({ samityName: '', paidSalary: '', salaryMonthYear: '' });
      NotificationManager.success(result.data.message, '', 5000);
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message);
      }
    }
    // }
  };

  const columnNames = ['ক্রমিক নং', 'নাম', 'পদবী', 'মূল বেতন', 'মোট বেতন', 'প্রদত্ত বেতন'];

  const tableDataKeys = ['index', 'name', 'designationName', 'basicSalary', 'grossSalary', 'textfield'];

  return (
    <Grid container spacing={2.5} px={2} py={2}>
      <Grid item md={6} lg={6} xl={12} xs={12}>
        <Autocomplete
          disablePortal
          inputProps={{ style: { padding: 0, margin: 0 } }}
          name="samityId"
          onChange={(event, value) => {
            if (value) {
              setSalaryInfo({ ...salaryInfo, samityName: value });
            }
          }}
          options={allSamity.map((option) => {
            return {
              id: option.id,
              label: option.samityName,
            };
          })}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={salaryInfo.samityName === '' ? 'সমিতি নির্বাচন করুন' : 'সমিতি'}
              onFocus={() => {
                if (salaryInfo.samityName === '') {
                  setSalaryInfo({ ...salaryInfo, samityName: null });
                }
              }}
              onBlur={() => {
                if (salaryInfo.samityName === null) {
                  setSalaryInfo({ ...salaryInfo, samityName: '' });
                }
              }}
              variant="outlined"
              size="small"
              style={{ backgroundColor: '#FFF', margin: '5dp' }}
            />
          )}
          value={salaryInfo.samityName}
        />
        <span style={{ color: 'red' }}>{!salaryInfo.samityName && formErrors.samityName}</span>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <TextField
          fullWidth
          label={'বেতন প্রদানের বছর এবং মাস'}
          name="salaryMonthYear"
          value={salaryInfo.salaryMonthYear}
          type="number"
          variant="outlined"
          size="small"
          onChange={(e) => {
            setSalaryInfo({ ...salaryInfo, salaryMonthYear: e.target.value });
            if (e.target.value.toString().length !== 6) {
              setFormErrors({
                ...formErrors,
                salaryMonthYear: 'বেতন প্রদানের মাস এবং সময় ছয় সংখ্যার হতে হবে',
              });
            }
          }}
        />
        <span style={{ color: 'red' }}>{salaryInfo.salaryMonthYear.length !== 6 && formErrors.salaryMonthYear}</span>
      </Grid>
      <Divider />
      <TableComponent
        columnNames={columnNames}
        tableData={allEmployees}
        tableDataKeys={tableDataKeys}
        editFunction={handlePaidSalary}
        tableTitle="বেতন প্রদানের তথ্য"
        salaries={salaries}
        // tableShowHideCondition={salaryInfo.samityName}
      />

      <Divider />
      <Grid container className="btn-container">
        <Tooltip title={'সংরক্ষন করুন'}>
          <Button
            className="btn btn-save"
            onClick={async () => {
              const mandatory = checkMandatory();
              if (salaryInfo.salaryMonthYear) {
                const checkResult = await chekIsSalaryPaidBefore();

                if (checkResult === false) {
                  if (mandatory) {
                    onSubmitData();
                  }
                }
              }
            }}
            startIcon={<SaveOutlinedIcon />}
          >
            {' '}
            সংরক্ষন করুন
          </Button>
        </Tooltip>
      </Grid>
      <Divider />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              বেতন প্রদানের তথ্য
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              আপনি কি এই মাস এবং বছরের বেতন আবার প্রদান করতে চান?
            </Typography>

            <Grid container spacing={2.5} style={{ justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  onSubmitData();
                  setIsOpen(false);
                }}
              >
                হ্যাঁ
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                না
              </Button>
            </Grid>
          </Box>
        </Fade>
      </Modal>
      {/* )} */}
    </Grid>
  );
};
export default EmployeeSalary;
