const input = document.getElementById("input");
const mic = document.getElementById("mic");
const send = document.getElementById("send");

const answer = document.getElementById("answer");
const status = document.getElementById("status");

const app = document.getElementById("app");
const hidden = document.getElementById("hidden");

const show = document.getElementById("show");
const orb = document.getElementById("orb");


// =====================================
// SPEAK
// =====================================

function say(text) {

  if (!window.speechSynthesis) return;

  speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.rate = 0.9;
  speech.pitch = 0.9;

  speechSynthesis.speak(speech);
}


// =====================================
// MESSAGE
// =====================================

function message(text) {
  answer.textContent = text;
}


// =====================================
// GO TO URL
// =====================================

function go(url) {

  // IMPORTANT:
  // Navigate directly instead of popup.

  window.location.assign(url);
}


// =====================================
// GOOGLE
// =====================================

function google(query) {

  query = query.trim();

  if (!query) return;

  const url =
    "https://www.google.com/search?q=" +
    encodeURIComponent(query);

  message("Searching Google...");

  say("Searching Google");

  go(url);
}


// =====================================
// WEBSITE
// =====================================

function website(name) {

  name = name.trim();

  if (!name) return;

  const n = name.toLowerCase();

  const sites = {

    "youtube":
      "https://www.youtube.com",

    "google":
      "https://www.google.com",

    "chatgpt":
      "https://chatgpt.com",

    "github":
      "https://github.com",

    "instagram":
      "https://www.instagram.com",

    "facebook":
      "https://www.facebook.com",

    "wikipedia":
      "https://www.wikipedia.org",

    "gmail":
      "https://mail.google.com",

    "amazon":
      "https://www.amazon.in",

    "reddit":
      "https://www.reddit.com",

    "nasa":
      "https://www.nasa.gov",

    "pw":
      "https://www.pw.live",

    "physics wallah":
      "https://www.pw.live"
  };


  // Known website

  if (sites[n]) {

    message("Opening " + name);

    say("Opening " + name);

    go(sites[n]);

    return;
  }


  // Direct website

  if (
    n.includes(".") ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  ) {

    let url = name;

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      url = "https://" + url;
    }

    message("Opening " + name);

    say("Opening " + name);

    go(url);

    return;
  }


  // Unknown website:
  // Find it on Google

  message("Finding " + name);

  say("Finding " + name);

  google(name + " official website");
}


// =====================================
// CALCULATOR
// =====================================

function calculate(text) {

  let expression = text
    .replace(/times/gi, "*")
    .replace(/multiplied by/gi, "*")
    .replace(/plus/gi, "+")
    .replace(/minus/gi, "-")
    .replace(/divided by/gi, "/");

  if (
    !/^[0-9+\-*/().%\s]+$/.test(expression)
  ) {
    google(text);
    return;
  }

  try {

    const result =
      Function(
        '"use strict"; return (' +
        expression +
        ')'
      )();

    message(
      expression +
      " = " +
      result
    );

    say(
      expression +
      " equals " +
      result
    );

  } catch {

    google(text);

  }
}


// =====================================
// COMMAND
// =====================================

function command(raw) {

  let text =
    raw.trim();

  if (!text) return;


  // Remove wake word

  text =
    text.replace(
      /^hey\s+jarvis[\s,]*/i,
      ""
    );

  text =
    text.replace(
      /^jarvis[\s,]*/i,
      ""
    );


  const lower =
    text.toLowerCase();


  // OPEN WEBSITE

  if (
    lower.startsWith("open ")
  ) {

    website(
      text.substring(5)
    );

    return;
  }


  // SEARCH GOOGLE

  if (
    lower.startsWith("search google ")
  ) {

    google(
      text.substring(14)
    );

    return;
  }


  // SEARCH

  if (
    lower.startsWith("search ")
  ) {

    google(
      text.substring(7)
    );

    return;
  }


  // CALCULATE

  if (
    lower.startsWith("calculate ")
  ) {

    calculate(
      text.substring(10)
    );

    return;
  }


  // TIME

  if (
    lower.includes("time")
  ) {

    const time =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit"
        }
      );

    message(
      "The time is " + time
    );

    say(
      "The time is " + time
    );

    return;
  }


  // DATE

  if (
    lower.includes("date") ||
    lower.includes("today")
  ) {

    const date =
      new Date().toLocaleDateString(
        [],
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      );

    message(
      "Today is " + date
    );

    say(
      "Today is " + date
    );

    return;
  }


  // DISAPPEAR

  if (
    lower === "disappear" ||
    lower === "go away" ||
    lower === "hide yourself"
  ) {

    app.style.display = "none";

    hidden.style.display = "flex";

    return;
  }


  // SHOW

  if (
    lower === "show yourself" ||
    lower === "come back"
  ) {

    hidden.style.display = "none";

    app.style.display = "flex";

    message("Systems restored.");

    say("Systems restored.");

    return;
  }


  // GO BACK

  if (
    lower === "go back" ||
    lower === "back"
  ) {

    history.back();

    return;
  }


  // STOP

  if (
    lower === "stop"
  ) {

    speechSynthesis.cancel();

    status.textContent =
      "STANDBY";

    message("Stopped.");

    return;
  }


  // HELLO

  if (
    lower === "hello" ||
    lower === "hi"
  ) {

    message(
      "Hello. How can I help you?"
    );

    say(
      "Hello. How can I help you?"
    );

    return;
  }


  // ANYTHING ELSE
  // IS SEARCHED ON GOOGLE

  google(text);
}


// =====================================
// MANUAL SEND
// =====================================

send.addEventListener(
  "click",
  function() {

    command(input.value);

  }
);


// =====================================
// ENTER
// =====================================

input.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {

      command(input.value);

    }

  }
);


// =====================================
// VOICE RECOGNITION
// =====================================

const Recognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


let recognition = null;

let listening = false;


if (Recognition) {

  recognition =
    new Recognition();


  recognition.lang =
    "en-IN";

  recognition.continuous =
    false;

  recognition.interimResults =
    false;


  recognition.onstart =
    function() {

      listening = true;

      app.classList.add(
        "listening"
      );

      status.textContent =
        "LISTENING";

      message(
        "I'm listening..."
      );

    };


  recognition.onresult =
    function(event) {

      const text =
        event.results[0][0]
          .transcript
          .trim();


      // SHOW SPEECH IN BOX

      input.value = text;


      // EXECUTE AUTOMATICALLY

      command(text);

    };


  recognition.onerror =
    function(event) {

      console.log(
        "Speech error:",
        event.error
      );

      message(
        "Voice error: " +
        event.error
      );

    };


  recognition.onend =
    function() {

      listening = false;

      app.classList.remove(
        "listening"
      );

      status.textContent =
        "STANDBY";

    };

}


// =====================================
// MICROPHONE
// =====================================

function listen() {

  if (!recognition) {

    message(
      "Voice recognition isn't supported by this browser."
    );

    return;
  }


  if (listening) {

    recognition.stop();

    return;
  }


  try {

    recognition.start();

  } catch(error) {

    console.log(error);

  }
}


mic.addEventListener(
  "click",
  listen
);


// =====================================
// ORB = MICROPHONE
// =====================================

orb.addEventListener(
  "click",
  listen
);


// =====================================
// SHOW JARVIS
// =====================================

show.addEventListener(
  "click",
  function() {

    hidden.style.display = "none";

    app.style.display = "flex";

  }
);
