import React from 'react';
import VariableButton from './VariableButton';
import styles from './TemplateVariableButtons.module.css'

interface TemplateVariableButtonsProps {
  variableNames: string[];
  onClick: (label: string) => void;
}

const TemplateVariableButtons: React.FC<TemplateVariableButtonsProps> = ({ variableNames, onClick }) => {
  return (
    <div className={styles['variable-buttons-bar']}>
        <span>Доступные переменные:</span>
        {variableNames.map((label, index) => (
            <VariableButton
            key={label+' '+index}
            label={label}
            onClick={onClick}
            />
        ))}
    </div>
  );
};

export default TemplateVariableButtons;