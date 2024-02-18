// Function to save token details in local storage
function saveTokenDetails() {
    const tokens = document.querySelectorAll('.token');
    const tokenDetails = [];

    tokens.forEach(token => {
        const tokenName = token.querySelector('.tokenName').value;
        const tokenPrice = parseFloat(token.querySelector('.tokenPrice').value);
        const tokenAmount = parseFloat(token.querySelector('.tokenAmount').value);

        tokenDetails.push({ name: tokenName, price: tokenPrice, amount: tokenAmount });
    });

    localStorage.setItem('cryptoPortfolioTokens', JSON.stringify(tokenDetails));

    // Provide feedback that data has been saved
    alert('Token details have been saved successfully!');
}

// Function to load saved token details from local storage (browser)
function loadTokenDetails() {
    const savedTokens = localStorage.getItem('cryptoPortfolioTokens');
    if (savedTokens) {
        const tokensDiv = document.getElementById('tokens');
        const tokenDetails = JSON.parse(savedTokens);

        tokenDetails.forEach(token => {
            const tokenDiv = document.createElement('div');
            tokenDiv.classList.add('token');
            tokenDiv.innerHTML = `
                <label for="tokenName">Token Name:</label>
                <input type="text" class="tokenName" name="tokenName" value="${token.name}">
                <label for="tokenPrice">Entry Price:</label>
                <input type="number" class="tokenPrice" name="tokenPrice" value="${token.price}">
                <label for="tokenAmount">Amount:</label>
                <input type="number" class="tokenAmount" name="tokenAmount" value="${token.amount}">
            `;
            tokensDiv.appendChild(tokenDiv);
        });
    }
}

// Call loadTokenDetails function when the page loads
window.addEventListener('DOMContentLoaded', loadTokenDetails);

// Function to add a new token input field
function addToken() {
    const tokensDiv = document.getElementById('tokens');
    const tokenDiv = document.createElement('div');
    tokenDiv.classList.add('token');
    tokenDiv.innerHTML = `
        <label for="tokenName">Token Name:</label>
        <input type="text" class="tokenName" name="tokenName">
        <label for="tokenPrice">Entry Price:</label>
        <input type="number" class="tokenPrice" name="tokenPrice">
        <label for="tokenAmount">Amount:</label>
        <input type="number" class="tokenAmount" name="tokenAmount">
    `;
    tokensDiv.appendChild(tokenDiv);
}

// Function to update portfolio overview with live prices
async function updatePortfolioOverview() {
    const tokens = document.querySelectorAll('.token');
    const portfolioOverview = document.getElementById('portfolioOverview');
    portfolioOverview.innerHTML = '<h2>Portfolio Overview</h2>';
    
    let totalProfitLoss = 0;

    for (const token of tokens) {
        const tokenName = token.querySelector('.tokenName').value;
        const tokenPrice = parseFloat(token.querySelector('.tokenPrice').value);
        const tokenAmount = parseFloat(token.querySelector('.tokenAmount').value);
// api
        try {
            const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tokenName}&tsyms=USDT`);
            const data = await response.json();

            if (data && data.USDT) {
                const currentPrice = data.USDT;
                const totalValue = tokenAmount * currentPrice;
                const entryValue = tokenAmount * tokenPrice;
                const profitLoss = (totalValue - entryValue).toFixed(2);

                portfolioOverview.innerHTML += `
                    <p>${tokenName}: Entry Value: $${entryValue}, Current Value: $${totalValue}, Profit/Loss: $${profitLoss}, Current Price:$${currentPrice}</p>
                `;

                totalProfitLoss += parseFloat(profitLoss);
            } else {
                portfolioOverview.innerHTML += `<p>Failed to fetch data for ${tokenName}</p>`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            portfolioOverview.innerHTML += `<p>Error fetching data for ${tokenName}</p>`;
        }
    }

    portfolioOverview.innerHTML += `<p><strong>Total Profit/Loss: $${totalProfitLoss.toFixed(2)}</strong></p>`;
}

// Call updatePortfolioOverview every 5 seconds (hyb)
setInterval(updatePortfolioOverview, 5000);

// Initial call to updatePortfolioOverview
updatePortfolioOverview();
