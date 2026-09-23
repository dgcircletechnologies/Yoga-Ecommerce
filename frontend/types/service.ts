export type Service = {
  id: string;
  name: string;
  description: string;
  details: string;
  price: string;
  sessions: string;
  image: string;
  trainer?: { id: string; name: string; profileImageUrl?: string | null; specialty?: string | null; experience?: string | null } | null;
  /** Legacy mock-data field; API-backed services do not use categories. */
  category?: string;
};
