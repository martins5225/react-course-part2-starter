export default interface Task {
	id: number;
	title: string;
}

interface AddTask {
	type: 'ADD';
	task: Task;
}
interface DeleteTask {
	type: 'DELETE';
	task: number;
}

type TaskAction = AddTask | DeleteTask;

const tasksReducer = (state: Task[], action: TaskAction): Task[] => {
	switch (action.type) {
		case 'ADD':
			return [action.task, ...tasks];
		case 'DELETE':
			return tasksReducer.filter((t) => t.id !== action.taskId);
	}
};

export default tasksReducer;
