import EmployeeInformation from 'components/coop/employee-management/EmployeeInformation';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'কর্মকর্তা/কর্মচারীর তথ্য ';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <EmployeeInformation />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
// import { Grid } from "@mui/material";
// import EmployeeInformation from "components/coop/employee-management/EmployeeInformation";
// import InnerLanding from "components/shared/layout/InnerLanding";
// import PaperFormsLayout from "components/shared/layout/PaperFormsLayout";
// import AllApprovedSamity from "components/utils/coop/AllApprovedSamity";
// import authentication from "middleware/Authentication";
// import { useState } from "react";
// import { tokenData } from "service/common";

// const index = () => {
//   const title = "কর্মকর্তা/কর্মচারীর তথ্য ";
//   const userData = tokenData();
//   const [samityId, setSamityId] = useState();
//   const [approvedSamityLevel, setApprovedSamityLevel] = useState();
//   const [selectedSamityId, setSelectedSamityId] = useState();
//   const [isDisabled, setIsDisabled] = useState(false);
// const samityDetails = localStorageData('samityInfo')
// const [samityId, setSamityId] = useState((samityDetails?.flag==="approved" && samityDetails?.role==="authorizer")? samityDetails?.id: null);
//   const handleApproveSamity = (value) => {
//     if (value) {
//       setSamityId(value.id);
//       setSelectedSamityId(value.id);
//       setApprovedSamityLevel(value.samityLevel);
//     } else {
//       setSamityId();
//       setSelectedSamityId();
//       setApprovedSamityLevel();
//     }
//   };
//   const refresh = () => {
//     setSamityId();
//     setSelectedSamityId();
//     setApprovedSamityLevel();
//   };
// const noPermission =()=>{
//   NotificationManager.warning("অনুমতি নেই", 5000)
// }
//   return (
//     <InnerLanding>
//       <PaperFormsLayout getValue={title}>
//         <Grid container className="section" spacing={2.5}>
//           {userData?.type == "user" && (
//             <AllApprovedSamity
//               {...{
//                 labelName: "সামিতির নাম",
//                 name: "approveSamityName",
//                 onChange: handleApproveSamity,
//                 value: JSON.stringify({
//                   id: samityId,
//                   samityLevel: approvedSamityLevel,
//                 }),
//                 xl: 4,
//                 lg: 4,
//                 md: 4,
//                 sm: 12,
//                 xs: 12,
//                 isDisabled,
//                 customClass: "",
//                 customStyle: {},
//                 selectedSamityId,
//               }}
//             />
//           )}
//         </Grid>
// {
//   userData?.type == "user" ?
//   <EmployeeInformation {...{ samityId, isApproval: false, refresh }} /> :
//   (userData?.type == "citizen" && samityDetails?.flag==="approved") ? <EmployeeInformation {...{ samityId, isApproval: false, refresh }} /> : noPermission()
// }

//         <EmployeeInformation {...{ samityId, refresh }} />
//       </PaperFormsLayout>
//     </InnerLanding>
//   );
// };

// export default index;

// export const getServerSideProps = authentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
