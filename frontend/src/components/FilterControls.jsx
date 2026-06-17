import { useState } from 'react';
import { useItems } from '../context/ItemContext';

const FilterControls = ({ onItemSelect }) => {
  const { items } = useItems();
  const [isChecked, setIsChecked] = useState(false);

  const handleChecked = (e) => {
    onItemSelect(e)
  }

  return (
    <>
      {!isChecked ? (
        <select onChange={(e) => onItemSelect(e)} name='names' id=''>
          <option value=''>-- Select an option --</option>
          {items.map((item) => (
            <option key={item.id} value={item.name} data-id={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      ) : (
        <select onChange={(e) => onItemSelect(e)} name='names' id=''>
          <option value=''>-- Select an option --</option>
          {items
            .filter((item) => item.members !== true)
            .map((item) => (
              <option key={item.id} value={item.name} data-id={item.id}>
                {item.name}
              </option>
            ))}
        </select>
      )}

      <input
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        type='checkbox'
        name='members-item'
        id='membersItem'
      />
    </>
  );
};

export default FilterControls;
