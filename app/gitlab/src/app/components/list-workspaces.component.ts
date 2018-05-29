import { Input, Output, Component, OnInit, Inject, Injector, EventEmitter} from '@angular/core';
import { SimpleComponent } from '../shared/form/field-simple.component';
import { FieldBase } from '../shared/form/field-base';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GitlabService } from '../gitlab.service';

declare var jQuery: any;

/**
 * Contributor Model
 *
 *
 * @author <a target='_' href='https://github.com/moisbo'>moisbo</a>
 *
 */
export class ListWorkspaceDataField extends FieldBase<any> {

  showHeader: boolean;
  loggedIn: boolean;
  loading: boolean;
  validators: any;
  enabledValidators: boolean;
  relatedObjects: object[];
  accessDeniedObjects: object[];
  failedObjects: object[];
  hasInit: boolean;
  columns: object[];
  rdmpLinkLabel: string;
  syncLabel: string;
  workspaces: any[];
  user: any;
  gitlabService: GitlabService;
  rdmp: string;

  @Output() checkLoggedIn: EventEmitter<any> = new EventEmitter<any>();
  @Output() linkModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() setWorkspaceUser: EventEmitter<any> = new EventEmitter<any>();

  constructor(options: any, injector: any) {
    super(options, injector);
    this.gitlabService = this.getFromInjector(GitlabService);
    this.relatedObjects = [];
    this.accessDeniedObjects = [];
    this.failedObjects = [];
    this.columns = options['columns'] || [];
    this.rdmpLinkLabel = options['rdmpLinkLabel'] || 'Plan';
    this.syncLabel = options['syncLabel'] || 'Sync';
    var relatedObjects = this.relatedObjects;
    this.value = options['value'] || this.setEmptyValue();
    this.relatedObjects = [];
    this.failedObjects = [];
    this.accessDeniedObjects = [];
    this.loading = true;
  }

  registerEvents() {
    this.fieldMap['LoginWorkspaceApp'].field['listWorkspaces'].subscribe(this.listWorkspaces.bind(this));    //TODO: this next line doesnt work because of when the form is being built
    this.fieldMap['CreateWorkspace'].field['listWorkspaces'].subscribe(this.listWorkspaces.bind(this));
    this.fieldMap['LinkModal'].field['listWorkspaces'].subscribe(this.listWorkspaces.bind(this));
    this.fieldMap['RevokeLogin'].field['revokePermissions'].subscribe(this.revoke.bind(this));
  }

  init(){
    this.rdmp = this.fieldMap._rootComp.rdmp;
  }

  revoke() {
    this.loggedIn = false;
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

  listWorkspaces() {
    this.loading = true;
    this.gitlabService.user().then(response => {
      if (response && response.status) {
        this.user = response.user;
        this.setWorkspaceUser.emit(this.user);
        this.workspaces = [];
        return this.gitlabService.projectsRelatedRecord()
          .then(response => {
            this.loading = false;
            this.loggedIn = this.fieldMap._rootComp.loggedIn = true;
            this.workspaces = response;
            this.checkLoggedIn.emit(true);
          });
      } else {
        this.loggedIn = this.fieldMap._rootComp.loggedIn = false;
        this.loading = false;
        this.checkLoggedIn.emit(false);
      }
    });
  }

  linkWorkspace(item) {
    this.linkModal.emit({rdmp: this.fieldMap._rootComp.rdmp, workspace: item});
  }

}

declare var aotMode
// Setting the template url to a constant rather than directly in the component as the latter breaks document generation
let wsListWorkspaceDataTemplate = './field-listworkspaces.html';
if(typeof aotMode == 'undefined') {
  wsListWorkspaceDataTemplate = '../angular/gitlab/components/field-listworkspaces.html';
}

/**
 * Component to display information from related objects within ReDBox
 */
@Component({
  selector: 'ws-listworkspaces',
  templateUrl: './field-listworkspaces.html'
})
export class ListWorkspaceDataComponent extends SimpleComponent {
  field: ListWorkspaceDataField;

  ngOnInit() {
    this.field.registerEvents();
    this.field.init();
  }

  ngAfterContentInit() {
    this.field.listWorkspaces();
  }

}
