import axios from 'axios';
import Joi from 'joi-browser';
import React from 'react';
import NotificationManager from 'react-notifications/lib/NotificationManager';
import { employeeRecordByOffice, officeName } from '../../url/ApiList';
const withSelectOffice = (OriginalComponent) => {
  class NewComponent extends React.Component {
    accessToken;
    state = {
      officeNames: [],
      deskList: [],
      selectedDeskId: '',
      officeObj: {
        id: '',
        label: '',
      },
      handleDeskId: (value) => {
        this.setState({ selectedDeskId: value?.designationId });
        value && this.setState({ errors: { selectedDeskId: '' } });
      },

      handleOffice: async (event, value) => {
        if (value == null) {
          this.setState({
            officeObj: {
              id: '',
              label: '',
            },
          });
        } else {
          value &&
            this.setState({
              officeObj: {
                id: value.id,
                label: value.label,
              },
            });

          // await this.getDeskId(value.id);
        }
      },
      errors: {
        selectedDeskId: '',
      },
    };
    schema = {
      selectedDeskId: Joi.number()
        .required()
        .error(() => {
          return { message: 'পর্যবেক্ষক / অনুমোদনকারী নির্বাচন করুন' };
        }),
    };
    validate = async () => {
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
      this.setState({
        errors: { ...errors },
      });
      return errors;
    };
    getConfig = () => {
      let accessToken;
      if (typeof window !== 'undefined') {
        accessToken = localStorage.getItem('accessToken');
      }
      return {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
    };
    async getDeskId(id) {
      try {
        let Data = await axios.get(employeeRecordByOffice + '?officeId=' + id, this.getConfig());
        const deskData = Data.data.data;
        this.setState({ deskList: deskData });
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
    async getOfficeNames() {
      try {
        let officeNameData = await axios.get(officeName, this.getConfig());

        //("Office Name Data-----", officeNameData.data.data);

        this.setState({ officeNames: officeNameData.data.data });
        //   let Data = await axios.get(
        //     employeeRecordByOffice + "?officeId=" + id,
        //     config
        //   );
        //   const deskData = Data.data.data;
        //   setDeskList(deskData);
      } catch (error) {
        'error found', error;
        if (error.response) {
          'error found', error.response.data;
          //let message = error.response.data.errors[0].message;
          NotificationManager.error(error.message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    }

    componentDidMount() {
      this.getOfficeNames();
    }
    async componentDidUpdate(prevProps, prevState) {
      if (this.state.officeObj?.id) {
        if (this.state.deskList?.length === 0) {
          this.getDeskId(this.state.officeObj?.id);
        }

        if (prevState.officeObj.id !== this.state.officeObj?.id) {
          this.getDeskId(this.state.officeObj?.id);
        }
      }
    }
    render() {
      return <OriginalComponent {...this.props} data={this.state} validate={this.validate} />;
    }
  }
  return NewComponent;
};
export default withSelectOffice;
