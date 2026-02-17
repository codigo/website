<script lang="ts">
	import { type ListResult } from 'pocketbase';
	import { type Post } from '$lib/types';
	const { data } = $props<{ data: ListResult<Post> }>();

	import Posts from './Posts.svelte';
	import Pagination from './Pagination.svelte';
	import SearchBar from '$components/SearchBar.svelte';

	const { page, totalPages } = $derived(data);
</script>

<svelte:head>
	<title>Journal{page > 1 ? ` — Page ${page}` : ''} | Mauricio Mercado</title>
	<meta name="description" content="Technical articles and insights on backend development, AI integration, and software engineering by Mauricio Mercado." />
</svelte:head>

<SearchBar />
<Posts posts={data.items} />
<Pagination currentPage={page} {totalPages} />
