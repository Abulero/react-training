import HackerText from "./components/HackerText";
import "./App.css";
import BasketballCaptcha from "./components/BasketballCaptcha";
import { useState } from "react";

function App() {
  const [ready, setReady] = useState(false);
  const [stopText, setStopText] = useState(false);

  function showCaptcha() {
    setReady(true);
    setStopText(true);
  }

  return (
    <div className="grid-container">
      <div className="column1">
        <HackerText
          stopText={stopText}
          messages={[
            "Hello, there",
            "Congratulations... !",
            "You are the 1.000.000th visitor",
            "You just got a 99% discount coupon",
            "To use it, solve the captcha on the right",
            "If you're not a robot, score 5 points",
            "Good luck",
          ]}
          onEndEvent={() => showCaptcha()}
        />
      </div>
      <div className="column2">
        <BasketballCaptcha ready={ready} />
      </div>
    </div>
  );
}

export default App;
