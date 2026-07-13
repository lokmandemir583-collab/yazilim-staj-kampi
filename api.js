const veriGetirBtn = document.getElementById("veriGetirBtn");
const aramaInput = document.getElementById("aramaInput");
const durumMesaji = document.getElementById("durumMesaji");
const kullaniciListesi = document.getElementById("kullaniciListesi");

const userIdInput = document.getElementById("userIdInput");
const postBaslikInput = document.getElementById("postBaslikInput");
const postMetinInput = document.getElementById("postMetinInput");
const postGonderBtn = document.getElementById("postGonderBtn");
const postSonucMesaji = document.getElementById("postSonucMesaji");

const deletePostIdInput = document.getElementById("deletePostIdInput");
const deletePostBtn = document.getElementById("deletePostBtn");
const deleteSonucMesaji = document.getElementById("deleteSonucMesaji");

const kaydedilenPostListesi = document.getElementById("kaydedilenPostListesi");

let kullanicilar = [];

let kaydedilenPostlar = JSON.parse(localStorage.getItem("kaydedilenPostlar")) || [];

function kaydedilenPostlariKaydet() {
  localStorage.setItem("kaydedilenPostlar", JSON.stringify(kaydedilenPostlar));
}

function yeniLocalPostIdOlustur() {
  if (kaydedilenPostlar.length === 0) {
    return 1;
  }

  const enBuyukId = Math.max(...kaydedilenPostlar.map(function(post) {
    return post.id;
  }));

  return enBuyukId + 1;
}

function kaydedilenPostlariEkranaYaz() {
  kaydedilenPostListesi.innerHTML = "";

  if (kaydedilenPostlar.length === 0) {
    kaydedilenPostListesi.innerHTML =
      '<p class="local-bos-mesaj">Henüz kaydedilen gönderi yok.</p>';
    return;
  }

  kaydedilenPostlar.forEach(function(post) {
    const postKart = document.createElement("div");
    postKart.classList.add("local-post-karti");

    postKart.innerHTML = `
      <h3>${post.title}</h3>
      <p><strong>Local ID:</strong> ${post.id}</p>
      <p><strong>API ID:</strong> ${post.apiId}</p>
      <p><strong>Kullanıcı ID:</strong> ${post.userId}</p>
      <p>${post.body}</p>

      <button class="local-duzenle-btn">PATCH ile Düzenle</button>
      <button class="local-put-btn">PUT ile Tam Güncelle</button>
      <button class="local-sil-btn">Bu Gönderiyi Sil</button>
    `;

    const localDuzenleBtn = postKart.querySelector(".local-duzenle-btn");
    const localPutBtn = postKart.querySelector(".local-put-btn");
    const localSilBtn = postKart.querySelector(".local-sil-btn");

    localDuzenleBtn.addEventListener("click", async function() {
      const yeniBaslik = prompt("Yeni başlığı yaz:", post.title);

      if (yeniBaslik === null) {
        return;
      }

      const yeniMetin = prompt("Yeni gönderi metnini yaz:", post.body);

      if (yeniMetin === null) {
        return;
      }

      const temizBaslik = yeniBaslik.trim();
      const temizMetin = yeniMetin.trim();

      if (temizBaslik === "" || temizMetin === "") {
        postSonucMesaji.textContent = "Başlık ve metin boş bırakılamaz.";
        return;
      }

      postSonucMesaji.textContent = "Gönderi PATCH ile güncelleniyor...";

      try {
        const cevap = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.apiId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: temizBaslik,
            body: temizMetin
          })
        });

        if (!cevap.ok) {
          throw new Error("Gönderi PATCH ile güncellenemedi.");
        }

        const sonuc = await cevap.json();

        kaydedilenPostlar = kaydedilenPostlar.map(function(kayitliPost) {
          if (kayitliPost.id === post.id) {
            return {
              ...kayitliPost,
              title: temizBaslik,
              body: temizMetin
            };
          }

          return kayitliPost;
        });

        kaydedilenPostlariKaydet();
        kaydedilenPostlariEkranaYaz();

        postSonucMesaji.textContent =
          post.id + " Local ID numaralı gönderi PATCH ile güncellendi.";

        console.log("PATCH API cevabı:", sonuc);
      } catch (hata) {
        postSonucMesaji.textContent = "Gönderi PATCH ile güncellenirken hata oluştu.";
        console.log(hata);
      }
    });

    localPutBtn.addEventListener("click", async function() {
      const yeniUserId = prompt("Yeni kullanıcı ID yaz:", post.userId);

      if (yeniUserId === null) {
        return;
      }

      const yeniBaslik = prompt("Yeni başlığı yaz:", post.title);

      if (yeniBaslik === null) {
        return;
      }

      const yeniMetin = prompt("Yeni gönderi metnini yaz:", post.body);

      if (yeniMetin === null) {
        return;
      }

      const temizUserId = yeniUserId.trim();
      const temizBaslik = yeniBaslik.trim();
      const temizMetin = yeniMetin.trim();

      if (temizUserId === "" || temizBaslik === "" || temizMetin === "") {
        postSonucMesaji.textContent = "Kullanıcı ID, başlık ve metin boş bırakılamaz.";
        return;
      }

      postSonucMesaji.textContent = "Gönderi PUT ile tamamen güncelleniyor...";

      const tamamenGuncellenenPost = {
        id: post.apiId,
        userId: Number(temizUserId),
        title: temizBaslik,
        body: temizMetin
      };

      try {
        const cevap = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.apiId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(tamamenGuncellenenPost)
        });

        if (!cevap.ok) {
          throw new Error("Gönderi PUT ile güncellenemedi.");
        }

        const sonuc = await cevap.json();

        kaydedilenPostlar = kaydedilenPostlar.map(function(kayitliPost) {
          if (kayitliPost.id === post.id) {
            return {
              ...kayitliPost,
              userId: Number(temizUserId),
              title: temizBaslik,
              body: temizMetin
            };
          }

          return kayitliPost;
        });

        kaydedilenPostlariKaydet();
        kaydedilenPostlariEkranaYaz();

        postSonucMesaji.textContent =
          post.id + " Local ID numaralı gönderi PUT ile tamamen güncellendi.";

        console.log("PUT API cevabı:", sonuc);
      } catch (hata) {
        postSonucMesaji.textContent = "Gönderi PUT ile güncellenirken hata oluştu.";
        console.log(hata);
      }
    });

    localSilBtn.addEventListener("click", function() {
      kaydedilenPostlar = kaydedilenPostlar.filter(function(kayitliPost) {
        return kayitliPost.id !== post.id;
      });

      kaydedilenPostlariKaydet();
      kaydedilenPostlariEkranaYaz();

      deleteSonucMesaji.textContent =
        post.id + " Local ID numaralı gönderi kaydedilenlerden silindi.";
    });

    kaydedilenPostListesi.appendChild(postKart);
  });
}

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

