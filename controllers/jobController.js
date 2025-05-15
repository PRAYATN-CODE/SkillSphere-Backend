import Job from '../models/Job.js';

export const createJob = async (req, res, next) => {
    try {
        const { title, description, skills, location, salary } = req.body;

        console.log(req.user)

        const job = new Job({
            title,
            description,
            skills,
            location,
            salary,
            company: req.user.company,
            employerId: req.user._id,
        });
        await job.save();
        res.status(201).json({ jobId: job._id, message: 'Job posted successfully!' });
    } catch (error) {
        next(error);
    }
};

export const getJobs = async (req, res, next) => {
    try {
        const { skills, location } = req.query;
        const query = {};
        if (skills) query.skills = { $in: skills.split(',') };
        if (location) query.location = location;
        const jobs = await Job.find(query).select('jobId title company skills location');
        res.json(jobs);
    } catch (error) {
        next(error);
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        await Job.findByIdAndDelete(req.params.jobId);
        res.json({ message: 'Job deleted successfully!' });
    } catch (error) {
        next(error);
    }
};

export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().select('jobId title company skills location salary description employerId');
        res.json(jobs);
    } catch (error) {
        next(error);
    }
};