import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import autoIncrement from 'mongoose-auto-increment';
import Routes from './server/route.js';

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    dob:Date,
    gender:String,
    designation:String,
    phonenumber:String,
    email: String,
    password: String,
    terms:String
})
// autoIncrement.initialize(mongoose.connection);
// userSchema.plugin(autoIncrement.plugin, 'user');
// we need to turn it into a model

const User = new mongoose.model("User", userSchema)

export const getUsers = async (request, response) => {
    // Step -1 // Test API
    // response.send('Code for Interview');
    try{
        // finding something inside a model is time taking, so we need to add await
        const users = await User.find();
        response.status(200).json(users);
    }catch( error ){
        response.status(404).json({ message: error.message })
    }
}

// Save data of the user in database
export const addUser = async (request, response) => {
    // retreive the info of user from frontend
    const user = request.body;
    console.log("inside")

    const newUser = new User(user);
    try{
        await newUser.save();
        response.status(201).json(newUser);
    } catch (error){
        response.status(409).json({ message: error.message});     
    }
}

// Get a user by id
export const getUserById = async (request, response) => {
    try{
        const user = await User.findById(request.params.id);
        response.status(200).json(user);
    }catch( error ){
        response.status(404).json({ message: error.message })
    }
}

// Save data of edited user in the database
export const editUser = async (request, response) => {
    let user = await User.findById(request.params.id);
    user = request.body;

    const editUser = new User(user);
    try{
        await User.updateOne({_id: request.params.id}, editUser);
        response.status(201).json(editUser);
    } catch (error){
        response.status(409).json({ message: error.message});     
    }
}

// deleting data of user from the database
export const deleteUser = async (request, response) => {
    try{
        await User.deleteOne({_id: request.params.id});
        response.status(201).json("User deleted Successfully");
    } catch (error){
        response.status(409).json({ message: error.message});     
    }
}


//Routes

app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 
app.post("/register", (req, res)=> {
    const { name,dob,gender,designation,phonenumber, email, password,terms} = req.body
    User.findOne({email: email}&&{phonenumber:phonenumber}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        }
        
         else {
 
            const user = new User({
                name,
                dob,
                gender,
                designation,
                phonenumber,
                email,
                password,
                terms
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.use('/users', Routes);


app.get('/', getUsers);
app.post('/add', addUser);
app.get('/:id', getUserById);
app.put('/:id', editUser);
app.delete('/:id', deleteUser);

app.listen(9002,() => {
    console.log("BE started at port 9002")
})
