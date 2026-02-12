async function loadAllRowsAndDownloadCSV() {

    let screener_table = document.querySelector("div#screener-table")

    while (true) {

        screener_table.scrollTop = screener_table.scrollHeight;
        await new Promise(r => setTimeout(r, 3000)); // wait for scroll animation

        screener_table.scrollTop = screener_table.scrollHeight;
        await new Promise(r => setTimeout(r, 3000)); // wait for scroll animation

        let loadMoreBtn = document.querySelector("button.secondary.regular.full-width.button-root");
        if (!loadMoreBtn) break; // no more button, exit loop

        loadMoreBtn.click();
        await new Promise(r => setTimeout(r, 10000)); // wait for rows to load

        screener_table.scrollTop = screener_table.scrollHeight;
        await new Promise(r => setTimeout(r, 3000)); // wait for scroll animation

        screener_table.scrollTop = screener_table.scrollHeight;
        await new Promise(r => setTimeout(r, 3000)); // wait for scroll animation
    }


    let table = document.querySelector("div#screener-table table");
    let rows = Array.from(table.querySelectorAll("tr"));
    let stockNameIndex = -1;
    for (let row of rows) {
        let cells = Array.from(row.querySelectorAll("td, th"));
        let index = cells.findIndex(cell => cell.querySelector(".stock-name"));
        if (index !== -1) {
            stockNameIndex = index;
            break;
        }
    }

    let csv = rows.map(row => {
        let cells = Array.from(row.querySelectorAll("td, th"));
        return cells.flatMap((cell, i) => {
            if (i === stockNameIndex) {
                let stockNameEl = cell.querySelector(".stock-name");
                if (stockNameEl) {
                    let ticker = stockNameEl.innerText.trim();
                    let nameEl = cell.querySelector(".desktop--only");
                    let name = nameEl ? nameEl.innerText.trim() : cell.innerText.replace(ticker, "").trim();
                    return [`"${name.replace(/"/g, '""')}"`, `"${ticker.replace(/"/g, '""')}"`];
                } else if (cell.tagName.toLowerCase() === "th") {
                    return [`"${cell.innerText.replace(/"/g, '""')}"`, '"Ticker"'];
                } else {
                    return [`"${cell.innerText.replace(/"/g, '""')}"`, '""'];
                }
            }
            return `"${cell.innerText.replace(/"/g, '""')}"`;
        }).join(",");
    }).join("\n");


    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("CSV download started!");
}

loadAllRowsAndDownloadCSV();
