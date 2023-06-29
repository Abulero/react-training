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
            "Congratulations... !",
            "You are the visitor #1.000",
            "You just got a 99% discount coupon",
            "To use it, please solve the captcha on the right",
            "Prove you're not a robot...",
            "By scoring 5 points. Good luck !",
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
