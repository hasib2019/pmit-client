/**
 * @author Md Nazmul
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022-07-21 9.50.00
 * @modify date 2022-07-21 9.50.00
 * @desc [description]
 */

import { Link } from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import axios from 'axios';
import { liveIp } from 'config/IpAddress';
import { encode } from 'js-base64';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { localStorageData } from 'service/common';
import { samitySummaryReport, serviceRules } from '../../../url/coop/ApiList';

export function ReportShowFromData({ selectedValue }) {
  const router = useRouter();
  const config = localStorageData('config');
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [hyperLinkData, sethyperLinkData] = useState([]);

  useEffect(() => {
    getInfoForReport();
  }, [selectedValue]);

  const apiEndPoint = {
    usersInfo: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    samitySummaryByUserOffice: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    samityCategory: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}`,
    samityDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    memberDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&samityId=${selectedValue.samityId}`,
    abasayanDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    abasayanApplication: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    investmentDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    auditDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    committeeSummaryByUserOffice: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    calendarDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    rejectApplicationByServices: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}&serviceId=${selectedValue.serviceId}`,
    feeCollection: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    manualApplication: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
  };

  const getInfoForReport = async () => {
    try {
      let getReportData = await axios.get(samitySummaryReport + apiEndPoint[selectedValue.typeName], config);

      const data = getReportData?.data?.data;
      sethyperLinkData(data?.data?.map((e) => e.actionTakenForHyper));
      setTableHead(Object.keys(_.omit(data?.data[0], 'id', 'actionTakenForHyper')));
      let getData = data?.data?.map((e, i) => {
        _.omit(e, 'actionTakenForHyper');
        e.index = i;
        return e;
      });
      setTableData(getData);
    } catch (error) {
      // errorHandler(error);
    }
  };

  const viewReport = async (index, typeName) => {
    if (hyperLinkData[index].reportFrom == 'jasper') {
      const keys = Object.keys(hyperLinkData[index].params);
      let url = `${liveIp}jasper/coop/${hyperLinkData[index].reportName}?id=`;
      let idObj = ``;
      for (const [i, e] of keys.entries()) {
        if (i == 0) {
          idObj = `${e}=${hyperLinkData[index].params[e]}`;
        } else {
          idObj = `${idObj}&${e}=${hyperLinkData[index].params[e]}`;
        }
      }
      let encoded = encode(idObj);
      window.open(url + encoded);
    } else if (hyperLinkData[index].reportFrom == 'database') {
      if (typeName == 'samityDetails') {
        let encoded = encode(hyperLinkData[index].params.id);
        window.open('/reports/generated-report/samity-report/viewreport?samityId=' + encoded, '_blank');
      }

      if (typeName == 'rejectApplicationByServices') {
        (await axios.get(serviceRules + hyperLinkData[index].params.service_id, config))?.data?.data;

        router.push({
          pathname: '/approval/approvalData',
          query: {
            id: hyperLinkData[index].params.id,
            serviceId: hyperLinkData[index].params.service_id,
            samityName: hyperLinkData[index].params.samity_name,
            samityTypeName: hyperLinkData[index].params.samity_type_name,
            serviceName: hyperLinkData[index].params.service_name,
            samityId: hyperLinkData[index].params.samity_id,
            isReportFromArchive: true,
          },
        });
      }
    }
  };

  const columns = tableHead?.map((e) => {
    return e == selectedValue?.hyperLinkAction[0]?.nameOfTheColumn
      ? {
          headerName: e,
          filterable: true,
          type: 'string',
          width: e == 'সমিতির ধরণ' ? 100 : e == 'সমিতির নাম' ? 350 : 350,
          height: 100,
          field: e,
          valueGetter: (params) => (params.row[e] ? params.row[e] : 'বিদ্যমান নেই'),
          renderCell: (params) => (
            <p>
              {' '}
              <Link
                onClick={() => {
                  viewReport(params.id, selectedValue.typeName);
                }}
                sx={{ cursor: 'pointer' }}
              >
                {params.value}
              </Link>
            </p>
          ),
        }
      : {
          headerName: e,
          filterable: true,
          width:
            e == 'ক্রমিক'
              ? 60
              : e == 'সমিতির অবস্থা'
              ? 100
              : e == 'মূল নিবন্ধন নম্বর' || e == 'সমিতির সার্টিফিকেট' || e == 'মোবাইল নম্বর'
              ? 150
              : e == 'সমিতি গঠনের তারিখ' || e == 'সমিতি নিবন্ধনের তারিখ'
              ? 160
              : e == 'সমিতির নিবন্ধন নম্বর' || e == 'অথরাইজড পারসন' || e == 'এনআইডি/জন্ম নিবন্ধন'
              ? 180
              : e == 'সমিতির ক্যাটাগরি' || e == 'উদ্যোগী সংস্থার নাম' || e == 'প্রকল্পের নাম'
              ? 250
              : e == 'বিস্তারিত ঠিকানা' || e == 'সদস্য নির্বাচনী এলাকা' || e == 'কর্ম এলাকা'
              ? 500
              : 380,
          height: 100,
          type: 'string',
          field: e,
          valueGetter: (params) => (params.row[e] ? params.row[e] : 'বিদ্যমান নেই'),
          renderCell: (params) => (
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: params.value,
                }}
              />
            </p>
          ),
        };
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            utf8WithBom: true,
          }}
        />
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <DataGrid
        rows={tableData}
        columns={columns}
        getRowId={(row) => row.index}
        density="compact"
        localeText={{
          toolbarColumns: '',
          toolbarFilters: '',
          toolbarDensity: '',
          toolbarExport: '',
        }}
        components={{
          Toolbar: CustomToolbar,
        }}
        sx={{
          minHeight: 400,
          width: '100%',
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
    </>
  );
}
