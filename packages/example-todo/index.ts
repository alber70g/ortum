import { useProfunctor, SimpleStateContainer, ProfunctorState } from 'ortum';
import { html, render } from 'lit-html';
import * as R from 'ramda';

type Todo = { id?: number; description: string; done: boolean };
type State = { todoState: { todos: Todo[]; newTodo?: Todo } };

function app(container: HTMLElement) {
  const initialState: State = {
    todoState: {
      todos: [
        { id: 1, description: 'learn javascript', done: false },
        { id: 2, description: 'create library', done: false },
      ],
    },
  };

  const [appProf, onStateChange] = useProfunctor(
    new SimpleStateContainer(initialState),
  );

  const todoProf = appProf.promap(
    (state) => state.todoState,
    (todoState, state) => ({ ...state, todoState }),
  );

  const appView = () => html`
    <h1>My Todo App</h1>
    ${todoList(todoProf)}
  `;
  const renderApp = () => render(appView(), container);
  onStateChange(renderApp);

  // initial render
  renderApp();
}

function todoList({
  getState,
  setState,
  promap,
}: ProfunctorState<{ todos: Todo[]; newTodo?: Todo }>) {
  const todosPromap = promap(
    (state) => R.view(R.lensProp('todos'))(state),
    R.set(R.lensProp('todos'))
  );
  var x = todosPromap.getState()
  const addTodo = (newTodo: Todo) =>
    todosPromap.setState((todos) => [...todos, newTodo]);
  const filterId = (id: number) => R.filter<{ id: number }>(x => x.id === id);
  const removeTodo = (id: number) =>
    todosPromap.setState((todos) => todos.filter((todo) => todo.id !== id));

  const newTodoPromap = promap(
    (state) => state.newTodo || { description: '', done: false },
    (newTodo, state) => ({ ...state, newTodo }),
  );

  const createTodoProf = (id: number) => {
    return promap(
      ({ todos }) => todos.filter((todo) => todo.id === id)[0],
      (todo, todosState) => ({
        ...todosState,
        todos: [...todosState.todos.filter((x) => x.id !== todo.id), todo],
      }),
    );
  };
  const setNewTodo = (text: string) => ({});

  return html`
      <h2>Todos</h2>
      <ul>
        <li>
          <input @keyup=${setNewTodo} />
          <button @click=${() => addTodo}>Add</button></li>
          ${getState().todos.map(
    (t) => t.id && todo(createTodoProf(t.id), removeTodo),
  )}
      </ul>
    `;
}

function todo(
  { getState, setState }: ProfunctorState<Todo>,
  removeTodo: (id: number) => void,
) {
  const todo = getState();
  const toggleDone = () => setState((todo) => ({ ...todo, done: !todo.done }));
  const setNotDone = () => setState((todo) => ({ ...todo, done: false }));
  const setInProgress = () =>
    setState((todo) => {
      if (todo.done) {
        if (confirm('do you want to put this back into "not done"')) {
          return { ...todo, done: false, inProgress: true };
        } else {
          return todo;
        }
      }
      return { ...todo, inProgress: true };
    });

  return html`
    <li title=${todo.id}>
      ${todo.done ? 'Done' : 'Todo'}: 
      ${todo.description}
      <button @click=${() => removeTodo(todo.id!)}>Remove</button>
      <button @click=${toggleDone}>${todo.done ? 'Undone' : 'Done'}</button>
    </li>
  `;
}

app(document.body);
