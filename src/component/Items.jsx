import { Tooltip } from 'react-tooltip';
import form from '../data/form.json';

export default function Formlist({ func, data }) {
  const usedItem = data.userFormList.map((item) => item.nameEN);

  const generatedList = form.map((item, index) => {
    return (
      <li
        key={index}
        className={
          usedItem.includes(item.nameEN)
            ? 'form-list__item form-list__item--active'
            : 'form-list__item'
        }
        data-tooltip-id="item-tooltip"
        data-tooltip-content={`Add Item`}
        data-tooltip-place="right"
        data-tooltip-position-strategy="fixed"
      >
        <button
          className="form-list__button"
          onClick={(e) => func.handleAddItem(e, item, index)}
        >
          <span className="form-list__icon material-symbols-outlined">
            {item.icon}
          </span>
          <div className="form-list__box">
            {/* <small className="form-list__subtitle">{item.nameEN}</small> */}
            <h3 className="form-list__title">{item.nameJA}</h3>
          </div>
        </button>
      </li>
    );
  });

  return (
    <ul className="form-list">
      {generatedList}
      <Tooltip id="item-tooltip" />
    </ul>
  );
}
