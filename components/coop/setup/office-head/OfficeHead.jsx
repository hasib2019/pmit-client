import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Button, Grid, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { FetchWrapper } from 'helpers/fetch-wrapper';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import FromControlJSON from 'service/form/FormControlJSON';
import { childOffice, designationName, officeLayer } from '../../../../url/coop/ApiList';
import { officeHeadSelectApi } from '../../../../url/coop/BackOfficeApi';

const OfficeHead = () => {
  const config = localStorageData('config');
  const [officeLayerList, setOfficeLayerList] = useState([]);
  const [officeInfoList, setOfficeInfoList] = useState([]);
  const [empDesignationInfo, setEmpDesignationInfo] = useState([]);
  const [officeHeadData, setOfficeHeadData] = useState({
    officeOriginId: null,
    officeInfoId: null,
    officeName: null,
    designationId: null,
  });
  useEffect(() => {
    getOfficeOrigin();
    setOfficeInfoList([]);
    setEmpDesignationInfo([]);
  }, []);
  // ******************* get অফিসের ধরন *******************
  const getOfficeOrigin = async () => {
    const getData = await FetchWrapper.get(officeLayer);
    setOfficeLayerList(getData);
    if (getData.length > 0) {
      setOfficeHeadData({ ...officeHeadData, ['officeOriginId']: getData[0].id });
      officeInfo(getData[0].id);
    }
  };
  // ******************* onChange অফিসের ধরন *******************
  const officeInfo = async (layerId) => {
    const doptorId = tokenData()?.doptorId;
    if (layerId) {
      const getOfficeInfo = await FetchWrapper.get(childOffice + '?doptorId=' + doptorId + '&layerId=' + layerId);
      setOfficeInfoList(getOfficeInfo);
    } else {
      setOfficeInfoList([]);
    }
  };
  // ******************* onChange *******************
  const onChange = (e) => {
    const { name, value } = e.target;
    let findOfficeName;
    switch (name) {
      case 'officeOriginId':
        setOfficeHeadData({
          ...officeHeadData,
          [name]: parseInt(value),
        });
        officeInfo(value);
        break;
      case 'officeInfoId':
        findOfficeName = officeInfoList.find((item) => item.id == e.target.value);
        setOfficeHeadData({
          ...officeHeadData,
          [name]: parseInt(value),
          ['officeName']: findOfficeName?.nameBn,
          ['designationId']: null,
        });
        setEmpDesignationInfo([]);
        designationInfo(value);
        break;
      case 'designationId':
        setOfficeHeadData({ ...officeHeadData, [name]: parseInt(value) });
        break;
      default:
        break;
    }
  };
  // ******************* onChange *******************
  const designationInfo = async (id) => {
    if (id) {
      const getDesignationInfo = await FetchWrapper.get(designationName + id + '&status=true');
      setEmpDesignationInfo(getDesignationInfo);
    } else {
      setEmpDesignationInfo([]);
    }
  };

  // ********************* onSubmit ***************************
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        officeOriginId: officeHeadData.officeOriginId,
        officeInfoId: officeHeadData.officeInfoId,
        designationId: officeHeadData.designationId,
      };
      const officeHeadSubmit = await axios.post(officeHeadSelectApi, payload, config);
      NotificationManager.success(officeHeadSubmit.data.message, '', 5000);
      // designationInfo(officeHeadData.officeInfoId);
      setOfficeHeadData({
        officeOriginId: null,
        officeInfoId: null,
        officeName: null,
        designationId: null,
      })
      setOfficeInfoList([]);
      setEmpDesignationInfo([]);
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2.5}>
        <FromControlJSON
          arr={[
            {
              labelName: 'দপ্তরের তালিকা',
              name: 'officeOriginId',
              onChange,
              value: officeHeadData.officeOriginId,
              size: 'small',
              type: 'text',
              viewType: 'select',
              optionData: officeLayerList,
              optionValue: 'id',
              optionName: 'nameBn',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: false,
              customClass: '',
              customStyle: {},
            },
            {
              labelName: 'দপ্তর/অফিস',
              name: 'officeInfoId',
              onChange,
              value: officeHeadData.officeInfoId,
              size: 'small',
              type: 'text',
              viewType: 'select',
              optionData: officeInfoList,
              optionValue: 'id',
              optionName: 'nameBn',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: false,
              customClass: '',
              customStyle: {},
            },
            {
              labelName: 'কর্মকর্তা ও পদবী নির্বাচন করুন',
              name: 'designationId',
              onChange,
              value: officeHeadData.designationId,
              size: 'small',
              type: 'text',
              viewType: 'select',
              optionData: empDesignationInfo,
              optionValue: 'designationId',
              optionName: 'nameBn',
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
      <Grid container className="btn-container">
        <Tooltip title="সংরক্ষন করুন">
          <Button variant="contained" className="bnt btn-primary" onClick={onSubmit} startIcon={<SaveOutlinedIcon />}>
            সংরক্ষন করুন
          </Button>
        </Tooltip>
      </Grid>
      {empDesignationInfo.length > 0 && (
        <TableContainer component={Paper}>
          <SubHeading style={{ textAlign: 'center' }}>
            {officeHeadData?.officeName + ', অফিস কর্মকর্তাদের তালিকা'}
          </SubHeading>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>কর্মকর্তা নাম</TableCell>
                <TableCell align="right">পদবী</TableCell>
                <TableCell align="right">অফিস প্রধান হ্যাঁ/না</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empDesignationInfo.map((row) => (
                <TableRow
                  key={row.nameBn}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: row.isOfficeHead == 1 && 'gray',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.nameBn}
                  </TableCell>
                  <TableCell align="right">{row.designation}</TableCell>
                  <TableCell align="right">{row.isOfficeHead == 1 ? 'হ্যাঁ' : 'না'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Fragment>
  );
};

export default OfficeHead;
