import React from 'react';
import styles from './TodoWeight.module.scss';
import clsx from 'clsx';

interface TodoWeightProps {
  onWeightChange: Function;
  weight: number;
  className?: string;
}

const TodoWeight: React.FC<TodoWeightProps> = ({ onWeightChange, weight, className, ...props }) => {
  const weightOptions = [1, 2, 3, 4, 5];

  const handleWeight = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectWeight = parseInt(e.target.value);
    onWeightChange(selectWeight);
  }

  return (
    <select aria-label="State"
      className={clsx(className, styles.todoWeight__select)}
      onChange={handleWeight}
      value={weight}
      {...props}>
      <option value="">--Priority--</option>
      {
        weightOptions.map((w, i) => (
          <option key={i} value={w}>{w}</option>
        ))
      }
    </select>
  )
}

export default TodoWeight;