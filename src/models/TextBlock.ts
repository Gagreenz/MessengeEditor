import BaseTemplateBlock from "./BaseTemplateBlock";
import { v4 as uuidv4 } from 'uuid';

class TextBlock extends BaseTemplateBlock {
    text: string;
  
    constructor(text: string,id?: string,) {
      super('textBlock');
      this.id = id || uuidv4();
      this.text = text;
    }
}

export default TextBlock;