postGonderBtn.addEventListener("click", async function() {
  const userId = userIdInput.value.trim();
  const baslik = postBaslikInput.value.trim();
  const metin = postMetinInput.value.trim();

  if (userId === "" || baslik === "" || metin === "") {
    postSonucMesaji.textContent = "Lütfen tüm alanları doldur.";
    return;
  }

  postSonucMesaji.textContent = "Gönderi API’ye gönderiliyor...";

  const yeniGonderi = {
    userId: Number(userId),
    title: baslik,
    body: metin
  };

  try {
    const cevap = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(yeniGonderi)
    });

    if (!cevap.ok) {
      throw new Error("Gönderi oluşturulamadı.");
    }

    const sonuc = await cevap.json();

    const kaydedilecekGonderi = {
      id: yeniLocalPostIdOlustur(),
      apiId: sonuc.id,
      userId: Number(userId),
      title: baslik,
      body: metin
    };

    kaydedilenPostlar.push(kaydedilecekGonderi);
    kaydedilenPostlariKaydet();
    kaydedilenPostlariEkranaYaz();

    postSonucMesaji.textContent =
      "Gönderi API’ye gönderildi ve tarayıcıya kaydedildi. Local ID: " +
      kaydedilecekGonderi.id;

    userIdInput.value = "";
    postBaslikInput.value = "";
    postMetinInput.value = "";

    console.log("API cevabı:", sonuc);
    console.log("Tarayıcıya kaydedilen gönderi:", kaydedilecekGonderi);
  } catch (hata) {
    postSonucMesaji.textContent = "Gönderi gönderilirken hata oluştu.";
    console.log(hata);
  }
});

deletePostBtn.addEventListener("click", async function() {
  const postId = deletePostIdInput.value.trim();

  if (postId === "") {
    deleteSonucMesaji.textContent = "Lütfen silinecek Local ID değerini yaz.";
    return;
  }

  deleteSonucMesaji.textContent = "Gönderi siliniyor...";

  try {
    const cevap = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: "DELETE"
    });

    if (!cevap.ok) {
      throw new Error("Gönderi silinemedi.");
    }

    const postIdNumber = Number(postId);

    const oncekiUzunluk = kaydedilenPostlar.length;

    kaydedilenPostlar = kaydedilenPostlar.filter(function(post) {
      return post.id !== postIdNumber;
    });

    kaydedilenPostlariKaydet();
    kaydedilenPostlariEkranaYaz();

    deletePostIdInput.value = "";

    if (kaydedilenPostlar.length < oncekiUzunluk) {
      deleteSonucMesaji.textContent =
        postId + " Local ID numaralı gönderi kaydedilenlerden silindi.";
    } else {
      deleteSonucMesaji.textContent =
        "API’ye silme isteği gönderildi fakat bu Local ID ile kayıtlı gönderi bulunamadı.";
    }

    console.log("Silme işlemi başarılı:", cevap);
  } catch (hata) {
    deleteSonucMesaji.textContent = "Gönderi silinirken hata oluştu.";
    console.log(hata);
  }
});

kaydedilenPostlariEkranaYaz();