
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
// ---------------Developed by Afrina & Mashroor-------------
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Box, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { numberToWord } from 'service/numberToWord';
import { allReports } from 'service/report';
import { componentReportBy } from '../../../url/ReportApi';
import { DownloadCer, samityDocument } from '../../../url/coop/ApiList';

// reportsIdTemp, reportsIdPer, status, config
const ReportTemplete = ({ samityReportId, config }) => {
  const [samityMainDocument, setSamityMainDocument] = useState([]);
  const [showDataInTable, setShowDataInTable] = useState([]);
  const [downloadLoader, setDownloadLoader] = useState(false);
  useEffect(() => {
    parmanentReport();
    tempSamityDoc();
  }, [samityReportId]);

  const parmanentReport = async () => {
    try {
      if (samityReportId && samityReportId?.flag == 'approved') {
        const getReportData = await axios.get(DownloadCer + samityReportId?.id, config);
        const data = getReportData.data.data.samityDocuments;
        if (data) {
          setSamityMainDocument(data);
        } else {
          setSamityMainDocument([]);
          NotificationManager.warning('সমিতির কোন রিপোর্ট পাওয়া যায়নি', '', 5000);
        }
      }
    } catch (error) {
      //
    }
  };

  const tempSamityDoc = async () => {
    try {
      const showData = await axios.get(samityDocument + 'samityId=' + samityReportId?.id, config);
      const mainData = showData.data.data;
      ({ mainData });
      setShowDataInTable(mainData);
    } catch (error) {
      //
    }
  };
  const convertQueryParamsToBase64 = (params) => {
    return Buffer.from(params).toString('base64');
  };

  const Download = (reportNo, id) => {
    if (reportNo == 1) {
      return window.open(
        `${componentReportBy}2.1_PrimarySamityApplication.pdf?id=${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    if (reportNo == 2) {
      // উপ-আইন
      return window.open(
        `${componentReportBy}2.2_ByLaw_PrimarySamity.pdf?id=${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    if (reportNo == 3) {
      //অঙ্গীকার নামা
      // Commitment-1
      return window.open(
        `${componentReportBy}2.3_Commitment_1.pdf?id=${convertQueryParamsToBase64(`pSamityId=${samityReportId?.id}`)}`,
      );
    }
    if (reportNo == 4) {
      //অঙ্গীকার নামা ২ Commitment-2
      return window.open(
        `${componentReportBy}2.4_Commitment_2.pdf?id= ${convertQueryParamsToBase64(`pSamityId=${samityReportId?.id}`)}`,
      );
    }
    if (reportNo == 5) {
      //প্রত্যয়ন পত্র Deposit Withdraw Certificate
      return window.open(
        `${componentReportBy}2.5_DepositWithdrawCertificate.pdf?id= ${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    if (reportNo == 6) {
      //প্রাক্কলিত বাজেট Estimated Budget
      return window.open(
        `${componentReportBy}2.6_EstimateBudget_PrimarySamity.pdf?id= ${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    if (reportNo == 7) {
      //জমা খরচ হিসাব
      return window.open(
        `${componentReportBy}2.7_DepositeWithdraw.pdf?id=${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    if (reportNo == 8) {
      //শেয়ার তালিকা Share Savings List
      return window.open(
        `${componentReportBy}2.8_ShareSavingsList.pdf?id=${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    if (reportNo == 9) {
      //কমিটির তথ্যাদি Management Committee Mobile No
      return window.open(
        `${componentReportBy}2.9_ManagmentCommitteemobile.pdf?id=${convertQueryParamsToBase64(
          `pSamityId=${samityReportId?.id}`,
        )}`,
      );
    }
    // approved samity part
    if (reportNo == 'approved') {
      samityMainDocument?.find((element) => {
        if (element.id == id) {
          const splitedText = element.documentNameUrl.split('?');
          return window.open(`${splitedText[0]}?id=${convertQueryParamsToBase64(splitedText[1])}`);
        }
      });
    }
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  const downloadLink = async (imageUrl, imageNameToDownload) => {
    setDownloadLoader(true);
    // Fetch the image
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Get the response as a Blob object
      })
      .then((blob) => {
        // Create a temporary anchor element to trigger the download
        var downloadLink = document.createElement('a');

        // Determine the file type based on the provided image name
        // const fileType = imageUrl.split('.').pop(); // Get the file extension
        // downloadLink.type = `application/${fileType}`; // Set the correct content type

        const url = new URL(imageUrl);
        const path = url.pathname;

        // Split the path by '.' and get the last part (the extension)
        const extension = path.split('.').pop();

        downloadLink.type = `application/${extension}`; // Set the correct content type
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = imageNameToDownload + '.' + extension; // Specify the desired file name

        // Trigger a click event to download the image
        downloadLink.click();
        setDownloadLoader(false);
      })
      .catch((error) => {
        setDownloadLoader(false);
        NotificationManager.warning(error, '', 2000);
      });
  };

  return (
    <>
      <Grid container style={{ display: 'flex', justifyContent: 'space-between' }} my={2} px={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container>
            {/* Note: allReports (reportName, image, md, xs, padding, FunctionName, ReportNo) */}
            {samityReportId?.flag == 'temp' ? (
              <>
                {allReports('আবেদন পত্র', '/doc.png', 4, 12, 1, Download, 1)}
                {allReports('অঙ্গীকার নামা', '/doc.png', 4, 12, 1, Download, 3)}
                {allReports('অঙ্গীকার নামা ২', '/doc.png', 4, 12, 1, Download, 4)}
                {allReports('প্রত্যয়ন পত্র', '/doc.png', 4, 12, 1, Download, 5)}
                {allReports('প্রাক্কলিত বাজেট', '/doc.png', 4, 12, 1, Download, 6)}
                {allReports('জমা খরচ হিসাব', '/doc.png', 4, 12, 1, Download, 7)}
                {allReports('শেয়ার তালিকা', '/doc.png', 4, 12, 1, Download, 8)}
                {allReports('কমিটির তথ্যাদি', '/doc.png', 4, 12, 1, Download, 9)}
                {showDataInTable?.length > 0 ? (
                  <Grid container>
                    <Grid item lg={12} md={12} xs={12}>
                      <Grid container>
                        <Grid item lg={12} md={12} xs={12}>
                          <TableContainer className="table-container">
                            <Table size="small" aria-label="a dense table">
                              <TableHead className="table-head">
                                <TableRow>
                                  <TableCell align="center">ক্রমিক নং</TableCell>
                                  <TableCell>ডকুমেন্ট নাম</TableCell>
                                  <TableCell>ডকুমেন্ট রেফারেন্স নং</TableCell>
                                  <TableCell align="center">ডকুমেন্টের ছবি</TableCell>
                                  <TableCell align="center">ডাউনলোড করুন</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {showDataInTable?.map((row, i) =>
                                  row?.documentTypeShort != 'ecn' ? (
                                    <TableRow key={row.id}>
                                      <TableCell scope="row" sx={{ textAlign: 'center' }}>
                                        {numberToWord('' + (i + 1) + '')}
                                      </TableCell>
                                      <TableCell>{row.documentTypeDesc}</TableCell>
                                      <TableCell>{row.documentNo}</TableCell>
                                      <TableCell align="center">
                                        <ZoomImage
                                          src={row?.documentNameUrl}
                                          imageStyle={{
                                            maxHeight: '40px',
                                            border: '1px solid var(--color-primary)',
                                          }}
                                          divStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                          }}
                                          key={row?.documentId}
                                          type={imageType(row?.documentName)}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Link
                                          onClick={() => downloadLink(row?.documentNameUrl, 'Download-RDCD-Object')}
                                          pasHref
                                        >
                                          {downloadLoader ? <CircularProgress /> : <SystemUpdateAltIcon />}
                                        </Link>
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ''
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}

            {samityReportId?.flag == 'approved' ? (
              <>
                {samityMainDocument.map((row) =>
                  row?.documentTypeShort == 'ecn'
                    ? allReports(row.documentTypeDesc, '/doc.png', 4, 12, 1, Download, 'approved', row.id)
                    : '',
                )}
                <Grid container>
                  <Grid item lg={12} md={12} xs={12}>
                    <Box>
                      <SubHeading>ডকুমেন্টের তথ্যাদি</SubHeading>
                      <Grid container>
                        <Grid item lg={12} md={12} xs={12}>
                          <TableContainer className="table-container">
                            <Table size="small" aria-label="a dense table">
                              <TableHead className="table-head">
                                <TableRow>
                                  <TableCell align="center">ক্রমিক নং</TableCell>
                                  <TableCell>ডকুমেন্ট নাম</TableCell>
                                  <TableCell>ডকুমেন্ট রেফারেন্স নং</TableCell>
                                  {/* <TableCell align="center">
                                    মেয়াদ শুরুর তারিখ
                                  </TableCell>
                                  <TableCell align="center">
                                    মেয়াদ উত্তীর্ণের তারিখ
                                  </TableCell> */}
                                  <TableCell align="center">ডকুমেন্টের ছবি</TableCell>
                                  <TableCell align="center">ডাউনলোড করুন</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {samityMainDocument?.map((row, i) =>
                                  row?.documentTypeShort != 'ecn' ? (
                                    <TableRow key={row.id}>
                                      <TableCell scope="row" sx={{ textAlign: 'center' }}>
                                        {numberToWord('' + (i + 1) + '')}
                                      </TableCell>
                                      <TableCell>{row.documentTypeDesc}</TableCell>
                                      <TableCell>{row.documentNo}</TableCell>
                                      {/* <TableCell align="center">
                                        {row.effectDate
                                          ? numberToWord(
                                            dateFormat(row.effectDate)
                                          )
                                          : ""}
                                      </TableCell>
                                      <TableCell align="center">
                                        {row.expireDate
                                          ? numberToWord(
                                            dateFormat(row.expireDate)
                                          )
                                          : ""}
                                      </TableCell> */}
                                      <TableCell align="center">
                                        <ZoomImage
                                          src={row?.documentNameUrl}
                                          imageStyle={{
                                            maxHeight: '40px',
                                            border: '1px solid var(--color-primary)',
                                          }}
                                          divStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                          }}
                                          key={row?.documentId}
                                          type={imageType(row?.documentName)}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        {/* <Link href={row?.documentNameUrl} pasHref>
                                          <SystemUpdateAltIcon />
                                        </Link> */}
                                        <Link
                                          href="#"
                                          onClick={() => downloadLink(row?.documentNameUrl, 'Download-RDCD-Object')}
                                        >
                                          <a>
                                            <SystemUpdateAltIcon />
                                          </a>
                                        </Link>
                                      </TableCell>
                                    </TableRow>
                                  ) : (
                                    ''
                                  ),
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportTemplete;
