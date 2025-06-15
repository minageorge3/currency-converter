const colors = document.querySelectorAll(".changeC");
const container = document.querySelector(".container");
const header = document.querySelector("header");
function applyColor() {
  let savedbageColor = window.localStorage.getItem("sendbagecolor");
  let savedtextColor = window.localStorage.getItem("sendtextcolor");
  let savedbgcolor = window.localStorage.getItem("bgcolor");
  if (savedbageColor && savedtextColor) {
    document.body.style.backgroundColor = savedbgcolor;
    container.style.backgroundColor = savedbageColor;
    container.style.color = savedtextColor;
    header.style.color = savedtextColor;
    colors.forEach((c) => {
      c.classList.remove("colorchoosen");
    });
    let colorFocus = document.querySelector(`[data-color='${savedbageColor}']`);
    if (colorFocus) {
      colorFocus.classList.add("colorchoosen");
    }
  }
}
applyColor();
function handleColor(e) {
  window.localStorage.setItem("sendbagecolor", e.target.dataset.color);
  window.localStorage.setItem("sendtextcolor", e.target.dataset.text);
  window.localStorage.setItem("bgcolor", e.target.dataset.bg);
  applyColor();
}
colors.forEach((col) => {
  col.addEventListener("click", handleColor);
});
//
const showDate = document.querySelector(".date");

if (showDate) {
  const date = new Date(); // Get the current date
  const options = { weekday: "short", day: "2-digit", month: "short" };
  const formattedDate = date
    .toLocaleDateString("en-GB", options)
    .replace(",", "");

  showDate.textContent = formattedDate;
} else {
  console.error("Element with class '.date' not found.");
}

//
const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const btn = document.querySelector(".btn");
const apiKey = "fbcea3b710b8674d4469680a";
for (let i = 0; i < dropList.length; i++) {
  for (let currencyCode in countryCode) {
    let selected;
    if (i === 0) {
      selected = currencyCode == "USD" ? "selected" : "";
    } else if (i === 1) {
      selected = currencyCode == "EGP" ? "selected" : "";
    }
    let optionTag = `<option value="${currencyCode}"${selected}>${currencyCode}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}
function loadFlag(element) {
  for (let code in countryCode) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagsapi.com/${countryCode[code]}/flat/64.png`;
    }
  }
}
window.addEventListener("load", () => {
  exchangeCurrency();
});
btn.addEventListener("click", (e) => {
  e.preventDefault();
  exchangeCurrency();
});
const icon = document.querySelector(".drop-list .icon");
icon.addEventListener("click", () => {
  let change = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = change;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  exchangeCurrency();
});
function exchangeCurrency() {
  const cInput = document.querySelector("form input");
  let exchangerateResult = document.querySelector(".exchange-rate");

  let currencyInput = cInput.value;
  if (currencyInput == "" || currencyInput == "0") {
    currencyInput = "1";
    cInput.value = 1;
  }
  exchangerateResult.textContent = "getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => {
      let rate = result.conversion_rates[toCurrency.value];
      let totalRate = (currencyInput * rate).toFixed(2);
      exchangerateResult.textContent = `${currencyInput} ${fromCurrency.value} = ${totalRate} ${toCurrency.value} `;
    })
    .catch(() => {
      exchangerateResult.textContent =
        "something is wrong or bad connection...";
    });
}
