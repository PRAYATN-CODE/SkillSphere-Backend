import uploadFileCloudinary from '../config/uploadFileCloudinary.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js'; // assuming you have a Job model

export const applyForJob = async (req, res, next) => {
    try {
        const { coverLetter } = req.body;
        const resume = req.file;

        if (!resume) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        const uploadedResume = await uploadFileCloudinary(resume);

        const application = new Application({
            jobId: req.params.jobId,
            seekerId: req.user._id,
            coverLetter,
            resumeUrl: uploadedResume.url || 'No URL Provided',
        });

        await application.save();

        res.status(201).json({ applicationId: application._id, message: 'Application submitted!' });
    } catch (error) {
        next(error);
    }
};

export const getApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('seekerId', 'name email coverLetter status appliedAt');

        res.json(applications);
    } catch (error) {
        next(error);
    }
};


export const getUserApplications = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const applications = await Application.find({ seekerId: userId })
            .populate('jobId')     // Populate full job details
            .populate('seekerId'); // Populate full user details

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

export const getEmployerApplications = async (req, res, next) => {
    try {
        const employerId = req.user._id;

        // Find all jobs posted by the current employer
        const employerJobs = await Job.find({ employerId: employerId }).select('_id');

        const jobIds = employerJobs.map(job => job._id);
        console.log(jobIds)
        // Find all applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('jobId', 'title') // Populate job title
            .populate('seekerId', 'name email'); // Populate applicant details

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

