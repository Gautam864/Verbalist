
export type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type ToDoList = {
  id: string;
  title: string;
  items: ListItem[];
  createdAt: string; // ISO string
};
