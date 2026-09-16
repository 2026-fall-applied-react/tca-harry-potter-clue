import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="text-xl font-bold">Harry Potter Clue</h1>
      <button
        type="button"
        className="btn btn-lg btn-primary"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
    </div>
  );
}

export default App;
