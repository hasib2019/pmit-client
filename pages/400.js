/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */
import InnerLanding from 'components/shared/layout/InnerLanding';
import { Helmet } from 'react-helmet';
//  import "../styles/404.css"
import Loader from 'components/shared/others/Loader';

const Custom400 = () => {
  const title = 'Page Not Found';
  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <h1>404</h1>
        <p>Oops! Something is wrong.</p>
        <Loader />
        <a className="button" href={`/dashboard/`}>
          <i className="icon-home"></i> Go back in initial page, is better.
        </a>
      </InnerLanding>
    </>
  );
};

export default Custom400;
