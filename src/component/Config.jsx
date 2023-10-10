import { useState } from 'react';

export default function Config({ func, data }) {
  // const [itemChange, setItemChange] = useState(false);
  // const [requireCB, setRequireCB] = useState(data.activeItem.required);
  const [requireRadio, setRequireRadio] = useState(data.activeItem.required);

  // setRequireRadio(data.activeItem.required)

  // const [itemID, itemIndex] = data.activeItemID;
  // console.log(itemID, itemIndex);

  const updateItem = (e) => {
    // setItemChange(true)
    // e.preventDefault();
    let { name, id, value } = e.target;
    const formIndex = data.activeItem.formIndex;

    // if (name === 'required') value = requireCB;

    func.handleUpdateItem(name, id, value, formIndex);
  };

  const updateInnerItem = (e, itemID, itemIndex) => {
    const { id, value } = e.target;
    // const formIndex = data.activeItem.formIndex;
    func.handleUpdateInnerItem(id, value, itemID, itemIndex);
  };

  /* --------------------------------- Initial -------------------------------- */
  const initialDisplay = () => {
    return (
      <div className="config-start">
        <span className="config-start__icon material-symbols-outlined">
          settings
        </span>
        <p>Setting</p>
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
        <p className="item-memo">&lt;input&gt;の下に表示するメモ</p>
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
          <h3 className="config__title"><em>{item.nameJA}</em> 設定</h3>
        </div>
        {/* <p className="config__title-note">
          <small>
            &lt;label&gt;名、&lt;input&gt; 要素の属性などの設定
          </small>
        </p> */}
        {/* {inputSetting(item.type)} */}
        <form onSubmit={(e) => func.handleSubmitItem(e)} autoComplete="off">
          {divider}
          <ul className="config__List">
            {require}
            {name}
            {!data.typeWithoutPlaceholders.includes(item.type)
              ? placeholder
              : ''}
            {note}
            {divider}
            {data.typeWithInnerItems.includes(item.type) ? innerItems : ''}
          </ul>
          <button
            className="config__button"
            // disabled={!itemChange}
          >
            保存
          </button>
          {/* <p className="test">{JSON.stringify(item)}</p> */}
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
