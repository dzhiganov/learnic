import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NativeSelect from '@material-ui/core/NativeSelect';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import BootstrapInput from './BootstrapInput';
import { updateUserOptions as requestUpdateUserOptions } from '~api/user';
import useSelector from '~hooks/useSelector';

enum LangCodes {
  RU = 'ru',
  EN = 'en',
}

const LangPicker: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [, updateUserOptions] = useAsyncFn(requestUpdateUserOptions, []);
  const uid = useSelector<string>('user.uid');

  const items = useMemo(
    () => [
      {
        key: LangCodes.RU,
        title: t('LANG_PICKER.RU'),
      },
      {
        key: LangCodes.EN,
        title: t('LANG_PICKER.EN'),
      },
    ],
    [t]
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    updateUserOptions(uid, {
      language: value as LangCodes,
    });
    i18n.changeLanguage(value);
  };

  return (
    <div>
      <NativeSelect
        value={i18n.language}
        onChange={handleChange}
        input={<BootstrapInput />}
      >
        {items.map(({ key, title }) => (
          <option key={key} value={key}>
            {title}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
};

export default LangPicker;
