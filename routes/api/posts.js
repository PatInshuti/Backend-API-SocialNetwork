const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Load Post model
const Post = require('../../models/Post');

//Load PROFILE MODEL
const Profile = require('../../models/Profile');

//Validation
const validatePostInput = require("../../validation/post");


//@route Get api/posts/test
//@desc Test posts route
//@access public
router.get("/test", (req, res) => res.json({msg:'posts works'}) );

//@route Get api/posts
//@desc GET post
//@access public
router.get('/', (req, res)=>{
    Post.find()
        .sort({date:-1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound:'no posts found'}));
})


//@route Get api/posts/:id
//@desc Get post by ID
//@access public
router.get('/:id', (req, res)=>{
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound:'no post found with this ID'}));
});





//@route Get api/posts
//@desc Create post
//@access private

router.post('/', passport.authenticate('jwt', {session:false}), (req, res) =>{
    const {errors, isValid} = validatePostInput(req.body);

    if(!isValid){
        //if any errors
        res.status(400).json(errors);
    }

    const newPost = new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });
    
    newPost.save().then(post => res.json(post));
});


//@route Get api/posts
//@desc Create post
//@access private

router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {
            //check if post exist
            if (!post) res.status(404).json({postnotfound:"the post you want to delete doesnot exist"});

            //Check if user is the owner
            if(post.user.toString() !== req.user.id){
                res.status(404).json({usernotowner:'Unauthorized to delete post'});
            }

            console.log(req.user);
            post.remove()
                .then(()=> res.json({sucess:true}))
                .catch(err => res.status(400).json(err));
        })
});


//@route POST api/posts/like/:id
//@desc Like post
//@access private

router.post('/like/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {
            //check if post exist
            if (!post) res.status(404).json({postnotfound:"the post you want to delete doesnot exist"});

            //Check if User already liked post
            post.likes.forEach(singleLike => {
                if(singleLike.user.toString() === req.user.id) res.status(400).json({unabletolike:"you have already liked"});
            });
            //Add user.id to a like to post
            post.likes.unshift({user:req.user.id});

            post.save().then(post=> res.json(post));        
        })
        .catch(err => res.status(400).json(err));
});

//@route POST api/posts/like/:id
//@desc UNLike post
//@access private

router.post('/unlike/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {
            //check if post exist
            if (!post) res.status(404).json({postnotfound:"the post you want to delete doesnot exist"});

            //Check if did not liked post
            post.likes.forEach(singleLike => {
                if(singleLike.user.toString() !== req.user.id) res.status(400).json({unabletounlike:"you have never liked this post in the first place"});
            });

            //Remove User id from the likes array
            // const removeIndex = post.likes
            //     .map(item => item.user.toString())
            //     .index(req.user.id);

            //splice it out of array
            // post.likes.splice(removeIndex, 1);    

            for(var i =0; i<post.likes.length; i++){
                if(post.likes[i].user.toString() === req.user.id){
                    //remove this like by removing user id from this likes Array
                    post.likes.splice(i,1);
                }
            }

            post.save().then(post=> res.json(post));        
        })
        .catch(err => res.status(400).json(err));
});

//@route POST api/posts/comment/:id
//@desc Add comment
//@access private

router.post('/comment/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {
            const newcomment = {
                text:req.body.text,
                name:req.body.name,
                avatar:req.user.avatar,
                user: req.user.id,
            }

            console.log(req.user);

            //Add to comment array
            post.comments.unshift(newcomment);

            //Save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({postnotfound:'post not found'}));
})



//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete comment from post
//@access private

router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {

            //check to see if comment exists
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                return res.status(400).json({commentnotfound:'comment you tried to delete does not exist'});
            }

            //Get Remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
                
            //Splice comment out of array
            post.comments.splice(removeIndex, 1);

            //Save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({postnotfound:'post not found'}));
})
module.exports = router;