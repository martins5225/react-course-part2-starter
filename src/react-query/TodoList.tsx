import useTodos from '../routing/hooks/useTodo';

const TodoList = () => {
	const { data: todos, error, isLoading } = useTodos();

	if (isLoading) return <p>This is still holdingsd</p>;

	if (error) return <p>{error.message}</p>;

	return (
		<ul className="list-group">
			{todos?.map((todo) => (
				<li key={todo.id} className="list-group-item">
					{todo.title}
				</li>
			))}
		</ul>
	);
};

export default TodoList;
