export type SubscriptionCreateDTO = {
  establishmentId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  paid?: boolean;
  phone: string;
};
