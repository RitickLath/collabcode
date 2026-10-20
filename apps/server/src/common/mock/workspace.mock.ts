/**
 * Centralized mock data used strictly during local development.
 * Never exposed or included in production builds.
 */

export interface MockWorkspaceOptions {
  page?: number;
  limit?: number;
  role?: 'all' | 'owner' | 'member';
  search?: string;
}

export const getMockWorkspaces = (
  userId: string,
  options?: MockWorkspaceOptions,
) => {
  const allMocks = [
    {
      id: 'ws-demo-nextjs-1',
      ownerId: userId,
      name: 'quantum-compiler-web',
      slug: 'quantum-compiler-web',
      description:
        'Next.js 14 fullstack architecture with App Router, Tailwind CSS and multiplayer sync.',
      framework: 'NEXTJS',
      gitUrl: null,
      visibility: 'PRIVATE',
      status: 'READY',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      owner: {
        id: userId,
        username: 'you',
        email: 'you@collabcode.dev',
      },
      members: [
        {
          id: 'm-1',
          role: 'EDITOR',
          user: { id: 'u-1', username: 'sarah_dev', email: 'sarah@team.io' },
        },
        {
          id: 'm-2',
          role: 'EDITOR',
          user: { id: 'u-2', username: 'alex_k', email: 'alex@team.io' },
        },
        {
          id: 'm-3',
          role: 'VIEWER',
          user: {
            id: 'u-3',
            username: 'michael',
            email: 'michael@google.com',
          },
        },
      ],
    },
    {
      id: 'ws-demo-python-2',
      ownerId: 'other-user-uuid-999',
      name: 'neural-forecasting-model',
      slug: 'neural-forecasting-model',
      description:
        'Jupyter runtime, Pandas and PyTorch training pipelines with distributed container pods.',
      framework: 'PYTHON',
      gitUrl: 'https://github.com/ai-lab/neural-forecast.git',
      visibility: 'PUBLIC',
      status: 'READY',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      owner: {
        id: 'other-user-uuid-999',
        username: 'david_lead',
        email: 'david@company.ai',
      },
      members: [
        {
          id: 'm-4',
          role: 'EDITOR',
          user: { id: userId, username: 'you', email: 'you@collabcode.dev' },
        },
        {
          id: 'm-5',
          role: 'EDITOR',
          user: { id: 'u-5', username: 'elena_r', email: 'elena@company.ai' },
        },
        {
          id: 'm-6',
          role: 'EDITOR',
          user: { id: 'u-6', username: 'kai_zen', email: 'kai@company.ai' },
        },
        {
          id: 'm-7',
          role: 'VIEWER',
          user: { id: 'u-7', username: 'priya_m', email: 'priya@company.ai' },
        },
        {
          id: 'm-8',
          role: 'VIEWER',
          user: { id: 'u-8', username: 'tomas_b', email: 'tomas@company.ai' },
        },
      ],
    },
    {
      id: 'ws-demo-fastapi-3',
      ownerId: userId,
      name: 'micro-gateway-service',
      slug: 'micro-gateway-service',
      description:
        'FastAPI REST gateway with Pydantic v2 schemas and Redis PubSub cache broker.',
      framework: 'FASTAPI',
      gitUrl: null,
      visibility: 'PRIVATE',
      status: 'CREATING',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      owner: {
        id: userId,
        username: 'you',
        email: 'you@collabcode.dev',
      },
      members: [
        {
          id: 'm-9',
          role: 'EDITOR',
          user: { id: 'u-9', username: 'rohit_s', email: 'rohit@tech.io' },
        },
      ],
    },
  ];

  let filtered = allMocks;

  if (options?.role === 'owner') {
    filtered = filtered.filter((w) => w.ownerId === userId);
  } else if (options?.role === 'member') {
    filtered = filtered.filter((w) => w.ownerId !== userId);
  }

  if (options?.search) {
    const s = options.search.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.name.toLowerCase().includes(s) ||
        w.framework.toLowerCase().includes(s) ||
        w.description?.toLowerCase().includes(s),
    );
  }

  const page = Number(options?.page) || 1;
  const limit = Number(options?.limit) || 6;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
