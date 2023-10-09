import { useEffect, useState } from 'react';
import Formlist from './Items';
import FormDisplay from './Form';
import Config from './Config';
import form from '../data/form.json';

export default function Main() {
  const [userFormList, setUserFormList] = useState([]);
  const [activeItemID, setActiveItemID] = useState(['initialID', -1]);
  const [activeItem, setActiveItem] = useState(Object);
  const [activeDefault, setActiveDefault] = useState(Object);
  const [initialConfig, setInitialConfig] = useState(true);

  const typeWithInnerItems = [5, 6, 7];
  const typeWithoutPlaceholders = [4, 5, 6, 7];

  const initalList = [
    'name',
    'mail address',
    'phone number',
    'comment area',
    'privacy policy',
  ];

  useEffect(() => {
    const localData = localStorage.getItem('userFormList');
    loadInitialList(localData, form);
  }, []);

  const loadInitialList = (localData, list) => {
    const initialLocalList = [];
    if (!localData) {
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
    return initialLocalList;
  };

  /* ------------------------------ Add Unique ID ----------------------------- */
  const addUniqueID = (item, index) => {
    const newID = crypto.randomUUID();

    if (typeWithInnerItems.includes(item.type)) {
      const updatedInnerItem = item.itemList.map((innerItem, index) => {
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
    // const initialLocalList = [];

    // form.map((item) => {
    //   if (initalList.includes(item.nameEN)) {
    //     const updatedItem = addUniqueID(item);
    //     initialLocalList.push(updatedItem);
    //   }
    // });

    const newList = loadInitialList(null, form);
    handleUpdateList(newList);
  };

  /* -------------------------- Click to Show Config -------------------------- */
  const handleActivateItem = (index, id, item) => {
    setActiveDefault(form[item.formIndex]);
    setActiveItem(item);
    setActiveItemID([id, index]);
    setInitialConfig(false);
    // console.log(index, id);
  };

  /* ------------------------------- Update Item ------------------------------ */
  const handleUpdateItem = (inputName, inputID, inputValue, formIndex) => {
    // console.log(inputName, activeItemID[1], inputID, inputValue, formIndex);

    let newItem = {};
    if (['required'].includes(inputName)) {
      newItem = {
        ...activeItem,
        [inputName]: inputValue,
      };
    } else {
      newItem = {
        ...activeItem,
        [inputID]: inputValue,
      };
    }

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
            activeDefault: activeDefault,
            initialConfig: initialConfig,
            typeWithInnerItems: typeWithInnerItems,
            typeWithoutPlaceholders: typeWithoutPlaceholders,
          }}
        />
      </div>
    </div>
  );
}
