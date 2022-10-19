let student = document.getElementById("student");
let sheetnameel = document.getElementById("sheetname");
parseQuery()

function parseParameters(p) {
  let v = p.split(":")

  let index = v[0].substring(1)
  let grade = v[1].substring(1)
  let level = v[2].substring(1)
  let mark = v[3].substring(1)
  let totalQuestions = v[4].substring(1)
  let time = v[5].substring(1)

  return {index,grade,level,mark,totalQuestions,time,p}
}

function parseQuery() {
  let queryString = window.location.search+"";
  queryString = LZString.decompressFromBase64(queryString.substring(1))
  const urlParams = new URLSearchParams(queryString);

  let q = ""
  let i = 1
  let h = []
  while (q !== null) {
    q = urlParams.get(`q${i}`)
    if (q!==null) {
      let p = parseParameters(q)
      h[i-1] = p
    }
    i++
  }
  if (history !== null) {
    for (let i = 0;i<h.length;i++) {
      let p = h[i]
      insertHistory(p.index,p.grade,p.level,p.mark,p.totalQuestions,p.time)
      correct += +p.mark
      total += +p.totalQuestions
    }
  }
  if (total !== 0 && accuracy !== null) {
    accuracyString = `${correct}/${total} (${correct / total * 100}%)`
    accuracy.innerHTML = accuracyString
  }
  let t = urlParams.get(`t`)
  if (t !== null && time !== null) {
    timeNum += +t
    elapsed += +t
    time.innerHTML = toTime(timeNum)
  }
  let g = urlParams.get(`g`)
  if (g !== null && level !== null) {
    setGrade(`nav${g}`)
  }
  let l = urlParams.get(`l`)
  if (l !== null && level !== null) {
    difficulty = l-1
  }
  let name = urlParams.get(`name`)
  if (!(name === null || name === "null")) {
    username = name
  } else {
    content.style.display = "none"
    userprompt.style.display = ""
    document.getElementById("teach").style.display = "none"
  }
  if (!(name === null || name === "null") && student !== null) {
    student.innerHTML = name
  }
  let sname = urlParams.get(`sname`)
  if (!(sname === null || sname === "null") && sheetnameel !== null) {
    sheetnameel.innerHTML = sname
    sheetnameel.style.display = ""
    sheetname = sname
  } else if (sheetnameel !== null) {
    sheetnameel.innerHTML = "N/A"
  }
  if (main !== null) {
    updateLinkQuery()
    generate()
  }
}