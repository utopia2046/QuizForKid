$(function() {

  var question = Question.get();

  this.ko_model = new ViewModel(question);
  ko.applyBindings(this.ko_model);
  var self = this;

  $('#answerInput').focus();
  
  $('#check').click(function() {
      self.checkAnswer();
  });

  this.checkAnswer = function() {
    if (self.ko_model.showAnswer()) {
      return;
    }

    self.ko_model.isCorrect(self.ko_model.checkAnswer());
    self.ko_model.showAnswer(true);
    if (self.ko_model.isCorrect()) {
      self.ko_model.countCorrect(self.ko_model.countCorrect() + 1);
    } else {
      self.ko_model.countWrong(self.ko_model.countWrong() + 1);
      self.ko_model.wrongQues.push({
        'question': self.ko_model.question,
        'questionText': Question.getQuestionText(self.ko_model.question)
      });
    }
  };

  $('#next').click(function() {
    self.ko_model.next(Question.get());
    $('#answerInput').focus();
  });

  $('#result').click(function() {
    $('body').timer('stop');
    self.ko_model.showSummary(true);
  });

  $('body').keydown(function(e) {
    switch (e.keyCode) {
      case 39: // right
      case 40: // down
      case 34: // pgdown
        if (!self.ko_model.showAnswer()) {
          self.checkAnswer();
        } else {
          self.ko_model.next(Question.get());
          $('#answerInput').focus();
        }
        break;
      case 13: // enter
        self.checkAnswer();
    }
  });
  
  self.ko_model.isStarted(true);
  $('body').timer({
    delay: 1000,
    repeat: 1000,
    autostart: true,
    callback: function( index ) {
      self.ko_model.time(new Date());
      if (self.ko_model.isTimeUp()) {
        $('body').timer('stop');
        self.ko_model.showSummary(true);
      }
   }
  });

});
