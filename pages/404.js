/* eslint-disable @next/next/no-img-element */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */
import InnerLanding from 'components/shared/layout/InnerLanding';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import styles from '../styles/Loader.module.css';

const Custom404 = () => {
  const title = 'Page Not Found';
  return (
    <Fragment>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <div style={{ marginTop: '10%', marginLeft: '45%' }}>
          <div className={styles.pageLoader}>
            <span>
              <img src="/govt2.png" width="150px" height="150px" style={{ marginTop: '30px' }} alt="" />
            </span>
          </div>
          <h1 style={{ marginLeft: '10%' }}>404</h1>
          <p>Oops! Something is wrong.</p>
          <button style={{ marginTop: '20px', padding: '5px' }}>
            <a className="button" href={`/dashboard/`}>
              <i className="icon-home"></i> Go back in initial page, is better.
            </a>
          </button>
        </div>
      </InnerLanding>
    </Fragment>
  );
};

export default Custom404;
