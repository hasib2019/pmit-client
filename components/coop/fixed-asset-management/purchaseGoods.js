import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { encode } from 'js-base64';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { dateFormat } from 'service/dateFormat';
import engToBdNum from 'service/englishToBanglaDigit';
import { FetchWrapper } from '../../../helpers/fetch-wrapper';
import { fixedassetdata, purchaseFixedasset } from '../../../url/ApiList';

export default function PurchaseGoods({ samityId }) {
  const router = useRouter();
  const [itemDropDown, setItemDropDown] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);

  const column = [
    {
      field: 'index',
      headerName: 'ক্রমিক নং',
      align: 'center',
      headerAlign: 'center',
      width: 80,
      renderCell: (index) => {
        return engToBdNum(index.api.getRowIndex(index.row.id) + 1);
      },
    },
    {
      field: 'itemId',
      headerName: 'আইটেম নাম',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      editable: true,
      renderCell: (params) => {
        let obj = itemDropDown?.find((item) => item.id == params.row.itemId);
        return obj.itemName ? obj.itemName : '';
      },
    },
    {
      field: 'itemUnitPrice',
      headerName: 'আইটেমের প্রাইস',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      editable: true,
    },
    {
      field: 'itemQuantity',
      headerName: 'আইটেমের পরিমান',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      editable: true,
    },
    {
      field: 'purchaseDate',
      headerName: 'ক্রয়ের তারিখ',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      editable: true,
      renderCell: (params) => {
        return dateFormat(params.row.purchaseDate);
      },
    },
    {
      field: 'purchasedBy',
      headerName: 'ক্রেতার নাম',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'বিবরণ',
      align: 'center',
      headerAlign: 'center',
      width: 150,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'অবস্থা',
      align: 'center',
      headerAlign: 'center',
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <EditIcon
              className="table-icon edit"
              style={{ cursor: 'pointer' }}
              onClick={() => handleEdit(params.row)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getDropdown();
    getdata();
  }, [samityId]);

  const getdata = async () => {
    const response = await FetchWrapper.get(purchaseFixedasset + samityId);
    setPurchaseData(response);
  };
  const getDropdown = async () => {
    const response = await FetchWrapper.get(fixedassetdata);
    setItemDropDown(response);
  };

  const handleEdit = (data) => {
    const payload = {
      id: data.id,
      itemId: data.itemId,
      itemQuantity: data.itemQuantity,
      itemUnitPrice: Number(data.itemUnitPrice),
      purchaseDate: data.purchaseDate,
      purchasedBy: data.purchasedBy,
      description: data.description,
    };
    const productid = data.itemId;
    const encrypedData = encode(JSON.stringify(payload));
    router.push(
      `/coop/fixed-asset-management/purchase-of-goods/create-purchase?purchase_details=${encrypedData}&samityId=${samityId}&productId=${productid}`,
    );
  };

  return (
    <Fragment>
      <Link passHref href={`/coop/fixed-asset-management/purchase-of-goods/create-purchase?samityId=${samityId}`}>
        <Button className="btn btn-primary">
          নতুন মালামাল ক্রয়/সংযোজন
          <AddIcon sx={{ marginLeft: '.5rem' }} />
        </Button>
      </Link>
      <Box>
        {
          <DataGrid
            sx={{ marginTop: '2rem' }}
            autoHeight="true"
            rows={purchaseData}
            columns={column}
            components={{ Toolbar: GridToolbar }}
            pageSize={10}
            density="compact"
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
    </Fragment>
  );
}
