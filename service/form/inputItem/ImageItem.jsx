import { PhotoCamera } from '@mui/icons-material';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { Box, Button, Card, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import RequiredFile from 'components/utils/RequiredFile';
import ZoomImage from '../../ZoomImage';
import ZoomSelectImage from '../../ZoomSelectImage';

const Input = styled('input')({
  display: 'none',
});
const ImageItem = ({ row, index }) => {
  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };
  return (
    <Grid key={index} item xl={row.xl} lg={row.lg} md={row.md} xs={row.xs} hidden={row.hidden} mt={2}>
      <Card sx={{ maxWidth: 345, margin: '10px' }}>
        <span
          style={{
            border: '2px solid #e6e1e1',
            width: '100%',
            background: 'aliceblue',
            borderRadius: '5px 5px 0 0',
            textAlign: 'center',
            fontWeight: 'bold',
            paddingTop: '3px',
          }}
        >
          {row?.imageData?.isMandatory === 'Y'
            ? RequiredFile(row?.imageData?.docTypeDesc)
            : row?.imageData?.docTypeDesc}
        </span>
        <Box
          sx={{
            height: '250px',
            border: row?.imageData?.imageError ? '1px solid red' : '',
            borderRadius: '4px',
            boxShadow: '0 2px 1px -2px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          {row?.imageData?.base64Image ? (
            <ZoomSelectImage
              src={row?.imageData?.base64Image}
              xs={{ width: '100%', height: '100%' }}
              key={index}
              type={row?.imageData?.mimeType === 'application/pdf' ? 'pdf' : ''}
            />
          ) : (
            <ZoomImage
              src={row?.imageData?.fileNameUrl}
              divStyle={row.divStyle}
              imageStyle={row.imageStyle}
              key={index}
              type={imageType(row?.imageData?.fileName)}
            />
          )}
        </Box>
        {row?.imageData?.imageError && (
          <span
            style={{
              height: '24px',
              color: 'red',
              display: 'block',
              padding: '3px',
            }}
          >
            {' '}
            {row?.imageData?.imageError}
          </span>
        )}

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} margin={1}>
          <label htmlFor={index}>
            <Input
              accept="image/*"
              id={index}
              multiple
              type="file"
              name={index}
              onChange={row.onChange}
              onClick={row.onClickRefresh}
              disabled={row.isDisabled}
            />
            <Button variant="contained" component="span" startIcon={<PhotoCamera />} disabled={row.isDisabled}>
              সংযুক্ত করুন
            </Button>
          </label>
          <Button
            onClick={row.onClickFun}
            variant="outlined"
            color="error"
            component="span"
            startIcon={<HighlightOffSharpIcon sx={{ color: 'red' }} />}
            sx={{ ml: '5px', display: row?.imageData?.base64Image ? '' : 'none' }}
          >
            বাতিল
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
};

export default ImageItem;
