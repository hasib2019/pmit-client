import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import engToBdNum from '../../../../service/englishToBanglaDigit';
import SubHeading from '../../../shared/others/SubHeading';

// USER DETAILS COMPONENT

import Tooltip from '@mui/material/Tooltip';
import { localStorageData } from 'service/common';
import { userData } from '../../../../url/ApiList';

// const useStyles = makeStyles({
//   modalStyle: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 600,
//     height: 600,
//     backgroundColor: '#eee',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//     overflow: 'scroll',
//   },

//   cardStyle: {
//     margin: '0px 0px 10px 0px',
//   },
//   cardContentStyle: {
//     display: 'flex',
//     justifyContent: 'center',
//     flexWrap: 'wrap',
//   },
//   cardText: {
//     // margin: '0px 20px 20px 0px',
//     width: '220px',
//     marginRight: '10px',
//     marginBottom: '10px',
//   },

//   cardBtn: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
//   cardSelectText: {
//     width: '220px',
//     marginRight: '10px',
//     marginBottom: '5px',
//   },
//   cardHeader: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#fff',
//   },

//   cardPaperStyle: {
//     padding: '10px 0px',
//     display: 'flex',
//   },

//   cardNewStyle: {
//     boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
//     marginRight: '1px',
//   },

//   contentStyle: {
//     padding: '10px 20px',
//   },
//   listCardStyle: {
//     minHeight: '50px',
//   },

//   buttonGroup: {
//     display: 'flex',
//     justifyContent: 'center',
//   },
// });

