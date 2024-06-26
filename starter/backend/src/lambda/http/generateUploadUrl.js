import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { setAttachmentUrl } from '../../bussinessLogic/todosLogic.mjs'
import { getUserId } from "../utils.mjs";
import { getFormattedUrl, getUploadUrl } from "../../fileStoreage/attachmentUtils.mjs";

const logger = createLogger('http');
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true,
  }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    logger.info(`[L] > Attachment are uploading with id: ${todoId}`);

    const userId = getUserId(event);
    const image = JSON.parse(event.body);
    const attachmentUrl = getFormattedUrl(todoId);
    const uploadUrl = await getUploadUrl(todoId);

    await setAttachmentUrl(userId, todoId, image, attachmentUrl);
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      }),
    };
  })
