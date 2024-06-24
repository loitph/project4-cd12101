import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getByUserId } from '../../bussinessLogic/todosLogic.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('http')
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    logger.info(`[L] > Getting list todo data: ${JSON.stringify(event)}`);

    const userId = getUserId(event);
    const items = (await getByUserId(userId));
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      }),
    };
  })
