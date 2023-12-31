import React from 'react';
import styles from './TemplateEditor.module.css'

import ConditionalBlockButton from '../buttons/ConditionalBlockButton/ConditionalBlockButton';
import Template from '../../models/Template';
import BlockTree from '../blocks/BlockTree';
import TemplateVariableButtons from '../buttons/TemplateVariableButtons/TemplateVariableButtons';
import TemplateViewer from '../TemplateViewer/TemplateViewer';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { insertBlock, insertText, saveTrigger, setActiveId, setCursorPosition, setTemplate } from '../../redux/slices/templateSlice';
type InsertAction = typeof insertBlock | typeof insertText;

interface TemplateEditorProps {
    arrVarNames: string[];
    template?: Template;
    callbackSave: (template: Template) => Promise<void>;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({arrVarNames, template, callbackSave}) => {
    const [idLastElement, setIdLastElement] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState(false);

    const dispatch = useDispatch();
    const editedTemplate = useSelector((state: RootState) => state.template.template);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const getCursorPosition = (): number => {
        const textarea = document.getElementById('textarea'+idLastElement) as HTMLTextAreaElement;
        const curPos = textarea.selectionStart;
        return curPos;
    }

    const addBlockWithDispatch = async (
        action: InsertAction,
        obj: any 
      ) => {
        await dispatch(saveTrigger());
        setTimeout(() => {
          dispatch(action(obj));
        }, 10);
    };
     
    const updateEditedTemplate = async (): Promise<void> =>{
        await dispatch(saveTrigger());
    }

    const addConditionBlock = () => {
        const cursorPosition = getCursorPosition();
        const obj = { id: idLastElement, cursorPosition: cursorPosition };

        dispatch(setCursorPosition(cursorPosition));
        addBlockWithDispatch(insertBlock, obj);
    };
      
    const addVariable = async (variable: string): Promise<void> => {
        const cursorPosition = getCursorPosition()
        const obj = { id: idLastElement, cursorPosition: cursorPosition, text: variable };

        dispatch(setCursorPosition(cursorPosition + variable.length));
        addBlockWithDispatch(insertText, obj);
    };
      
    const handleBlockInteraction = (lastBlockId: string) => {
        setIdLastElement(lastBlockId);
    };

    const handleButtonClick = async () => {
        await updateEditedTemplate();
        await callbackSave(editedTemplate);
    };

    React.useEffect(() => {
        dispatch(setTemplate(template));
        setIdLastElement(template?.templateBlocks[0]?.id || '');    
    }, []);

    return (
        <div>
            {!isOpen ?
                <button onClick={toggleOpen} className={styles['template-editor-btn']}>
                    Message Editor
                </button>
            :
                <div>
                    <div className={styles['template-editor-toolbar']}>
                        <TemplateVariableButtons
                            variableNames={arrVarNames}
                            onClick={addVariable}
                        />
                        <ConditionalBlockButton 
                            handleClick={addConditionBlock}
                            ifText='[{some_variable} or expression]'
                            thenText='[then_value]'
                            elseText='[else_value]'
                        />
                    </div>
                    <div className={styles['template-editor-container']}>
                        <BlockTree
                            template={editedTemplate || new Template([])}
                            handleBlockInteraction={handleBlockInteraction}
                        />
                        <div className={styles['template-editor-bottom']}>
                            <button onClick={handleButtonClick} className={styles['template-editor-btn']}>Save</button>
                            <TemplateViewer arrVarNames={arrVarNames} template={editedTemplate} saveChanges={updateEditedTemplate}/>
                            <button onClick={toggleOpen} className={styles['template-editor-btn']}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default TemplateEditor;