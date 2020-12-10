import { send } from '../deps.js';
import {getCurrentTime} from "../services/authService.js";

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request, session }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const time = await getCurrentTime();
  if (session && await session.get('authenticated')){
    const user = await session.get('user');
    console.log(`${request.method} ${request.url.pathname} at ${time.current_time} by user id: ${user.id} - ${ms} ms`);
  } else {
    console.log(`${request.method} ${request.url.pathname} at ${time.current_time} - ${ms} ms`);
  }
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const authentication = async({request, response, session}, next) => {
  if (request.url.pathname.startsWith('/behavior')) {
    if (session && await session.get('authenticated')) {
      response.status = 200;
      await next();
    } else {
      response.status = 401;
      response.redirect('/auth/login'); //comment out for authentication tests to pass
    }
  } else {
    response.status = 200;
    await next();
  }
}

export { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware, authentication };