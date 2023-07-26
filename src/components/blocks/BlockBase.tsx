import React from 'react';

import BaseTemplateBlock from '../../models/BaseTemplateBlock';

import ConditionalBlockEditor from './ConditionalBlock/ConditionalBlockComponent';
import TextBlockEditor from './TextBlock/TextBlockComponent';
import TextBlock from '../../models/TextBlock';
import ConditionalBlock from '../../models/ConditionalBlock';

const createBlockEditor = ({block, handleBlockInteraction}: BlockEditorProps): JSX.Element | null => {
  switch (true) {
    case block instanceof ConditionalBlock:
      return (
        <ConditionalBlockEditor
          key={block.id}
          block={block as ConditionalBlock}
          handleBlockInteraction={handleBlockInteraction}
        />
      );
    case block instanceof TextBlock:
      return (
        <TextBlockEditor
          key={block.id}
          block={block as TextBlock}
          handleBlockInteraction={handleBlockInteraction}
        />
      );
    default:
      return null;
  }
}

interface BlockEditorProps {
    block: BaseTemplateBlock;
    handleBlockInteraction: (lastBlockId: string, cursorPosition: number) => void;
}

const BlockBase: React.FC<BlockEditorProps> = ({block, handleBlockInteraction}) => {
    const editorComponent = createBlockEditor({block, handleBlockInteraction});

    return editorComponent;
}

export default BlockBase;