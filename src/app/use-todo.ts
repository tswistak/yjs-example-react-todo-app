/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TodoItem } from './types';
import { DropResult } from 'react-beautiful-dnd';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();
const wsProvider = new WebsocketProvider('ws://localhost:1234', 'todo', doc);
wsProvider.on('status', console.log);

const itemsMap = doc.getMap<TodoItem>('todoItems');
const orderMap = doc.getMap<number>('order');

const awareness = wsProvider.awareness;

export const useTodo = () => {
  const [todoItems, setTodoItems] = useState<Record<string, TodoItem>>({});
  const [order, setOrder] = useState<Record<string, number>>({});
  const [currentEditedItem, setCurrentEditedItem] = useState<string | null>(
    null
  );
  const [editedBy, setEditedBy] = useState<Record<string, number>>({});

  useEffect(() => {
    const itemsObserver = () => {
      setTodoItems(itemsMap.toJSON());
    };
    const orderObserver = () => {
      setOrder(orderMap.toJSON());
    };
    itemsObserver();
    orderObserver();

    itemsMap.observe(itemsObserver);
    orderMap.observe(orderObserver);

    return () => {
      itemsMap.unobserve(itemsObserver);
      orderMap.unobserve(orderObserver);
    };
  }, []);

  useEffect(() => {
    const awarenessObserver = () => {
      const result: Record<string, number> = {};
      console.log(awareness.getStates());
      awareness.getStates().forEach((val, key) => {
        if (val.edited && key !== awareness.clientID) {
          result[val.edited] = key;
        }
      });
      setEditedBy(result);
    };
    awarenessObserver();
    awareness.on('change', awarenessObserver);

    return () => {
      awareness.off('change', awarenessObserver);
    };
  }, []);

  const sortedTodoItems = useMemo(
    () =>
      Object.values(todoItems).toSorted((x, y) => order[x.id] - order[y.id]),
    [todoItems, order]
  );

  const addNew = useCallback(() => {
    const item: TodoItem = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
    };
    itemsMap.set(item.id, item);
    orderMap.set(item.id, sortedTodoItems.length);
    setCurrentEditedItem(item.id);
    awareness.setLocalStateField('edited', item.id);
  }, [sortedTodoItems]);

  const handleItemEdit = useCallback((id: string) => {
    setCurrentEditedItem(id);
    awareness.setLocalStateField('edited', id);
  }, []);

  const updateTitle = useCallback((id: string, title: string) => {
    itemsMap.set(id, {
      ...itemsMap.get(id)!,
      title,
    });
  }, []);

  const updateDescription = useCallback((id: string, description: string) => {
    itemsMap.set(id, {
      ...itemsMap.get(id)!,
      description,
    });
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }
    const newOrder = [
      ...Object.entries(orderMap.toJSON()).toSorted((a, b) => a[1] - b[1]),
    ];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination!.index, 0, removed);
    doc.transact(() => {
      newOrder.forEach(([key], index) => {
        orderMap.set(key, index);
      });
    });
  }, []);

  return {
    todoItems,
    currentEditedItem,
    sortedTodoItems,
    editedBy,
    addNew,
    handleItemEdit,
    updateTitle,
    updateDescription,
    handleDragEnd,
  };
};
