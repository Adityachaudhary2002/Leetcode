const express=require('express');
const problemCreator=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const createProblem=require("../controllers/userProblem");


//create
problemRouter.post("/create",adminMiddleware,createProblem);
// problemRouter.patch("/:id",updateProblem);
// problemRouter.delete("/:id",deleteProblem);

// problemRouter.get("/:id",getProblemById);
// problemRouter.get("/",getAllProblem);
// problemRouter.get("/user",solvedAllProblembyuser);

module.exports=problemRouter;
