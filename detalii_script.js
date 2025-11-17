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
  return `${d.getDate()} ${luni[d.getMonth()]} ${d.getFullYear()}`;
}

window.addEventListener("DOMContentLoaded", () => {
  const detalii = document.getElementById("detalii");
  const dataProdus = document.getElementById("dataProdus");
  const btn = document.getElementById("btnDetalii");

  if (!detalii.classList.contains("ascuns")) detalii.classList.add("ascuns");

  dataProdus.textContent = formateazaData(new Date());

  btn.addEventListener("click", () => {
    detalii.classList.toggle("ascuns");
    if (detalii.classList.contains("ascuns")) {
      btn.textContent = "Afiseaza detalii";
    } else {
      btn.textContent = "Ascunde detalii";
    }
  });
});
