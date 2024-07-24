export interface PaginationResult<Type> {
  currentPage: number;
  pageSize: number;
  total: number;
  data: Type[];
}
