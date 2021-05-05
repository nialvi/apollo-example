import { useState } from "react";
import produce from "immer";
import { useQuery, useMutation } from "@apollo/client";
import ListTodosQuery from "./graphql/ListTodos.query.graphql";
import AddTodoMutation from "./graphql/AddTodo.mutation.graphql";
import EditTodoMutation from "./graphql/EditTodo.mutation.graphql";
import "./App.css";

function App() {
  const { loading, data: { todos } = {} } = useQuery(ListTodosQuery);
  const [addTodo] = useMutation(AddTodoMutation, {
    update(cache, result) {
      const listTodosQueryResult = cache.readQuery({
        query: ListTodosQuery,
      });

      const newListTodosQueryResult = produce(listTodosQueryResult, (draft) => {
        draft.todos.push(result.data.newTodoText.node);
      });

      cache.writeQuery({
        query: ListTodosQuery,
        data: newListTodosQueryResult,
      });
    },
  });
  const [editTodo] = useMutation(EditTodoMutation);
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
            <button
              onClick={() => {
                editTodo({
                  variables: {
                    id: t.id,
                    text: `[MODIFIED ${Math.random()}] ${t.task}`,
                  },
                });
              }}
            >
              add modified
            </button>
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
