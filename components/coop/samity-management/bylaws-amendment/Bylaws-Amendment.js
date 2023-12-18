/* eslint-disable no-unused-vars */
/**
 * @author Md Hasibuzzaman
 * @author Md Saifur Rahman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Grid } from '@mui/material';
import axios from 'axios';
import Loader from 'components/Loader';
import { useGetByLawAmendmentQuery } from 'features/coop/byLawsAmendment/byLawAmendmentApi';
import { useGetByLawAmendmentgetQuery } from 'features/coop/byLawsAmendment/byLawAmendmentGetApi';
import { getByLawAmendmentData } from 'features/coop/byLawsAmendment/byLawAmendmentSlice';
import { Fragment, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { bangToEng, engToBang } from 'service/numberConverter';
import { useImmer } from 'use-immer';
import { byLawsAmendmentApi } from '../../../../url/coop/ApiList';
import { bylawsDefaultValue } from './DefaultByLaws';
import DynamicByLaws from './amendment/DynamicByLaws';
import MemberAddress from './amendment/MemberAddress';
import OfficeAddress from './amendment/OfficeAddress';
import RequireDocument from './amendment/RequireDocument';
import SamityName from './amendment/SamityName';
import WorkingAddress from './amendment/WorkingAddress';

const BylawsAmendment = ({ samityId, isApproval, refresh }) => {
  const dispatch = useDispatch();
  const config = localStorageData('config');
  const [ids, setIds] = useState('');
  const [loadingDataSaveUpdate, setLoadingDataSaveUpdate] = useState(false);
  const [newAmendmentData, setNewAmendmentData] = useState({
    samityInfo: {
      samityName: '',
      memberAdmissionFee: '',
      noOfShare: '',
      sharePrice: '',
      soldShare: '',
      samityDivisionId: '',
      samityDistrictId: '',
      samityUpaCityId: '',
      samityUpaCityType: '',
      samityUniThanaPawId: '',
      samityUniThanaPawType: '',
      samityDetailsAddress: '',
      memberAreaType: '',
      workingAreaType: '',
    },
    documentList: [
      {
        documentType: '',
        documentNumber: '',
        documentPictureFront: '',
        documentPictureFrontName: '',
        documentPictureFrontType: '',
        documentPictureFrontFile: '',
        documentPictureBack: '',
        documentPictureBackName: '',
        documentPictureBackType: '',
        documentPictureBackFile: '',
        addDoc: false,
      },
    ],
  });
  const [byLawsData, setByLawsData] = useImmer();

  const [memberSelectArea, setMemberSelectArea] = useState([
    {
      divisionId: '',
      divisionIdError: '',
      districtId: '',
      districtIdError: '',
      upaCityId: '',
      upaCityIdError: '',
      upaCityType: '',
      uniThanaPawId: '',
      uniThanaPawIdError: '',
      uniThanaPawType: '',
      detailsAddress: '',
      detailsAddressError: '',
      status: 'A',
    },
  ]);
  const [workingSelectArea, setWorkingSelectArea] = useState([
    {
      divisionId: '',
      divisionIdError: '',
      districtId: '',
      districtIdError: '',
      upaCityId: '',
      upaCityIdError: '',
      upaCityType: '',
      uniThanaPawId: '',
      uniThanaPawIdError: '',
      uniThanaPawType: '',
      detailsAddress: '',
      detailsAddressError: '',
      status: 'A',
    },
  ]);
  // *********************** Existing data get and set part start *****************************
  const { data, isLoading, error } = useGetByLawAmendmentQuery(samityId);
  const {
    data: byLawsApplication,
    isLoading: byLawsLoading,
    error: byLawsError,
  } = useGetByLawAmendmentgetQuery(samityId);

  useEffect(() => {
    dispatch(getByLawAmendmentData(data?.data));
    if (byLawsApplication && byLawsApplication?.data?.id) {
      if (!byLawsLoading) {
        setIds(byLawsApplication?.data?.id);
        let byLawsGetData = byLawsApplication?.data?.data?.byLaws
          ? byLawsApplication?.data?.data?.byLaws
          : bylawsDefaultValue;
        let newByLawsGetData = byLawsGetData.map((obj) => {
          return {
            ...obj,
            data: obj.data.map((row) => {
              return { ...row, isOpen: isApproval };
            }),
          };
        });
        setByLawsData(newByLawsGetData);
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            samityName: byLawsApplication?.data?.data?.samityInfo?.samityName,
            samityTypeId: byLawsApplication?.data?.data?.samityInfo?.samityTypeId,
            memberAdmissionFee: engToBang(byLawsApplication?.data?.data?.samityInfo?.memberAdmissionFee),
            noOfShare: engToBang(byLawsApplication?.data?.data?.samityInfo?.noOfShare),
            sharePrice: engToBang(byLawsApplication?.data?.data?.samityInfo?.sharePrice),
            proposedShareCapital: engToBang(
              byLawsApplication?.data?.data?.samityInfo?.sharePrice * data?.data?.samityInfo?.noOfShare,
            ),
            soldShare: engToBang(byLawsApplication?.data?.data?.samityInfo?.soldShare),
            soldShareCapital: engToBang(
              byLawsApplication?.data?.data?.samityInfo?.sharePrice * data?.data?.samityInfo?.soldShare,
            ),
            samityDivisionId: byLawsApplication?.data?.data?.samityInfo?.samityDivisionId,
            samityDistrictId: byLawsApplication?.data?.data?.samityInfo?.samityDistrictId,
            samityUpaCityId: byLawsApplication?.data?.data?.samityInfo?.samityUpaCityId,
            samityUpaCityType: byLawsApplication?.data?.data?.samityInfo?.samityUpaCityType,
            samityUniThanaPawId: byLawsApplication?.data?.data?.samityInfo?.samityUniThanaPawId,
            samityUniThanaPawType: byLawsApplication?.data?.data?.samityInfo?.samityUniThanaPawType,
            samityDetailsAddress: byLawsApplication?.data?.data?.samityInfo?.samityDetailsAddress,
            memberAreaType: byLawsApplication?.data?.data?.samityInfo?.memberAreaType,
            workingAreaType: byLawsApplication?.data?.data?.samityInfo?.workingAreaType,
          },
          documentList: documentListResolver(byLawsApplication?.data?.data?.documentList),
        });
        setMemberSelectArea(prepareArea(byLawsApplication?.data?.data?.memberArea));
        setWorkingSelectArea(prepareArea(byLawsApplication?.data?.data?.workingArea));
      }
    } else {
      if (!isLoading) {
        const byLawsGetData = data?.data?.samityInfo?.byLaws ? data?.data?.samityInfo?.byLaws : bylawsDefaultValue;
        const newByLawsGetData = byLawsGetData.map((obj) => {
          return {
            ...obj,
            data: obj.data.map((row) => {
              return { ...row, isOpen: isApproval };
            }),
          };
        });
        setByLawsData(newByLawsGetData);
        setNewAmendmentData({
          ...newAmendmentData,
          samityInfo: {
            ...newAmendmentData.samityInfo,
            samityName: data?.data?.samityInfo?.samityName,
            samityTypeId: data?.data?.samityInfo?.samityTypeId,
            memberAdmissionFee: engToBang(data?.data?.samityInfo?.memberAdmissionFee),
            noOfShare: engToBang(data?.data?.samityInfo?.noOfShare),
            sharePrice: engToBang(data?.data?.samityInfo?.sharePrice),
            proposedShareCapital: engToBang(data?.data?.samityInfo?.sharePrice * data?.data?.samityInfo?.noOfShare),
            soldShare: engToBang(data?.data?.samityInfo?.soldShare),
            soldShareCapital: engToBang(data?.data?.samityInfo?.sharePrice * data?.data?.samityInfo?.soldShare),
            samityDivisionId: data?.data?.samityInfo?.samityDivisionId,
            samityDistrictId: data?.data?.samityInfo?.samityDistrictId,
            samityUpaCityId: data?.data?.samityInfo?.samityUpaCityId,
            samityUpaCityType: data?.data?.samityInfo?.samityUpaCityType,
            samityUniThanaPawId: data?.data?.samityInfo?.samityUniThanaPawId,
            samityUniThanaPawType: data?.data?.samityInfo?.samityUniThanaPawType,
            samityDetailsAddress: data?.data?.samityInfo?.samityDetailsAddress,
            memberAreaType: data?.data?.samityInfo?.memberAreaType,
            workingAreaType: data?.data?.samityInfo?.workingAreaType,
          },
        });
        setMemberSelectArea(prepareArea(data?.data?.memberArea));
        setWorkingSelectArea(prepareArea(data?.data?.workingArea));
      }
    }
  }, [data, isLoading, error, byLawsApplication, byLawsLoading, byLawsError, isApproval]);

  const documentListResolver = (docData) => {
    const modifiedData = docData.map((item) => {
      const { documentPictureFrontNameUrl, ...rest } = item;
      return {
        ...rest,
        documentPictureFront: documentPictureFrontNameUrl,
      };
    });

    return modifiedData;
  };

  const { byLawAmendment } = useSelector((state) => state.byLawAmendment);
  // Prepare member area and working area
  const prepareArea = (areaData) => {
    const newData = areaData?.map((obj) => {
      const {
        divisionName,
        divisionNameBangla,
        districtName,
        districtNameBangla,
        upaCityNameBangla,
        uniThanaPawNameBangla,
        ...rest
      } = obj;
      return {
        ...rest,
        divisionIdError: '',
        districtIdError: '',
        upaCityIdError: '',
        uniThanaPawIdError: '',
        detailsAddressError: '',
      };
    });
    return newData;
  };

  // ************************** Data submition part start ********************************
  const resolvedAreaArray = (data) => {
    const newData = data?.map((obj) => {
      const { divisionIdError, districtIdError, upaCityIdError, uniThanaPawIdError, detailsAddressError, ...rest } =
        obj;
      return rest;
    });

    const filteredData = newData.map((obj) => {
      if (obj.id === null) {
        return {
          divisionId: obj.divisionId,
          districtId: obj.districtId,
          upaCityId: obj.upaCityId,
          upaCityType: obj.upaCityType,
          uniThanaPawId: obj.uniThanaPawId,
          uniThanaPawType: obj.uniThanaPawType,
          detailsAddress: obj.detailsAddress,
          status: obj.status,
        };
      }
      return obj;
    });
    return filteredData;
  };

  const resetNewByLawsAmendment = () => {
    setNewAmendmentData({
      samityInfo: {
        samityName: '',
        samityTypeId: '',
        memberAdmissionFee: '',
        noOfShare: '',
        sharePrice: '',
        soldShare: '',
        samityDivisionId: '',
        samityDistrictId: '',
        samityUpaCityId: '',
        samityUpaCityType: '',
        samityUniThanaPawId: '',
        samityUniThanaPawType: '',
        samityDetailsAddress: '',
        memberAreaType: '',
        workingAreaType: '',
      },
      documentList: [
        {
          documentType: 30,
          documentNumber: '',
          documentPictureFront: '',
          documentPictureFrontName: '',
          documentPictureFrontType: '',
          documentPictureFrontFile: '',
          documentPictureBack: '',
          documentPictureBackName: '',
          documentPictureBackType: '',
          documentPictureBackFile: '',
          addDoc: false,
        },
      ],
    });
  };

  const onSubmitData = async (e) => {
    e.preventDefault();
    setLoadingDataSaveUpdate(true);
    const payloadMemberSelectArea = resolvedAreaArray(memberSelectArea);
    const payloadWorkingSelectArea = resolvedAreaArray(workingSelectArea);
    let byLawsAmendmentPost;
    const payload = {
      serviceName: 'bylaws_amendment',
      samityId,
      data: {
        samityInfo: {
          samityName: newAmendmentData.samityInfo.samityName,
          samityDivisionId:
            newAmendmentData.samityInfo.samityDivisionId && newAmendmentData.samityInfo.samityDivisionId,
          samityDistrictId:
            newAmendmentData.samityInfo.samityDistrictId && newAmendmentData.samityInfo.samityDistrictId,
          samityUpaCityId: newAmendmentData.samityInfo.samityUpaCityId && newAmendmentData.samityInfo.samityUpaCityId,
          samityUpaCityType:
            newAmendmentData.samityInfo.samityUpaCityType && newAmendmentData.samityInfo.samityUpaCityType,
          samityUniThanaPawId:
            newAmendmentData.samityInfo.samityUniThanaPawId && newAmendmentData.samityInfo.samityUniThanaPawId,
          samityUniThanaPawType:
            newAmendmentData.samityInfo.samityUniThanaPawType && newAmendmentData.samityInfo.samityUniThanaPawType,
          samityDetailsAddress:
            newAmendmentData.samityInfo.samityDetailsAddress && newAmendmentData.samityInfo.samityDetailsAddress,
          memberAreaType: newAmendmentData.samityInfo.memberAreaType && newAmendmentData.samityInfo.memberAreaType,
          workingAreaType: newAmendmentData.samityInfo.workingAreaType && newAmendmentData.samityInfo.workingAreaType,
          memberAdmissionFee:
            newAmendmentData.samityInfo.memberAdmissionFee &&
            parseInt(bangToEng(newAmendmentData.samityInfo.memberAdmissionFee)),
          noOfShare:
            newAmendmentData.samityInfo.noOfShare && parseInt(bangToEng(newAmendmentData.samityInfo.noOfShare)),
          sharePrice:
            newAmendmentData.samityInfo.sharePrice && parseInt(bangToEng(newAmendmentData.samityInfo.sharePrice)),
        },
        byLaws: byLawsData,
        documentList: newAmendmentData?.documentList,
        memberArea: payloadMemberSelectArea,
        workingArea: payloadWorkingSelectArea,
      },
    };
    try {
      if (ids) {
        byLawsAmendmentPost = await axios.put(byLawsAmendmentApi + `/${ids}`, payload, config);
      } else {
        byLawsAmendmentPost = await axios.post(byLawsAmendmentApi, payload, config);
      }
      NotificationManager.success(byLawsAmendmentPost?.data?.message, '', 5000);
      setLoadingDataSaveUpdate(false);
      // setNewAmendmentData empty setup after data update or post
      resetNewByLawsAmendment();
      refresh();
    } catch (error) {
      setLoadingDataSaveUpdate(false);
      errorHandler(error);
    }
  };
  // ************************** Data submition part end **********************************
  return (
    <Fragment>
      {isLoading || byLawsLoading ? (
        <Loader />
      ) : (
        <Fragment>
          <Grid container>
            <Grid
              item
              sm={12}
              sx={{
                textAlign: 'center',
                border: '2px solid gray',
                marginBottom: '5px',
              }}
            >
              <h1>{byLawAmendment?.samityInfo?.samityName}</h1>
              <h6>এর</h6>
              <h6>উপ-আইন সংশোধনের আবেদনের তথ্য</h6>
            </Grid>
            <Grid item sm={12} md={12} xs={12} pb={2}>
              {/* ************************ Dynamic By Laws data ************************ */}
              {byLawsData?.map((row, index) => (
                <div key={'main' + index} style={{ border: '2px solid gray', marginBottom: '5px' }}>
                  <h3
                    style={{
                      backgroundColor: 'rgb(194 221 255)',
                      padding: '5px',
                      textAlign: 'center',
                    }}
                  >
                    {row?.name}
                  </h3>
                  <div style={{ padding: '5px' }}>
                    {row?.nameEn === 'samityName_Address' ? (
                      row?.data?.map((element, i) =>
                        element?.sectionNo === '৩' && ((element?.isEdit && isApproval) || !isApproval) ? (
                          // ****************************** সমিতির নাম ***********************
                          <SamityName
                            key={i}
                            {...{
                              element,
                              index,
                              i,
                              previousByLaws: byLawAmendment?.samityInfo?.byLaws
                                ? byLawAmendment?.samityInfo?.byLaws
                                : bylawsDefaultValue,
                              byLawsData,
                              setByLawsData,
                              isApproval,
                              newAmendmentData,
                              setNewAmendmentData,
                            }}
                          />
                        ) : element?.sectionNo === '৪' && ((element?.isEdit && isApproval) || !isApproval) ? (
                          // ************************ কার্যালয়ের ঠিকানা *************************
                          <OfficeAddress
                            {...{
                              element,
                              samityInfo: byLawAmendment?.samityInfo,
                              newAmendmentData,
                              setNewAmendmentData,
                              isApproval,
                              setByLawsData,
                              index,
                              i,
                            }}
                          />
                        ) : (
                          ''
                        ),
                      )
                    ) : row?.nameEn === 'memberWorking_Area' ? (
                      row?.data?.map((element, i) =>
                        element?.areaType === 'memberArea' && ((element?.isEdit && isApproval) || !isApproval) ? (
                          // ************************** নির্বাচনী এলাকা **************************
                          <MemberAddress
                            key={i}
                            {...{
                              element,
                              memberArea: byLawAmendment?.memberArea,
                              defaultMemberAreaType: byLawAmendment?.samityInfo?.memberAreaType,
                              newAmendmentData,
                              setNewAmendmentData,
                              memberSelectArea,
                              setMemberSelectArea,
                              isApproval,
                              setByLawsData,
                              index,
                              i,
                            }}
                          />
                        ) : element?.areaType === 'workingArea' && ((element?.isEdit && isApproval) || !isApproval) ? (
                          // ************************** কর্ম এলাকা *****************************
                          <WorkingAddress
                            key={i}
                            {...{
                              element,
                              workingArea: byLawAmendment?.workingArea,
                              defaultWorkingAreaType: byLawAmendment?.samityInfo?.workingAreaType,
                              newAmendmentData,
                              setNewAmendmentData,
                              workingSelectArea,
                              setWorkingSelectArea,
                              isApproval,
                              setByLawsData,
                              index,
                              i,
                            }}
                          />
                        ) : (
                          ''
                        ),
                      )
                    ) : (
                      <DynamicByLaws
                        {...{
                          index,
                          previousByLaws: byLawAmendment?.samityInfo?.byLaws
                            ? byLawAmendment?.samityInfo?.byLaws
                            : bylawsDefaultValue,
                          byLawsData,
                          setByLawsData,
                          isApproval,
                          newAmendmentData,
                          setNewAmendmentData,
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </Grid>
          </Grid>

          {/* ****************************** প্রয়োজনীয় ডকুমেন্ট ************************ */}
          <RequireDocument
            {...{
              newAmendmentData,
              setNewAmendmentData,
              isApproval,
            }}
          />

          <Divider />
          <Grid container className="btn-container" sx={{ display: isApproval && 'none' }}>
            {loadingDataSaveUpdate ? (
              <LoadingButton
                loading
                loadingPosition="start"
                sx={{ mr: 1 }}
                startIcon={<SaveOutlinedIcon />}
                variant="outlined"
              >
                {ids ? ' হালনাগাদ হচ্ছে.......' : ' সংরক্ষন করা হচ্ছে...'}
              </LoadingButton>
            ) : (
              <Button className="btn btn-save" onClick={onSubmitData} startIcon={<SaveOutlinedIcon />}>
                {ids ? ' হালনাগাদ করুন' : ' সংরক্ষন করুন'}
              </Button>
            )}
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
};

export default BylawsAmendment;
