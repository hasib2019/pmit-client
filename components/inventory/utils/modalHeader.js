import { DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const ModalHeader = ({ isEditMode, onClickCloseIcon, modalHeaderTitle }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: 'var(--color-primary-variant)',
        }}
      >
        <DialogTitle>{`${modalHeaderTitle} ${isEditMode ? 'হালদানাগাদ' : 'তৈরি'}`}</DialogTitle>
        <CloseIcon sx={{ margin: '10px', cursor: 'pointer' }} onClick={onClickCloseIcon} />
      </div>
    </>
  );
};
export default ModalHeader;
