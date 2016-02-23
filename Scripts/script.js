var questionsCount = 10;

function Question() {
    var number1;
    var number2;
    var operator;
    var answer;
}

$(function() {
    var addQuestions = [];
    var subQuestions = [];
    for (var i = 0; i < questionsCount; i++) {
        addQuestions.push(generateAddQuestion());
        subQuestions.push(generateSubQuestion());
    }
    createQuestionsTable(["加数", "加数", "和"], '#tableAdd', addQuestions);
    createQuestionsTable(["被减数", "减数", "差"], '#tableSub', subQuestions);
    
    var allMulQuestions = generateAllMultiplyQuestions();
    var count = questionsCount + questionsCount; // generate 2* questionsCount of questions, latter half as division
    var randomIndex = randomIndexArrayIn(allMulQuestions.length, count);
    
    var mulQuestions = [];
    for (var i = 0; i < questionsCount; i++) {
        mulQuestions.push(allMulQuestions[randomIndex[i]]);
    }
    
    var divQuestions = [];
    for (var i = questionsCount; i < count; i++) {
        var mulQuestion = allMulQuestions[randomIndex[i]];
        var divQuestion = getDivQuestionFromMulQuestion(mulQuestion);
        divQuestions.push(divQuestion);
    }
    
    createQuestionsTable(["乘数", "乘数", "积"], '#tableMul', mulQuestions);
    createQuestionsTable(["被除数", "除数", "商"], '#tableDiv', divQuestions);

    $('#btnAnswer').click(showAnswer);
    $('#btnListenAdd').click(function () {readQuestions(addQuestions);});
    $('#btnListenAddAnswer').click(function () {readQuestions(addQuestions, true);});
    $('#btnListenSub').click(function () {readQuestions(subQuestions);});
    $('#btnListenSubAnswer').click(function () {readQuestions(subQuestions, true);});
    $('#btnListenMul').click(function () {readQuestions(mulQuestions);});
    $('#btnListenMulAnswer').click(function () {readQuestions(mulQuestions, true);});
    $('#btnListenDiv').click(function () {readQuestions(divQuestions);});
    $('#btnListenDivAnswer').click(function () {readQuestions(divQuestions, true);});
    
    $('.button').mouseover(function () { 
        $(this).addClass('textGlow'); 
        });
    $('.button').mouseleave(function () { 
        $(this).removeClass('textGlow'); 
        });
    $('tr').mouseover(function () {
        $(this).addClass('currentLine');
    });
    $('tr').mouseleave(function () {
        $(this).removeClass('currentLine');
    });
});

function createQuestionsTable(labels, tableSelector, questions) {
    if (labels.length == 3) {
        var row = getTableHeader(labels[0], labels[1], labels[2]);
        $(tableSelector).append(row);
    }

    for (var i = 0; i < questionsCount; i++) {
        row = getTableRow(i + 1, questions[i]);
        $(tableSelector).append(row);
    }
}

function generateAddQuestion() {
	var q = {};
    q.number1 = randomIntBetween(10, 89);
    q.number2 = randomIntBetween(10, 99 - q.number1);
    q.operator = '+';
    q.answer = q.number1 + q.number2;
	return q;
}

function generateSubQuestion() {
	var q = {};
    q.number1 = randomIntBetween(20, 99);
    q.number2 = randomIntBetween(10, q.number1);
    q.operator = '-';
    q.answer = q.number1 - q.number2;
	return q;
}

function generateAllMultiplyQuestions() {
    var questions = [];

    for (var i = 2; i < 10; i++) {
        for (var j = 2; j < 20; j++) {
            var q = {};
            q.number1 = i;
            q.number2 = j;
            q.operator = '×'; //&#xd7;
            q.answer = q.number1 * q.number2;
            questions.push(q);
        }
    }

    return questions;
}

function getDivQuestionFromMulQuestion(mulQuestion) {
    var q = {};
    q.number1 = mulQuestion.answer;
    q.number2 = mulQuestion.number1;
    q.operator = '÷';
    q.answer = mulQuestion.number2;
    return q;
}

function getTableHeader(name1, name2, name3) {
	var row = "<tr style='font-weight:bold;'><td>题号</td>";
	row += "<td style='text-align:right;'>" + name1 + "</td>";
	row += "<td></td>";
	row += "<td>" + name2 + "</td>";
	row += "<td>=</td>";
	row += "<td>" + name3 + "</td></tr>";
	return row;
}

function getTableRow(index, question) {
	if (!question) return "";
	var row = "<tr><td class='index'>" + index +"</td>";
	row += "<td style='text-align:right;'>" + question.number1 + "</td>";
	row += "<td>" + question.operator + "</td>";
	row += "<td>" + question.number2 + "</td>";
	row += "<td>=</td>";
	row += "<td class='answer' style='display:none'>" + question.answer + "</td></tr>";
	return row;
}

function showAnswer() {
	$('.answer').show();
}

// Generate a random integer between given floor and roof, both border included
function randomIntBetween(floor, roof) {
	return Math.floor(Math.random() * (roof - floor + 1)) + floor;
}

// Generate indexCount random indexes less than totalLength
function randomIndexArrayIn(totalLength, indexCount) {
    var numbers = [];
    for (var i = 0; i < totalLength; i++) {
        numbers.push(i);
    }
    var indexArray = [];
    var length = totalLength;
    for (var i = 0; i < indexCount; i++) {
        var index = randomIntBetween(0, length - 1);
        indexArray.push(numbers[index]);
        length--;
        // replace the generated index to end of array so that no dup index
        var tmp = numbers[index];
        numbers[index] = numbers[length];
        numbers[length] = tmp;
    }
    return indexArray;
}

function readQuestions(questions, readAnswer) {
    var text;
    for (var i = 0; i < questions.length; i++) {
        text = createAudioScript(i + 1, questions[i], readAnswer);
        console.log(text);
        readTextHtml5(text);
    }
}

function createAudioScript(index, question, readAnswer) {
    var msg = '第 ' + index + ' 题。';
    var opText;
    switch (question.operator) {
        case '+':
            opText = ' 加上 ';
            break;
        case '-':
            opText = ' 减去 ';
            break;
        case '×':
            opText = ' 乘以 ';
            break;
        case '÷':
            opText = ' 除以 ';
            break;
    }
    msg += question.number1 + opText + question.number2;
    if (readAnswer) {
        msg += ' 等于 ' + question.answer + '。\n\r';
    }
    else {
        msg += ' 等于多少？\n\r';
    }
    return msg;
}

// TTS HTML5 solution: need to install a Chinese TTS voice first.
// Note that some voices, like MS TTS 11 zh-CN voice doesn't support altering params
function readTextHtml5(text) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[0];
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10s
    msg.pitch = 2; //0 to 2
    msg.text = text;
    msg.lang = 'zh-CN';

    msg.onend = function(e) {
      console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };

    window.speechSynthesis.speak(msg);
}