import { Access, ACCESS_CODE, ACCESS_FIELDS, AccessType } from '.';
import { USER_ROLE } from '$components/user';
import { ObjectId } from 'mongodb';

export function getDefaultAccessSettings(type?: AccessType): Access {

  if (type === AccessType.city) {
    return {
      view: {
        anyone: true,
      },
      comment: {
        role: USER_ROLE.RESEARCHER,
      },
      edit: {
        role: USER_ROLE.ADMIN
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

export function checkAccess(access: Access, user?: { access: USER_ROLE, id: string | ObjectId }) {
  return ACCESS_FIELDS.some(key => {
    if (access[key].anyone) {
      return true
    }

    if (user) {
      if (access[key].group?.includes(user.id)) {
        return true;
      }

      if (access[key].role === user.access) {
        return true;
      }
    }

    return false;
  })
}

export function getAccessCode(access: Access, user?: { access: USER_ROLE, id: string | ObjectId }) {
  let accessCode: ACCESS_CODE = ACCESS_CODE.NONE;

  if (access.view.anyone) {
    accessCode = ACCESS_CODE.VIEW;
  }

  if (access.comment.anyone) {
    accessCode = ACCESS_CODE.COMMENT
  }

  if (user) {
    if (
      access.view.role === user.access
      || access.view.group!.includes(user.id as ObjectId)
    ) {
      accessCode = ACCESS_CODE.VIEW;
    }

    if (
      access.comment.role === user.access
      || access.comment.group!.includes(user.id as ObjectId)
    ) {
      accessCode = ACCESS_CODE.COMMENT;
    }

    if (
      access.edit.role === user.access
      || access.edit.group!.includes(user.id as ObjectId)
    ) {
      accessCode = ACCESS_CODE.EDIT;
    }

    if (
      access.edit.role === user.access
      || access.edit.group!.includes(user.id as ObjectId)
    ) {
      accessCode = ACCESS_CODE.COOWNER;
    }

    if (user.access === USER_ROLE.ADMIN) {
      accessCode = ACCESS_CODE.COOWNER;
    }

  }

  return accessCode;
}
