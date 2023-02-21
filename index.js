let express = require('express');
let mongoose = require('mongoose');
let cors=require('cors');


let app=express();
app
.use(cors())
.use(express.json());

let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let User = mongoose.model("database",Schema({
    _id : ObjectId,
    title : String,
    firstname : String,
    lastname : String,
    city : String,
    power : String
}));
let url = "mongodb+srv://deepaksiaz:Pfc7MR6CXIBaHHxK@cluster0.6kwuvfp.mongodb.net/db?retryWrites=true&w=majority"
mongoose.connect(url)
.then(res => console.log("DB Connected"))
.catch(err => console.log("Error ", err))

//Server Listening
const port = 4000;
app.listen(port,'localhost',function(err)
{
    if(err)
    {
    console.log(err);
    }
    else
    console.log('Express server started at port no : ' + port );
});



app.get('/data',(req, res) => {
    User.find()
      .then((data) => {
        res.send(data);
      }).catch((err) => { res.status(500).send({ message: err.message }); });
  })

app.get('/data/:id',function(req,res)
{
    User.findById({_id:req.params.id})
    .then((data)=>{
        if(!data)
        {
            res.status(404).send({
                message:`user not found.`
            })
        }
            else
            {
                res.send(data)
            }
    }).catch(err=>res.status(500).send({message:err.message}))
})
app.post('/data',(req, res) => {
    let user = new User(req.body);
    user.save()
      .then((data) => {
        res.send({ message: 'User added' });
        console.log('User Added : ' + data.firstname);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
        console.log(err.message);
      });
  })

app.delete('/data/:uid',(req, res) => {
    User.findByIdAndDelete({ _id: req.params.uid })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `User not found.`
          });
        } else {
          res.send({
            message: "User deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: err.message
        });
      });
  })

app.put('/data/:id',(req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, req.body).then(data => {
      if (!data)
        res.send("user not found");

      else
        res.send("User Update Sucessfully");
    }).catch((err) => res.status(500).send({ message: err.message }));
  })