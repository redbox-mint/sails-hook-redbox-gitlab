import { Input, Output, Component, OnInit, Inject, Injector, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { SimpleComponent } from '../../../shared/form/field-simple.component';
import { FieldBase } from '../../../shared/form/field-base';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from "lodash-es";

import { GitlabService } from '../gitlab.service';
import { Creation, CreationAlert, Template, Checks, CurrentWorkspace, Group, WorkspaceUser } from './shared';

import * as jQuery from 'jquery';

/**
* Contributor Model
*
* @author <a target='_' href='https://github.com/moisbo'>moisbo</a>
*
*/
export class CreateWorkspaceField extends FieldBase<any> {

  showHeader: boolean;
  loggedIn: boolean;
  validators: any;
  enabledValidators: boolean;
  hasInit: boolean;
  createLabel: string;
  cancelLabel: string;
  createWorkspaceLabel: string;
  workspaceDetailsLabel: string;
  selectSpace: string;
  nameWorkspace: string;
  addDescription: string;
  selectTemplate: string;
  nameWorkspaceValidation: string;
  descriptionWorkspaceValidation: string;
  workspaceCreated: string;
  creatingWorkspace: string;

  loadingModal: boolean;

  checks: Checks;
  creation: Creation;
  creationAlert: CreationAlert;
  processing: boolean = false;
  currentWorkspace: CurrentWorkspace;
  workspaceUser: WorkspaceUser;
  groups: Group[];
  templates: Template[];

  gitlabService: GitlabService;
  rdmp: string;
  recordMap: any[];
  branch: string;

  constructor(options: any, injector: any) {
    super(options, injector);
    this.gitlabService = this.getFromInjector(GitlabService);
    this.checks = new Checks();
    this.currentWorkspace = new CurrentWorkspace();
    this.workspaceUser = new WorkspaceUser();
    this.creation = new Creation();
    this.createLabel = options['createLabel'] || '';
    this.cancelLabel = options['cancelLabel'] || '';
    this.createWorkspaceLabel = options['createWorkspaceLabel'] || '';
    this.workspaceDetailsLabel = options['workspaceDetailsLabel'] || '';
    this.selectSpace = options['selectSpace'] || '';
    this.nameWorkspace = options['nameWorkspace'] || '';
    this.addDescription = options['addDescription'] || '';
    this.selectTemplate = options['selectTemplate'] || '';
    this.recordMap = options['recordMap'] || [];
    this.branch = options['branch'] || '';
    this.nameWorkspaceValidation = options['nameWorkspaceValidation'] || '';
    this.descriptionWorkspaceValidation = options['descriptionWorkspaceValidation'] || '';
    this.workspaceCreated = options['workspaceCreated'] || '';
    this.creatingWorkspace = options['creatingWorkspace'] || '';
  }

  init() {
    this.rdmp = this.fieldMap._rootComp.rdmp;
  }

  registerEvents() {
    this.fieldMap['ListWorkspaces'].field['checkLoggedIn'].subscribe(this.checkLogin.bind(this));
  }

  checkLogin(status){
    this.loggedIn = status;
  }

  createFormModel(valueElem: any = undefined): any {
    if (valueElem) {
      this.value = valueElem;
    }

    this.formModel = new FormControl(this.value || []);

    if (this.value) {
      this.setValue(this.value);
    }

    return this.formModel;
  }

  setValue(value:any) {
    this.formModel.patchValue(value, {emitEvent: false });
    this.formModel.markAsTouched();
  }

  setEmptyValue() {
    this.value = [];
    return this.value;
  }

  loadCreateWorkspaceModal() {
    //To populate dropdown with first space and template
    this.workspaceUser = this.fieldMap._rootComp.workspaceUser;
    this.loadingModal = true;
    this.creation.clear();
    let group = new Group();
    group.id = this.workspaceUser.id; group.path = this.workspaceUser.username; group.isUser = true;
    this.groups = [group];
    this.creation.group = this.groups[0];
    this.templates = [{pathWithNamespace: undefined}];
    this.creation.template = this.templates[0];
    jQuery('#createModal')['modal']({show: true, keyboard: false});
    this.gitlabService.groups()
    .then(response => {
      this.groups = this.groups.concat(response);
      return this.gitlabService.templates();
    }).then(response => {
      this.templates = this.templates.concat(response);
      this.loadingModal = false;
    })
    .catch(error => {
      this.loadingModal = false;
      this.creationAlert.message = error;
    });
  }

  create() {
    if(this.validateWorkspace()){
      this.creationAlert.message = this.creatingWorkspace;
      this.creationAlert.creationAlert = 'info';
      if(this.creation.template.pathWithNamespace){
        this.createWithTemplate();
      }else {
        this.createWorkspace();
      }
    }else {
      this.creationAlert.message = this.creation.validateMessage;
      this.creationAlert.class = 'danger';
    }
  }

  validateWorkspace() {
    if(!this.creation.name) {
      this.creation.validateMessage = this.nameWorkspaceValidation;
      this.creationAlert.class = 'danger';
      return false;
    }
    if(!this.creation.description) {
      this.creation.validateMessage = this.descriptionWorkspaceValidation;
      this.creationAlert.class = 'danger';
      return false;
    }
    this.creationAlert.message = undefined;
    this.creationAlert.class = undefined;
    return true;
  }

  createWorkspace() {
    this.gitlabService.createWorkspace(this.creation)
    .then(response => {
      if(response.status == false){
        //TODO: improve this assignment in case of error.
        const name = response.message.error.error.message.name || '';
        throw new Error('Name ' + _.first(name));
      } else {
        return this.checkCreation();
      }
    }).then(response => {
      if(response.status == false){
        //TODO: improve this assignment in case of error.
        const name = response.message.error.error.message.name || '';
        throw new Error(_.first(name));
      } else {
        this.creationAlert.message = 'Linking workspace';
        this.creationAlert.class = 'warning';
        this.creation.namespace = this.creation.group.path;
        return this.gitlabService.link({rdmp: this.rdmp, branch: this.branch, currentWorkspace: this.creation, recordMap: this.recordMap})
        .then(response => {
          if(response.status == false){
            throw new Error(response.message.description);
          }
          this.creationAlert.message = this.workspaceCreated;
          this.creationAlert.class = 'success';
        });
      }
    })
    .catch(error => {
      this.creationAlert.class = 'danger';
      this.creationAlert.message = error;
    });
  }

  createWithTemplate() {
    this.gitlabService.createWithTemplate(this.creation)
    .then(response => {
      return this.gitlabService.updateProject(this.creation);
    })
    .then(response => {
      if(response.status == false){
        //TODO: improve this assignment in case of error.
        const name = response.message.error.error.message.name || '';
        throw new Error(_.first(name));
      } else {
        this.creationAlert.message = 'Linking workspace';
        this.creationAlert.class = 'warning';
        this.creation.namespace = this.creation.group.path;
        return this.gitlabService.link({rdmp:this.rdmp, branch: this.branch, currentWorkspace: this.creation, recordMap: this.recordMap})
        .then(response => {
          if(response.status == false){
            throw new Error(response.message.description);
          }
          this.creationAlert.message = this.workspaceCreated;
          this.creationAlert.class = 'success';
        });
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      this.creationAlert.class = 'danger';
      this.creationAlert.message = error;
    });
  }

  checkCreation() {
    let pathWithNamespace = '';
    pathWithNamespace = this.creation.group.path + '/' + this.creation.name;
    return this.gitlabService.project(pathWithNamespace);
  }

  checkName() {
    //TODO: check workspace name if it is available
  }


}

declare var aotMode;
// Setting the template url to a constant rather than directly in the component as the latter breaks document generation
let createModalWorkspaceTemplate = './field-createworkspace.html';
if(typeof aotMode == 'undefined') {
  createModalWorkspaceTemplate = '../angular/gitlab/components/field-createworkspace.html';
}

/**
* Component that CreateModal to a workspace app
*/
@Component({
  selector: 'ws-createworkspace',
  templateUrl: createModalWorkspaceTemplate
})
export class CreateWorkspaceComponent extends SimpleComponent {
  field: CreateWorkspaceField;

  ngOnInit() {
    this.field.init();
    this.field.registerEvents();
  }
}
