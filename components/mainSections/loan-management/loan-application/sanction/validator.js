/* eslint-disable no-sparse-arrays */
import validator from 'validator';
const ownValidator = (id, name, value, formErrors, loanSectionInfo, intialInstallmentNumber, ...theArgs) => {
  let nextLoanAmount;
  let resultant;
  if (name == 'loanAmount' && !value) {
    resultant = {
      key: name,
      status: false,
      message: 'ঋণের পরিমাণ উল্লেখ করা আবশ্যক',
    };
    return resultant;
  }
  if (name == 'loanPeriod' && !value) {
    resultant = {
      key: name,
      status: false,
      message: 'ঋণের মেয়াদ  উল্লেখ করা আবশ্যক',
    };
    return resultant;
  }
  if (name == 'installmentNumber' && !value) {
    resultant = {
      key: name,
      status: false,
      message: 'ইনস্টলমেন্ট সংখ্যা উল্লেখ করা আবশ্যক',
    };
    return resultant;
  }
  nextLoanAmount = theArgs.length >= 1 ? theArgs[0] : null;

  if (id == 'number') {
    formErrors[name] = '';
  }

  switch (name) {
    case 'loanAmount':
      if (!Number(nextLoanAmount)) {
        resultant = {
          key: name,
          status: false,
          message: 'ঋণের পরিমান ইনপুটের জন্য সদস্য নির্বাচন করা আবশ্যিক',
        };
        return resultant;
      }
      if (Number(nextLoanAmount) >= Number(value)) {
        resultant = {
          key: name,
          status: true,
          message: '',
        };
      } else if (Number(nextLoanAmount) < Number(value)) {
        resultant = {
          key: name,
          status: false,
          message: 'ঋণের পরিমাণ উপরে উল্লেখিত সর্বোচ্চ ঋণ এর পরিমান অপেক্ষা বেশি হতে পারে না',
        };
      }
      return resultant;
    case 'installmentNumber':
      'A';
      if (intialInstallmentNumber) {
        if (Number(value) > intialInstallmentNumber) {
          resultant = {
            key: name,
            status: false,
            message: 'ইনস্টলমেন্ট সংখ্যা হিসাবকৃত ইনস্টলমেন্ট সংখ্যা অপেক্ষা  বেশি হতে পারে না',
          };
        } else {
          resultant = {
            key: name,
            status: true,
            message: '',
          };
        }
        return resultant;
      }
      break;
  }
};

export default ownValidator;

export function mandatory(id, name, value, formErrors, index) {
  let resultant, result;
  if (id == 'number') {
    if (!validator.isInt(value)) {
      let label = name == 'nidNumber' ? 'এনআইডি' : name == 'mobile' ? 'মোবাইল নাম্বর' : '';
      resultant = {
        key: name,
        status: false,
        message: `${label} সাংখ্যিক দেওয়া হয়`,
      };
      return resultant;
    } else {
      formErrors[index][name] = '';
    }
  }
  switch (name) {
    case 'nidNumber':
      if (!(value.length == 10 || value.length == 17)) {
        resultant = {
          key: name,
          status: false,
          message: 'আপনার সঠিক এনআইডি প্রদান করুন',
        };
      } else {
        resultant = {
          key: name,
          status: true,
          message: '',
        };
      }
      return resultant;
    case 'TRL':
      if (!(value.length > 19)) {
        resultant = {
          key: name,
          status: false,
          message: 'আপনার সঠিক ট্রেড লাইসেন্স নম্বর প্রদান করুন',
        };
      } else {
        resultant = {
          key: name,
          status: true,
          message: '',
        };
      }
      return resultant;
    case 'mobile':
      result = validator.isMobilePhone(value, [, 'bn-BD']);
      if (result) {
        resultant = {
          key: name,
          status: result,
          message: '',
        };
      } else {
        resultant = {
          key: name,
          status: result,
          message: 'আপনার সঠিক মোবাইল নাম্বার প্রদান করুন',
        };
      }
      return resultant;
  }
}

// export function mandatoryGrantor(grantorInfo,formErrors) {
// let result=true;
//   grantorInfo.forEach(function (arrayItem) {
//            for(let key in arrayItem){
//                       if(!arrayItem[key])
//                       {
//                         result=false;
//                         formErrors[]
//                       }
//             }
// });
// return result
// }

export function documentChecking(index, name, value, documentObj, formErrorsInDocuments) {
  documentObj;
  let resultant;
  switch (name) {
    case 'documentNumber':
      if (documentObj['documentType'] == 1) {
        if (!validator.isInt(value)) {
          resultant = {
            key: name,
            status: false,
            message: `জাতীয় পরিচয়পত্র সাংখ্যিক দেওয়া হয়`,
          };
          return resultant;
        } else {
          formErrorsInDocuments[index][name] = '';
        }
        if (!(value.length == 10 || value.length == 17)) {
          resultant = {
            key: name,
            status: false,
            message: 'আপনার সঠিক এনআইডি প্রদান করুন',
          };
        } else {
          resultant = {
            key: name,
            status: true,
            message: '',
          };
        }
        return resultant;
      } else {
        resultant = {
          key: name,
          status: true,
          message: '',
        };
        return resultant;
      }
  }
}
