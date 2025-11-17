const input = document.getElementById("inputActivitate");
const btn = document.getElementById("btnAdauga");
const ul = document.getElementById("listaActivitati");

const luni = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

function formateazaData(d) {
  const zi = d.getDate();
  const luna = luni[d.getMonth()];
  const an = d.getFullYear();
  return `${zi} ${luna} ${an}`;
}

function adaugaActivitate() {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");
  const data = new Date();
  li.textContent = `${text} – adaugata la: ${formateazaData(data)}.`;
  ul.appendChild(li);
  input.value = "";
  input.focus();
}

btn.addEventListener("click", adaugaActivitate);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    adaugaActivitate();
  }
});
