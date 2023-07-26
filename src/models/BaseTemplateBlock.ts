import { v4 as uuidv4 } from 'uuid';

abstract class BaseTemplateBlock {
    id: string;
    type: string;
  
    constructor(type: string){
      this.type = type;
      this.id = uuidv4();
    }
}

export default BaseTemplateBlock;