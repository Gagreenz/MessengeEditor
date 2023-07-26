import React from 'react';
import BaseTemplateBlock from '../../models/BaseTemplateBlock';
import BlockBase from './BlockBase';

interface BlockTreeProps {
    blocks: BaseTemplateBlock[];
    handleBlockInteraction: (lastBlockId: string, cursorPosition: number) => void;
}

const BlockTree: React.FC<BlockTreeProps> = ({blocks, handleBlockInteraction}) => {
    return (
        <div>
            {blocks.map((block) => {
                return (
                    <BlockBase
                      key={'blockbase ' + block.id.substring(0,6)}
                      block={block}
                      handleBlockInteraction = {handleBlockInteraction}
                    />
                  );
            })}
        </div>
    )
}

export default BlockTree;