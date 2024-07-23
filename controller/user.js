const User = require ("../models/user");

async function handleGetAllUsers(req,res){
    const allDbUsers = await User.find({});
    return res.json({ allDbUsers });
}

async function handleGetUserById(req,res){
    const user = await User.findById(req.params.id);
  
      if (user) {
        return res.json({ user });
      } else {
        //status code 404 not found
        return res.status(404).json({ error: "User not found" });
      }
}

async function handleUpdateUserById(req,res){
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id, 
          req.body, 
          { new: true, runValidators: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ msg: "User not found" });
        }
    
        return res.json({ msg: "Success", user: updatedUser });
      } catch (error) {
        return res.status(500).json({ msg: "Error updating user", error: error.message });
      }
}

async function handleDeleteUserById(req,res){
    await User.findByIdAndDelete(req.params.id);
    return res.json({msg : "Success"})
}

async function handleCreateNewUser(req,res){
    const body = req.body;
    if (
      !body ||
      !body.first_name ||
      !body.last_name ||
      !body.email ||
      !body.gender ||
      !body.job_title
    ) {
      return res
        .status(400)
        .json({ msg: "All fields are required...Must fill it " });
    }
    const result = await User.create({
      firstName: body.first_name,
      lastName : body.last_name,
      email :body.email,
      gender : body.gender,
      jobTitle : body.job_title
    })
    console.log(result);
    return res.status(201).json({msg :"Success", id : result._id})
}
module.exports = {handleGetAllUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleUpdateUserById,
    handleCreateNewUser
}