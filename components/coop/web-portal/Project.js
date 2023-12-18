import { Card, CardActionArea, Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ZoomImageView from 'service/ZoomImageView';
import { PageData } from '../../../url/coop/PortalApiList';
import { localStorageData } from 'service/common';
import { unescape } from 'underscore';

function createMarkup(value) {
  return {
    __html: value,
  };
}

const Project = () => {
  const config = localStorageData('config');
  const getSamityId = localStorageData('reportsIdPer');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getPageDetailsValue();
  }, []);

  let getPageDetailsValue = async () => {
    try {
      const pageDetailsValueData = await axios.get(PageData + getSamityId, config);
      let pageDetailsValueList = pageDetailsValueData.data.data;
      setProjects(pageDetailsValueList);
    } catch (error) {
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
        প্রকল্প / কর্মসূচী
      </Typography>
      <Divider />
      {projects.map((row) =>
        row && row.pageId == 5 ? (
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

export default Project;
