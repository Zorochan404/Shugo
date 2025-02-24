import Medicine from "../models/medicine.js";

export const createMedicine = async (req, res, next) => {
    try {
        const newMedicine = await Medicine.create({ ...req.body });

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
