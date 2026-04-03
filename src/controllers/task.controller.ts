import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { formatResponse } from '../utils/apiResponse';

export const taskController = {
  async createTask(req: Request, res: Response) {
    const task = await taskService.createTask(req.user!.sub, req.user!.role, req.body);
    return res.status(201).json(formatResponse(true, 'Task created', task, null));
  },

  async updateTask(req: Request, res: Response) {
    const task = await taskService.updateTask(req.params.taskId, req.user!.sub, req.user!.role, req.body);
    return res.status(200).json(formatResponse(true, 'Task updated', task, null));
  },

  async getTask(req: Request, res: Response) {
    const task = await taskService.getTask(req.params.taskId, req.user!.sub, req.user!.role);
    return res.status(200).json(formatResponse(true, 'Task fetched', task, null));
  },

  async listTasks(req: Request, res: Response) {
    const result = await taskService.listTasks(req.user!.sub, req.user!.role, req.query as any);
    return res.status(200).json(formatResponse(true, 'Tasks fetched', result, null));
  },

  async deleteTask(req: Request, res: Response) {
    await taskService.deleteTask(req.params.taskId, req.user!.sub, req.user!.role);
    return res.status(200).json(formatResponse(true, 'Task deleted', null, null));
  },
};
