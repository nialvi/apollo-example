import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import ListTodos from "./graphql/ListTodos.query.graphql";
import AddTodoMutation from "./graphql/AddTodo.mutation.graphql";
import "./App.css";

function App() {
  const { loading, data: { todos } = {} } = useQuery(ListTodos);
  const [addTodo] = useMutation(AddTodoMutation);
  const [newTodoText, setTodoText] = useState("");

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="App">
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            {t.id} {t.task} {t.complete}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <button
        onClick={() => {
          // brr inline handler
          // all we know that don't need to do this
          addTodo({ text: newTodoText });
        }}
      >
        add todo
      </button>
    </div>
  );
}

export default App;
