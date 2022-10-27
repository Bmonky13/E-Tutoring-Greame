//Assets
let assets = document.getElementById("assets");
let qst = null
if (assets !== null) { qst = assets.getElementsByClassName("qst")[0]; }
let hitem = null
if (assets !== null) { hitem = assets.getElementsByClassName("hitem")[0]; }
let content = document.getElementById("content");
let main = document.getElementById("mainqst");
let score = document.getElementById("score");
let level = document.getElementById("levelnum");
let accuracy = document.getElementById("accuracy");
let check = document.getElementById("sbmt");
let stay = document.getElementById("stay");
let gtlvin = document.getElementById("gtlvin");
let gtlvb = document.getElementById("gtlvb");
let history = document.getElementById("history");
let grades = document.getElementsByClassName("navchild");
let sldiv = document.getElementById("sldiv");
let time = document.getElementById("time");
let userpromptinput = document.getElementById("userpromptinput");
let userpromptbtn = document.getElementById("userpromptbtn");
let userprompt = document.getElementById("userprompt");
let copy1 = document.getElementById("copy");
let copy2 = document.getElementById("copy2");
let username = null
let sheetname = null
//Manipulated
let total = 0
let correct = 0
let accuracyString = "0/0 (100%)"
let scoreString = "0/0 (100%)"
let elapsed = 0
let timeNum = 0

let startdifficulty = 2;
let difficulty = 2;
let grade = 3;
let allowedLayers = 0;
let minLayers = 0
let maxLayers = 3
let maxdifficulty = 6
let decimals = 0
let negativeanswers = false
let decimalanswers = false
let stressBedmas = false
let answerCap = 1000000000
let maxInteger = { "+": 20, "-": 20, "x": 20, "÷": 20, }
let minInteger = { "+": 1, "-": 1, "x": 1, "÷": 1, }
let operators = [" + ", " - ", " x ", " ÷ "];
let questions = []
//Thresholds
let upLevel = 75;
let downlevel = 50;
//Settings
let totalQuestions = 5
//Other

if (userprompt !== null) {
  document.getElementById("teach").addEventListener("click",function(){
    window.location.replace("https://jsworksheet.ganiskowicz.repl.co/teach");
  })
  userpromptbtn.addEventListener("click",function(){
    if (userpromptinput.value !== "") {
      content.style.display = ""
      userprompt.style.display = "none"
      username = userpromptinput.value
      document.getElementsByTagName("title")[0].innerHTML = "Your Worksheet"
      updateLinkQuery()
      generate()
    }
  })
}

let linkQuery = { "t": timeNum, "g": grade, "l": difficulty - 1,"name": username}

let linkBaseUrl = `https://jsworksheet.ganiskowicz.repl.co/sheet?`
let linkQueryString = linkBaseUrl
let linkViewerBaseUrl = `https://jsworksheet.ganiskowicz.repl.co/view?`
let linkViewerQueryString = linkBaseUrl

function historyQueries() {
  let hist = {}
  hist.length = 0

  for (let i2 = 0; i2 < history.childNodes.length; i2++) {
    let data = history.childNodes[i2].getElementsByClassName("data")[0].innerHTML.split(":") //Data saved within hostory element
    let i = data[0].substring(1) //Index
    let g = data[1].substring(1) //Grade
    let l = data[2].substring(1) //Level
    let m = data[3].substring(1) //Mark
    let tQ = data[4].substring(1) //Total Questions
    let t = data[5].substring(1) //Time
    hist[`q${i2 + 1}`] = {}
    hist[`q${i2 + 1}`].string = `i${i}:g${g}:l${l}:m${m}:q${tQ}:t${t}` //Section saved in URL
    hist[`q${i2 + 1}`].index = i //Index for get parameters
    hist.length++
  }

  return hist
}

