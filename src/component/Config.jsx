import { useState } from 'react';

export default function Config({ func, data }) {
  // const [itemChange, setItemChange] = useState(false)

  // const [itemID, itemIndex] = data.activeItemID;
  // console.log(itemID, itemIndex);

  const submitItem = (e) => {
    e.preventDefault();
    console.log('click');
    // console.log('id: ', e.target.id);
    // console.log('value: ', e.target.value);
  };

  const updateItem = (e) => {
    // setItemChange(true)
    e.preventDefault()
    const id = e.target.id;
    const value = e.target.value
    const formIndex = data.activeItem.formIndex
    func.handleUpdateItem(id, value, formIndex)
  };

  /* --------------------------------- Initial -------------------------------- */
  const initialDisplay = () => {
    return (
      <div className="config-start">
        <p>START PAGE</p>
      </div>
    );
  };

  /* --------------------------------- Updated -------------------------------- */
  const loadDisplay = () => {
    const item = data.activeItem;

    const inputSetting = (type) => {
      if ([1, 2, 3].includes(type)) {
        return (
          <p className="config__title-note">
            &lt;input&gt;タイプ: {item.inputType}
          </p>
        );
      }
    };

    const require = (
      <li className="config__item config__item--cb">
        <input
          type="checkbox"
          id="config-require"
          name="config-require"
          defaultChecked={item.required}
          onChange={(e) => updateItem(e)}
        />
        <label className="item-label" htmlFor="config-require">
          必要
        </label>
      </li>
    );

    const name = (
      <li className="config__item">
        <label className="item-label" htmlFor="config-name">
          {/* &lt;label&gt;名 */}
          name
        </label>
        <input
          type="text"
          name="name-name"
          id="config-name"
          className="item-input"
          defaultValue={item.nameJA}
          // value={item.nameJA}
          // placeholder={item.nameJA}
          onChange={(e) => updateItem(e)}
        />
      </li>
    );

    const placeholder = (
      <li className="config__item">
        <label className="item-label" htmlFor="config-placeholder">
          placeholder
        </label>
        <input
          type="text"
          name="config-placeholder"
          id="config-placeholder"
          className="item-input"
          defaultValue={item.inputPlaceholder}
          // placeholder={config.inputPlaceholder}
          onChange={(e) => updateItem(e)}
        />
      </li>
    );

    const note = (
      <li className="config__item">
        <label className="item-label" htmlFor="config-note">
          memo
        </label>
        <input
          type="text"
          id="config-note"
          name="config-note"
          className="item-input"
          defaultValue={item.inputNote}
          // placeholder={config.inputNote}
          onChange={(e) => updateItem(e)}
        />
        <p className="item-memo">&lt;input&gt;の下に表示するメモ</p>
      </li>
    );

    return (
      <section className="config">
        <div className="config__box">
          <span className="config__icon material-symbols-outlined">
            settings
          </span>
          <h3 className="config__title">Item Setting</h3>
        </div>
        <p className="config__title-note">
          <small>
            &lt;label&gt;名、&lt;input&gt; 要素の属性などの設定をこちらで変更
          </small>
        </p>
        {inputSetting(item.type)}
        <form onSubmit={(e) => submitItem(e)} autoComplete="off">
          <ul className="config__List">
            {require}
            {name}
            {placeholder}
            {note}
          </ul>
          {/* <button
            className="config__button"
            // disabled={!itemChange}
          >
            Save
          </button> */}
        </form>
      </section>
    );
  };

  /* -------------------------------------------------------------------------- */
  if (data.initialConfig) {
    return initialDisplay();
  } else {
    return loadDisplay();
  }
}
