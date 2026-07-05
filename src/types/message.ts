export type Message = {
  _id: string;
  text: string;
  sender: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};