function updateLinkQuery() {
  let query = "" //Query that comes after the URL and file path
  linkQuery.t = timeNum //Time spent answering questions
  linkQuery.g = grade //Current grade level
  linkQuery.l = difficulty + 1 //Current difficulty level
  linkQuery.name = username //Name of student

  let hist = historyQueries() //Formats the students question history into a readble form
  for (let i = 1; i <= hist.length; i++) {
    //index = position in history
    //string = data associated with the set of questions such as score, grade, time taken
    query = `${query}q${hist[`q${i}`].index}=${hist[`q${i}`].string}`
    if (i + 1 <= hist.length) {
      query = `${query}&` //There is more than one item in history
    }
  }

  query = `${query}&t=${linkQuery.t}&g=${linkQuery.g}&l=${linkQuery.l}&name=${linkQuery.name}` //Add general info to the history query
  if (sheetname !== null) {
    query = `${query}&sname=${sheetname}` //Add the name of the qorksheet (only applicable if the user recieved a link from a teacher)
  }
  linkQueryString = `${linkBaseUrl}${LZString.compressToBase64(query)}` //Generate a personal link
  linkViewerQueryString = `${linkViewerBaseUrl}${LZString.compressToBase64(query)}` //Generate a viewer link (for the teacher)
  //LZString.compressToBase64 compresses the URL and shortens the URL length by about half, this also means that a student is unabled to manipulate their score simply by changing data of the URL parameters since it is essentially encrypted

  sldiv.style.display = ""

  window.history.replaceState(null, null, `/sheet?${LZString.compressToBase64(query)}`); //Set the current URL to the personal link
}

if (main !== null) { generate() }

//Auto Fill Answers
function autoFill() {
  let a = main.getElementsByClassName("qst");
  let len = a.length;
  for (let i = 1; i <= len; i++) {
    let el = document.getElementById(`input${i - 1}`)
    el.value = questions[i - 1]
  }
}

//Set Difficulty Based On Mark
function setDifficulty(mark) {
  if ((mark / totalQuestions) * 100 >= upLevel) {
    if (maxdifficulty > difficulty) {
      difficulty++
    }
  } else if ((mark / totalQuestions) * 100 <= downlevel) {
    if (0 < difficulty) {
      difficulty--
    }
  }
}

//Get Next Difficulty Based On Mark
function getDifficulty(mark) {
  let diff = difficulty
  if ((mark / totalQuestions) * 100 >= upLevel) {
    if (maxdifficulty > difficulty) {
      diff++
    }
  } else if ((mark / totalQuestions) * 100 <= downlevel) {
    if (0 < difficulty) {
      diff--
    }
  }
  return diff
}

//Mark
function markQuestions() {
  let mark = 0; //# Correct
  let a = main.getElementsByClassName("qst");
  let len = a.length;
  for (let i = 1; i <= len; i++) {//Loop through question elements
    let qst = document.getElementById(`question${i - 1}`)
    let el = document.getElementById(`input${i - 1}`)
    let img = qst.getElementsByClassName("ynimg")[0]
    if (questions[i - 1] == el.value) {//Check to see if the asnwer to the question is equal to the value indexed in the dictionary.
      mark++
      img.src = "../Check.png"
    } else {
      img.src = "../X.png"
      let crct = qst.getElementsByClassName("crct")[0]
      crct.innerHTML = `Answer: ${questions[i - 1]}` //Display correct answer
    }
    img.style.display = ""
  }
  return mark //Return mark so setDifficulty(mark) can be called
}

