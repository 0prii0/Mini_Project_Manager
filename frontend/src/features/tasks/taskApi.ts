import { baseApi } from '../../store/api/baseApi';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  GetTasksQueryArgs,
  TasksResponse,
  TaskResponse,
  DeleteTaskResponse,
} from './taskTypes';

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, GetTasksQueryArgs>({
      query: ({ projectId, ...params }) => {
        const queryParams = new URLSearchParams();
        if (params.status && params.status !== 'ALL') {
          queryParams.append('status', params.status);
        }
        if (params.dateFilter && params.dateFilter !== 'ALL') {
          queryParams.append('dateFilter', params.dateFilter);
        }
        if (params.dueDateFrom) {
          queryParams.append('dueDateFrom', params.dueDateFrom);
        }
        if (params.dueDateTo) {
          queryParams.append('dueDateTo', params.dueDateTo);
        }
        if (params.sortBy) {
          queryParams.append('sortBy', params.sortBy);
        }
        if (params.order) {
          queryParams.append('order', params.order);
        }

        const queryString = queryParams.toString();
        return `/projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result, _error, { projectId }) =>
        result
          ? [
              ...result.tasks.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task' as const, id: `PROJECT_${projectId}` },
            ]
          : [{ type: 'Task' as const, id: `PROJECT_${projectId}` }],
    }),

    getTaskById: builder.query<TaskResponse, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task' as const, id }],
    }),

    createTask: builder.mutation<TaskResponse, CreateTaskRequest>({
      query: ({ projectId, ...body }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Task' as const, id: `PROJECT_${projectId}` },
        { type: 'Project' as const, id: projectId },
        { type: 'Project' as const, id: 'LIST' },
        'Dashboard',
      ],
    }),

    updateTask: builder.mutation<TaskResponse, UpdateTaskRequest>({
      query: ({ id, projectId: _p, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: 'Task' as const, id },
        { type: 'Task' as const, id: `PROJECT_${projectId}` },
        { type: 'Project' as const, id: projectId },
        { type: 'Project' as const, id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteTask: builder.mutation<DeleteTaskResponse, { id: string; projectId: string }>({
      query: ({ id }) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: 'Task' as const, id },
        { type: 'Task' as const, id: `PROJECT_${projectId}` },
        { type: 'Project' as const, id: projectId },
        { type: 'Project' as const, id: 'LIST' },
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
