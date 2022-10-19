let create = document.getElementById("create");
let sheets = document.getElementById("sheets");
let levelin = document.getElementById("levelin");
let gradein = document.getElementById("gradein");
let namein = document.getElementById("namein");
let sitem = document.getElementsByClassName("sheet")[0];

let linkSheetQuery = {}

let linkSheetBaseUrl = `https://jsworksheet.ganiskowicz.repl.co/teach?`
let linkSheetQueryString = linkSheetBaseUrl

parseQuery()

function sheetQueries() {
  let sheet = {}
  sheet.length = 0

  for (let i2 = 0; i2 < sheets.childNodes.length; i2++) {
      let data = sheets.childNodes[i2].getElementsByClassName("data")[0].innerHTML.split(":")
      let i = data[0].substring(1)
      let g = data[1].substring(1)
      let l = data[2].substring(1)
      let n = data[3].substring(4)
      sheet[`s${i2 + 1}`] = {}
      sheet[`s${i2 + 1}`].string = `i${i}:g${g}:l${l}:sname${n}`
      sheet[`s${i2 + 1}`].index = i
      sheet.length++
  }

  return sheet
}

function updateSheetLinkQuery() {
  let query = ""

  let ss = sheetQueries()
  for (let i = 1; i <= ss.length; i++) {
    // linkQuery[`q${i}`] = hist[`q${i}`]
    query = `${query}s${ss[`s${i}`].index}=${ss[`s${i}`].string}`
    if (i + 1 <= ss.length) {
      query = `${query}&`
    }
  }

  linkSheetQueryString = `${linkBaseUrl}${query}`
  window.history.replaceState(null, null, `/teach?${LZString.compressToBase64(query)}`);
}

function parseParameters(p) {
  let v = p.split(":")

  let index = v[0].substring(1)
  let grade = v[1].substring(1)
  let level = v[2].substring(1)
  let name = v[3].substring(5)

  return {index,grade,level,p,name}
}

function insertSheet(index,grade,level,name) {
  let sheetPos = +index;
  let sheetItem = sitem.cloneNode(true);
  let sheetData = sheetItem.getElementsByClassName("data")[0]
  let sheetPositionString = `${sheetPos}.`
  let sheetLevelString = level
  let sheetGradeString = grade
  let sheetNameString = name

  let sheetLevel = sheetItem.getElementsByClassName("slevel")[0]
  let sheetGrade = sheetItem.getElementsByClassName("sgrade")[0]
  let sheetName = sheetItem.getElementsByClassName("sname")[0]
  let sdata = `i${index}:g${grade}:l${level}:name${sheetNameString}`
  if (Math.ceil(sheetPos / 2) * 2 === sheetPos) {
    sheetItem.classList.add("hdark")
  }

  sheetData.innerHTML = sdata
  sheetLevel.innerHTML = sheetLevelString
  sheetName.innerHTML = sheetNameString
  sheetGrade.innerHTML = sheetGradeString
  sheets.insertBefore(sheetItem, sheets.childNodes[0])

  sheetItem.getElementsByClassName("copy")[0].addEventListener("click",function(){
    copy(`${linkBaseUrl}${LZString.compressToBase64(`t=0&g=${grade}&l=${level}&sname=${name}`)}`)
  })
}

function parseQuery() {
  let queryString = window.location.search;
  queryString = LZString.decompressFromBase64(queryString.substring(1))
  const urlParams = new URLSearchParams(queryString);

  let s = ""
  let i = 1
  let ss = []
  while (s !== null) {
    s = urlParams.get(`s${i}`)
    console.log(s)
    if (s!==null) {
      let p = parseParameters(s)
      ss[i-1] = p
    }
    i++
  }
  if (sheets !== null) {
    for (let i = 0;i<ss.length;i++) {
      let p = ss[i]
      insertSheet(p.index,p.grade,p.level,p.name)
    }
  }
  updateSheetLinkQuery()
}

function createSheet() {
  let grade = gradein.value.substring(6)
  let level = levelin.value.substring(6)
  let name = namein.value
  if (name === "") {
    name = "Untitled Worksheet"
  }
  insertSheet(document.getElementById("sheets").childNodes.length+1,grade,level,name)
  updateSheetLinkQuery()
}

create.addEventListener("click",function(){
  createSheet()
})