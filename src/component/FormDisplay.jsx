import { useState } from 'react';

export default function FormDisplay({ data }) {
  const [showError, setShowError] = useState(false);

  const handleShowError = () => {
    setShowError(!showError);
  };

  const displayItem = data.userFormList.map((item, index) => {
    /* ----------------------------- Display Options ---------------------------- */
    const displayRequire = item.configuration.required ? (
      <p className="display-form__item-require">必要</p>
    ) : (
      ''
    );

    const displayNote = item.configuration.inputNote ? (
      <p className="display-form__item-note">※{item.configuration.inputNote}</p>
    ) : (
      ''
    );

    const displayError = showError ? (
      <p className="display-form__item-error">
        {item.nameJA}が入力されていません
      </p>
    ) : (
      ''
    );

    /* ------------------------------ Header Style ------------------------------ */

    const displayHeader = (
      <div className="display-form__item-header">
        <label
          className="display-form__item-title"
          htmlFor={item.configuration.labelFor}
        >
          {item.nameJA}
        </label>
        {displayRequire}
      </div>
    );

    /* ----------------------------- Input Selection ---------------------------- */

    const displayInput = (name) => {
      const inputType1 = [
        'name',
        'furigana',
        'mail address',
        'mail address (confirm)',
        'phone number',
        'fax number',
        'url',
      ];
      const inputType2 = ['content'];
      const inputType3 = ['address'];

      if (inputType1.includes(name)) {
        return (
          <input
            className="item-input"
            name={item.configuration.inputName}
            type={item.configuration.inputType}
            placeholder={item.configuration.inputPlaceholder}
          />
        );
      }

      if (inputType2.includes(name)) {
        return (
          <textarea
            className="item-input"
            name={item.configuration.inputName}
            cols={0}
            rows={2}
            placeholder={item.configuration.inputPlaceholder}
          ></textarea>
        );
      }

      if (inputType3.includes(name)) {
        return (
          <div className="address-input-box">
            <div className="address-input-box__post">
              〒
              <input
                className="item-input item-input--small"
                type={item.configuration.inputPostalType1}
                placeholder={item.configuration.inputPostalPlaceholder1}
              />
              -
              <input
                className="item-input item-input--small"
                type={item.configuration.inputPostalType2}
                placeholder={item.configuration.inputPostalPlaceholder2}
              />
            </div>
            <input
              className="item-input"
              type={item.configuration.inputType}
              placeholder={item.configuration.placeholder}
            />
          </div>
        );
      }
    };

    /* ------------------------------- Final Item ------------------------------- */
    return (
      <div className="display-form__item-main">
        {displayHeader}
        {displayError}
        {displayInput(item.nameEN)}
        {displayNote}
      </div>
    );

    // if (rowType2.includes(item.nameEN)) {
    //   const inputItem =
    //     item.configuration.inputType === 'textarea' ? (
    //       <textarea
    //         cols={0}
    //         rows={2}
    //         disabled={true}
    //         placeholder={item.configuration.inputPlaceholder}
    //       ></textarea>
    //     ) : (
    //       <input
    //         type={item.configuration.inputType}
    //         placeholder={item.configuration.inputPlaceholder}
    //         disabled={true}
    //       />
    //     );

    //   return (
    //     <tr key={item.id}>
    //       <th>
    //         {/* <span className="material-symbols-outlined">drag_handle</span> */}
    //         <div className="th-box">
    //           <label htmlFor={item.configuration.labelFor}>{item.nameJA}</label>
    //           {displayConfiguration}
    //         </div>
    //       </th>
    //       <td>
    //         {inputItem}
    //         {displayNote}
    //         {displayDelete}
    //       </td>
    //     </tr>
    //   );
    // }

    // if (rowType3.includes(item.nameEN)) {
    //   return (
    //     <tr key={item.id}>
    //       <th>
    //         {/* <span className="material-symbols-outlined">drag_handle</span> */}
    //         <div className="th-box">
    //           <label htmlFor={item.configuration.labelFor}>{item.nameJA}</label>
    //           {displayConfiguration}
    //         </div>
    //       </th>
    //       <td>
    //         <div className="td-address">
    //           〒
    //           <input
    //             type={item.configuration.inputPostalType1}
    //             placeholder={item.configuration.inputPostalPlaceholder1}
    //             disabled={true}
    //           />
    //           -
    //           <input
    //             type={item.configuration.inputPostalType2}
    //             placeholder={item.configuration.inputPostalPlaceholder2}
    //             disabled={true}
    //           />
    //         </div>
    //         <input
    //           type={item.configuration.inputType}
    //           placeholder={item.configuration.placeholder}
    //           disabled={true}
    //         />
    //         {displayNote}
    //         {displayDelete}
    //       </td>
    //     </tr>
    //   );
    // }
  });

  return (
    <div className="display-form">
      <div className="display-form__content">
        <header className="display-form__header">
          <h2 className="display-form__title">お問い合わせ</h2>
          <p className="display-form__subtitle">並び替え・追加してください</p>
        </header>
        <div className="display-form__option">
          <div className="display-form__option-item">
            <input
              type="checkbox"
              name="option-show-error"
              id="option-show-error"
              onClick={handleShowError}
            />
            <label htmlFor="option-show-error">
              エラーメッセージを表示する
            </label>
          </div>
          <p className="display-form__note">
            アイテム数：{data.userFormList.length}コ
          </p>
        </div>
        <div className="display-form__list">
          {data.userFormList.map((item, index) => {
            return (
              <li key={item.id} className="display-form__item">
                <div className="display-form__item-icon">
                  <span className="material-symbols-outlined">
                    drag_indicator
                  </span>
                </div>
                {displayItem[index]}
                <div className="display-form__item-icon">
                  <span className="material-symbols-outlined">delete</span>
                </div>
              </li>
            );
          })}
        </div>
        <div className="display-form__footer"></div>
      </div>
    </div>
  );
}
