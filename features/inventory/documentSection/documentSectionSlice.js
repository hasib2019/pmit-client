import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import fileCheck from 'components/mainSections/loan-management/loan-application/sanction/FileUploadTypeCheck';
import { NotificationManager } from 'react-notifications';
const initialState = {
  documentList: [
    {
      documentType: '',
      documentNumber: '',
      documentPictureFront: '',
      documentPictureFrontName: '',
      documentPictureFrontType: '',
      documentPictureFrontFile: '',

      documentPictureBack: '',
      documentPictureBackName: '',
      documentPictureBackType: '',
      documentPictureBackFile: '',
      addDoc: false,
    },
  ],
  documentType: [],
  disableAddDoc: false,
};
export const fileSelectedHandler = createAsyncThunk('inventory-document-section-file-selected', async (payload) => {
  const { event, index } = payload;
  const { name } = event.target;

  try {
    const file = event.target.files[0];
    const reader = new FileReader();
    const typeStatus = fileCheck(file.type);

    reader.readAsBinaryString(file);

    await new Promise((resolve, reject) => {
      reader.onload = () => resolve();
      reader.onerror = (error) => reject(error);
    });

    let base64Image = btoa(reader.result);

    return {
      index,
      name,
      base64Image,
      typeStatus,
      file,
    };
  } catch (error) {
    throw error;
  }
});
const documentSectionSlice = createSlice({
  name: 'inventory-document-section',
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fileSelectedHandler.pending, (state, action) => { })
      .addCase(fileSelectedHandler.fulfilled, (state, action) => {
        const { index, name, base64Image, typeStatus, file } = action.payload;
        const list = [...state.documentList];
        if (action.payload.typeStatus.showAble && action.payload.base64Image) {
          list[index][name] = base64Image;
          list[index][name + 'Type'] = file.type;
          list[index][name + 'File'] = file;
          state.documentList = list;
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not showable') {
          list[index][name + 'Name'] = file.name;
          list[index][name + 'File'] = file;
          state.documentList = list;
        } else if (!typeStatus.showAble && base64Image && typeStatus.type == 'not supported') {
          list[index][name + 'Name'] = 'Invalid File Type';
          state.documentList = list;
        } else if (!typeStatus.showAble && !base64Image) {
          list[index][name + 'Name'] = 'File Type is not Supported';
          state.documentList = list;
        }
      })
      .addCase(fileSelectedHandler.rejected, (state, action) => {
        NotificationManager.error('something went wrong');
      });
  },
  reducers: {
    handleDocumentList: (state, action) => {
      const { e, index } = action.payload;
      let result;
      const { name, value } = e.target;
      const list = [...state.documentList];
      const documentTypeArray = [...state.documentType];
      if (name == 'documentNumber' && value.length == 20) {
        return;
      }
      switch (name) {
        case 'documentType':
          if (value != 'নির্বাচন করুন') {
            const selectedObj = documentTypeArray.find((elem) => elem.docType == value);
            list[index]['documentNumber'] = '';
            list[index]['isDocMandatory'] = selectedObj['isMandatory'];
            list[index]['docTypeDesc'] = selectedObj['docTypeDesc'];
            break;
          }

        case 'documentNumber':
          if (value.length > 30) {
            return;
          }
          if (list[index]['documentType'] == 'NID' || list[index]['documentType'] == 'GID') {
            if (value.length == 18) {
              return;
            }

            list[index][name] = value.replace(/\D/gi, '');
            state.documentList = list;
            return;
          } else if (list[index]['documentType'] == 'BRN') {
            if (value.length > 19) {
              return;
            }
            list[index][name] = value.replace(/\D/gi, '');
            state.documentList = list;
            return;
          } else if (list[index]['documentType'] == 'TRN') {
            if (value.length > 19) {
              return;
            }
            list[index][name] = value;
            state.documentList = list;
          } else if (list[index]['documentType'] == 'COM') {
            if (value.length > 20) {
              return;
            }
            list[index][name] = value;
            state.documentList = list;
          }

          break;
      }

      list[index][name] = value;
      state.documentList = list;
    },
    initiallizeDocumentTypeArray: (state, action) => {
      state.documentType = action.payload;
    },
    addMoreDoc: (state, action) => {
      const { ind } = action.payload;
      const changeAddDoc = [...state.documentList];

      changeAddDoc[ind]['addDoc'] = true;
      state.documentList = [...changeAddDoc];
    },

    deleteDocumentList: (state, action) => {
      const { index } = action.payload;
      state.disableAddDoc = false;
      const arr = state.documentList.filter((g, i) => index !== i);
      state.documentList = arr;
    },
    removeDocumentImageFront: (state, action) => {
      const { index } = action.payload;
      const list = [...state.documentList];
      list[index]['documentPictureFront'] = '';
      list[index]['documentPictureFrontType'] = '';
      state.documentList = list;
    },
    removeDocumentImageBack: (state, action) => {
      const { index } = action.payload;
      const list = [...state.documentList];
      list[index]['documentPictureBack'] = '';
      list[index]['documentPictureBackType'] = '';
      state.documentList = list;
    },
    handleAddDocumentList: (state, action) => {
      state.documentList.push({
        documentType: '',
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        documentPictureBack: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
      });
      if (state.documentList.length + 1 == state.documentType.length) {
        state.disableAddDoc = true;
      } else {
        state.disableAddDoc = false;
      }
    },
    onClearDocumentList: (state, action) => {
      state.documentList = [
        {
          documentType: '',
          documentNumber: '',
          documentPictureFront: '',
          documentPictureFrontName: '',
          documentPictureFrontType: '',
          documentPictureFrontFile: '',

          documentPictureBack: '',
          documentPictureBackName: '',
          documentPictureBackType: '',
          documentPictureBackFile: '',
          addDoc: false,
        },
      ];
    },
  },
});
export default documentSectionSlice.reducer;
export const {
  initiallizeDocumentTypeArray,
  handleDocumentList,
  addMoreDoc,
  onClearDocumentList,
  deleteDocumentList,
  removeDocumentImageFront,
  removeDocumentImageBack,
  handleAddDocumentList,
} = documentSectionSlice.actions;
