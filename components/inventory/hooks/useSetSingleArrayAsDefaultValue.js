const { useState, useEffect } = require('react');

const UseSetSingleArrayAsDefaultValue = (stateCount, funcitons) => {
  const [states, setStates] = useState(Array(stateCount).fill(undefined));
  const test = async () => {
    let returnValues = [];
    if (funcitons?.length > 0) {
      for (let i = 0; i < funcitons.length; i++) {
        const results = await funcitons[i]();

        if (results?.length === 1) {
          returnValues[i] = results[0];
        }
      }
      setStates(returnValues);
    }
  };
  useEffect(async () => {
    test();
  }, []);

  return states;
};
export default UseSetSingleArrayAsDefaultValue;