//Get Numbers
function getOpperands(l, opperator) {
  let value1 //First value in the equation
  let value2 //Second value in the equation
  if (opperator == " + ") { //Determine the correct range of vaues for a given opperation
    value1 = Math.round(((Math.random()) * (maxInteger["+"] - minInteger["+"]) + minInteger["+"])*Math.pow(10,decimals))/Math.pow(10,decimals);
    value2 = Math.round(((Math.random()) * (maxInteger["+"] - minInteger["+"]) + minInteger["+"])*Math.pow(10,decimals))/Math.pow(10,decimals);
  } else if (opperator == " - ") {
    value1 = Math.round(((Math.random()) * (maxInteger["+"] - minInteger["+"]) + minInteger["+"])*Math.pow(10,decimals))/Math.pow(10,decimals);
    value2 = Math.round(((Math.random()) * (maxInteger["-"] - minInteger["-"]) + minInteger["-"])*Math.pow(10,decimals))/Math.pow(10,decimals);
  } else if (opperator == " x ") {
    value1 = Math.round(((Math.random()) * (maxInteger["x"] - minInteger["x"]) + minInteger["x"])*Math.pow(10,decimals))/Math.pow(10,decimals);
    value2 = Math.round(((Math.random()) * (maxInteger["x"] - minInteger["x"]) + minInteger["x"])*Math.pow(10,decimals))/Math.pow(10,decimals);
  } else if (opperator == " ÷ ") {
    value1 = Math.round(((Math.random()) * (maxInteger["÷"] - minInteger["÷"]) + minInteger["÷"])*Math.pow(10,decimals))/Math.pow(10,decimals);
    value2 = Math.round(((Math.random()) * (maxInteger["÷"] - minInteger["÷"]) + minInteger["÷"])*Math.pow(10,decimals))/Math.pow(10,decimals);
  } else if (opperator == " ^ ") {
    value1 = Math.round(((Math.random()) * (maxInteger["^b"] - minInteger["^b"]) + minInteger["^b"]));
    value2 = Math.round(((Math.random()) * (maxInteger["^"] - minInteger["^"]) + minInteger["^"]));
  }
  let string1 = value1;
  let string2 = value2;

  let layers = l

  if (l + 1 <= allowedLayers && opperator !== " ^ ") {//Check if one value can be replaced with multiple values to make an equation with more than one opperation
    let r = 0
    //Determine how many extra opperations can be conducted
    if (l + 2 <= allowedLayers) {
      r = Math.round(Math.random() * 2)
    } else {
      r = Math.round(Math.random())
    }
    if (r == 0 || !stressBedmas) {
      layers += 1

      //Replace Values
      let exp = packedExpression(layers)
      value2 = exp.value

      //Formatting
      if ((((exp.opp === " x " || exp.opp === " ÷ ") && (opperator === " + " || opperator === " - ")) || exp.opp === " ^ ") || !stressBedmas) {
        string2 = exp.string
      } else {
        string2 = `(${exp.string})`
      }
    } else if (r === 1) {
      layers += 1

      //Replace Values
      let exp = packedExpression(layers)
      value1 = exp.value

      //Formatting
      if (((exp.opp === " x " || exp.opp === " ÷ ") && (opperator === " + " || opperator === " - " || exp.opp === opperator)) || exp.opp === " ^ ") {
        string1 = exp.string
      } else {
        string1 = `(${exp.string})`
      }
    } else {
      layers += 2

      //Replace Values
      let exp = packedExpression(layers)
      value1 = exp.value

      //Formatting
      if (((exp.opp === " x " || exp.opp === " ÷ ") && (opperator === " + " || opperator === " - " || exp.opp === opperator)) || exp.opp === " ^ ") {
        string1 = exp.string
      } else {
        string1 = `(${exp.string})`
      }

      //Replace Values
      let exp2 = packedExpression(layers)
      value2 = exp2.value

      //Formatting
      if (((exp2.opp === " x " || exp2.opp === " ÷ ") && (opperator === " + " || opperator === " - ")) || exp2.opp === " ^ ") {
        string2 = exp2.string
      } else {
        string2 = `(${exp2.string})`
      }
    }
  }

  return { value1, string1, value2, string2, layers }
}

//Get Opp
function getOpperator(l) {
  let index = Math.floor(Math.random() * operators.length); //Get random index in array
  let string = operators[index];

  return { string, index }
}

