import { useSelector as useSelectorOrigin } from 'react-redux';

const useSelector = (path) => {
  const [store, key] = path.split('.');
  const result = useSelectorOrigin((rootState) => rootState[store]);

  console.log(result);
  if (Object.hasOwnProperty.call(result, key)) {
    return result[key];
  }
  throw new Error(`${key} is not found`);
};

export default useSelector;
