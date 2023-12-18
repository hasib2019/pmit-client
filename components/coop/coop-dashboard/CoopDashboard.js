import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Button, Grid, Tooltip } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import Image from 'next/image';
import DisburseIcon from 'public/dashboard/icons/DisburseIcon.png';
import LoanCountIcon from 'public/dashboard/icons/LoanCountIcon.png';
import PrincipalDueIcon from 'public/dashboard/icons/PrincipalDueIcon.png';
import PrincipalOverdueIcon from 'public/dashboard/icons/PrincipalOverdueIcon.png';
import PrincipalRepayIcon from 'public/dashboard/icons/PrincipalRepayIcon.png';
import RegisteredIcon from 'public/dashboard/icons/RegisteredIcon.png';
import ServiceChargeDueIcon from 'public/dashboard/icons/ServiceChargeDueIcon.png';
import cancelReg from 'public/dashboard/icons/cancelReg.png';
import pendingReg from 'public/dashboard/icons/pendingReg.png';
import registeredPayment from 'public/dashboard/icons/registeredPayment.png';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import Styles from '../../../styles/LoanDashboard.module.css';
import { getAllDoptor, getOfficeLayer, officeName } from '../../../url/ApiList';
import star from '../../mainSections/loan-management/loan-application/utils';

const dashBoardIconLebel = {
  totalNumOfReg: {
    icon: <Image src={RegisteredIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট নিবন্ধন প্রদান',
    color: '',
    bgcolor: '#E5D1FA',
    posttex: '0 টি',
  },
  totalNumberOfPendingReg: {
    icon: <Image src={pendingReg} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট অপেক্ষামান আবেদন',
    color: '',
    bgcolor: '#C9EEFF',
    posttex: '0 টি',
  },
  totalNumOfCancelReg: {
    icon: <Image src={cancelReg} alt="Picture of the author" width={40} height={40} />,
    lebel: 'নিবন্ধন বাতিল',
    color: '',
    bgcolor: '#F9C49A',
    posttex: '0 টি',
  },
  registeredPayment: {
    icon: <Image src={registeredPayment} alt="Picture of the author" width={40} height={40} />,
    lebel: 'নিবন্ধন ফি জমা',
    color: '',
    bgcolor: '#F5EFEF',
    posttex: '0 টাকা',
  },
  totalNumberOfLoan: {
    icon: <Image src={LoanCountIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট প্রাথমিক সমিতি',
    color: '',
    bgcolor: '#FFEBB4',
    posttex: '0 টি',
  },
  totalLoanDisbursment: {
    icon: <Image src={DisburseIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট কেন্দ্রিয় সমিতি',
    color: '',
    bgcolor: '#FFBFA9',
    posttex: '0 টি',
  },
  totalPrincipalRepayment: {
    icon: <Image src={PrincipalRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট জাতিয় সমিতি',
    color: '',
    bgcolor: '#FFE15D',
    posttex: '0 টি',
  },
  totalPrincipalDue: {
    icon: <Image src={PrincipalDueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট নিরীক্ষা বরাদ্দকরন(২০২২-২৩)',
    color: '',
    bgcolor: '#FBFFB1',
    posttex: '0 টি',
  },
  totalPrincipalOverdue: {
    icon: <Image src={PrincipalOverdueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'নিরীক্ষা রিপোর্ট সম্পন্ন',
    color: '',
    bgcolor: '#90d1a2',
    posttex: '0 টি',
  },
  tlServiceChargeRepayment: {
    icon: <Image src={PrincipalRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'নিরীক্ষা রিপোর্ট পর্যবেক্ষন',
    color: '',
    bgcolor: '#57755f',
    posttex: '0 টি',
  },
  tlServiceChargeDue: {
    icon: <Image src={PrincipalOverdueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট নিরীক্ষা ফি জমা',
    color: '',
    bgcolor: '#9be0cf',
    posttex: '0 টাকা',
  },
  ttalServiceChargeDue: {
    icon: <Image src={ServiceChargeDueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট সিডিএফ ফি জমা',
    color: '',
    bgcolor: '#012e23',
    posttex: '0 টাকা',
  },
  totalServiceCh: {
    icon: <Image src={PrincipalOverdueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট সদস্য',
    color: '',
    bgcolor: '#7ca2de',
    posttex: '0 জন',
  },
  totalServiceCharg: {
    icon: <Image src={PrincipalRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট পুরুষ সদস্য',
    color: '',
    bgcolor: '#53eda1',
    posttex: '0 জন',
  },
  totalServiceCharge: {
    icon: <Image src={LoanCountIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট মহিলা সদস্য',
    color: '',
    bgcolor: '#063f9c',
    posttex: '0 জন',
  },
  totalServiceChargeD: {
    icon: <Image src={cancelReg} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট কর্মচারি/কর্মকর্তা',
    color: '',
    bgcolor: '#57eda1',
    posttex: '0 জন',
  },
  totalServiceChargeDu: {
    icon: <Image src={RegisteredIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট সঞ্চয় জমা',
    color: '',
    bgcolor: '#a77fdb',
    posttex: '0 টাকা',
  },
  totalServicgeDue: {
    icon: <Image src={RegisteredIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট শেয়ার জমা',
    color: '',
    bgcolor: '#460699',
    posttex: '0 টাকা',
  },
  toterviceChargeDue: {
    icon: <Image src={LoanCountIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট সম্পদ',
    color: '',
    bgcolor: '#db1ad8',
    posttex: '0 টাকা',
  },
  totalServiceChDue: {
    icon: <Image src={PrincipalRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট দায়',
    color: '',
    bgcolor: '#c9adc9',
    posttex: '0 টাকা',
  },
  totalServiceCharue: {
    icon: <Image src={RegisteredIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট আয়',
    color: '',
    bgcolor: '#adbf36',
    posttex: '0 টাকা',
  },
  totalServChargeDue: {
    icon: <Image src={cancelReg} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট ব্যয়',
    color: '',
    bgcolor: '#9bde54',
    posttex: '0 টাকা',
  },
  totalServiceargeDue: {
    icon: <Image src={PrincipalRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'মোট লাভ/ক্ষতি',
    color: '',
    bgcolor: '#9AE66E',
    posttex: '0 টাকা',
  },
};

const CoopDashboard = () => {
  // const [loanDashboardData, setLoanDashboardData] = useState('');
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  // const [projectList, setProjectList] = useState([]);

  const [parameterList, setParameterList] = useState({
    doptorId: '',
    layerId: '',
    officeId: '',
    projectId: '',
  });
  const componentName = localStorageData('componentName');

  // const onSubmitData = (e) => {
  //   getLoanDashboardData(e, true);
  // };
  // let accessToken; //
  // if (typeof window !== 'undefined') {
  //   accessToken = localStorage.getItem('accessToken');
  // }

  const config = localStorageData('config');
  useEffect(() => {
    // getLoanDashboardData();
    getDoptorList();
    // getProjectList();
  }, []);

  // const getLoanDashboardData = async (e, cascadingValue) => {
  //   let loanDashboardList;
  //   try {
  //     if (cascadingValue) {
  //       loanDashboardList = await axios.get(
  //         loanDashboard +
  //         '?doptorId=' +
  //         parameterList.doptorId +
  //         '&officeId=' +
  //         parameterList.officeId +
  //         '&projectId=' +
  //         parameterList.projectId,
  //         config,
  //       );
  //     } else {
  //       loanDashboardList = await axios.get(loanDashboard, config);
  //     }

  //     setLoanDashboardData(loanDashboardList?.data?.data[0]);
  //   } catch (error) {
  //     errorHandler(error);
  //   }
  // };
  //API Calling
  const getDoptorList = async () => {
    try {
      const doptorInfo = await axios.get(getAllDoptor + '/' + componentName, config);
      const doptorInfoData = doptorInfo.data.data;
      setDoptorList(doptorInfoData);
    } catch (error) {
      errorHandler(error);
    }
  };
  const getLayerList = async (doptorId) => {
    try {
      const layerInfo = await axios.get(getOfficeLayer + '?doptorId=' + doptorId, config);
      const layerInfoData = layerInfo.data.data;
      setLayerList(layerInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };
  const getOfficeList = async (layerId) => {
    try {
      const officeInfo = await axios.get(officeName + '?layerId=' + layerId, config);
      const officeInfoData = officeInfo.data.data;
      setOfficeList(officeInfoData);
    } catch (err) {
      errorHandler(err);
    }
  };
  // const getProjectList = async () => {
  //   try {
  //     const projectInfo = await axios.get(loanProject, config);
  //     const projectInfoData = projectInfo.data.data;
  //     setProjectList(projectInfoData);
  //   } catch (err) { }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == 'doptorId') {
      getLayerList(value);
    } else if (name == 'layerId') {
      getOfficeList(value);
    }

    setParameterList({
      ...parameterList,

      [name]: value,
    });
  };
  // End API Calling
  return (
    <>
      <div className={Styles.dashBoardContainer}>
        <div className={Styles.cardContainer}>
          {Object.keys(dashBoardIconLebel).map((key, i) => (
            <div key={i} className={Styles.dashboardCard}>
              <div
                className={Styles.coopCardImage}
                style={{
                  color: dashBoardIconLebel[key]['color'],
                  background: dashBoardIconLebel[key]['bgcolor'],
                }}
              >
                {dashBoardIconLebel[key]['icon']}
              </div>
              <div className={Styles.cardContent}>
                <p className={Styles.lebel}>{dashBoardIconLebel[key]['lebel']}</p>
                <p className={Styles.data}>{dashBoardIconLebel[key]['posttex']}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={Styles.filterContainer}>
          <FormControl fullWidth sx={{ background: 'white' }} size="small">
            <InputLabel id="doptor-list-label">{star('দপ্তরের তালিকা')}</InputLabel>
            <Select value={parameterList.doptorId} name="doptorId" label="দপ্তরের তালিকা" onChange={handleChange}>
              {/* <option value="নির্বাচন করুন">- নির্বাচন করুন -</option> */}
              {doptorList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {' '}
                  {option.nameBn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ background: 'white' }} size="small">
            <InputLabel id="layer-list-label">{star('লেয়ারের তালিকা')}</InputLabel>
            <Select value={parameterList.layerId} name="layerId" label="লেয়ারের তালিকা" onChange={handleChange}>
              {layerList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.nameBn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ background: 'white' }} size="small">
            <InputLabel id="office-list-label">{star('অফিসের তালিকা')}</InputLabel>
            <Select name="officeId" value={parameterList.officeId} label="অফিসের তালিকা" onChange={handleChange}>
              {officeList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {' '}
                  {option.nameBn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container className="btn-container">
            <Tooltip title="সংরক্ষণ করুন">
              <Button
                variant="contained"
                className="btn btn-save"
                // onClick={onSubmitData}
                disabled={
                  parameterList.doptorId && parameterList.officeId && parameterList.layerId && parameterList.projectId
                    ? false
                    : true
                }
              >
                <AutoStoriesIcon />
                &nbsp;&nbsp;প্রদর্শন করুন
              </Button>
            </Tooltip>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default CoopDashboard;
