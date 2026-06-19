const buton = document.getElementById("baslaBtn");
const mesaj = document.getElementById("mesaj");
const sayac = document.getElementById("sayac");

const isimInput = document.getElementById("isimInput");
const isimBtn = document.getElementById("isimBtn");
const karsilama = document.getElementById("karsilama");

const konuInput = document.getElementById("konuInput");
const konuBtn = document.getElementById("konuBtn");
const konuListesi = document.getElementById("konuListesi");
const konuUyari = document.getElementById("konuUyari");

let tiklamaSayisi = 0;

buton.addEventListener("click", function() {
  tiklamaSayisi = tiklamaSayisi + 1;

  mesaj.textContent = "Harika! JavaScript çalışıyor. 3. güne başladım.";
  sayac.textContent = "Butona " + tiklamaSayisi + " kez tıkladın.";
});

isimBtn.addEventListener("click", function() {
  const isim = isimInput.value.trim();

  if (isim === "") {
    karsilama.textContent = "Lütfen önce adını yaz.";
  } else {
    karsilama.textContent = "Merhaba " + isim + ", yazılım staj kampına hoş geldin!";
  }
});

konuBtn.addEventListener("click", function() {
  const yeniKonu = konuInput.value.trim();

  if (yeniKonu === "") {
    konuUyari.textContent = "Lütfen eklemek istediğin konuyu yaz.";
  } else {
    const yeniMadde = document.createElement("li");

    const konuYazisi = document.createElement("span");
    konuYazisi.textContent = yeniKonu;

    const silButonu = document.createElement("button");
    silButonu.textContent = "Sil";
    silButonu.classList.add("silBtn");

    silButonu.addEventListener("click", function() {
      yeniMadde.remove();
      konuUyari.textContent = "Konu listeden silindi.";
    });

    yeniMadde.appendChild(konuYazisi);
    yeniMadde.appendChild(silButonu);

    konuListesi.appendChild(yeniMadde);

    konuInput.value = "";
    konuUyari.textContent = "Yeni konu listeye eklendi.";
  }
});