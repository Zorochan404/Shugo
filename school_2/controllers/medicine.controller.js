import Medicine from "../models/medicine.js"; 
import { openAiApiKey } from "../config/env.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import User from "../models/user.js";

export const createMedicine = async (req, res, next) => {
    const { userId, name, exp, imgurl } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Predefined categories
    const categories = ["fever", "gas", "cold", "pain relief", "allergy", "infection"];

    const llm = new ChatGoogleGenerativeAI({
        apiKey: openAiApiKey,
        safetySettings: false,
        model: "gemini-1.5-pro"
    });

    const promptTemplate = new PromptTemplate({
        template: `Given the medicine "{medicine}", provide a JSON response in this format:
        {{
          "category": An array containing any number of values from {categories},
          "disposal": "A brief description of how to dispose of the medicine safely."
        }}
        Ensure the response is valid JSON with no extra text.`,
        inputVariables: ["medicine", "categories"],
    });

    const tweetChain = promptTemplate.pipe(llm);

    try {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Fetch AI-generated category and disposal info
        const response = await tweetChain.invoke({
            medicine: name,
            categories: JSON.stringify(categories),
        });

        console.log("AI Full Response:", response);

        let medicineDetails;
        try {
            // Extract valid JSON
            const jsonMatch = response.content.match(/\{.*\}/s);
            if (!jsonMatch) {
                return res.status(500).json({ success: false, message: "AI response does not contain valid JSON." });
            }
            const jsonText = jsonMatch[0];

            medicineDetails = JSON.parse(jsonText);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Invalid JSON response from AI." });
        }

        // Validate AI-generated categories (case insensitive check)
        if (!Array.isArray(medicineDetails.category) ||
            !medicineDetails.category.every(cat => categories.includes(cat.toLowerCase()))) {
            return res.status(400).json({ success: false, message: "Invalid categories returned from AI." });
        }

        // Create the new medicine
        const newMedicine = await Medicine.create({
            name,
            exp,
            category: medicineDetails.category,
            disposal: medicineDetails.disposal,
            imgurl
        });

        // Add the medicine to the user's medicines array
        user.medicines.push(newMedicine._id);
        await user.save();

        res.status(201).json({ success: true, data: newMedicine });
    } catch (e) {
        next(e);
    }
};



export const getMedicine = async (req, res, next) => {
    try {
        const Medicines = await Medicine.find();

        res.status(200).json({ success: true, data: Medicines });
    } catch (e) {
        next(e);
    }
};

export const getMedicinebyUser = async (req, res, next) => {
    try {
        const { userId } = req.body; // Assuming userId is sent in the request body

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId).populate("medicines");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user.medicines });
    } catch (e) {
        next(e);
    }
};

export const updateMedicineById = async (req, res, next) => {
    try {
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ success: false, message: "Medicine not found" });
        }

        res.status(200).json({ success: true, data: updatedMedicine });
    } catch (e) {
        next(e);
    }
};

export const deleteMedicineById = async (req, res, next) => {
    try {
        const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);

        if (!deletedMedicine) {
            return res.status(404).json({ success: false, message: "Medicine not found" });
        }

        res.status(200).json({ success: true, message: "Medicine deleted successfully" });
    } catch (e) {
        next(e);
    }
};
