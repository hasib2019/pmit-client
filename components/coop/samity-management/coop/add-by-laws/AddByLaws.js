/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ReactQuillEditor from 'service/ReactQuillEditor';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { steperFun } from 'service/steper';
import { unescape } from 'underscore';
import { CoopRegApi, SamityType } from '../../../../../url/coop/ApiList';

const AddByeLaws = () => {
  const router = useRouter();
  const config = localStorageData('config');

  const checkPageValidation = () => {
    const getId = JSON.parse(localStorage.getItem('storeId')) ? JSON.parse(localStorage.getItem('storeId')) : null;
    if (getId == null) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
    if (getId < 1) {
      router.push({ pathname: '/coop/samity-management/coop/registration' });
    }
  };
  const getId = localStorageData('getSamityId');
  const stepIds = localStorageData('stepId');
  const samityLevel = localStorageData('samityLevel');
  const [allcontant, setAllcontant] = useState();
  // const [byLawData, setByLawData] = useState('');
  // const [byLawDataSamity, setByLawDataSamity] = useState('');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  useEffect(() => {
    checkPageValidation();
    getAddByeLawsData();
    //  samityData();
  }, []);

  const getAddByeLawsData = async () => {
    try {
      const getData = await axios.get(CoopRegApi + '?id=' + getId, config);
      let byData = getData.data.data[0].byLaw;
      if (byData != null) {
        setAllcontant(byData);
      } else {
        const showSamityInfo = await axios.get(CoopRegApi + '/' + getId, config);
        const samityTypeId = showSamityInfo.data.data.Samity[0].samityTypeId;
        // SamityType
        const SamityByLaw = await axios.get(SamityType + '&id=' + samityTypeId, config);
        const samityByLawData = SamityByLaw.data.data[0].goal;
        if (samityByLawData != null) {
          for (const element of samityByLawData) {
            if (element.samityLevel == samityLevel) {
              setAllcontant(element.goal);
            }
          }
        }
      }
      //  setByLawDataSamity(samityByLawData)
    } catch (error) {
      errorHandler(error);
    }
  };

  // const handleEditorChange = (e) => {
  //   setAllcontant({
  //     ...allcontant,
  //     contant: e.target.getContent(),
  //   });
  // };

  let onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let payload = {
      byLaw: allcontant,
    };

    try {
      const LawData = await axios.patch(CoopRegApi + '/' + getId + '/by_law', payload, config);
      //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
      steperFun(1);
      //////////////////////////////////////////////    steper code insert sention added Hasib//////////////////
      NotificationManager.success(LawData.data.message, '', 5000);
      setLoadingDataSaveUpdate(false);
      router.push({ pathname: '/coop/samity-management/coop/member-registration' });
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };
  // const clearData = () => {
  //   setByLawData('');
  //   setAllcontant({
  //     contant: '',
  //   });
  // };
  const previousPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/registration' });
  };
  const nextPage = () => {
    router.push({ pathname: '/coop/samity-management/coop/member-registration' });
  };
  return (
    <>
      <Grid container className="section">
        <Grid item lg={12} md={12} xs={12}>
          <Box>
            {/* <Editor
              initialValue={byLawData != '' ? unescape(byLawData) : unescape(byLawDataSamity)}
              init={{
                height: 400,
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
            /> */}
            <ReactQuillEditor
              {...{
                value: unescape(allcontant),
                setValue: setAllcontant,
                xl: 12,
                lg: 12,
                md: 12,
                xs: 12,
                title: 'লক্ষ্য ও উদ্দেশ্য',
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container className="btn-container">
        <Tooltip title="আগের পাতায়">
          <Button className="btn btn-primary" startIcon={<NavigateBeforeIcon />} onClick={previousPage}>
            {' '}
            আগের পাতায়
          </Button>
        </Tooltip>
        <Tooltip title={stepIds >= 2 ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}>
          {loadingDataSaveUpdate ? (
            <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="contained">
              হালনাগাদ করা হচ্ছে...
              {stepIds >= 2 ? 'হালনাগাদ করা হচ্ছে...' : 'সংরক্ষন করা হচ্ছে...'}
            </LoadingButton>
          ) : (
            <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
              {' '}
              {stepIds >= 2 ? 'হালনাগাদ করুন' : 'সংরক্ষন করুন'}
            </Button>
          )}
        </Tooltip>
        {stepIds >= 2 ? (
          <Tooltip title="পরবর্তী পাতায়">
            <Button className="btn btn-primary" onClick={nextPage} endIcon={<NavigateNextIcon />}>
              পরবর্তী পাতায়{' '}
            </Button>
          </Tooltip>
        ) : (
          ''
        )}
      </Grid>
    </>
  );
};

export default AddByeLaws;
