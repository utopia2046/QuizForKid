var ViewModel = function(question) {

  var self = this;

  self.getTimeString = function(ms) {
    var sec = Math.round(ms / 1000);
    var min = 0, hour = 0;
    if (sec >= 60) {
      min = Math.floor(sec / 60);
      sec = sec - min * 60;
    }
    var secString = (sec >= 10) ? sec.toString() : '0' + sec.toString();

    if (min >= 60) {
      hour = Math.floor(min / 60);
      min = min - hour * 60;
    }
    var minString = (min >= 10) ? min.toString() : '0' + min.toString();

    return hour + ':' + minString + ':' + secString;
  };
  
  self.question = question || null;
  self.total = ko.observable(0);
  self.countCorrect = ko.observable(0);
  self.countWrong = ko.observable(0);
  self.startTime = ko.observable(new Date());
  self.time = ko.observable(new Date());
  self.remainingTimeInMs = ko.computed(function() {
    return 5*60*1000 - (self.time() - self.startTime()); // 5 min
  });
  self.isTimeUp = ko.computed(function() {
    return self.remainingTimeInMs() <= 0;
  });
  self.remainingTime = ko.computed(function() {
      return self.getTimeString(self.remainingTimeInMs());
  });
  self.isStarted = ko.observable(true);
  self.showSummary = ko.observable(false);

  self.wrongQues = ko.observableArray();
  self.hasWrongQues = ko.computed(function() {
    return self.wrongQues().length > 0;
  });

  self.number1 = ko.observable(self.question.n1);
  self.number2 = ko.observable(self.question.n2);
  self.operator = ko.observable(self.question.op);
  self.answer = ko.observable(self.question.answer);
  self.remains = ko.observable(self.question.remains || 0);

  self.userInput = ko.observable();
  self.userInput2 = ko.observable();

  self.showAnswer = ko.observable(false);
  self.isCorrect = ko.observable(true);

  self.hasRemains = ko.computed(function() {
    return (self.operator() === '÷') && (self.remains() !== 0);
  });

  self.next = function (question) {
    self.question = question || null;
    if (!self.isTimeUp()) {
      self.showAnswer(false);
      self.userInput('');
      self.userInput2('');

      console.log('count = ' + self.total());
      self.number1(question.n1);
      self.number2(question.n2);
      self.operator(question.op);
      console.log('question: ' + self.number1() + self.operator() + self.number2());
      self.answer(question.answer);
      self.remains(question.remains || 0);
      console.log('answer = ' + self.answer());
      self.total(self.total() + 1);
      return true;
    } else {
      console.log('all quiz done.');
      return false;
    }
  };

  if (question) {
    self.next(question);
  }

  self.checkAnswer = function() {
    if ((self.answer() === 0) && (self.userInput() === '0')) {
      return true;
    } else if (!self.userInput() || !self.answer()) {
      return false;
    }

    if (self.hasRemains()) {
      return (self.userInput() == self.answer()) &&
        (self.userInput2() == self.remains());
    } else {
      return self.userInput() == self.answer();
    }
  };

  self.countNoAnswer = ko.computed(function() {
    return self.total() - self.countCorrect() - self.countWrong();
  });
};
