import { useState } from 'react';

export default function Config({ func, data }) {
  const [_, setRequireRadio] = useState(data.activeItem.required);

  const updateItem = (e) => {
    let { name, id, value } = e.target;
    const formIndex = data.activeItem.formIndex;
    func.handleUpdateItem(name, id, value, formIndex);
  };

  const updateInnerItem = (e, itemID, itemIndex) => {
    const { id, value } = e.target;
    const formIndex = data.activeItem.formIndex;
    func.handleUpdateInnerItem(id, value, itemID, itemIndex, formIndex);
  };

  /* --------------------------------- Initial -------------------------------- */
  const initialDisplay = () => {
    const tbodyOption = data.userOptions.tbodyOption;

    const settingItems = Object.entries(data.userSettingList).map(
      (itemList) => {
        const item = itemList[1];
        return (
          <li key={item.id} className="config__item">
            <label className="item-label" htmlFor={item.id}>
              {item.name}
            </label>
            <input
              type="text"
              id={item.id}
              name={item.id}
              className="item-input"
              value={item.value}
              placeholder={item.placeholder}
              onChange={(e) => func.handleSettingOnChange(e)}
              disabled={item.id === 'setting01' ? !tbodyOption : false}
            />
          </li>
        );
      }
    );

    return (
      <div className="config-start">
        <h3 className="config__title">
          <em>MY SETTINGS</em>
        </h3>
        <div className="config-start__box">
          <small>オプション</small>
        </div>
        <hr className="divider" />
        <div className="config__option">
          <input
            type="checkbox"
            name="tbodyOption"
            id="tbodyOption"
            defaultChecked={tbodyOption}
            onChange={(e) => func.handleCheckboxOption(e)}
          />
          <label htmlFor="tbody_option">&lt;tbody&gt;あり</label>
        </div>
        <div className="config-start__box">
          <small>クラス名</small>
        </div>
        <hr className="divider" />
        <ul className="config__list">{settingItems}</ul>
        <button
          type="button"
          onClick={(e) => func.handleResetSetting(e)}
          className="cmn-button"
        >
          リセット
        </button>
      </div>
    );
  };

  /* --------------------------------- Updated -------------------------------- */
  const loadDisplay = () => {
    const item = data.activeItem;
    const itemDefault = data.activeDefault;

    const require = (
      <li className="config__item config__item--cb">
        <div className="condfig__item-item">
          <input
            type="radio"
            name="required"
            id="option1"
            value="option1"
            onChange={(e) => {
              updateItem(e);
              setRequireRadio('option1');
            }}
            checked={item.required === 'option1'}
          />
          <label htmlFor="option1">必須</label>
        </div>
        <div className="condfig__item-item">
          <input
            type="radio"
            name="required"
            id="option2"
            value="option2"
            onChange={(e) => {
              updateItem(e);
              setRequireRadio('option2');
            }}
            checked={item.required === 'option2'}
          />
          <label htmlFor="option2">任意</label>
        </div>
        <div className="condfig__item-item">
          <input
            type="radio"
            name="required"
            id="option3"
            value="option3"
            onChange={(e) => {
              updateItem(e);
              setRequireRadio('option3');
            }}
            checked={item.required === 'option3'}
            disabled={[8].includes(item.type)}
          />
          <label htmlFor="option3">なし</label>
        </div>
      </li>
    );

    const name = (
      <li className="config__item">
        <label className="item-label" htmlFor="nameJA">
          {/* &lt;label&gt;名 */}
          name
        </label>
        <input
          type="text"
          name="nameJA"
          id="nameJA"
          className="item-input"
          // defaultValue={item.nameJA}
          value={item.nameJA}
          placeholder={itemDefault.nameJA}
          onChange={(e) => updateItem(e)}
        />
        {/* <p className="item-memo">&lt;th&gt;の&lt;label&gt;</p> */}
      </li>
    );

    const placeholder = (
      <li className="config__item">
        <label className="item-label" htmlFor="inputPlaceholder">
          placeholder
        </label>
        <input
          type="text"
          name="inputPlaceholder"
          id="inputPlaceholder"
          className="item-input"
          // defaultValue={item.inputPlaceholder}
          value={item.inputPlaceholder}
          placeholder={itemDefault.inputPlaceholder}
          onChange={(e) => updateItem(e)}
        />
      </li>
    );

    const note = (
      <li className="config__item">
        <label className="item-label" htmlFor="inputNote">
          memo
        </label>
        <input
          type="text"
          id="inputNote"
          name="inputNote"
          className="item-input"
          // defaultValue={item.inputNote}
          value={item.inputNote}
          placeholder={itemDefault.inputNote}
          onChange={(e) => updateItem(e)}
        />
        <p className="item-memo">&lt;{item.inputType}&gt;の下に表示するメモ</p>
      </li>
    );

    const inputID = (
      <li className="config__item">
        <label className="item-label" htmlFor="inputNote">
          &lt;{item.inputType}&gt; id
        </label>
        <input
          type="text"
          id="inputId"
          name="inputId"
          className="item-input"
          // defaultValue={item.inputNote}
          value={item.inputId}
          placeholder={itemDefault.inputId}
          onChange={(e) => updateItem(e)}
          disabled
        />
      </li>
    );

    const inputName = (
      <li className="config__item">
        <label className="item-label" htmlFor="inputNote">
          &lt;{item.inputType}&gt; name
        </label>
        <input
          type="text"
          id="inputName"
          name="inputName"
          className="item-input"
          // defaultValue={item.inputNote}
          value={item.inputName}
          placeholder={itemDefault.inputName}
          onChange={(e) => updateItem(e)}
          disabled
        />
      </li>
    );

    let innerItems = '';
    if (data.typeWithInnerItems.includes(item.type)) {
      // console.log(item.itemList);
      const innerItemList = Object.entries(item.itemList).map(
        (innerItem, index) => {
          let itemTitle = '';
          if ([5, 7].includes(item.type)) itemTitle = 'label';
          if (item.type === 6) itemTitle = 'option';

          return (
            <div key={innerItem[1].id} className="config__item">
              <label className="item-label">
                {/* {item.inputType} name {index + 1} */}
                {item.inputId}
                {(index + 1).toString().padStart(2, '0')} {itemTitle}
              </label>
              <input
                type="text"
                id={innerItem[1].id}
                name={innerItem[1].id}
                className="item-input"
                value={innerItem[1].label}
                placeholder={itemDefault.itemList[index].label}
                onChange={(e) => updateInnerItem(e, innerItem[1].id, index)}
              />
            </div>
          );
        }
      );

      innerItems = <li className="config__item">{innerItemList}</li>;
    }

    const divider = <hr className="divider" />;

    return (
      <section className="config">
        <div className="config__box">
          {/* <span className="config__icon material-symbols-outlined">
            settings
          </span> */}
          <h3 className="config__title">
            <em>{item.nameJA}</em> 設定
          </h3>
        </div>
        {/* <p className="config__title-note">
          <small>
            &lt;label&gt;名、&lt;input&gt; 要素の属性などの設定
          </small>
        </p> */}
        {/* {inputSetting(item.type)} */}
        <form
          onSubmit={(e) => func.handleSubmitItem(e)}
          autoComplete="off"
          id="config-form"
        >
          {divider}
          <ul className="config__list">
            {require}
            {name}
            {!data.typeWithoutPlaceholders.includes(item.type)
              ? placeholder
              : ''}
            {!data.typeWithoutMemo.includes(item.type) ? note : ''}
            {divider}
            {data.typeWithInnerItems.includes(item.type) ? innerItems : ''}
            {!data.typeWithoutNameID.includes(item.type) ? inputID : ''}
            {!data.typeWithoutNameID.includes(item.type) ? inputName : ''}
          </ul>
          <button
            className="cmn-button"
            onClick={(e) => func.handleResetConfig(item.id, item.formIndex)}
            type="button"
          >
            リセット
          </button>
          <button
            className="cmn-button cmn-button--dark"
            form="config-form"
            type="submit"
          >
            保存する
          </button>
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
