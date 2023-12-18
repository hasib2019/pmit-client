import moment from 'moment';
import { tokenData } from 'service/common';
export const employeeInfoInitialState = {
  employeeInfo: {
    samityId: '',
    employeeId: '',
    name: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    maritalStatusId: '',
    dob: null,
    brn: '',
    nid: '',
    educationalQualification: '',
    presentAddress: '',
    permanentAddress: '',
    designationId: '',
    ranking: '',
    status: '',
    religion: '',
    gender: '',
    experience: '',
    employee_img: '',
    employee_signature: '',
    gross_salary: '',
    basic_salary: '',
    imageDocuments: {
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
    },
    signatureDocuments: {
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',
    },
  },
  apivalues: {
    educationalQualifications: [],
    maritalStatuses: [],
    employeeDesignations: [],
    religions: [],
    allSamityData: [],
  },
  formErrors: {
    employeeIdError: '',
    nameError: '',
    fatherNameError: '',

    maritalStatusIdError: '',
    dobError: '',
    nidError: '',
    brnError: '',
    educationalQualificationError: '',
    presentAddressError: '',

    designationIdError: '',

    statusError: '',
    religionError: '',
    genderError: '',
  },
  update: false,
};
export const employeeInfoReducer = (state, action) => {
  switch (action.type) {
    case 'clearState':
      const userData = tokenData();
      return {
        employeeInfo: {
          ...(userData.type === 'user' && { samityId: undefined }),

          employeeId: '',
          name: '',
          fatherName: '',
          motherName: '',
          spouseName: '',
          maritalStatusId: '',
          dob: null,
          brn: '',
          nid: '',
          educationalQualification: '',
          presentAddress: '',
          permanentAddress: '',
          designationId: '',
          ranking: '',
          status: '',
          religion: '',
          gender: '',
          experience: '',
          employee_img: '',
          employee_signature: '',
          gross_salary: '',
          basic_salary: '',
          imageDocuments: {
            documentPictureFront: '',
            documentPictureFrontName: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
          },
          signatureDocuments: {
            documentPictureFront: '',
            documentPictureFrontName: '',
            documentPictureFrontType: '',
            documentPictureFrontFile: '',
          },
        },
        formErrors: {
          employeeIdError: '',
          nameError: '',
          fatherNameError: '',

          maritalStatusIdError: '',
          dobError: '',
          nidError: '',
          brnError: '',
          educationalQualificationError: '',
          presentAddressError: '',

          designationIdError: '',

          statusError: '',
          religionError: '',
          genderError: '',
        },
        update: false,
        apivalues: {
          ...state.apivalues,
        },
      };
    case 'employeeInfo':
      return {
        ...state,
        employeeInfo: {
          ...state.employeeInfo,
          [action.fieldName]: action.value,
          //   id: action.value.replace(/\D/g, ""),
        },
      };
    case 'apiValues':
      return {
        ...state,
        apivalues: {
          ...state.apivalues,
          [action.apivalueName]: action.value,
        },
      };

    //   case "employee_id":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         id: action.value.replace(/\D/g, ""),
    //       },
    //     };

    //   case "name":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         name: action.value.replace(/[^A-Za-z ]/gi, ""),
    //       },
    //     };
    //   case "father_name":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         fatherName: action.value.replace(/[^A-Za-z ]/gi, ""),
    //       },
    //     };
    //   case "mother_name":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         motherName: action.value.replace(/[^A-Za-z ]/gi, ""),
    //       },
    //     };
    //   case "spouse_name":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         spouseName: action.value.replace(/[^A-Za-z ]/gi, ""),
    //       },
    //     };
    //   case "marital_status_id":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         maritalStatusId: action.value,
    //       },
    //     };
    //   case "dob":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, dob: action.value },
    //     };
    //   case "brn":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         brn: action.value.replace(/\D/g, ""),
    //       },
    //     };
    //   case "nid":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         nid: action.value.replace(/\D/g, ""),
    //       },
    //     };
    //   case "educationalQualification":
    //     "edValueeee", action.value;
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         educationalQualification: action.value,
    //       },
    //     };
    //   case "presen_address":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, presentAddress: action.value },
    //     };
    //   case "permanent_address":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         permanentAddress: action.value,
    //       },
    //     };
    //   case "designation_id":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, designation_id: action.value },
    //     };
    //   case "rankingOrSerial":
    //     return {
    //       ...state,
    //       employeeInfo: {
    //         ...state.employeeInfo,
    //         rankingOrSerial: action.value,
    //       },
    //     };
    //   case "status":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, status: action.value },
    //     };
    //   case "religion":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, religion: action.value },
    //     };
    //   case "gender":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, gender: action.value },
    //     };
    //   case "experience":
    //     return {
    //       ...state,
    //       employeeInfo: { ...state.employeeInfo, experience: action.value },
    //     };

    // case "employee_img":
    //   return {
    //     ...state,
    //     employeeInfo: { ...state.employeeInfo, employee_img: action.value },
    //   };
    // case "employee_signature":
    //   return {
    //     ...state,
    //     employeeInfo: {
    //       ...state.employeeInfo,
    //       employee_signature: action.value,
    //     },
    //   };

    // case "educationalQualifications":
    //   return {
    //     ...state,
    //     apivalues: {
    //       ...state.apivalues,
    //       educationalQualifications: action.value,
    //     },
    //   };
    // case "religions":
    //   return {
    //     ...state,
    //     apivalues: {
    //       ...state.apivalues,
    //       religions: action.value,
    //     },
    //   };
    // case "maritalStatuses":
    //   return {
    //     ...state,
    //     apivalues: {
    //       ...state.apivalues,

    //       maritalStatuses: action.value,
    //     },
    //   };

    case 'imageDocuments':
      return {
        ...state,
        employeeInfo: {
          ...state.employeeInfo,
          imageDocuments: {
            ...state.employeeInfo.imageDocuments,
            ...action.value,
          },
        },
      };
    case 'signatureDocuments':
      return {
        ...state,
        employeeInfo: {
          ...state.employeeInfo,
          signatureDocuments: {
            ...state.employeeInfo.signatureDocuments,
            ...action.value,
          },
        },
      };

    case 'nidError':
      const nidError =
        action.value.length == 10 || action.value.length == 13 || action.value.length == 17 || action.value === ''
          ? ''
          : 'এনআইডি নাম্বার ১০, ১৩ অথবা ১৭ ডিজিটের হতে হবে';

      return {
        ...state,
        formErrors: { ...state.formErrors, nidError: nidError },
      };

    // case "nameError":
    //   const nameError =
    //     action.value === "" ? "কর্মকর্তা অথবা কর্মচারীর নাম প্রদান করুন" : "";
    //   return {
    //     ...state,
    //     formErrors: { ...state.formErrors, nameError: nameError },
    //   };
    case 'brnError':
      const brnError = action.value.length !== 17 ? 'জন্ম নিবন্ধন নম্বর ১৭ ডিজিটের হতে হবে' : '';
      return {
        ...state,
        formErrors: { ...state.formErrors, brnError: brnError },
      };

    case 'dobError':
      var a = moment(new Date());
      var b = moment(action.value);
      const difference = a.diff(b, 'years');
      const dobError = difference < 18 ? 'কর্মকর্তার বয়স ১৮ বছরের বেশি হতে হবে' : '';
      return {
        ...state,
        formErrors: { ...state.formErrors, dobError: dobError },
      };
    case 'setAllFormError':
      return { ...state, formErrors: action.value };
    case 'setEmployeeInfo':
      return {
        ...state,
        employeeInfo: { ...state.employeeInfo, ...action.value },
      };
    case 'setImageDocument':
      return {
        ...state,
        employeeInfo: {
          ...state.employeeInfo,
          imageDocuments: {
            ...state.employeeInfo.imageDocuments,
            ...action.value,
          },
        },
      };
    case 'setSignatureDocument':
      return {
        ...state,
        employeeInfo: {
          ...state.employeeInfo,
          signatureDocuments: {
            ...state.employeeInfo.signatureDocuments,
            ...action.value,
          },
        },
      };

    case 'others':
      return { ...state, [action.fieldName]: action.value };
    default:
      return state;
  }
};
