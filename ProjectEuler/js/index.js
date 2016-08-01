function calculate1() {
  var value = document.getElementById("text1").value;
  if (!isNaN(value)) {
    var total = 0;
    for (var i = 0; i < value; i++) {
      if (i % 3 === 0 || i % 5 === 0)
        total += i;
    }
    var textBox = document.getElementById("answerBox1");
    textBox.innerHTML = total;
  }
}

function calculate2() {
  var max = document.getElementById("text2").value;
  if (!isNaN(max)) {
    var total = 0;
    var prev = 1;
    var current = 2;
    while (current <= max) {
      if (current % 2 === 0)
        total += current;
      current = prev + current;
      prev = current - prev;
    }
    var textbox = document.getElementById("answerBox2");
    textbox.innerHTML = total;
  }
}

function calculate3() {
  var value = document.getElementById("text3").value;
  if (!isNaN(value)) {
    var biggest = 1;
    var divisor = biggest + 1;
    while (divisor <= value / 2) {
      if (value % divisor === 0 && isPrime(divisor)) {
        biggest = divisor;
        value = value / divisor;
      }
      divisor++;
    }
    if(value > biggest && isPrime(value))
      biggest = value;
    var textbox = document.getElementById("answerBox3");
    textbox.innerHTML = biggest;
  }
}

var primes = [];

var isPrime = function(number) {
  if (inPrimeList(number))
    return true;
  var total = 0;
  for (var i = 1; i <= number; i++) {
    if (number % i === 0)
      total++;
    if (total > 2)
      return false;
  }
  if (total === 2) {
    primes[primes.length] = number;
    return true;
  }
  return false;
}

var inPrimeList = function(number) {
  for (var i = 0; i < primes.length; i++) {
    if (number === primes[i])
      return true;
  }
  return false;
}