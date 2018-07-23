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

### Test

- GitlabService
- GitlabController
- Angular App

## Configuration

### Angular

Install Angular 1.7.4

```bash
npm install -g "@angular/cli@1.7.4"
```

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

## Development in redbox-portal

There are several ways to code against the redbox-portal. One of it is to link the code via `npm link`

*npm link this hook*

```bash
cd /into/where/hook/is/
npm link
```

npm link into redbox-portal

```bash
cd /into/redbox-portal/
npm link sails-hook-redbox-gitlab
```

If you are using vagrant, place the code inside of the same machine/docker. You can share it via the VagrantFile using sync_folder

```yml
  config.vm.synced_folder "/Users/moises/source/qcif/sails-hook-redbox-gitlab", "/opt/hooks/sails-hook-redbox-gitlab", id: "gitlab"
```

Copy changes from hook to portal

```bash
cp -r /opt/hooks/sails-hook-redbox-gitlab/app/gitlab/dist/* ./.tmp/public/angular/gitlab
```
