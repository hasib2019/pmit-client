/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SubHeading from 'components/shared/others/SubHeading';
import ToOfficeSelectItems from 'components/utils/coop/ToOfficeSelectItems';
import useGetToOffice from 'hooks/coop/useGetToOffice';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import ZoomImage from 'service/ZoomImage';
import { localStorageData, tokenData } from 'service/common';
import { dateFormat } from 'service/dateFormat';
import { errorHandler } from 'service/errorHandler';
import { numberToWord } from 'service/numberToWord';
import { unescape } from 'underscore';
import { componentReportBy } from '../../../url/ReportApi';
import { finalApproval, getAppWorkflow } from '../../../url/coop/BackOfficeApi';
import AuditAccountsInformation from '../samity-accounts-management/audit-accounts-information/AuditAccountsInformation';
import BylawsAmendment from '../samity-management/bylaws-amendment/Bylaws-Amendment';
import SamityDetailsCorrection from '../samity-management/samity-correction.jsx/SamityDetailsCorrection';
import ApprovalAbasayan from './ApprovalAbasayan';
import ApprovalAudit from './ApprovalAudit';
import ApprovalCdfAuditFee from './ApprovalCdfAuditFee';
import ApprovalCommitteeSetup from './ApprovalCommitteeSetup';
import ApprovalInvestment from './ApprovalInvestment';
import ApprovalManualSamity from './ApprovalManualSamity';
import ApprovalManualSamityCorrection from './ApprovalManualSamityCorrection';
import ApprovalMemberCorrection from './ApprovalMemberCorrection';
import ApprovalNameClearance from './ApprovalNameClearance';
import ApprovalSamityReg from './ApprovalSamityReg';
import EmployeeApproval from './EmployeeApproval';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ header: 1 }, { header: 2 }],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
];
const Input = styled('input')({
  display: 'none',
});

