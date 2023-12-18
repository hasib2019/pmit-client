import { Box, Button, Grid } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SubHeading from 'components/shared/others/SubHeading';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { NotificationManager } from 'react-notifications';
import { FetchWrapper } from '../../../helpers/fetch-wrapper';
import FormControlJSON from 'service/form/FormControlJSON';
import RequiredFile from 'components/utils/RequiredFile';
import { fixedassetdata } from '../../../url/ApiList';
import ClearIcon from '@mui/icons-material/Clear';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Link from 'next/link';
import { decode } from 'js-base64';
import { useRouter } from 'next/router';

export default function CreateGoods({ productDetails }) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [faAsset, setFaAsset] = useState({
    itemName: '',
    itemCode: '',
    isActive: true,
    description: '',
  });
  const [faAssetErr, setFaAssetErr] = useState({
    itemNameErr: '',
    itemCodeErr: '',
  });

  useEffect(() => {
    if (productDetails == 'create') {
      return;
    } else {
      let data = JSON.parse(decode(productDetails));
      setEdit(true);
      setFaAsset(data);
    }
  }, [productDetails]);

  const handleClear = () => {
    setFaAsset({
      itemName: '',
      itemCode: '',
      isActive: true,
      description: '',
    });

    setFaAssetErr({
      itemNameErr: '',
      itemCodeErr: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaAsset({ ...faAsset, [name]: value });
    setFaAssetErr((faAssetErr) => ({
      ...faAssetErr,
      itemNameErr: name == 'itemName' ? (value == '' ? 'আইটেম নাম প্রদান করুন' : '') : faAssetErr.itemNameErr,
    }));
    setFaAssetErr((faAssetErr) => ({
      ...faAssetErr,
      itemCodeErr: name == 'itemCode' ? (value == '' ? 'আইটেম কোড প্রদান করুন' : '') : faAssetErr.itemCodeErr,
    }));
  };

  const handleSubmit = async () => {
    if (faAsset.itemName == '' || faAsset.itemCode == '') {
      NotificationManager.error('', 'সবগুলো ফিল্ড পুরন করুন', 2000);
      setFaAssetErr((faAssetErr) => ({
        ...faAssetErr,
        itemNameErr: faAsset.itemName == '' ? 'আইটেম নাম প্রদান করুন' : '',
        itemCodeErr: faAsset.itemCode == '' ? 'আইটেম কোড প্রদান করুন' : '',
      }));
      return;
    }
    const response = await FetchWrapper.post(fixedassetdata, faAsset);
    if (response) {
      NotificationManager.success('', response.message, 3000);
      router.push('/coop/fixed-asset-management/inclusion-of-goods');
    }
    setFaAsset({
      itemName: '',
      itemCode: '',
      isActive: true,
      description: '',
    });
  };

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <SubHeading>
          <div
            style={{
              display: 'flex',
              gap: '5px',
              width: '100%',
              justifyContent: 'right',
            }}
          >
            {' '}
            <Button className="btn btn-warning" onClick={handleClear} startIcon={<ClearAllIcon />}>
              ক্লিয়ার
            </Button>
            <Link href="/coop/fixed-asset-management/inclusion-of-goods" passHref>
              <Button className="btn btn-delete" startIcon={<ClearIcon />}>
                বাতিল
              </Button>
            </Link>
            <Button className="btn btn-primary" onClick={handleSubmit} startIcon={<SaveOutlinedIcon />}>
              জমা দিন
            </Button>
          </div>
        </SubHeading>
      </Box>
      <Grid container spacing={2.5} style={{ marginTop: '10px' }}>
        <FormControlJSON
          arr={[
            {
              labelName: RequiredFile('মালামালের নাম'),
              name: 'itemName',
              onChange: handleChange,
              value: faAsset.itemName == null ? '' : faAsset.itemName,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              errorMessage: faAssetErr.itemNameErr ? faAssetErr.itemNameErr : '',
              customClass: '',
              customStyle: {},
            },
            {
              labelName: RequiredFile('মালামালের কোড'),
              name: 'itemCode',
              onChange: handleChange,
              value: faAsset.itemCode == null ? '' : faAsset.itemCode,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              errorMessage: faAssetErr.itemCodeErr ? faAssetErr.itemCodeErr : '',
              customClass: '',
              customStyle: {},
            },
          ]}
        />
        {edit && (
          <FormControlJSON
            arr={[
              {
                labelName: RequiredFile('স্ট্যাটাস'),
                name: 'isActive',
                onChange: handleChange,
                defaultVal: '',
                value: faAsset.isActive,
                size: 'small',
                type: 'text',
                viewType: 'inputRadio',
                inputRadioGroup: [
                  {
                    value: true,
                    color: '#007bff',
                    rcolor: 'primary',
                    label: 'সক্রিয়',
                  },
                  {
                    value: false,
                    color: '#ed6c02',
                    rColor: 'warning',
                    label: 'নিস্ক্রিয়',
                  },
                ],
                xl: 4,
                lg: 4,
                md: 4,
                xs: 12,
                customClass: '',
                customStyle: {},
                errorMessage: '',
              },
            ]}
          />
        )}

        <FormControlJSON
          arr={[
            {
              labelName: RequiredFile('বর্ণনা'),
              name: 'description',
              onChange: handleChange,
              value: faAsset.description,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              error: faAsset.description == '' ? true : false,
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
          ]}
        />
      </Grid>
    </Fragment>
  );
}
