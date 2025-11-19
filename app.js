
  const btn = document.getElementById("toggleColorBtn");
  let isBlue = false;

  btn.addEventListener("click", () => {
    document.body.style.backgroundColor = isBlue ? "white" : "black";
    isBlue = !isBlue;
  });

