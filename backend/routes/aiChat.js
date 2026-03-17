const express = require("express");
const { Gig } = require("../models/Gigmodel");
const { Service } = require("../models/Servicemodel");
const { askAI } = require("../utils/openaiService");
const router = express.Router();

// const { askAI } = require("../utils/openaiService");
// const Gig = require("../models/Gig");
// const Service = require("../models/Service");
router.post("/chat", async (req, res) => {

  try {

    const { messages } = req.body;

    const aiReply = await askAI(messages);

    let parsed;

    try {
      parsed = JSON.parse(aiReply);
    } catch {
      return res.json({ reply: aiReply });
    }

    // Check last user message for confirmation
    const lastUserMessage =
      messages[messages.length - 1]?.content?.toLowerCase() || "";

    const confirmWords = ["yes", "ok", "post", "confirm", "haa", "ho", "yes post"];

    const confirmed = confirmWords.some(word =>
      lastUserMessage.includes(word)
    );

    // If not confirmed → show preview
    if (!confirmed) {

      return res.json({
        reply: "Here is your task preview. Should I post it?",
        preview: parsed
      });

    }

    // Save Gig
    if (parsed.type === "gig") {

      const newGig = await Gig.create({
        title: parsed.title,
        description: parsed.description,
        state: parsed.state,
        district: parsed.district,
        location: parsed.location,
        category: parsed.category,
        date: parsed.date,
        contact: parsed.contact,
        postedBy: req.user._id,
      });

      return res.json({
        reply: "✅ Your gig has been posted successfully!",
        post: newGig
      });

    }

    // Save Service
    if (parsed.type === "service") {

      const newService = await Service.create({
        title: parsed.title,
        description: parsed.description,
        salary: parsed.salary,
        state: parsed.state,
        district: parsed.district,
        location: parsed.location,
        date: parsed.date,
        contact: parsed.contact,
        postedBy:  req.user._id, 

      });

      return res.json({
        reply: "✅ Your service job has been posted successfully!",
        post: newService
      });

    }

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "AI processing failed" });

  }

});

module.exports = router;


