import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// interface Post {
// 	id: number;
// 	title: string;
// }
interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

interface PostQuery {
	pageSize: number;
}

const usePost = (query: PostQuery) =>
	useQuery<Post[], Error>({
		queryKey: ['posts', query],
		queryFn: ({ pageParam = 1 }) =>
			axios
				.get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
					params: {
						_start: (pageParam - 1) * query.pageSize,
						_limit: query.pageSize,
					},
				})
				.then((res) => res.data),
		keepPreviousData: true,
		getNextPageParam: (lastPage, allpages) => {
			return lastPage.length > 0 ? allpages.length + 1 : undefined;
		},
	});

export default usePost;
