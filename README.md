# sails-hook-redbox-gitlab

## TODO:

- Resolve redbox dependencies
- Test

## Angular

To build your angular app:

- Go to app/gitlab

Compile:
- To compile `ng build --app=gitlab`

Develop:
- To develop `ng build --app=gitlab --watch` 


## Redbox-Portal

Form Loaded

```
sails.config['form']['forms']['gitlab-1.0-draft']
```

## Angular CLI Config

Add to angular/.angular-cli.json in `apps`
```json
    {
      "name": "gitlab",
      "root": "gitlab",
      "outDir": "../assets/angular/gitlab",
      "assets": [
        "assets",
        "favicon.ico"
      ],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "styles": [
        "styles.css"
      ],
      "scripts": [
        "../node_modules/jquery/dist/jquery.min.js"
      ],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    }
```

Install jquery types dev dependencies

```
    "@types/jquery": "^3.3.1",
```
or `yarn add --dev @types/jquery`


add this hook to redbox

```json
    "sails-hook-redbox-gitlab": "https://github.com/moisbo/sails-hook-redbox-gitlab.git",
```
or `yarn add https://github.com/moisbo/sails-hook-redbox-gitlab.git`

