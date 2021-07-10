const express = require('express');
const app = express();

const PORT = 3000;

let transactions = [];
let userBalance = 0;
let balances = {};

function sortTransactions() {
  transactions.sort((t1, t2) => (t1.timestamp > t2.timestamp) ? 1 : -1);
}

app.post('/transaction', (req, res) => {
  let payer = req.query.payer;
  let points = Number(req.query.points);
  let timestamp = req.query.timestamp;

  userBalance += points;

  if (balances[payer]) {
    balances[payer] += points;
  } else {
    balances[payer] = points;
  }

  transactions.push({
    payer,
    points,
    timestamp
  })
  res.end(`Transaction completed. ${points} points have been added to the ${payer} balance`);
})
app.post('/spend', (req, res) => {
  sortTransactions();
  let pointsToSpend = req.query.points;
  let balanceChanges = {};
  for (let payer in balances) {
    balanceChanges[payer] = 0
  }
  for (let t of transactions) {
    let overdraftsPayer = (balances[t.payer] - t.points < 0)
    let overdraftsThisTransaction = (t.points - pointsToSpend < 0)
    if (!overdraftsPayer) {
      if (!overdraftsThisTransaction) {
        spend(pointsToSpend, t.payer);
      } else {
        spend(t.points, t.payer);
      }
    } else {
      let remainingPoints = balances[t.payer];
      spend(remainingPoints, t.payer);
    }
  }
  function spend(points, payer) {
    pointsToSpend -= points;
    balanceChanges[payer] -= points;
    balances[payer] -= points;
  }

  let output = [];
  for (let payer in balanceChanges) {
    output.push({
      payer,
      points: balanceChanges[payer]
    })
  }
  res.send(output)
})
app.get('/balances', (req, res) => {
  res.send(balances)
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));