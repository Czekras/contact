import { Tooltip } from 'react-tooltip';
import form from '../data/form.json';
import { useState, useLayoutEffect } from 'react';

export default function Formlist({ func, data }) {
  function getWindowDimensions() {
    const { innerWidth: width } = window;
    return {
      width,
    };
  }

  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useLayoutEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  };

  const { width } = useWindowDimensions();
  const usedItem = data.userFormList.map((item) => item.nameEN);

  const generatedList = form.map((item, index) => {
    const tooltipString = width <= 768 ? `Add ${item.nameJA}` : 'Add Item';

    return (
      <li
        key={index}
        className={
          usedItem.includes(item.nameEN)
            ? 'form-list__item form-list__item--active'
            : 'form-list__item'
        }
        data-tooltip-id="item-tooltip"
        data-tooltip-content={tooltipString}
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
          <div className="form-list__box sp-none">
            {/* <small className="form-list__subtitle">{item.nameEN}</small> */}
            <p className="form-list__title">{item.nameJA}</p>
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
