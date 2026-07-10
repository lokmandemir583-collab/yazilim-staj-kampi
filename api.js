const veriGetirBtn = document.getElementById("veriGetirBtn");
const durumMesaji = document.getElementById("durumMesaji");
const kullaniciListesi = document.getElementById("kullaniciListesi");

veriGetirBtn.addEventListener("click", function() {
  durumMesaji.textContent = "Veriler yükleniyor...";
  kullaniciListesi.innerHTML = "";

  fetch("https://jsonplaceholder.typicode.com/users")
    .then(function(cevap) {
      return cevap.json();
    })
    .then(function(kullanicilar) {
      durumMesaji.textContent = "Veriler başarıyla getirildi.";

      kullanicilar.forEach(function(kullanici) {
        const kart = document.createElement("div");
        kart.classList.add("kullanici-karti");

        kart.innerHTML = `
          <h3>${kullanici.name}</h3>
          <p><strong>Email:</strong> ${kullanici.email}</p>
          <p><strong>Şehir:</strong> ${kullanici.address.city}</p>
          <p><strong>Şirket:</strong> ${kullanici.company.name}</p>
        `;

        kullaniciListesi.appendChild(kart);
      });
    })
    .catch(function(hata) {
      durumMesaji.textContent = "Veriler alınırken bir hata oluştu.";
      console.log(hata);
    });
});