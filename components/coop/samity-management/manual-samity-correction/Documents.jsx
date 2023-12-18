import axios from 'axios';
import fileCheck from 'components/shared/others/DocImage/FileUploadTypeCheck';
import Loader from 'components/shared/others/Loader';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { serviceRules } from '../../../../url/coop/ApiList';
const DynamicDocSectionHeader = dynamic(() => import('components/shared/others/DocImage/DocSectionHeader'), {
  loading: () => <Loader />,
});
const DynamicDocSectionContent = dynamic(() => import('components/shared/others/DocImage/DocSectionContent'), {
  loading: () => <Loader />,
});
export const Documents = ({ documentList, setDocumentList, formErrors }) => {
  const config = localStorageData('config');
  const [formErrorsInDocuments, setFormErrorsInDocuments] = useState([
    {
      documentType: '',
      documentNumber: '',
      documentPictureFrontFile: '',
      documentPictureBackFile: '',
    },
  ]);
  const [imageValidation, setImageValidation] = useState([]);
  const [documentType, setDocumentType] = useState([]);

  useEffect(() => {
    serviceInfo();
  }, []);

  const serviceInfo = async () => {
    const serviceNameData = await axios.get(serviceRules + 18, config);
    setDocumentType(serviceNameData.data.data[0].featuresDetails);
  };
  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
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
    ]);
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
    const list = [...documentList];
    switch (name) {
      case 'documentNumber':
        list[index][name] = value;
        break;
      default:
        list[index][name] = parseInt(value) ? parseInt(value) : '';
        break;
    }
    setDocumentList(list);
  };
  const addMoreDoc = (data, ind) => {
    const changeAddDoc = [...documentList];
    changeAddDoc[ind]['addDoc'] = true;
    setDocumentList([...changeAddDoc]);
  };

  const fileSelectedHandler = (event, index) => {
    const { name } = event.target;
    let list = [...documentList];
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

          if (/(jpg|png|jpeg|pdf)$/i.test(event.target.files[0].name)) {
            setDocumentList(list);
          } else {
            NotificationManager.error('jpg, png, JPEG, pdf এই ফরম্যাট এ ডকুমেন্ট সংযুক্ত করুন');
          }
        } else {
          if (!typeStatus.showAble) {
            if (typeStatus.type === 'প্রদর্শনযোগ্য নয়') {
              list[index][name + 'Name'] = file.name;
              list[index][name + 'File'] = event.target.files[0];
              setDocumentList(list);
            } else if (typeStatus.type === 'সমর্থিত নয়') {
              list[index][name + 'Name'] = 'ফাইল টাইপটি বৈধ নয়';
              setDocumentList(list);
            }
          } else {
            list[index][name + 'Name'] = 'ফাইলের ধরন সমর্থিত নয়';
            setDocumentList(list);
          }
        }
      };

      reader.onerror = () => {
        NotificationManager.error('ফাইল পড়া যাচ্ছে না', 'Error', 5000);
      };
    }
  };

  const deleteDocumentList = (event, index) => {
    const arr = documentList.filter((g, i) => index !== i);
    const formErr = formErrorsInDocuments.filter((g, i) => index != i);

    setDocumentList(arr);
    setFormErrorsInDocuments(formErr);
  };

  const removeDocumentImageFront = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureFront'] = '';
    list[index]['documentPictureFrontType'] = '';
    setDocumentList(list);
  };

  const removeDocumentImageBack = (e, index) => {
    const list = [...documentList];
    list[index]['documentPictureBack'] = '';
    list[index]['documentPictureBackType'] = '';
    setDocumentList(list);
  };

  return (
    <Fragment>
      <DynamicDocSectionHeader addMoreDoc={handleAddDocumentList} />
      <DynamicDocSectionContent
        documentList={documentList}
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
        manualSamityCorrection={true}
      />
      <span style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>{formErrors.docError}</span>
    </Fragment>
  );
};
