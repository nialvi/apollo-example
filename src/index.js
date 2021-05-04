import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  /**
   * simple for this example
   * this need to get from env vars
   *  */
  uri: "http://localhost:4000/",
  connectToDevTools: true,
});

apolloClient
  .query({
    query: gql`
      {
        todos {
          id
          task
          complete
        }
      }
    `,
  })
  .then((result) => console.log(result));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
