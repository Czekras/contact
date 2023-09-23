import { useEffect, useState } from 'react';
import Formlist from './Formlist';
import FormDisplay from './FormDisplay';
import DisplayOptions from './DisplayOptions';

import form from '../data/form.json';

export default function Main() {
  const [userFormList, setUserFormList] = useState([]);

  useEffect(() => {
    const localData = localStorage.getItem('userFormList');
    loadInitialList(localData, form);
  }, []);

  const loadInitialList = (localData, list) => {
    if (!localData) {
      const initialLocalList = [];
      const initalList = [
        'name',
        'furigana',
        'phone number',
        'mail address',
        'mail address (confirm)',
        'content',
      ];

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

  return (
    <div className="main">
      <div className="main__main-l">
        <Formlist
          func={{ handleAddItem: handleAddItem }}
          data={{ userFormList: userFormList }}
        />
      </div>
      <div className="main__main-m">
        <DisplayOptions />
        <FormDisplay data={{ userFormList: userFormList }} />
      </div>
      <div className="main__main-r"></div>
    </div>
  );
}
