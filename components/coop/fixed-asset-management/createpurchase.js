import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import RequiredFile from 'components/utils/RequiredFile';
import { decode } from 'js-base64';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { bdToNum } from 'service/banglatoenglishNumber';
import { dateFormat } from 'service/dateFormat';
import engToBdNum from 'service/englishToBanglaDigit';
import FormControlJSON from 'service/form/FormControlJSON';
import { FetchWrapper } from '../../../helpers/fetch-wrapper';
import { assetInfo, fixedassetdata, purchaseFixedasset, updatepurchasefixedasset } from '../../../url/ApiList';
export default function CreatePurchase({ purchaseDetails, samityId, productid }) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [itemDropDown, setItemDropDown] = useState([]);
  const [asset, setAsset] = useState([]);
  const [isdelete, setisdelete] = useState(false);
  const [productName, setProductName] = useState({});
  const [faAsset, setFaAsset] = useState({
    itemId: '',
    purchasedBy: '',
    itemUnitPrice: '',
    itemQuantity: '',
    totalPrice: '',
    purchaseDate: '',
    description: '',
    itemName: '',
  });
  const [faAssetErr] = useState({
    itemNameErr: '',
    purchasedByErr: '',
    itemUnitPriceErr: '',
    itemQuantityErr: '',
    purchaseDateErr: '',
  });

  useEffect(() => {
    getDropdown();
    if (purchaseDetails) {
      let data = JSON.parse(decode(purchaseDetails));
      setFaAsset(data);
      getAsetInfo(data.id, samityId);
      setEdit(true);
    }
  }, []);
  const getAsetInfo = async (purchaseid, samityId) => {
    const response = await FetchWrapper.get(assetInfo + purchaseid + '/' + samityId);
    setAsset([...response]);
  };
  const getDropdown = async () => {
    const response = await FetchWrapper.get(fixedassetdata);
    setItemDropDown(response);
    if (productid) {
      const itemObj = response?.find((itm) => {
        return +itm.id === +productid;
      });
      setProductName({ ...itemObj });

      // let item = response.find((row) => row.id == productid);
      // setFaAsset((faAsset) => ({ ...faAsset, itemName: item.itemName }));
    } else {
      setProductName({ itemName: '', id: 0 });
    }
  };
  const handleStatusChange = (id, value) => {
    let temp = asset.map((item) => {
      if (item.id == id) {
        return { ...item, status: value };
      } else {
        return item;
      }
    });

    setAsset([...temp]);
  };
  const dateChanger = (date) => {
    setFaAsset({ ...faAsset, purchaseDate: date });
  };
  const handledropdownchange = (id) => {
    let itemid = Number(id);
    setFaAsset((faAsset) => ({ ...faAsset, itemId: itemid }));
    const itemObj = itemDropDown?.find((itm) => {
      return +itm.id === +itemid;
    });
    setProductName({ ...itemObj });
    if (itemid == 0) {
      setAsset([]);
    }

    if (faAsset.itemQuantity != '' && faAsset.itemQuantity != 0) {
      //if condition
      // setEdit(false);
      let item = itemDropDown.find((item) => item.id == itemid);
      let arr = [];
      for (let i = 1; i <= faAsset.itemQuantity; i++) {
        arr.push({
          id: i,
          assetCode: `${item.itemCode}-${i > 0 && i < 10 ? `00${i}` : i > 9 && i < 100 ? `0${i}` : `${i}`}`,
          status: 1,
          itemId: itemid,
          samityId: samityId,
        });
      }
      setAsset([...arr]);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let item,
      qty,
      temp,
      arr = [];
    switch (name) {
      case 'purchasedBy':
        setFaAsset({ ...faAsset, [name]: value });
        break;
      case 'description':
        setFaAsset({ ...faAsset, [name]: value });
        break;
      case 'itemUnitPrice':
        temp = bdToNum(value);
        temp = Number(temp);
        if (isNaN(temp)) {
          break;
        }
        setFaAsset({
          ...faAsset,
          [name]: temp,
          totalPrice: faAsset.itemQuantity * Number(temp),
        });
        break;
      case 'itemQuantity':
        qty = bdToNum(value);
        qty = Number(qty);
        if (isNaN(qty)) {
          break;
        }
        if (qty > 500) {
          NotificationManager.error(' ', 'মালামালের সংখ্যা ৫০০ এর বেশি হওয়া যাবে না', 2000);
          break;
        }
        if (faAsset.itemId == '') {
          NotificationManager.error(' ', 'মালামালের নাম নির্বাচন করুন', 2000);
          break;
        }
        setisdelete(true);
        item = itemDropDown.find((item) => item.id == faAsset.itemId);

        for (let i = 1; i <= qty; i++) {
          arr.push({
            id: i,
            assetCode: `${item.itemCode}-${i > 0 && i < 10 ? `00${i}` : i > 9 && i < 100 ? `0${i}` : `${i}`}`,
            status: 1,
            itemId: faAsset.itemId,
            samityId: samityId,
          });
        }
        setAsset([...arr]);

        setFaAsset({
          ...faAsset,
          [name]: qty,
          totalPrice: faAsset.itemUnitPrice * qty,
        });
        break;
      default:
        break;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      faAsset.purchasedBy == '' ||
      faAsset.purchaseDate == '' ||
      faAsset.itemUnitPrice == 0 ||
      faAsset.itemQuantity == 0 ||
      faAsset.itemUnitPrice == '' ||
      faAsset.itemQuantity == '' ||
      faAsset.itemId == ''
    ) {
      NotificationManager.error(' ', 'সবগুলো ফিল্ড পুরন করুন', 3000);
      return;
    }

    let payload = {
      purchaseDetails: {
        purchasedBy: faAsset.purchasedBy,
        itemUnitPrice: faAsset.itemUnitPrice,
        itemQuantity: faAsset.itemQuantity,
        purchaseDate: dateFormat(faAsset.purchaseDate),
        description: faAsset.description,
        itemId: faAsset.itemId,
        samityId: samityId,
      },
      assetDetails: [...asset],
    };

    const response = await FetchWrapper.post(purchaseFixedasset, payload);
    if (response) {
      NotificationManager.success('', 'সফলভাবে তৈরি করা হয়েছে', 3000);
      setFaAsset({
        itemId: '',
        purchasedBy: '',
        itemUnitPrice: '',
        itemQuantity: '',
        totalPrice: '',
        purchaseDate: '',
        description: '',
        itemName: '',
      });
      setAsset([]);
      router.push(`/coop/fixed-asset-management/purchase-of-goods`);
    }
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (
      faAsset.purchasedBy == '' ||
      faAsset.purchaseDate == '' ||
      faAsset.itemUnitPrice == 0 ||
      faAsset.itemQuantity == 0 ||
      faAsset.itemUnitPrice == '' ||
      faAsset.itemQuantity == '' ||
      faAsset.itemId == ''
    ) {
      NotificationManager.error(' ', 'সবগুলো ফিল্ড পুরন করুন', 3000);
      return;
    }

    let payload = {
      purchaseDetails: {
        purchasedBy: faAsset.purchasedBy,
        itemUnitPrice: faAsset.itemUnitPrice,
        itemQuantity: faAsset.itemQuantity,
        purchaseDate: dateFormat(faAsset.purchaseDate),
        description: faAsset.description,
        itemId: faAsset.itemId,
        samityId: samityId,
        id: faAsset.id,
      },

      assetDetails: [...asset],

      isdelete: isdelete,
    };

    const response = await FetchWrapper.post(updatepurchasefixedasset, payload);
    if (response) {
      NotificationManager.success('', 'সফলভাবে হালনাগাদ করা হয়েছে', 3000);
      setFaAsset({
        itemId: '',
        purchasedBy: '',
        itemUnitPrice: '',
        itemQuantity: '',
        totalPrice: '',
        purchaseDate: '',
        description: '',
        itemName: '',
      });
      setAsset([]);
      setEdit(false);
      router.push(`/coop/fixed-asset-management/purchase-of-goods`);
    }
  };

  return (
    <Fragment>
      <Grid container spacing={2.5} style={{ marginTop: '15px' }}>
        <Autocomplete
          style={{ marginLeft: '20px' }}
          fullWidth
          inputProps={{ style: { marginTop: '20px' } }}
          value={productName}
          onChange={(e, item) => {
            item?.id ? handledropdownchange(item?.id) : handledropdownchange('');
          }}
          options={itemDropDown}
          getOptionLabel={(option) => option.itemName}
          renderInput={(params) => (
            <TextField {...params} fullWidth label={RequiredFile('মালামালের নাম')} variant="outlined" size="small" />
          )}
        />

        <FormControlJSON
          arr={[
            {
              labelName: RequiredFile('ক্রেতার নাম'),
              name: 'purchasedBy',
              onChange: handleChange,
              value: faAsset.purchasedBy == null ? '' : faAsset.purchasedBy,
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              errorMessage: faAssetErr.purchasedByErr ? faAssetErr.purchasedByErr : '',
              customClass: '',
              customStyle: {},
            },
            {
              labelName: RequiredFile('মালামালের ক্রয়মূল্য'),
              name: 'itemUnitPrice',
              onChange: handleChange,
              value: faAsset.itemUnitPrice == null ? '' : engToBdNum(faAsset.itemUnitPrice),
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              errorMessage: faAssetErr.itemUnitPriceErr ? faAssetErr.itemUnitPriceErr : '',
              customClass: '',
              customStyle: {},
            },
            {
              labelName: RequiredFile('মোট ক্রয়কৃত মালামালের সংখ্যা'),
              name: 'itemQuantity',
              onChange: handleChange,
              value: faAsset.itemUnitPrice == null ? '' : engToBdNum(faAsset.itemQuantity),
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              customClass: '',
              customStyle: {},
            },
            {
              labelName: 'মোট ক্রয়মূল্য',
              name: 'totalPrice',
              onChange: handleChange,
              value: engToBdNum(faAsset.itemQuantity * faAsset.itemUnitPrice),
              size: 'small',
              type: 'text',
              viewType: 'textField',
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              isDisabled: true,
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: RequiredFile('ক্রয়ের তারিখ'),
              name: 'purchaseDate',
              onChange: dateChanger,
              value: faAsset.purchaseDate == null ? '' : faAsset.purchaseDate,
              size: 'small',
              type: 'date',
              viewType: 'date',
              dateFormet: 'dd/MM/yyyy',
              disableFuture: true,
              xl: 4,
              lg: 4,
              md: 4,
              xs: 12,
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
            {
              labelName: 'বর্ণনা',
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
              customClass: '',
              customStyle: {},
              errorMessage: '',
            },
          ]}
        />
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table sx={{ minWidth: 700 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">ক্রমিক নং </TableCell>
              <TableCell align="center">কোড</TableCell>
              <TableCell align="center">অবস্থা</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asset.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">{engToBdNum(index + 1)}</TableCell>
                <TableCell align="center">{row.assetCode}</TableCell>
                <TableCell align="center">
                  <FormControl size="large" variant="standard">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="itemName"
                      value={row.status}
                      onChange={(e) => {
                        handleStatusChange(row.id, e.target.value);
                      }}
                    >
                      <MenuItem value={1}>সক্রিয়</MenuItem>
                      <MenuItem value={2}>বিক্রিত </MenuItem>
                      <MenuItem value={3}>মেমারত যোগ্য</MenuItem>
                      <MenuItem value={4}>নষ্ট</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '25px',
        }}
      >
        <Button className="btn btn-primary" startIcon={<SaveOutlinedIcon />}>
          {' '}
          {!edit ? (
            <span onClick={handleSubmit}>সাবমিট করুন</span>
          ) : (
            <span onClick={handleUpdateSubmit}> হালনাগাদ করুন </span>
          )}
        </Button>
      </div>
    </Fragment>
  );
}
