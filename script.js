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
const oncelikSelect = document.getElementById("oncelikSelect");
const gorevBtn = document.getElementById("gorevBtn");
const gorevListesi = document.getElementById("gorevListesi");
const gorevUyari = document.getElementById("gorevUyari");
const gorevOzeti = document.getElementById("gorevOzeti");
const aramaInput = document.getElementById("aramaInput");
const oncelikFiltreSelect = document.getElementById("oncelikFiltreSelect");
const siralamaSelect = document.getElementById("siralamaSelect");

const tumGorevlerBtn = document.getElementById("tumGorevlerBtn");
const tamamlananGorevlerBtn = document.getElementById("tamamlananGorevlerBtn");
const devamEdenGorevlerBtn = document.getElementById("devamEdenGorevlerBtn");
const tamamlananlariTemizleBtn = document.getElementById("tamamlananlariTemizleBtn");

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
let aramaMetni = "";
let aktifOncelikFiltre = "tum";
let aktifSiralama = "normal";

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

function gorevOzetiniGuncelle() {
  const toplamGorev = gorevler.length;

  const tamamlananGorev = gorevler.filter(function(gorev) {
    return gorev.tamamlandi === true;
  }).length;

  const devamEdenGorev = gorevler.filter(function(gorev) {
    return gorev.tamamlandi === false;
  }).length;

  gorevOzeti.textContent =
    "Toplam görev: " + toplamGorev +
    " | Tamamlanan: " + tamamlananGorev +
    " | Devam eden: " + devamEdenGorev;
}

function oncelikPuani(oncelik) {
  if (oncelik === "yuksek") {
    return 3;
  } else if (oncelik === "orta") {
    return 2;
  } else {
    return 1;
  }
}

function gorevleriEkranaYaz() {
  gorevListesi.innerHTML = "";

  gorevOzetiniGuncelle();

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

  if (aramaMetni !== "") {
    gosterilecekGorevler = gosterilecekGorevler.filter(function(gorev) {
      return gorev.metin.toLowerCase().includes(aramaMetni);
    });
  }

  if (aktifOncelikFiltre !== "tum") {
    gosterilecekGorevler = gosterilecekGorevler.filter(function(gorev) {
      const gorevOnceligi = gorev.oncelik || "orta";
      return gorevOnceligi === aktifOncelikFiltre;
    });
  }

  gosterilecekGorevler = [...gosterilecekGorevler];

  if (aktifSiralama === "yuksektenDusuge") {
    gosterilecekGorevler.sort(function(a, b) {
      return oncelikPuani(b.oncelik || "orta") - oncelikPuani(a.oncelik || "orta");
    });
  }

  if (aktifSiralama === "dusuktenYuksege") {
    gosterilecekGorevler.sort(function(a, b) {
      return oncelikPuani(a.oncelik || "orta") - oncelikPuani(b.oncelik || "orta");
    });
  }

  gosterilecekGorevler.forEach(function(gorev) {
    const yeniMadde = document.createElement("li");

    const gorevYazisi = document.createElement("span");
    gorevYazisi.textContent = gorev.metin;

    if (gorev.tamamlandi === true) {
      gorevYazisi.classList.add("tamamlandi");
    }

    const oncelikDegeri = gorev.oncelik || "orta";

    const oncelikYazisi = document.createElement("span");

    if (oncelikDegeri === "dusuk") {
      oncelikYazisi.textContent = "Düşük";
      oncelikYazisi.classList.add("oncelik", "dusuk");
    } else if (oncelikDegeri === "orta") {
      oncelikYazisi.textContent = "Orta";
      oncelikYazisi.classList.add("oncelik", "orta");
    } else {
      oncelikYazisi.textContent = "Yüksek";
      oncelikYazisi.classList.add("oncelik", "yuksek");
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
    yeniMadde.appendChild(oncelikYazisi);
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
      tamamlandi: false,
      oncelik: oncelikSelect.value
    };

    gorevler.push(gorev);

    localStorage.setItem("gorevler", JSON.stringify(gorevler));

    gorevleriEkranaYaz();

    gorevInput.value = "";
    oncelikSelect.value = "dusuk";
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

tamamlananlariTemizleBtn.addEventListener("click", function() {
  gorevler = gorevler.filter(function(gorev) {
    return gorev.tamamlandi === false;
  });

  localStorage.setItem("gorevler", JSON.stringify(gorevler));

  gorevleriEkranaYaz();

  gorevUyari.textContent = "Tamamlanan görevler temizlendi.";
});

aramaInput.addEventListener("input", function() {
  aramaMetni = aramaInput.value.toLowerCase().trim();
  gorevleriEkranaYaz();
});

oncelikFiltreSelect.addEventListener("change", function() {
  aktifOncelikFiltre = oncelikFiltreSelect.value;
  gorevleriEkranaYaz();
});

siralamaSelect.addEventListener("change", function() {
  aktifSiralama = siralamaSelect.value;
  gorevleriEkranaYaz();
});

konulariEkranaYaz();
gorevleriEkranaYaz();