const buton = document.getElementById("baslaBtn");
const mesaj = document.getElementById("mesaj");
const sayac = document.getElementById("sayac");

let tiklamaSayisi = 0;

buton.addEventListener("click", function() {
  tiklamaSayisi = tiklamaSayisi + 1;

  mesaj.textContent = "Harika! JavaScript çalışıyor. 3. güne başladım.";
  sayac.textContent = "Butona " + tiklamaSayisi + " kez tıkladın.";
});