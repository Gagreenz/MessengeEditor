import React from 'react';
import BaseTemplateBlock from '../../models/BaseTemplateBlock';
import BlockBase from './BlockBase';
import Template from '../../models/Template';

interface BlockTreeProps {
    template: Template;
    handleBlockInteraction: (lastBlockId: string) => void;
}

const BlockTree: React.FC<BlockTreeProps> = ({ template, handleBlockInteraction}) => {
    return (
        <div>
            {template.templateBlocks.map((block) => {
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