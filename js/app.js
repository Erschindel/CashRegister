// Input the price of objects to be purchased, the cash given by the customer, and the cash in the register broken into the sum of each denomination (for example, if I have 3 five-dollar bills I would enter ["FIVE", 15]) in ascending order, program returns the register status and the change broken into largest possible combination of denominations, in descending order.

// Example cash-in-drawer array:
// [["PENNY", .83],
// ["NICKEL", 1.3],
// ["DIME", 10.7],
// ["QUARTER", 2.75],
// ["ONE", 21],
// ["FIVE", 40],
// ["TEN", 10],
// ["TWENTY", 120],
// ["ONE HUNDRED", 300]]

function checkCashRegister(price, cash, cid) {
  let ans = {},
    changeDue = subtract(cash, price),
    revCid = cid.slice().reverse(),
    values = {
      "PENNY": .01,
      "NICKEL": .05,
      "DIME": .1,
      "QUARTER": .25,
      "ONE": 1,
      "FIVE": 5,
      "TEN": 10,
      "TWENTY": 20,
      "ONE HUNDRED": 100
    },
  preRemaining = revCid.filter(e => values[e[0]] <= changeDue),
  remaining = preRemaining.filter(e => e[1] !== 0);

  const totalAvailable = cid.map(e => e[1])
          .reduce((a, b) => add(a, b)),
        available = remaining.map(e => e[1])
          .reduce((a, b) => add(a, b)),
        valueNames = remaining.map(e => e[0]);

  if(changeDue === totalAvailable){
    ans.status = "CLOSED";
    ans.change = cid;
  }else if(changeDue > available){ // || buildChange().map(e => e[1]).reduce((a, b) => add(a, b)) < changeDue
    ans.status = "INSUFFICIENT_FUNDS";
    ans.change = [];
  }else{
    ans.status = "OPEN";
    ans.change = buildChange();
  }

  function buildChange(){
    let check = [],
      sum = 0,
      i = 0,
      j = 1,
      bSkip = false;

    while(i < remaining.length){
      changeDue = Math.round(100*changeDue)/100;
      if(check.length - j < i && values[remaining[i][0]] < changeDue && !bSkip){
        check.push([valueNames[i], 0]);
      }else if(check.length - j < i){
        i++;
        bSkip = true;
        j--;
      }
      if(values[remaining[i][0]] <= changeDue && remaining[i][1] - values[remaining[i][0]] >= 0 && !bSkip){
        sum += values[remaining[i][0]];
        changeDue -= values[remaining[i][0]];
        changeDue = Math.round(100*changeDue)/100;
        remaining[i][1] -= values[remaining[i][0]];
      }else if(!bSkip){
        check[i + j - 1][1] = sum;
        sum = 0;
        i++;
        if(changeDue === 0){
          break;
        }
      }else{
        bSkip = false;
      }
    }
    return check;
  }

  function subtract (a, b){
    return ((a * 100) - (b * 100)) / 100;
  }

  function add (a, b){
    return ((a * 100) + (b * 100)) / 100;
  }

  return ans;
}



// checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
