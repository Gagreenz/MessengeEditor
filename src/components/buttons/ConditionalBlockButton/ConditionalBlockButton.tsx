import React from 'react';
import styles from './ConditionalBlockButton.module.css'

interface ConditionalBlockButtonProps {
    handleClick: () => void;
    ifText:string;
    thenText:string;
    elseText:string;
}

const ConditionalBlockButton: React.FC<ConditionalBlockButtonProps> = ({handleClick, ifText, thenText, elseText}) => {
    return (
        <div>
            <button className={styles['conditional-button']} onClick={handleClick}>
                <span>Click to add:</span>
                <span className={styles['conditional-button-icon']}>IF</span>
                {/* <span>{ifText}</span> */}
                <span className={styles['conditional-button-icon']}>THEN</span>
                {/* <span>{thenText}</span> */}
                <span className={styles['conditional-button-icon']}>ELSE</span>
                {/* <span>{elseText}</span> */}
            </button>
        </div>
    )
}

export default ConditionalBlockButton;