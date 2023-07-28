import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Template from '../../models/Template';
import TextBlock from '../../models/TextBlock';
import TemplateHelper from '../../helpers/TemplateHelper';

interface UpdateTemplatePayload {
  id: string;
  text: string;
}

interface InsertBlockTemplatePayload {
  id: string;
  cursorPosition: number;
}

interface InsertTextTemplatePayload {
  id: string;
  cursorPosition: number;
  text: string;
}

interface DeleteBlockTemplatePayload {
  id: string;
}

interface CursorInfo {
  blockId: string;
  position: number;
}

const initialState = {
  eventTriggered: false,
  template: new Template([new TextBlock('TEST')]),
  activeId: '',
  cursorPosition: 0,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<Template>) => {
      state.template = action.payload;
    },
    setActiveId: (state, action: PayloadAction<string>) => {
      state.activeId = action.payload;
    },
    setCursorPosition: (state, action: PayloadAction<number>) => {
      state.cursorPosition = action.payload;
    },
    insertBlock: (state, action: PayloadAction<InsertBlockTemplatePayload>) => {
      state.template = new Template(TemplateHelper.insertBlockIntoBlock(
        state.template.templateBlocks,
        action.payload.id,
        action.payload.cursorPosition
      ));
    },
    insertText: (state, action: PayloadAction<InsertTextTemplatePayload>) => {
      state.template = TemplateHelper.insertTextIntoBlock(
        state.template,
        action.payload.id,
        action.payload.cursorPosition,
        action.payload.text
      );
    },
    deleteBlock: (state, action: PayloadAction<DeleteBlockTemplatePayload>) => {
      state.template = TemplateHelper.deleteBlock(state.template, action.payload.id);
    },
    updateTemplate: (state, action: PayloadAction<UpdateTemplatePayload>) => {
      state.template = TemplateHelper.updateBlockText(state.template, action.payload.id, action.payload.text);
      state.eventTriggered = false;
    },
    saveTrigger: (state) => {
      state.eventTriggered = true;
    },
  },
});

export const { setTemplate, insertBlock, insertText, deleteBlock, updateTemplate, saveTrigger,setActiveId,setCursorPosition } = templateSlice.actions;
export default templateSlice.reducer;