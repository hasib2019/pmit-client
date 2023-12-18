/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 15:46:51
 * @modify date 2022-11-03 15:46:51
 * @desc [description]
 */

import { Button, Divider, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import router from 'next/router';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { codeMaster, fieldOffRoute, getUnionByUpazilaId, loanProject, samityMigration } from '../../../../url/ApiList';
import { engToBang } from '../../samity-managment/member-registration/validator';

class UploadMember extends Component {
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
        headerName: 'মেম্বার কোড',
        field: 'customerOldCode',
        width: 90,
        valueFormatter: (params) => engToBang(params?.value),
      },
      {
        headerName: 'নাম(ইংরেজি)',
        field: 'nameEn',
        width: 130,
      },
      {
        headerName: 'নাম(বাংলা)',
        field: 'nameBn',
        width: 130,
      },
      {
        headerName: 'জন্ম তারিখ',
        field: 'birthDate',
        width: 100,
        valueFormatter: (params) => engToBang(moment(params?.value, 'DD/MM/YYYY').format('DD/MM/YYYY')),
      },
      {
        headerName: 'পিতার নাম',
        field: 'fatherName',
        width: 130,
      },
      {
        headerName: 'মাতার নাম',
        field: 'motherName',
        width: 130,
      },

      {
        headerName: 'মোবাইল নম্বর',
        field: 'mobile',
        width: 120,
        valueFormatter: (params) => engToBang(params?.value),
      },
      {
        headerName: 'এনআইডি নম্বর',
        field: 'nid',
        width: 120,
        valueFormatter: (params) => engToBang(params?.value),
      },
      {
        headerName: 'জন্ম নিবন্ধন নম্বর',
        field: 'brn',
        width: 130,
        valueFormatter: (params) => engToBang(params?.value),
      },
      {
        headerName: 'ধর্ম',
        field: 'religion',
        width: 80,
        valueFormatter: (params) => {
          if (params.value) {
            const { displayValue } = this.state.religions.find((f) => f.id == params.value);
            return displayValue;
          }
        },
      },
      {
        headerName: 'লিঙ্গ',
        field: 'gender',
        width: 80,
        valueFormatter: (params) => {
          if (params.value) {
            const { displayValue } = this.state.genders.find((f) => f.id == params.value);
            return displayValue;
          }
        },
      },
      {
        headerName: 'ডিপোজিট স্থিতি',
        field: 'currentDepositBalance',
        width: 110,
        valueFormatter: (params) => engToBang(params?.value),
      },
      {
        headerName: 'শেয়ার স্থিতি',
        field: 'currentShareBalance',
        width: 80,
        valueFormatter: (params) => engToBang(params?.value),
      },
    ],

    open: false,
    uploadButton: false,
    file: null,
    samity: null,
    religions: [],
    genders: [],
    editable: true,
    fieldOfficers: [],
    projects: [],
    unions: [],
    occupations: [],
    relationships: [],
    educations: [],
  };

  getConfig = () => {
    return localStorageData('config');
  };

  async getSamityById() {
    const response = await axios.get(samityMigration + '/' + this.props.samityId, this.getConfig());
    if (response.status == 200) {
      const samity = response.data.data;

      if (samity.data.projectId == 13) {
        await this.getOccupationList();
        await this.getGuardianRelationList();
        await this.getEducationList();
        this.setState({
          columns: this.state.columns.concat([
            {
              headerName: 'শ্রেণী',
              field: 'class',
              width: 80,
              valueFormatter: (params) => {
                if (params.value) {
                  const { displayValue } = this.state.educations?.find((f) => f.id == params.value);
                  return displayValue;
                }
              },
            },
            {
              headerName: 'শাখা',
              field: 'sectionName',
              width: 80,
              valueFormatter: (params) => engToBang(params?.value),
            },
            {
              headerName: 'রোল নাম্বার',
              field: 'rollNo',
              width: 80,
              valueFormatter: (params) => engToBang(params?.value),
            },
            {
              headerName: 'পিতার এন আইডি নাম্বার',
              field: 'fathersNidNumber',
              width: 120,
              valueFormatter: (params) => engToBang(params?.value),
            },
            {
              headerName: 'মাতার এন আইডি নাম্বার',
              field: 'mothersNidNumber',
              width: 120,
              valueFormatter: (params) => engToBang(params?.value),
            },
            {
              headerName: 'আইনি অভিভাবকদের নাম',
              field: 'legalGuardianName',
              width: 120,
              valueFormatter: (params) => engToBang(params?.value),
            },
            {
              headerName: 'আইনি অভিভাবকের এনআইডি',
              field: 'legalGuardianNid',
              width: 120,
              valueFormatter: (params) => engToBang(params?.value),
            },

            {
              headerName: 'আইনগত অভিভাবকের পেশা',
              field: 'legalGuardianOccupation',
              width: 120,
              valueFormatter: (params) => {
                if (params.value) {
                  const { displayValue } = this.state.occupations?.find((f) => f.id == params.value);
                  return displayValue;
                }
              },
            },
            {
              headerName: 'আইনি অভিভাবকের সাথে সম্পর্ক',
              field: 'relationshipWithLegalGuardian',
              width: 120,
              valueFormatter: (params) => {
                if (params.value) {
                  const { displayValue } = this.state.relationships?.find((f) => {
                    return f.id == params.value;
                  });
                  return displayValue;
                }
              },
            },
          ]),
        });
      }
      this.setState({ samity, data: samity?.data?.members || [] });
    }
    if (response.status == 404) {
      NotificationManager.error(response.errors[0], 5000);
    }
  }

  async getProjects() {
    const projectResponse = await axios.get(loanProject, this.getConfig());
    if (projectResponse.status == 200) {
      const projects = projectResponse.data.data;
      this.setState({ projects });
    } else {
      NotificationManager.error(projectResponse.errors[0].message, 5000);
    }
  }

  async getFieldOfficers() {
    const fieldOfficerResponse = await axios.get(fieldOffRoute, this.getConfig());
    if (fieldOfficerResponse.status == 200) {
      const fieldOfficers = fieldOfficerResponse.data.data;
      this.setState({ fieldOfficers });
    } else {
      NotificationManager.error(fieldOfficerResponse.errors[0].message, 5000);
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
  async getOccupationList() {
    // ("config", config)
    try {
      let occupationInfo = await axios.get(codeMaster + '?codeType=OCC', this.getConfig());
      let occupationInfoData = occupationInfo.data.data;
      this.setState({ occupations: occupationInfoData });
    } catch (err) {
      // (err);
    }
  }
  async getGuardianRelationList() {
    // ("config", config)
    try {
      let guardianRelationInfo = await axios.get(codeMaster + '?codeType=RLN', this.getConfig());
      let guardianRelationInfoData = guardianRelationInfo.data.data;
      this.setState({ relationships: guardianRelationInfoData });
    } catch (err) {
      // (err);
    }
  }
  async getEducationList() {
    // ("config", config)
    try {
      let educationInfo = await axios.get(codeMaster + '?codeType=EDT', this.getConfig());
      let educationList = educationInfo.data.data;
      // ("Education Info", educationList);
      this.setState({ educations: educationList });
    } catch (err) {
      // (err);
    }
  }

  async getUnions() {
    const upazilaId = this.state.samity?.data?.upazilaId;
    if (upazilaId) {
      const response = await axios.get(getUnionByUpazilaId + `&upazila=${upazilaId}`, this.getConfig());
      if (response.status == 200) {
        const unions = response.data.data;
        this.setState({ unions });
      } else {
        NotificationManager.error(response.errors[0].message, 5000);
      }
    }
  }

  async postApproveSamity(approveStatus) {
    try {
      const res = await axios.post(
        samityMigration + '/approve/' + this.props.samityId,
        { approveStatus },
        this.getConfig(),
      );
      if (res.status == 201) {
        NotificationManager.success(approveStatus == 'A' ? 'সমিতির মাইগ্রেসন সম্পন্ন হয়েছে' : 'সমিতি বাতিল করা হয়েছে');

        return true;
      }
    } catch (error) {
      'errorApp', error;
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 5000);
        });
      }

      return false;
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.samityId !== this.props.samityId) {
      this.props.samityId && (await this.getSamityById());
    }
  }

  async componentDidMount() {
    await this.getReligions();
    await this.getGenders();
    await this.getFieldOfficers();
    await this.getProjects();
    this.props.samityId && (await this.getSamityById());
    this.props.samityId && (await this.getUnions());
  }

  getMemberTypeBangla(type) {
    const gender = this.state.genders.find((g) => g.id == type);

    return gender?.displayValue || 'প্রযোজ্য নয়';
  }

  getFOUserName(id) {
    const foUser = this.state.fieldOfficers.find((f) => f.id == id);
    return foUser ? foUser.nameBn : 'প্রযোজ্য নয়';
  }

  getProjectName(id) {
    const project = this.state.projects.find((p) => p.id == id);
    return project ? project.projectNameBangla : 'প্রযোজ্য নয়';
  }

  getUnionName(id) {
    const union = this.state.unions.find((p) => p.uniThanaPawId == id);
    return union ? union.uniThanaPawNameBangla : 'প্রযোজ্য নয়';
  }

  handleApproveSamity = async (approveStatus) => {
    const result = await this.postApproveSamity(approveStatus);

    result && router.push(`/samity-management/manual-samity-approval`);
  };

  render() {
    return (
      <Grid>
        <Grid>
          <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              disabled={this.state.uploadButton}
              variant="outlined"
              className="btn btn-delete"
              onClick={() => this.handleApproveSamity('C')}
              sx={{ mr: '5px' }}
            >
              বাতিল
            </Button>
            <Button
              disabled={this.state.uploadButton}
              variant="outlined"
              onClick={() => this.handleApproveSamity('A')}
              className="btn btn-primary"
            >
              অনুমোদন
            </Button>
          </Grid>
          <Divider sx={{ my: 2 }}></Divider>
          <Grid
            container
            sx={{ mb: 2 }}
            justifyContent="space-between"
            columnSpacing={{ sm: 2 }}
            rowSpacing={{ xs: 2 }}
          >
            <Grid item>
              <Grid mb={1}>সমিতির নামঃ {this.state.samity?.data?.samityName}</Grid>
              <Grid mb={1}>সমিতি কোডঃ {engToBang(this.state.samity?.data?.samityOldCode)}</Grid>
              <Grid>মাঠ কর্মীঃ {this.getFOUserName(this.state.samity?.data?.foUserId)} </Grid>
            </Grid>
            <Grid item>
              <Grid mb={1}>প্রজেক্টের নামঃ {this.getProjectName(this.state.samity?.projectId)}</Grid>
              <Grid mb={1}>
                গঠনের তারিখঃ{' '}
                {engToBang(moment(this.state.samity?.data?.formationDate, 'DD/MM/YY').format('DD/MM/YYYY'))}
              </Grid>
              <Grid>মিটিং এর ধরনঃ {this.state.samity?.data?.meetingType == 'M' ? 'মাসিক' : 'সাপ্তাহিক'}</Grid>
            </Grid>
            <Grid item>
              <Grid mb={1}>সদস্যের ধরনঃ {this.getMemberTypeBangla(this.state.samity?.data?.samityMemberType)}</Grid>
              <Grid mb={1}>ইউনিয়নঃ {this.getUnionName(this.state.samity?.data?.union)}</Grid>
              <Grid mb={1} maxWidth={'300px'}>
                বিস্তারিত ঠিকানাঃ {this.state.samity?.data?.address}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <Grid sx={{ width: '100%' }}>
            <DataGrid
              rows={this.state.data}
              columns={this.state.columns}
              getRowId={(row) => row.customerOldCode}
              density="standard"
              disableColumnFilter={true}
              disableColumnMenu={true}
              disableColumnSelector={true}
              disableDensitySelector={true}
              disableExtendRowFullWidth={true}
              disableIgnoreModificationsIfProcessingProps={true}
              disableSelectionOnClick={true}
              disableVirtualization={true}
              autoHeight={true}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default UploadMember;
