const dropdowns = document.querySelectorAll(".dropdown-container");
inputLanguageDropdown = document.querySelector("#input-language");
outputLanguageDropdown = document.querySelector("#output-language");

function populateDroppdown(dropdown, options) {
  dropdown.querySelectorAll("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + " (" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
}

populateDroppdown(inputLanguageDropdown, languages);
populateDroppdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });
  dropdown.querySelectorAll(".option").forEach((item) => {
    item.addEventListener("click", (e) => {
      // remove active from other option
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      //   add active to clicked option
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    });
  });
});

document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
});

//? function to translate text

const inputTextElement = document.querySelector("#input-text");
const outputTextElement = document.querySelector("#output-text");
const inputLanguage = inputLanguageDropdown.querySelector(".selected");
const outputLanguage = outputLanguageDropdown.querySelector(".selected");
const swapBtn = document.querySelector(".swap-position");

function translate() {
  const inputText = inputTextElement.value;
  const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;

  //? API call
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      outputTextElement.value = json[0].map((item) => item[0]).join("");
    })
    .catch((error) => {
      console.log(error);
    });
}

inputTextElement.addEventListener("input", (e) => {
  if (inputTextElement.value.length > 5000) {
    inputTextElement.value = inputTextElement.value.slice(0, 5000);
  }
  translate();
});

swapBtn.addEventListener("click", (e) => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;

  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;

  const tempInputText = inputTextElement.value;
  inputTextElement.value = outputTextElement.value;
  outputTextElement.value = tempInputText;

  translate();
});

const uploadDocument = document.querySelector("#upload-document"),
  uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file.type === "text/plain" || file.type === "application/pdf" || file.type === "application/msword") {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElement.value = e.target.result;
      translate();
    };
  } else {
    alert("Please select a valid file to upload (text/pdf/word)");
  }
});

const downloadDocument = document.querySelector("#download-document");

downloadDocument.addEventListener("click", (e) => {
  const outputText = outputTextElement.value;
  const outputLanguage = outputLanguageDropdown.querySelector(".selected").innerHTML;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translated-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
});

const inputChars = document.querySelector("#input-chars");

inputTextElement.addEventListener("input", (e) => {
  inputChars.innerHTML = e.target.value.length;
});

const darkModeBtn = document.getElementById("dark-mode-btn");

darkModeBtn.addEventListener("change", (e) => {
  document.body.classList.toggle("dark");
});
