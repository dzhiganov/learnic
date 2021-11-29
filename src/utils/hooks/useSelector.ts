import {
  useSelector as useSelectorOrigin,
  DefaultRootState,
} from 'react-redux';

const useSelector = <Value extends unknown>(path: string): Value => {
  const [storeName, key] = path.split('.') as [
    keyof DefaultRootState,
    keyof DefaultRootState
  ];
  const store = useSelectorOrigin((rootStore) => {
    if (storeName in rootStore) {
      return rootStore[storeName];
    }
    throw new Error(`Store ${storeName} doesn't exist in root store`);
  });

  if (key in store) {
    return store[key];
  }
  throw new Error(`${key} is not found`);
};

export default useSelector;
