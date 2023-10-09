import {
	QueryClient,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';

import { Todo } from '../routing/hooks/useTodo';
import axios from 'axios';
import { useRef } from 'react';

interface AddTodoContext {
	previousTodos: Todo[];
}

const TodoForm = () => {
	const QueryClient = useQueryClient();
	const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
		mutationFn: (todo: Todo) =>
			axios
				.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo)
				.then((res) => res.data),
		onMutate: (newTodo: Todo) => {
			const previousTodos = QueryClient.getQueryData<Todo[]>(['todos']) || [];
			QueryClient.setQueriesData<Todo[]>(['todos'], (todos) => [
				newTodo,
				...(todos || []),
			]);

			return { previousTodos };
		},
		onSuccess: (savedTodo, newTodo) => {
			console.log(savedTodo);
			// APPROACH: invalidating the cache
			// QueryClient.invalidateQueries({
			// 	queryKey: ['todos'],
			// });

			//APPROACH 2: UPDATING THE DATA IN CACHE

			QueryClient.setQueryData<Todo[]>(['todos'], (todos) =>
				todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
			);
		},

		onError: (error, newTodo, context) => {
			if (!context) return;

			QueryClient.setQueryData<Todo[]>(['todos'], context.previousTodos);
		},
	});
	const ref = useRef<HTMLInputElement>(null);

	return (
		<>
			{addTodo.error && (
				<div className="alert alert-danger">{addTodo.error.message}</div>
			)}

			<form
				className="row mb-3"
				onSubmit={(event) => {
					event.preventDefault();

					if (ref.current && ref.current.value)
						addTodo.mutate({
							id: 0,
							title: ref.current?.value,
							completed: false,
							userId: 1,
						});
				}}
			>
				<div className="col">
					<input ref={ref} type="text" className="form-control" />
				</div>
				<div className="col">
					<button className="btn btn-primary">
						{addTodo.isLoading ? 'Adding...' : 'add'}
					</button>
				</div>
			</form>
		</>
	);
};

export default TodoForm;
