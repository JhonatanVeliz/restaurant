
const htmlFooterDate = document.querySelector(".footer__grid__date");

const objetDate = new Date();
const year = objetDate.getFullYear();

htmlFooterDate.textContent = year;

