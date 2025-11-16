
'use client';

import type { ToDoList, ListItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import ListItemComponent from './list-item';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '../ui/scroll-area';

type ListCardProps = {
  list: ToDoList;
  onUpdate: (list: ToDoList) => void;
  onDelete: (listId: string) => void;
};

export default function ListCard({ list, onUpdate, onDelete }: ListCardProps) {
  const handleItemChange = (updatedItem: ListItem) => {
    const updatedItems = list.items.map(item => (item.id === updatedItem.id ? updatedItem : item));
    onUpdate({ ...list, items: updatedItems });
  };

  const handleItemDelete = (itemId: string) => {
    const updatedItems = list.items.filter(item => item.id !== itemId);
    onUpdate({ ...list, items: updatedItems });
  };
  
  const handleAddItem = () => {
    const newItem: ListItem = {
      id: crypto.randomUUID(),
      text: 'New item',
      completed: false,
    };
    onUpdate({ ...list, items: [...list.items, newItem] });
  };

  return (
    <Card className="flex flex-col h-[450px] shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-xl font-bold truncate pr-2">{list.title}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0" aria-label="Delete list">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the "{list.title}" list and all its items.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(list.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="flex-grow pt-4 p-0">
        <ScrollArea className="h-full w-full">
          <div className="px-6 pb-4">
            {list.items.length > 0 ? (
              <ul className="space-y-4">
                {list.items.map(item => (
                  <ListItemComponent 
                    key={item.id} 
                    item={item} 
                    onUpdate={handleItemChange} 
                    onDelete={handleItemDelete}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground pt-12">This list is empty.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary-foreground" onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" /> Add item
        </Button>
      </CardFooter>
    </Card>
  );
}
