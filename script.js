const API_URL = "https://script.google.com/macros/s/AKfycbzaHaFXmw_MWqW2gG5b5QTTipn3dQn7RfU6axSN76p7KqyF24O90V1RlqnxgEeVk4CZhw/exec";

function cek() {
  const no = document.getElementById("no").value.trim();
  if (!no) {
    alert("Nomor pembayaran wajib diisi");
    return;
  }

  // tampilkan loading
  document.getElementById("loading").classList.add("show");
  document.getElementById("hasil").style.display = "none";

  fetch(`${API_URL}?no=${encodeURIComponent(no)}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("loading").classList.remove("show");

      if (data.error) {
        alert(data.error);
        return;
      }

      render(data);
    })
    .catch(() => {
      document.getElementById("loading").classList.remove("show");
      alert("Gagal mengambil data. Silakan coba lagi.");
    });
}

function render(d) {
  const el = document.getElementById("hasil");
  el.style.display = "block";

  el.innerHTML = `
    <div id="area-cetak" class="card-hasil">
      <h2>Bukti Pembayaran Santri</h2>

      <table class="info">
        <tr><td>Nomor</td><td>${d.no}</td></tr>
        <tr><td>Nama</td><td>${d.nama}</td></tr>
        <tr><td>Alamat</td><td>${d.alamat}</td></tr>
        <tr><td>Asrama</td><td>${d.asrama}</td></tr>
        <tr>
          <td>Status</td>
          <td class="${d.keterangan === 'LUNAS' ? 'lunas' : 'belum'}">
            ${d.keterangan}
          </td>
        </tr>
      </table>

      <table class="detail">
        <thead>
          <tr>
            <th>Jenis Pembayaran</th>
            <th>Nominal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${d.rincian.map(r => `
            <tr>
              <td>${r.nama}</td>
              <td>Rp ${r.nominal.toLocaleString("id-ID")}</td>
              <td class="${r.status === 'LUNAS' ? 'lunas' : 'belum'}">${r.status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="rekap">
        <div class="box hijau">
          <span>Total Terbayar</span>
          <strong>Rp ${d.totalTerbayar.toLocaleString("id-ID")}</strong>
        </div>
        <div class="box merah">
          <span>Sisa Tanggungan</span>
          <strong>Rp ${d.totalBelum.toLocaleString("id-ID")}</strong>
        </div>
      </div>
    </div>

    <button class="btn-print" onclick="cetakPDF()">Cetak / Simpan PDF</button>
  `;
}

function cetakPDF() {
  html2pdf().from(document.getElementById("area-cetak")).set({
    filename: "bukti-pembayaran-santri.pdf",
    margin: 10,
    jsPDF: { format: "a4", orientation: "portrait" }
  }).save();
}

