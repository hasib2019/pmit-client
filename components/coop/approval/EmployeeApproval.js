import { Divider, Grid, Typography } from '@mui/material';
import useGetSamityDataById from 'hooks/coop/useGetSamityDataById';
import { useEffect, useReducer } from 'react';
import { dateFormat } from 'service/dateFormat';
import { employeeInfoInitialState, employeeInfoReducer } from 'service/employee/employeeStateAndFurction';
const EmployeeApproval = ({ id, samityName }) => {
  const [state, dispatch] = useReducer(employeeInfoReducer, employeeInfoInitialState);
  const samityId = id;
  const { getSmaityDataById, employeeInfo, imageDocument, signatureDocument } = useGetSamityDataById();

  useEffect(() => {
    getSmaityDataById(samityId);
  }, []);
  useEffect(() => {
    setEmployeeInfoInEditMode();
  }, [employeeInfo]);
  useEffect(() => {
    setImageDocumentInEditdMode();
  }, [imageDocument]);
  useEffect(() => {
    setSignatureDocumentInEditMode();
  }, [signatureDocument]);
  const setEmployeeInfoInEditMode = () => {
    if (employeeInfo) {
      dispatch({ type: 'setEmployeeInfo', value: employeeInfo });
    }
  };
  const setImageDocumentInEditdMode = () => {
    if (imageDocument) {
      dispatch({ type: 'setImageDocument', value: imageDocument });
    }
  };
  const setSignatureDocumentInEditMode = () => {
    if (signatureDocument) {
      dispatch({ type: 'setSignatureDocument', value: signatureDocument });
    }
  };

  return (
    <>
      <Grid item md={12} xs={12} mx={2} my={2} px={2} py={2} sx={{ backgroundColor: '#5fc5cf', borderRadius: '10px' }}>
        <Grid container spacing={2.5} sx={{ color: '#000e73' }}>
          <Grid item md={12} xs={12}>
            <Typography variant="h5" component="div">
              কর্মকর্তা /কর্মচারীর তথ্য নিবন্ধনের আবেদন
            </Typography>
          </Grid>
          <Divider />

          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>সমিতির নাম : </span>
            <span> {samityName}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>কর্মকর্তার আইডি : </span>
            <span> {state.employeeInfo.employeeId}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>এনআইডি : </span>
            <span> {state.employeeInfo.nid}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>জন্ম নিবন্ধন : </span>
            <span> {state.employeeInfo.brn}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>জন্ম তারিখ : </span>
            <span> {dateFormat(state.employeeInfo.dob)}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>নাম : </span>
            <span> {state.employeeInfo.name}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>পিতার নাম : </span>
            <span> {state.employeeInfo.fatherName}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>মাতার নাম : </span>
            <span> {state.employeeInfo.motherName}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>বৈবাহিক অবস্থা : </span>
            <span> {state.employeeInfo.maritalStatusId.label}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>স্বামী/ স্ত্রীর নাম : </span>
            <span> {state.employeeInfo.spouseName}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>শিক্ষাগত যোগ্যতা : </span>
            <span> {state.employeeInfo.educationalQualification.label}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>পদবী : </span>
            <span> {state.employeeInfo.designationId?.label}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>পদমর্যাদাক্রম : </span>
            <span> {state.employeeInfo.ranking}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>ধর্ম : </span>
            <span> {state.employeeInfo.religion.label}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>অভিজ্ঞতা : </span>
            <span> {state.employeeInfo.experience}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>বর্তমান ঠিকানা : </span>
            <span> {state.employeeInfo.presentAddress}</span>
          </Grid>
          <Grid item md={6} xs={12}>
            <span style={{ fontSize: '35px' }}>স্থায়ী ঠিকানা : </span>
            <span> {state.employeeInfo.permanentAddress}</span>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default EmployeeApproval;
