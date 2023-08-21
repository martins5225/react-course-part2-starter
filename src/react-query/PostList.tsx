import usePost from '../routing/hooks/usePost';
import { useState } from 'react';

const PostList = () => {
	// const [posts, setPosts] = useState<Post[]>([]);
	// const [error, setError] = useState('');
	const pageSize = 10;
	const { data, error, isLoading } = usePost({ pageSize });

	if (isLoading) return <p>This is still Loding</p>;

	if (error) return <p>{error.message}</p>;

	return (
		<>
			<ul className="list-group">
				{data.map((post) => (
					<li key={post.id} className="list-group-item">
						{post.title}
					</li>
				))}
			</ul>

			<button
				className="btn btn-primary my-3 ms"
				disabled={isFetchingNextPaged}
				onClick={() => fetchNextPage()}
			>
				Load More
			</button>
		</>
	);
};

export default PostList;
