import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import UserList from 'components/mainSections/adminstration/user-management/UserList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import { Fragment } from 'react';
const List = (props) => {
  return (
    <Fragment>
      <InnerLanding>
        <UserList query={props.query} />
      </InnerLanding>
    </Fragment>
  );
};

export default List;

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
