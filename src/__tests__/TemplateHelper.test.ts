import TemplateHelper from "../helpers/TemplateHelper";
import ConditionalBlock from "../models/ConditionalBlock";
import Template from "../models/Template";
import TextBlock from "../models/TextBlock";

describe('TemplateHelper - concatenateTextBlocks', () => {
  it('should concatenate text from block without variables', () => {
    const textBlock1 = new TextBlock('Hello, world!');

    const result = TemplateHelper.concatenateTextBlocks([textBlock1], {});
    expect(result).toBe('Hello, world! ');
  });

  it('should replace variables in text blocks', () => {
    const textBlock1 = new TextBlock('My name is {name}.');
    const variableValues = { name: 'John' };

    const result = TemplateHelper.concatenateTextBlocks([textBlock1], variableValues);
    expect(result).toBe('My name is John. ');
  });

  it('should`t replace variables in text blocks', () => {
    const textBlock1 = new TextBlock('My name is {notExistVar}.');
    const variableValues = { name: 'John' };

    const result = TemplateHelper.concatenateTextBlocks([textBlock1], variableValues);
    expect(result).toBe('My name is {notExistVar}. ');
  });

  it('should handle conditional blocks with not empty condition', () => {
    const textBlock1 = new TextBlock('Variable should be');
    const textBlock2 = new TextBlock('|CORRECT|');
    const textBlock3 = new TextBlock('|FATAL|');
    const textBlock4 = new TextBlock('conditional block.');
    const conditionalBlock = new ConditionalBlock(
      new TextBlock('{condition}'),
      new Template([textBlock2]),
      new Template([textBlock3])
    );
    const variableValues = { condition: 'any string' };

    const result = TemplateHelper.concatenateTextBlocks(
      [textBlock1, conditionalBlock, textBlock4],
      variableValues
    );
    expect(result).toBe('Variable should be |CORRECT| conditional block. ');
  });

  it('should handle conditional blocks with empty condition', () => {
    const textBlock1 = new TextBlock('Variable should be');
    const textBlock2 = new TextBlock('|FATAL|');
    const textBlock3 = new TextBlock('|CORRECT|');
    const textBlock4 = new TextBlock('conditional block.');
    const conditionalBlock = new ConditionalBlock(
      new TextBlock('{condition}'),
      new Template([textBlock2]),
      new Template([textBlock3])
    );
    const variableValues = { condition: '' };

    const result = TemplateHelper.concatenateTextBlocks(
      [textBlock1, conditionalBlock, textBlock4],
      variableValues
    );
    expect(result).toBe('Variable should be |CORRECT| conditional block. ');
  });

  it('should handle depth conditional blocks condition', () => {
    const textBlock1 = new TextBlock('Start condition block {');
    const textBlock2 = new TextBlock('|FATAL|');
    const textBlock3 = new TextBlock('|CORRECT|');
    const textBlock4 = new TextBlock('} end.');
    const conditionalBlockLevel2 = new ConditionalBlock(
      new TextBlock('{deepCondition}'),
      new Template([textBlock2]),
      new Template([textBlock3])
    );
    const conditionalBlockLevel1 = new ConditionalBlock(
      new TextBlock('{condition}'),
      new Template([textBlock1, conditionalBlockLevel2, textBlock4]),
      new Template([textBlock2])
    );
    const variableValues = { condition: 'variable' , deepCondition: ''};

    const result = TemplateHelper.concatenateTextBlocks(
      [textBlock1, conditionalBlockLevel1, textBlock4],
      variableValues
    );
    expect(result).toBe('Start condition block { Start condition block { |CORRECT| } end. } end. ');
  });

});
