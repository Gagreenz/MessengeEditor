import BaseTemplateBlock from "../models/BaseTemplateBlock";
import ConditionalBlock from "../models/ConditionalBlock";
import Template from "../models/Template";

import TextBlock from "../models/TextBlock";


class TemplateHelper {
  static deleteBlock(template: Template, id: string): Template {
    const newTemplateBlocks = template.templateBlocks.reduce((result, block, index) => {
      if (block.id === id) {
        // Если текущий блок имеет указанный id, проверяем наличие предыдущего и следующего блоков
        const prevBlock = index > 0 ? result[index - 1] : null;
        const nextBlock = index < template.templateBlocks.length - 1 ? template.templateBlocks[index + 1] : null;
  
        // Проверяем, являются ли предыдущий и следующий блоки TextBlock
        const isPrevTextBlock = prevBlock instanceof TextBlock;
        const isNextTextBlock = nextBlock instanceof TextBlock;
  
        // Объединяем текстовые блоки, если предыдущий и следующий блоки - оба TextBlock
        if (isPrevTextBlock && isNextTextBlock) {
          const prevTextBlock = prevBlock as TextBlock;
          const nextTextBlock = nextBlock as TextBlock;
          const newText = prevTextBlock.text + nextTextBlock.text;
          // Заменяем предыдущий блок с объединенным текстом
          result[index - 1] = new TextBlock(newText);
          template.templateBlocks.splice(index + 1);
        } 
        return result;
      } else if (block instanceof ConditionalBlock) {
        // Удаляем блок из условного блока (если блок находится в then или else)
        const updatedThenBlock = this.deleteBlock(block.thenBlock, id);
        const updatedElseBlock = this.deleteBlock(block.elseBlock, id);
        result.push(new ConditionalBlock(block.if, updatedThenBlock, updatedElseBlock, block.id));
        return result;
      }
  
      // Добавляем текущий блок в новый массив
      result.push(block);
      return result;
    }, [] as BaseTemplateBlock[]);
  
    return new Template(newTemplateBlocks);
  }
  
  static updateBlockText(template: Template, id: string, text: string): Template {
    // Создаем новый массив для обновленных блоков шаблона.
    const newTemplateBlocks = template.templateBlocks.map((block) => {
      // Если блок является текстовым блоком (textBlock) и имеет совпадающий идентификатор (id)
      // и является экземпляром класса TextBlock, заменяем его на новый текстовый блок с переданным текстом и идентификатором.
      if (block.type === "textBlock" && block.id === id && block instanceof TextBlock) {
        return new TextBlock(text, id);
      }
      // Если блок является условным блоком (conditionalBlock), обновляем его составляющие блоки:
      else if (block.type === "conditionalBlock") {
        // Приводим блок к типу ConditionalBlock.
        const conditionalBlock = block as ConditionalBlock;
        // Обновляем условный блок (if) внутри условного блока, если его идентификатор совпадает
        // и он является экземпляром класса TextBlock, заменяем его на новый текстовый блок.
        const updatedIfBlock = conditionalBlock.if.id === id && conditionalBlock.if instanceof TextBlock
          ? new TextBlock(text, id)
          : conditionalBlock.if;
        // Рекурсивно обновляем блок внутри блока "then" условного блока.
        const updatedThenBlock = this.updateBlockText(conditionalBlock.thenBlock, id, text);
        // Рекурсивно обновляем блок внутри блока "else" условного блока.
        const updatedElseBlock = this.updateBlockText(conditionalBlock.elseBlock, id, text);
  
        // Возвращаем новый условный блок с обновленными составляющими.
        return new ConditionalBlock(updatedIfBlock, updatedThenBlock, updatedElseBlock, conditionalBlock.id);
      }
      // Если блок не является текстовым или условным блоком, возвращаем его без изменений.
      else {
        return block;
      }
    });
  
    // Возвращаем новый объект Template с обновленными блоками.
    return new Template(newTemplateBlocks);
  }

  static insertTextIntoBlock(template: Template, id: string, cursorPosition: number, text: string): Template {
    // Проходим по существующим блокам шаблона (`templateBlocks`).
    const newTemplateBlocks = template.templateBlocks.map((block) => {
      if (block.id === id && block instanceof TextBlock) {
        // Обновляем текст текущего блока, вставляя `text` в указанную позицию `cursorPosition`.
        const updatedText = block.text.slice(0, cursorPosition) + text + block.text.slice(cursorPosition);
        // Создаем и возвращаем новый экземпляр `TextBlock` с обновленным текстом.
        return new TextBlock(updatedText);
      } else if (block instanceof ConditionalBlock) {
        // Обновляем условный блок `if`, если его идентификатор совпадает с указанным `id`.
        const updatedIfBlock = block.if.id === id
          ? new TextBlock(block.if.text.slice(0, cursorPosition) + text + block.if.text.slice(cursorPosition))
          : block.if;
        // Рекурсивно вызываем этот же метод для блоков `thenBlock` и `elseBlock` и обновляем их содержимое.
        const updatedThenBlock = this.insertTextIntoBlock(block.thenBlock, id, cursorPosition, text);
        const updatedElseBlock = this.insertTextIntoBlock(block.elseBlock, id, cursorPosition, text);
  
        // Создаем и возвращаем новый экземпляр `ConditionalBlock` с обновленными блоками и условием.
        return new ConditionalBlock(updatedIfBlock, updatedThenBlock, updatedElseBlock, block.id);
      } else {
        // Если текущий блок не удовлетворяет условиям, просто возвращаем его без изменений.
        return block;
      }
    });
  
    // Создаем и возвращаем новый объект `Template`, содержащий обновленные блоки.
    return new Template(newTemplateBlocks);
  }

