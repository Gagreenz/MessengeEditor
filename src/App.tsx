import React from 'react';

import TemplateEditor from './components/TemplateEditor/TemplateEditor';
import TemplateHelper from './helpers/TemplateHelper';
import Template from './models/Template';

const arrVarNames = localStorage.arrVarNames ? JSON.parse(localStorage.arrVarNames) : ['firstname', 'lastname', 'company', 'position'];

const callbackSave = async (updatedTemplate: Template) => {
  localStorage.setItem('template', JSON.stringify(updatedTemplate));
};

const templateJson: string = localStorage.template ? localStorage.template : null;
const temp: Template = TemplateHelper.fromJson(templateJson);

const App: React.FC = () => {
  return (
    <div>
      <TemplateEditor
        arrVarNames={arrVarNames}
        template={temp}
        callbackSave={callbackSave}
      />
    </div>
  );
};

export default App;