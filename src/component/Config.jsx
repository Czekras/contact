import { useState } from 'react';

export default function Config({ func, data }) {
  // const [itemChange, setItemChange] = useState(false);
  const [requireCB, setRequireCB] = useState(data.activeItem.required);

  // const [itemID, itemIndex] = data.activeItemID;
  // console.log(itemID, itemIndex);

  const updateItem = (e) => {
    // setItemChange(true)
    // e.preventDefault();
    let { name, id, value } = e.target;
    const formIndex = data.activeItem.formIndex;

    if (name === 'required') value = requireCB;

    func.handleUpdateItem(id, value, formIndex);
  };

  const updateInnerItem = (e, itemID) => {
    const {id, value } = e.target;
    // const formIndex = data.activeItem.formIndex;
    func.handleUpdateInnerItem( id, value, itemID);
  };

  /* --------------------------------- Initial -------------------------------- */
  const initialDisplay = () => {
    return <div className="config-start">{/* <p>START PAGE</p> */}</div>;
  };

  /* --------------------------------- Updated -------------------------------- */
  const loadDisplay = () => {
    const item = data.activeItem;

    // const inputSetting = (type) => {
    //   if ([1, 2, 3].includes(type)) {
    //     return (
    //       <p className="config__title-note">
    //         &lt;input&gt;タイプ: {item.inputType}
    //       </p>
    //     );
    //   }
    // };

    const require = (
      <li className="config__item config__item--cb">
        <input
          type="checkbox"
          id="required"
          name="required"
          // defaultChecked={item.required}
          // checked={item.required}
          checked={item.required}
          onChange={(e) => {
            setRequireCB(!requireCB);
            updateItem(e);
          }}
        />
        <label className="item-label" htmlFor="required">
          require
        </label>
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
          // placeholder={item.nameJA}
          onChange={(e) => updateItem(e)}
        />
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
          // placeholder={config.inputPlaceholder}
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
          // placeholder={config.inputNote}
          onChange={(e) => updateItem(e)}
        />
        <p className="item-memo">&lt;input&gt;の下に表示するメモ</p>
      </li>
    );

    let radio = '';
    if (item.type === 5) {
      const radioList = item.itemList.map((innerItem, index) => {
        return (
          <div key={innerItem.id} className="config__item">
            <label className="item-label">
              {item.inputType} name {index + 1}
            </label>
            <input
              type="text"
              id={innerItem.id}
              name={innerItem.id}
              className="item-input"
              value={innerItem.label}
              onChange={(e) => updateInnerItem(e, item.id)}
            />
          </div>
        );
      });

      radio = <li className="config__item">{radioList}</li>;
    }

    const divider = <hr className="divider" />;

    return (
      <section className="config">
        <div className="config__box">
          {/* <span className="config__icon material-symbols-outlined">
            settings
          </span> */}
          <h3 className="config__title">{item.nameJA} 設定</h3>
        </div>
        <p className="config__title-note">
          <small>
            &lt;label&gt;名、&lt;input&gt; 要素の属性などの設定をこちらで変更
          </small>
        </p>
        {/* {inputSetting(item.type)} */}
        <form onSubmit={(e) => func.handleSubmitItem(e)} autoComplete="off">
          {divider}
          <ul className="config__List">
            {require}
            {name}
            {![4, 5].includes(item.type) ? placeholder : ''}
            {note}
            {divider}
            {item.type === 5 ? radio : ''}
          </ul>
          <button
            className="config__button"
            // disabled={!itemChange}
          >
            保存
          </button>
          <p className="test">{JSON.stringify(item)}</p>
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
