import { useEffect, useState } from 'react';

import Formlist from './Items';
import FormDisplay from './Form';
import DisplayOptions from './Option';
import form from '../data/form.json';

export default function Main() {
  const [userFormList, setUserFormList] = useState([]);
  const initalList = [
    'name',
    'furigana',
    'mail address',
    // 'mail address (confirm)',
    'phone number',
    'content',
  ];

  useEffect(() => {
    const localData = localStorage.getItem('userFormList');
    loadInitialList(localData, form);
  }, []);

  const loadInitialList = (localData, list) => {
    if (!localData) {
      const initialLocalList = [];

      list.map((item) => {
        if (initalList.includes(item.nameEN)) {
          const updatedItem = addUniqueID(item);
          initialLocalList.push(updatedItem);
        }
      });

      localStorage.setItem('userFormList', JSON.stringify(initialLocalList));
    }

    const userLocalList = JSON.parse(localStorage.getItem('userFormList'));
    setUserFormList(userLocalList);
  };

  /* ------------------------------ Add Unique ID ----------------------------- */
  const addUniqueID = (item) => {
    return { id: crypto.randomUUID(), ...item };
  };

  /* -------------------------------- Add Item -------------------------------- */
  const handleAddItem = (e, item) => {
    e.preventDefault();
    const updatedItem = addUniqueID(item);
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
  const handleDeleteItem = (name, index) => {
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
        <DisplayOptions />
        <FormDisplay
          func={{
            handleUpdateList: handleUpdateList,
            handleDeleteItem: handleDeleteItem,
            generateInitList: generateInitList,
          }}
          data={{ userFormList: userFormList }}
        />
      </div>
      <div className="main__main-r"></div>
    </div>
  );
}
