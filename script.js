const API_URL = "https://script.google.com/macros/s/AKfycbzaHaFXmw_MWqW2gG5b5QTTipn3dQn7RfU6axSN76p7KqyF24O90V1RlqnxgEeVk4CZhw/exec";

function cek() {
  const no = document.getElementById("no").value.trim();
  if (!no) {
    alert("Masukkan nomor pembayaran");
    return;
  }

  fetch(`${API_URL}?no=${encodeURIComponent(no)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }
      tampilkan(data);
    })
    .catch(err => {
      console.error(err);
      alert("Gagal mengambil data");
    });
}

function tampilkan(d) {
  document.getElementById("hasil").style.display = "block";

  document.getElementById("hasil").innerHTML = `
    <div id="area-cetak">
      <h3>Bukti Pembayaran Santri</h3>

      <table class="info">
        <tr><td>Nomor</td><td>: ${d.no}</td></tr>
        <tr><td>Nama</td><td>: ${d.nama}</td></tr>
        <tr><td>Alamat</td><td>: ${d.alamat}</td></tr>
        <tr><td>Asrama</td><td>: ${d.asrama}</td></tr>
        <tr><td>Status</td><td>: ${d.keterangan}</td></tr>
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
              <td class="${r.status === "LUNAS" ? "lunas" : "belum"}">${r.status}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <table class="rekap">
        <tr class="hijau">
          <td>Total Terbayar</td>
          <td>Rp ${d.totalTerbayar.toLocaleString("id-ID")}</td>
        </tr>
        <tr class="merah">
          <td>Sisa Tanggungan</td>
          <td>Rp ${d.totalBelum.toLocaleString("id-ID")}</td>
        </tr>
      </table>
    </div>

    <button onclick="cetakPDF()">🖨 Cetak / Simpan PDF</button>
  `;
}

function cetakPDF() {
  const element = document.getElementById("area-cetak");

  html2pdf().set({
    margin: 10,
    filename: "bukti-pembayaran-santri.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { format: "a4", orientation: "portrait" }
  }).from(element).save();
}
