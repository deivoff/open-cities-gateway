import { Access, AccessType } from '.';
import { UserType } from '$components/user';

export function getDefaultAccessSettings(type?: AccessType): Access {

  if (type === AccessType.city) {
    return {
      view: {
        anyone: true,
      },
      comment: {
        role: UserType.researcher,
      },
      edit: {
        role: UserType.admin
      },
      coowner: {}
    }
  }

  return {
    view: {
      anyone: true,
    },
    comment: {},
    edit: {},
    coowner: {}
  }
}

export function getUserAccess({ role, id }) {
  return {

  }
}
