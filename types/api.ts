export type PaginationMeta = {
  total?: number;
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  data?: T[];
  meta?: PaginationMeta;
};

export type ApiProblem = {
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  error?: ApiProblem;
};
