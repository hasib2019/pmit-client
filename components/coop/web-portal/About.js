/* eslint-disable @next/next/no-img-element */
import { Divider, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { unescape } from 'underscore';
import { samityInfo } from '../../../url/coop/ApiList';
import { PageData } from '../../../url/coop/PortalApiList';

function createMarkup(value) {
  return {
    __html: value,
  };
}

const About = () => {
  const config = localStorageData();
  const getSamityId = localStorageData('reportsIdPer');

  const [abouts, setAbouts] = useState([]);
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    getPageDetailsValue();
    getSamityInfo();
  }, []);

  let getPageDetailsValue = async () => {
    try {
      const pageDetailsValueData = await axios.get(PageData + getSamityId, config);
      let pageDetailsValueList = pageDetailsValueData.data.data;
      setAbouts(pageDetailsValueList);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  let getSamityInfo = async () => {
    try {
      const samityDetailsValueData = await axios.get(samityInfo + getSamityId, config);
      let samityDetailsValueList = samityDetailsValueData.data.data;
      setLaws(samityDetailsValueList.Samity[0].byLaw);
    } catch (error) {
      ('');
      //errorHandler(error);
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        সমিতির বিবরণ
      </Typography>
      <Divider />
      {abouts?.map((row) =>
        row?.pageId == 2 ? (
          <>
            <Typography variant="body1" gutterBottom sx={{ lineheight: '30px', textAlign: 'justify', p: 2 }}>
              <div dangerouslySetInnerHTML={createMarkup(row && unescape(row.content))} />
            </Typography>
          </>
        ) : (
          ''
        ),
      )}
      <Typography variant="h6" component="div" sx={{ px: 2 }}>
        সমিতির লক্ষ্য ও উদ্দেশ্য
      </Typography>
      <Divider />
      <Typography variant="body1" gutterBottom sx={{ lineheight: '30px', textAlign: 'justify', p: 2 }}>
        <div dangerouslySetInnerHTML={createMarkup(unescape(laws))} />
      </Typography>
    </>
  );
};

export default About;
