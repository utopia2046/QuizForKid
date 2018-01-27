var Question = (function() {
  // private variables
  var n1;
  var n2;
  var op;
  var answer;
  var remains;

  // private functions
  function getQuestionText(question) {
    var str = question.n1 + question.op + question.n2 + ' = ' + question.answer;
    str = question.remains ? str + ' .. ' + question.remains : str;
    return str;
  }

  function generateAddQuestion() {
    var n1 = randomIntBetween(10, 999);
    var n2 = randomIntBetween(10, 999 - n1);
    if (isEasterEgg()) {
      var ans = getMagicNumber();
      n2 = randomIntBetween(10, ans);
      return {
        n1 : ans - n2,
        n2 : n2,
        op : '+',
        answer: ans
      };
    } else {
      return {
        n1 : n1,
        n2 : n2,
        op : '+',
        answer: n1 + n2
      };
    }
  }

  function generateSubQuestion() {
    var n1 = randomIntBetween(20, 999);
    var n2 = randomIntBetween(10, n1);
    if (isEasterEgg()) {
      var ans = getMagicNumber();
      n1 = randomIntBetween(ans, 999);
      return {
        n1 : n1,
        n2 : n1 - ans,
        op : '-',
        answer: ans
      };
    } else {
      return {
        n1 : n1,
        n2 : n2,
        op : '-',
        answer : n1 - n2
      };
    }
  }

  function getMultiplyQuestion() {
    var n1 = randomIntBetween(10, 99);
    var n2 = randomIntBetween(2, 10);
    var answer = n1 * n2;
    return {
      n1 : n1,
      n2 : n2,
      op : '×',
      answer: answer
    };
  }

  function getDivQuestion() {
    var n1 = randomIntBetween(10, 99);
    var n2 = randomIntBetween(2, 10);
    var answer = Math.floor(n1 / n2);
    var remains = n1 - answer * n2;
    return {
      n1 : n1,
      n2 : n2,
      op : '÷',
      answer: answer,
      remains: remains
    };
  }

  function getRandomQuestion() {
    var i = randomIntBetween(0, 3);
    var q;
    switch (i) {
      case 0:
        q = generateAddQuestion();
        break;
      case 1:
        q = generateSubQuestion();
        break;
      case 2:
        q = getMultiplyQuestion();
        break;
      case 3:
        q = getDivQuestion();
        break;
    }
    
    if (isFloatQuestion() && (i < 2)) { // Generate question with digit for + & -
      q.n1 = q.n1 / 100;
      q.n2 = q.n2 / 100;
      q.answer = q.answer / 100;
    }
    
    return q;
  }

  // Generate a random integer between given floor and roof, both border included
  function randomIntBetween(floor, roof) {
    return Math.floor(Math.random() * (roof - floor + 1)) + floor;
  }
  
  function isEasterEgg() {
    return Math.random() < 0.05;
  }
  
  function getMagicNumber() {
    var arr = [233, 250, 666];
    var index = randomIntBetween(0, arr.length - 1);
    return arr[index];
  }
  
  function isFloatQuestion() {
    return Math.random() > 0.5;
  }

  return {
    // public members and functions
    getAdd: generateAddQuestion,
    getSub: generateSubQuestion,
    getMul: getMultiplyQuestion,
    getDiv: getDivQuestion,
    get: getRandomQuestion,
    getQuestionText: getQuestionText
  };
}());
