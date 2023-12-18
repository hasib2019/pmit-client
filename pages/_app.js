
import { CacheProvider } from '@emotion/react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Provider } from 'react-redux';
import store from '../redux/store';
import '../styles/globals.css';
// react tab close and data remove system
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import createEmotionCache from '../src/createEmotionCache';
// import ErrorBoundary from "components/ErrorBoundary";
// import LoadingScreen from 'components/LoadingScreen';
import FallBackComponent from 'components/inventory/mainSections/itemReturn/fallBackComponent';
import LoaderProgress from 'components/LoaderProgress';
import NextNProgress from 'nextjs-progressbar';
import { Fragment, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import axios from 'service/AxiosInstance';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { fronEndErrorLogUrl } from '../url/ApiList';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const theme = createTheme();
const createErrorLog = async (errorObject) => {
  const componentName = localStorageData('componentName');
  await axios.post(fronEndErrorLogUrl + componentName, { error: errorObject });
};
export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <Helmet>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
          <title>পল্লী উন্নয়ন ও সমবায় বিভাগ </title>
          <meta name="keywords" content="Era Infotech Ltd" />
          <meta name="description" content="Era Infotech Ltd RDCD" />
          <meta name="author" content="Era Infotech Ltd" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=optional" rel="stylesheet" />
          <script
            src="https://stage-dashboard.rdcd.gov.bd/components/app-switcher/app-switcher.js"
            async
            type="text/javascript"
          ></script>
          {/* <meta
            name="google-site-verification"
            content="U5zwknm5FFoyKQNrLYyqcdYSK4OFx-J072ORxbVAzPs"
          /> */}
        </Helmet>
        <NotificationContainer />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {!loading ? (
            <Fragment>
              <NextNProgress />
              {
                process.env.NEXT_PUBLIC_DEBUG == true ? (
                  <Fragment>
                    <Component {...pageProps} />
                  </Fragment>
                ) : (
                  <ErrorBoundary
                    FallbackComponent={FallBackComponent}
                    onError={async (error, info) => {
                      try {
                        const { componentStack } = info;
                        const { message, stack } = error;
                        const errorObj = {
                          message: message,
                          stack: stack,
                          componentInfo: componentStack.toString(),
                        };
                        await createErrorLog(errorObj);
                      } catch (error) {
                        errorHandler(error);
                      }
                    }}
                  >
                    <Component {...pageProps} />
                  </ErrorBoundary>
                )
              }

            </Fragment>
          ) : (
            // <Loader />
            <LoaderProgress />
          )}
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
