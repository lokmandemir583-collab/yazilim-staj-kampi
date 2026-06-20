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

const gorevInput = document.getElementById("gorevInput");
const gorevBtn = document.getElementById("gorevBtn");
const gorevListesi = document.getElementById("gorevListesi");
const gorevUyari = document.getElementById("gorevUyari");

const tumGorevlerBtn = document.getElementById("tumGorevlerBtn");
const tamamlananGorevlerBtn = document.getElementById("tamamlananGorevlerBtn");
const devamEdenGorevlerBtn = document.getElementById("devamEdenGorevlerBtn");

let tiklamaSayisi = 0;

const varsayilanKonular = [
  "Git ve GitHub kullanımı",
  "HTML ve CSS temelleri",
  "JavaScript temelleri",
  "API mantığı",
  "Basit proje geliştirme"
];

let konular = JSON.parse(localStorage.getItem("konular")) || varsayilanKonular;
let gorevler = JSON.parse(localStorage.getItem("gorevler")) || [];

let aktifFiltre = "tum";

function konulariEkranaYaz() {
  konuListesi.innerHTML = "";

  konular.forEach(function(konu) {
    const yeniMadde = document.createElement("li");

    const konuYazisi = document.createElement("span");
    konuYazisi.textContent = konu;

    const silButonu = document.createElement("button");
    silButonu.textContent = "Sil";
    silButonu.classList.add("silBtn");

    silButonu.addEventListener("click", function() {
      konular = konular.filter(function(k) {
        return k !== konu;
      });

      localStorage.setItem("konular", JSON.stringify(konular));
      konulariEkranaYaz();
      konuUyari.textContent = "Konu listeden silindi.";
    });

    yeniMadde.appendChild(konuYazisi);
    yeniMadde.appendChild(silButonu);

    konuListesi.appendChild(yeniMadde);
  });
}

function gorevleriEkranaYaz() {
  gorevListesi.innerHTML = "";

  let gosterilecekGorevler = gorevler;

  if (aktifFiltre === "tamamlanan") {
    gosterilecekGorevler = gorevler.filter(function(gorev) {
      return gorev.tamamlandi === true;
    });
  }

  if (aktifFiltre === "devamEden") {
    gosterilecekGorevler = gorevler.filter(function(gorev) {
      return gorev.tamamlandi === false;
    });
  }

  gosterilecekGorevler.forEach(function(gorev) {
    const yeniMadde = document.createElement("li");

    const gorevYazisi = document.createElement("span");
    gorevYazisi.textContent = gorev.metin;

    if (gorev.tamamlandi === true) {
      gorevYazisi.classList.add("tamamlandi");
    }

    const tamamlaButonu = document.createElement("button");

    if (gorev.tamamlandi === true) {
      tamamlaButonu.textContent = "Geri Al";
    } else {
      tamamlaButonu.textContent = "Tamamlandı";
    }

    tamamlaButonu.classList.add("gorevBtn");

    const duzenleButonu = document.createElement("button");
    duzenleButonu.textContent = "Düzenle";
    duzenleButonu.classList.add("gorevBtn");

    const silButonu = document.createElement("button");
    silButonu.textContent = "Sil";
    silButonu.classList.add("gorevBtn");

    tamamlaButonu.addEventListener("click", function() {
      gorev.tamamlandi = !gorev.tamamlandi;

      localStorage.setItem("gorevler", JSON.stringify(gorevler));
      gorevleriEkranaYaz();
    });

    duzenleButonu.addEventListener("click", function() {
      const yeniMetin = prompt("Görevi düzenle:", gorev.metin);

      if (yeniMetin === null) {
        return;
      }

      const temizMetin = yeniMetin.trim();

      if (temizMetin === "") {
        gorevUyari.textContent = "Görev boş bırakılamaz.";
      } else {
        gorev.metin = temizMetin;

        localStorage.setItem("gorevler", JSON.stringify(gorevler));
        gorevleriEkranaYaz();
        gorevUyari.textContent = "Görev güncellendi.";
      }
    });

    silButonu.addEventListener("click", function() {
      gorevler = gorevler.filter(function(g) {
        return g.id !== gorev.id;
      });

      localStorage.setItem("gorevler", JSON.stringify(gorevler));
      gorevleriEkranaYaz();
      gorevUyari.textContent = "Görev silindi.";
    });

    yeniMadde.appendChild(gorevYazisi);
    yeniMadde.appendChild(tamamlaButonu);
    yeniMadde.appendChild(duzenleButonu);
    yeniMadde.appendChild(silButonu);

    gorevListesi.appendChild(yeniMadde);
  });
}

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

function konuEkle() {
  const yeniKonu = konuInput.value.trim();

  if (yeniKonu === "") {
    konuUyari.textContent = "Lütfen eklemek istediğin konuyu yaz.";
  } else {
    konular.push(yeniKonu);

    localStorage.setItem("konular", JSON.stringify(konular));

    konulariEkranaYaz();

    konuInput.value = "";
    konuUyari.textContent = "Yeni konu listeye eklendi.";
  }
}

konuBtn.addEventListener("click", konuEkle);

konuInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    konuEkle();
  }
});

function gorevEkle() {
  const yeniGorev = gorevInput.value.trim();

  if (yeniGorev === "") {
    gorevUyari.textContent = "Lütfen bir görev yaz.";
  } else {
    const gorev = {
      id: Date.now(),
      metin: yeniGorev,
      tamamlandi: false
    };

    gorevler.push(gorev);

    localStorage.setItem("gorevler", JSON.stringify(gorevler));

    gorevleriEkranaYaz();

    gorevInput.value = "";
    gorevUyari.textContent = "Görev eklendi.";
  }
}

gorevBtn.addEventListener("click", gorevEkle);

gorevInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    gorevEkle();
  }
});

tumGorevlerBtn.addEventListener("click", function() {
  aktifFiltre = "tum";
  gorevleriEkranaYaz();
});

tamamlananGorevlerBtn.addEventListener("click", function() {
  aktifFiltre = "tamamlanan";
  gorevleriEkranaYaz();
});

devamEdenGorevlerBtn.addEventListener("click", function() {
  aktifFiltre = "devamEden";
  gorevleriEkranaYaz();
});

konulariEkranaYaz();
gorevleriEkranaYaz();