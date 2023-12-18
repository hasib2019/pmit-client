/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 15:46:51
 * @modify date 2022-11-03 15:46:51
 * @desc [description]
 */

import { Close, Delete, Edit } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import star from 'components/utils/coop/star';
import Exceljs, { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import Joi from 'joi-browser';
import moment from 'moment';
import router from 'next/router';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { isRichValue, localStorageData, richToString, tokenData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import {
  codeMaster,
  customerLoanInfoUrl,
  loanInfoMigration,
  loanPurposeList,
  particularSamityInfoAll,
  product,
  samityMigration,
  updateApplication,
} from '../../../url/ApiList';
import withSelectOffice from '../../HOC/withSelectOffice';
import { bangToEng } from '../adminstration/product-setup/savings-product/validator';
class UploadLoan extends Component {
  state = {
    data: [],
    columns: [
      {
        headerName: '#',
        filterable: false,
        width: 50,
        renderCell: (index) => engToBang(index.api.getRowIndex(index.row.customerOldCode) + 1),
      },
      {
        headerName: 'সদস্য কোড',
        field: 'customerOldCode',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value) => {
          return bangToEng(value);
        },
      },
      {
        headerName: 'ঋণের সংখ্যা',
        field: 'noOfLoan',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            noOfLoan: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বিতরণের তারিখ',
        field: 'disbursementDate',
        width: 130,
        editable: true,
        type: 'date',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            disbursementDate: value,
          };
          this.setState({ data: data });
          return value;
        },
        valueFormatter: (params) => {
          const formatedDate = moment(params?.value).format('DD/MM/YYYY');

          return engToBang(formatedDate);
        },
      },
      {
        headerName: 'ঋণের মেয়াদ (মাস)',
        field: 'loanTermMonth',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            loanTermMonth: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'কিস্তির সংখ্যা',
        field: 'noOfInstallment',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            noOfInstallment: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'গ্রেস পিরিয়ড',
        field: 'gracePeriod',
        width: 140,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            gracePeriod: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'প্রোডাক্ট',
        field: 'productId',
        width: 180,
        editable: true,
        // type: 'singleSelect',
        cellClassName: (params) => {
          if (!params.value) {
            // this.setState({ isProductGiven: false });
            return 'warning';
          }
          return '';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="productId"
              value={this.state?.data[index]?.productId}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  productId: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.products?.map((p) => {
                return (
                  <MenuItem key={p?.id} value={p?.id}>
                    {p?.productName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="productId"
              value={this.state?.data[index]?.productId}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  productId: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.products?.map((p) => {
                return (
                  <MenuItem key={p?.id} value={p?.id}>
                    {p?.productName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        // valueOptions: () => {
        //   return this.state.products.map((f) => {
        //     return {
        //       label: f.productName,
        //       value: f.id,
        //     };
        //   });
        // },
        // valueFormatter: (params) => {
        //   if (params.value) {
        //     const data = this.state.products.find((f) => f.id == params.value);
        //     return data ? data.productName : '';
        //   }
        // },
        // valueParser: (value, params) => {
        //   const data = [...this.state.data];
        //   const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
        //   data[foundIndex] = {
        //     ...data[foundIndex],
        //     productId: value,
        //   };
        //   this.setState({ data: data });
        //   return value;
        // },
      },
      {
        headerName: 'ঋণের উদ্দেশ্য',
        field: 'purposeId',
        width: 160,
        editable: true,
        // type: 'singleSelect',
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="purposeId"
              value={this.state?.data[index]?.purposeId}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  purposeId: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.loanPurposes?.map((p) => {
                return (
                  <MenuItem key={p?.id} value={p?.id}>
                    {p?.purposeName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="purposeId"
              value={this.state?.data[index]?.purposeId}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  purposeId: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.loanPurposes?.map((p) => {
                return (
                  <MenuItem key={p?.id} value={p?.id}>
                    {p?.purposeName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        // valueOptions: () => {
        //   return this.state.loanPurposes.map((f) => {
        //     return {
        //       label: f.purposeName,
        //       value: f.id,
        //     };
        //   });
        // },
        cellClassName: (params) => {
          if (!params.value) {
            // this.setState({ isPurposeGiven: false });
            return 'warning';
          }
          return '';
        },
        // valueFormatter: (params) => {
        //   'paramsValue', params;
        //   if (params.value) {
        //     const data = this.state.loanPurposes.find((f) => f.id == params.value);

        //     return data ? data.purposeName : '';
        //   }
        // },
        // valueParser: (value, params) => {
        //   const data = [...this.state.data];
        //   const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
        //   data[foundIndex] = {
        //     ...data[foundIndex],
        //     purposeId: value,
        //   };
        //   this.setState({ data: data });
        //   return value;
        // },
      },
      {
        headerName: 'বিতরণের পরিমাণ',
        field: 'disbursementAmount',
        width: 120,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            disbursementAmount: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'মোট সার্ভিস চার্জ',
        field: 'totalServiceCharge',
        width: 120,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            totalServiceCharge: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'পরিশোধিত মূলধনের পরিমান',
        field: 'paidPrincipalAmount',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            paidPrincipalAmount: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'পরিশোধিত সার্ভিস চার্জের পরিমান',
        field: 'paidServiceChargeAmount',
        width: 80,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            paidServiceChargeAmount: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'পেনাল চার্জ',
        field: 'penalCharge',
        width: 80,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            penalCharge: bangToEng(value),
          };
          this.setState({ data: data });
          return value;
        },
      },

      {
        field: 'actions',
        type: 'actions',
        headerName: 'বাতিল',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ row }) => this.renderActionButton(row),
      },
    ],

    headerMapping: {
      'Member Code': 'customerOldCode',
      'No of Loan': 'noOfLoan',
      'Disbursement Date': 'disbursementDate',
      'Loan Term(Month)': 'loanTermMonth',
      'No of Instalment': 'noOfInstallment',
      'Grace Period': 'gracePeriod',
      'Disbursement Amount': 'disbursementAmount',
      'Total Service charge': 'totalServiceCharge',
      'Paid Principal Amount': 'paidPrincipalAmount',
      'Paid Service Charge Amount': 'paidServiceChargeAmount',
      'Penal Charge': 'penalCharge',
    },
    open: false,
    deleteDialogOpen: false,
    uploadButton: false,
    file: null,
    samity: null,
    religions: [],
    genders: [],
    deletedMemberCodes: [],
    editable: true,
    products: [],
    loanPurposes: [],
    projectId: '',
    isProductGiven: true,
    isPurposeGiven: true,
    samityName: '',
    samityOldCode: '',
    pageSize: 8,
  };
  schema = {
    projectId: Joi.number()
      .required()
      .error(() => {
        return { message: 'প্রকল্পের নাম নির্বাচন করুন' };
      }),
    loanPurposes: Joi.number()
      .required()
      .error(() => {
        return { message: 'জেলা কার্যালয়ের নাম নির্বাচন করুন' };
      }),
  };
  validate = () => {
    const keys = Object.keys(this.schema);
    const validateFields = {};
    const stateValues = { ...this.state };

    keys.map((k) => {
      validateFields[k] = stateValues[k];
    });

    const result = Joi.validate(validateFields, this.schema, {
      abortEarly: false,
    });

    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  getConfig = () => {
    return localStorageData('config');
  };

  async getProductsByProjectId(projectId) {
    if (projectId) {
      try {
        const allProduct = await axios.get(
          product + '?projectId=' + projectId + '&productType=A&depositNature=L',
          this.getConfig(),
        );
        let productList = allProduct.data.data;
        this.setState({ products: productList });
      } catch (error) {
        errorHandler(error);
      }
    }
  }

  async getLoanInfoOfACustomer() {
    const response = await axios.get(
      customerLoanInfoUrl + this.props.applicationId + '/' + this.props.customerOldCode,
      this.getConfig(),
    );
    if (response.status == 200) {
      this.setState({
        data: response.data.data.map((m) => {
          return {
            ...m,
            productId: m.productId,
            purposeId: m.purposeId,
            disbursementDate: m?.disbursementDate ? moment(m.disbursementDate).toString() : '',
          };
        }),
        open: false,
      });
    }
  }

  async getSamityById() {
    const response = await axios.get(
      particularSamityInfoAll + '?value=' + 1 + '&id=' + this.props.samityId,
      this.getConfig(),
    );
    if (response.status == 200) {
      try {
        const samity = response.data.data[0];

        this.setState({ projectId: samity.projectId });
        this.setState({ samityName: samity.samityName });
        this.setState({ samityOldCode: samity.samityOldCode });
        await this.getProductsByProjectId(samity.projectId);
        await this.getLoanPurpose(samity.projectId);

        if (response.status == 404) {
          NotificationManager.error(response.errors[0], 5000);
        }
      } catch (error) {
        errorHandler(error);
      }
    }
  }

  async getGenders() {
    const response = await axios.get(codeMaster + '?codeType=GEN', this.getConfig());

    if (response.status == 200) {
      const genders = response.data.data;
      this.setState({ genders });
    } else {
      NotificationManager.error(response.errors[0].message, 5000);
    }
  }

  async getReligions() {
    const response = await axios.get(codeMaster + '?codeType=REL', this.getConfig());

    if (response.status == 200) {
      const religions = response.data.data;
      this.setState({ religions });
    } else {
      NotificationManager.error(response.errors[0].message, 5000);
    }
  }
  async getLoanPurpose(value) {
    try {
      const loanPurposeData = await axios.get(loanPurposeList + '?projectId=' + value, this.getConfig());
      let purposeData = loanPurposeData.data.data;
      this.setState({ loanPurposes: purposeData });
    } catch (error) {
      if (error.response) {
        let message = error.response.data.errors[0].message;
        NotificationManager.error(message, '', 5000);
      } else if (error.request) {
        NotificationManager.error('Error Connecting...', '', 5000);
      } else if (error) {
        NotificationManager.error(error.toString(), '', 5000);
      }
    }
  }

  async memberDuplicateCheck(samityId, Members) {
    try {
      const response = await axios.post(
        samityMigration + `/${samityId}/member-duplicate-check`,
        Members,
        this.getConfig(),
      );

      if (response.status == 200) {
        return true;
      }
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 3000);
        });
      }
    }

    return false;
  }

  async postMigrationLoanInfo() {
    const { data } = this.state;

    const loanInfos = data.map((loan) => {
      console.log('loan', loan);
      return {
        ...loan,
        customerOldCode: bangToEng(loan?.customerOldCode),
        disbursementAmount: bangToEng(loan?.disbursementAmount),
        disbursementDate: bangToEng(loan?.disbursementDate),
        gracePeriod: bangToEng(loan?.gracePeriod),
        loanTermMonth: bangToEng(loan?.loanTermMonth),
        noOfInstallment: bangToEng(loan?.noOfInstallment),
        noOfLoan: bangToEng(loan?.noOfLoan),
        paidPrincipalAmount: bangToEng(loan?.paidPrincipalAmount),
        paidServiceChargeAmount: bangToEng(loan?.paidServiceChargeAmount),
        penalCharge: bangToEng(loan?.penalCharge),
        productId: bangToEng(loan?.productId),
        purposeId: bangToEng(loan?.purposeId),
        totalServiceCharge: bangToEng(loan?.totalServiceCharge),
      };
    });
    try {
      const res = await axios.post(
        loanInfoMigration + '/loan',
        {
          nextAppDesignationId: this.props.data.selectedDeskId,
          projectId: this.state.projectId,
          samityId: this.props.samityId,
          loanInfos: loanInfos,
        },
        this.getConfig(),
      );
      if (res.status == 201) {
        NotificationManager.success('সমিতির লোণের তথ্য আপলোড হয়েছে');
        this.setState({
          data: [],
        });
        return true;
      }
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 5000);
        });
      }

      return false;
    }
  }

  async updateMigrationLoanInfo() {
    const { data } = this.state;

    const payload = data.map((d) => {
      return {
        ...d,
      };
    });

    try {
      const res = await axios.put(
        updateApplication + 'loanMigrationUpdate' + '/' + this.props.applicationId,
        { ...payload[0], customerOldCode: this.props.customerOldCode },
        this.getConfig(),
      );
      if (res.status == 200) {
        NotificationManager.success('মেম্বারের লোণের তথ্য আপডেট হয়েছে');
        this.setState({
          data: [],
        });
        router.push({
          pathname: '/migration/loan',
        });
      }

      return true;
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 5000);
        });
      }

      return false;
    }
  }

  async deleteSamityMembers() {
    const { deletedMemberCodes } = this.state;
    const res = await axios.delete(samityMigration + '/' + this.props.samityId + '/members', {
      data: deletedMemberCodes,
      ...this.getConfig(),
    });
    if (res.status == 200) {
      NotificationManager.success('সমিতির মেম্বার ডিলিট হয়েছে');
      this.setState({
        deletedMemberCodes: [],
        deleteDialogOpen: false,
      });

      await this.getSamityById();
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.samityId !== this.props.samityId || prevProps.mode !== this.props.mode) {
      this.props.samityId && (await this.getSamityById());
    }

    if (prevProps.customerOldCode !== this.props.customerOldCode) {
      this.props.samityId && this.props.customerOldCode && this.setByCustomerCode();
    }
    this.props.samityId && this.setOfficeId();
  }

  async componentDidMount() {
    await this.getReligions();
    await this.getGenders();
    this.props.samityId && (await this.getSamityById());
    this.props.applicationId &&
      this.props.customerOldCode &&
      (await this.getLoanInfoOfACustomer(this.props.applicationId, this.props.customerOldCode));

    this.props.samityId && this.setOfficeId();
  }

  getProductId(productId) {
    if (this.state.products?.length === 1) {
      return this.state.products[0]?.id;
    }
    const data = this.state.products.find((r) => r.id == productId);

    return data ? data : null;
  }
  getPurposeId(purposeId) {
    // ("productId", productId);
    if (this.state.loanPurposes?.length === 1) {
      return this.state.loanPurposes[0]?.id;
    }
    const data = this.state.loanPurposes.find((r) => r.id == purposeId);
    return data ? data : null;
  }

  getGenderId(name) {
    const data = this.state.genders.find((r) => r.displayValue == name);

    return data ? data.id : null;
  }

  setByCustomerCode() {
    const samity = this.state.samity;
    const members = samity.data.members.filter((m) => {
      return m.customerOldCode == this.props.customerOldCode;
    });

    this.setState({
      data: members,
    });
  }

  setOfficeId() {
    const officeId = tokenData()?.officeId;

    const officeObj = this.props.data.officeNames.find((d) => d.id == officeId);
    if (officeObj) {
      this.props.data.officeObj = { id: officeObj.id, label: officeObj.nameBn };
    }
  }

  processRowUpdate = (newState) => {
    if (newState.productId) {
      const products = [...this.state.products];
      const selectedProductObj = products.find((product) => {
        return +product.id === +newState.productId;
      });
      newState.repaymentFrequency = selectedProductObj.repFrq;
    }

    let data = [...this.state.data];

    const oldDataIndex = data.findIndex((d) => d.customerOldCode == newState.customerOldCode);

    data[oldDataIndex] = newState;

    this.setState({ data });
    return newState;
  };

  handleProcessRowUpdateError = (error) => {
    error;
  };

  handleInputFIle = () => {};

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false });
  };

  handleChangeFile = ({ target: { files } }) => {
    const file = files[0];

    this.setState({ file });
  };

  handleMemberDelete = async () => {
    await this.deleteSamityMembers();
  };

  handleUploadLonInfos = async () => {
    await this.props.validate();
    if (this.props.data.errors.selectedDeskId) {
      return;
    }
    this.setState({ uploadButton: true });
    const result = await this.postMigrationLoanInfo();
    this.setState({ uploadButton: false });

    result && router.push(`/migration/loan`);
  };

  handleUpdateLoanInfo = async () => {
    this.setState({ uploadButton: true });
    await this.updateMigrationLoanInfo();
    this.setState({ uploadButton: false });
  };
  areTwoArraySame = (array1, array2) => {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }
        return false;
      });
    }
    return false;
  };
  setProductIfOneValue = () => {
    if (this.state.products?.length === 1) {
      return this.state.products[0]?.id;
    } else {
      return null;
    }
  };
  setPurposeIfOneValue = () => {
    if (this.state.loanPurposes?.length === 1) {
      return this.state.loanPurposes[0]?.id;
    }
  };
  handleExcelToJson = async () => {
    const { headerMapping } = this.state;
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.load(this.state.file);

    const memberWorksheet = workbook.getWorksheet(1);

    let memberArray = [];

    memberWorksheet.eachRow(function (row) {
      const stringValues = row.values.map((v) => (isRichValue(v) ? richToString(v) : v));
      memberArray.push(stringValues);
    });
    const [[, ...memberKeys], ...rest] = memberArray;
    const updloadedXlKeysArray = memberKeys;
    const headerMappingArray = Object.keys(headerMapping);

    const isTwoArraySame = this.areTwoArraySame(updloadedXlKeysArray, headerMappingArray);

    if (!isTwoArraySame) {
      NotificationManager.error('সঠিক এক্সেল ফাইল আপলোড করুন');
      this.handleClose();
      return;
    }
    const loanInfoObj = rest.map(([, ...s]) => {
      return s.reduce(function (p, c, i) {
        p[headerMapping[memberKeys[i]]] = c;
        return p;
      }, {});
    });

    this.setState({
      data: loanInfoObj.map((m) => {
        return {
          ...m,
          productId: this.getProductId(m.productId),
          purposeId: this.getPurposeId(m.purposeId),
          disbursementDate: m?.disbursementDate
            ? moment(m.disbursementDate, 'DD/MM/YYYY').format('DD MMMM YYYY').toString()
            : '',
        };
      }),
      open: false,
    });
  };
  createWorkbook = async () => {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('loan_migration');
    worksheet.columns = [
      { header: 'Member Code', key: 'customerOldCode', width: 20 },
      { header: 'No of Loan', key: 'noOfLoan', width: 12 },
      { header: 'Disbursement Date', key: 'disbursementDate', width: 20 },
      { header: 'Loan Term(Month)', key: 'loanTermMonth', width: 12 },
      { header: 'No of Instalment', key: 'noOfInstallment', width: 12 },
      { header: 'Grace Period', key: 'gracePeriod', width: 12 },
      { header: 'Disbursement Amount', key: 'disbursementAmount', width: 12 },
      { header: 'Total Service charge', key: 'totalServiceCharge', width: 12 },
      {
        header: 'Paid Principal Amount',
        key: 'paidPrincipalAmount',
        width: 12,
      },
      {
        header: 'Paid Service Charge Amount',
        key: 'paidServiceChargeAmount',
        width: 12,
      },
      { header: 'Penal Charge', key: 'penalCharge', width: 12 },
    ];

    await workbook.xlsx.writeBuffer().then(function (data) {
      var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'loan_migration_data.xlsx');
    });
  };
  handleDeleteClick = (id) => {
    const data = [...this.state.data];
    this.setState({
      data: data.filter((d) => d.customerOldCode != id),
    });
  };

  handleMemberDeleteClick = (code) => {
    const deletedMemberCodes = this.state.deletedMemberCodes;
    deletedMemberCodes.push(code);

    this.setState({
      deleteDialogOpen: true,
      deletedMemberCodes,
    });
  };

  renderButtons() {
    if (this.props.mode == 'list') {
      return null;
    } else if (this.props.applicationId && this.props.customerOldCode) {
      return (
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button disabled={this.state.uploadButton} variant="outlined" onClick={this.handleUpdateLoanInfo}>
            হালনাগাদ
          </Button>
        </Grid>
      );
    } else {
      return (
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{ mr: '5px' }} variant="outlined" onClick={this.handleClickOpen}>
            এক্সেল আপলোড
          </Button>
          {this.state.data.length > 0 ? (
            <Button disabled={this.state.uploadButton} variant="outlined" onClick={this.handleUploadLonInfos}>
              সংরক্ষণ
            </Button>
          ) : null}
        </Grid>
      );
    }
  }

  renderActionButton = ({ customerOldCode }) => {
    return this.props.mode == 'list'
      ? [
          <Grid container mx={2} key={customerOldCode}>
            <Tooltip placement="top-start" title="এডিট মেম্বার">
              <Edit
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  router.push(`/migration/members/edit/${this.props.samityId}?customerOldCode=${customerOldCode}`);
                }}
                color="action"
              ></Edit>
            </Tooltip>
            <Tooltip placement="top-start" title="রিমুভ মেম্বার">
              <Delete
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleMemberDeleteClick(customerOldCode)}
                color="error"
              ></Delete>
            </Tooltip>
          </Grid>,
        ]
      : [
          <Tooltip placement="top-start" title="রিমুভ মেম্বার" key={customerOldCode}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => this.handleDeleteClick(customerOldCode)}
              size="small"
            >
              <Close></Close>
            </Button>
          </Tooltip>,
        ];
  };

  renderUploadDialog = () => {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ mb: 0, pb: 0 }}
      >
        <DialogTitle id="alert-dialog-title">{'ইম্পোর্ট করার আগে করনীয় কাজ'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            এক্সেল ফাইলে নির্দিষ্ট ফরম্যাটে ডাটা দিন, অন্যথায় সঠিক ভাবে ইম্পোর্ট করতে পারবেন না।
          </DialogContentText>
          <Grid container spacing={2.5} justifyContent="flex-start">
            <Grid item>ফরম্যাট ডাউনলোড করুন</Grid>
            <Grid item>
              <Button variant="outlined" size="small" onClick={this.createWorkbook}>
                ডাউনলোড
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }}></Divider>
          <Grid container>
            <Grid item>
              <TextField
                type="file"
                name="আপলোড ফাইল"
                inputProps={{ accept: '.xlsx, .xls' }}
                onChange={this.handleChangeFile}
              />
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }}></Divider>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} variant="outlined">
            বাতিল করুন
          </Button>
          <Button disabled={!this.state.file} onClick={this.handleExcelToJson} variant="outlined">
            ইম্পোর্ট করুন
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  renderDeleteConfirmation = () => {
    return (
      <Dialog
        open={this.state.deleteDialogOpen}
        onClose={this.handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ mb: 0, pb: 0 }}
      >
        <DialogTitle id="alert-dialog-title">{'ডিলিট করুন'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">আপনি নিশ্চিত এই মেম্বার ডিলিট করতে চান?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteDialogClose} variant="outlined">
            বাতিল করুন
          </Button>
          <Button variant="outlined" onClick={this.handleMemberDelete}>
            ডিলিট করুন
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    return (
      <Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Grid>
            <Grid mb={1}>সমিতির নামঃ {this.state.samityName}</Grid>
            <Grid>সমিতি কোডঃ {engToBang(this.state.samityOldCode)}</Grid>
          </Grid>
          {this.renderButtons()}
        </Grid>

        <Grid>
          {this.renderUploadDialog()}
          {this.renderDeleteConfirmation()}

          <Grid
            sx={{
              width: '100%',
            }}
          >
            <DataGrid
              rows={this.state.data}
              columns={this.state.columns}
              getRowId={(row) => row.customerOldCode}
              density="compact"
              disableColumnFilter={false}
              disableColumnMenu={true}
              disableColumnSelector={true}
              disableDensitySelector={true}
              disableExtendRowFullWidth={true}
              disableIgnoreModificationsIfProcessingProps={true}
              disableSelectionOnClick={true}
              disableVirtualization={true}
              experimentalFeatures={{
                newEditingApi: true,
              }}
              hideFooter={this.props.mode == 'edit'}
              processRowUpdate={this.processRowUpdate}
              onProcessRowUpdateError={this.handleProcessRowUpdateError}
              isCellEditable={() => this.props.mode != 'list'}
              columnVisibilityModel={{
                actions: this.props.mode != 'edit',
              }}
              autoHeight={true}
              // pageSizeOptions={[8]}
              pageSize={this.state?.pageSize}
              rowsPerPageOptions={[8, 20, 50, 100]}
              onPageSizeChange={(newPageSize) => {
                this.setState({ pageSize: newPageSize });
              }}
              // error={this.validate()}
            />
          </Grid>
        </Grid>
        {!this.props.applicationId && !this.props.customerOldCode ? (
          <Grid container spacing={2.5} sx={{ marginTop: '10px' }}>
            <Grid item md={6} lg={6} xs={12}>
              <Autocomplete
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                name="officeName"
                onChange={(event, value) => {
                  this.props.data.handleOffice(event, value);
                  // ("VVVVVV",value);
                }}
                options={this.props.data.officeNames.map((option) => {
                  return {
                    id: option.id,
                    label: option.nameBn,
                  };
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={this.props.data.officeObj.id === '' ? star('কার্যালয় নির্বাচন করুন') : 'কার্যালয়'}
                    variant="outlined"
                    size="small"
                    style={{ backgroundColor: '#FFF', margin: '5dp' }}
                  />
                )}
                value={this.props.data.officeObj}
              />
            </Grid>
            <Grid item md={6} lg={6} xs={12}>
              {/* <FormControl fullWidth>
                <InputLabel id="selectedDistrictOffice">
                  {this.state.selectedDistrictOffice === ""
                    ? "পর্যবেক্ষক / অনুমোদনকারী  নির্বাচনকরুন"
                    : "পর্যবেক্ষক / অনুমোদনকারী "}
                </InputLabel>
                <Select
                  required
                  name="selectedDistrictOffice"
                  id="selectedDistrictOffice"
                  value={this.state.selectedDistrictOffice}
                  label={
                    this.state.selectedDistrictOffice === ""
                      ? "পর্যবেক্ষক / অনুমোদনকারী  নির্বাচনকরুন"
                      : "পর্যবেক্ষক / অনুমোদনকারী "
                  }
                  onChange={(e) => {
                    this.props.data.handleDeskId(e);
                  }}
                  // disabled={this.state.districtOffices?.length == 1}
                  size="small"
                  error={!!this.props.data.errors?.selectedDeskId}
                  helperText={
                    !!this.props.data.errors.selectedDeskId
                      ? this.props.data.errors.selectedDeskId
                      : ""
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      textDecoration: "none",
                    },
                  }}
                >
                  {this.props.data.deskList.map((option) => {
                    return (
                      <MenuItem key={option.id} value={option.designationId}>
                        {option.nameBn} - {option.designation}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText
                  error={!!this.props.data.errors?.selectedDeskId}
                >
                  {this.props.data.errors.selectedDeskId}
                </FormHelperText>
              </FormControl> */}
              <Autocomplete
                name="selectedDistrictOffice"
                disablePortal
                inputProps={{ style: { padding: 0, margin: 0 } }}
                onChange={(e, value) => {
                  this.props.data.handleDeskId(value);
                }}
                options={this.props.data.deskList}
                getOptionLabel={(option) => `${option.nameBn} - ${option.designation}`}
                value={this.state.selectedDistrictOffice}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={
                      this.state.selectedDistrictOffice === ''
                        ? star('পর্যবেক্ষক / অনুমোদনকারী  নির্বাচনকরুন')
                        : 'পর্যবেক্ষক / অনুমোদনকারী '
                    }
                    variant="outlined"
                    size="small"
                    error={Boolean(this.props.data.errors?.selectedDeskId)}
                    helperText={this.props.data.errors.selectedDeskId}
                  />
                )}
              />
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

export default withSelectOffice(UploadLoan);
