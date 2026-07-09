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
const tarihInput = document.getElementById("tarihInput");
const gorevBtn = document.getElementById("gorevBtn");
const gorevListesi = document.getElementById("gorevListesi");
const bosListeMesaji = document.getElementById("bosListeMesaji");
const gorevUyari = document.getElementById("gorevUyari");
const gorevOzeti = document.getElementById("gorevOzeti");
const ilerlemeCubugu = document.getElementById("ilerlemeCubugu");
const ilerlemeYazisi = document.getElementById("ilerlemeYazisi");
const aramaInput = document.getElementById("aramaInput");
const oncelikFiltreSelect = document.getElementById("oncelikFiltreSelect");
const siralamaSelect = document.getElementById("siralamaSelect");

const tumGorevlerBtn = document.getElementById("tumGorevlerBtn");
const tamamlananGorevlerBtn = document.getElementById("tamamlananGorevlerBtn");
const devamEdenGorevlerBtn = document.getElementById("devamEdenGorevlerBtn");
const gecikenGorevlerBtn = document.getElementById("gecikenGorevlerBtn");
const filtreleriSifirlaBtn = document.getElementById("filtreleriSifirlaBtn");
const tamamlananlariTemizleBtn = document.getElementById("tamamlananlariTemizleBtn");
const tumGorevleriTemizleBtn = document.getElementById("tumGorevleriTemizleBtn");

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

  let yuzde = 0;

  if (toplamGorev > 0) {
    yuzde = Math.round((tamamlananGorev / toplamGorev) * 100);
  }

  ilerlemeCubugu.style.width = yuzde + "%";
  ilerlemeYazisi.textContent = "Tamamlanma: %" + yuzde;
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

function filtreButonlariniGuncelle() {
  tumGorevlerBtn.classList.remove("aktif-filtre");
  tamamlananGorevlerBtn.classList.remove("aktif-filtre");
  devamEdenGorevlerBtn.classList.remove("aktif-filtre");
  gecikenGorevlerBtn.classList.remove("aktif-filtre");

  if (aktifFiltre === "tum") {
    tumGorevlerBtn.classList.add("aktif-filtre");
  } else if (aktifFiltre === "tamamlanan") {
    tamamlananGorevlerBtn.classList.add("aktif-filtre");
  } else if (aktifFiltre === "devamEden") {
    devamEdenGorevlerBtn.classList.add("aktif-filtre");
  } else if (aktifFiltre === "geciken") {
    gecikenGorevlerBtn.classList.add("aktif-filtre");
  }
}

function gorevleriEkranaYaz() {
  gorevListesi.innerHTML = "";

  gorevOzetiniGuncelle();
  filtreButonlariniGuncelle();

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

  if (aktifFiltre === "geciken") {
    const bugun = new Date().toISOString().split("T")[0];

    gosterilecekGorevler = gorevler.filter(function(gorev) {
      return gorev.tarih && gorev.tarih < bugun && gorev.tamamlandi === false;
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

  if (aktifSiralama === "tarihYakindanUzaga") {
    gosterilecekGorevler.sort(function(a, b) {
      const tarihA = a.tarih || "9999-12-31";
      const tarihB = b.tarih || "9999-12-31";

      return tarihA.localeCompare(tarihB);
    });
  }

  if (aktifSiralama === "tarihUzaktanYakina") {
    gosterilecekGorevler.sort(function(a, b) {
      const tarihA = a.tarih || "0000-01-01";
      const tarihB = b.tarih || "0000-01-01";

      return tarihB.localeCompare(tarihA);
    });
  }

  if (gosterilecekGorevler.length === 0) {
    bosListeMesaji.textContent = "Gösterilecek görev bulunamadı.";
  } else {
    bosListeMesaji.textContent = "";
  }

  gosterilecekGorevler.forEach(function(gorev) {
    const yeniMadde = document.createElement("li");

    const bugun = new Date().toISOString().split("T")[0];

    if (gorev.tarih && gorev.tarih < bugun && gorev.tamamlandi === false) {
      yeniMadde.classList.add("gecikti");
    }

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

    const tarihYazisi = document.createElement("span");

    if (gorev.tarih) {
      tarihYazisi.textContent = "Son tarih: " + gorev.tarih;
      tarihYazisi.classList.add("tarih");
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

    if (gorev.tarih) {
      yeniMadde.appendChild(tarihYazisi);
    }

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
      oncelik: oncelikSelect.value,
      tarih: tarihInput.value
    };

    gorevler.push(gorev);

    localStorage.setItem("gorevler", JSON.stringify(gorevler));

    gorevleriEkranaYaz();

    gorevInput.value = "";
    oncelikSelect.value = "dusuk";
    tarihInput.value = "";
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

gecikenGorevlerBtn.addEventListener("click", function() {
  aktifFiltre = "geciken";
  gorevleriEkranaYaz();
});

filtreleriSifirlaBtn.addEventListener("click", function() {
  aktifFiltre = "tum";
  aramaMetni = "";
  aktifOncelikFiltre = "tum";
  aktifSiralama = "normal";

  aramaInput.value = "";
  oncelikFiltreSelect.value = "tum";
  siralamaSelect.value = "normal";

  gorevleriEkranaYaz();

  gorevUyari.textContent = "Filtreler sıfırlandı.";
});

tamamlananlariTemizleBtn.addEventListener("click", function() {
  gorevler = gorevler.filter(function(gorev) {
    return gorev.tamamlandi === false;
  });

  localStorage.setItem("gorevler", JSON.stringify(gorevler));

  gorevleriEkranaYaz();

  gorevUyari.textContent = "Tamamlanan görevler temizlendi.";
});

tumGorevleriTemizleBtn.addEventListener("click", function() {
  const onay = confirm("Tüm görevleri silmek istediğine emin misin?");

  if (onay === true) {
    gorevler = [];

    localStorage.setItem("gorevler", JSON.stringify(gorevler));

    gorevleriEkranaYaz();

    gorevUyari.textContent = "Tüm görevler temizlendi.";
  } else {
    gorevUyari.textContent = "Silme işlemi iptal edildi.";
  }
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