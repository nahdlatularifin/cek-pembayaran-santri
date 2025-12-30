function cek() {
  const no = document.getElementById("no").value.trim();
  if (!no) {
    alert("Masukkan Nomor Pembayaran");
    return;
  }

  const url = "https://script.google.com/macros/s/AKfycbzaHaFXmw_MWqW2gG5b5QTTipn3dQn7RfU6axSN76p7KqyF24O90V1RlqnxgEeVk4CZhw/exec" + encodeURIComponent(no);

  fetch(url)
    .then(res => res.json())
    .then(d => {
      if (d.error) {
        alert(d.error);
        return;
      }

      document.getElementById("card").style.display = "block";

      vno.innerText = d.no;
      vnama.innerText = d.nama;
      valamat.innerText = d.alamat;
      vasrama.innerText = d.asrama;
      vstatus.innerText = d.statusSantri;
      vtagihan.innerText = "Rp " + d.tagihan.toLocaleString("id-ID");

      vket.innerText = d.keterangan;
      vket.className = d.keterangan === "LUNAS" ? "lunas" : "belum";

      tbody.innerHTML = "";
      d.rincian.forEach(r => {
        tbody.innerHTML += `
          <tr>
            <td>${r.nama}</td>
            <td>Rp ${r.nominal.toLocaleString("id-ID")}</td>
            <td class="${r.status === "LUNAS" ? "lunas" : "belum"}">${r.status}</td>
          </tr>
        `;
      });

      vbayar.innerText = "Rp " + d.totalTerbayar.toLocaleString("id-ID");
      vsisa.innerText = "Rp " + d.totalBelum.toLocaleString("id-ID");
    })
    .catch(() => alert("Gagal mengambil data"));
}

