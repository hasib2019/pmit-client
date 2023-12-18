import { useEffect, useState } from 'react';
import Styles from '../../../styles/LoanDashboard.module.css';
import { getAllDoptor, getOfficeLayer, loanDashboard, loanProject, officeName } from '../../../url/ApiList';

import { Button, Grid, Tooltip } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import DepositIcon from 'public/dashboard/icons/DepositIcon.png';
import DpsIcon from 'public/dashboard/icons/DpsIcon.png';
import FdrIcon from 'public/dashboard/icons/FdrIcon.png';
import MemberIcon from 'public/dashboard/icons/MemberIcon.png';
import SamityIcon from 'public/dashboard/icons/SamityIcon.png';
// import WithdrawIcon from "public/dashboard/icons/WithdrawIcon.png";
// import ShareIcon from "public/dashboard/icons/ShareIcon.png";
// import ShareWithdrawIcon from "public/dashboard/icons/ShareWithdrawIcon.png";
import ApplicationIcon from 'public/dashboard/icons/ApplicationIcon.png';
// import PendingIcon from "public/dashboard/icons/PendingIcon.png";
// import ApprovedIcon from "public/dashboard/icons/ApprovedIcon.png";
// import RejectIcon from "public/dashboard/icons/RejectIcon.png";
// import CorrectionIcon from "public/dashboard/icons/CorrectionIcon.png";
import DisburseIcon from 'public/dashboard/icons/DisburseIcon.png';
import LoanCountIcon from 'public/dashboard/icons/LoanCountIcon.png';
// import RepaymentIcon from "public/dashboard/icons/RepaymentIcon.png";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PrincipalDueIcon from 'public/dashboard/icons/PrincipalDueIcon.png';
import PrincipalOverdueIcon from 'public/dashboard/icons/PrincipalOverdueIcon.png';
import PrincipalRepayIcon from 'public/dashboard/icons/PrincipalRepayIcon.png';
import ServiceChargeDueIcon from 'public/dashboard/icons/ServiceChargeDueIcon.png';
import ServiceChargeRepayIcon from 'public/dashboard/icons/ServiceChargeRepayIcon.png';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import star from '../../mainSections/loan-management/loan-application/utils';
import { engToBang } from '../../mainSections/samity-managment/member-registration/validator';

