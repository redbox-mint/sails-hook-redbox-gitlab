import { Input, Output, Component, OnInit, Inject, Injector, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { SimpleComponent } from '../shared/form/field-simple.component';
import { FieldBase } from '../shared/form/field-base';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from "lodash-es";

import { GitlabService } from '../gitlab.service';
import { Creation, CreationAlert, Template, Checks, CurrentWorkspace, Group, WorkspaceUser } from './shared';

declare var jQuery: any;

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
  dismissLabel: string;
  createWorkspaceLabel: string;
  workspaceDetailsLabel: string;
  selectSpace: string;
  nameWorkspace: string;
  addDescription: string;
  selectTemplate: string;
  nameWorkspaceValidation: string;
  nameHasSpacesValidation: string;
  descriptionWorkspaceValidation: string;
  workspaceCreated: string;
  linkingWorkspace: string;
  creatingWorkspace: string;
  updatingWorkspace: string;

  validations: any[];
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

  @Output() listWorkspaces: EventEmitter<any> = new EventEmitter<any>();

  constructor(options: any, injector: any) {
    super(options, injector);
    this.gitlabService = this.getFromInjector(GitlabService);
    this.checks = new Checks();
    this.currentWorkspace = new CurrentWorkspace();
    this.workspaceUser = new WorkspaceUser();
    this.creation = new Creation();
    this.creationAlert = new CreationAlert();
    this.createLabel = options['createLabel'] || '';
    this.dismissLabel = options['dismissLabel'] || '';
    this.createWorkspaceLabel = options['createWorkspaceLabel'] || '';
    this.workspaceDetailsLabel = options['workspaceDetailsLabel'] || '';
    this.selectSpace = options['selectSpace'] || '';
    this.nameWorkspace = options['nameWorkspace'] || '';
    this.addDescription = options['addDescription'] || '';
    this.selectTemplate = options['selectTemplate'] || '';
    this.recordMap = options['recordMap'] || [];
    this.branch = options['branch'] || '';
    this.nameWorkspaceValidation = options['nameWorkspaceValidation'] || '';
    this.nameHasSpacesValidation = options['nameHasSpacesValidation'] || '';
    this.descriptionWorkspaceValidation = options['descriptionWorkspaceValidation'] || '';
    this.workspaceCreated = options['workspaceCreated'] || '';
    this.linkingWorkspace = options['linkingWorkspace'] || '';
    this.creatingWorkspace = options['creatingWorkspace'] || '';
    this.updatingWorkspace = options['updatingWorkspace'] || '';
  }

  init() {
    this.rdmp = this.fieldMap._rootComp.rdmp;
  }

  registerEvents() {
    this.fieldMap['ListWorkspaces'].field['checkLoggedIn'].subscribe(this.checkLogin.bind(this));
    this.fieldMap['RevokeLogin'].field['revokePermissions'].subscribe(this.revoke.bind(this));
  }
  revoke(){
    this.checkLogin(false);
  }

  checkLogin(status: boolean) {
    this.loggedIn = this.fieldMap._rootComp.loggedIn = status;
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
    this.creationAlert.clear();
    let group = new Group();
    group.id = this.workspaceUser.id; group.path = this.workspaceUser.username; group.isUser = true;
    this.groups = [group];
    this.creation.group = this.groups[0];
    this.templates = [{pathWithNamespace: undefined}];
    this.creation.template = this.templates[0];
    jQuery('#createModal').modal({show: true, keyboard: false});
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
    this.validations = this.validateWorkspace();
    this.creationAlert.clear();
    if(this.validations.length <= 0) {
      if(this.creation.template.pathWithNamespace) {
        this.createWithTemplate();
      } else {
        this.createWorkspace();
      }
    }
  }

  validateWorkspace() {
    const validateWorkspace = [];
    if(!this.creation.name) {
      validateWorkspace.push({message: this.nameWorkspaceValidation});
    }
    if(this.creation.nameHasSpaces()) {
      validateWorkspace.push({message: this.nameHasSpacesValidation});
    }
    // if(!this.creation.description) {
    //   validateWorkspace.push({message: this.descriptionWorkspaceValidation});
    // }
    return validateWorkspace;
  }

  createWorkspace() {
    this.creationAlert.set({message: this.creatingWorkspace, status: 'working', className: 'warning'});
    this.gitlabService.createWorkspace(this.creation)
      .then(response => {
        if(!response.status) {
          //TODO: improve this assignment in case of error.
          const name = response.message.error.error.message.name || '';
          throw new Error('Name ' + _.first(name));
        } else {
          return this.checkCreation();
        }
      }).then(response => {
      if(!response.status) {
        //TODO: improve this assignment in case of error.
        const name = response.message.error.error.message.name || '';
        throw new Error(name);
      } else {
        this.creationAlert.set({message: this.linkingWorkspace, status: 'working', className: 'warning'});
        this.creation.namespace = response.namespace;
        this.creation.id = response.id;
        this.creation.title = response.name_with_namespace;
        this.creation.location = response.http_url_to_repo
        this.creation.completeName = response.name_with_namespace;
        return this.gitlabService.link({rdmp: this.rdmp, branch: this.branch,
          pathWithNamespace: `${this.creation.namespace.path}/${this.creation.name}`,
          currentWorkspace: this.creation, recordMap: this.recordMap})
          .then(response => {
            if(!response.status) {
              throw new Error(response.message.description);
            }
            this.creationAlert.set({message: this.workspaceCreated, status: 'done', className: 'success'});
            this.listWorkspaces.emit();
          });
      }
    })
      .catch(error => {
        this.creationAlert.set({message: error, status: 'error', className: 'danger'});
      });
  }

  createWithTemplate() {
    this.creationAlert.set({message: this.creatingWorkspace, status: 'working', className: 'warning'});
    this.gitlabService.createWithTemplate(this.creation)
      .then(response => {
        this.creationAlert.set({message: this.updatingWorkspace, status: 'working', className: 'warning'});
        return this.gitlabService.updateProject(this.creation);
      })
      .then(response => {
        if(!response.status){
          //TODO: improve this assignment in case of error.
          const name = response.message.error.error.message.name || '';
          throw new Error(name);
        } else {
          this.creationAlert.set({message: this.linkingWorkspace, status: 'working', className: 'warning'});
          this.creation.namespace = {path: this.creation.group.path};
          this.creation.id = response.id;
          this.creation.title = response.name_with_namespace;
          this.creation.location = response.http_url_to_repo;
          this.creation.completeName = response.name_with_namespace;
          return this.gitlabService.link({
            rdmp: this.rdmp, branch: this.branch,
            pathWithNamespace: `${this.creation.namespace.path}/${this.creation.name}`,
            currentWorkspace: this.creation, recordMap: this.recordMap
          })
            .then(response => {
              if(!response.status){
                throw new Error(response.message.description);
              } else {
                this.creationAlert.set({message: this.workspaceCreated, status: 'done', className: 'success'});
                this.listWorkspaces.emit();
              }
            });
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        this.creationAlert.set({message: error, status: 'error', className: 'danger'});
      });
  }

  checkCreation() {
    let pathWithNamespace = '';
    pathWithNamespace = this.creation.group.path + '/' + this.creation.name;
    return this.gitlabService.project(pathWithNamespace);
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
  templateUrl: './field-createworkspace.html'
})
export class CreateWorkspaceComponent extends SimpleComponent {
  field: CreateWorkspaceField;

  ngOnInit() {
    this.field.init();
    this.field.registerEvents();
  }
}
