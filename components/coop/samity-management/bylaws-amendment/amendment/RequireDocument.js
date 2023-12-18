/* eslint-disable no-dupe-else-if */
/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import axios from 'axios';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import { serviceRules } from '../../../../../url/coop/ApiList';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// function createMarkup(value) {
//   return {
//     __html: value,
//   };
// }

// import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
// import MuiAccordion from '@mui/material/Accordion';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';
// import MuiAccordionSummary from '@mui/material/AccordionSummary';
// import { styled } from '@mui/material/styles';

// const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
//   border: `1px solid ${theme.palette.divider}`,
//   '&:not(:last-child)': {
//     borderBottom: 0,
//   },
//   '&:before': {
//     display: 'none',
//   },
// }));

// const AccordionSummary = styled((props) => (
//   <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
// ))(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
//   flexDirection: 'row-reverse',
//   '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
//     transform: 'rotate(90deg)',
//   },
//   '& .MuiAccordionSummary-content': {
//     marginLeft: theme.spacing(1),
//   },
// }));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderTop: '1px solid rgba(0, 0, 0, .125)',
// }));

import Loader from 'components/Loader';
import dynamic from 'next/dynamic';
import { localStorageData } from 'service/common';

const DynamicDocSectionHeader = dynamic(() => import('components/shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('components/shared/others/DocImage/DocSectionContent'), {
  loading: () => <Loader />,
});
const RequireDocument = ({ newAmendmentData, setNewAmendmentData, isApproval }) => {
  const config = localStorageData('config');
  const [documentType, setDocumentType] = useState([]);
  const [imageValidation, setImageValidation] = useState([]);

  const [formErrors] = useState({
    samityName: '',
    soldShare: '',
    noOfShare: '',
    sharePrice: '',
    samityDivisionId: '',
    samityDistrictId: '',
    samityUpaCityId: '',
    samityUniThanaPawId: '',
    samityDetailsAddress: '',
    memberAdmissionFee: '',
    documentType: '',
    documentNumber: '',
    documentPictureFront: '',
  });
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);
  useEffect(() => {
    serviceInfo();
  }, []);

  const serviceInfo = async () => {
    const serviceNameData = await axios.get(serviceRules + 10, config);
    setDocumentType(serviceNameData.data.data[0].featuresDetails);
  };
  const handleAddDocumentList = () => {
    setNewAmendmentData({
      ...newAmendmentData,
      documentList: [
        ...newAmendmentData.documentList,
        {
          documentType: '',
          documentNumber: '',
          documentPictureFront: '',
          documentPictureFrontType: '',
          documentPictureFrontFile: '',
          documentPictureBack: '',
          documentPictureBackType: '',
          documentPictureBackFile: '',
        },
      ],
    });
    setFormErrorsInDocuments([
      ...formErrorsInDocuments,
      {
        documentType: '',
        documentNumber: '',
        documentPictureFrontFile: '',
        documentPictureBackFile: '',
      },
    ]);
  };

  const handleDocumentList = (e, index) => {
    const { name, value } = e.target;
    const validData = documentType.find((row) => row.id == value);
    setImageValidation(validData?.documentProperties);
    const list = [...newAmendmentData.documentList];
    const erorMessage = [...formErrorsInDocuments];
    switch (name) {
      case 'documentNumber':
        list[index][name] = value;
        erorMessage[index][name] = value ? '' : 'ডকুমেন্টের নাম্বার প্রদান করুন';
        break;
      default:
        list[index][name] = parseInt(value) ? parseInt(value) : '';
        erorMessage[index][name] = value != 0 ? '' : 'ডকুমেন্টের ধরন নির্বাচন করুন';
        break;
    }
    setNewAmendmentData({
      ...newAmendmentData,
      documentList: list,
    });
  };

  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...newAmendmentData.documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setNewAmendmentData({
      ...newAmendmentData,
      documentList: [...changeAddDoc],
    });
  };

  const fileSelectedHandler = (event, index) => {
    const { name } = event.target;
    let list = [...newAmendmentData.documentList];
    list[index][name] = '';
    list[index][name + 'Name'] = '';
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let fileSize = event.target.files[0].size;
      if (fileSize > 3000000) {
        NotificationManager.error('ফাইল সাইজ 3MB এর বড় হতে পারবে না');
        return;
      }
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        let typeStatus = fileCheck(file.type);
        if (base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = event.target.files[0];
          list[index][name + 'Name'] = file.name;
          if (
            event.target.files[0].name.includes('.jpg') ||
            event.target.files[0].name.includes('.png') ||
            event.target.files[0].name.includes('.JPEG') ||
            event.target.files[0].name.includes('.pdf') ||
            event.target.files[0].name.includes('.jpeg')
          ) {
            setNewAmendmentData({
              ...newAmendmentData,
              documentList: list,
            });
          } else {
            NotificationManager.error('jpg, png, JPEG, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন');
            return;
          }
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'প্রদর্শনযোগ্য নয়') {
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = event.target.files[0];
          setNewAmendmentData({
            ...newAmendmentData,
            documentList: list,
          });
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'সমর্থিত নয়') {
          list[index][name + 'Name'] = 'ফাইল টাইপটি বৈধ নয়';
          setNewAmendmentData({
            ...newAmendmentData,
            documentList: list,
          });
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'ফাইলের ধরন সমর্থিত নয়';
          setNewAmendmentData({
            ...newAmendmentData,
            documentList: list,
          });
        }
      };
      reader.onerror = () => {
        NotificationManager.error('ফাইল পড়া যাচ্ছে না', 'Error', 5000);
      };
    }
  };

  const removeDocumentImageFront = (e, index) => {
    const list = [...newAmendmentData.documentList];
    list[index]['documentPictureFront'] = '';
    list[index]['documentPictureFrontType'] = '';
    setNewAmendmentData({
      ...newAmendmentData,
      documentList: list,
    });
  };

  const removeDocumentImageBack = (e, index) => {
    const list = [...newAmendmentData.documentList];
    list[index]['documentPictureBack'] = '';
    list[index]['documentPictureBackType'] = '';
    setNewAmendmentData({
      ...newAmendmentData,
      documentList: list,
    });
  };
  const deleteDocumentList = (event, index) => {
    const arr = newAmendmentData?.documentList?.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);
    setNewAmendmentData({
      ...newAmendmentData,
      documentList: arr,
    });
    setFormErrorsInDocuments(formErr);
  };
  return (
    <Fragment>
      <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} disableAddDoc={isApproval} />
      <DynamicDocSectionContent
        documentList={newAmendmentData?.documentList}
        documentType={documentType}
        imageValidation={imageValidation}
        handleDocumentList={handleDocumentList}
        addMoreDoc={addMoreDoc}
        fileSelectedHandler={fileSelectedHandler}
        deleteDocumentList={deleteDocumentList}
        formErrorsInDocuments={formErrorsInDocuments}
        formErrors={formErrors}
        removeDocumentImageFront={removeDocumentImageFront}
        removeDocumentImageBack={removeDocumentImageBack}
        isApproval={isApproval}
        notMandatory={true}
      />
      <span style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>{formErrors.docError}</span>
    </Fragment>
  );
};

export default RequireDocument;