const dashBoardIconLebel = {
  totalNumberOfApplication: {
    icon: <Image src={ApplicationIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট আবেদনের সংখ্যা',
    color: '',
    bgcolor: '#B5F1CC',
    posttex: 'টি',
  },
  // numberOfPendingApplication: {
  //   icon: (
  //     <Image
  //       src={PendingIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "অপেক্ষমান আবেদনের সংখ্যা",
  //   color: "",
  //   bgcolor:"#B5FE83",
  //   posttex: "টি",
  // },
  // numberOfApprovedApplication: {
  //   icon: (
  //     <Image
  //       src={ApprovedIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "অনুমোদিত আবেদনের সংখ্যা",
  //   color: "",
  //   bgcolor:"#FFD271",
  //   posttex: "টি",
  // },
  // numberOfRejectApplication: {
  //   icon: (
  //     <Image
  //       src={RejectIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "বাতিলকৃত আবেদনের সংখ্যা",
  //   color: "",
  //   bgcolor:"#FFD8A9",
  //   posttex: "টি",
  // },
  // numberOfCorrectionApplication: {
  //   icon: (
  //     <Image
  //       src={CorrectionIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "সংশোধনের জন্য প্রেরিত আবেদনের সংখ্যা",
  //   color: "",
  //   bgcolor:"#CCFFBD",
  //   posttex: "টি",
  // },
  totalNumberOfSamity: {
    icon: <Image src={SamityIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট সমিতির সংখ্যা',
    color: '',
    bgcolor: '#E5D1FA',
    posttex: 'টি',
  },
  totalNumberOfMember: {
    icon: <Image src={MemberIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট সুবিধাভোগীর সংখ্যা',
    color: '',
    bgcolor: '#C9EEFF',
    posttex: 'জন',
  },
  totalMemberDeposit: {
    icon: <Image src={DepositIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট সঞ্চয়',
    color: '',
    bgcolor: '#C0FFB3',
    posttex: 'টাকা',
  },
  // totalMemberWithdrawal: {
  //   icon: (
  //     <Image
  //       src={WithdrawIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "সর্বমোট সঞ্চয় উত্তোলন",
  //   color: "",
  //   bgcolor:"#FFC1F3",
  //   posttex: "টাকা",
  // },
  // totalMemberShareDeposit: {
  //   icon: (
  //     <Image
  //       src={ShareIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "সর্বমোট শেয়ার সঞ্চয়",
  //   color: "",
  //   bgcolor:"#F2E1C1",
  //   posttex: "টাকা",
  // },
  // totalMemberShareWithdrawal: {
  //   icon: (
  //     <Image
  //       src={ShareWithdrawIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "সর্বমোট শেয়ার প্রত্যাহার",
  //   color: "",
  //   bgcolor:"#72FFFF",
  //   posttex: "টাকা",
  // },
  totalMemberDps: {
    icon: <Image src={DpsIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট ডিপিএস',
    color: '',
    bgcolor: '#F9C49A',
    posttex: 'টাকা',
  },
  totalMemberFdr: {
    icon: <Image src={FdrIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট এফডিআর',
    color: '',
    bgcolor: '#F5EFEF',
    posttex: 'টাকা',
  },
  totalNumberOfLoan: {
    icon: <Image src={LoanCountIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট সক্রিয় ঋণের সংখ্যা',
    color: '',
    bgcolor: '#FFEBB4',
    posttex: 'টি',
  },
  totalLoanDisbursment: {
    icon: <Image src={DisburseIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট ঋণ বিতরণ',
    color: '',
    bgcolor: '#FFBFA9',
    posttex: 'টাকা',
  },
  // totalLoanRepayment: {
  //   icon: (
  //     <Image
  //       src={RepaymentIcon}
  //       alt="Picture of the author"
  //       width={40}
  //       height={40}
  //     />
  //   ),
  //   lebel: "সর্বমোট কিস্তি আদায়",
  //   color: "",
  //   bgcolor:"#E3DFFD",
  //   posttex: "টাকা",
  // },
  totalPrincipalRepayment: {
    icon: <Image src={PrincipalRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট আদায়কৃত আসল',
    color: '',
    bgcolor: '#FFE15D',
    posttex: 'টাকা',
  },
  totalPrincipalDue: {
    icon: <Image src={PrincipalDueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট আদায়যোগ্য আসল',
    color: '',
    bgcolor: '#FBFFB1',
    posttex: 'টাকা',
  },
  totalPrincipalOverdue: {
    icon: <Image src={PrincipalOverdueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট অনাদায়ী আসল',
    color: '',
    bgcolor: '#dfed53',
    posttex: 'টাকা',
  },
  totalServiceChargeRepayment: {
    icon: <Image src={ServiceChargeRepayIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট আদায়কৃত সার্ভিস চার্জ',
    color: '',
    bgcolor: '#9AE66E',
    posttex: 'টাকা',
  },
  totalServiceChargeDue: {
    icon: <Image src={ServiceChargeDueIcon} alt="Picture of the author" width={40} height={40} />,
    lebel: 'সর্বমোট আদায়যোগ্য সার্ভিস চার্জ ',
    color: '',
    bgcolor: '#58eda1',
    posttex: 'টাকা',
  },
};

const LoanDashboard = () => {
  const [loanDashboardData, setLoanDashboardData] = useState('');
  const [doptorList, setDoptorList] = useState([]);
  const [layerList, setLayerList] = useState([]);
  const [officeList, setOfficeList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [parameterList, setParameterList] = useState({
    doptorId: '',
    layerId: '',
    officeId: '',
    projectId: '',
  });
  const componentName = localStorageData('componentName');

  const onSubmitData = (e) => {
    getLoanDashboardData(e, true);
  };
  // let accessToken; //
  // if (typeof window !== 'undefined') {
  //   accessToken = localStorage.getItem('accessToken');
  // }

  const config = localStorageData('config');
  useEffect(() => {
    getLoanDashboardData();
    getDoptorList();
    getProjectList();
  }, []);

  const getLoanDashboardData = async (e, cascadingValue) => {
    let loanDashboardList;
    try {
      if (cascadingValue) {
        loanDashboardList = await axios.get(
          loanDashboard +
          '?doptorId=' +
          parameterList.doptorId +
          '&officeId=' +
          parameterList.officeId +
          '&projectId=' +
          parameterList.projectId,
          config,
        );
      } else {
        loanDashboardList = await axios.get(loanDashboard, config);
      }

      setLoanDashboardData(loanDashboardList?.data?.data[0]);
    } catch (error) {
      errorHandler(error);
    }
  };
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
      errorHandler(err)
    }
  };

  const getOfficeList = async (layerId) => {
    try {
      const officeInfo = await axios.get(
        officeName + '?doptorId=' + parameterList?.doptorId + '&layerId=' + layerId,
        config,
      );
      const officeInfoData = officeInfo.data.data;
      setOfficeList(officeInfoData);
    } catch (err) {
      errorHandler(err)
    }
  };
  const getProjectList = async () => {
    try {
      const projectInfo = await axios.get(loanProject, config);
      const projectInfoData = projectInfo.data.data;
      setProjectList(projectInfoData);
    } catch (err) {
      errorHandler(err)
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == 'doptorId') {
      getLayerList(value);
      setParameterList({ ...parameterList, doptorId: value });
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
          {Object.keys(loanDashboardData).map((key, i) => (
            <div key={i} className={Styles.dashboardCard}>
              <div
                className={Styles.cardImage}
                style={{
                  color: dashBoardIconLebel[key]['color'],
                  background: dashBoardIconLebel[key]['bgcolor'],
                }}
              >
                {dashBoardIconLebel[key]['icon']}
              </div>
              <div className={Styles.cardContent}>
                <p className={Styles.lebel} style={{ color: dashBoardIconLebel[key]['color'] }}>
                  {dashBoardIconLebel[key]['lebel']}
                </p>
                <p className={Styles.data}>
                  {engToBang(loanDashboardData[key])} {dashBoardIconLebel[key]['posttex']}
                </p>
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
          <FormControl fullWidth sx={{ background: 'white' }} size="small">
            <InputLabel id="project-list-label">{star('প্রকল্পের তালিকা')}</InputLabel>
            <Select name="projectId" value={parameterList.projectId} label="প্রকল্পের তালিকা" onChange={handleChange}>
              {projectList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {' '}
                  {option.projectNameBangla}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container className="btn-container">
            <Tooltip title="সংরক্ষণ করুন">
              <Button
                variant="contained"
                className="btn btn-save"
                onClick={onSubmitData}
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

export default LoanDashboard;
