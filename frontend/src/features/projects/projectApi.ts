import { baseApi } from '../../store/api/baseApi';
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  ProjectResponse,
  DeleteProjectResponse,
} from './projectTypes';

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectsResponse, void>({
      query: () => '/projects',
      providesTags: (result) =>
        result
          ? [
              ...result.projects.map(({ id }) => ({ type: 'Project' as const, id })),
              { type: 'Project' as const, id: 'LIST' },
            ]
          : [{ type: 'Project' as const, id: 'LIST' }],
    }),

    getProjectById: builder.query<ProjectResponse, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project' as const, id }],
    }),

    createProject: builder.mutation<ProjectResponse, CreateProjectRequest>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Project' as const, id: 'LIST' }, 'Dashboard'],
    }),

    updateProject: builder.mutation<ProjectResponse, UpdateProjectRequest>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project' as const, id },
        { type: 'Project' as const, id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteProject: builder.mutation<DeleteProjectResponse, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project' as const, id },
        { type: 'Project' as const, id: 'LIST' },
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
