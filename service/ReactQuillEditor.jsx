import { Box, Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ReactQuillEditor = ({ value, setValue, xl, lg, md, xs, title }) => {
  return (
    <Grid item xl={xl} lg={lg} md={md} xs={xs}>
      <Box style={{ padding: '0 10px 24px' }}>
        <span className="doc-title">{title} :</span>
        <ReactQuill style={{ height: '300px' }} theme="snow" value={value} onChange={setValue} />
      </Box>
    </Grid>
  );
};

export default ReactQuillEditor;
