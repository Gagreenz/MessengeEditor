import React from "react";
import styles from "./TextBlockComponent.module.css";

import TextBlock from "../../../models/TextBlock";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux";
import { updateTemplate } from "../../../redux/slices/templateSlice";

interface TextBlockComponentProps {
    block: TextBlock;
    handleBlockInteraction: (lastBlockId: string, cursorPosition: number) => void;
}

const TextBlockComponent: React.FC<TextBlockComponentProps> = ({block, handleBlockInteraction}) => {
    const [text, setText] = React.useState(block.text);
    const textareaRef = React.useRef(null);
    
    const eventTriggered = useSelector((state: RootState) => state.template.eventTriggered);
    const dispatch = useDispatch();
    
    React.useEffect(() => {
        if (eventTriggered) {
            let payload = { id: block.id, text: text };
            dispatch(updateTemplate(payload));
        }
    }, [eventTriggered]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
        handleInputClick();
    };

    const handleInputClick = () => {
        var id: string;
        var cursorPosition: number;

        id = block.id;
        cursorPosition = textareaRef.current.selectionStart;

        handleBlockInteraction(id,cursorPosition);
    };

    React.useEffect(() => {
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
      }, []);

    return (
        <div className={styles["text-block-editor"]}>
            <textarea 
                value={text}
                onChange={handleTextChange}
                onClick={handleInputClick}
                ref={textareaRef}
            ></textarea>
        </div>
    );
};

export default TextBlockComponent;