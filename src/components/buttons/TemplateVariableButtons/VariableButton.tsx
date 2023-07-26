import React from 'react';
import styles from './TemplateVariableButtons.module.css'

interface VariableButtonProps {
    label: string;
    onClick: (label: string) => void;
}

const VariableButton: React.FC<VariableButtonProps> = ({label,onClick}) => {
    return(
        <button 
            className={styles['variable-button']}
            onClick={() => onClick('{' + label + '}')}
        >
            {'{' + label + '}'}
        </button>
    )
}

export default VariableButton;