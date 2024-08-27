import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AddOutline } from "react-ionicons";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AddModal from "./AddModal";
import QuestionCard from "./QuestionCard";

const Board = () => {
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [],
    },
    review: {
      name: "To Review",
      items: [],
    },
    reviewed: {
      name: "Reviewed",
      items: [],
    },
  });

  const [user, setUser] = useState(null); // User state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadBoardState(user.uid); // Load board state
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  // Load board state 
  const loadBoardState = async (userId) => {
    const docRef = doc(db, "boards", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setColumns(docSnap.data().columns); 
    }
  };

  // Save board state
  const saveBoardState = async (newColumns) => {
    if (user) {
      const docRef = doc(db, "boards", user.uid);
      await setDoc(docRef, { columns: newColumns });
    }
  };

  const openModal = (columnId) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddQuestion = async (questionData) => {
    const newQuestion = {
      id: questionData.id,
      ...questionData,
    };
    const newColumns = { ...columns };
    newColumns[selectedColumn].items.push(newQuestion);
    setColumns(newColumns);
    await saveBoardState(newColumns);
  };

  const handleDeleteQuestion = async (questionId) => {
    const newColumns = { ...columns };

    for (const columnId in newColumns) {
      newColumns[columnId].items = newColumns[columnId].items.filter(
        (item) => item.id !== questionId
      );
    }

    setColumns(newColumns);
    await saveBoardState(newColumns);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      };
      setColumns(newColumns);
      await saveBoardState(newColumns);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      };
      setColumns(newColumns);
      await saveBoardState(newColumns);
    }
  };

  const getColumnStyle = (columnId) => {
    const baseStyle =
      "flex flex-col w-1/3 p-5 rounded-lg shadow-md overflow-y-auto"; 
    const fixedHeight = "h-[500px]"; 

    switch (columnId) {
      case "todo":
        return `${baseStyle} bg-blue-100 ${fixedHeight}`;
      case "review":
        return `${baseStyle} bg-yellow-100 ${fixedHeight}`;
      case "reviewed":
        return `${baseStyle} bg-green-100 ${fixedHeight}`;
      default:
        return `${baseStyle} ${fixedHeight}`;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-between gap-4 p-8">
        <div className={getColumnStyle("todo")}>
          <div className="sticky top-0 bg-blue-100 z-10">
            {" "}
            <h2 className="text-xl font-bold mb-4">{columns.todo.name}</h2>
          </div>
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-grow flex flex-col overflow-y-auto" 
              >
                {columns.todo.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2"
                      >
                        <QuestionCard
                          question={item}
                          onDelete={handleDeleteQuestion}
                          isReviewed={false}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            onClick={() => openModal("todo")}
            className="mt-4 flex items-center justify-center w-full py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
          >
            <AddOutline color={"#4B5563"} height="20px" width="20px" />
            <span className="ml-2">Add Question</span>
          </button>
        </div>

        <div className={getColumnStyle("review")}>
          <div className="sticky top-0 bg-yellow-100 z-10">
            {" "}
            <h2 className="text-xl font-bold mb-4">{columns.review.name}</h2>
          </div>
          <Droppable droppableId="review">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-grow flex flex-col overflow-y-auto" 
              >
                {columns.review.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2"
                      >
                        <QuestionCard
                          question={item}
                          onDelete={handleDeleteQuestion}
                          isReviewed={false}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            onClick={() => openModal("review")}
            className="mt-4 flex items-center justify-center w-full py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
          >
            <AddOutline color={"#4B5563"} height="20px" width="20px" />
            <span className="ml-2">Add Question</span>
          </button>
        </div>

        <div className={getColumnStyle("reviewed")}>
          <div className="sticky top-0 bg-green-100 z-10">
            {" "}
            <h2 className="text-xl font-bold mb-4">{columns.reviewed.name}</h2>
          </div>
          <Droppable droppableId="reviewed">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex-grow flex flex-col overflow-y-auto" 
              >
                {columns.reviewed.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2"
                      >
                        <QuestionCard
                          question={item}
                          onDelete={handleDeleteQuestion}
                          isReviewed={true}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button
            onClick={() => openModal("reviewed")}
            className="mt-4 flex items-center justify-center w-full py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
          >
            <AddOutline color={"#4B5563"} height="20px" width="20px" />
            <span className="ml-2">Add Question</span>
          </button>
        </div>
      </div>
      <AddModal
        isOpen={modalOpen}
        onClose={closeModal}
        handleAddQuestion={handleAddQuestion}
      />
    </DragDropContext>
  );
};

export default Board;
