const API = "https://madurasmart-backend.vercel.app";

let username = localStorage.getItem("username");

if (!username) {
  window.location.href = "login.html";
}
let username =
localStorage.getItem("username");

if (!username) {
  window.location.href =
  "login.html";
}

document.getElementById(
  "namaUser"
).innerText = username;

function logout() {
  localStorage.removeItem(
    "username"
  );

  window.location.href =
    "login.html";
}

function toggleSidebar() {
  document
    .getElementById("sidebar")
    .classList
    .toggle("show");
}



async function loadDashboard() {
  try {
    const res = await fetch(`${API}/api/stok/${username}`);
    const stok = await res.json();

    // ===== TOTAL STOK =====
    let totalStok = stok.reduce((a, b) => a + (b.jumlah || 0), 0);

    // ===== TOTAL PROFIT =====
    let totalProfit = stok.reduce((a, b) => a + (b.profit || 0), 0);

    // ===== ALERT STOK (<=5) =====
    let stokMenipis = stok.filter(s => s.jumlah <= 5).length;

    // ===== RENDER KE UI =====
    document.getElementById("saldoPiutang").innerText = "IDR. " + totalProfit;
    document.getElementById("alertStok").innerText = stokMenipis + " Stok";

    // STATUS KASIR SIMPLE
    document.getElementById("statusKasir").innerText =
      stok.length > 0 ? "Aktif" : "Belum Ada";

    // CHART UPDATE
    updateChart(stok);

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

let chart;

function updateChart(stok) {

  let dataMingguan = [0,0,0,0,0,0,0];

  stok.forEach(item => {
    let hari = new Date(item.tanggal).getDay();

    // 0 = Minggu, 1 = Senin ...
    dataMingguan[hari] += item.jumlah;
  });

  if (chart) chart.destroy();

  chart = new Chart(
    document.getElementById("chartPenjualan"),
    {
      type: "bar",
      data: {
        labels: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"],
        datasets: [{
          label: "Penjualan",
          data: dataMingguan,
          backgroundColor: "#b11217",
          borderRadius: 10
        }]
      }
    }
  );
}

function updateInfo(stok) {

  let hariIni = new Date().toISOString().split("T")[0];

  let transaksiHariIni = stok.filter(s => s.tanggal === hariIni).length;

  document.getElementById("aktivitasHariIni").innerText =
    `• Aktivitas Hari Ini: ${transaksiHariIni} Transaksi Berhasil`;

  let total = stok.reduce((a,b)=>a + (b.jumlah*b.harga || 0),0);

  document.getElementById("totalTransaksi").innerText =
    "IDR. " + total;
}

loadDashboard();