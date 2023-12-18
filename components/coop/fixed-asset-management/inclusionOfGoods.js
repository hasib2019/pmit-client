import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { encode } from 'js-base64';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import engToBdNum from 'service/englishToBanglaDigit';
import { FetchWrapper } from '../../../helpers/fetch-wrapper';
import { fixedassetdata } from '../../../url/ApiList';

export default function InclusionOfGoods() {
  const router = useRouter();
  const [dataGridArr, setDataGridArr] = useState([]);
  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'itemName',
      headerName: ' মালামালের নাম',
      align: 'center',
      width: 250,
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'itemCode',
      headerName: 'কোড',
      align: 'center',
      headerAlign: 'center',
      width: 130,
      editable: true,
    },
    {
      field: 'isActive',
      headerName: 'স্ট্যাটাস',
      headerAlign: 'center',
      width: 130,
      align: 'center',
    },
    {
      field: 'description',
      headerName: 'বিস্তারিত',
      headerAlign: 'center',
      align: 'center',
      width: 250,
    },
    {
      field: 'action',
      headerName: ' ',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 250,
      type: 'actions',
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="table-icon edit"
              style={{ cursor: 'pointer' }}
              onClick={() => handleEdit(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getdata();
  }, []);

  const getdata = async () => {
    const response = await FetchWrapper.get(fixedassetdata);
    setDataGridArr(response);
  };

  const handleEdit = (id) => {
    let editdata = dataGridArr.find((item) => item.id == id);
    let data = encode(JSON.stringify(editdata));
    router.push(`/coop/fixed-asset-management/inclusion-of-goods/goods-data?goods_data=${data}`);
  };

  return (
    <Fragment>
      <Box sx={{ width: '100%' }}>
        <Link href="/coop/fixed-asset-management/inclusion-of-goods/goods-data?goods_data=create" passHref>
          <Button className="btn btn-primary">
            নতুন মালামাল যোগ করুন
            <AddIcon sx={{ marginLeft: '.5rem' }} />
          </Button>
        </Link>

        <Box>
          {
            <DataGrid
              sx={{ marginTop: '2rem' }}
              autoHeight="ture"
              rows={dataGridArr}
              columns={column}
              density="compact"
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
        </Box>
      </Box>
    </Fragment>
  );
}
