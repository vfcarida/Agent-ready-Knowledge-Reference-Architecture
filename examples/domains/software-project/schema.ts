import { z } from 'zod';

export const SoftwareProjectADRSchema = z.object({
  type: z.literal('ArchitectureDecisionRecord'),
  id: z.string(),
  title: z.string(),
  status: z.enum(['proposed', 'accepted', 'deprecated', 'superseded']),
  date: z.string(),
  authors: z.array(z.string()),
});

export const SoftwareProjectRequirementSchema = z.object({
  type: z.literal('Requirement'),
  id: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['backlog', 'in-progress', 'done']),
});
