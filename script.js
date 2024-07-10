// Execute this block when the window finishes loading
window.addEventListener('load', () => {
	// Retrieve todos from localStorage or initialize an empty array
	let todos = JSON.parse(localStorage.getItem('todos')) || [];
	// Get DOM elements
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	// Retrieve username from localStorage or set to empty string
	const username = localStorage.getItem('username') || '';
	// Set the value of nameInput to the stored username
	nameInput.value = username;

	// Listen for changes in the name input field
	nameInput.addEventListener('change', (e) => {
		// Store the updated username in localStorage
		localStorage.setItem('username', e.target.value);
	});

	// Listen for form submission to add a new todo
	newTodoForm.addEventListener('submit', e => {
		e.preventDefault(); // Prevent default form submission

		// Create a new todo object with form input values
		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		};

		// Add the new todo to the todos array
		todos.push(todo);

		// Store updated todos array in localStorage
		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		// Call function to display updated todos
		DisplayTodos();
	});

	// Function to display todos from the todos array
	function DisplayTodos() {
		const todoList = document.querySelector('#todo-list');
		todoList.innerHTML = ""; // Clear previous content

		// Iterate through each todo in the todos array
		todos.forEach(todo => {
			// Create elements for todo item
			const todoItem = document.createElement('div');
			todoItem.classList.add('todo-item');

			const label = document.createElement('label');
			const input = document.createElement('input');
			const span = document.createElement('span');
			const content = document.createElement('div');
			const actions = document.createElement('div');
			const edit = document.createElement('button');
			const deleteButton = document.createElement('button');

			// Set attributes and classes for elements
			input.type = 'checkbox';
			input.checked = todo.done;
			span.classList.add('bubble');
			if (todo.category == 'personal') {
				span.classList.add('personal');
			} else {
				span.classList.add('business');
			}
			content.classList.add('todo-content');
			actions.classList.add('actions');
			edit.classList.add('edit');
			deleteButton.classList.add('delete');

			// Set content for todo item elements
			content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
			edit.innerHTML = 'Edit';
			deleteButton.innerHTML = 'Delete';

			// Append elements to todoItem
			label.appendChild(input);
			label.appendChild(span);
			actions.appendChild(edit);
			actions.appendChild(deleteButton);
			todoItem.appendChild(label);
			todoItem.appendChild(content);
			todoItem.appendChild(actions);

			// Append todoItem to todoList
			todoList.appendChild(todoItem);

			// Add 'done' class if todo is marked as done
			if (todo.done) {
				todoItem.classList.add('done');
			}

			// Listen for checkbox change to mark todo as done/not done
			input.addEventListener('change', (e) => {
				todo.done = e.target.checked;
				localStorage.setItem('todos', JSON.stringify(todos));

				// Toggle 'done' class based on checkbox state
				if (todo.done) {
					todoItem.classList.add('done');
				} else {
					todoItem.classList.remove('done');
				}

				// Update displayed todos
				DisplayTodos();
			});

			// Listen for edit button click to edit todo content
			edit.addEventListener('click', (e) => {
				const input = content.querySelector('input');
				input.removeAttribute('readonly'); // Allow editing of input
				input.focus(); // Focus on input for immediate editing

				// Listen for blur event to save edited content
				input.addEventListener('blur', (e) => {
					input.setAttribute('readonly', true); // Disable editing
					todo.content = e.target.value; // Update todo content
					localStorage.setItem('todos', JSON.stringify(todos)); // Save changes
					DisplayTodos(); // Update displayed todos
				});
			});

			// Listen for delete button click to remove todo
			deleteButton.addEventListener('click', (e) => {
				todos = todos.filter(t => t !== todo); // Filter out the selected todo
				localStorage.setItem('todos', JSON.stringify(todos)); // Update localStorage
				DisplayTodos(); // Update displayed todos
			});
		});
	}

	// Initial display of todos when page loads
	DisplayTodos();
});
