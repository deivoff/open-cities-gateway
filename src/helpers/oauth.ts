import { Context } from 'koa';

export const oauthHandler = (ctx: Context) => {
  ctx.body = `<script>
  window.opener.postMessage({ source: 'auth', payload: { code: '${ctx.request.query.code}' } },
    '*'
  );</script>`;
};
