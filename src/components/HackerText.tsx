import React from "react";

type Props = {
  elementId: number;
  stopText: boolean;
  messages: string[];
  onEndEvent: () => void;
};

function HackerText(props: Props) {
  let textElements = generateTextElements(props.elementId, props.messages);
  manageHackerTexts(
    props.elementId,
    props.stopText,
    props.messages,
    props.onEndEvent
  );

  return <>{textElements}</>;
}

function manageHackerTexts(
  elementId: number,
  stopText: boolean,
  messages: string[],
  onEndEvent: () => void
) {
  let typingSpeed = 50;

  let textElements = getTextElements(elementId, messages);
  let timer: NodeJS.Timer;
  let currentTextElementIndex = 0;
  let currentTargetMessage = messages[currentTextElementIndex];
  let idleCursorCounter = 0;
  let finishedTyping = false;
  let eventCalled = false;

  function updateText() {
    let currentElement = textElements[currentTextElementIndex];
    let currentMessage: string;

    if (!textElements[currentTextElementIndex]) return;

    currentMessage = currentElement.innerHTML;

    let isUnderlinePresent = isUnderlined(currentMessage);
    if (isUnderlinePresent) currentMessage = currentMessage.replace("_", "");

    currentMessage = checkAddChar(currentMessage, currentTargetMessage);
    currentMessage = checkAddUnderline(
      currentMessage,
      currentTargetMessage,
      isUnderlinePresent
    );

    if (!finishedTyping) {
      ({ timer, finishedTyping } = checkStayIdle(
        currentMessage,
        currentTargetMessage,
        timer,
        finishedTyping,
        updateText
      ));
    } else {
      if (!isUnderlinePresent) idleCursorCounter++;

      if (idleCursorCounter > 3) {
        currentTextElementIndex++;

        if (currentTextElementIndex < messages.length) {
          finishedTyping = false;
          currentTargetMessage = messages[currentTextElementIndex];

          clearInterval(timer);
          timer = setInterval(updateText, typingSpeed);

          idleCursorCounter = 0;
          currentMessage = "";
        } else {
          if (!eventCalled) {
            onEndEvent();
            eventCalled = true;
          }

          currentTextElementIndex = messages.length - 1;
        }

        if (finishedTyping) idleCursorCounter = 0;
      }
    }

    if (idleCursorCounter <= 3)
      textElements[currentTextElementIndex].innerHTML = currentMessage;
  }

  if (stopText) return;

  React.useEffect(() => {
    timer = setInterval(updateText, typingSpeed);
  });
}

function generateTextElements(elementId: number, message: Array<string>) {
  var textElements = [
    <h1
      id={`hackerMessageElement${elementId}0`}
      key={`hackerMessageElement${elementId}0`}
    ></h1>,
  ];

  for (var i = 1; i < message.length; i++) {
    let stringIndex = i.toString();
    let newId = `hackerMessageElement${elementId}${stringIndex}`;
    let newElement = <p id={newId} key={newId}></p>;

    textElements.push(newElement);
  }

  return textElements;
}

function getTextElements(elementId: number, messages: string[]) {
  let textElements = new Array<HTMLElement>();
  for (var i = 0; i < messages.length; i++) {
    let element = document.getElementById(
      `hackerMessageElement${elementId}${i.toString()}`
    );

    if (element) textElements.push(element);
  }
  return textElements;
}

function isUnderlined(currentMessage: string) {
  return currentMessage.charAt(currentMessage.length - 1) == "_";
}

function checkAddChar(message: string, targetMessage: string) {
  let i = 0;
  for (const char of targetMessage) {
    if (message.length < i + 1 && char != message.charAt(i)) {
      message += char;
      break;
    }

    i++;
  }

  return message;
}

function checkAddUnderline(
  message: string,
  targetMessage: string,
  isUnderlinePresent: boolean
) {
  if (message != targetMessage || !isUnderlinePresent) message += "_";

  return message;
}

function checkStayIdle(
  message: string,
  targetMessage: string,
  timer: NodeJS.Timer,
  finishedTyping: boolean,
  updateText: () => void
) {
  if (message.replace("_", "") == targetMessage) {
    clearInterval(timer);
    timer = setInterval(updateText, 500);

    finishedTyping = true;
  }

  return { timer, finishedTyping };
}

export default HackerText;
