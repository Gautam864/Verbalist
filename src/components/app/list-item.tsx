
'use client';

import { useState, useRef, useEffect } from 'react';
import type { ListItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type ListItemProps = {
  item: ListItem;
  onUpdate: (item: ListItem) => void;
  onDelete: (itemId: string) => void;
};

export default function ListItemComponent({ item, onUpdate, onDelete }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && item.text === 'New item') {
      inputRef.current?.select();
    }
    inputRef.current?.focus();
  }, [isEditing, item.text]);
  
  const handleSave = () => {
    if (editText.trim() === '') {
        onDelete(item.id);
    } else {
        onUpdate({ ...item, text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(item.text);
      setIsEditing(false);
    }
  };
  
  useEffect(() => {
    if(item.text === 'New item') {
      setIsEditing(true);
    }
  }, [item.text]);


  return (
    <li className="flex items-center gap-3 group min-h-[40px]">
      <Checkbox
        id={`item-${item.id}`}
        checked={item.completed}
        onCheckedChange={(checked) => onUpdate({ ...item, completed: !!checked })}
        className="w-6 h-6 rounded-md border-2"
        aria-label={item.text}
      />
      <div className="flex-grow">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-10 text-lg"
          />
        ) : (
          <label
            htmlFor={`item-${item.id}`}
            className={cn(
              'flex-grow text-lg cursor-pointer transition-colors',
              item.completed && 'line-through text-muted-foreground'
            )}
            onClick={() => !item.completed && setIsEditing(true)}
          >
            {item.text}
          </label>
        )}
      </div>

      <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {isEditing ? (
           <Button variant="ghost" size="icon" onClick={handleSave} aria-label="Save changes">
            <Check className="h-5 w-5 text-primary" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit item" disabled={item.completed}>
            <Pencil className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} aria-label="Delete item">
          <Trash2 className="h-5 w-5 hover:text-destructive" />
        </Button>
      </div>
    </li>
  );
}
