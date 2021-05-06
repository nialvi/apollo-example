import { useState } from "react";
import produce from "immer";

import ListTodosQuery from "./graphql/ListTodos.query.graphql";
import AddTodoMutation from "./graphql/AddTodo.mutation.graphql";
import EditTodoMutation from "./graphql/EditTodo.mutation.graphql";
import RemoveTodoMutation from "./graphql/RemoveTodo.mutation.graphql";
import NewTodoSubscription from "./graphql/NewTodo.subscription.graphql";

import { useQuery, useMutation, useSubscription } from "@apollo/client";

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
  // const [removeTodo] = useMutation(RemoveTodoMutation, {
  //   update(cache, result) {
  //     const [id] = result.data.removeTodo;

  //     // delete from cache the todo by id
  //     cache.evict({
  //       id: cache.identify({
  //         __typename: "Todo",
  //         id,
  //       }),
  //     });
  //   },
  // });

  // or we can refetch data
  const [removeTodo] = useMutation(RemoveTodoMutation, {
    optimisticResponse: (vars) => ({
      removeTodo: [vars.id],
    }),
    update(cache, result) {
      console.log(result);
    },
  });

  const [newTodoText, setTodoText] = useState("");

  useSubscription(NewTodoSubscription, {
    onSubscriptionData(data) {
      console.log(data);
    },
  });

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
                const text = `[MODIFIED ${Math.random()}] ${t.task}`;

                const optimisticResponse = {
                  editTodo: {
                    __typename: "TodoResponse",
                    node: {
                      __typename: "Todo",
                      id: t.id,
                      task: `Optimistic ${t.task}`,
                    },
                  },
                };

                editTodo({
                  variables: {
                    id: t.id,
                    text,
                  },
                  optimisticResponse,
                });
              }}
            >
              add modified
            </button>
            <button
              onClick={() => {
                removeTodo({
                  variables: {
                    id: t.id,
                  },
                });
              }}
            >
              remove
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
          addTodo({
            variables: { text: newTodoText },
            optimisticResponse: (vars) => ({
              newTodo: {
                node: {
                  complete: false,
                  id: `Optimistic ${Math.random()}`,
                  task: `Optimistic ${vars.text}`,
                },
              },
            }),
          });
        }}
      >
        add todo
      </button>
    </div>
  );
}

export default App;
