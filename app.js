const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

let dropdowns = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("form button");
let msg = document.querySelector(".msg p");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// for (code in countryList) {
//   console.log(code, countryList[code]);
// }

window.addEventListener("load", () => {
  updateExchangeRate();
});

// 1. loop to add all the options of currency code referred as "currCode" of all the countries in the dropdowns. also adding the default country option for "from" and "to". also adding the eventListener to update the flag as soon as we "change" the option in select.

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// 2. change the flag according to the country name using the target event stored as "element" and updating the url of flagAPI in img src.
const updateFlag = (element) => {
  let currCode = element.value;
  //   console.log(currCode);
  let countryCode = countryList[currCode];
  //   console.log(countryCode);
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault(); //removes the default behaviour of reloading the page and changing URL while evt = clicking.
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  let fromCurrVal = fromCurr.value.toLowerCase();
  let toCurrVal = toCurr.value.toLowerCase();

  const fromURL = `${BASE_URL}/${fromCurrVal}.json`;
  const toURL = `${BASE_URL}/${toCurrVal}.json`;
  //   console.log(fromCurrVal);
  //   console.log(toCurrVal);
  let fromResponse = await fetch(fromURL);
  let toResponse = await fetch(toURL);
  //   console.log(fromResponse, toResponse);
  let fromData = await fromResponse.json();
  let toData = await toResponse.json();
  //   console.log(fromData, toData);
  //   console.log(fromCurrVal);
  let rate = fromData[fromCurrVal];
  //   console.log(rate);
  let actualRate = rate[toCurrVal];
  //   console.log(actualRate);
  msg.innerText = `${amount.value} ${fromCurrVal.toUpperCase()} = ${
    Math.round(amount.value * actualRate * 100) / 100
  } ${toCurrVal.toUpperCase()}`;
};

document.addEventListener("DOMContentLoaded", function () {
  const swapIcon = document.getElementById("swap-icon");
  const fromSelect = document.querySelector('select[name="from"]');
  const toSelect = document.querySelector('select[name="to"]');
  const fromFlag = document.querySelector(".from-flag");
  const toFlag = document.querySelector(".to-flag");

  swapIcon.addEventListener("click", function () {
    // Swap selected values
    const tempValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempValue;

    // Swap flags
    const tempFlagSrc = fromFlag.src;
    fromFlag.src = toFlag.src;
    toFlag.src = tempFlagSrc;
  });
});
