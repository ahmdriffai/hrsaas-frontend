import type { Paging } from "./paging-types";

export type PaginatedData<T> = {
  paging: Paging;
  data: T[];
};
