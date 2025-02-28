import Prescription from "../models/pescription.js"; 
import { openAiApiKey } from "../config/env.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import Tesseract from "tesseract.js";
import Medicine from "../models/medicine.js";
import User from "../models/user.js";



export const createPrescriptionFromImage = async (req, res, next) => {
    const { imageUrl, userId, manualEntry } = req.body;

    try {
        let extractedText = '';

        if (imageUrl) {
            console.log("Processing OCR for image:", imageUrl);

            const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
                logger: (m) => console.log(m) 
            });

            extractedText = text.trim();
            console.log("Raw OCR Extracted Text:", extractedText);
        }

        if (!extractedText && !manualEntry) {
            return res.status(400).json({ success: false, message: "No valid text found. Please enter prescription manually." });
        }

        const cleanedText = manualEntry || preprocessOCRText(extractedText);
        console.log("Cleaned OCR Text:", cleanedText);

        const prescriptionDetails = await getPrescriptionData(cleanedText);
        if (!prescriptionDetails) {
            return res.status(400).json({ success: false, message: "AI failed to extract data. Please enter manually." });
        }

        console.log("Extracted Prescription Data:", prescriptionDetails);

        const medicineIds = await Promise.all(
            prescriptionDetails.medicines.map(async (medicineName) => {
                let medicine = await Medicine.findOne({ name: medicineName.trim() });
                if (!medicine) {
                    medicine = await Medicine.create({ name: medicineName, category: prescriptionDetails.category });
                }
                return medicine._id;
            })
        );

        const newPrescription = await Prescription.create({
            medicines: medicineIds,
            users: [userId],
            dose: prescriptionDetails.dose.map(d => ({
                medicine: d.medicine,
                dosage: d.dosage,
                instructions: d.instructions,
                duration: d.duration  
            })),
        });

        const populatedPrescription = await Prescription.findById(newPrescription._id)
    .populate('medicines') // Populates the medicines field
    .populate('users');

    const populateUser = await User.findByIdAndUpdate(
        userId,
        {prescriptions: newPrescription.id},
        { new: true, runValidators: true }
    )

        res.status(201).json({ success: true, data: newPrescription });

    } catch (e) {
        console.error("Error:", e);
        next(e);
    }

};

async function getPrescriptionData(cleanedText) {
    const llm = new ChatGoogleGenerativeAI({
        apiKey: openAiApiKey,
        safetySettings: false,
        model: "gemini-1.5-pro"
    });

    const promptTemplate = (text) => new PromptTemplate({
        template: `Extract structured details from the provided medical document and return a JSON:
        {{
          "medicines": ["List of medicines mentioned"],
          "dose": [
            {{
              "medicine": "Medicine Name",
              "dosage": "Dosage amount",
              "instructions": "Usage details (e.g., Before food, After food, Twice daily, etc.)",
              "duration": "Duration in days for how long to use the medicine"
            }}
          ],
          "category": ["General category like infection, pain relief, etc."]
        }}
        Text: "{text}"
        Ensure the response is valid JSON with no extra text.`,
        inputVariables: ["text"],
    });

    try {
        let llmResponse = await promptTemplate(cleanedText).pipe(llm).invoke({ text: cleanedText });
        return extractJSON(llmResponse.content);
    } catch (error) {
        console.error("AI Processing Failed:", error);
        if (error.message.includes("Candidate was blocked")) {
            console.log("Retrying with a different prompt...");
            const safePrompt = new PromptTemplate({
                template: `Summarize the following document in structured format:
                {{
                  "medicines": ["Extracted medicine names"],
                  "dose": [
                    {{
                      "medicine": "Medicine Name",
                      "dosage": "Dosage amount",
                      "instructions": "Usage details",
                      "duration": "Duration in days"
                    }}
                  ],
                  "category": ["General category"]
                }}
                Text: "{text}"
                Return valid JSON only.`,
                inputVariables: ["text"],
            });
            const retryResponse = await safePrompt.pipe(llm).invoke({ text: cleanedText });
            return extractJSON(retryResponse.content);
        }
        return null;
    }
}


function extractJSON(text) {
    try {
        const match = text.match(/\{[\s\S]*\}/); // Extract JSON content
        return match ? JSON.parse(match[0]) : null;
    } catch (e) {
        console.error("JSON Parsing Error:", e);
        return null;
    }
}




const preprocessOCRText = (text) => {
    return text
        .replace(/Dr\..*?(Care|Clinic)/gi, "") 
        .replace(/\b(?:MBBS|MD|Timing|Follow Ups|Advice|Signature|Charts|Total|Patient|Bank|Phone|Date|No|Ref)\b/gi, "") 
        .replace(/\b\d{4,}\b/g, "") 
        .replace(/[^\w\s.\-%]/g, "")
        .replace(/\n+/g, " ")
        .trim();
};



export const getPrecriptionbyUser = async (req, res, next) => {
    try {
        const { userId } = req.body; 

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId).populate("prescriptions");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user.prescriptions });
    } catch (e) {
        next(e);
    }
};


export const getPrescription = async (req, res, next) => {
    try {
        const Prescriptions = await Prescription.find();

        res.status(200).json({ success: true, data: Prescriptions });
    } catch (e) {
        next(e);
    }
};


export const updatePrescriptionById = async (req, res, next) => {
    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
 
        if (!updatedPrescription) {
            return res.status(404).json({ success: false, message: "Prescription not found" });
        }

        res.status(200).json({ success: true, data: updatedPrescription });
    } catch (e) {
        next(e);
    }
};


export const deletePrescriptionById = async (req, res, next) => {
    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);

        if (!deletedPrescription) {
            return res.status(404).json({ success: false, message: "Prescription not found" });
        }

        res.status(200).json({ success: true, message: "Prescription deleted successfully" });
    } catch (e) {
        next(e);
    }
};

