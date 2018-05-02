# sails-hook-redbox-gitlab

A hook to add functionality to redbox-portal: http://github.com/redbox-mint/redbox-portal

Tested in Sails 1 and Redbox-Portal (branch develop_angularcli)

## How does this work?

After adding this hook into the core as a dependency by either npm yarn or manually into package.json. 
The hook its bootstrapped by the index.js of the program. 

1. Configure

Init the services, form configuration, recordType and workflow

2. Add Routes 

Define routes that are going to be available for the front end with its respective controller (API).

3. Angular

Copy either compiled or to be compiled angular application to the respective location
  
After bootstrap a message will appear that the hook was succesfully installed.

## TODO:

### Resolve redbox dependencies

A work around at the moment is to compile angular in the redbox-portal base code, until we have the necessary dependencies.

- '../../../shared/form/field-simple.component'
- '../../../shared/form/field-base'
- '../../shared/form/records.service'
- '../../shared/loadable.component'
- '../../shared/translation-service'.

### Test

- GitlabService
- GitlabController
- Angular App

## Configuration

### Angular

To build your angular app:

In redbox-portal/angular

- Go to app/gitlab

Compile:
- To compile `ng build --app=gitlab`

Develop:
- To develop `ng build --app=gitlab --watch` 



### Angular CLI Config for development

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


### Redbox-Portal

Form Loaded

```
sails.config['form']['forms']['gitlab-1.0-draft']
```
