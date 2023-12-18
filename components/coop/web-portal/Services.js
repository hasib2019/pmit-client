import { Card, CardActionArea, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ZoomImageView from 'service/ZoomImageView';
import { localStorageData } from 'service/common';
import { unescape } from 'underscore';
import { PageData } from '../../../url/coop/PortalApiList';

function createMarkup(value) {
  return {
    __html: value,
  };
}

const Services = () => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');

  const [services, setServices] = useState([]);

  useEffect(() => {
    getPageDetailsValue();
  }, []);

  let getPageDetailsValue = async () => {
    try {
      const pageDetailsValueData = await axios.get(PageData + getSamityId, config);
      let pageDetailsValueList = pageDetailsValueData.data.data;
      setServices(pageDetailsValueList);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        সেবাসমূহ
      </Typography>
      <Divider />
      {services?.map((row) =>
        row?.pageId == 4 ? (
          <>
            <Card sx={{ margin: 1 }}>
              <Typography variant="h6" component="div" sx={{ px: 2, py: 2 }}>
                <div dangerouslySetInnerHTML={createMarkup(unescape(row?.content))} />
              </Typography>
              {row?.attachment ? (
                <>
                  <CardActionArea>
                    <ZoomImageView
                      src={row?.attachment[0]?.fileNameUrl}
                      divStyle={{ height: 600, width: '100%', padding: 5 }}
                      imageStyle={{ height: '100%', width: '100%' }}
                      key={1}
                      type={imageType(row?.attachment[0]?.fileName)}
                    />
                  </CardActionArea>
                </>
              ) : (
                ''
              )}
            </Card>
          </>
        ) : (
          ''
        ),
      )}
    </>
  );
};

export default Services;
