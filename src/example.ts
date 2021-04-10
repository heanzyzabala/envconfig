import { JSONSchemaType } from 'ajv'
import dotenv from 'dotenv';
dotenv.config();

import { createConfig } from '.'

interface Config {
  DB_HOST: number,
  DB_PORT: number,
  TOKEN: string,
}

const schema: JSONSchemaType<Config> = {
  type: "object",
  properties: {
    DB_HOST: {
      type: 'integer',
    },
    DB_PORT: {
      type: 'integer',
    },
    TOKEN: {
      type: 'string'
    }
  },
  additionalProperties: true,
  required: ['DB_HOST', 'DB_PORT', 'TOKEN'],
}

const config = createConfig({ input: process.env, schema });
console.log(config);