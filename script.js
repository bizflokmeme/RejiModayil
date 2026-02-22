  (function () {
    const atmos = document.getElementById("atmos");
    const styleEl = document.createElement("style");
    styleEl.textContent = `@keyframes floatDot{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-15px)}50%{transform:translate(-5px,20px)}75%{transform:translate(-15px,-10px)}}`;
    document.head.appendChild(styleEl);
    for (let i = 0; i < 45; i++) {
      const d  = document.createElement("span");
      const sz = Math.random() * 5 + 1;
      d.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:#d4a373;border-radius:50%;opacity:${Math.random()*0.22+0.05};animation:floatDot ${Math.random()*20+15}s infinite ease-in-out;animation-delay:-${Math.random()*10}s;`;
      atmos.appendChild(d);
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

    // Helper: parse value string like "84.2K", "6,841", "7.6%" → raw number
    function parseVal(str) {
      str = str.trim().replace(/,/g, '');
      if (str.endsWith('%')) return parseFloat(str) || 0;
      if (str.toUpperCase().endsWith('K')) return (parseFloat(str) || 0) * 1000;
      if (str.toUpperCase().endsWith('M')) return (parseFloat(str) || 0) * 1000000;
      return parseFloat(str) || 0;
    }

    // Single source of truth: read initial values from the KPI input fields
    const initData = [
      parseVal(document.getElementById('val-reach').value),
      parseVal(document.getElementById('val-likes').value),
      parseVal(document.getElementById('val-comments').value),
      parseVal(document.getElementById('val-story').value),
      parseVal(document.getElementById('val-engagement').value),
    ];

    const pieChart = new Chart(document.getElementById("pieChart"), {
      type: "doughnut",
      data: {
        labels: ["Reach","Likes","Comments","Story Views","Engagement"],
        datasets: [{
          data: initData,
          backgroundColor: ["#d4a373","#60a5fa","#4ade80","#c084fc","#f97316"],
          borderColor: "#1a1a24",
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        cutout: "68%",
        animation: { duration: 500 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.parsed.toLocaleString()}`
            }
          }
        }
      }
    });

    // Map input IDs to legend IDs and chart data indices
    const fields = [
      { inputId: 'val-reach',      legId: 'leg-reach',      chartIdx: 0 },
      { inputId: 'val-likes',      legId: 'leg-likes',      chartIdx: 1 },
      { inputId: 'val-comments',   legId: 'leg-comments',   chartIdx: 2 },
      { inputId: 'val-story',      legId: 'leg-story',      chartIdx: 3 },
      { inputId: 'val-engagement', legId: 'leg-engagement', chartIdx: 4 },
    ];

    window.syncChart = function() {
      fields.forEach(f => {
        const input = document.getElementById(f.inputId);
        const leg   = document.getElementById(f.legId);
        const val   = input ? input.value : '';
        if (leg) leg.textContent = val;
        pieChart.data.datasets[0].data[f.chartIdx] = parseVal(val);
      });
      pieChart.update();
    };

    // Call once on load so legend matches inputs immediately
    syncChart();

  })();
