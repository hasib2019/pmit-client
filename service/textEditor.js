import { Box, Grid, Typography } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import SubHeading from 'components/shared/others/SubHeading';

export const tinyTextEditor = (editText, handleEditorChange, xl, lg, md, xs, title) => {
  return (
    <Grid item xl={xl} lg={lg} md={md} xs={xs}>
      <Box style={{ padding: '0 10px 24px' }}>
        <span className="doc-title">{title} :</span>
        <Editor
          initialValue={editText}
          init={{
            height: 300,
            width: 'auto',
            menubar: true,
            plugins: [
              'advlist autolink lists link image',
              'charmap print preview anchor help',
              'searchreplace visualblocks code',
              'insertdatetime media table paste wordcount',
            ],
            toolbar:
              'undo redo | formatselect | bold italic | \
             alignleft aligncenter alignright | \
             bullist numlist outdent indent | help',
            selector: 'textarea',
            toolbar_mode: 'floating',
          }}
          scriptLoading={{ async: true }}
          apiKey="vm7i98491i3edu2qhl2u353lfkpx2qk8up90qkilr4a87osu"
          onChange={handleEditorChange}
        />
      </Box>
    </Grid>
  );
};
