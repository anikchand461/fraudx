document.getElementById("analyzeBtn").addEventListener("click", checkWallet);

async function checkWallet() {
  const wallet = document.getElementById("wallet").value.trim();
  if (!wallet) return;

  const btn = document.getElementById("analyzeBtn");
  const resultEl = document.getElementById("result");
  const scoreValue = document.getElementById("scoreValue");
  const scoreBar = document.getElementById("scoreBar");
  const statusText = document.getElementById("statusText");

  // Loading state
  btn.classList.add("loading");
  btn.querySelector(".btn-text").textContent = "SCANNING";
  btn.disabled = true;
  resultEl.classList.add("hidden");

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });

    const data = await response.json();
    const score = data.risk_score;

    // Determine color & status
    let color, status;
    if (score >= 75) {
      color = "#ff3b5c";
      status = "[!!] HIGH RISK — FLAGGED";
    } else if (score >= 40) {
      color = "#ffb020";
      status = "[~~] MODERATE — REVIEW ADVISED";
    } else {
      color = "#00e59b";
      status = "[OK] LOW RISK — LOOKS CLEAN";
    }

    // Show result
    resultEl.classList.remove("hidden");
    scoreValue.textContent = score;
    scoreValue.style.color = color;
    scoreBar.style.width = score + "%";
    scoreBar.style.background = `linear-gradient(to right, ${color}88, ${color})`;
    scoreBar.style.boxShadow = `0 0 8px ${color}88`;
    statusText.textContent = status;
    statusText.style.color = color;
  } catch (err) {
    resultEl.classList.remove("hidden");
    scoreValue.textContent = "ERR";
    scoreValue.style.color = "#ff3b5c";
    scoreBar.style.width = "0%";
    statusText.textContent = "Connection failed";
    statusText.style.color = "#ff3b5c";
  } finally {
    btn.classList.remove("loading");
    btn.querySelector(".btn-text").textContent = "ANALYZE";
    btn.disabled = false;
  }
}
