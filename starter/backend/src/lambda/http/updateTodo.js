import middy from "@middy/core";
import cors from '@middy/http-cors'
import httpErrorHandler from "@middy/http-error-handler";
import { createLogger } from '../../utils/logger.mjs'
import { updateTodo } from "../../bussinessLogic/todosLogic.mjs";
import { getUserId } from "../utils.mjs";

const logger = createLogger('http');
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const userId = getUserId(event);
    const updateRequest = JSON.parse(event.body);
    const todoId = event.pathParameters.todoId;

    logger.info(`[L] > Updating todo data: ${JSON.stringify(updateRequest)} - for todo id: ${todoId}`);
    await updateTodo(userId, todoId, updateRequest);

    return {
      statusCode: 204,
    };
  });
