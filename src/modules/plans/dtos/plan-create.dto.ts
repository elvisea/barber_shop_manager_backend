export type PlanCreateDTO = {
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  isActive?: boolean;
};
