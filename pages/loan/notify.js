import NotificationLayout from 'components/mainSections/loan/NotificationLayout';
import NotifyPage from 'components/mainSections/loan/NotifyPage';
import { Fragment } from 'react';

const notify = () => {
  return (
    <Fragment>
      <NotificationLayout />
      <NotifyPage />
    </Fragment>
  );
};

export default notify;
