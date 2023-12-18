/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Helmet } from 'react-helmet';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // ({errorCustom: error})
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch() {
    // You can use your own error logging service here
    // ({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <Helmet>
            <title>RDCD- {}</title>
          </Helmet>
          <div style={{ marginTop: '5%', marginLeft: '40%' }}>
            <div>
              <span>
                <img src="/govt2.png" width="150px" height="150px" style={{ marginTop: '30px' }} alt="" />
              </span>
            </div>
            <h1 style={{ marginLeft: '10%' }}>Oops! Something is wrong.</h1>
            <p>Oops! Something is wrong.</p>
            <button type="button" onClick={() => this.setState({ hasError: false })}>
              Try again?
            </button>
          </div>
        </>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
