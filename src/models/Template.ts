import BaseTemplateBlock from "./BaseTemplateBlock";

class Template {
    templateBlocks: BaseTemplateBlock[];
  
    constructor(blocks: BaseTemplateBlock[]) {
      this.templateBlocks = blocks;
    }
}

export default Template;