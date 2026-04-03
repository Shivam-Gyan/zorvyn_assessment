import { FilterQuery } from 'mongoose';
import { Project } from '../models/Project';
import { ITask, Task } from '../models/Task';
import { ApiError } from '../utils/ApiError';

interface CreateTaskInput {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  project: string;
  assignee?: string;
  dueDate?: Date;
}

interface UpdateTaskInput extends Partial<CreateTaskInput> {}

interface ListTaskQuery {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  project?: string;
  assignee?: string;
}

const authorizeProjectAccess = async (projectId: string, userId: string, role: string): Promise<void> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const isMember = project.members.some((member) => member.toString() === userId);
  const canAccess = role === 'admin' || project.owner.toString() === userId || isMember;

  if (!canAccess) {
    throw new ApiError(403, 'Forbidden: project access denied');
  }
};

export const taskService = {
  async createTask(userId: string, role: string, payload: CreateTaskInput) {
    await authorizeProjectAccess(payload.project, userId, role);

    return Task.create({
      ...payload,
      createdBy: userId,
    });
  },

  async updateTask(taskId: string, userId: string, role: string, payload: UpdateTaskInput) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    await authorizeProjectAccess(task.project.toString(), userId, role);

    Object.assign(task, payload);
    await task.save();

    return task;
  },

  async getTask(taskId: string, userId: string, role: string) {
    const task = await Task.findById(taskId)
      .populate('project', 'name owner')
      .populate('assignee', 'name email role')
      .populate('createdBy', 'name email role');

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    await authorizeProjectAccess(task.project._id.toString(), userId, role);
    return task;
  },

  async listTasks(userId: string, role: string, query: ListTaskQuery) {
    const filter: FilterQuery<ITask> = {};

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.project) {
      await authorizeProjectAccess(query.project, userId, role);
      filter.project = query.project;
    }
    if (query.assignee) filter.assignee = query.assignee;

    if (role !== 'admin' && !query.project) {
      const projects = await Project.find({
        $or: [{ owner: userId }, { members: userId }],
      }).select('_id');
      filter.project = { $in: projects.map((p) => p._id) };
    }

    const skip = (query.page - 1) * query.limit;
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Task.find(filter)
        .populate('project', 'name')
        .populate('assignee', 'name email')
        .sort({ [query.sortBy]: sortDirection })
        .skip(skip)
        .limit(query.limit),
      Task.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async deleteTask(taskId: string, userId: string, role: string) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    const project = await Project.findById(task.project);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const canDelete = role === 'admin' || task.createdBy.toString() === userId || project.owner.toString() === userId;
    if (!canDelete) {
      throw new ApiError(403, 'Forbidden: cannot delete this task');
    }

    await task.deleteOne();
  },
};
