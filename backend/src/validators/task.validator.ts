import { z } from 'zod';

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

export const taskIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid task ID format. Must be a valid UUID' }),
});

export const projectTaskIdParamSchema = z.object({
  projectId: z.string().uuid({ message: 'Invalid project ID format. Must be a valid UUID' }),
});

export const createTaskSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title cannot be empty')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string()
      .trim()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional()
      .nullable(),
    status: TaskStatusEnum.optional().default('TODO'),
    dueDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date format. Must be a valid date string',
      })
      .optional()
      .nullable(),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(100, 'Title cannot exceed 100 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional()
      .nullable(),
    status: TaskStatusEnum.optional(),
    dueDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid due date format. Must be a valid date string',
      })
      .optional()
      .nullable(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const taskQuerySchema = z.object({
  status: z.enum(['ALL', 'TODO', 'IN_PROGRESS', 'DONE']).optional(),
  dateFilter: z.enum(['ALL', 'OVERDUE', 'TODAY', 'UPCOMING']).optional(),
  dueDateFrom: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid dueDateFrom date' })
    .optional(),
  dueDateTo: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid dueDateTo date' })
    .optional(),
  sortBy: z.enum(['dueDate', 'status', 'createdAt', 'title']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
