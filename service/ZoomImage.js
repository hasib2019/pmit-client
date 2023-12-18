/* eslint-disable @next/next/no-img-element */
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ZoomImage = ({ src, imageStyle, divStyle, key, type }) => {
  const [state, setState] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
  };
  useEffect(() => {
    imageConvert(src);
  }, [src]);

  const imageConvert = async (image) => {
    try {
      const imageConvert = await axios.get(image, { responseType: 'blob' });
      const fileImage = imageConvert.data;
      let base64String;
      let reader = new FileReader();
      reader.readAsDataURL(fileImage);
      reader.onloadend = () => {
        base64String = reader.result;
        setState(base64String.substr(base64String.indexOf(',') + 1));
      };
    } catch (error) {
      // errorHandler(error)
    }
  };
  return (
    <>
      {type === 'pdf' ? (
        <div style={divStyle}>
          <Button onClick={handleOpen}>
            <img src="/pdf.png" alt="" style={imageStyle} />
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <embed style={{ width: '100%', height: '100%' }} src={`data:application/pdf;base64,${state}`} />
            </Box>
          </Modal>
        </div>
      ) : (
        <div style={divStyle}>
          <Zoom zoomMargin={10} key={key}>
            {' '}
            {src ? (
              <img alt={key} src={src} style={imageStyle} />
            ) : (
              <img alt={'/wallphoto.png'} src={'/wallphoto.png'} style={imageStyle} />
            )}{' '}
          </Zoom>
        </div>
      )}
    </>
  );
};

export default ZoomImage;
