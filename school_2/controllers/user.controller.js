import User from "../models/user.js";




export const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select('-password').populate('medicines');
  
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }


  export const updateUser = async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        ...req.body,
      },
    { new: true, runValidators: true }
    )
  
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }