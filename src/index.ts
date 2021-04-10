import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const createConfig = <T>(props: ConfigProperties<T>, ajv?: Ajv) => {
  const { schema, input } = Object.assign({}, props)
  if (!schema || !input) {
    throw new Error('schema and input is required')
  }
  let ajvInstance = ajv
  if (!ajvInstance) {
    ajvInstance = new Ajv({
      coerceTypes: true,
      useDefaults: true,
    })
    addFormats(ajvInstance)
  }
  const validate = ajvInstance.compile(schema);
  console.log(validate(input))
  if (validate(input)) {
    return input
  } else {
    throw new Error(JSON.stringify(validate.errors))
  }
}

interface ConfigProperties<T> {
  schema: JSONSchemaType<T>
  input: any
}

export { createConfig };