export type Trainer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address1?: string | null;
  profileUrl?: string | null;
  aboutMe?: string | null;
  experience?: string | null;
  specialty?: string | null;
  profileImageUrl?: string | null;
  role: "TRAINER";
  createdAt: string;
  updatedAt?: string;
  services?: TrainerService[];
};

export type TrainerService = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  sessions: number;
  imageUrl?: string | null;
};
