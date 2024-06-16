const data = [];

function createAndFillTable() {
    $("#instrumentType").empty();
    $("#currency").empty();

    const instrumentTypes = new Set();
    const currencies = new Set();
    const table = $("#stockTable");

    for (var i = 0; i < data.length; i++) {
        const symbol = data[i];
        const row = $("<tr></tr>").appendTo(table);
        row.addClass("sec_id");

        let long_avaliable = symbol.long_avaliable === '+' ? (100 / parseFloat(symbol.initial_margin_risk_rates.long)).toFixed(2) : 0;
        let short_avaliable = symbol.short_avaliable === '+' ? (100 / parseFloat(symbol.initial_margin_risk_rates.short)).toFixed(2) : 0;

        $("<td></td>").html(symbol.code).appendTo(row);
        $("<td></td>").html(long_avaliable).appendTo(row);
        $("<td></td>").html(short_avaliable).appendTo(row);
        $("<td></td>").html(symbol.type).appendTo(row);
        $("<td></td>").html(symbol.risk_rate_currency).appendTo(row);
        $("<td></td>").html(symbol.symbol).appendTo(row);
        $("<td></td>").html(symbol.issuer).appendTo(row);
        $("<td></td>").html(symbol.base_code).appendTo(row);
        $("<td></td>").html(symbol.ISIN).appendTo(row);

        instrumentTypes.add(symbol.type);
        currencies.add(symbol.risk_rate_currency);
    }

    instrumentTypes.forEach(type => {
        $("#instrumentType").append(`<option value="${type}">${type}</option>`);
    });

    currencies.forEach(currency => {
        $("#currency").append(`<option value="${currency}">${currency}</option>`);
    });
}

function fetchData() {
    $("#stockTableBody").empty();
    const selectedSource = $('#dataSource').val();
    fetch(selectedSource)
        .then((response) => response.text())
        .then((text) => {
            const page = document.createElement('div');
            page.innerHTML = text;
            const tableRows = page.querySelectorAll('.table-container table tbody tr');
            tableRows.forEach(row => {
                const rowData = {};
                const columns = row.querySelectorAll('td');

                rowData['symbol'] = columns[0].textContent;
                rowData['issuer'] = columns[1].textContent;
                rowData['base_code'] = columns[2].textContent;
                rowData['type'] = columns[3].textContent;
                rowData['code'] = columns[4].textContent;
                rowData['ISIN'] = columns[5].textContent;
                rowData['long_avaliable'] = columns[6].textContent;
                rowData['short_avaliable'] = columns[7].textContent;
                rowData['risk_rate_currency'] = columns[8].textContent;
                rowData['initial_margin_risk_rates'] = {
                    'long': columns[9].textContent,
                    'short': columns[10].textContent
                };
                rowData['initial margin reserve rates'] = {
                    'long': columns[11].textContent,
                    'short': columns[12].textContent
                };
                data.push(rowData);
            });
            data.sort((a, b) => {
                if (a.code < b.code) {
                    return -1;
                }
                if (a.code > b.code) {
                    return 1;
                }
                return 0;
            });
            createAndFillTable()
        });
}

function applyFilters() {
    const searchText = $('#searchInput').val().toLowerCase();
    const selectedType = $('#instrumentType').val().toLowerCase();
    const selectedCurrency = $('#currency').val().toLowerCase();

    $('.sec_id').each(function() {
        const tickerText = $(this).find('td:first').text().toLowerCase();
        const typeText = $(this).find('td:nth-child(4)').text().toLowerCase();
        const currencyText = $(this).find('td:nth-child(5)').text().toLowerCase();
        if ((tickerText.includes(searchText) || searchText === "") &&
            (typeText.includes(selectedType) || selectedType === "") &&
            (currencyText.includes(selectedCurrency) || selectedCurrency === "")) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

$('#dataSource').on('change', fetchData);

$('#searchInput, #instrumentType, #currency').on('input', applyFilters);

fetchData()