//Create Expressions
function packedExpression(l,depth) {
  let layer = l //The current number of opperations being done in the equation + 1

  let value = 0; //Value of expression
  let string = ""; //String form of expression

  let opperator = getOpperator(layer); //Selects the opperation being used
  while (opperator.string == " ^ " && layer == 0) {
    opperator = getOpperator(layer);
  }
  let opperands = getOpperands(layer, opperator.string); //This function returns the string form and numerical value of the two numbers, similarly to how the packexpression (this function does) for that reason, if the layers paramter permits it, it will replace one of the returned numbers and strings w/ a packedExpression generated string and value.
  
  //Recersive
  //                getOpperands returns: string1, string2, value1, value2
  //                getOpperator returns: string (opperator), index
  //            packedExpression returns: string, value (a combination the two strings and values returned from getopperands)
  /*PackedExpression can then be called recursively within the getopperands function to then replace string1, value1 or string2, value2 or both.*/
  
  //Two opperators
  //ex.             getOpperator returns: "+"
  //                 getOpperands retuns: {string1: "5", value1: 5, string2: "5", value2: 5}
  //             packedExpression retuns: {string: "5 + 5", value: 10}
  //

  //Three opperators
  //ex.             getOpperator returns: "+"
  //                     getOpperands is: {string1: 5, value1: 5, string2: 5, value2: 5}
  /*Get opperands then sees that it can add another opperation to the values it was planning to return so it calls packedExpression which retuns two different values*/
  //             packedExpression retuns: {string: "9 + 9", value: 18}
  //                 getOpperands retuns: {string1: "9 + 9", value1: 18, string2: "5", value2: 5}
  //             packedExpression retuns: {string: "9 + 9 + 5", value: 23}

  //...

  layer += opperands.layers

  //Combine the generaed values
  if (opperator.string == " + ") {
    value = opperands.value1 + opperands.value2;
    string = opperands.string1 + opperator.string + opperands.string2
  } else if (opperator.string == " - ") {
    value = opperands.value1 - opperands.value2;
    string = opperands.string1 + opperator.string + opperands.string2
  } else if (opperator.string == " x ") {
    value = opperands.value1 * opperands.value2;
    string = opperands.string1 + opperator.string + opperands.string2
  } else if (opperator.string == " ÷ ") {
    value = opperands.value1 / opperands.value2;
    string = opperands.string1 + opperator.string + opperands.string2
  } else if (opperator.string == " ^ ") {
    value = Math.pow(opperands.value1, opperands.value2);
    string = opperands.string1 + sup(opperands.string2)
  } else {
    value = 1
    string = "nil"
  }

  //Check if the expression needs to be regenerated
  let l2 = layer
  if (value === 0 || depth < allowedLayers) {
    layer -= opperands.layers
    let exp
    let rts = 0
    while (value === 0) {
      rts++
      exp = packedExpression(layer,depth+1)
      value = exp.value
      string = exp.string
      l2 = exp.layer
      console.log(string)
      console.log(value)
    }
    layer = l2
  }

  let opp = opperator.string

  return { value, string, opp, layer };
}

//Create Expressions
function generateExpression(l) {
  let expression = packedExpression(l,0);
  let value = expression.value

  //Conditions
  while ((Math.round(value * 10) / 10 === 0 || value.toString() === "NaN" || !(isFinite(value)) || value.toString() === "Infinity" || value.toString() === "-Infinity") || (negativeanswers === false && value < 0) || (decimalanswers === false && value !== Math.ceil(value)) || (value > answerCap)) {
    expression = packedExpression(l,0);
    value = expression.value
  }

  expression.value = Math.round(expression.value * 10) / 10 //Round answer to nearest tenth
  console.log(expression.string)
  return expression
}

//Generate
function generate() {
  elapsed = 0 //Elapsed time taken to answer questions
  calculateDifficulty() //Set parameters for question generation based off grade and difficulty
  let a = main.getElementsByClassName("qst");
  let len = a.length;
  for (let i = 1; i <= len; i++) { //Remove old question elements
    a[0].remove()
  }
  questions = [] //Create a blank disctionarty to save answers to
  for (let i = 1; i <= totalQuestions; i++) {
    let question = qst.cloneNode(true); //Question element
    question.id = `question${i - 1}`;
    let expr = generateExpression(0); //Generate the expression for the question
    main.appendChild(question); //Parent question to main element
    let questionNumber = question.getElementsByClassName("n")[0];
    questionNumber.innerHTML = i; //Question number
    let expression = question.getElementsByClassName("expr")[0];
    expression.innerHTML = `${expr.string}`; //Set the innerHTML of the question to the string form of the expression
    questions.push(expr.value) //Save the value of the expression to a dictionary
    let input = question.getElementsByClassName("in")[0];
    input.id = `input${i - 1}`;
  }
}

function continueGeneration() {
  check.innerHTML = "Check Answers"
  score.innerHTML = ""
  score.style.display = "none"
  stay.style.display = "none"
  generate()
}

