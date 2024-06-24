import * as uuid from 'uuid'
import { TodosAccess } from "../dataLayer/todosAccess.mjs";
import { createLogger } from "../utils/logger.mjs";

const todosAccess = new TodosAccess();
const logger = createLogger('businessLogic')

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuid.v4();
  logger.info(`[L] > Creating todo id: ${todoId} - for user ${userId}`);

  return await todosAccess.create({
    todoId, userId,
    done: false,
    createdAt: new Date().toISOString(),
    ...createTodoRequest,
  });
}

export async function updateTodo(userId, todoId, updateTodoRequest) {
  logger.info(`[L] > Updating todo id: ${todoId} - for user id: ${userId} - data ${JSON.stringify(updateTodoRequest, null, 2)}`);
  return await todosAccess.update(userId, todoId, {...updateTodoRequest});
}

export async function deleteTodo(userId, todoId) {
  logger.info(`[L] > Creating todo id: ${todoId} - for user id: ${userId}`);
  return await todosAccess.delete(userId, todoId);
}

export async function getByUserId(userId) {
  logger.info(`[L] > Getting user by id: ${userId}`)
  return todosAccess.getByUserId(userId);
}

export async function setAttachmentUrl(userId, todoId, image, attachmentUrl) {
  logger.info(`[L] > Setting attachment url: ${attachmentUrl} - with todo id: ${todoId} - for user id: ${userId}`);
  return await todosAccess.setAttachmentUrl(userId, todoId, image, attachmentUrl);
}
