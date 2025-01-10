const pool = require("../db/pool");
const authenticateJWT = require("./authentication/authenticateJWT")

async function allComments(req,res,next){
    try{
        const { rows } = await pool.query("SELECT * FROM comments")
        return res.status(200).json({ comments: rows})
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}

async function getComment(req,res,next){
    const commentId = req.params.commentId
    try{
        const { rows } = await pool.query("SELECT * FROM comments WHERE id = $1",[commentId])

        if(!rows[0]){
            return res.status(404).json({ message:"No comment found?"})
        }else{
            return res.status(200).json({ comment: rows[0]})
        }
        
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}
async function deleteComment(req, res) {
    const commentId = req.params.commentId;
    try {
        const { rows } = await pool.query("SELECT users.username FROM users JOIN posts ON users.id = posts.userId WHERE posts.id = (SELECT comments.postId FROM comments JOIN posts ON comments.postId = posts.id WHERE comments.id = $1)",[commentId]);

        const user = rows[0];

        if (!user) {
            return res.status(404).json({message: "No comment found!"});
        }
        
        if (req.user !== user.username) {
            return res.status(401).json({message: "You are NOT the author of this post!"});
        }
    } catch (err) {
        console.error(err); 
        return res.status(500).json({message: "Something went wrong with our database!" });
    }

    try {
        await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);
        return res.status(200).json({message: "Comment Deleted"});
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ message: "Something went wrong with our database!" });
    }
}

async function postComments(req,res){
    const postId = req.params.postId
    try{
        const { rows } = await pool.query("SELECT * FROM comments WHERE postId = $1",[postId])

        if(!rows[0]){
            return res.status(200).json({ message:"Post has no comments!"})
        }else{
            return res.status(200).json({ comments: rows})
        }
        
    }
    catch{
        return res.status(500).json({ message:"Something went wrong with our database!"})
    }
}

async function addComment(req, res) {
    const postId = req.params.postId;
    const { comment } = req.body;

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [req.user]);
        
        if (!rows[0]) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const userId = rows[0].id;

        try {
            await pool.query("INSERT INTO comments (comment, postId, userId) VALUES ($1, $2, $3)", [comment, postId, userId]);
            return res.status(201).json({message: "Comment added successfully"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message:"Something went wrong while adding the comment!" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message:"Something went wrong with our database!"});
    }
}
module.exports = {
    getAllComments: [authenticateJWT,allComments],
    getSpecificComment: [authenticateJWT,getComment],
    getPostComments: [authenticateJWT,postComments],
    deleteAComment: [authenticateJWT,deleteComment],
    addComment: [authenticateJWT,addComment]
}
