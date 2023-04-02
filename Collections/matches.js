const Matches = require("./Model");
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const matchesRouter = express.Router();

const getAllMatches = async (req, res) => {
  const matches = await Matches.find({});
  res.status(StatusCodes.OK).json({ matches });
};

matchesRouter.route("/create-match").get(getAllMatches);

module.exports = matchesRouter;
