export interface Application {
  _id: string;
  traveler: string;
  destination: string;
  requirements: string[];
  validated: boolean;
}