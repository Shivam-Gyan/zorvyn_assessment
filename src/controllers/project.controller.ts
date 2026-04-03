import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { formatResponse } from '../utils/apiResponse';

export const projectController = {
  async createProject(req: Request, res: Response) {
    const project = await projectService.createProject(req.user!.sub, req.body);
    return res.status(201).json(formatResponse(true, 'Project created', project, null));
  },

  async listProjects(req: Request, res: Response) {
    const projects = await projectService.listProjects(req.user!.sub, req.user!.role);
    return res.status(200).json(formatResponse(true, 'Projects fetched', projects, null));
  },

  async getProject(req: Request, res: Response) {
    const project = await projectService.getProjectById(req.params.projectId, req.user!.sub, req.user!.role);
    return res.status(200).json(formatResponse(true, 'Project fetched', project, null));
  },

  async updateProject(req: Request, res: Response) {
    const project = await projectService.updateProject(req.params.projectId, req.user!.sub, req.user!.role, req.body);
    return res.status(200).json(formatResponse(true, 'Project updated', project, null));
  },
};