function insertHistory(index, grade, level, mark, totalQuestions, time) {
  //Format all the dataS
  let historyPos = +index;
  let historyItem = hitem.cloneNode(true);
  let historyData = historyItem.getElementsByClassName("data")[0]
  let historyTimeString = toTime(time)
  let historyPositionString = `${historyPos}.`
  let historyLevelString = level
  let historyGradeString = grade
  let historyScoreString = `${mark}/${totalQuestions} (${mark / totalQuestions * 100}%)`

  //Format data to be used in a URL query
  let historyTime = historyItem.getElementsByClassName("htime")[0]
  let historyPosition = historyItem.getElementsByClassName("hpos")[0]
  let historyLevel = historyItem.getElementsByClassName("hlevel")[0]
  let historyGrade = historyItem.getElementsByClassName("hgrade")[0]
  let historyScore = historyItem.getElementsByClassName("hscore")[0]
  let hdata = `i${index}:g${grade}:l${level}:m${mark}:q${totalQuestions}:t${time}`
  if (Math.ceil(historyPos / 2) * 2 === historyPos) {
    historyItem.classList.add("hdark")
  }
  //Set the inner HTML of all the elements
  historyData.innerHTML = hdata
  historyTime.innerHTML = historyTimeString
  historyPosition.innerHTML = historyPositionString
  historyLevel.innerHTML = historyLevelString
  historyGrade.innerHTML = historyGradeString
  historyScore.innerHTML = historyScoreString
  history.insertBefore(historyItem, history.childNodes[0])
  setInterval(function () { //Continue to update elements every 100ms so a student cannot edit the HTML
    historyData.innerHTML = hdata
    historyTime.innerHTML = historyTimeString
    historyPosition.innerHTML = historyPositionString
    historyLevel.innerHTML = historyLevelString
    historyGrade.innerHTML = historyGradeString
    historyScore.innerHTML = historyScoreString
  }, 100)
}

let mark;
//Stay And Check
function checkBtn() {
  if (check.innerHTML === "Check Answers") {
    mark = markQuestions()
    let diff = getDifficulty(mark)
    if (diff === difficulty) {
      check.innerHTML = `Continue`
    } else {
      check.innerHTML = `Continue To Level ${diff + 1}`
    }
    scoreString = `Score: ${mark}/${totalQuestions} (${mark / totalQuestions * 100}%)`
    score.innerHTML = scoreString
    score.style.display = "";
    stay.style.display = ""
    total += totalQuestions;
    correct += mark;
    accuracyString = `${correct}/${total} (${Math.round(correct / total * 100 * 10) / 10}%)`
    accuracy.innerHTML = accuracyString

    let historyPos = history.childNodes.length + 1
    let historyItem = hitem.cloneNode(true);
    let historyTimeString = toTime(elapsed)
    let historyPositionString = `${historyPos}.`
    let historyLevelString = difficulty + 1
    let historyGradeString = grade
    let historyScoreString = `${mark}/${totalQuestions} (${mark / totalQuestions * 100}%)`

    insertHistory(historyPos, grade, difficulty + 1, mark, totalQuestions, elapsed)
    updateLinkQuery()
  } else {
    setDifficulty(mark)
    continueGeneration()
  }
}
function stayBtn() {
  continueGeneration()
}

//Set accuracy
if (accuracy !== null) {
  setInterval(function () {
    accuracy.innerHTML = accuracyString
  }, 100)
}

//Set score
if (score !== null) {
  setInterval(function () {
    score.innerHTML = scoreString
  }, 100)
}

//Stay And Check Answers
if (stay !== null) { stay.addEventListener("click", stayBtn) }
if (check !== null) { check.addEventListener("click", checkBtn) }

//Auto Fill Answers
if (main !== null) {
  document.addEventListener('keypress', function (key) {
    if (key.charCode === 126) {
      autoFill()
    }
  });
}

//Conert Seconds To Formatted Time
function toTime(time) {
  if (time == 0) {
    return "0s"
  }
  let timeString = ""
  let hours = Math.floor(time / 3600);
  time = time - hours * 3600;
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;

  if (hours > 0) {
    if (timeString !== "") { timeString = ` ${timeString}` }
    timeString = `${timeString} ${hours}h`
  }
  if (minutes > 0) {
    if (timeString !== "") { timeString = ` ${timeString}` }
    timeString = `${timeString} ${minutes}m`
  }
  if (seconds > 0) {
    if (timeString !== "") { timeString = ` ${timeString}` }
    timeString = `${timeString} ${seconds}s`
  }

  return timeString
}

//Go To Level
if (main !== null) {
  gtlvin.max = maxdifficulty + 1
  gtlvin.min = 1
  gtlvb.addEventListener("click", function () {
    if (gtlvin.value > 7) {
      gtlvin.value = 7
    }
    if (gtlvin.value < 1) {
      gtlvin.value = 1
    }
    difficulty = gtlvin.value - 1
    continueGeneration()
  })
}

//Set Grade
function setGrade(grd) {
  grade = grd.substring(3)
  for (let i = 0; i < grades.length; i++) {
    if (grades[i].id.substring(3) === grade) {
      grades[i].classList.add("btnbl")
      grades[i].classList.remove("btngry")
    } else {
      grades[i].classList.remove("btnbl")
      grades[i].classList.add("btngry")
    }
  }
  difficulty = startdifficulty;
  continueGeneration()
}

