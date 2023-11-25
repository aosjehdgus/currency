import React, { PropsWithChildren } from "react";
import "./App.css";

function App(props: PropsWithChildren) {
  return <>{props.children}</>;
}

export default App;
