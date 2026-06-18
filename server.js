const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Biar file HTML/CSS/JS bisa dibuka
app.use(express.static(__dirname));

// Halaman utama buka login.html
app.get("/tes", (req, res) => {
  res.send("SERVER INI YANG JALAN");
});
// KONEKSI DATABASE
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://madurasmart:madurasmart@madurasmart.dzvbiqx.mongodb.net/MaduraSmart?retryWrites=true&w=majority&appName=MaduraSmart";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// SCHEMA USER
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const StokSchema = new mongoose.Schema({
  username: String,
  tanggal: String,
  kode: String,
  namaBarang: String,
  harga: Number,
  jumlah: Number,
  profit: Number
});

const Stok = mongoose.models.Stok || mongoose.model("Stok", StokSchema);
// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi!",
      });
    }

    const userAda = await User.findOne({ username });

    if (userAda) {
      return res.status(400).json({
        success: false,
        message: "Username sudah terdaftar!",
      });
    }

    const userBaru = new User({ username, password });
    await userBaru.save();

    return res.status(201).json({
      success: true,
      message: "Registrasi sukses!",
    });
    } catch (error) {
    console.log("REGISTER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "ERROR ASLI: " + error.message,
    });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userDitemukan = await User.findOne({ username, password });

    if (!userDitemukan) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      username: userDitemukan.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error saat login!",
    });
  }
});
app.get("/api/stok/:username", async (req, res) => {
  const stok = await Stok.find({ username: req.params.username });
  res.json(stok);
});

app.post("/api/stok", async (req, res) => {
  try {
    const { username, tanggal, kode, namaBarang, harga, jumlah, profit } = req.body;

    const barangAda = await Stok.findOne({ username, kode });

    if (barangAda) {
      barangAda.jumlah += jumlah;
      barangAda.harga = harga;
      barangAda.profit += profit;
      barangAda.tanggal = tanggal;
      barangAda.namaBarang = namaBarang;
      await barangAda.save();
    } else {
      await Stok.create({ username, tanggal, kode, namaBarang, harga, jumlah, profit });
    }

    res.json({ success: true, message: "Stok berhasil disimpan ke database." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Untuk jalan lokal di laptop
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
  });
}

module.exports = app;