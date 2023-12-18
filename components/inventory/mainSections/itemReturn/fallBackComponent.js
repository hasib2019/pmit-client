const FallBackComponent = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Some thing went wrong</p>
      <pre>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
};
export default FallBackComponent;
