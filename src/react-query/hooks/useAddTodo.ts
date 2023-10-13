import todoService, { Todo } from '../services/todoService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CACHE_KEY_TODOS } from '../constants';

interface AddTodoContext {
	previousTodos: Todo[];
}
const useAddTodo = (onAdd: () => void) => {
	const QueryClient = useQueryClient();

	return useMutation<Todo, Error, Todo, AddTodoContext>({
		mutationFn: todoService.post,
		onMutate: (newTodo: Todo) => {
			const previousTodos =
				QueryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];
			QueryClient.setQueriesData<Todo[]>(CACHE_KEY_TODOS, (todos) => [
				newTodo,
				...(todos || []),
			]);

			onAdd();

			return { previousTodos };
		},
		onSuccess: (savedTodo, newTodo) => {
			console.log(savedTodo);
			// APPROACH: invalidating the cache
			// QueryClient.invalidateQueries({
			// 	queryKey: CACHE_KEY_TODOS,
			// });

			//APPROACH 2: UPDATING THE DATA IN CACHE

			QueryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
				todos?.map((todo) => (todo === newTodo ? savedTodo : todo))
			);
		},

		onError: (error, newTodo, context) => {
			if (!context) return;

			QueryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context.previousTodos);
		},
	});
};

export default useAddTodo;
