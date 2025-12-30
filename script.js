// 🔍 Penanda file berhasil dimuat
console.log("script.js loaded");

// ⬇️ WAJIB GLOBAL (jangan dibungkus function lain)
function cek() {
  console.log("fungsi cek() terpanggil");

  const noInput = document.getElementById("no");
  if (!noInput) {
    alert("Input NO tidak ditemukan");
    return;
  }

  const no = noInput.value.trim();
  if (!no) {
    alert("Masukkan Nomor Pembayaran");
    return;
  }

  const url =
    "https://script.google.com/macros/s/AKfycbxoGr7rhUBHaf4xQCp1i7Qj2jSio3e8vGJtlDDzZQmHj6inf0fzGHcPDZZpoTzuM-FkNg/exec"
    + "?no=" + encodeURIComponent(no);

  fetch(url, {
    method: "GET",
    redirect: "follow"
  })
  .then(res => res.text())
  .then(text => {
    let d;
    try {
      d = JSON.parse(text);
    } catch (e) {
      alert("Respon server tidak valid");
      console.error(text);
      return;
    }

    if (d.error) {
      alert(d.error);
      return;
    }

    // 🔓 Tampilkan kartu
    document.getElementById("card").style.display = "block";

    document.getElementById("vno").innerText = d.no || "-";
    document.getElementById("vnama").innerText = d.nama || "-";
    document.getElementById("valamat").innerText = d.alamat || "-";
    document.getElementById("vasrama").innerText = d.asrama || "-";
    document.getElementById("vstatus").innerText = d.statusSantri || "-";

    document.getElementById("vtagihan").innerText =
      "Rp " + (d.tagihan || 0).toLocaleString("id-ID");

    const vket = document.getElementById("vket");
    vket.innerText = d.keterangan || "-";
    vket.className = d.keterangan === "LUNAS" ? "lunas" : "belum";

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    d.rincian.forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.nama}</td>
          <td>Rp ${(r.nominal || 0).toLocaleString("id-ID")}</td>
          <td class="${r.status === "LUNAS" ? "lunas" : "belum"}">${r.status}</td>
        </tr>`;
    });

    document.getElementById("vbayar").innerText =
      "Rp " + (d.totalTerbayar || 0).toLocaleString("id-ID");

    document.getElementById("vsisa").innerText =
      "Rp " + (d.totalBelum || 0).toLocaleString("id-ID");
  })
  .catch(err => {
    alert("Gagal menghubungi server");
    console.error(err);
  });
}
