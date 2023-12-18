/* eslint-disable @next/next/no-img-element */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ZoomSelectImage = ({ src, xs, key, type }) => {
  const [state, setState] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
  };
  return (
    <>
      {type === 'pdf' ? (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
          <Button onClick={handleOpen}>
            <img src="/pdf.png" alt="" style={xs} />
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <embed style={{ width: '100%', height: '100%' }} src={`data:application/pdf;base64,${src}`} />
            </Box>
          </Modal>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}>
          <Zoom zoomMargin={10} key={key}>
            {' '}
            {src ? (
              <img alt={key} src={'data:image/jpg;base64,' + src} style={xs} />
            ) : (
              <img alt={'/wallphoto.png'} src={'/wallphoto.png'} style={xs} />
            )}{' '}
          </Zoom>
        </div>
      )}
    </>
  );
};

export default ZoomSelectImage;
