import Message from '../models/Message.js';

export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, jobId, message } = req.body;
        const newMessage = new Message({
            senderId: req.user._id,
            receiverId,
            jobId,
            message,
        });
        await newMessage.save();
        res.status(201).json({ messageId: newMessage._id, timestamp: newMessage.timestamp });
    } catch (error) {
        next(error);
    }
};

export const getMessagesByReceiverAndJob = async (req, res) => {
    try {
        const { receiverId, jobId } = req.params;
        const senderId = req.user._id; // The authenticated user (sender)

        // Find messages where:
        // - jobId matches
        // - AND the conversation is between sender and receiver (in any direction)
        const messages = await Message.find({
            jobId: jobId,
            $or: [
                { receiverId: receiverId },
            ]
        })

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};