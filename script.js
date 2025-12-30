function cek() {
  const no = document.getElementById("no").value;
  const url = "https://script.google.com/macros/s/AKfycbxoGr7rhUBHaf4xQCp1i7Qj2jSio3e8vGJtlDDzZQmHj6inf0fzGHcPDZZpoTzuM-FkNg/exec" + no;

  fetch(url)
  .then(r=>r.json())
  .then(d=>{
    document.getElementById("card").style.display="block";
    vno.innerText=d.no;
    vnama.innerText=d.nama;
    valamat.innerText=d.alamat;
    vasrama.innerText=d.asrama;
    vstatus.innerText=d.status;
    vtagihan.innerText="Rp "+d.tagihan.toLocaleString();
    vket.innerText=d.keterangan;
    vket.className=d.keterangan==="LUNAS"?"lunas":"belum";

    tbody.innerHTML="";
    d.rincian.forEach(r=>{
      tbody.innerHTML+=`
      <tr>
        <td>${r.nama}</td>
        <td>Rp ${r.nominal.toLocaleString()}</td>
        <td class="${r.status==="LUNAS"?"lunas":"belum"}">${r.status}</td>
      </tr>`;
    });

    vbayar.innerText="Rp "+d.totalTerbayar.toLocaleString();
    vsisa.innerText="Rp "+d.totalBelum.toLocaleString();
  });
}


