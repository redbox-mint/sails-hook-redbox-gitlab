
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

  clear() {
    this.linkCreated = false;
    this.linkWithOther = false;
  }
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
  id: string;
  created: boolean = false;
  name: string = '';
  title: string = '';
  location: string = '';
  completeName: string = '';
  namespace: any;
  blank: boolean = true;
  template: any;
  description: string = '';
  group: any;
  validateMessage: string;

  clear() {
    this.description = '';
    this.name = '';
    this.id = '';
  }

  nameHasSpaces() {
    return /\s/g.test(this.name);
  }
}

export class CreationAlert {
  message: string = '';
  className: string = 'danger';
  status: string = '';

  set({message, status, className}) {
    this.message = message;
    this.status = status;
    this.className = className;
  }

  clear() {
    this.message = '';
    this.className = 'danger';
    this.status = '';
  }

}

export class CurrentWorkspace {
  path_with_namespace: string = '';
  web_url: string = ''
}

export class WorkspaceUser {
  username: string;
  id: string;
}
