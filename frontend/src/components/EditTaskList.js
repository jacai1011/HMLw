import React, { useState, useRef, useEffect } from "react";
import { deleteTaskList, renameTaskList } from '../services/api';
import { Trash, Pencil, Calendar, MoreHorizontal } from 'lucide-react';
import './EditTaskList.css';

const EditTaskList = ({ taskListId }) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<div ref={dropdownRef} className="ppDropdownWrapper">
			<button
				className="tlOptionsDropdown"
				onClick={(e) => {
					e.stopPropagation();
					setOpen((prev) => !prev);
				}}
			>
				<MoreHorizontal size={16} />
			</button>


			{open && (
				<div className="ppDropdownMenu" onClick={(e) => e.stopPropagation()}>
					<button 
						className="dropdownOption"
						onClick={async (e) => {
							e.stopPropagation();
							const newName = window.prompt("Enter a new name for the task list:");
							if (!newName) return;
							try {
								await renameTaskList(taskListId, newName);
								setOpen(false);
								window.location.reload();
							} catch (err) {
								console.error('Error renaming task list:', err);
							}
						}}
					>
						Rename
						<Pencil className="optionIcon" size={16} />
					</button>

					<button className="dropdownOption">
						Due Date
						<Calendar className="optionIcon" size={16} />
					</button>

					<button
						className="dropdownOption"
						onClick={async (e) => {
							e.stopPropagation();
							try {
								if (window.confirm('Are you sure you want to delete this task list?')) {
									await deleteTaskList(taskListId);
									setOpen(false);
									window.location.reload();
								}
							} catch (err) {
								console.error('Error deleting task list:', err);
							}
						}}
					>
						Delete
						<Trash className="optionIcon" size={16} />
					</button>
				</div>
			)}
		</div>
	);
};

export default EditTaskList;
