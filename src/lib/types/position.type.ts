export type Position = {
  id: string;
  name: string;
  parent?: Position | null;
  company_id: string;
};