//Grade Events
if (main !== null) {
  for (let i = 0; i < grades.length; i++) {
    grades[i].addEventListener("click", function () {
      setGrade(grades[i].id)
    })
  }
}

//SUP
var SUPERSCRIPTS = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  'a': 'ᵃ',
  'b': 'ᵇ',
  'c': 'ᶜ',
  'd': 'ᵈ',
  'e': 'ᵉ',
  'f': 'ᶠ',
  'g': 'ᵍ',
  'h': 'ʰ',
  'i': 'ⁱ',
  'j': 'ʲ',
  'k': 'ᵏ',
  'l': 'ˡ',
  'm': 'ᵐ',
  'n': 'ⁿ',
  'o': 'ᵒ',
  'p': 'ᵖ',
  'r': 'ʳ',
  's': 'ˢ',
  't': 'ᵗ',
  'u': 'ᵘ',
  'v': 'ᵛ',
  'w': 'ʷ',
  'x': 'ˣ',
  'y': 'ʸ',
  'z': 'ᶻ'
}

function sup(num, base) {
  var numStr = num.toString(base)
  if (numStr === 'NaN') { return 'ᴺᵃᴺ' }
  if (numStr === 'Infinity') { return '⁺ᴵⁿᶠ' }
  if (numStr === '-Infinity') { return '⁻ᴵⁿᶠ' }
  return numStr.split('').map(function (c) {
    var supc = SUPERSCRIPTS[c]
    if (supc) {
      return supc
    }
    return ''
  }).join('')
}

