import EditIcon from '@mui/icons-material/Edit';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { engToBang } from 'components/mainSections/samity-managment/member-registration/validator';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { dateFormat } from 'service/dateFormat';
import { loanProject } from '../../../../../url/ApiList';

import { localStorageData } from 'service/common';
const ProjectInfo = () => {
  const router = useRouter();
  const config = localStorageData('config');

  const [projectInfo, setProjectInfo] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [postsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getProjectInfo();
  }, []);
  // const [value, setValue] = useState(null);
  // const [formErrors, setFormErrors] = useState({});

  let getProjectInfo = async () => {
    try {
      let projectInfo = await axios.get(loanProject + '/projectWithPagination?page=1&limit=100', config);
      setProjectInfo(projectInfo.data.data.data);
    } catch (error) {
      if (error.response) {
        'Error Data', error.response;
      } else if (error.request) {
        NotificationManager.error('Error Connecting...');
      } else if (error) {
        NotificationManager.error(error.toString());
      }
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   switch (name) {
  //     case 'projectPhase':
  //       let expireDate = new Date(Date.parse('12/15/2023'));
  //       'Expire Date', expireDate;
  //       let sysDate = new Date();
  //       if (value == 'K') {
  //         if (sysDate < expireDate) {
  //           setFormErrors({
  //             ...formErrors,
  //             projectPhase: 'চলমান প্রকল্প কখনো কর্মসূচীতে পরিবর্তন সম্ভব না',
  //           });
  //         }
  //       } else {
  //         setFormErrors({});
  //       }
  //       break;
  //     case 'projectDuration':
  //       if (value.length == 1 && value == 0) return;
  //       setProjectInfo({
  //         ...projectInfo,
  //         [e.target.name]: e.target.value.replace(/\D/g, ''),
  //       });
  //       break;
  //     case 'estimatedExp':
  //       if (value.length == 1 && value == 0) return;
  //       setProjectInfo({
  //         ...projectInfo,
  //         [e.target.name]: e.target.value.replace(/\D/g, ''),
  //       });
  //       break;
  //   }
  //   if (formErrors[name]) {
  //     setFormErrors({
  //       ...formErrors,
  //       [name]: '',
  //     });
  //   }
  //   if (e.target.name != 'projectDuration' && e.target.name != 'estimatedExp') {
  //     setProjectInfo({
  //       ...projectInfo,
  //       [e.target.name]: e.target.value,
  //     });
  //   }
  // };
  // handle input change

  // let onSubmitData = async (e) => {
  //   e.preventDefault();
  //   let result = validate();
  //   let payload = {
  //     projectCode: projectInfo.projectCode,
  //     projectPhase: projectInfo.projectPhase,
  //     projectDirector: projectInfo.projectDirector,
  //     projectDuration: projectInfo.projectDuration,
  //     expireDate: expireDate,
  //     description: projectInfo.description,
  //     fundSource: projectInfo.fundSource,
  //     estimatedExp: Number(projectInfo.estimatedExp),
  //     samityType: projectInfo.samityType,
  //   };
  //   if (result) {
  //     try {
  //       let proejctInfoData = await axios.put(loanProject + '/8', payload, config);
  //       NotificationManager.success(proejctInfoData.data.message);
  //       setProjectInfo({
  //         projectName: '',
  //         projectNameBangla: '',
  //         projectCode: '',
  //         projectPhase: '',
  //         projectDirector: '',
  //         description: '',
  //         projectDuration: '',
  //         estimatedExp: '',
  //         fundSource: '',
  //         samityType: 'নির্বাচন করুন',
  //       });
  //       setValue(null);

  //     } catch (error) {
  //       if (error.response) {
  //         let message = error.response.data.errors[0].message;
  //         NotificationManager.error(message);
  //       } else if (error.request) {
  //         NotificationManager.error('Error Connecting...');
  //       } else if (error) {
  //         NotificationManager.error(error.toString());
  //       }
  //     }
  //   } else {
  //     for (let item in formErrors) {
  //       let message = formErrors[item];
  //       NotificationManager.error(message);
  //     }
  //   }
  // };
  const onEditPage = (id) => {
    let base64Data = JSON.stringify({
      id,
    });
    base64Data = btoa(base64Data);
    router.push({
      pathname: '/adminstration/project-setup/update-project',
      query: {
        data: base64Data,
      },
    });
  };
  // const onNextPage = () => {
  //   //
  // };

  const onRowsPerPageChange = (e) => {
    const { value } = e.target;
    setRowsPerPage(value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Grid item md={12} xs={12}>
        <TableContainer className="table-container">
          <Table size="small" aria-label="a dense table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell width="1%">ক্রমিক নং</TableCell>
                <TableCell>প্রকল্পের নাম</TableCell>
                <TableCell>প্রকল্প পরিচালকের নাম</TableCell>
                <TableCell width="1%">মেয়াদ (মাস)</TableCell>
                <TableCell width="1%">মেয়াদ উত্তীর্ণের তারিখ</TableCell>
                <TableCell width="1%">প্রাকল্লিত ব্যয় (টাকা)</TableCell>
                <TableCell width="1%">সম্পাদনা</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectInfo && projectInfo.length > 0
                ? projectInfo.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                  <TableRow key={item.id}>
                    <TableCell align="center">{engToBang(page * rowsPerPage + (i + 1))}</TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{item.projectNameBangla}</div>} arrow>
                        <span className="data">{item.projectNameBangla}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={<div className="tooltip-title">{item.projectDirector}</div>} arrow>
                        <span className="data">{item.projectDirector}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">{engToBang(item.projectDuration)}</TableCell>
                    <TableCell align="center">{engToBang(dateFormat(item.expireDate))}</TableCell>
                    <TableCell align="right">{engToBang(Math.floor(item.estimatedExp).toLocaleString())}</TableCell>
                    <TableCell align="center">
                      <Button className="btn-icon-small" onClick={() => onEditPage(item.id)}>
                        <EditIcon className="table-icon edit" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
                : ' '}
            </TableBody>
          </Table>
          <TablePagination
            className="sticky-pagination"
            component="div"
            count={projectInfo.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10, 25, 50]}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </TableContainer>
      </Grid>
    </div>
  );
};

export default ProjectInfo;
