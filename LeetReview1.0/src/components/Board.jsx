import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AddOutline } from "react-ionicons";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import AddModal from "./AddModal";
import QuestionCard from "./QuestionCard";
import { useSearch } from "../utils/searchFilterContext";
import { addNotification } from "../utils/notification";

const COLUMN_ORDER = ["todo", "review", "reviewed"];

const Board = () => {
  const [columns, setColumns] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");

  const { searchTerm } = useSearch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadBoardState(user.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkReviewSchedule = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        const userData = (await getDoc(userDoc)).data();

        if (userData.reviewSchedule) {
          const reviewTime = userData.reviewSchedule.toDate();
          const now = new Date();

          if (reviewTime <= now) {
            await addNotification(
              user.uid,
              "Your scheduled review is due now!"
            );
            await updateDoc(userDoc, { reviewSchedule: null });
          } else {
            const timeUntilReview = reviewTime.getTime() - now.getTime();
            setTimeout(async () => {
              await addNotification(
                user.uid,
                "Your scheduled review is due now!"
              );
              await updateDoc(userDoc, { reviewSchedule: null });
            }, timeUntilReview);
          }
        }
      }
    };

    checkReviewSchedule();

    const intervalId = setInterval(checkReviewSchedule, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const loadBoardState = async (userId) => {
    try {
      const docRef = doc(db, "boards", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setColumns(docSnap.data().columns);
      } else {
        // Initialize with empty columns if no data exists
        const initialColumns = {
          todo: { name: "To Do", items: [] },
          review: { name: "To Review", items: [] },
          reviewed: { name: "Reviewed", items: [] },
        };
        setColumns(initialColumns);
        await setDoc(docRef, { columns: initialColumns });
      }
    } catch (error) {
      console.error("Error loading board state:", error);
    } finally {
      setLoading(false);
    }
  };

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

    if (user) {
      await addNotification(
        user.uid,
        `New question added: ${questionData.title}`
      );
    }
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

  const handleUpdateNotes = async (questionId, newNotes, newLinks) => {
    const newColumns = { ...columns };

    for (const columnId in newColumns) {
      const questionIndex = newColumns[columnId].items.findIndex(
        (item) => item.id === questionId
      );
      if (questionIndex !== -1) {
        newColumns[columnId].items[questionIndex] = {
          ...newColumns[columnId].items[questionIndex],
          notes: newNotes,
          links: newLinks,
        };
        break;
      }
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

  const filterQuestions = (questions) => {
    return questions.filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.topicTags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    });
  };

  const getColumnStyle = (columnId) => {
    const baseStyle =
      "flex flex-col w-1/3 p-5 rounded-lg shadow-md overflow-y-auto";
    const fixedHeight = "h-[650px]";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!columns) {
    return <div>No board data available.</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-between gap-4 p-8">
        {COLUMN_ORDER.map((columnId) => (
          <div key={columnId} className={getColumnStyle(columnId)}>
            <div
              className={`sticky top-0 bg-${
                columnId === "todo"
                  ? "blue"
                  : columnId === "review"
                  ? "yellow"
                  : "green"
              }-100 z-10`}
            >
              <h2 className="text-xl font-bold mb-4">
                {columns[columnId].name}
              </h2>
            </div>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-grow flex flex-col overflow-y-auto"
                >
                  {filterQuestions(columns[columnId].items).map(
                    (item, index) => (
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
                              onUpdateNotes={handleUpdateNotes}
                              isReviewed={columnId === "reviewed"}
                              columnId={columnId}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <button
              onClick={() => openModal(columnId)}
              className="mt-4 flex items-center justify-center w-full py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50"
            >
              <AddOutline color={"#4B5563"} height="20px" width="20px" />
              <span className="ml-2">Add Question</span>
            </button>
          </div>
        ))}
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
