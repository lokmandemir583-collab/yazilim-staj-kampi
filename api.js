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
      <button class="post-btn">Gönderileri Göster</button>

      <div class="detay-alani" style="display: none;">
        <p><strong>Telefon:</strong> ${kullanici.phone}</p>
        <p><strong>Website:</strong> ${kullanici.website}</p>
        <p><strong>Adres:</strong> ${kullanici.address.street}, ${kullanici.address.suite}</p>
      </div>

      <div class="post-alani" style="display: none;"></div>
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

    const postBtn = kart.querySelector(".post-btn");
    const postAlani = kart.querySelector(".post-alani");

    postBtn.addEventListener("click", async function() {
      if (postAlani.style.display === "block") {
        postAlani.style.display = "none";
        postBtn.textContent = "Gönderileri Göster";
        return;
      }

      postAlani.style.display = "block";
      postAlani.innerHTML = "<p>Gönderiler yükleniyor...</p>";
      postBtn.textContent = "Gönderileri Gizle";

      try {
        const cevap = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${kullanici.id}`);

        if (!cevap.ok) {
          throw new Error("Gönderiler alınamadı.");
        }

        const gonderiler = await cevap.json();

        postAlani.innerHTML = "";

        gonderiler.forEach(function(gonderi) {
          const gonderiKutusu = document.createElement("div");
          gonderiKutusu.classList.add("gonderi-kutusu");

          gonderiKutusu.innerHTML = `
            <h4>${gonderi.title}</h4>
            <p>${gonderi.body}</p>

            <button class="yorum-btn">Yorumları Göster</button>

            <div class="yorum-alani" style="display: none;"></div>
          `;

          const yorumBtn = gonderiKutusu.querySelector(".yorum-btn");
          const yorumAlani = gonderiKutusu.querySelector(".yorum-alani");

          yorumBtn.addEventListener("click", async function() {
            if (yorumAlani.style.display === "block") {
              yorumAlani.style.display = "none";
              yorumBtn.textContent = "Yorumları Göster";
              return;
            }

            yorumAlani.style.display = "block";
            yorumAlani.innerHTML = "<p>Yorumlar yükleniyor...</p>";
            yorumBtn.textContent = "Yorumları Gizle";

            try {
              const cevap = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${gonderi.id}`);

              if (!cevap.ok) {
                throw new Error("Yorumlar alınamadı.");
              }

              const yorumlar = await cevap.json();

              yorumAlani.innerHTML = "";

              yorumlar.forEach(function(yorum) {
                const yorumKutusu = document.createElement("div");
                yorumKutusu.classList.add("yorum-kutusu");

                yorumKutusu.innerHTML = `
                  <p><strong>${yorum.name}</strong></p>
                  <p><strong>Email:</strong> ${yorum.email}</p>
                  <p>${yorum.body}</p>
                `;

                yorumAlani.appendChild(yorumKutusu);
              });
            } catch (hata) {
              yorumAlani.innerHTML = "<p>Yorumlar alınırken hata oluştu.</p>";
              console.log(hata);
            }
          });

          postAlani.appendChild(gonderiKutusu);
        });
      } catch (hata) {
        postAlani.innerHTML = "<p>Gönderiler alınırken hata oluştu.</p>";
        console.log(hata);
      }
    });

    kullaniciListesi.appendChild(kart);
  });
}

veriGetirBtn.addEventListener("click", async function() {
  durumMesaji.textContent = "Veriler yükleniyor...";
  kullaniciListesi.innerHTML = "";
  aramaInput.value = "";

  try {
    const cevap = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!cevap.ok) {
      throw new Error("Kullanıcılar alınamadı.");
    }

    const gelenKullanicilar = await cevap.json();

    kullanicilar = gelenKullanicilar;

    durumMesaji.textContent = "Veriler başarıyla getirildi.";

    kullanicilariEkranaYaz(kullanicilar);
  } catch (hata) {
    durumMesaji.textContent = "Veriler alınırken bir hata oluştu.";
    console.log(hata);
  }
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