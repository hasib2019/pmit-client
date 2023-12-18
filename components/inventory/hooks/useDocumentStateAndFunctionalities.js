// const UseDocumentStateAndFunctionalities = () => {
// const handleAddDocumentList = () => {
//     setFieldValue("documentList", [
//       ...values.documentList,
//       {
//         documentType: "",
//         documentNumber: "",
//         documentPictureFront: "",
//         documentPictureFrontType: "",
//         documentPictureFrontFile: "",
//         documentPictureBack: "",
//         documentPictureBackType: "",
//         documentPictureBackFile: "",
//       },
//     ]);
//     if (values.documentList.length + 1 == documentTypes.length) {
//       setFieldValue("disableAddDoc", true);
//     } else {
//       setFieldValue("disableAddDoc", false);
//     }
//   };
//   const handleDocumentList = (e, index) => {
//     let result;
//     const { name, value } = e.target;
//     const list = [...values.documentList];
//     const documentTypeArray = [...documentTypes];
//     if (name == "documentNumber" && value.length == 20) {
//       return;
//     }
//     switch (name) {
//       case "documentType":
//         if (value != "নির্বাচন করুন") {
//           const selectedObj = documentTypeArray.find(
//             (elem) => elem.docType == value
//           );
//           formErrorsInDocuments[index]["documentNumber"] = "";
//           list[index]["documentNumber"] = "";
//           list[index]["isDocMandatory"] =
//             selectedObj["isDocNoMandatory"];
//           list[index]["docTypeDesc"] = selectedObj["docTypeDesc"];
//           break;
//         }
//       case "documentNumber":
//         if (value.length > 30) {
//           return;
//         }
//         // else {
//         //   formErrorsInDocuments[index]['documentNumber'] = ""
//         // }
//         // return;
//         break;
//     }
//     list[index][name] = value;
//     setFieldValue("documentList", list);
//   };
//   const addMoreDoc = (data, ind) => {
//     const changeAddDoc = [...values.documentList];
//     changeAddDoc[ind]["addDoc"] = true;
//     setFieldValue("documentList", [...changeAddDoc]);
//   };
//   const fileSelectedHandler = (event, index) => {
//     const { name, value } = event.target;
//     let list = [...values.documentList];
//     list[index][name] = "";
//     list[index][name + "Name"] = "";
//     if (event.target.files[0]) {
//       let file = event.target.files[0];
//       var reader = new FileReader();
//       reader.readAsBinaryString(file);
//       reader.onload = () => {
//         let base64Image = btoa(reader.result);
//         let typeStatus = fileCheck(file.type);
//         // setProfileImage(base64Image);
//         // setProfileImageType(file.type);
//         if (typeStatus.showAble && base64Image) {
//           list[index][name] = base64Image;
//           list[index][name + "Type"] = file.type;
//           list[index][name + "File"] = event.target.files[0];
//           setFieldValue("documentList", list);
//         } else if (
//           !typeStatus.showAble &&
//           base64Image &&
//           typeStatus.type == "not showable"
//         ) {
//           // list[index][name] = base64Image;
//           //setDocumentList(list);
//           list[index][name + "Name"] = file.name;
//           list[index][name + "File"] = event.target.files[0];
//           setFieldValue("documentList", list);
//         } else if (
//           !typeStatus.showAble &&
//           base64Image &&
//           typeStatus.type == "not supported"
//         ) {
//           list[index][name + "Name"] = "Invalid File Type";
//           setFieldValue("documentList", list);
//         } else if (!typeStatus.showAble && !base64Image) {
//           list[index][name + "Name"] = "File Type is not Supported";
//           setFieldValue("documentList", list);
//         }
//       };
//       reader.onerror = () => {
//         NotificationManager.error(
//           "File can not be read",
//           "Error",
//           5000
//         );
//       };
//     }
//   };
//   const deleteDocumentList = (event, index) => {
//     setFieldValue("disableAddDoc", false);
//     const arr = documentList.filter((g, i) => index !== i);
//     //  const formErr = formErrorsInDocuments.filter((g, i) => index != i);
//     setFieldValue("documentList", arr);
//     //     setFormErrorsInDocuments(formErr);
//   };
//   const removeDocumentImageFront = (e, index) => {
//     const list = [...values.documentList];
//     list[index]["documentPictureFront"] = "";
//     list[index]["documentPictureFrontType"] = "";
//     setFieldValue("documentList", list);
//   };
//   const removeDocumentImageBack = (e, index) => {
//     const list = [...documentList];
//     list[index]["documentPictureBack"] = "";
//     list[index]["documentPictureBackType"] = "";
//     setFieldValue("documentList", list);
//   };
// };
