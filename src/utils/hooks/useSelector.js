import { useSelector as useSelectorOrigin } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useSelector = (path) => {
  const [store, key] = path.split('.');
  const result = useSelectorOrigin((rootState) => rootState[store]);

  if (Object.hasOwnProperty.call(result, key)) {
    return result[key];
  }
  throw new Error(`${key} is not found`);
};

export default useSelector;
