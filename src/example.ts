import { JSONSchemaType } from 'ajv';
import dotenv from 'dotenv';
dotenv.config();

import { createConfig } from './';

interface Config {
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  STRINGS: string[];
  NUMBERS: number[];
  BOOLEANS: boolean[];
  RANGE: number;
}

//@ts-ignore
const schema: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    DB_HOST: {
      type: 'string',
      format: 'hostname',
    },
    DB_PORT: {
      type: 'string',
    },
    DB_NAME: {
      type: 'string',
    },
    DB_USER: {
      type: 'string',
      default: 'dev',
    },
    DB_PASS: {
      type: 'string',
      default: '',
    },
    STRINGS: {
      type: 'string',
      splitter: ',',
    },
    RANGE: {
      type: 'integer',
      range: [1, 101],
    },
    API_URL: {
      type: 'string',
      format: 'uri',
    },
  },
  additionalProperties: true,
  required: ['DB_HOST', 'DB_PORT', 'DB_NAME', 'API_URL', 'STRINGS'],
};

try {
  const config: Config = createConfig({ input: process.env, schema });
  console.log(config);
} catch (err) {
  console.log(err);
}
