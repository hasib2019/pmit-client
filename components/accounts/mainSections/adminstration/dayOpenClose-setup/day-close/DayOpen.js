/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import * as React from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Grid, Tooltip, FormHelperText } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import star from 'components/utils/coop/star';
import FromControlJSON from 'service/form/FormControlJSON';
import { fetchOfficeNames, fetchProjects } from '../../../../../../features/dropdowns/dropdownSlice';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { dayOpenApi } from '../../../../../../url/AccountsApiLIst';
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
export default function DayOpen() {
  const userOfficeName = localStorageData('officeGeoData').nameBn;

  const dispatch = useDispatch();
  const [office, setOffice] = useState('');
  const [project, setPorject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dayToOpen] = useState(new Date());
  const [formErrors, setFormErrors] = useState({
    officeError: '',
  });

  const { officeNames, projects } = useSelector((state) => state.dropdown);
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  } else {
    token = 'null';
  }
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const resetAllState = () => {
    setOffice('');
    setPorject('');
    setFormErrors({
      ...formErrors,
      officeError: '',
    });
  };
  const checkMandatory = () => {
    let flag = true;
    let errorObj = {};
    if (!office) {
      flag = false;
      errorObj.officeError = 'অফিস নির্বাচন করুন';
    }
    setTimeout(() => {
      setFormErrors(errorObj);
    }, 1);
    return flag;
  };
  const onSubmitData = async () => {
    if (checkMandatory()) {
      const payload = {
        openDate: dayToOpen,
        officeId: office,
        ...(project && { projectId: project }),
      };
      try {
        setIsLoading(true);

        const response = await axios.post(dayOpenApi, payload, config);
        setIsLoading(false);
        NotificationManager.success(response.data.message);

        resetAllState();
      } catch (error) {
        'error found', error.message;
        if (error.response) {
          'error found', error.response.data;
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
        setIsLoading(false);
      }
    }
  };
  'officesAndProjectsInDayOpen', officeNames, projects;
  useEffect(() => {
    dispatch(fetchOfficeNames());
    dispatch(fetchProjects());
  }, []);
  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item md={4} sm={12} lg={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel> {office === '' ? star('অফিস নির্বাচন করুন') : star('অফিস')}</InputLabel>
            <Select
              size="small"
              value={office}
              label={office === '' ? star('অফিস নির্বাচন করুন') : star('অফিস')}
              error={office == '' && formErrors.officeError ? true : false}
              onChange={(e) => {
                setOffice(e.target.value);
              }}
            >
              {officeNames
                .filter((office) => office.nameBn == userOfficeName)
                .map((office) => (
                  <MenuItem value={office?.id}>{office.nameBn}</MenuItem>
                ))}
            </Select>
            {office == '' && formErrors.officeError && (
              <FormHelperText sx={{ color: 'red' }}>অফিস নির্বাচন করুন</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item md={4} sm={12} lg={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel> {project === '' ? 'প্রকল্প নির্বাচন করুন' : 'প্রকল্প'}</InputLabel>
            <Select
              size="small"
              value={project}
              label={project === '' ? 'প্রকল্প নির্বাচন করুন' : 'প্রকল্প'}
              onChange={(e) => {
                setPorject(e.target.value);
              }}
            >
              {projects?.map((project) => (
                <MenuItem value={project?.id}>{project?.projectNameBangla}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <FromControlJSON
          arr={[
            {
              labelName: star('তারিখ'),
              onChange: () => {},
              value: dayToOpen,
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
  );
}
