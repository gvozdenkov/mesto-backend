# Backend for Mesto project

## Комментарий для ревьюера

Я немного упоролся по настроке проекта. Настроил минимальный CI, настроил работу с базой и
приложением в докере. Настроил валидацию .env переменных и тесды для роутов /users которые не
связаны с залогиненным пользователем.

### Для БЫСТРОГО запуска:

1. Скопировать файл `.env.example` и назвать `.env`
2. Запустить с помощью `makefile`: `make run-dev`
3. Или запуск без `makefile`: `docker compose -f compose-dev.yaml up -d --build`

## Techstack

- Typescript
- Mongodb
- Node.js + Express

## Workflow setup

### Eslint

Install deps:

```bash
yarn add -D eslint eslint-config-airbnb-base eslint-config-airbnb-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-import-resolver-typescript eslint-plugin-import
```

### Prettier

Install exact versions (I have some bugs with prettier 3)

```bash
yarn add -D prettier@2.8.7 eslint-plugin-prettier@4.2.1 eslint-config-prettier
```

Add to eslint config:

```js
module.exports = {
  extends: [
    // add at the end of array!
    "pretter"
  ],
  plugins: {
    "prettier"
  },
  rules: {
    // highlight prettier errors
    "prettier/prettier": ["error"],
  }
}
```

Add script in `package.json` fix prettier styles:

```json
"scripts": {
  "prettier:write": "prettier --write ./**/*.{ts,js} ./*.{json,md,yml} -l",
}
```

### Commit check

This project is [Commitizen](https://www.npmjs.com/package/commitizen?activeTab=readme) friendly. So
you can easy create commits in a step by step guide by run:

```bash
yarn cz
```

If you are mannually create commit message it will be linted with `commitlint` to lint commit
messages acording with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

- `husky` & `lint-stage` to fix & lint staged files before commit.
- `commitlint` to lint commit message according
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Install deps:

```bash
yarn add -D cz-git commitizen @commitlint/cli @commitlint/config-conventional @commitlint/format
```

## Local dev with Docker

To start local dev in docker container use `makefile`:

```bash
make run-dev
# without -d detached option to see logs in terminal
make run-dev-d
# and
make stop-dev
```

This will build docker images for `mongodb` and `express` app & run containers with volumes. Local
service started on `http:localhost:3000/api/v1`

For testing run `yarn test`. This will set `NODE_ENV` to `test` and run `mocha` integration tests in
separate test container.

## Local dev without Docker

I use `tsx` to run `.ts` file with ESM modules support

```bash
yarn dev
```

## API Documentation

I use the Contract First approach when developing APIs based on OpenApi v3.1

1. Created a contract document describing the API in the `/docs/openapi.yaml` folder.
2. I use the `swagger-i18n-extension` package to generate localized copies of the docs.

```json
 "swagger:docs": "yarn swagger-i18n-extension translate-all ./docs/openapi.yaml"
```

This script generate localized versions from the `./docs/openapi.yaml`

I use `swagger-ui-express` serve docs on `/docs` route. For example for `en`: `/api/v1/docs/en`

```ts
// app.ts

// add router for app & docs
app.use('/api/v1', router);

// router.ts

router.use('/docs', docRouter);

// docRouter.ts

// download .yaml specs
var openApiSpecRu = YAML.load(fs.readFileSync('docs/openapi.rus.yaml', 'utf-8'));
var openApiSpecEn = YAML.load(fs.readFileSync('docs/openapi.eng.yaml', 'utf-8'));

// server localized swagger docs on different routes
docRouter.use('/en', swaggerUi.serveFiles(openApiSpecEn, {}), swaggerUi.setup(openApiSpecEn));
docRouter.use('/ru', swaggerUi.serveFiles(openApiSpecRu, {}), swaggerUi.setup(openApiSpecRu));
```

## Test Driven Development

I decided to use only integration tests because only the server responses are important to the end
user. The model and access to the database do not require testing. If something goes wrong at this
stage, the tests will automatically fail. This makes the tests resistant to refactoring. You can
replace the database and internal processes, the only important thing is that the server response
remains the same

```bash
yarn add mocha @types/mocha chai @types/chai tsx
```

Use Mocha & Chai for testing

Use `tsx` to work with .ts test files. Create `mocharc.json` to config Mocha for TS (spec/test files
located near the tested files in `src`):

```json
{
  "require": ["tsx"],
  "extensions": ["ts"],
  "spec": ["src/**/*.spec.*"],
  "watch-files": ["src"]
}
```

Add script to `package.json`:

```diff
  "scripts": {
+    "test": "cross-env NODE_ENV=test mocha 'src/**/*.{spec,test}.ts'",
+    "test:watch": "mocha --watch",
  },
```

Run `yarn test` to run mocha tests

Run `yarn test:watch` to run mocha in watch mode to rerun tests on edits (not workin well with ts
now...)
