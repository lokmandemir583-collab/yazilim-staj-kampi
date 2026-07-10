const veriGetirBtn = document.getElementById("veriGetirBtn");
const aramaInput = document.getElementById("aramaInput");
const durumMesaji = document.getElementById("durumMesaji");
const kullaniciListesi = document.getElementById("kullaniciListesi");

let kullanicilar = [];

function kullanicilariEkranaYaz(liste) {
  kullaniciListesi.innerHTML = "";

  if (liste.length === 0) {
    kullaniciListesi.innerHTML = '<p class="bos-sonuc">Gösterilecek kullanıcı bulunamadı.</p>';
    return;
  }

  liste.forEach(function(kullanici) {
    const kart = document.createElement("div");
    kart.classList.add("kullanici-karti");

    kart.innerHTML = `
      <h3>${kullanici.name}</h3>
      <p><strong>Email:</strong> ${kullanici.email}</p>
      <p><strong>Şehir:</strong> ${kullanici.address.city}</p>
      <p><strong>Şirket:</strong> ${kullanici.company.name}</p>

      <button class="detay-btn">Detayları Göster</button>

      <div class="detay-alani" style="display: none;">
        <p><strong>Telefon:</strong> ${kullanici.phone}</p>
        <p><strong>Website:</strong> ${kullanici.website}</p>
        <p><strong>Adres:</strong> ${kullanici.address.street}, ${kullanici.address.suite}</p>
      </div>
    `;

    const detayBtn = kart.querySelector(".detay-btn");
    const detayAlani = kart.querySelector(".detay-alani");

    detayBtn.addEventListener("click", function() {
      if (detayAlani.style.display === "none") {
        detayAlani.style.display = "block";
        detayBtn.textContent = "Detayları Gizle";
      } else {
        detayAlani.style.display = "none";
        detayBtn.textContent = "Detayları Göster";
      }
    });

    kullaniciListesi.appendChild(kart);
  });
}

veriGetirBtn.addEventListener("click", function() {
  durumMesaji.textContent = "Veriler yükleniyor...";
  kullaniciListesi.innerHTML = "";
  aramaInput.value = "";

  fetch("https://jsonplaceholder.typicode.com/users")
    .then(function(cevap) {
      return cevap.json();
    })
    .then(function(gelenKullanicilar) {
      kullanicilar = gelenKullanicilar;

      durumMesaji.textContent = "Veriler başarıyla getirildi.";

      kullanicilariEkranaYaz(kullanicilar);
    })
    .catch(function(hata) {
      durumMesaji.textContent = "Veriler alınırken bir hata oluştu.";
      console.log(hata);
    });
});

aramaInput.addEventListener("input", function() {
  const aramaMetni = aramaInput.value.toLowerCase().trim();

  const filtrelenmisKullanicilar = kullanicilar.filter(function(kullanici) {
    const isim = kullanici.name.toLowerCase();
    const email = kullanici.email.toLowerCase();
    const sehir = kullanici.address.city.toLowerCase();

    return (
      isim.includes(aramaMetni) ||
      email.includes(aramaMetni) ||
      sehir.includes(aramaMetni)
    );
  });

  kullanicilariEkranaYaz(filtrelenmisKullanicilar);
});