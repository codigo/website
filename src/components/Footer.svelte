<script>
	let year = new Date().getFullYear();
</script>

<footer>
	<p>© {year}</p>
	<p>Made with ❤️ by Mauricio</p>
</footer>

<style>
	footer {
		display: grid;
		grid-auto-flow: row;
		place-items: center;
		row-gap: 2.4rem;
		padding: 6.4rem 0 6.4rem 0;
	}

	@media (max-width: 768px) {
		footer {
			padding-bottom: 14rem;
		}
	}
</style>
