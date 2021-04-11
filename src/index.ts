import Ajv, { JSONSchemaType, FuncKeywordDefinition } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';

const splitter: FuncKeywordDefinition = {
  keyword: 'splitter',
  type: 'string',
  modifying: true,
  valid: true,
  errors: true,
  // @ts-ignore
  compile: (schema) => (data, dataPath, parentData, parentDataProperty) => {
    if (parentData && parentDataProperty) {
      parentData[parentDataProperty] = data === '' ? [] : data.split(schema);
    } else {
      const { parentData: pData, parentDataProperty: pDataProperty } = dataPath;
      pData[pDataProperty] = data === '' ? [] : data.split(schema);
    }
  },
};

let ajvInstance = new Ajv({
  coerceTypes: true,
  useDefaults: true,
  removeAdditional: 'all',
  allowUnionTypes: true,
  allErrors: true,
  keywords: [splitter],
});
addFormats(ajvInstance);
addKeywords(ajvInstance);

const createConfig = <T>(props: ConfigProperties<T>, ajv?: Ajv): T => {
  if (ajv) ajvInstance = ajv;
  const { schema, input } = props;
  const inputCopy = JSON.parse(JSON.stringify(input));
  if (!schema || !input) {
    throw new Error('schema and input is required');
  }

  const validate = ajvInstance.compile(schema);
  if (validate(inputCopy)) {
    return inputCopy;
  } else {
    throw new Error(JSON.stringify(validate.errors))
  }
};

interface ConfigProperties<T> {
  schema: JSONSchemaType<T>;
  input: { [key: string]: any };
}

export {
  createConfig,
  ConfigProperties,
  ajvInstance as AjvInstance,
};
