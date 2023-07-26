import React, { ChangeEvent } from "react"
import styles from './TemplateViewer.module.css'

import Template from "../../models/Template";
import TemplateHelper from "../../helpers/TemplateHelper";

interface TemplateViewerProps {
    arrVarNames: string[];
    template?: Template;
    saveChanges: () => Promise<void>
}

const TemplateViewer: React.FC<TemplateViewerProps> = ({arrVarNames, template, saveChanges}) => {
    const [showModal, setShowModal] = React.useState(false);
    const [inputValues, setInputValues] = React.useState<{ [key: string]: string }>(
        arrVarNames.reduce((acc, name) => {
          acc[name] = '';
          return acc;
        }, {} as { [key: string]: string })
    );
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const openModal = async () => {
      await saveChanges();
      setShowModal(true);
    };
  
    const closeModal = () => {
      setShowModal(false);
    };
  
    return (
        <div>
            <button className={styles['modal-close-btn']} onClick={openModal}>Показать шаблон</button>
            {showModal && <div className={styles['modal-overlay']}>
            <div className={styles['modal']}>
                <div className={styles['modal-content']}>
                    <pre>{TemplateHelper.concatenateTextBlocks(template.templateBlocks, inputValues)}</pre>
                </div>
                {arrVarNames.map((name) => (
                <div key={name} className={styles['template-variable-item']}>
                    <span className={styles['template-variable-label']}>{name}</span>
                    <input
                        type="text"
                        name={name}
                        value={inputValues[name]}
                        className={styles['template-variable-input']}
                        onChange={handleInputChange}
                    />
                </div>
                ))}
                <button className={styles['modal-close-btn']} onClick={closeModal}>Закрыть</button>
            </div>
            </div>}
        </div>
    )
}

export default TemplateViewer;
