import { parseBank } from "./bank.mjs";

const fileInput = document.querySelector("#file");
const status = document.querySelector("#status");
const form = document.querySelector("#quiz");
const choices = document.querySelector("#choices");
const check = document.querySelector("#check");
const next = document.querySelector("#next");

let bank = [];
let index = 0;
let score = 0;
let importVersion = 0;

function renderQuestion() {
  const item = bank[index];
  const legend = document.createElement("legend");
  legend.textContent = `${index + 1}/${bank.length} · ${item.question}`;
  choices.replaceChildren(legend);
  item.options.forEach((option, optionIndex) => {
    const label = document.createElement("label");
    label.style.display = "block";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = String(optionIndex);
    radio.required = true;
    label.append(radio, " ", option);
    choices.append(label);
  });
  choices.disabled = false;
  check.hidden = false;
  next.hidden = true;
  status.textContent = "";
  form.hidden = false;
  choices.querySelector("input").focus();
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;
  const version = ++importVersion;
  form.hidden = true;
  status.textContent = "正在读取题库…";
  try {
    const imported = parseBank(await file.text());
    if (version !== importVersion) return;
    bank = imported;
    index = 0;
    score = 0;
    renderQuestion();
  } catch (error) {
    if (version === importVersion) status.textContent = `导入失败。 ${error.message}`;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (form.hidden || choices.disabled) return;
  const selected = new FormData(form).get("answer");
  if (selected === null) return;
  const item = bank[index];
  const correct = Number(selected) === item.answer;
  score += Number(correct);
  const feedback = correct ? "答对了。" : `正确选项是「${item.options[item.answer]}」。`;
  status.textContent = item.explanation ? `${feedback} ${item.explanation}` : feedback;
  choices.disabled = true;
  check.hidden = true;
  next.textContent = index + 1 === bank.length ? "查看成绩" : "下一题";
  next.hidden = false;
  next.focus();
});

next.addEventListener("click", () => {
  if (++index < bank.length) {
    renderQuestion();
    return;
  }
  form.hidden = true;
  status.textContent = `练习完成，答对 ${score}/${bank.length} 题。`;
  fileInput.value = "";
  fileInput.focus();
});
