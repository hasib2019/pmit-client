import {
  Grid
} from '@mui/material';

import SubHeading from '../../../shared/others/SubHeading';
import MemberUpdateAcc from './memberUpdateAccordion';
import SamityCreateApprovel from './samityCreateApprovel';




const MemberCreateApproval = ({ allData }) => {
  const { applicationInfo, history } = allData;



  return (
    <>
      <Grid container>
        {applicationInfo?.data?.memberInfo.map((data, i) => (
          <SamityCreateApprovel key={i} allData={allData} history={history} />
        ))}
      </Grid>
      <Grid container className="section">
        <SubHeading>সদস্যসমূহের তথ্য সংশোধন আবেদন</SubHeading>
        {applicationInfo?.data?.updateMembers.map((data, i) => (
          <MemberUpdateAcc key={i} applicationInfo={data} history={history} />
        ))}
      </Grid>
    </>
  );
};

export default MemberCreateApproval;
