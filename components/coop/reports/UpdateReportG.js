/* eslint-disable no-undef */
import { Grid, TextField } from '@mui/material';
import DisUpaOffice from 'components/utils/coop/DisUpaOffice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { errorHandler } from 'service/errorHandler';
import { samityReportGet } from '../../../url/coop/ApiList';
import { localStorageData } from 'service/common';

const UpdateReportG = (reportBunchName) => {
  const config = localStorageData('config');
  // const [openReport, setOpenReport] = useState(false);
  // const [viewReportData, setViewReportData] = useState([]);
  const [reportList] = useState([]);
  const [reportId, setReportId] = useState(0);
  // const [disPlayField, setDisplayField] = useState([]);
  // const [report, setReport] = useState();
  // const [doptor, setDoptor] = useState(null);
  // const [districtOfficeAlive, setDistrictOfficeAlive] = useState(false);
  // const [officeAlive, setOfficeAlive] = useState(false);
  // const [projectAlive, setProjectAlive] = useState(false);
  // const [doptorAlive, setDoptorAlive] = useState(false);
  // const [memberAlive, setMemberAlive] = useState(false);
  // const [samityAlive, setSamityAlive] = useState(false);
  // const [userNameAlive, setUserNameAlive] = useState(false);
  // const [startDateAlive, setStartDateAlive] = useState(false);
  // const [selectedValue, setSelectedValue] = useState([]);
  // const [serviceInfoActive, setServiceInfoActive] = useState(false);
  // const [userName, setUserName] = useState(null);
  // const [glTypeAlive, setGlTypeAlive] = useState(false);

  const takeData = () => {
    // setViewReportData(samityData);
    // setOpenReport(report);
  };

  useEffect(() => {
    getSamityReport();
  }, []);

  const getSamityReport = async () => {
    try {
      const samityReportData = await (await axios.get(samityReportGet + reportBunchName, config))?.data?.data[0];

      // setDoptor(samityReportData.doptorId);
      // setUserName(samityReportData.userName);

      let samityReportName = [];
      for (const element of samityReportData?.data) {
        let parameter = [];
        let jasparParameter = [];
        for (const e of element.parameter) {
          if (e.status == true) {
            parameter.push(e.paramName);
            jasparParameter.push(e.jasparParamName);
          }
        }

        samityReportName.push({
          id: element.id,
          reportName: element.reportFrontNameBn,
          reportFrom: element.reportFrom,
          parameter,
          jasparParameter,
          typeName: element.typeName,
          reportJasperName: element.reportBackName,
          hyperLinkAction: element.hyperLinkAction,
        });
      }

      if (samityReportName.length == 1) {
        //set report for preventing the re-rendering
        setReportId(1);
        // setReport(samityReportName[0].reportName);
        // samityReportName[0].reportFrom == 'dataBase'
        //   ? setSelectedValue({
        //     reportName: samityReportName[0].reportName,
        //     typeName: samityReportName[0].typeName,
        //     reportFrom: 'dataBase',
        //     hyperLinkAction: samityReportName[0].hyperLinkAction,
        //   })
        //   : setSelectedValue({
        //     reportName: samityReportName[0].reportName,
        //     reportFrom: 'jaspar',
        //   });

        const pera = [];

        for (const element of samityReportName) {
          if (element.id == 1) {
            for (const p of element.parameter) {
              pera.push(parameterBn[p]);
              // if (p == 'districtOffice') {
              //   setDistrictOfficeAlive(true);
              // }
              // if (p == 'office') {
              //   setOfficeAlive(true);
              // }
              // if (p == 'samity') {
              //   setSamityAlive(true);
              // }
              // if (p == 'member') {
              //   setMemberAlive(true);
              // }
              // if (p == 'doptor') {
              //   setDoptorAlive(true);
              // }
              // if (p == 'project') {
              //   setProjectAlive(true);
              // }
              // if (p == 'accountId') {
              // }

              // if (p == 'userName') {
              //   setUserNameAlive(true);
              // }
              // if (p == 'date') {
              //   setStartDateAlive(true);
              // }
              // if (p == 'glType') {
              //   setGlTypeAlive(true);
              // }
              // if (p == 'serviceInfo') {
              //   setServiceInfoActive(true);
              // }
            }
          }
        }
        // setDisplayField(pera);
        document?.getElementById('report').setAttribute('disabled', 'true');
      }

      // setReportList(samityReportName);
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleInputChangeReport = (e) => {
    const { value } = e.target;
    let pera = [];
    if (value == 0) {
      // setReport();
      setReportId();
    } else {
      setReportId(value);
      // setReport(reportList[parseInt(value) - 1].reportName);
      // reportList[parseInt(value) - 1].reportFrom == 'dataBase'
      //   ? setSelectedValue({
      //     reportName: reportList[parseInt(value) - 1].reportName,
      //     typeName: reportList[parseInt(value) - 1].typeName,
      //     reportFrom: 'dataBase',
      //     hyperLinkAction: reportList[parseInt(value) - 1].hyperLinkAction,
      //   })
      //   : setSelectedValue({
      //     reportName: reportList[parseInt(value) - 1].reportName,
      //     reportFrom: 'jaspar',
      //   });

      for (const element of reportList) {
        if (element.id == value) {
          for (const p of element.parameter) {
            pera.push(parameterBn[p]);
            // if (p == 'districtOffice') {
            //   setDistrictOfficeAlive(true);
            // }
            // if (p == 'office') {
            //   setOfficeAlive(true);
            // }
            // if (p == 'samity') {
            //   setSamityAlive(true);
            // }
            // if (p == 'member') {
            //   setMemberAlive(true);
            // }
            // if (p == 'doptor') {
            //   setDoptorAlive(true);
            // }
            // if (p == 'project') {
            //   setProjectAlive(true);
            // }
            // if (p == 'accountId') {
            // }
            // if (p == 'userName') {
            //   setUserNameAlive(true);
            // }
            // if (p == 'date') {
            //   setStartDateAlive(true);
            // }
            // if (p == 'glType') {
            //   setGlTypeAlive(true);
            // }
            // if (p == 'serviceInfo') {
            //   setServiceInfoActive(true);
            // }
          }
        }
      }
      // setDisplayField(pera);
    }
  };

  return (
    <Grid container spacing={2.5} my={1} px={2}>
      <Grid item lg={3} md={3} xs={12}>
        <TextField
          fullWidth
          label="রিপোর্ট"
          name="report"
          id="report"
          required
          select
          SelectProps={{ native: true }}
          value={reportId || 0}
          onChange={handleInputChangeReport}
          variant="outlined"
          size="small"
        >
          <option value={0}>- নির্বাচন করুন -</option>
          {reportList.map((option, i) => (
            <option key={i} value={option.id}>
              {option.reportName}
            </option>
          ))}
        </TextField>
      </Grid>
      <DisUpaOffice {...{ takeData, size: 4, getData: 'all' }} />
    </Grid>
  );
};

export default UpdateReportG;