//Set Params For Generation
function calculateDifficulty() {
  level.innerHTML = `${difficulty + 1}`
  decimals = 0
  answerCap = 10000000000
  if (+grade === 1) {
    negativeanswers = false
    decimalanswers = false
    stressBedmas = false
    if (difficulty === 0) {operators = [" + "]; allowedLayers = 0; maxInteger = { '+': 8}; minInteger = { '+': 1}
    } else if (difficulty === 1) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 8, '-': 5}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 2) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 9, '-': 8}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 3) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 10, '-': 9}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 4) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 15, '-': 7}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 5) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 15, '-': 9}; minInteger = { '+': 1, '-': 1}
    } else {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 20, '-': 9}; minInteger = { '+': 1, '-': 1}
    }
  } else if (+grade === 2) {
    negativeanswers = false
    decimalanswers = false
    stressBedmas = false
    if (difficulty === 0) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 10, '-': 10}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 1) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 15, '-': 9}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 2) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 20, '-': 9}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 3) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 14, '-': 14}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 4) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 15, '-': 11}; minInteger = { '+': 1, '-': 1}
    } else if (difficulty === 5) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 24, '-': 20}; minInteger = { '+': 1, '-': 1}
    } else {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 35, '-': 25}; minInteger = { '+': 1, '-': 1}
    }
  } else if (+grade === 3) {//Incomplete
    negativeanswers = false
    decimalanswers = false
    stressBedmas = false
    if (difficulty === 0) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 15, '-': 11}; minInteger = { '+': 1, '-': 1}; answerCap = 500;
    } else if (difficulty === 1) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 24, '-': 20}; minInteger = { '+': 1, '-': 1}; answerCap = 500;
    } else if (difficulty === 2) {operators = [" + "]; allowedLayers = 0; maxInteger = {'+': 200}; minInteger = {'+': 1}; answerCap = 10000;
    } else if (difficulty === 3) {operators = [" + "]; allowedLayers = 1; maxInteger = {'+': 400}; minInteger = {'+': 1}; answerCap = 10000;
    } else if (difficulty === 3) {operators = [" + "]; allowedLayers = 1; maxInteger = {'+': 2000}; minInteger = {'+': 300}; answerCap = 10000;
    } else if (difficulty === 5) {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 50, '÷': 50}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 300, '÷': 144}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    }
  } else if (+grade === 4) {//Incomplete
    negativeanswers = false
    decimalanswers = false
    stressBedmas = false
    if (difficulty === 0) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 15, '-': 11}; minInteger = { '+': 1, '-': 1}; answerCap = 500;
    } else if (difficulty === 1) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 24, '-': 20}; minInteger = { '+': 1, '-': 1}; answerCap = 500;
    } else if (difficulty === 2) {operators = [" + "]; allowedLayers = 0; maxInteger = {'+': 200}; minInteger = {'+': 1}; answerCap = 10000;
    } else if (difficulty === 3) {operators = [" + "]; allowedLayers = 1; maxInteger = {'+': 400}; minInteger = {'+': 1}; answerCap = 10000;
    } else if (difficulty === 3) {operators = [" + "]; allowedLayers = 1; maxInteger = {'+': 2000}; minInteger = {'+': 300}; answerCap = 10000;
    } else if (difficulty === 5) {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 50, '÷': 50}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 300, '÷': 144}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    }
  } else if (+grade === 5) {
    negativeanswers = true
    decimalanswers = false
    stressBedmas = false
    if (difficulty === 0) { operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 50, '÷': 50}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 1) {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 50, '÷': 50}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 2) {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 300, '÷': 144}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 3) {operators = [" x ", " ÷ "]; allowedLayers = 1; maxInteger = { 'x': 25, '÷': 25}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 3) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000;
    } else if (difficulty === 5) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000;
    } else {operators = [" x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 200, '-': 200,'x': 25, '÷': 25}; minInteger = { '+': -200, '-': -200,'x': -5, '÷': -5}; answerCap = 500;
    }
  } else if (+grade === 6) {
    negativeanswers = true
    decimalanswers = true
    stressBedmas = true
    if (difficulty === 0) { operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 50, '÷': 50}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 1) {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 50, '÷': 50}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 2) {operators = [" x ", " ÷ "]; allowedLayers = 0; maxInteger = { 'x': 300, '÷': 144}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 3) {operators = [" x ", " ÷ "]; allowedLayers = 1; maxInteger = { 'x': 25, '÷': 25}; minInteger = { 'x': 1, '÷': 1}; answerCap = 500;
    } else if (difficulty === 3) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000;
    } else if (difficulty === 5) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000;
    } else { operators = [" x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 200, '-': 200,'x': 25, '÷': 25}; minInteger = { '+': -200, '-': -200,'x': -5, '÷': -5}; answerCap = 500;
    }
  } else if (+grade === 7) {
    negativeanswers = true
    decimalanswers = true
    stressBedmas = true
    if (difficulty === 0) {operators = [" + ", " - "]; allowedLayers = 0; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000;
    } else if (difficulty === 1) {operators = [" + ", " - "]; allowedLayers = 1; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000;
    } else if (difficulty === 2) {operators = [" + ", " - "]; allowedLayers = 1; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000; decimals = 1;
    } else if (difficulty === 3) {operators = [" + ", " - "]; allowedLayers = 1; maxInteger = { '+': 85, '-': 85}; minInteger = { '+': -85, '-': -85}; answerCap = 10000; decimals = 2;
    } else if (difficulty === 3) {operators = [" + ", " - "," x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 85, '-': 85,'x': 12, '÷': 12}; minInteger = { '+': -85, '-': -85,'x': 1, '÷': 1}; answerCap = 10000; decimals = 1;
    } else if (difficulty === 5) {operators = [" + ", " - "," x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 200, '-': 200,'x': 25, '÷': 25}; minInteger = { '+': -200, '-': -200,'x': -5, '÷': -5}; answerCap = 500; decimals = 1;
    } else {operators = [" + ", " - "," x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 200, '-': 200,'x': 25, '÷': 25}; minInteger = { '+': -200, '-': -200,'x': -5, '÷': -5}; answerCap = 500; decimals = 2;
    }
  } else if (+grade === 8) {
    negativeanswers = true
    decimalanswers = true
    stressBedmas = true
    if (difficulty === 0) {operators = [" + ", " - ", " x ", " x ", " x "]; allowedLayers = 1; maxInteger = { '+': 50, '-': 50, 'x': 50, }; minInteger = { '+': -35, '-': -35, 'x': -35, }; decimals = 1;
    } else if (difficulty === 1) {operators = [" + ", " - ", " x ", " ÷ ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 50, '-': 50, 'x': 50, '÷': 50, }; minInteger = { '+': -35, '-': -35, 'x': -35, '÷': -35, }; decimals = 1
    } else if (difficulty === 2) {operators = [" + ", " - ", " x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 20, '-': 20, 'x': 20, '÷': 20, }; minInteger = { '+': 1, '-': 1, 'x': 1, '÷': 1, }; decimals = 1
    } else if (difficulty === 3) {operators = [" + ", " - ", " x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 20, '-': 20, 'x': 20, '÷': 20, }; minInteger = { '+': -10, '-': -10, 'x': -10, '÷': -10, }; decimals = 1;
    } else if (difficulty === 4) {operators = [" + ", " - ", " x ", " ÷ ", " x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 30, '-': 30, 'x': 30, '÷': 30, }; minInteger = { '+': -20, '-': -20, 'x': -20, '÷': -20, }; decimals = 1;
    } else if (difficulty === 5) {operators = [" x ", " ÷ ", " x ", " ÷ ", " ^ ", " ^ "]; allowedLayers = 2; maxInteger = {'x': 20, '÷': 20, '^': 3, '^b': 20}; minInteger = { 'x': -20, '÷': -20, '^': 2, '^b': -5}; decimals = 1;
    } else {operators = [" x ", " ÷ ", " x ", " ÷ ", " ^ ", " ^ "]; allowedLayers = 2; maxInteger = {'x': 30, '÷': 30, '^': 4, '^b': 20}; minInteger = { 'x': -30, '÷': -30, '^': 2, '^b': -5,}; decimals = 1
    }
  } else if (+grade === 9) {
    negativeanswers = true
    decimalanswers = true
    stressBedmas = true
    if (difficulty === 0) {operators = [" + ", " - ", " x ", " x ", " x "]; allowedLayers = 1; maxInteger = { '+': 50, '-': 50, 'x': 50, }; minInteger = { '+': -35, '-': -35, 'x': -35, }; decimals = 1;
    } else if (difficulty === 1) {operators = [" + ", " - ", " x ", " ÷ ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 50, '-': 50, 'x': 50, '÷': 50, }; minInteger = { '+': -35, '-': -35, 'x': -35, '÷': -35, }; decimals = 1;
    } else if (difficulty === 2) {operators = [" + ", " - ", " x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 20, '-': 20, 'x': 20, '÷': 20, }; minInteger = { '+': 1, '-': 1, 'x': 1, '÷': 1, }; decimals = 1;
    } else if (difficulty === 3) {operators = [" + ", " - ", " x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 20, '-': 20, 'x': 20, '÷': 20, }; minInteger = { '+': -10, '-': -10, 'x': -10, '÷': -10, }; decimals = 1;
    } else if (difficulty === 4) {operators = [" + ", " - ", " x ", " ÷ ", " x ", " ÷ "]; allowedLayers = 1; maxInteger = { '+': 30, '-': 30, 'x': 30, '÷': 30, }; minInteger = { '+': -20, '-': -20, 'x': -20, '÷': -20, }; decimals = 1;
    } else if (difficulty === 5) {operators = [" + ", " - ", " x ", " ÷ ", " ^ "]; allowedLayers = 2; maxInteger = { '+': 20, '-': 20, 'x': 20, '^': 6, '÷': 20, '^b': 5}; minInteger = { '+': -15, '-': -15, 'x': -15, '÷': -15, '^': 2, '^b': -5}; decimals = 1
    } else {operators = [" + ", " - ", " x ", " ÷ ", " x ", " ÷ ", " ^ ", " ^ "]; allowedLayers = 2; maxInteger = { '+': 30, '-': 30, 'x': 30, '÷': 30, '^': 6, '^b': 5}; minInteger = { '+': -30, '-': -30, 'x': -30, '÷': -30, '^': 2, '^b': -5}; decimals = 1;
    }
  } else {
        negativeanswers = true
    decimalanswers = true
    stressBedmas = true
    operators = [" + ", " - ", " x ", " ÷ ", " x ", " ÷ ", " ^ ", " ^ "]; 
    allowedLayers = 100;
    maxInteger = { '+': 30, '-': 30, 'x': 30, '÷': 30, '^': 6, '^b': 5};
    minInteger = { '+': -30, '-': -30, 'x': -30, '÷': -30, '^': 2, '^b': -5}; 
    decimals = 1;
  }
}

if (copy1 != null) {
  copy1.addEventListener("click",function(){
    copy(linkQueryString)
  })
}

if (copy2 != null) {
  copy2.addEventListener("click",function(){
    copy(linkViewerQueryString)
  })
}

function copy(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        return window.clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        } catch (ex) {
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}