import styled from 'styled-components';

const Loadercss = styled.div`
  .loader-wrapper {
    width: 120px;
    height: 120px;
  }
  .loader {
    width: 100%;
    height: 100%;
    border: 4px solid #162534;
    border-top-color: #2cd9ff;
    border-bottom-color: #7effb2;
    border-radius: 50%;
    animation: rotate 5s linear infinite;
  }
  .loader-inner {
    border-top-color: #7effb2;
    border-bottom-color: #2cd9ff;
    animation-duration: 2.5s;
  }
  @keyframes rotate {
    0% {
      transform: scale(1) rotate(360deg);
    }
    50% {
      transform: scale(0.8) rotate(-360deg);
    }
    100% {
      transform: scale(1) rotate(360deg);
    }
  }
`;
const LoadingScreen = () => {
  return (
    <>
      <Loadercss>
        <div className="loader-wrapper">
          <div className="loader">
            <div className="loader loader-inner"></div>
          </div>
        </div>
      </Loadercss>
    </>
  );
};

export default LoadingScreen;
