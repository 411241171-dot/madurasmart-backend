
const API =
"https://madurasmart-backend.vercel.app";

document
.getElementById("registerForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const username =
    document.getElementById("username").value.trim();

  const password =
    document.getElementById("password").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    alert("Semua data wajib diisi.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Konfirmasi password tidak sesuai.");
    return;
  }

  try {

    const response =
      await fetch(`${API}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

    const data =
      await response.json();

    if (data.success) {

      alert("Registrasi berhasil.");

      window.location.href =
        "login.html";

    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error(error);
    alert("Server tidak dapat dihubungi.");
  }

});