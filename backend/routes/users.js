const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')


// update user
router.put('/:id', async (req, res)=>{
    if(req.body.userId === req.params.id || req.body?.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(error){
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (error) {
            return res.status(500).json(error);
        }

    }else{
        return res.status(403).json("You can only update your account!");
    }
} );
// delete user
router.delete('/:id', async (req, res)=>{
    if(req.body.userId === req.params.id || req.body?.isAdmin){
        let user;
        try {
            user = await User.findOne({_id: req.params.id});
            !user && res.status(404).json("user not found");
        } catch (error) {
            console.error(error);
            res.status(404).json(error);
        }
        try {
            await User.deleteOne(user);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }

    }else{
        return res.status(403).json("You can delete only your account!");
    }
} );
// get a user
router.get("/:id", async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(404).json("user not found");
        const {password,updatedAt, ...other} = user._doc;

        res.status(200).json(other);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})
// follow a user
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await currentUser.updateOne({$push:{followings: req.params.id}});
                res.status(200).json("user has been followed");
            }
            else{
                console.log("You already follow this user");
                res.status(403).json("You already follow this user");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    else{
        console.log(error);
        res.status(403).json("You can't follow yourself");
    }
});
// unfollow user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers: req.body.userId}});
                await currentUser.updateOne({$pull:{followings: req.params.id}});
                res.status(200).json("user has been unfollowed");
            }
            else{
                console.log("You don't follow this user");
                res.status(403).json("You don't follow this user");
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
    else{
        console.log(error);
        res.status(403).json("You can't follow yourself");
    }
});
module.exports = router;