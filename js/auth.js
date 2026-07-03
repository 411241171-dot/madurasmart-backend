
const API =
"https://madurasmart-backend.vercel.app";

document
.getElementById("loginForm")
.addEventListener("submit", async function(e){

  e.preventDefault();

  const username =
  document.getElementById("username").value;

  const password =
  document.getElementById("password").value;

  try{

    const response =
    await fetch(`${API}/api/login`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username,
        password
      })
    });

    const data =
    await response.json();

    if(data.success){

      localStorage.setItem(
        "username",
        data.username
      );

      window.location.href =
      "dashboard.html";
    }
    else{
      alert(data.message);
    }

  }
  catch(err){
    alert("Server tidak dapat dihubungi.");
  }

});