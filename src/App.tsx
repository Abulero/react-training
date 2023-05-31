import HackerText from "../components/HackerText";
import "./App.css";
import RegisterProcess from "../components/RegisterProcess";

function App() {
  let registerProcess = new RegisterProcess();

  return (
    <div className="grid-container">
      <div className="column1">
        <HackerText
          messages={[
            "Hello, there.",
            "Welcome to our online store",
            "We have an assortment of different products",
            "Let me tell you, they are really something",
            "And today's your lucky day because everything is 99% off",
            "But before you can use our discounts, please register",
          ]}
          onEndEvent={() => registerProcess.SetReadyToShow()}
        />
      </div>
      <div className="column2">{registerProcess.render()}</div>
    </div>
  );
}

export default App;
