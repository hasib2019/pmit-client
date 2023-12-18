import EditIcon from '@mui/icons-material/Edit';
import { Autocomplete, FormControl, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import RequiredFile from 'components/utils/RequiredFile';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { dateFormat } from 'service/dateFormat';
import engToBdNum from 'service/englishToBanglaDigit';
import { FetchWrapper } from '../../../helpers/fetch-wrapper';
import { fixedassetListdata, fixedassetdata, updateaseetinfo } from '../../../url/ApiList';

export default function ListOfGoods(props) {
  const [itemDropDown, setItemDropDown] = useState([]);
  const [productName, setProductName] = useState({});
  const [itemId, setItemId] = useState();

  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      align: 'center',
      width: 80,
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'itemId',
      headerName: 'মালামালের নাম',
      width: 200,
      editable: true,
      renderCell: (params) => {
        let item = itemDropDown.find((item) => params.row.itemId == item.id);
        return <>{item.itemName}</>;
      },
    },
    {
      field: 'assetCode',
      headerName: 'কোড',
      width: 200,
      editable: true,
    },
    {
      field: 'purchaseDate',
      headerName: 'ক্রয়ের তারিখ',
      width: 100,
      editable: true,
      renderCell: (params) => {
        return <>{dateFormat(params.row.purchaseDate)}</>;
      },
    },
    {
      field: 'purchasedBy',
      headerName: 'ক্রেতার নাম',
      width: 100,
      editable: true,
    },
    {
      field: 'itemUnitPrice',
      headerName: 'ক্রয়মূল্য',
      width: 100,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'স্ট্যাটাস',
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <FormControl size="large" variant="standard">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="itemName"
                value={params.row.status}
                onChange={(e) => {
                  handleStatusChange(params.row.id, e.target.value);
                }}
              >
                <MenuItem value={1}>সক্রিয়</MenuItem>
                <MenuItem value={2}>বিক্রিত </MenuItem>
                <MenuItem value={3}>মেমারত যোগ্য</MenuItem>
                <MenuItem value={4}>নষ্ট</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      },
    },
    {
      field: 'action',
      headerName: ' ',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 60,
      type: 'actions',
      renderCell: () => {
        return (
          <>
            <EditIcon className="table-icon edit" style={{ cursor: 'pointer' }} />
          </>
        );
      },
    },
  ];

  const [dataGridArr, setDataGridArr] = useState([]);

  useEffect(() => {
    getDropdown();
  }, []);

  const getdata = async (id) => {
    const response = await FetchWrapper.get(fixedassetListdata + id + '/' + props.samityId);

    var obj = [...response];
    obj.sort((a, b) => a.id - b.id);
    setDataGridArr(obj);
  };
  const getDropdown = async () => {
    const response = await FetchWrapper.get(fixedassetdata);
    setItemDropDown(response);
    getdata(response[0].id);
    setItemId(response[0].id);

    const itemObj = response?.find((itm) => {
      return +itm.id === +response[0].id;
    });

    setProductName({ ...itemObj });
  };
  const handledropdownchange = (id) => {
    const itemObj = itemDropDown?.find((itm) => {
      return +itm.id === +id;
    });

    setProductName({ ...itemObj });
    setItemId(id);
    getdata(id);
  };
  const handleStatusChange = (id, status) => {
    const payload = { status: status };
    FetchWrapper.post(updateaseetinfo + id + '/' + props.samityId, payload);
    NotificationManager.success('সফল্ভাবে হালনাগাদ করা হয়েছে', '', 5000);
    getdata(itemId);
  };

  return (
    <Fragment>
      <FormControl fullWidth>
        <Autocomplete
          value={productName}
          fullWidth
          inputProps={{ style: { marginTop: '20px' } }}
          onChange={(e, item) => {
            item?.id ? handledropdownchange(item?.id) : handledropdownchange('');
          }}
          options={itemDropDown}
          getOptionLabel={(option) => option.itemName}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={RequiredFile('মালামালের নাম')}
              variant="outlined"
              size="small"
              // style={{ backgroundColor: "#FFF", margin: "5dp" }}
            />
          )}
        />
      </FormControl>

      {
        <DataGrid
          sx={{ marginTop: '2rem' }}
          autoHeight="ture"
          rows={dataGridArr}
          columns={column}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          experimentalFeatures={{ newEditingApi: true }}
          localeText={{
            toolbarColumns: '',
            toolbarFilters: '',
            toolbarDensity: '',
            toolbarExport: '',
          }}
        />
      }
    </Fragment>
  );
}
