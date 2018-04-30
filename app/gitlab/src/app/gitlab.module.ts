import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule} from "@angular/forms";
import { HttpModule } from '@angular/http';
import { GitlabFormComponent } from './gitlab-form.component';
import { GitlabService } from './gitlab.service';
import { SharedModule } from '../../shared/shared.module';
import { WorkspaceFieldComponent } from '../../shared/form/workspace-field.component';

import { LoginWorkspaceAppComponent } from './components/login-workspaceapp.component';
import { ListWorkspaceDataComponent } from './components/list-workspaces.component';
import { CreateWorkspaceComponent } from './components/create-workspace.component';
import { RevokeLoginWorkspaceAppComponent } from './components/revokelogin-workspaceapp.component';
import { LinkModalWorkspaceComponent } from './components/linkmodal-workspace.component';

import * as jQuery from 'jquery';

@NgModule({
  imports: [ BrowserModule, HttpModule, ReactiveFormsModule,
    SharedModule, FormsModule
  ],
  exports: [ WorkspaceFieldComponent ],
  declarations: [
    GitlabFormComponent, WorkspaceFieldComponent, ListWorkspaceDataComponent,
    LoginWorkspaceAppComponent, CreateWorkspaceComponent,
    RevokeLoginWorkspaceAppComponent,
    LinkModalWorkspaceComponent,
  ],
  providers: [ GitlabService ],
  bootstrap: [ GitlabFormComponent ],
  entryComponents: [
    WorkspaceFieldComponent, ListWorkspaceDataComponent, LoginWorkspaceAppComponent,
    CreateWorkspaceComponent, RevokeLoginWorkspaceAppComponent,
    LinkModalWorkspaceComponent
  ]
})
export class GitlabModule { }
