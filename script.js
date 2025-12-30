<script>
function cek() {
  const no = document.getElementById("no").value.trim();

  if (!no) {
    alert("Masukkan No Pembayaran");
    return;
  }

  const url = "https://script.google.com/macros/s/AKfycbxoGr7rhUBHaf4xQCp1i7Qj2jSio3e8vGJtlDDzZQmHj6inf0fzGHcPDZZpoTzuM-FkNg/exec?no=" + encodeURIComponent(no);

  fetch(url)
    .then(r => r.json())
    .then(d => {

      // 🔴 Jika data tidak ditemukan
      if (d.error) {
        alert(d.error);
        document.getElementById("card").style.display = "none";
        return;
      }

      // 🔗 Ambil elemen
      const vno = document.getElementById("vno");
      const vnama = document.getElementById("vnama");
      const valamat = document.getElementById("valamat");
      const vasrama = document.getElementById("vasrama");
      const vstatus = document.getElementById("vstatus");
      const vtagihan = document.getElementById("vtagihan");
      const vket = document.getElementById("vket");
      const tbody = document.getElementById("tbody");
      const vbayar = document.getElementById("vbayar");
      const vsisa = document.getElementById("vsisa");

      document.getElementById("card").style.display = "block";

      // 🔹 Data utama
      vno.innerText = d.no;
      vnama.innerText = d.nama;
      valamat.innerText = d.alamat;
      vasrama.innerText = d.asrama;
      vstatus.innerText = d.statusSantri || "-";

      vtagihan.innerText = "Rp " + (d.tagihan || 0).toLocaleString("id-ID");
      vket.innerText = d.keterangan;
      vket.className = d.keterangan === "LUNAS" ? "lunas" : "belum";

      // 🔹 Rincian pembayaran
      tbody.innerHTML = "";
      d.rincian.forEach(r => {
        tbody.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>Rp ${(r.nominal || 0).toLocaleString("id-ID")}</td>
            <td class="${r.status === "LUNAS" ? "lunas" : "belum"}">${r.status}</td>
          </tr>
        `;
      });

      // 🔹 Rekap
      vbayar.innerText = "Rp " + (d.totalTerbayar || 0).toLocaleString("id-ID");
      vsisa.innerText = "Rp " + (d.totalBelum || 0).toLocaleString("id-ID");

    })
    .catch(err => {
      alert("Gagal mengambil data");
      console.error(err);
    });
}
</script>
