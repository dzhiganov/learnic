import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NativeSelect from '@material-ui/core/NativeSelect';
import BootstrapInput from './BootstrapInput';

const LangPicker: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  const items = useMemo(
    () => [
      {
        key: 'ru',
        title: t('LANG_PICKER.RU'),
      },
      {
        key: 'en',
        title: t('LANG_PICKER.ENG'),
      },
    ],
    [t]
  );

  const handleChange = (event: any) => {
    const { value } = event.target;
    i18n.changeLanguage(value);
  };

  return (
    <div>
      <NativeSelect
        value={i18n.language}
        onChange={handleChange}
        input={<BootstrapInput />}
      >
        {items.map(({ key, title }) => {
          return (
            <option key={key} value={key}>
              {title}
            </option>
          );
        })}
      </NativeSelect>
    </div>
  );
};

export default LangPicker;
