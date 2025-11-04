<script lang="ts">
	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	let messages = $state<Message[]>([]);
	let inputValue = $state('');
	let isLoading = $state(false);
	let isOpen = $state(false);
	let chatContainer = $state<HTMLDivElement | undefined>(undefined);
	let error = $state<string | null>(null);

	// Auto-scroll to bottom when messages update (including during streaming)
	$effect(() => {
		if (messages.length > 0 && chatContainer) {
			// Use requestAnimationFrame for smooth scrolling during streaming
			requestAnimationFrame(() => {
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			});
		}
	});

	async function sendMessage() {
		if (!inputValue.trim() || isLoading) return;

		const userMessage: Message = {
			role: 'user',
			content: inputValue
		};

		messages = [...messages, userMessage];
		inputValue = '';
		isLoading = true;
		error = null;

		let messageIndex = -1;
		let hasStartedStreaming = false;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: messages.map((m) => ({ role: m.role, content: m.content }))
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get response');
			}

			// Read the streaming response
			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			if (!reader) {
				throw new Error('No response body');
			}

			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				// Decode the chunk and parse SSE format
				const chunk = decoder.decode(value);
				const lines = chunk.split('\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const data = line.slice(6);

						if (data === '[DONE]') {
							break;
						}

						try {
							const parsed = JSON.parse(data);
							if (parsed.content) {
								// On first chunk, hide loading indicator and create message
								if (!hasStartedStreaming) {
									hasStartedStreaming = true;
									isLoading = false;
									const assistantMessage: Message = {
										role: 'assistant',
										content: parsed.content
									};
									messages = [...messages, assistantMessage];
									messageIndex = messages.length - 1;
								} else {
									// Update the assistant message incrementally
									messages[messageIndex].content += parsed.content;
									messages = [...messages]; // Trigger reactivity
								}
							}
						} catch (e) {
							// Ignore parse errors for partial chunks
						}
					}
				}
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Chat error:', err);
			// Remove the incomplete assistant message on error if it was created
			if (hasStartedStreaming && messageIndex >= 0) {
				messages = messages.slice(0, messageIndex);
			}
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function toggleChat() {
		isOpen = !isOpen;
		if (isOpen && messages.length === 0) {
			// Add welcome message
			messages = [
				{
					role: 'assistant',
					content:
						"Hi! I'm an AI assistant here to answer questions about Mauricio. Ask me anything about his experience, skills, or interests!"
				}
			];
		}
	}
</script>

<!-- Chatbot Toggle Button -->
<button
	onclick={toggleChat}
	class="chatbot-toggle"
	aria-label="Toggle chatbot"
	class:chatbot-open={isOpen}
>
	{#if isOpen}
		<!-- Close Icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	{:else}
		<!-- Chat Icon -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
		</svg>
	{/if}
</button>

<!-- Chatbot Window -->
{#if isOpen}
	<div class="chatbot-container">
		<div class="chatbot-header">
			<h3>Ask About Mauricio</h3>
			<button onclick={toggleChat} aria-label="Close chat" class="close-btn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>
		</div>

		<div class="chatbot-messages" bind:this={chatContainer}>
			{#each messages as message}
				<div class="message {message.role}">
					<div class="message-content">
						{message.content}
					</div>
				</div>
			{/each}

			{#if isLoading}
				<div class="message assistant">
					<div class="message-content loading">
						<div class="typing-indicator">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>
			{/if}

			{#if error}
				<div class="error-message">
					{error}
				</div>
			{/if}
		</div>

		<div class="chatbot-input">
			<input
				type="text"
				bind:value={inputValue}
				onkeypress={handleKeyPress}
				placeholder="Ask a question..."
				disabled={isLoading}
			/>
			<button
				onclick={sendMessage}
				disabled={isLoading || !inputValue.trim()}
				aria-label="Send message"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="22" y1="2" x2="11" y2="13"></line>
					<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.chatbot-toggle {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: all 0.3s ease;
		z-index: 1000;
		color: white;
	}

	.chatbot-toggle:hover {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	.chatbot-toggle.chatbot-open {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	}

	.chatbot-container {
		position: fixed;
		bottom: 10rem;
		right: 2rem;
		width: 38rem;
		max-width: calc(100vw - 4rem);
		height: 50rem;
		max-height: calc(100vh - 14rem);
		background: var(--color-bg, #ffffff);
		border-radius: 1.2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
		display: flex;
		flex-direction: column;
		z-index: 999;
		border: 1px solid var(--color-border, #e5e7eb);
	}

	.chatbot-header {
		padding: 1.6rem;
		border-bottom: 1px solid var(--color-border, #e5e7eb);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 1.2rem 1.2rem 0 0;
	}

	.chatbot-header h3 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 600;
	}

	.close-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		color: white;
		padding: 0.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.4rem;
		transition: background 0.2s ease;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.chatbot-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1.6rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.message {
		display: flex;
		max-width: 80%;
	}

	.message.user {
		align-self: flex-end;
	}

	.message.assistant {
		align-self: flex-start;
	}

	.message-content {
		padding: 1rem 1.4rem;
		border-radius: 1.2rem;
		line-height: 1.5;
		font-size: 1.4rem;
	}

	.message.user .message-content {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-bottom-right-radius: 0.4rem;
	}

	.message.assistant .message-content {
		background: var(--color-message-bg, #f3f4f6);
		color: var(--color-text, #1f2937);
		border-bottom-left-radius: 0.4rem;
	}

	.message-content.loading {
		padding: 1.4rem 2rem;
	}

	.typing-indicator {
		display: flex;
		gap: 0.4rem;
	}

	.typing-indicator span {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		background: var(--color-text, #9ca3af);
		animation: typing 1.4s infinite;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.typing-indicator span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes typing {
		0%,
		60%,
		100% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(-1rem);
		}
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 1rem 1.4rem;
		border-radius: 0.8rem;
		font-size: 1.4rem;
		border: 1px solid #fcc;
	}

	.chatbot-input {
		padding: 1.6rem;
		border-top: 1px solid var(--color-border, #e5e7eb);
		display: flex;
		gap: 0.8rem;
	}

	.chatbot-input input {
		flex: 1;
		padding: 1rem 1.4rem;
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 2.4rem;
		font-size: 1.4rem;
		outline: none;
		transition: border-color 0.2s ease;
		background: var(--color-input-bg, white);
		color: var(--color-text, #1f2937);
	}

	.chatbot-input input:focus {
		border-color: #667eea;
	}

	.chatbot-input input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.chatbot-input button {
		width: 4rem;
		height: 4rem;
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.chatbot-input button:hover:not(:disabled) {
		transform: scale(1.05);
	}

	.chatbot-input button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.chatbot-container {
			bottom: 9rem;
			right: 1rem;
			width: calc(100vw - 2rem);
			height: calc(100vh - 11rem);
		}

		.chatbot-toggle {
			bottom: 1.5rem;
			right: 1.5rem;
			width: 5.6rem;
			height: 5.6rem;
		}
	}
</style>