const Approval = (props) => {
  const config = localStorageData('config');
  const router = useRouter();
  const [approvalData, setapprovalData] = useState(null);
  const userDate = tokenData();
  const {
    serviceNames,
    defaultValue,
    isFinalAction,
    officeNames,
    designationNames,
    handleChangeSAI,
    handleChangeOffice,
    handleChange,
    handleChangeSelect,
    getServiceName,
    getOfficeName,
    branchNames,
    getBranchName,
    approval,
    applicationName,
    setApproval,
    noticeText,
    noticeId,
  } = useGetToOffice(approvalData);
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [workflowInfo, setWorkflowInfo] = useState([]);
  const [allcontant, setAllcontant] = useState('');

  useEffect(() => {
    if (props?.approvalData?.data) {
      const decodedData = JSON.parse(decodeURIComponent(props?.approvalData?.data));
      setapprovalData(decodedData);
    }
  }, [props?.approvalData?.data]);

  useEffect(() => {
    if (approvalData?.serviceId) {
      getServiceName(approvalData?.serviceId);
    }
    getOfficeName();
    AppWorkflow(approvalData?.id);
  }, [approvalData]);

  const [picimage, setPicimage] = useState({
    picimage: '',
    mimetypepic: '',
  });

  const [picNameUrl] = useState('');
  const [picName, setPicName] = useState('');
  const [flagForImage] = useState('data:image/jpeg;base64,');

  let imageChangepic = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      setPicName(file);
      reader.onload = () => {
        let base64Image = btoa(reader.result);
        setPicimage((prevState) => ({
          ...prevState,
          picimage: base64Image,
          mimetypepic: file.type,
        }));
      };
    }
    reader.onerror = () => {
      NotificationManager.error('File can not be read', '', 5000);
    };
  };

  const removeSelectedImagepic = () => {
    setPicimage({
      picimage: '',
      mimetypepic: '',
    });
  };

  const AppWorkflow = async (getApplicationId) => {
    if (getApplicationId) {
      try {
        const workflowData = approvalData?.isReportFromArchive
          ? await axios.get(getAppWorkflow + getApplicationId + `?isReportFromArchive=true`, config)
          : await axios.get(getAppWorkflow + getApplicationId, config);
        const data = workflowData.data.data;
        var obj = [...data];
        obj.sort((a, b) => a.id - b.id);
        setWorkflowInfo(obj);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    let formData = new FormData();
    formData.append(
      'designationId',
      defaultValue == 'A'
        ? 0
        : defaultValue == 'R'
          ? null
          : defaultValue == 'O'
            ? userDate.designationId
            : parseInt(approval.designationId),
    );
    formData.append('remarks', allcontant.contant ? allcontant.contant : '');
    formData.append('serviceActionId', approval.serviceActionId);
    formData.append('applicationId', parseInt(approvalData?.id));
    formData.append('serviceId', parseInt(approvalData?.serviceId));
    formData.append('attachment', picName);
    try {
      await axios.post(finalApproval, formData, config);
      NotificationManager.success(applicationName + ' ' + 'সম্পন্ন হয়েছে ', '', 5000);
      router.push({ pathname: '/coop/approval' });
      setLoadingDataSaveUpdate(false);
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };

  const convertQueryParamsToBase64 = (params) => {
    return Buffer.from(params).toString('base64');
  };

  const imageType = (imageName) => {
    if (imageName) {
      const lastWord = imageName.split('.').pop();
      return lastWord;
    }
  };

  return (
    <>
      {/* add by Hasib  */}
      {approvalData?.serviceId == 1 && (
        <ApprovalNameClearance
          id={approvalData?.id}
          samityName={approvalData?.samityName}
          samityTypeName={approvalData?.samityTypeName}
          isReportFromArchive={approvalData?.isReportFromArchive ? approvalData?.isReportFromArchive : false}
        />
      )}
      {/* add by Hasib  */}
      {approvalData?.serviceId == 2 && (
        <ApprovalSamityReg
          samityId={approvalData?.samityId}
          samityName={approvalData?.samityName}
          samityTypeName={approvalData?.samityTypeName}
          isReportFromArchive={approvalData?.isReportFromArchive ? approvalData?.isReportFromArchive : false}
        />
      )}
      {approvalData?.serviceId == 3 ||
        approvalData?.serviceId == 4 ||
        approvalData?.serviceId == 5 ||
        (approvalData?.serviceId == 9 && (
          <ApprovalCommitteeSetup
            id={approvalData?.id}
            samityId={approvalData?.samityId}
            samityName={approvalData?.samityName}
            samityTypeName={approvalData?.samityTypeName}
          />
        ))}
      {approvalData?.serviceId == 6 && (
        <ApprovalManualSamity
          id={approvalData?.id}
          samityId={approvalData?.samityId}
          samityName={approvalData?.samityName}
          samityTypeName={approvalData?.samityTypeName}
        />
      )}

      {approvalData?.serviceId == 7 && (
        <ApprovalMemberCorrection
          {...{
            samityId: approvalData?.samityId,
          }}
        />
      )}
      {approvalData?.serviceId == 8 && <EmployeeApproval id={approvalData?.id} samityName={approvalData?.samityName} />}

      {approvalData?.serviceId == 10 && (
        <BylawsAmendment {...{ samityId: parseInt(approvalData?.samityId), isApproval: true }} />
      )}

      {approvalData?.serviceId == 11 && (
        <ApprovalAbasayan
          id={approvalData?.id}
          samityId={approvalData?.samityId}
          samityName={approvalData?.samityName}
        />
      )}

      {approvalData?.serviceId == 12 && (
        <ApprovalInvestment
          id={approvalData?.id}
          samityId={approvalData?.samityId}
          samityName={approvalData?.samityName}
        />
      )}

      {approvalData?.serviceId == 13 && (
        <ApprovalAudit id={approvalData?.id} samityId={approvalData?.samityId} samityName={approvalData?.samityName} />
      )}
      {approvalData?.serviceId == 14 && (
        <AuditAccountsInformation {...{ samityId: parseInt(approvalData?.samityId), isApproval: true }} />
      )}

      {approvalData?.serviceId == 15 && (
        <ApprovalCdfAuditFee
          id={approvalData?.id}
          samityId={approvalData?.samityId}
          samityName={approvalData?.samityName}
        />
      )}

      {approvalData?.serviceId == 16 && <SamityDetailsCorrection samityId={approvalData?.samityId} isApproval={true} />}

      {approvalData?.serviceId == 18 && (
        <ApprovalManualSamityCorrection
          id={approvalData?.id}
          samityId={approvalData?.samityId}
          samityName={approvalData?.samityName}
          samityTypeName={approvalData?.samityTypeName}
        />
      )}
      <Grid container className="section">
        <Grid item xs={12}>
          <SubHeading>সংগঠিত কার্যক্রম</SubHeading>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TableContainer className="table-container">
                <Table sx={{ minWidth: 375 }} size="small" aria-label="a dense table">
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell>কার্যক্রম সম্পন্নকারী</TableCell>
                      <TableCell>কার্যক্রম</TableCell>
                      <TableCell>মন্তব্য</TableCell>
                      <TableCell align="center">তারিখ</TableCell>
                      <TableCell align="center">ডকুমেন্ট</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workflowInfo?.map((workflow, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                {workflow.sender} {workflow.senderOfficeName && '(' + workflow.senderOfficeName + ')'}
                              </div>
                            }
                            arrow
                          >
                            <span className="data">
                              {workflow.sender} {workflow.senderOfficeName && '(' + workflow.senderOfficeName + ')'}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: unescape(workflow?.actionText),
                                  }}
                                ></div>
                              </div>
                            }
                            arrow
                          >
                            <span className="data">{workflow.actionText}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={
                              <div className="tooltip-title">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: unescape(workflow?.remarks),
                                  }}
                                ></div>
                              </div>
                            }
                            arrow
                          >
                            <span className="data">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: unescape(workflow?.remarks),
                                }}
                              ></div>
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">{numberToWord('' + dateFormat(workflow?.actionDate) + '')}</TableCell>
                        <TableCell align="center">
                          <ZoomImage
                            src={workflow?.attachmentUrl}
                            imageStyle={{ width: '40px', height: '40px' }}
                            divStyle={{
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                            type={imageType(workflow?.attachment)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {!approvalData?.isReportFromArchive ? (
        <>
          <Grid container className="section">
            <Grid item xs={12}>
              <SubHeading>মন্তব্য / সুপারিশ / সিদ্বান্ত</SubHeading>
              <Grid container spacing={2.5}>
                <Grid item md={8.5} xs={12}>
                  <Typography id="modal-modal-description">
                    <ReactQuill
                      theme="snow"
                      style={{ height: '285px' }}
                      value={allcontant?.contant}
                      // modules={modules}
                      modules={{
                        toolbar: { container: toolbarOptions, handlers: {} },
                      }}
                      onChange={(e) =>
                        setAllcontant({
                          ...allcontant,
                          contant: e,
                        })
                      }
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={3.5}
                  xs={12}
                  sx={{
                    display: { md: 'unset', xs: 'flex' },
                    justifyContent: 'center',
                  }}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      minHeight: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: { xs: '250px', md: 'unset' },
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        height: { md: '275px', xs: '170px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {picimage.picimage && (
                        <div>
                          {picimage.mimetypepic === 'application/pdf' ? (
                            <Card>
                              <embed src={`data:application/pdf;base64,${picimage.picimage}`} />
                            </Card>
                          ) : (
                            <CardMedia
                              component="img"
                              image={flagForImage + picimage.picimage}
                              alt="সদস্য"
                              sx={{ maxHeight: { md: '270px', xs: '200' } }}
                            />
                          )}
                          <Button
                            variant="text"
                            component="span"
                            sx={{
                              position: 'absolute',
                              top: '0',
                              right: '0px',
                              alignSelf: 'flex-end',
                              minWidth: '20px',
                            }}
                            onClick={removeSelectedImagepic}
                          >
                            <HighlightOffSharpIcon sx={{ color: 'red' }} />
                          </Button>
                        </div>
                      )}
                      {picNameUrl && (
                        <>
                          <CardMedia component="img" sx={{ width: 200 }} image={picNameUrl} alt="সদস্য" />
                        </>
                      )}
                    </Grid>
                    <Grid
                      style={{
                        borderTop: '1px solid #eeeeee',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                          <Stack direction="row" alignItems="center" spacing={2.5}>
                            <label htmlFor="contained-button-file1">
                              <Input
                                accept="image/*"
                                id="contained-button-file1"
                                multiple
                                type="file"
                                onChange={imageChangepic}
                              />
                              <Button className="btn btn-primary" component="span" startIcon={<PhotoCamera />}>
                                সংযুক্ত করুন
                              </Button>
                            </label>
                          </Stack>
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>{' '}
          <ToOfficeSelectItems
            id={approvalData?.serviceId}
            officeNames={officeNames}
            designationNames={designationNames}
            handleChangeSAI={handleChangeSAI}
            handleChangeOffice={handleChangeOffice}
            handleChange={handleChange}
            handleChangeSelect={handleChangeSelect}
            getServiceName={getServiceName}
            getOfficeName={getOfficeName}
            branchNames={branchNames}
            getBranchName={getBranchName}
            serviceNames={serviceNames}
            defaultValue={defaultValue}
            isFinalAction={isFinalAction}
            approval={approval}
            ownOrOthers={'others'}
            setApproval={setApproval}
          />
          {approvalData?.serviceId == 11 && noticeText ? (
            <>
              <Grid container>
                <Grid item md={8} lg={8} sm={12} xs={12}>
                  <p style={{ textAlign: 'justify' }}>{noticeText}</p>
                </Grid>
                <Grid item md={4} lg={4} sm={12} xs={12} pl={2}>
                  <Button component="span" startIcon={<SimCardDownloadIcon />} variant="outlined" sx={{ mt: '6px' }}>
                    {noticeId == 2 ? (
                      <>
                        <a
                          href={`${componentReportBy}2.30_AbasayanNotice.pdf?id=${convertQueryParamsToBase64(
                            `id=${approvalData?.samityId}`,
                          )}`}
                          download="Notice.docx"
                        >
                          কারণ দর্শানোর নোটিশ ডাউনলোড
                        </a>
                      </>
                    ) : noticeId == 9 ? (
                      <>
                        <a
                          href={`${componentReportBy}2.30_AbasayanNotice.pdf?id=${convertQueryParamsToBase64(
                            `id=${approvalData?.samityId}`,
                          )}`}
                          download="Notice.docx"
                        >
                          অবসায়নের নোটিশ ডাউনলোড
                        </a>
                      </>
                    ) : noticeId == 10 ? (
                      <>
                        <a
                          href={`${componentReportBy}2.31_AbasayanStatement.pdf?id=${convertQueryParamsToBase64(
                            `id=${approvalData?.samityId}`,
                          )}`}
                          download="Notice.docx"
                        >
                          অবসায়নের প্রতিবেদন ডাউনলোড
                        </a>
                      </>
                    ) : (
                      ''
                    )}
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            ''
          )}
          {approvalData?.serviceId == 13 && noticeText ? (
            <Fragment>
              <Grid container>
                <Grid item md={8} lg={8} sm={12} xs={12}>
                  <p style={{ textAlign: 'justify' }}>{noticeText}</p>
                </Grid>
                <Grid item md={4} lg={4} sm={12} xs={12} pl={2}>
                  <Button component="span" startIcon={<SimCardDownloadIcon />} variant="outlined" sx={{ mt: '6px' }}>
                    {noticeId == 1 ? (
                      <>
                        <a
                          href={`${componentReportBy}2.35_NirikhaNotice.pdf?id=${convertQueryParamsToBase64(
                            `id=${approvalData?.samityId}`,
                          )}`}
                          download="Notice.docx"
                        >
                          নিরীক্ষার নোটিশ ডাউনলোড
                        </a>
                      </>
                    ) : (
                      <>
                        <a
                          href={`${componentReportBy}2.35_NirikhaNotice.pdf?id=${convertQueryParamsToBase64(
                            `id=${approvalData?.samityId}`,
                          )}`}
                          download="Notice.docx"
                        >
                          পূনরায় নিরীক্ষার নোটিশ ডাউনলোড
                        </a>
                      </>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Fragment>
          ) : (
            ''
          )}
          <Grid container className="btn-container">
            <Tooltip title={applicationName + ' করুন'}>
              {loadingDataSaveUpdate ? (
                <LoadingButton loading loadingPosition="start" startIcon={<SaveOutlinedIcon />} variant="outlined">
                  {applicationName + ' করা হচ্ছে...'}
                </LoadingButton>
              ) : (
                <Tooltip title={applicationName + ' করুন'}>
                  <Button
                    className={applicationName == 'বাতিল' ? 'btn btn-delete' : 'btn btn-save'}
                    onClick={(e) => onSubmitData(e)}
                    disabled={applicationName ? false : true}
                    startIcon={applicationName == 'বাতিল' ? <DeleteOutlineIcon /> : <SaveOutlinedIcon />}
                  >
                    {' '}
                    {applicationName ? applicationName : ' সংরক্ষন '} করুন
                  </Button>
                </Tooltip>
              )}
            </Tooltip>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Approval;
