import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { StatusCheck } from 'service/status';

const useStyles = makeStyles({
  paperStyle: {
    display: 'flex',
    justifyContent: 'start',
    margin: '0px 20px 5px 20px',
    textAlign: 'center',
    // border: "1px solid #009DAE",
    // border: "1px solid #113CFC",
  },
  paragraphTagStyle: {
    fontSize: '13px',
    width: '600px',
    display: 'flex',
    justifyContent: 'start',
    marginLeft: '20px',
    fontWeight: 600,
  },
});

function UserDetailsById({ userDetails }) {
  // ("details", userDetails);

  // Redux usage Start
  // const updatedColor = useSelector((state) => state.ColorSlice.colorBucket);
  // Redux usage End

  const style = useStyles();

  return (
    <div>
      {/* ID Start */}
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>ID : {userDetails.id !== null || undefined ? userDetails.id : ''}</p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Role ID : {userDetails.roleId !== null || undefined ? userDetails.roleId : ''}
        </p>
      </Paper>

      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Approve Status :{' '}
          {userDetails.approveStatus !== null || undefined ? StatusCheck(userDetails.approveStatus) : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Active :{' '}
          {JSON.stringify(userDetails.isActive) !== null || undefined ? JSON.stringify(userDetails.isActive) : ''}
        </p>
      </Paper>

      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          User Name : {userDetails.username !== null || undefined ? userDetails.username : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Doptor Office ID : {userDetails.doptorOfficeId !== null || undefined ? userDetails.doptorOfficeId : ''}
        </p>
      </Paper>
      {/* ID Start */}
      {/* Designation Start */}
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Designation Bangla : {userDetails.designationBn !== null || undefined ? userDetails.designationBn : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Designation English : {userDetails.designationEn !== null || undefined ? userDetails.designationEn : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Designation Level : {userDetails.designationLevel !== null || undefined ? userDetails.designationLevel : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Designation Sequence :{' '}
          {userDetails.designationSequence !== null || undefined ? userDetails.designationSequence : ''}
        </p>
      </Paper>
      {/* Designation End */}

      {/* Employee Details Start*/}

      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Employee ID : {userDetails.employeeId !== null || undefined ? userDetails.employeeId : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Employee Grade : {userDetails.employeeGrade !== null || undefined ? userDetails.employeeGrade : ''}
        </p>
      </Paper>
      {/* Employee Details End*/}

      {/* Office Data Start */}
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Office ID : {userDetails.officeId !== null || undefined ? userDetails.officeId : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Office Head : {userDetails.officeHead !== null || undefined ? userDetails.officeHead : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Office Name Bangla : {userDetails.officeNameBn !== null || undefined ? userDetails.officeNameBn : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Office Name English : {userDetails.officeNameEn !== null || undefined ? userDetails.officeNameEn : ''}
        </p>
      </Paper>

      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Office Unit ID : {userDetails.officeUnitId !== null || undefined ? userDetails.officeUnitId : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Office Unit Organogram ID :{' '}
          {userDetails.officeUnitOrganogramId !== null || undefined ? userDetails.officeUnitOrganogramId : ''}
        </p>
      </Paper>

      {/* Office Data End */}

      {/* Unit Start */}
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Unit Name Bangla : {userDetails.unitNameBn !== null || undefined ? userDetails.unitNameBn : ''}
        </p>
      </Paper>

      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Unit Name English : {userDetails.unitNameEn !== null || undefined ? userDetails.unitNameEn : ''}
        </p>
      </Paper>
      {/* Unit End */}

      {/* Other Info Start */}
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Cadre : {userDetails.isCadre !== null || undefined ? userDetails.isCadre : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          In Charge Level : {userDetails.inchargeLabel !== null || undefined ? userDetails.inchargeLabel : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Joining Data : {userDetails.joiningDate !== null || undefined ? userDetails.joiningDate : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Last Office Data : {userDetails.lastOfficeDate !== null || undefined ? userDetails.lastOfficeDate : ''}
        </p>
      </Paper>
      {/* Other Info End */}

      {/* Create, approve and updated Info Start */}

      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Last Office Data : {userDetails.lastOfficeDate !== null || undefined ? userDetails.lastOfficeDate : ''}
        </p>
      </Paper>

      {/* Create, approve and updated Info End */}
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Created By : {userDetails.createdBy !== null || undefined ? userDetails.createdBy : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Created Date : {userDetails.createDate !== null || undefined ? userDetails.createDate : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Approved By : {userDetails.approvedBy !== null || undefined ? userDetails.approvedBy : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Approved Date : {userDetails.approveDate !== null || undefined ? userDetails.approveDate : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Updated By : {userDetails.updatedBy !== null || undefined ? userDetails.updatedBy : ''}
        </p>
      </Paper>
      <Paper className={style.paperStyle}>
        <p className={style.paragraphTagStyle}>
          Update Date : {userDetails.updateDate !== null || undefined ? userDetails.updateDate : ''}
        </p>
      </Paper>
    </div>
  );
}

export default UserDetailsById;
