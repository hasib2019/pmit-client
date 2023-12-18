import React from 'react';

const RequiredFile = (dialoge) => {
  return (
    <>
      <span>{dialoge}</span> <span style={{ color: 'red' }}>*</span>
    </>
  );
};

export default RequiredFile;
