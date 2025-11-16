'use client';

import { useState } from 'react';
import type { ToDoList } from '@/lib/types';
import Header from '@/components/app/header';
import VoiceRecorder from '@/components/app/voice-recorder';
import ListCard from '@/components/app/list-card';
import { Mic } from 'lucide-react';

export default function Home() {
  const [lists, setLists] = useState<ToDoList[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleNewList = (title: string, items: string[]) => {
    const newList: ToDoList = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      items: items.map(itemText => ({
        id: crypto.randomUUID(),
        text: itemText,
        completed: false,
      })),
    };
    setLists(prevLists => [newList, ...prevLists]);
  };

  const handleUpdateList = (updatedList: ToDoList) => {
    setLists(prevLists => prevLists.map(list => (list.id === updatedList.id ? updatedList : list)));
  };

  const handleDeleteList = (listId: string) => {
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-40">
        {lists.length === 0 && !isAiProcessing && (
           <div className="text-center text-foreground mt-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold font-headline mb-4">Welcome to Verbalist!</h2>
            <p className="text-xl font-headline mb-8">Your simple voice-to-list assistant.</p>

            <div className="text-left space-y-4 max-w-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</div>
                <p className="text-lg">Tap the big <Mic className="inline-block h-5 w-5 -mt-1" /> button below to start recording.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">2</div>
                <p className="text-lg">Speak your to-do items or grocery list clearly.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">3</div>
                <p className="text-lg">Tap the stop button when you're done.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">4</div>
                <p className="text-lg">Watch as Verbalist magically turns your words into an organized list!</p>
              </div>
            </div>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lists.map(list => (
            <ListCard key={list.id} list={list} onUpdate={handleUpdateList} onDelete={handleDeleteList} />
          ))}
        </div>
      </main>
      <VoiceRecorder onNewList={handleNewList} setProcessing={setIsAiProcessing} />
    </div>
  );
}
