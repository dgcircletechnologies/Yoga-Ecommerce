export type Service = {
  id: string;
  name: string;
  description: string;
  details: string;
  price: string;
  sessions: string;
  image: string;
  /** Legacy mock-data field; API-backed services do not use categories. */
  category?: string;
};
