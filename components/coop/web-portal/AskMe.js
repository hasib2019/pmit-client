import { Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { unescape } from 'underscore';
import { PageData } from '../../../url/coop/PortalApiList';

function createMarkup(value) {
  return {
    __html: value,
  };
}

const AskMe = () => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');

  const [askme, setAskMe] = useState([]);

  useEffect(() => {
    getPageDetailsValue();
  }, []);

  let getPageDetailsValue = async () => {
    try {
      const pageDetailsValueData = await axios.get(PageData + getSamityId, config);

      let pageDetailsValueList = pageDetailsValueData.data.data;

      setAskMe(pageDetailsValueList);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        সচরাচর জিজ্ঞাসা
      </Typography>
      <Divider />
      {askme.map((row) =>
        row && row.pageId == 8 ? (
          <>
            <Typography variant="body1" gutterBottom sx={{ lineheight: '30px', textAlign: 'justify', p: 2 }}>
              <div dangerouslySetInnerHTML={createMarkup(row && unescape(row.content))} />
            </Typography>
          </>
        ) : (
          ''
        ),
      )}
    </>
  );
};

export default AskMe;
