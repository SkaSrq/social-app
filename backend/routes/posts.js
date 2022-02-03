const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User')

// create a post
router.post('/', async (req, res)=>{
    const newPost = new Post({
        description:req.body?.description,
        image:req.body?.image,
    });
    try {
        const user = await User.findById(req.body.userId);
        !user && res.status(404).json("user not found");
        const savedPost = await newPost.save();
        if(!user.posts.includes(savedPost._id)){
            await user.updateOne({$push:{posts:savedPost._id}})
            res.status(200).json(savedPost);
        }else{
            res.status(500).json("You already have this post");
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }
});
// update a post 
router.put('/:id', async (req, res)=>{
    const {userId, ...postParams} = req.body;
    try {
        const user = await User.findById(req.body.userId);
        !user && res.status(404).json("user not found");
        const post = await Post.findById(req.params.id);
        !post && res.status(404).json("post not found");
        if(user.posts.includes(post._id)){
            await post.updateOne({$set:postParams});
            res.status(200).json("Post has been updated");
        }
        else{
            res.status(500).json("You can only update your post");
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }
});
// delete a post
router.delete('/:id', async (req, res)=>{
    try {
        const user = await User.findById(req.body.userId);
        !user && res.status(404).json("user not found");
        const post = await Post.findById(req.params.id);
        !post && res.status(404).json("post not found");
        if(user.posts.includes(post._id)){
            await user.updateOne({$pull:{posts:post._id}})
            await post.deleteOne();
            res.status(200).json("Post has been deleted");
        }
        else{
            res.status(500).json("You can only delete your post");
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }
});
// like or unlike a post
router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        !post && res.status(404).json("post not found");
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked");

        }else{
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been unliked");
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
// get a post
router.get("/:id", async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
// get timeline posts

router.get("/timeline/all", async(req, res)=>{
    console.log("timeline triggered");
    try {
        const currentUser = await User.findById(req.body.userId);
        !currentUser && res.status(404).json("currentUser not found");
        console.log("User Found");
        const userPosts = await Promise.all(
            currentUser.posts.map((postId)=>{
                return Post.findById(postId);
            })
        );
        // console.log("userPost: ",userPosts);
        // const friendPosts = await currentUser.followings.map(async(friendId)=>
        //     {
        //         console.log("friendId: ",friendId)
        //         const friend = await User.findById(friendId);
        //         console.log("friend",friend);
        //             await friend?.posts.map(async(postId)=>
        //             {
        //                 console.log("PostId: ",postId);
        //                 const friendPost = await Post.findById(postId);
        //                 console.log("pushing to array, friendPost: ",friendPost);
        //                 return friendPost;
        //             });
        //     })

        const friendPosts = await Promise.all(
            currentUser.followings.map(async(friendId)=>{
                const friend = await User.findById(friendId);
                console.log("friendId: ",friendId);
                const posts = await Promise.all( friend?.posts.map(async(postId)=>{
                    console.log("postid: ", postId);
                    const post = await Post.findById(postId);
                    return post;
                }))
                return posts;
            })
        );
            
        console.log("Friend Posts: ",friendPosts);
        res.status(200).json(userPosts.concat(...friendPosts));
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


module.exports = router