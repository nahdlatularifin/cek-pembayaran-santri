const API_URL = "https://script.google.com/macros/s/AKfycbzaHaFXmw_MWqW2gG5b5QTTipn3dQn7RfU6axSN76p7KqyF24O90V1RlqnxgEeVk4CZhw/exec";

function cek() {
  const no = document.getElementById("no").value.trim();
  if (!no) {
    alert("Nomor pembayaran wajib diisi");
    return;
  }

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
      alert("Gagal mengambil data");
    });
}

function render(d) {
  const el = document.getElementById("hasil");
  el.style.display = "block";

  el.innerHTML = `
    <div id="area-cetak" class="card-hasil">
      <h2>Kartu Pembayaran Santri</h2>

      <div class="meta">
        <span id="no-dokumen"></span>
        <span id="tgl-cetak"></span>
      </div>

      <table class="info">
        <tr><td>Nomor</td><td>${d.no}</td></tr>
        <tr><td>Nama</td><td id="nama-santri">${d.nama}</td></tr>
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

    <button class="btn-print" onclick="cetakPDF()">🖨 Cetak / Simpan PDF</button>
  `;

  generateDokumen(d.no);
}

/* ===============================
   NOMOR DOKUMEN & TANGGAL CETAK
   =============================== */
function generateDokumen(noPembayaran) {
  const now = new Date();

  const tanggalCetak = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const ymd =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);
  const noDokumen = `KP-${ymd}-${noPembayaran}-${random}`;

  document.getElementById("no-dokumen").innerText =
    `Nomor Dokumen : ${noDokumen}`;

  document.getElementById("tgl-cetak").innerText =
    `Tanggal Cetak : ${tanggalCetak}`;
}

/* ===============================
   CETAK PDF (1 HALAMAN, AMAN)
   =============================== */
function cetakPDF() {
  const element = document.getElementById("area-cetak");
  const nama = document.getElementById("nama-santri").innerText
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim();

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `kartu pembayaran santri (${nama}).pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: { mode: ["avoid-all"] }
  };

  setTimeout(() => {
    html2pdf().set(opt).from(element).save();
  }, 300);
}
