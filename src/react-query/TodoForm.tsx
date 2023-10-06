import {
	QueryClient,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';

import { Todo } from '../routing/hooks/useTodo';
import axios from 'axios';
import { useRef } from 'react';

const TodoForm = () => {
	const QueryClient = useQueryClient();
	const addTodo = useMutation({
		mutationFn: (todo: Todo) =>
			axios
				.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo)
				.then((res) => res.data),
		onSuccess: (savedTodo, newTodo) => {
			console.log(savedTodo);
			// APPROACH: invalidating the cache
			// QueryClient.invalidateQueries({
			// 	queryKey: ['todos'],
			// });

			//APPROACH 2: UPDATING THE DATA IN CACHE
			QueryClient.setQueriesData<Todo[]>(['todos'], (todos) => [
				savedTodo,
				...(todos || []),
			]);
		},
	});
	const ref = useRef<HTMLInputElement>(null);

	return (
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
				<button className="btn btn-primary">Add</button>
			</div>
		</form>
	);
};

export default TodoForm;
