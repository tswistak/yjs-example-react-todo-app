import Markdown from 'react-markdown';
import { useTodo } from './use-todo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import stc from 'string-to-color';

export const Todo = () => {
  const {
    addNew,
    currentEditedItem,
    handleItemEdit,
    sortedTodoItems,
    todoItems,
    updateDescription,
    updateTitle,
    handleDragEnd,
    editedBy,
  } = useTodo();

  return (
    <>
      <div id="hero" className="rounded">
        <div className="text-container">
          <button className="button-pill rounded shadow" onClick={addNew}>
            <span>ADD NEW ITEM</span>
          </button>
        </div>
      </div>
      <div id="middle-content">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="list">
            {(dropProvided, dropSnapshot) => (
              <div
                id="middle-content-container"
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
                style={{
                  backgroundColor: dropSnapshot.isDraggingOver
                    ? '#EEEEEE'
                    : undefined,
                }}
              >
                {sortedTodoItems.length ? (
                  sortedTodoItems.map((item, i) => (
                    <Draggable key={item.id} draggableId={item.id} index={i}>
                      {(dragProvided) => (
                        <div
                          className="rounded shadow button-pill"
                          {...dragProvided.dragHandleProps}
                          {...dragProvided.draggableProps}
                          style={{
                            ...dragProvided.draggableProps.style,
                            backgroundColor:
                              currentEditedItem === item.id
                                ? 'rgba(0, 122, 204, 1)'
                                : item.id in editedBy
                                ? stc(editedBy[item.id])
                                : undefined,
                            color:
                              currentEditedItem === item.id ||
                              item.id in editedBy
                                ? 'rgba(255, 255, 255, 1)'
                                : undefined,
                            flexDirection: 'column',
                            alignItems: 'start',
                          }}
                          onClick={() => handleItemEdit(item.id)}
                          ref={dragProvided.innerRef}
                        >
                          <h2>{item.title || 'Untitled'}</h2>
                          <Markdown>{item.description}</Markdown>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="rounded shadow list-item-link">
                    No items added yet{' '}
                    <span role="img" aria-label="">
                      😿
                    </span>
                  </div>
                )}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div id="editor">
          {currentEditedItem && (
            <>
              <div>
                <label>
                  Title:{' '}
                  <input
                    type="text"
                    value={todoItems[currentEditedItem].title}
                    onChange={(e) =>
                      updateTitle(currentEditedItem, e.target.value)
                    }
                    className="rounded shadow"
                  />
                </label>
              </div>
              <div>
                <label>
                  Description:
                  <br />
                  <textarea
                    value={todoItems[currentEditedItem].description}
                    onChange={(e) =>
                      updateDescription(currentEditedItem, e.target.value)
                    }
                    className="rounded shadow"
                    rows={10}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
