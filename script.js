function dummyAlert() {
  alert("Fitur ini masih dalam tahap prototype.");
}
function tambahStok() {
  document.getElementById("popupInputBarang").style.display = "flex";
}

function tutupInputBarang() {
  document.getElementById("popupInputBarang").style.display = "none";
}

function simpanStokBaru() {
  let tanggal = new Date().toISOString().slice(0,10);

  let kode = document.getElementById("kodeBarang").value;
  let namaBarang = document.getElementById("namaBarang").value;
  let harga = parseInt(document.getElementById("hargaBarang").value);
  let jumlah = parseInt(document.getElementById("jumlahBarang").value);
  let profit = parseInt(document.getElementById("profitBarang").value);

  if (!kode || !namaBarang || isNaN(harga) || isNaN(jumlah) || isNaN(profit)) {
    tampilPopup("Gagal!", "Data stok tidak boleh kosong.");
    return;
  }

  stokBarang.push({
    tanggal,
    kode,
    namaBarang,
    harga,
    jumlah,
    profit
  });

  simpanData();
  tampilStok();
  tutupInputBarang();

  tampilPopup("Berhasil!", "Stok berhasil ditambahkan.");
}