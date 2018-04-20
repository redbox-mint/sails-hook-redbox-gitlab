
export class LoginMessageForm {
  message: string;
  class: string;
}

export class Checks {
  link: any = undefined;
  rdmp: boolean = false;
  linkCreated: boolean = false;
  linkWithOther: boolean = false;
  master: boolean = false;
  comparing: boolean = false;
}

export class Group {
  name: string;
  id: string;
  path: string;
  isUser: boolean;
}

export class Template {
  pathWithNamespace: string;
}

export class Creation {
  created: boolean = false;
  name: string = '';
  namespace: string;
  blank: boolean = true;
  template: any;
  description: string = '';
  group: any;
  validateMessage: string;

  clear() {
    this.description = '';
    this.name = '';
  }
}

export class CreationAlert {
  message: string;
  creationAlert: string = '';
  class: string;
}

export class CurrentWorkspace {
  path_with_namespace: string = '';
  web_url: string = ''
}

export class WorkspaceUser {
  username: string;
  id: string;
}
