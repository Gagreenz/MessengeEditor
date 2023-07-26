import React from "react";
import BlockBase from "../BlockBase";
import styles from "./ConditionalBlockComponent.module.css";

import ConditionalBlock from "../../../models/ConditionalBlock";
import BaseTemplateBlock from "../../../models/BaseTemplateBlock";

import { deleteBlock } from "../../../redux/slices/templateSlice";
import { useDispatch } from "react-redux";

interface ConditionalBlockProps {
    block: ConditionalBlock;
    handleBlockInteraction: (lastBlockId: string, cursorPosition: number) => void;
}

const ConditionalBlockComponent: React.FC<ConditionalBlockProps> = ({ block, handleBlockInteraction}) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        let payload = { id: block.id }
        dispatch(deleteBlock(payload));
    }

    const getBlocks = (blocks: BaseTemplateBlock[]) => {
        var result: any[] = [];
        blocks.forEach((block) => {
            result.push(
                <BlockBase
                    key={'blockbase ' + block.id.substring(0,6)}
                    block={block}
                    handleBlockInteraction={handleBlockInteraction}
                />
            )
        })

        return result;
    }

    return (
        <div className={styles["conditional-block"]}>
          <button
            className={styles["conditional-block__delete-btn"]}
            onClick={handleButtonClick}
          >
            -
          </button>
          <span className={styles["conditional-block__label"]}>IF</span>
          <div className={styles["conditional-block__item"]}>
            <BlockBase
              key={'blockbase ' + block.id.substring(0, 8)}
              block={block.if}
              handleBlockInteraction={handleBlockInteraction}
            />
          </div>
          <span className={styles["conditional-block__label"]}>THEN</span>
          <div className={styles["conditional-block__item"]}>
            {getBlocks(block.thenBlock.templateBlocks)}
          </div>
          <span className={styles["conditional-block__label"]}>ELSE</span>
          <div className={styles["conditional-block__item"]}>
            {getBlocks(block.elseBlock.templateBlocks)}
          </div>
        </div>
      );
};
  
export default ConditionalBlockComponent;