const pool = require("../db/pool");
const authenticateJWT = require("./authentication/authenticateJWT")

async function allPosts(req,res,next){
    try{
        const { rows } = await pool.query("SELECT * FROM posts")
        return res.status(200).json({ posts: rows})
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}

async function getPost(req,res,next){
    const postId = req.params.postId
    try{
        const { rows } = await pool.query("SELECT * FROM posts WHERE id = $1",[postId])

        if(!rows[0]){
            return res.status(404).json({ message:"No post found?"})
        }else{
            return res.status(200).json({ post: rows[0]})
        }
        
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}
async function deletePost(req, res) {
    const postId = req.params.postId;
    try {
        const { rows } = await pool.query("SELECT users.username FROM users JOIN posts ON users.id = posts.userId WHERE posts.id = $1",[postId]);

        const user = rows[0];

        if (!user) {
            return res.status(404).json({message: "No post found!"});
        }
        
        if (req.user !== user.username) {
            return res.status(401).json({message: "You are NOT the author of this post!"});
        }
    } catch (err) {
        console.error(err); 
        return res.status(500).json({message: "Something went wrong with our database!" });
    }

    try {
        await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
        return res.status(200).json({message: "Post Deleted"});
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ message: "Something went wrong with our database!" });
    }
}

async function authorPosts(req,res){
    const authorId = req.params.authorId
    try{
        const { rows } = await pool.query("SELECT * FROM posts WHERE userId = $1",[authorId])

        if(!rows[0]){
            return res.status(200).json({ message:"User has no posts"})
        }else{
            return res.status(200).json({ posts: rows})
        }
        
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}


async function addPost(req, res) {
    const { title,text } = req.body;

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [req.user]);
        
        if (!rows[0]) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = rows[0];
        if (!user.author){
            return res.status(401).json({ message:"User is NOT a AUTHOR"})
        }

        try {
            await pool.query("INSERT INTO posts (title,text,userId) VALUES ($1, $2, $3)", [title, text, user.id]);
            return res.status(201).json({message: "Post added successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message:"Something went wrong while adding the post!" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message:"Something went wrong with our database!"});
    }
}

module.exports = {
    getAllPosts: [authenticateJWT,allPosts],
    getSpecificPost: [authenticateJWT,getPost],
    getAuthorPosts: [authenticateJWT,authorPosts],
    deleteAPost: [authenticateJWT,deletePost],
    addPost: [authenticateJWT,addPost]
}
