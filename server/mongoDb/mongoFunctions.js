

exports.getMNCData = async (dbo,response)=>{
    
    try {
        let db_connect = dbo.getDb();
         db_connect
        .collection("mnc_it_contacts")
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            response.json({type:'success',data:result});
            });
        
          
    } catch (error) {
        response.json({type:'error',data:error.message});
    }
    
   
}

exports.insertMNCData = async (dbo,data)=>{

    let result_data

    try {
        let db_connect = dbo.getDb();
      result_data = db_connect
      .collection("mnc_it_contacts")
      .insertMany(data)
      .then(res=>({type:'success',data:res.insertedCount}))
    } catch (error) {
        result_data ={type:'error',data : error.message}
    }
    return result_data
}

exports.deleteMNCData = async (dbo)=>{

    let result_data ={type:'error',data : []}

    try {
      let db_connect = dbo.getDb();
      result_data =  db_connect
      .collection("mnc_it_contacts")
      .deleteMany()
      .then(res=>({type:'success',data:res.deletedCount}))
    } catch (error) {
        result_data ={type:'error',data : error.message}
    }
 
    return result_data
}


