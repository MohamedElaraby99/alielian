import StageCategory from "../models/stageCategory.model.js";
import Stage from "../models/stage.model.js";
import AppError from "../utils/error.utils.js";

export const listCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search = "", status } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const categories = await StageCategory.find(query)
      .populate("stages", "name status")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await StageCategory.countDocuments(query);
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: { categories, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } },
    });
  } catch (e) {
    next(new AppError(e.message, 500));
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const cat = await StageCategory.findById(req.params.id).populate("stages", "name status");
    if (!cat) return next(new AppError("Category not found", 404));
    res.status(200).json({ success: true, message: "Category fetched", data: { category: cat } });
  } catch (e) {
    next(new AppError(e.message, 500));
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description = "", stages = [], status = "active" } = req.body;
    if (!name) return next(new AppError("Name is required", 400));
    const exists = await StageCategory.findOne({ name });
    if (exists) return next(new AppError("Category name already exists", 400));

    // Validate provided stage ids
    const uniqueStages = [...new Set(stages.filter(Boolean))];
    for (const id of uniqueStages) {
      const st = await Stage.findById(id);
      if (!st) return next(new AppError(`Stage not found: ${id}`, 400));
    }

    const created = await StageCategory.create({ name, description, stages: uniqueStages, status });
    res.status(201).json({ success: true, message: "Category created", data: { category: created } });
  } catch (e) {
    next(new AppError(e.message, 500));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, stages, status } = req.body;
    const update = {};
    if (name) {
      const exists = await StageCategory.findOne({ name, _id: { $ne: req.params.id } });
      if (exists) return next(new AppError("Category name already exists", 400));
      update.name = name;
    }
    if (description !== undefined) update.description = description;
    if (status) update.status = status;
    if (stages) {
      const uniqueStages = [...new Set(stages.filter(Boolean))];
      for (const id of uniqueStages) {
        const st = await Stage.findById(id);
        if (!st) return next(new AppError(`Stage not found: ${id}`, 400));
      }
      update.stages = uniqueStages;
    }

    const updated = await StageCategory.findByIdAndUpdate(req.params.id, update, { new: true }).populate("stages", "name status");
    if (!updated) return next(new AppError("Category not found", 404));
    res.status(200).json({ success: true, message: "Category updated", data: { category: updated } });
  } catch (e) {
    next(new AppError(e.message, 500));
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await StageCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError("Category not found", 404));
    res.status(200).json({ success: true, message: "Category deleted", data: { id: req.params.id } });
  } catch (e) {
    next(new AppError(e.message, 500));
  }
};


