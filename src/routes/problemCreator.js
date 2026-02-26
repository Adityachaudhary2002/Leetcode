const express=require('express');
const problemCreator=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,submittedProblem}=require("../controllers/userProblem").default;
const userMiddleware=require("../middleware/userMiddleware");

//create
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

problemRouter.get("problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem/",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser);
problemRouter.ger("/submittedProblem",userMiddleware,submittedProblem);

module.exports=problemRouter;