const UserList = () => {
  const config = localStorageData('config');
  // const [listUser, setListUser] = useState({
  //   currentPage: '',
  //   totalPages: '',
  //   count: '',
  //   userData: [],
  // });

  //  const [searchUser, setSearchUser] = useState({
  //     username: '',
  //     designationBn: '',
  //     designationEn: '',
  //     isActive: '',
  //     approveStatus: '',
  //     officeId: '',
  //   }); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userList, setUserList] = useState([]);
  // const [open, setOpen] = useState(false);

  ///////////////Use Effect Call Start ////////////////////////

  useEffect(() => {
    getUserList();
  }, []);

  ///////////////Use Effect Call End ////////////////////////

  // const style = useStyles();

  // Redux usage Start
  // const updatedColor = useSelector((state) => state.ColorSlice.colorBucket);
  // Redux usage End

  // ////////////////////////Search Portion Start///////////////////////////

  // function clean(obj) {
  //   for (var propName in obj) {
  //     if (obj[propName] === '' || obj[propName] === null || obj[propName] === undefined) {
  //       delete obj[propName];
  //     }
  //   }
  //   return obj;
  // }

  // const handleSearchChange = (e) => {
  //   setSearchUser({ ...searchUser, [e.target.name]: e.target.value });
  // };

  // let onSearchSubmit = async (e) => {
  //   e.preventDefault();
  //   let myObj = clean(searchUser);

  //   if (Object.keys(myObj).length === 0) {
  //     NotificationManager.info('Please Provide Input for Search', 'Message', 5000);
  //     return;
  //   }

  //   try {
  //     let userSearch = await axios.get(userData + '?isPagination=false', config);
  //     'data', userSearch.data.data.data;
  //     let getUserData = userSearch.data.data;

  //     if (getUserData.data.length < 1) {
  //       NotificationManager.info('No Data Found', 'Message', 5000);
  //       setSearchUser({
  //         username: '',
  //         designationBn: '',
  //         designationEn: '',
  //         isActive: '',
  //         approveStatus: '',
  //         officeId: '',
  //       });
  //     } else {
  //       // setListUser({
  //       //   currentPage: getUserData.currentPage,
  //       //   totalPages: getUserData.totalPages,
  //       //   count: getUserData.count,
  //       //   userData: getUserData.data,
  //       // });

  //       setSearchUser({
  //         username: '',
  //         designationBn: '',
  //         designationEn: '',
  //         isActive: '',
  //         approveStatus: '',
  //         officeId: '',
  //       });
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       let message = error.response.data.message;
  //       NotificationManager.error(message, 'Error', 5000);
  //     } else if (error.request) {
  //       NotificationManager.error('Error Connecting...', 'Error', 5000);
  //     } else if (error) {
  //       NotificationManager.error(error.toString(), 'Error', 5000);
  //     }
  //   }
  // };

  // ////////////////////////Search Portion End///////////////////////////

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // /////////////////////Get User List Functions Start  //////////////////////////
  let getUserList = async () => {
    try {
      let getUser = await axios.get(userData + '?isPagination=false', config);
      'userData', getUser.data.data;
      let dataUser = getUser.data.data;
      setUserList(dataUser);
    } catch (error) {
      'Error', error.response;
      if (error.response) {
        let message = error.response.data.message;
        NotificationManager.error(message, 'Error', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', 'Error', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), 'Error', 5000);
      }
    }
  };
  // /////////////////////Get User List Functions End    /////////////////////////

  // ///////////////////////////////////Modal Start //////////////////////////////////
  // let handleModal = (id) => {
  //   // ("id", id);
  //   setOpen(true);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (e) => {
    const { value } = e.target;
    setRowsPerPage(value);
  };
  // ///////////////////////////////////Modal End //////////////////////////////////

  return (
    <>
      {/* <Grid container spacing={2.5}>
        <Grid sx={{ marginX: "auto", marginY: "auto" }} item xs={10} sm={8} md={10}>
          <Paper elevation={3} sx={{ backgroundColor: updatedColor }}>
            <p style={{ textAlign: "center", padding: "5px 0px", color: "white", fontSize: '16px' }}>অনুসন্ধান</p>
          </Paper>

          {/* Card For Search Start */}
      {/* <Paper elevation={1} className={style.cardStyle}> */}
      {/* <Card sx={{ minWidth: 275 }}>


              <CardContent className={style.cardContentStyle}>

                <TextField id="standard-basic" autoComplete="off" label="ব্যবহারকারীর নাম" name="username" value={searchUser.username} variant="outlined" fullWidth className={style.cardText} onChange={handleSearchChange} />
                <TextField id="standard-basic" autoComplete="off" label="পদবী(বাংলা)" name="designationBn" value={searchUser.designationBn} variant="outlined" fullWidth className={style.cardText} onChange={handleSearchChange} />
                <TextField id="standard-basic" autoComplete="off" label="অফিস" name="officeId" value={searchUser.officeId} variant="outlined" fullWidth className={style.cardText} onChange={handleSearchChange} />



                <FormControl variant="outlined" className={style.cardSelectText} >
                  <InputLabel >সচল</InputLabel>
                  <Select
                    value={searchUser.isActive}
                    onChange={handleSearchChange}
                    label="Active"
                    name="isActive"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>

                  </Select>
                </FormControl>



                <FormControl variant="outlined" className={style.cardSelectText} >
                  <InputLabel>অনুমোদনের অবস্থা</InputLabel>
                  <Select
                    value={searchUser.approveStatus}
                    onChange={handleSearchChange}
                    label="Approve Status"
                    name="approveStatus"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="A">Approve</MenuItem>
                    <MenuItem value="P">Pending</MenuItem>
                    <MenuItem value="R">Reject</MenuItem>
                  </Select>
                </FormControl>
              </CardContent> */}
      {/* <CardActions className={style.cardBtn}>
                <Button sx={{ backgroundColor: updatedColor, color: '#fff' }} startIcon={<SearchIcon />} variant="contained" size="small" onClick={onSearchSubmit}>অনুসন্ধান</Button>
              </CardActions>
            </Card>

          </Paper>

          {/* Card For Search End */}

      {/* <Paper sx={{ backgroundColor: "#D8EBE4" }}>
            <p className="" style={{ color: updatedColor, fontSize: '16px', display: "flex", alignItems: "center", justifyContent: "center" }}><ArticleIcon sx={{ marginRight: "10px", fontSize: "40px" }} /> ব্যাবহারকারীর তালিকা    </p>
          </Paper> */}

      {/* </Grid>
      </Grid> */}

      <Grid>
        <SubHeading>ব্যবহারকারীর তালিকা</SubHeading>
        <TableContainer className="table-container lg-table">
          <Table aria-label="customized table" size="small">
            <TableHead className="table-head">
              <TableRow>
                <TableCell width="1%">ক্রমিক</TableCell>
                <TableCell> আইডি</TableCell>
                <TableCell>নাম</TableCell>
                <TableCell>ইমেইল</TableCell>
                <TableCell width="104px">মোবাইল</TableCell>
                <TableCell>পদবী</TableCell>
                <TableCell>অফিসে</TableCell>
                <TableCell>রোলে</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList
                ? userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                  <TableRow key={i}>
                    <TableCell scope="row" align="center">
                      {engToBdNum(page * rowsPerPage + (i + 1))}
                    </TableCell>
                    <TableCell scope="row">{item.username}</TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{item.name}</div>} arrow>
                        <div className="data">{item.name}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{item.email}</div>} arrow>
                        <div className="data">{item.email}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row">{item.mobile}</TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{item.designationNameBn}</div>} arrow>
                        <div className="data">{item.designationNameBn}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{item.officeNameBn}</div>} arrow>
                        <div className="data">{item.officeNameBn}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell scope="row">
                      <Tooltip title={<div className="tooltip-title">{item.roleName}</div>} arrow>
                        <div className="data">{item.roleName}</div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
                : ''}
            </TableBody>
          </Table>
          <TablePagination
            className="sticky-pagination"
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[2, 5, 10, 25, 50]}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </TableContainer>
      </Grid>
    </>
  );
};

export default UserList;
