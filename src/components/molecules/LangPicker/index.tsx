/* eslint-disable css-modules/no-unused-class */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NativeSelect from '@material-ui/core/NativeSelect';
import { useMutation } from '@apollo/client';
import BootstrapInput from './BootstrapInput';
import useSelector from '~hooks/useSelector';
import updateUserOptionsMutation from '~graphql/mutations/updateUserOptions';
import styles from './styles.module.css';

enum LangCodes {
  RU = 'ru',
  EN = 'en',
}

const LangPicker: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [updateUserOptions] = useMutation(updateUserOptionsMutation);

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
    const { value: language } = event.target;

    i18n.changeLanguage(language);

    updateUserOptions({
      variables: {
        uid,
        userOptions: {
          language,
        },
      },
    });
  };

  return (
    <div className={styles.container}>
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