  static insertBlockIntoBlock(templateBlocks: BaseTemplateBlock[], id: string, cursorPosition: number): BaseTemplateBlock[] {
    // Используем метод `flatMap` для прохода по массиву существующих блоков шаблона (`templateBlocks`).
    const newTemplateBlocks = templateBlocks.flatMap((block) => {
      if (block.id === id && block instanceof TextBlock) {
        // Разделяем текущий текстовый блок на два блока на указанной позиции `cursorPosition`.
        return this.splitTextBlock(block, cursorPosition);
      } else if (block instanceof ConditionalBlock) {
        // Рекурсивно вызываем этот же метод для блоков `thenBlock` и `elseBlock` и обновляем их содержимое.
        const updatedThenBlock = this.insertBlockIntoBlock(block.thenBlock.templateBlocks, id, cursorPosition);
        const updatedElseBlock = this.insertBlockIntoBlock(block.elseBlock.templateBlocks, id, cursorPosition);
  
        // Создаем и возвращаем новый экземпляр `ConditionalBlock` с обновленными блоками и условием.
        return new ConditionalBlock(block.if, new Template(updatedThenBlock), new Template(updatedElseBlock), block.id);
      } else {
        // Если текущий блок не удовлетворяет условиям, просто возвращаем его без изменений.
        return block;
      }
    });
  
    // Возвращаем обновленный массив блоков шаблона.
    return newTemplateBlocks as BaseTemplateBlock[];
  }

  private static splitTextBlock(block: TextBlock, cursorPosition: number): BaseTemplateBlock[] {
    let splitedTextBlocks = TemplateHelper.splitAndInsertConditionalBlock(block,cursorPosition);
    return splitedTextBlocks;
  }

  static concatenateTextBlocks(blocks: BaseTemplateBlock[], variableValues: { [key: string]: string }): string {
    let result = '';
    for (const block of blocks) {
      if (block instanceof TextBlock) {
        result += this.replaceVariablesInString(block.text,variableValues) + ' ';
      } else if (block instanceof ConditionalBlock) {
        const variableName = block.if.text.replace(/{|}/g, '');
        const variableValue = variableValues[variableName];
        if (variableValue!= undefined && variableValue !== '') {
          result += TemplateHelper.concatenateTextBlocks(block.thenBlock.templateBlocks, variableValues);
        } else {
          result += TemplateHelper.concatenateTextBlocks(block.elseBlock.templateBlocks, variableValues);
        }
      }
    }
    return result;
  }

  private static replaceVariablesInString(str: string, variableValues: { [key: string]: string }): string {
    const regex = new RegExp(`{(${Object.keys(variableValues).join('|')})}`, 'g');
    return str.replace(regex, (match, key) => variableValues[key] || match);
  }

  static fromJson(json: string): Template {
    if (json === null) return new Template([new TextBlock(" ")]);
    const data = JSON.parse(json);
    const templateBlocks = data.templateBlocks.map((blockData: any) => {
      if (blockData.type === 'conditionalBlock') {
        const ifBlock = new TextBlock(blockData.if.text, blockData.if.id);
        const thenBlock = this.fromJson(JSON.stringify(blockData.thenBlock));
        const elseBlock = this.fromJson(JSON.stringify(blockData.elseBlock));
        return new ConditionalBlock(ifBlock, thenBlock, elseBlock, blockData.id);
      } else if (blockData.type === 'textBlock') {
        return new TextBlock(blockData.text, blockData.id);
      } else {
        throw new Error(`Unknown block type: ${blockData.type}`);
      }
    });
  
    return new Template(templateBlocks);
  }

  static getEmptyCondtionBlock(): ConditionalBlock {
    let ifTextBlock = new TextBlock('{YOUR_CONDTION}');
    let thenTemplate = new Template([new TextBlock('THEN_TEXT')]);
    let elseTemplate = new Template([new TextBlock('ELSE_TEXT')]);
    return new ConditionalBlock(ifTextBlock, thenTemplate, elseTemplate );
  } 

  static splitAndInsertConditionalBlock(textBlock: TextBlock, cursorPosition: number) {
    const splitedTextBlocks = this.split(textBlock, cursorPosition);
    const conditionalBlock = this.getEmptyCondtionBlock();

    splitedTextBlocks.splice(1, 0, conditionalBlock);
    return splitedTextBlocks;
  }

  private static split(textblock: TextBlock, cursorPoint: number): BaseTemplateBlock[] {
    const firstHalf = textblock.text.substring(0,cursorPoint);
    const secondHalf = textblock.text.substring(cursorPoint);

    return (
      [new TextBlock(firstHalf) ,new TextBlock(secondHalf)]
    )
  }

}

export default TemplateHelper;