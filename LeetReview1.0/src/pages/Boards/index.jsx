/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { Board } from "../../data/board";
import AddModal from "../../components/Modals/AddModal";
import { onDragEnd } from "../../helpers/onDragEnd";
import { AddOutline } from "react-ionicons";
import Task from "../../components/Task";

const Home = () => {
	const [columns, setColumns] = useState(Board);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedColumn, setSelectedColumn] = useState("");

	const openModal = (columnId) => {
		setSelectedColumn(columnId);
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const handleAddTask = (taskData) => {
		const newBoard = { ...columns };
		newBoard[selectedColumn].items.push(taskData);
	};

	return (
		<>
			{/* <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}> */}

			<DragDropContext
				onDragStart={(start) => console.log('Drag started:', start)}
				onDragEnd={(result) => {
					console.log('Drag ended:', result);
					onDragEnd(result, columns, setColumns);
				}}>

				<div className="w-full flex items-start justify-between md:w-[90%] px-5 pb-8 gap-10">
					{/* 
					className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]" */}
					
					{Object.entries(columns).map(([columnId, column]) => (
						<div
							className="w-full flex flex-col gap-0"
							key={columnId}
						>
							<Droppable
								droppableId={columnId}
								key={columnId}
							>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5"
									>
										<div 
										className="flex items-center justify-center py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
											{column.name}
										</div>
										{column.items.map((task, index) => (
											<Draggable
												key={task.id.toString()}
												draggableId={task.id.toString()}
												index={index}
											>
												{(provided) => (
													<Task
													provided={provided}
													task={task}
													taskId={task.id.toString()}
												  />

													// <>
													// 	<Task
													// 		provided={provided}
													// 		task={task}
													// 	/>
													// </>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
							<div
								onClick={() => openModal(columnId)}
								className="flex cursor-pointer items-center justify-center gap-1 py-[10px] w-full bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
								<AddOutline color={"#555"} />
								Add Task
							</div>
						</div>
					))}
				</div>
			</DragDropContext>

			<AddModal
				isOpen={modalOpen}
				onClose={closeModal}
				setOpen={setModalOpen}
				handleAddTask={handleAddTask}
			/>
		</>
	);
};

export default Home;