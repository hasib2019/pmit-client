/**
 * @author Md Nazmul
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022-07-21 9.50.00
 * @modify date 2022-07-21 9.50.00
 * @desc [description]
 */

import { Grid, Link } from '@mui/material';
import axios from 'axios';
import { encode } from 'js-base64';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { reportFromDatabase, serviceRules } from '../../../url/ApiList';

import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { liveIp } from 'config/IpAddress';
import { useRouter } from 'next/router';
import { localStorageData } from 'service/common';
export function ReportShowFromData({ selectedValue }) {
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [hyperLinkData, sethyperLinkData] = useState([]);
  // const [alignTableItems, setAlignTableItems] = useState({});
  const router = useRouter();
  const config = localStorageData('config');

  useEffect(() => {
    getInfoForReport();
  }, []);

  useEffect(() => {
    getInfoForReport();
  }, [selectedValue]);

  useEffect(() => {}, [tableData]);

  const apiEndPoint = {
    // samitySummaryByUserOffice: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    // samityCategory: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    // samityDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    // memberDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&samityId=${selectedValue.samityId}`,
    // committeeSummaryByUserOffice: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    // calendarDetails: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}`,
    rejectApplicationByServices: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&officeId=${selectedValue.officeId}&serviceId=${selectedValue.serviceId}`,
    purchaseInfo: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}&fromDate=${selectedValue.fromDate}&toDate=${selectedValue.toDate}`,
    userRoleFeatureReport: `/${selectedValue.typeName}?formName=${selectedValue.reportBunchName}`,
  };

  const getInfoForReport = async () => {
    if (selectedValue.typeName) {
      try {
        let data = (await axios.get(reportFromDatabase + apiEndPoint[selectedValue.typeName], config)).data?.data;
        sethyperLinkData(data.data.map((e) => e.actionTakenForHyper));
        setTableHead(Object.keys(_.omit(data.data[0], 'id', 'actionTakenForHyper', 'created_by')));
        setTableData(
          data.data.map((e, i) => {
            _.omit(e, 'actionTakenForHyper', 'created_by');
            e.index = i;
            return e;
          }),
        );
        // setAlignTableItems(data.alignItems);
      } catch (ex) {
        'reportFromDatabseError', ex;
        //
      }
    }
  };

  // const actionOnHyperLink = () => {};

  // const getMemberInfo = async () => {
  //   if (
  //     selectedValue.typeName &&
  //     selectedValue.officeId &&
  //     selectedValue.samityId
  //   ) {
  //     try {
  //       let data = (
  //         await axios.get(
  //           ApprovalSamityMemberList + `${selectedValue.samityId}`,
  //           config
  //         )
  //       ).data?.data;

  //       setTableHead(Object.keys(_.omit(data[0], "id")));

  //       setTableData(data);
  //     } catch (ex) {
  //       //
  //     }
  //   }
  // };

  // const getCommitteeInfo = async () => { };
  const viewReport = async (index, typeName) => {
    if (hyperLinkData[index].reportFrom == 'jasper') {
      const keys = Object.keys(hyperLinkData[index].params);
      let url = ``;
      for (const [i, e] of keys.entries()) {
        if (i == 0) {
          url = `${url}&${e}=${hyperLinkData[index].params[e]}`;
        } else {
          url = `${url}&${e}=${hyperLinkData[index].params[e]}`;
        }
      }
      //  url = `${url}&pDoptorId=${selectedValue.doptorId}`;
      const componentName = localStorageData('componentName');
      window.open(
        `${liveIp}jasper/${componentName}/${hyperLinkData[index].reportName}?id=${Buffer.from(url).toString('base64')}`,
      );
    } else if (hyperLinkData[index].reportFrom == 'database') {
      if (typeName == 'samityDetails') {
        let encoded = encode(hyperLinkData[index].params.id);
        window.open('/reports/generated-report/samity-report/viewreport?samityId=' + encoded, '_blank');
      }

      if (typeName == 'rejectApplicationByServices') {
        'hyperLinkData[index].params.service_id', hyperLinkData[index].params.service_id;
        const serviceInfo = (await axios.get(serviceRules + hyperLinkData[index].params.service_id, config)).data?.data;

        ({ serviceInfo });
        let base64Data = JSON.stringify({
          id: hyperLinkData[index].params.id,
          serviceId: hyperLinkData[index].params.service_id,
          isReportFromDatabase: true,
        });
        base64Data = btoa(base64Data);
        router.push({
          pathname: '/approval/approvalData',
          query: {
            data: base64Data,
          },
        });
      }
    }
  };

  // const dataForGrid = {
  //   dataSet: { ...tableData },
  //   visibleFields: tableHead,
  //   rowLength: 100,
  // };

  const columns = tableHead?.map((e) => {
    return e == selectedValue?.hyperLinkAction[0]?.nameOfTheColumn
      ? {
          headerName: e,
          filterable: true,
          minWidth: 50,
          width: 280,
          type: 'string',
          field: e,
          renderCell: (params) => (
            <Link
              onClick={() => {
                viewReport(params.id, selectedValue.typeName);
              }}
              sx={{ cursor: 'pointer' }}
            >
              {params.value}
            </Link>
          ),
        }
      : {
          headerName: e,
          filterable: true,
          width: e == 'ক্রমিক' ? 50 : 170,
          type: 'string',
          field: e,
        };
  });

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Grid container p={3}>
        <Grid item md={12} xs={12}>
          {tableData.length > 0 ? (
            <div style={{ height: 600, width: '100%' }}>
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
              />
            </div>
          ) : (
            <></>
          )}

          {/* <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead sx={{ backgroundColor: "#1976d2" }}>
                  <TableRow>
                    {tableHead?.map((element, index) => {
                      return (
                        <TableCell
                          key={index}
                          sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                          align={
                            alignTableItems[element]
                              ? alignTableItems[element]
                              : "left"
                          }
                        >
                          {element}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData?.map((element, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {tableHead?.map((e, i) => {
                          return e.trim() ==
                            selectedValue?.hyperLinkAction[0]?.nameOfTheColumn ? (
                            <TableCell
                              key={i}
                              component="th"
                              scope="row"
                              align={
                                alignTableItems[e] ? alignTableItems[e] : "left"
                              }
                            >
                              <Link
                                onClick={(e) => {
                                  viewReport(index, selectedValue.typeName);
                                }}
                                sx={{ cursor: "pointer" }}
                              >
                                {tableData[index][e]}
                              </Link>
                            </TableCell>
                          ) : (
                            <TableCell
                              component="th"
                              scope="row"
                              align={
                                alignTableItems[e] ? alignTableItems[e] : "left"
                              }
                            >
                              {tableData[index][e]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer> */}
        </Grid>
      </Grid>
    </>
  );
}
