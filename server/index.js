const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const fileUpload = require("express-fileupload");

const bodyParser = require("body-parser");
const { readExcelFile } = require("./readExcel");

const PORT = process.env.port || 5001;

const dbo = require("./mongoDb/conn");
const { getMNCData, insertMNCData, deleteMNCData } = require("./mongoDb/mongoFunctions");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());

app.listen(PORT, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);

  });
  console.log(`Server Listening to Port ${PORT}`);
});

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("/getDBData", async(request, response) => {
  await getMNCData(dbo,response)

});

app.post("/insert", async (request, response) => {
  let data = request.body.data_to_insert
  console.log(data)
  let result = await insertMNCData(dbo,data)

  if(result.type==='success'){
    response.json({type:'success',data:result});
  }else{
    response.json({type:'error',data:{}});
  }
  
});

app.delete("/delete", async(request, response) => {
  let result = await deleteMNCData(dbo)
  console.log(result)
  if(result.type==='success'){
    response.json({type:'success',data:result});
  }else{
    response.json({type:'error',data:{}});
  }
  });

app.post("/upload", async (req, res, next) => {
  
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  await uploadFile.mv(`${__dirname}/${fileName}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  try {
    let result = await readExcelFile(`${__dirname}/${fileName}`);
    if(result.type==='error'){
      res.json({type:'error',data:[]})
    }else{
      let result_delete = await deleteMNCData(dbo)
      let result_insert = await insertMNCData(dbo,result.data.validated_rows)
      if(result_delete.type==='error'||result_insert.type==='error'){
        res.json({type:'error',data:'Database Insert Error'})
      }else{
        res.json({type:'success',data:{
          inserted : result.data.validated_rows.length,
          removed : result.data.removed_rows.length
        }})
      }
      
    }
  } catch (error) {
    
    res.json({type:'error',data:'Excel Read Error'})
  }
  

  });
