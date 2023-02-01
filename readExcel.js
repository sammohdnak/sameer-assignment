
const reader = require('xlsx')
const fs = require('fs');


const readExcelFile =  ()=>{
const file =  reader.readFile(`./data/IT MNC CORP7 BANG (228528).xlsx`)

//data Array Gives you the Full Rows from the Given Excel File as result
let data = []

//data Array Gives you the Rows with Wrong MOB Numbers from the Given Excel File as result
let tempArray=[]

const sheets = file.SheetNames

for(let i = 0; i < sheets.length; i++)
{
const temp = reader.utils.sheet_to_json(
		file.Sheets[file.SheetNames[i]])
temp.forEach((res) => {
	data.push(res)
    if(res.MOB.toString().length!==10){
        tempArray.push(res)
    }
})
}







return tempArray
}

//The Below Console will give you the Number of Rows with wrong mobile numbers
console.log(readExcelFile().length)

