// **************************************** Create By Md. Hasibuzzaman ************************************
import axios from 'axios';
import CoopReg from 'components/coop/samity-management/coop/registration/CoopReg';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import StepperMenu from 'components/shared/others/StyleStepper';
import authentication from 'middleware/Authentication';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageData } from 'service/common';
import { PendingCoopList } from '../../../../../url/coop/ApiList';

const Index = () => {
  const title = 'সমিতির নিবন্ধনের আবেদন';
  const config = localStorageData('config');
  const [pendingCoopData, setPendingCoopData] = useState([]);
  const [pageRedirect, setPageRedirect] = useState('');

  useEffect(() => {
    pendingList();
    activePage();
  }, []);

  const pendingList = async () => {
    try {
      const List = await axios.get(PendingCoopList, config);
      const listData = List.data.data;
      if (listData.length >= 1) {
        setPendingCoopData(listData);
        setPageRedirect(listData.length);
      } else {
        // if no pending list redirect in coop page registration page
        setPageRedirect(listData.length);
        localStorage.setItem('stepId', JSON.stringify(1));
      }
    } catch (err) {
      //
    }
  };

  const activePage = () => {
    localStorage.setItem('activePage', 1);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title} style={{ marginTop: '1rem' }}>
          <CoopReg coopNewData={pendingCoopData} pageHideShow={pageRedirect} />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default Index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
