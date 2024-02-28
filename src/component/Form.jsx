import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { Tooltip } from 'react-tooltip';
import { useState } from 'react';
import Output from '../component/Output';

export default function FormDisplay({ func, data }) {
  // const [userFormListData, setUserFormListData] = useState([]);
  const [showError, setShowError] = useState(false);
  const userOptions = data.userOptions;

  const handleShowError = () => {
    setShowError(!showError);
  };

  const generateButton = (
    <li className="display-form__item">
      <button
        className="generate-button"
        onClick={() => func.generateInitList()}
      >
        初期リストを作成する
      </button>
    </li>
  );

  const displayItem = data.userFormList.map((item, index) => {
    /* ----------------------------- Display Options ---------------------------- */
    const itemRequired =
      item.required === 'option1'
        ? userOptions.requireLabel
        : item.required === 'option2'
        ? userOptions.optionalLabel
        : '';

    const displayRequire = (
      <p className="display-form__item-require">{itemRequired}</p>
    );

    const displayNote = item.inputNote ? (
      <p className="display-form__item-note">※{item.inputNote}</p>
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

    let itemLabel = item.nameJA;
    if (item.nameEN === 'privacy policy') itemLabel = `${item.nameJA}への同意`;
    if (item.nameEN === 'file upload')
      // itemLabel = `${item.nameJA}${itemRequired ? ` (${itemRequired})` : ''}`;
      itemLabel = `${item.nameJA}${
        item.required === 'option1'
          ? '（必須）'
          : item.required === 'option2'
          ? '（任意）'
          : ''
      }`;

    const displayHeader = (
      <div className="display-form__item-header">
        <label className="display-form__item-title" htmlFor={item.labelFor}>
          {itemLabel}
        </label>
        {displayRequire}
      </div>
    );

    /* ----------------------------- Input Selection ---------------------------- */

    const displayInput = (type) => {
      //       const inputType1 = [
      //   'name',
      //   'furigana',
      //   'mail address',
      //   'mail address (confirm)',
      //   'phone number',
      //   'fax number',
      //   'url',
      // ];
      // const inputType2 = ['comment area'];
      // const inputType3 = ['address'];
      // const inputType4 = ['privacy policy']

      if (type === 1) {
        return (
          <input
            id={item.inputId}
            className="item-input"
            name={item.inputName}
            type={item.inputType}
            placeholder={item.inputPlaceholder}
          />
        );
      }

      if (type === 2) {
        return (
          <textarea
            id={item.inputId}
            className="item-input"
            name={item.inputName}
            cols={0}
            rows={2}
            placeholder={item.inputPlaceholder}
          ></textarea>
        );
      }

      if (type === 3) {
        return (
          <div className="address-input-box">
            <div className="address-input-box__post">
              〒
              <input
                className="item-input item-input--small"
                type={item.inputPostalType1}
                placeholder={item.inputPostalPlaceholder1}
                name={item.inputPostalName1}
              />
              -
              <input
                className="item-input item-input--small"
                type={item.inputPostalType2}
                placeholder={item.inputPostalPlaceholder2}
                name={item.inputPostalName2}
              />
            </div>
            <input
              id={item.inputId}
              className="item-input"
              type={item.inputType}
              placeholder={item.placeholder}
              name={item.inputName}
            />
          </div>
        );
      }

      if (type === 4) {
        return (
          <div className="privacy-input-box">
            <input id={item.inputId} type={item.inputType} />
            <label htmlFor={item.labelFor} name={item.inputName}>
              プライバシーポリシーに同意する
            </label>
          </div>
        );
      }

      if (type === 5) {
        // const items = item.itemList.map((innerItem, index) => {
        const items = Object.entries(item.itemList).map((innerItem, index) => {
          // const innerItemID = item.inputId + index.toString().padStart(2, '0');
          return (
            <li key={innerItem[1].id}>
              <input
                type={item.inputType}
                name={item.inputId}
                id={innerItem[1].id}
              />
              <label htmlFor={innerItem[1].id}>{innerItem[1].label}</label>
            </li>
          );
        });

        return <ul className="radio-input-box">{items}</ul>;
      }

      if (type === 6) {
        const items = Object.entries(item.itemList).map((innerItem, index) => {
          return (
            <option value={innerItem[1].label}>{innerItem[1].label}</option>
          );
        });

        return (
          <select
            className="select-input-box"
            name={item.inputId}
            id={item.inputId}
          >
            <option value="未選択">未選択</option>
            {items}
          </select>
        );
      }

      if (type === 7) {
        const items = Object.entries(item.itemList).map((innerItem, index) => {
          return (
            <li className="date-input-box__item" key={innerItem[1].id}>
              <p>{innerItem[1].label}</p>
              <input type="datetime-local" />
            </li>
          );
        });

        return <ul className="date-input-box">{items}</ul>;
      }

      if (type === 8) {
        return (
          <div className="file-input-box">
            <p>※1ファイルの最大容量... ※添付可能ファイル...</p>
            <div className="file-input-box__box">
              <span className="material-symbols-outlined">image</span>
              <div className="file-input-box__button">ファイルを選択</div>
              <div className="file-input-box__button">ファイルを削除</div>
            </div>
          </div>
        );
      }
    };

    /* ------------------------------- Final Item ------------------------------- */
    return (
      <div className="display-form__item-main">
        {displayHeader}
        {displayError}
        {displayInput(item.type)}
        {displayNote}
      </div>
    );
  });

  /* -------------------------------------------------------------------------- */
  /*                               Drag Functions                               */
  /* -------------------------------------------------------------------------- */
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    // background: isDragging ? '#f1f1f1' : '',
    borderBlock: isDragging ? '1px dashed #d1d1d1' : '',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    // background: isDraggingOver ? '#f1f1f1' : '#ffffff',
  });

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      data.userFormList,
      result.source.index,
      result.destination.index
    );

    func.handleUpdateList(items);
  };

  /* -------------------------------------------------------------------------- */
  const activeSettingIcon = data.initialConfig
    ? 'output__button--active'
    : 'output__button';

  /* -------------------------------------------------------------------------- */
  return (
    <div className="display-form">
      <div className="display-form__content">
        <div className="display-form__top">
          <header className="display-form__header">
            <h2 className="display-form__title">お問い合わせ</h2>
            {/* <p className="display-form__subtitle">並び替え・追加してください</p> */}
            <p className="display-form__subtitle">
              アイテム：{data.userFormList.length}コ
            </p>
          </header>
          <div className="display-form__box">
            <Output
              data={{
                userOptions: data.userOptions,
                userFormList: data.userFormList,
                userSettingList: data.userSettingList,
              }}
            />
            <button
              onClick={() => func.handleOpenSettings()}
              // className="output__button output__button--word"
              className={`output__button ${activeSettingIcon} form-setting`}
              // data-tooltip-id="option-tooltip"
              // data-tooltip-content={'Settings'}
              // data-tooltip-place="left"
            >
              <span className="material-symbols-outlined">settings</span>
              {/* <p>Config</p> */}
            </button>
            {/* <Tooltip id="option-tooltip" /> */}
          </div>
        </div>
        <div className="display-form__option">
          {/* <div className="display-form__option-item">
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
          </p> */}
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <ul
                className="display-form__list"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {data.userFormList.length >= 1
                  ? data.userFormList.map((item, index) => {
                      const displayClassname =
                        item.id === data.activeItemID[0]
                          ? 'display-form__item display-form__item--active'
                          : 'display-form__item';

                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <li
                              className={displayClassname}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div className="display-form__item-icon">
                                <span className="drag-icon material-symbols-outlined">
                                  drag_indicator
                                </span>
                              </div>
                              {displayItem[index]}
                              <div className="display-form__item-icon">
                                <button
                                  className="setting-icon"
                                  onClick={() =>
                                    func.handleActivateItem(
                                      index,
                                      item.id,
                                      item
                                    )
                                  }
                                  // data-tooltip-id="form-icon-tooltip"
                                  // data-tooltip-content="設定"
                                  // data-tooltip-place="left"
                                >
                                  <span className="material-symbols-outlined">
                                    edit
                                  </span>
                                </button>
                                <button
                                  className="delete-icon"
                                  onClick={() =>
                                    func.handleDeleteItem(item.id, index)
                                  }
                                  // data-tooltip-id="form-icon-tooltip"
                                  // data-tooltip-content="削除"
                                  // data-tooltip-place="left"
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      );
                    })
                  : generateButton}
                {provided.placeholder}
                {/* <Tooltip id="form-icon-tooltip" /> */}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="display-form__footer">
          <p className="mobile-show">
            Some features are disabled on mobile view.
          </p>
        </div>
      </div>
    </div>
  );
}
