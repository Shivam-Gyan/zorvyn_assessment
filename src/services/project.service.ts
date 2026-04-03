import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ApiError } from '../utils/ApiError';

interface ProjectInput {
  name: string;
  description?: string;
  members?: string[];
}

export const projectService = {
  async createProject(userId: string, payload: ProjectInput) {
    const project = await Project.create({
      ...payload,
      owner: userId,
      members: payload.members || [],
    });
    return project;
  },

  async listProjects(userId: string, role: string) {
    const filter = role === 'admin' ? {} : { $or: [{ owner: userId }, { members: userId }] };
    return Project.find(filter).populate('owner', 'name email').populate('members', 'name email').sort({ createdAt: -1 });
  },

  async getProjectById(projectId: string, userId: string, role: string) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, 'Invalid project id');
    }

    const project = await Project.findById(projectId).populate('owner', 'name email').populate('members', 'name email');
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const canAccess =
      role === 'admin' ||
      project.owner.toString() === userId ||
      project.members.some((member) => member.toString() === userId);

    if (!canAccess) {
      throw new ApiError(403, 'Forbidden: cannot access this project');
    }

    return project;
  },

  async updateProject(projectId: string, userId: string, role: string, payload: Partial<ProjectInput>) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const canManage = role === 'admin' || project.owner.toString() === userId;
    if (!canManage) {
      throw new ApiError(403, 'Forbidden: cannot update this project');
    }

    Object.assign(project, payload);
    await project.save();

    return project;
  },
};
