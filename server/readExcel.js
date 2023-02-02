const reader = require("xlsx");
const fs = require("fs");

exports.readExcelFile = (file_path) => {
  const file = reader.readFile(`${file_path}`);

  // data Array Gives you the Full Rows from the Given Excel File as result
  let validated_rows = [];

  let result;
  //data Array Gives you the Rows with Wrong MOB Numbers from the Given Excel File as result
  let removed_rows = [];

  try {
    const sheets = file.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        if (res.MOB.toString().length !== 10) {
          removed_rows.push(res);
        } else {
          validated_rows.push(res);
        }
      });
    }
    result = {
      type: "success",
      data: {
        validated_rows: validated_rows,
        removed_rows: removed_rows,
      },
    };
  } catch (error) {
    console.log(error.message)
    result = { type: "error", data: {} };
  }

  return result;
};
