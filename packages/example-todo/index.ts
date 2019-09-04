import { useProfunctor, SimpleStateContainer, ProfunctorState } from "ortum";
import { html, render } from "lit-html";
import { view, lensProp, set, filter } from "ramda";

type Todo = { id?: number; description: string; done: boolean };
type State = { appName: string; todoState: { todos: Todo[]; newTodo?: Todo } };

function app(container: HTMLElement) {
  const initialState: State = {
    appName: "My Todo App",
    todoState: {
      todos: [
        { id: 1, description: "learn javascript", done: false },
        { id: 2, description: "create library", done: false }
      ]
    }
  };

  const [appProf, onStateChange] = useProfunctor(
    new SimpleStateContainer(initialState)
  );

  const todoProf = appProf.promap(
    state => state.todoState,
    (todoState, state) => ({ ...state, todoState })
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
  promap
}: ProfunctorState<{ todos: Todo[]; newTodo?: Todo }>) {
  const todosProf = promap(view(lensProp("todos")), set(lensProp("todos")));

  const filterId = (id: number) => filter<{ id: number }>(x => x.id === id);
  const removeTodo = (id: number) => todosProf.setState(filterId(id));

  const newTodoLens = lensProp("newTodo");
  const newTodoProf = promap(view(newTodoLens), set(newTodoLens));
  const setNewTodo = (e: Event) => newTodoProf.setState({name: e.tar});

  return html`
    <h2>Todos</h2>
    <ul>
      <li>
        <input @keyup=${setNewTodo} />
        <sub>Press enter to add</sub>
      </li>
      ${getState().todos.map(t => t.id && todo(newTodoProf(t.id), removeTodo))}
    </ul>
  `;
}

function todo(
  { getState, setState }: ProfunctorState<Todo>,
  removeTodo: (id: number) => void
) {
  const todo = getState();
  const toggleDone = () => setState(todo => ({ ...todo, done: !todo.done }));
  const setNotDone = () => setState(todo => ({ ...todo, done: false }));
  const setInProgress = () =>
    setState(todo => {
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
      ${todo.done ? "Done" : "Todo"}: ${todo.description}
      <button @click=${() => removeTodo(todo.id!)}>Remove</button>
      <button @click=${toggleDone}>${todo.done ? "Undone" : "Done"}</button>
    </li>
  `;
}

app(document.body);
