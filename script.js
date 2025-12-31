const API_URL = "https://script.google.com/macros/s/AKfycbzaHaFXmw_MWqW2gG5b5QTTipn3dQn7RfU6axSN76p7KqyF24O90V1RlqnxgEeVk4CZhw/exec";

function cek() {
  const no = document.getElementById("no").value.trim();
  if (!no) {
    alert("Masukkan Nomor Pembayaran!");
    return;
  }

  // loading ON
  document.getElementById("loading").style.display = "flex";
  document.getElementById("card").style.display = "none";

  fetch(`${API_URL}?no=${encodeURIComponent(no)}`)
    .then(res => res.json())
    .then(d => {
      document.getElementById("loading").style.display = "none";

      if (d.error) {
        alert(d.error);
        return;
      }

      // tampilkan kartu
      document.getElementById("card").style.display = "block";

      // isi tampilan web
      vno.innerText = d.no;
      vnama.innerText = d.nama;
      valamat.innerText = d.alamat;
      vasrama.innerText = d.asrama;
      vstatus.innerText = d.statusSantri;
      vtagihan.innerText = "Rp " + d.tagihan.toLocaleString();
      vket.innerText = d.keterangan;
      vket.className = d.keterangan === "LUNAS" ? "lunas" : "belum";

      tbody.innerHTML = "";
      d.rincian.forEach(r => {
        tbody.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>Rp ${r.nominal.toLocaleString()}</td>
            <td class="${r.status === "LUNAS" ? "lunas" : "belum"}">${r.status}</td>
          </tr>`;
      });

      vbayar.innerText = "Rp " + d.totalTerbayar.toLocaleString();
      vsisa.innerText = "Rp " + d.totalBelum.toLocaleString();

      // isi data ke AREA CETAK
      isiPDF(d);
    })
    .catch(err => {
      document.getElementById("loading").style.display = "none";
      alert("Gagal mengambil data");
      console.error(err);
    });
}

/* =======================
   ISI DATA UNTUK PDF
======================= */
function isiPDF(d) {
  document.getElementById("pdf-nama").innerText = d.nama;
  document.getElementById("pdf-no").innerText = d.no;
  document.getElementById("pdf-asrama").innerText = d.asrama;
  document.getElementById("pdf-bayar").innerText = "Rp " + d.totalTerbayar.toLocaleString();
  document.getElementById("pdf-sisa").innerText = "Rp " + d.totalBelum.toLocaleString();

  // nomor dokumen unik
  document.getElementById("pdf-doc").innerText =
    "KPS-" + new Date().getTime();

  // tanggal cetak
  document.getElementById("pdf-tanggal").innerText =
    new Date().toLocaleString("id-ID");

  let html = "";
  d.rincian.forEach(r => {
    html += `
      <tr>
        <td>${r.nama}</td>
        <td>Rp ${r.nominal.toLocaleString()}</td>
        <td>${r.status}</td>
      </tr>`;
  });
  document.getElementById("pdf-rincian").innerHTML = html;
}

/* =======================
   CETAK PDF (1 HALAMAN)
======================= */
function cetakPDF() {
  window.print();
}

