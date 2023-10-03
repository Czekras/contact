import { useEffect, useState } from 'react';
// import { nanoid } from 'nanoid';

import Formlist from './Items';
import FormDisplay from './Form';
import DisplayOptions from './Option';
import Config from './Config';
import form from '../data/form.json';

export default function Main() {
  const [userFormList, setUserFormList] = useState([]);
  const [activeItemID, setActiveItemID] = useState(['initialID', -1]);
  const [activeItem, setActiveItem] = useState(Object);
  const [initialConfig, setInitialConfig] = useState(true);

  const initalList = [
    'name',
    'furigana',
    'mail address',
    'phone number',
    'comment area',
  ];

  useEffect(() => {
    const localData = localStorage.getItem('userFormList');
    loadInitialList(localData, form);
  }, []);

  const loadInitialList = (localData, list) => {
    if (!localData) {
      const initialLocalList = [];

      list.map((item, index) => {
        if (initalList.includes(item.nameEN)) {
          const updatedItem = addUniqueID(item, index);
          initialLocalList.push(updatedItem);
        }
      });

      localStorage.setItem('userFormList', JSON.stringify(initialLocalList));
    }

    const userLocalList = JSON.parse(localStorage.getItem('userFormList'));
    setUserFormList(userLocalList);
  };

  /* ------------------------------ Add Unique ID ----------------------------- */
  const addUniqueID = (item, index) => {
    const newID = crypto.randomUUID();

    if ([5].includes(item.type)) {
      const updatedInnerItem = item.itemList.map((innerItem, index) => {
        // return { id: nanoid(), ...innerItem };
        const newIndex = index + 1;
        const innerItemID = item.inputId + newIndex.toString().padStart(2, '0');
        return { id: innerItemID, ...innerItem };
      });
      return {
        id: newID,
        formIndex: index,
        ...item,
        itemList: updatedInnerItem,
      };
    }

    return { id: newID, formIndex: index, ...item };
  };

  /* -------------------------------- Add Item -------------------------------- */
  const handleAddItem = (e, item, index) => {
    e.preventDefault();
    const updatedItem = addUniqueID(item, index);

    const localData = JSON.parse(localStorage.getItem('userFormList'));

    const updatedUserFormList = [...localData, updatedItem];
    localStorage.setItem('userFormList', JSON.stringify(updatedUserFormList));

    console.log(`Add: ${item.nameEN}`);
    setUserFormList((current) => {
      return [...current, updatedItem];
    });
  };

  /* ------------------------------ Reorder List ------------------------------ */
  const handleUpdateList = (list) => {
    console.log('Update: List');
    setUserFormList(list);
    const newList = JSON.stringify(list);
    localStorage.setItem('userFormList', newList);
  };

  /* -------------------------- Delete Item from List ------------------------- */
  const handleDeleteItem = (id, index) => {
    if (id === activeItemID[0]) setInitialConfig(true);

    const updatedList = [
      ...userFormList.slice(0, index),
      ...userFormList.slice(index + 1),
    ];
    handleUpdateList(updatedList);
  };

  /* -------------------------- Generate Initial List ------------------------- */
  const generateInitList = () => {
    const initialLocalList = [];

    form.map((item) => {
      if (initalList.includes(item.nameEN)) {
        const updatedItem = addUniqueID(item);
        initialLocalList.push(updatedItem);
      }
    });

    handleUpdateList(initialLocalList);
  };

  /* -------------------------- Click to Show Config -------------------------- */
  const handleActivateItem = (index, id, item) => {
    setActiveItem(item);
    setActiveItemID([id, index]);
    setInitialConfig(false);
    // console.log(index, id);
  };

  /* ------------------------------- Update Item ------------------------------ */
  const handleUpdateItem = (inputID, inputValue, formIndex) => {
    // console.log(activeItemID[1], inputID, inputValue, formIndex);

    const newItem = {
      ...activeItem,
      [inputID]: inputValue,
    };
    // console.log(newItem);
    setActiveItem(newItem);
  };

  const handleUpdateInnerItem = (inputID, inputValue, itemID, inputIndex) => {
    // console.log(inputID, inputValue, itemID, inputIndex);
    // console.log(...activeItem.itemList);
    const newItem = {
      ...activeItem,
      itemList: {
        ...activeItem.itemList,
        [inputIndex]: {
          id: inputID,
          label: inputValue,
        },
      },
    };

    // console.log(newItem.itemList);
    setActiveItem(newItem);
  };

  const handleSubmitItem = (e) => {
    e.preventDefault();
    const indexOfItem = userFormList.findIndex(
      (item) => item.id === activeItemID[0]
    );

    const newList = [
      ...userFormList.slice(0, indexOfItem),
      activeItem,
      ...userFormList.slice(indexOfItem + 1),
    ];

    handleUpdateList(newList);
  };
  /* -------------------------------------------------------------------------- */
  return (
    <div className="main">
      <div className="main__main-l">
        <Formlist
          func={{
            handleAddItem: handleAddItem,
          }}
          data={{ userFormList: userFormList }}
        />
      </div>
      <div className="main__main-m">
        {/* <DisplayOptions /> */}
        <FormDisplay
          func={{
            handleUpdateList: handleUpdateList,
            handleDeleteItem: handleDeleteItem,
            generateInitList: generateInitList,
            handleActivateItem: handleActivateItem,
          }}
          data={{ userFormList: userFormList, activeItemID: activeItemID }}
        />
      </div>
      <div className="main__main-r">
        <Config
          func={{
            handleUpdateItem: handleUpdateItem,
            handleSubmitItem: handleSubmitItem,
            handleUpdateInnerItem: handleUpdateInnerItem,
          }}
          data={{
            // activeItemID: activeItemID,
            activeItem: activeItem,
            initialConfig: initialConfig,
          }}
        />
      </div>
    </div>
  );
}
