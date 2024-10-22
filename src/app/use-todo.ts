/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useMemo, useState } from 'react';
import { TodoItem } from './types';
import { DropResult } from 'react-beautiful-dnd';

export const useTodo = () => {
  const [todoItems, setTodoItems] = useState<Record<string, TodoItem>>({});
  const [order, setOrder] = useState<Record<string, number>>({});
  const [currentEditedItem, setCurrentEditedItem] = useState<string | null>(
    null
  );

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
    setTodoItems((x) => ({
      ...x,
      [item.id]: item,
    }));
    setOrder((x) => ({
      ...x,
      [item.id]: sortedTodoItems.length,
    }));
    setCurrentEditedItem(item.id);
  }, [sortedTodoItems]);

  const handleItemEdit = useCallback((id: string) => {
    setCurrentEditedItem(id);
  }, []);

  const updateTitle = useCallback((id: string, title: string) => {
    setTodoItems((x) => ({
      ...x,
      [id]: {
        ...x[id],
        title,
      },
    }));
  }, []);

  const updateDescription = useCallback((id: string, description: string) => {
    setTodoItems((x) => ({
      ...x,
      [id]: {
        ...x[id],
        description,
      },
    }));
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (
      !result.destination ||
      result.source.index === result.destination.index
    ) {
      return;
    }
    setOrder((prevOrder) => {
      const newOrder = [...Object.entries(prevOrder)];
      const [removed] = newOrder.splice(result.source.index, 1);
      newOrder.splice(result.destination!.index, 0, removed);
      const reorderedOrder = newOrder.reduce<Record<string, number>>(
        (acc, [key, value], index) => {
          acc[key] = index;
          return acc;
        },
        {}
      );
      return reorderedOrder;
    });
  }, []);

  return {
    todoItems,
    currentEditedItem,
    sortedTodoItems,
    addNew,
    handleItemEdit,
    updateTitle,
    updateDescription,
    handleDragEnd,
  };
};
