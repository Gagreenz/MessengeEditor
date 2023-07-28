import React from "react";
import styles from "./TextBlockComponent.module.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { setActiveId, setCursorPosition, updateTemplate } from "../../../redux/slices/templateSlice";

interface TextBlockComponentProps {
    blockId: string;
    blockText: string;
    handleBlockInteraction: (lastBlockId: string) => void;
}

const TextBlockComponent: React.FC<TextBlockComponentProps> = ({blockId, blockText, handleBlockInteraction}) => {
    const [text, setText] = React.useState(blockText);
    const textareaRef = React.useRef(null);

    const cursorPosition = useSelector((state: RootState) => state.template.cursorPosition);
    const eventTriggered = useSelector((state: RootState) => state.template.eventTriggered);
    const activeBlockId = useSelector((state: RootState) => state.template.activeId);

    const dispatch = useDispatch();
    
    React.useEffect(() => {
        if (eventTriggered) {
            let payload = { id: blockId, text: text };
            dispatch(updateTemplate(payload));
        }
    }, [eventTriggered]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
        handleInputClick();
    };
    
    const handleInputClick = () => {
        dispatch(setActiveId(blockId));

        const textarea = textareaRef.current;
        if (!textarea) return;
        dispatch(setCursorPosition(textarea.selectionStart));
        handleBlockInteraction(blockId);
    };

    const adjustSize = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const adjustTextareaHeight = () => {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
        };
        adjustTextareaHeight();
        textarea.addEventListener("input", adjustTextareaHeight);
        return () => {
          textarea.removeEventListener("input", adjustTextareaHeight);
        };
    }

    React.useLayoutEffect(() => {
        adjustSize();

        const textarea = textareaRef.current;
        if (!textarea) return;
        
        if(blockId == activeBlockId && textarea.selectionStart != cursorPosition) {
            textarea.selectionStart = cursorPosition;
            textarea.selectionEnd = cursorPosition;
            textarea.focus();
        }
        
    })

    React.useEffect(() => {
        setText(blockText);
    }, [blockText]);

    return (
        <div className={styles["text-block-editor"]}>
            <textarea 
                value={text}
                onChange={handleTextChange}
                onClick={handleInputClick}
                ref={textareaRef}
                id={'textarea'+blockId}
            />
        </div>
    );
};

export default TextBlockComponent;