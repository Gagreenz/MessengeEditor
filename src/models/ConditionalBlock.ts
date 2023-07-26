import BaseTemplateBlock from "./BaseTemplateBlock";
import Template from "./Template";
import TextBlock from "./TextBlock";
import { v4 as uuidv4 } from 'uuid';

class ConditionalBlock extends BaseTemplateBlock {
    if: TextBlock;
    thenBlock: Template;
    elseBlock: Template;
  
    constructor(
      variableName: TextBlock,
      thenBlock: Template,
      elseBlock: Template,
      id?: string,
    ) {
      super('conditionalBlock');
      this.id = id || uuidv4();
      this.if = variableName;
      this.thenBlock = thenBlock;
      this.elseBlock = elseBlock;
    }
}

export default ConditionalBlock;