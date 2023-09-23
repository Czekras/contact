import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';

export default function FormDisplay({ func, data }) {
  // const [userFormListData, setUserFormListData] = useState([]);
  const [showError, setShowError] = useState(false);

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
            id={item.configuration.inputId}
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
            id={item.configuration.inputId}
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
                name={item.configuration.inputPostalName1}
              />
              -
              <input
                className="item-input item-input--small"
                type={item.configuration.inputPostalType2}
                placeholder={item.configuration.inputPostalPlaceholder2}
                name={item.configuration.inputPostalName2}
              />
            </div>
            <input
              id={item.configuration.inputId}
              className="item-input"
              type={item.configuration.inputType}
              placeholder={item.configuration.placeholder}
              name={item.configuration.inputName}
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
    background: isDragging ? '#f1f1f1' : '',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? '#ccc' : '#ccc',
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
                  ? data.userFormList.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <li
                            className="display-form__item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div className="display-form__item-icon">
                              <span className="material-symbols-outlined">
                                drag_indicator
                              </span>
                            </div>
                            {displayItem[index]}
                            <div className="display-form__item-icon">
                              <button
                                className="delete-icon"
                                onClick={() =>
                                  func.handleDeleteItem(item.nameJA, index)
                                }
                              >
                                <span className="material-symbols-outlined">
                                  delete
                                </span>
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))
                  : generateButton}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="display-form__footer"></div>
      </div>
    </div>
  );
}
