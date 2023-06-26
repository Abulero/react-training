import HackerText from "./components/HackerText";
import "./App.css";
import BasketballCaptcha from "./components/BasketballCaptcha";
import { useState } from "react";

function App() {
  const [ready, setReady] = useState(false);

  return (
    <div className="grid-container">
      <div className="column1">
        <HackerText
          messages={[
            "Hello, there",
            "Take a look at the cool canvas thing I built",
          ]}
          onEndEvent={() => setReady(true)}
        />
      </div>
      <div className="column2">
        <BasketballCaptcha ready={ready} />
      </div>
    </div>
  );
}

export default App;
