import {
  useSelector as useSelectorOrigin,
  DefaultRootState,
} from 'react-redux';

const useSelector = <T>(path: string): T => {
  const [store, key] = path.split('.');
  const result = useSelectorOrigin(
    (rootState) => rootState[store as keyof DefaultRootState]
  );

  if (Object.hasOwnProperty.call(result, key)) {
    return result[key];
  }
  throw new Error(`${key} is not found`);
};

export default useSelector;
