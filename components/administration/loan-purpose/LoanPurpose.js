import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { Box, FormControl, MenuItem, Select, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Loader from 'components/Loader';
import star from 'components/mainSections/loan-management/loan-application/utils';
import SubHeading from 'components/shared/others/SubHeading';
import { liveIp } from 'config/IpAddress';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import axios from 'service/AxiosInstance';
import engToBdNum from 'service/englishToBanglaDigit';
import { errorHandler } from 'service/errorHandler';

const LoanPurpose = () => {
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);

  //initialize for create
  const [createFormData, setCreateFormData] = useState({
    categoryName: ' ',
    categoryDesc: ' ',
    nameerrorColor: false,
    descerrorColor: false,
    subCategories: [
      {
        subCategoryName: '',
        subCategoryDesc: '',
        nameerrorColor: false,
        descerrorColor: false,
      },
    ],
  });
  const [createModal, setCreateModal] = useState(false);

  //initialize for update
  const [singleCat, setSingleCat] = useState({});
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([{}]);
  const [subcatLength, setSubcatLength] = useState(0);

  //create functionality
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handlCreateModal = () => {
    setCreateModal(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCreateModal(false);
    setCreateFormData({
      categoryName: ' ',
      categoryDesc: ' ',
      nameerrorColor: false,
      descerrorColor: false,
      subCategories: [
        {
          subCategoryName: '',
          subCategoryDesc: '',
          nameerrorColor: false,
          descerrorColor: false,
        },
      ],
    });
  };

  const handleChange = (e) => {
    let temp = { ...createFormData };
    if (e.target.name == 'categoryName') {
      if (e.target.value.length < 1) {
        temp = { ...temp, nameerrorColor: true };
      } else {
        temp = { ...temp, nameerrorColor: false };
      }
    }

    if (e.target.name == 'categoryDesc') {
      if (e.target.value.length < 1) {
        temp = { ...temp, descerrorColor: true };
      } else {
        temp = { ...temp, descerrorColor: false };
      }
    }

    temp = { ...temp, [e.target.name]: e.target.value };
    setCreateFormData(temp);
  };

  const addCreateCategory = () => {
    let temp = {
      ...createFormData,
      subCategories: [
        ...createFormData.subCategories,
        {
          subCategoryName: '',
          subCategoryDesc: '',
          nameerrorColor: false,
          descerrorColor: false,
          isActive: true,
        },
      ],
    };
    setCreateFormData(temp);
  };

  const handlesubcategoryarr = (e, index) => {
    const { name, value } = e.target;
    let temp = { ...createFormData };
    temp = {
      ...temp,
      subCategories: [
        ...temp.subCategories.map((item, i) => {
          if (i == index) {
            let temp1;
            if (value == '') {
              if (name == 'subCategoryName') {
                temp1 = { ...item, [name]: value, nameerrorColor: true };
                return temp1;
              }

              if (name == 'subCategoryDesc') {
                temp1 = { ...item, [name]: value, descerrorColor: true };
                return temp1;
              }
            } else {
              if (name == 'subCategoryName') {
                temp1 = { ...item, [name]: value, nameerrorColor: false };
                return temp1;
              }

              if (name == 'subCategoryDesc') {
                temp1 = { ...item, [name]: value, descerrorColor: false };
                return temp1;
              }
            }
          } else {
            return item;
          }
        }),
      ],
    };
    setCreateFormData(temp);
  };

  const removeSubcategory = (index) => {
    let temp = { ...createFormData };

    temp = {
      ...temp,
      subCategories: [...temp.subCategories.filter((item, i) => i != index)],
    };

    setCreateFormData(temp);
  };

  const submitCreateData = () => {
    let temp = { ...createFormData };
    let catNameErrorflag = false;
    let catDescErrorflag = false;
    let subCatErrorflag = false;

    if (temp.categoryName == ' ') {
      catNameErrorflag = true;
      temp = { ...temp, nameerrorColor: true };
    }
    if (temp.categoryDesc == ' ') {
      catDescErrorflag = true;
      temp = { ...temp, descerrorColor: true };
    }
    if (temp.subCategories.length > 0) {
      temp = {
        ...temp,
        subCategories: [
          ...temp.subCategories.map((item) => {
            let subcattemp = { ...item };
            if (item?.subCategoryName == '') {
              subcattemp = { ...subcattemp, nameerrorColor: true };
              subCatErrorflag = true;
            }
            if (item?.subCategoryDesc == '') {
              subcattemp = { ...subcattemp, descerrorColor: true };
              subCatErrorflag = true;
            }

            if (subCatErrorflag == true) {
              return subcattemp;
            } else {
              return item;
            }
          }),
        ],
      };
    }

    setCreateFormData(temp);

    if (catNameErrorflag == true) {
      NotificationManager.error('Error message', 'ক্যাটাগরির নাম লিখুন', 5000);
    } else if (catDescErrorflag == true) {
      NotificationManager.error('Error message', 'ক্যাটাগরির বিবরন লিখুন', 5000);
    } else if (temp.subCategories.length == 0) {
      NotificationManager.error('', 'সাব ক্যাটাগরি সংযুক্ত করুন', 5000);
    } else if (subCatErrorflag == true) {
      NotificationManager.error('Error message', 'সাব ক্যটাগরির নাম/বিবরন লিখুন', 5000);
    } else {
      let submitdata = { ...createFormData };
      delete submitdata.descerrorColor;
      delete submitdata.nameerrorColor;
      submitdata = {
        ...submitdata,
        subCategories: [
          ...submitdata.subCategories.map((item) => ({
            subCategoryName: item.subCategoryName,
            subCategoryDesc: item.subCategoryDesc,
            isActive: true,
          })),
        ],
      };
      axios
        .post(`${liveIp}loan-purpose/create-category`, submitdata)
        .then(() => {
          setToggle(!toggle);
          NotificationManager.success('Success message', 'ডাটা সংযুক্ত হয়েছে', 5000);

          setCreateFormData({
            categoryName: ' ',
            categoryDesc: ' ',
            nameerrorColor: false,
            descerrorColor: false,
            subCategories: [
              {
                subCategoryName: '',
                subCategoryDesc: '',
                nameerrorColor: false,
                descerrorColor: false,
              },
            ],
          });

          setCreateModal(false);
        })
        .catch((err) => errorHandler(err));
    }
  };

  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      editable: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'categoryName',
      headerName: 'শ্রেণীর নাম',
      editable: true,
      width: 260,
    },
    {
      field: 'categoryDesc',
      headerName: 'শ্রেণীর বিবরণ',
      width: 300,
    },
    {
      field: 'isActive',
      headerName: 'অবস্থা',
    },
    {
      field: 'action',
      headerName: 'অ্যাকশান',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 300,
      align: 'center',
      headerAlign: 'center',
      type: 'actions',
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="table-icon edit"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                handleEdit(params.row.id);
                handleOpenModal();
              }}
            />
            <DeleteIcon className="table-icon delete" sx={{ cursor: 'pointer' }} />
          </>
        );
      },
    },
  ];

  //update functionality
  const handleUpdateModal = () => {
    setOpen(!open);
  };

  const handleEdit = (id) => {
    let temp = {
      ...tableData[id - 1],
      subCategories: [
        ...tableData[id - 1].subCategories.map((item) => {
          let temp1 = { ...item, subnameError: false, subdescError: false };
          return temp1;
        }),
      ],
    };
    setSubcatLength(temp.subCategories.length);
    setSingleCat(temp);
  };

  const handleUpdateCatChange = (e) => {
    let temp = { ...singleCat };
    if (e.target.name == 'categoryName') {
      if (e.target.value.length < 1) {
        temp = { ...temp, nameerrorColor: true };
      } else {
        temp = { ...temp, nameerrorColor: false };
      }
    }

    if (e.target.name == 'categoryDesc') {
      if (e.target.value.length < 1) {
        temp = { ...temp, descerrorColor: true };
      } else {
        temp = { ...temp, descerrorColor: false };
      }
    }

    temp = { ...temp, [e.target.name]: e.target.value };
    setSingleCat(temp);
  };

  const removeUpdateSubcategory = (index) => {
    let temp = { ...singleCat };
    if (index > subcatLength - 1) {
      temp = {
        ...temp,
        subCategories: [...temp.subCategories.filter((item, i) => i != index)],
      };
      setSingleCat(temp);
    } else {
      NotificationManager.warning('', 'মুছে ফেলা সম্ভব না', 2000);
    }
  };

  const addUpdateCategory = () => {
    let temp = {
      ...singleCat,
      subCategories: [
        ...singleCat.subCategories,
        {
          subCategoryName: '',
          subCategoryDesc: '',
          subnameError: false,
          subdescError: false,
          isActive: true,
        },
      ],
    };

    setSingleCat(temp);
  };

  const handleUpdateChange = (e, id) => {
    const { name, value } = e.target;
    let temp = {
      ...singleCat,
      subCategories: [
        ...singleCat.subCategories.map((item, index) => {
          if (id == index) {
            let temp1;

            if (value == '') {
              if (name == 'subCategoryName') {
                temp1 = { ...item, [name]: value, subnameError: true };
                return temp1;
              }

              if (name == 'subCategoryDesc') {
                temp1 = { ...item, [name]: value, subdescError: true };
                return temp1;
              }

              if (name == 'isActive') {
                temp1 = { ...item, [name]: value };
                return temp1;
              }
            } else {
              if (name == 'subCategoryName') {
                temp1 = { ...item, [name]: value, subnameError: false };
                return temp1;
              }

              if (name == 'subCategoryDesc') {
                temp1 = { ...item, [name]: value, subdescError: false };
                return temp1;
              }

              if (name == 'isActive') {
                temp1 = { ...item, [name]: value };
                return temp1;
              }
            }
          } else {
            return item;
          }
        }),
      ],
    };

    setSingleCat(temp);
  };

  const submitUpdateData = () => {
    let temp = { ...singleCat };
    let catNameErrorflag = false;
    let catDescErrorflag = false;
    let subCatErrorflag = false;
    let uniqueError = false;

    if (temp.categoryName == '') {
      catNameErrorflag = true;
      temp = { ...temp, nameerrorColor: true };
    }
    if (temp.categoryDesc == '') {
      catDescErrorflag = true;
      temp = { ...temp, descerrorColor: true };
    }
    if (temp.subCategories.length > 0) {
      temp = {
        ...temp,
        subCategories: [
          ...temp.subCategories.map((item) => {
            let subcattemp = { ...item };
            if (item?.subCategoryName == '') {
              subcattemp = { ...subcattemp, subnameError: 'red' };
              subCatErrorflag = true;
            }
            if (item?.subCategoryDesc == '') {
              subcattemp = { ...subcattemp, subdescError: 'red' };
              subCatErrorflag = true;
            }

            if (subCatErrorflag == true) {
              return subcattemp;
            } else {
              return item;
            }
          }),
        ],
      };
    }

    setSingleCat(temp);

    if (catNameErrorflag == true) {
      NotificationManager.error('', 'ক্যাটাগরির নাম লিখুন', 2000);
    } else if (catDescErrorflag == true) {
      NotificationManager.error('', 'ক্যাটাগরির বিবরন লিখুন', 2000);
    } else if (temp.subCategories.length == 0) {
      NotificationManager.error('', 'সাব ক্যাটাগরি সংযুক্ত করুন', 2000);
    } else if (subCatErrorflag == true) {
      NotificationManager.error('', 'সাব ক্যটাগরির নাম/বিবরন লিখুন', 2000);
    } else if (uniqueError == true) {
      NotificationManager.error('', 'নাম বিদ্যমান আছে', 2000);
    } else {
      let submitdata = { ...singleCat };
      delete submitdata.subnameError;
      delete submitdata.subdescError;
      delete submitdata.createdAt;
      delete submitdata.createdBy;
      delete submitdata.updatedAt;
      delete submitdata.updatedBy;
      delete submitdata.isActive;
      delete submitdata.nameerrorColor;
      delete submitdata.descerrorColor;

      submitdata = {
        ...submitdata,
        subCategories: [
          ...submitdata.subCategories.map((item) => ({
            subCategoryName: item.subCategoryName,
            subCategoryDesc: item.subCategoryDesc,
            isActive: item.isActive,
            id: item?.id ? item.id : -1,
          })),
        ],
      };
      axios
        .post(`${liveIp}loan-purpose/create-category`, submitdata)
        .then(() => {
          setToggle(!toggle);
          NotificationManager.success('Success message', 'ডাটা সংযুক্ত হয়েছে', 5000);
          setOpen(false);
          setSingleCat({});
        })
        .catch((err) => {
          errorHandler(err);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${liveIp}loan-purpose/get-category`)
      .then((res) => {
        setTableData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        errorHandler(err);
      });
  }, [toggle]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <SubHeading>
          <sapn>ঋণের উদ্দেশ্যের শ্রেণি ও উপশ্রেণীর তালিকা</sapn>
          <Button
            className="btn btn-primary"
            onClick={() => {
              handlCreateModal(true);
            }}
          >
            <AddIcon />
            শ্রেণি তৈরি
          </Button>
        </SubHeading>
        <DataGrid
          className="table-container"
          sx={{ marginTop: '2rem' }}
          autoHeight="true"
          rows={tableData}
          columns={column}
          components={{ Toolbar: GridToolbar }}
          pageSize={5}
          pageSizeOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
          localeText={{
            toolbarColumns: '',
            toolbarFilters: '',
            toolbarDensity: '',
            toolbarExport: '',
          }}
          reponsive
        />
      </Box>

      <Dialog open={open} onClose={handleUpdateModal} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3>ঋণের উদ্দেশ্য সংশোধন</h3>
          <CloseIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleUpdateModal} />
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <TextField
              size="small"
              fullWidth
              margin="dense"
              width="50%"
              val="create"
              name="categoryName"
              label={star('শ্রেণীর নাম')}
              type="text"
              variant="outlined"
              error={singleCat?.nameerrorColor}
              value={singleCat?.categoryName}
              onChange={(e) => {
                handleUpdateCatChange(e);
              }}
            />

            <TextField
              size="small"
              fullWidth
              margin="dense"
              name="categoryDesc"
              label={star('শ্রেণীর বিবরণ')}
              type="text"
              variant="outlined"
              value={singleCat?.categoryDesc}
              error={singleCat?.descerrorColor}
              onChange={handleUpdateCatChange}
            />
          </Box>

          <Button
            onClick={() => {
              addUpdateCategory();
            }}
            className="btn btn-primary"
            sx={{ mt: 2 }}
          >
            উপশ্রেণী যোগ করুন <AddIcon />
          </Button>
          <TableContainer className="table-container" sx={{ mt: 2 }}>
            <Table aria-label="simple table" className="table-input info">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell> {star('উপশ্রেণীর নাম')}</TableCell>
                  <TableCell> {star('বিবরণ')}</TableCell>
                  <TableCell>অবস্থা</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {singleCat.subCategories &&
                  singleCat?.subCategories.length > 0 &&
                  singleCat?.subCategories.map((row, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell align="center"> {engToBdNum(index + 1)} </TableCell>

                        <TableCell>
                          {' '}
                          <TextField
                            value={row.subCategoryName}
                            id={row.id}
                            size="small"
                            onChange={(e) => handleUpdateChange(e, index)}
                            error={row.subnameError}
                            name="subCategoryName"
                          />{' '}
                        </TableCell>

                        <TableCell>
                          {' '}
                          <TextField
                            value={row.subCategoryDesc}
                            id={row.id}
                            size="small"
                            onChange={(e) => handleUpdateChange(e, index)}
                            error={row.subdescError}
                            name="subCategoryDesc"
                          />{' '}
                        </TableCell>

                        <TableCell>
                          <FormControl fullWidth sx={{ maxHeight: '30px' }}>
                            <Select
                              id="demo-simple-select"
                              value={row.isActive}
                              name="isActive"
                              onChange={(e) => handleUpdateChange(e, index)}
                              className="select"
                            >
                              <MenuItem value={true}>Active</MenuItem>
                              <MenuItem value={false}>InActive</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>

                        <TableCell align="center">
                          <CancelIcon
                            sx={{ marginTop: '5px' }}
                            className="table-icon delete"
                            onClick={() => removeUpdateSubcategory(index)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>

              {singleCat.subCategories && singleCat?.subCategories.length == 0 && (
                <h3 style={{ display: 'flex', justifyContent: 'center' }}> উপশ্রেণী সংযুক্ত করা নাই</h3>
              )}
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <Tooltip title="সংরক্ষণ করুন">
            <Button className="btn btn-save" onClick={submitUpdateData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সংরক্ষণ করুন
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>

      <Dialog open={createModal} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3>ঋণের উদ্দেশ্য সংযোজন</h3>
          <CloseIcon sx={{ cursor: 'pointer', color: 'var(--color-delete)' }} onClick={handleClose} />
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', gap: '15px' }}>
            <TextField
              size="small"
              fullWidth
              margin="dense"
              width="50%"
              name="categoryName"
              label={star('শ্রেণীর নাম')}
              type="text"
              error={createFormData.nameerrorColor}
              value={createFormData.categoryName}
              variant="outlined"
              onChange={(e) => {
                handleChange(e);
              }}
            />

            <TextField
              size="small"
              fullWidth
              margin="dense"
              name="categoryDesc"
              label={star('শ্রেণীর বিবরণ')}
              type="text"
              error={createFormData.descerrorColor}
              value={createFormData.categoryDesc}
              variant="outlined"
              onChange={handleChange}
            />
          </Box>
          <Button
            onClick={() => {
              addCreateCategory();
            }}
            className="btn btn-primary"
            sx={{ mt: 2 }}
          >
            উপশ্রেণী যোগ করুন <AddIcon />
          </Button>

          <TableContainer className="table-container" sx={{ mt: 2 }}>
            <Table aria-label="simple table" className="table-input info">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ক্রমিক নং</TableCell>
                  <TableCell>{star('উপশ্রেণীর নাম')} </TableCell>
                  <TableCell> {star('বিবরণ')}</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {createFormData?.subCategories?.length > 0 &&
                  createFormData?.subCategories.map((row, index) => (
                    <TableRow key={row.i}>
                      <TableCell align="center">{engToBdNum(index + 1)}</TableCell>
                      <TableCell>
                        <TextField
                          value={row.subCategoryName}
                          fullWidth
                          id={row.id}
                          size="small"
                          type="text"
                          name="subCategoryName"
                          error={row.nameerrorColor}
                          onChange={(e) => handlesubcategoryarr(e, index)}
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={row.subCategoryDesc}
                          id={row.id}
                          fullWidth
                          size="small"
                          type="text"
                          name="subCategoryDesc"
                          error={row.descerrorColor}
                          onChange={(e) => handlesubcategoryarr(e, index)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <CancelIcon
                          className="table-icon delete"
                          sx={{ marginTop: '4px' }}
                          onClick={() => removeSubcategory(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        {createFormData?.subCategories?.length == 0 && (
          <h3
            style={{
              display: 'flex',
              justifyContent: 'center',
              color: 'red',
              marginBottom: '50px',
            }}
          >
            {' '}
            উপশ্রেণী যোগ করুন{' '}
          </h3>
        )}
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <Tooltip title="সংরক্ষণ করুন">
            <Button className="btn btn-save" onClick={submitCreateData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              সংরক্ষণ করুন
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default LoanPurpose;
