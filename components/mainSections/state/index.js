import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({
  samityId: 1,
});

export { useGlobalState, setGlobalState };
