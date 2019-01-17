import {Injectable, Inject} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';

import {BaseService} from "./shared/base-service";
import {ConfigService} from "./shared/config-service";

@Injectable()
export class GitlabService extends BaseService {

  protected baseUrl: any;
  public recordURL: string = this.brandingAndPortalUrl + '/record/view';
  protected initSubject: any;

  constructor(@Inject(Http) http: Http,
              @Inject(ConfigService) protected configService: ConfigService) {
    super(http, configService);
    this.initSubject = new Subject();
    this.emitInit();
  }

  public waitForInit(handler: any) {
    const subs = this.initSubject.subscribe(handler);
    this.emitInit();
    return subs;
  }

  public emitInit() {
    if (this.brandingAndPortalUrl) {
      this.initSubject.next('');
    }
  }

  token(login) {
    //build wsUrl here with server client
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/token';
    return this.http.post(
      wsUrl,
      {username: login.username, password: login.password},
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      })
      .catch((res: any) => {
        console.log(res);
        return this.extractData(res);
      });
  }

  revokeToken() {
    const wsUrl = this.brandingAndPortalUrl + `/ws/gitlab/revokeToken?ts=${new Date().getTime()}`;
    return this.http.get(
      wsUrl,
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      })
      .catch((res: any) => {
        console.log(res);
        return this.extractData(res);
      });
  }

  user() {
    const wsUrl = this.brandingAndPortalUrl + `/ws/gitlab/user?ts=${new Date().getTime()}`;
    return this.http.get(
      wsUrl,
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      })
      .catch((res: any) => {
        console.log(res);
        return this.extractData(res);
      });
  }

  projects() {
    const wsUrl = this.brandingAndPortalUrl + `/ws/gitlab/projects?ts=${new Date().getTime()}`;
    return this.http.get(
      wsUrl,
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res)
      })
      .catch((res: any) => {
        console.log(res);
        return this.extractData(res);
      });
  }

  projectsRelatedRecord({page, perPage}) {
    const wsUrl = this.brandingAndPortalUrl + `/ws/gitlab/projectsRelatedRecord?page=${page}&perPage=${perPage}&ts=${new Date().getTime()}`;
    return this.http.get(
      wsUrl,
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res)
      })
      .catch((res: any) => {
        console.log(res);
        return this.extractData(res);
      });
  }

  link({rdmp, branch, pathWithNamespace, currentWorkspace, recordMap}) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/link';
    return this.http.post(
      wsUrl,
      {
        rdmpId: rdmp, branch: branch, pathWithNamespace: pathWithNamespace,
        project: currentWorkspace, recordMap: recordMap
      },
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      })
      .catch((res: any) => {
        console.log(res);
        return this.extractData(res);
      });
  }

  checkLink(token: string, rdmpId: string, projectNameSpace: string) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/checkLink';
    return this.http.post(
      wsUrl,
      {token: token, rdmpId: rdmpId, projectNameSpace: projectNameSpace},
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  checkRepo(fieldToCheck: string, branch: string) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/checkRepo';
    return this.http.post(
      wsUrl,
      {projectNameSpace: fieldToCheck, branch: branch},
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  compareLink(token: string, projectNameSpace: string) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/compareLink';
    return this.http.post(
      wsUrl,
      {token: token, projectNameSpace: projectNameSpace},
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  createWorkspace(creation: any) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/create';
    //TODO: check namespace when creation
    return this.http.post(
      wsUrl,
      {creation: creation},
      this.options
    )
      .delay(5000)
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  createWithTemplate(creation: any) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/createWithTemplate';
    //TODO: check namespace when creation
    return this.http.post(
      wsUrl,
      {creation: creation},
      this.options
    )
      .delay(5000)
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  project(pathWithNamespace: string) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/project';
    //TODO: check namespace when creation
    return this.http.post(
      wsUrl,
      {pathWithNamespace: pathWithNamespace},
      this.options
    )
      .delay(5000)
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  updateProject(creation: any) {
    const wsUrl = this.brandingAndPortalUrl + '/ws/gitlab/updateProject';
    //TODO: check namespace when creation
    return this.http.post(
      wsUrl,
      {creation: creation},
      this.options
    )
      .delay(6000)
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  groups() {
    const wsUrl = this.brandingAndPortalUrl + `/ws/gitlab/groups?ts=${new Date().getTime()}`;
    //TODO: check namespace when creation
    return this.http.get(
      wsUrl,
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }

  templates() {
    const wsUrl = this.brandingAndPortalUrl + `/ws/gitlab/templates?ts=${new Date().getTime()}`;
    //TODO: check namespace when creation
    return this.http.get(
      wsUrl,
      this.options
    )
      .toPromise()
      .then((res: any) => {
        return this.extractData(res);
      });
  }
}
