# envconfig

An env config validator using [JSON schema](https://json-schema.org/)

## Installation

Install latest using npm:
```npm
npm install @hzabala/envconfig
```

## Usage

You can start by creating an interface to structure your config and provide it as type to `JSONSchemaType<T>`. 
Define your schema as you would normally do using JSON Schema, but type should always be `object` and additionalProperties to `true` (especially when you're using dotenv).

Pass `process.env` (if you're using dotenv) or any key-value pair to the function as input.

```typescript
import { JSONSchemaType } from 'ajv';
import dotenv from 'dotenv';
dotenv.config();

import { createConfig } from '@hzabala/envconfig';

interface Config {
  PORT: number;
  DATABASE_URL: string;
  SECRET: string;
}

const schema: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    PORT: {
      type: 'integer',
      default: 3000,
    },
    DATABASE_URL: {
      type: 'string',
    },
    SECRET: {
      type: 'string',
    }
  },
  additionalProperties: true,
  required: ['DATABASE_URL', 'SECRET']
}

const config: Config = createConfig({ input: process.env, schema });
```

This project uses [Ajv](https://github.com/ajv-validator/ajv)
and supports [Ajv-formats](https://github.com/ajv-validator/ajv-formats) and [Ajv-keywords](https://github.com/ajv-validator/ajv-keywords) out of the box.

If you want to use additional Ajv plugins then you can extend the Ajv instance:
```typescript
import addErrors from 'ajv-errors';
import { createConfig, AjvInstance } from '@hzabala/envconfig';

addErrors(AjvInstance);
```
You can also override the instance by passing your own, but this would remove the defaults:
```typescript
const ajvInstance = new Ajv();
const config: Config = createConfig({ input: process.env, schema }, ajvInstance});
```

See [Examples](https://github.com/heanzyzabala/envconfig/blob/master/src/example.ts)

## Custom Keywords
### `splitter`
Configs can have array as value usually separated by commas. You configure that using the `splitter` keyword:

```bash
# .env
VALUE=one,two,three,four
```
```typescript
// example.ts
import { JSONSchemaType } from 'ajv';
import dotenv from 'dotenv';
dotenv.config();

import { createConfig } from '@hzabala/envconfig';

interface Config {
  VALUES: string[];
}

//@ts-ignore
const schema: JSONSchemaType<Config> = {
  type: 'object',
  properties: {
    VALUES: {
      type: 'string',
      splitter: ','
    },
  },
  additionalProperties: true,
  required: ['VALUES'],
}

const config: Config = createConfig({ input: procecss.env, schema });
// ['one','two','three','four']
```
This only supports `string` and you also need to suppress the error with `//@ts-ignore` because typescript tries to match the types in the interface and in the schema and we don't have a fix for that now.

## Contributing
Pull requests are welcome. Please open an issue first to discuss what you would like to change.

## License
```
MIT License

Copyright (c) 2021 Heanzy Zabala

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
