const express = require("express");
const School = require("../models/School");
const moment = require('moment');
const cors = require('cors'); // นำเข้า cors

function formatDateToDDMMYYYY(date) {
    if (!date) return null;

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

exports.getSchool = async (req, res) => {
    try {
        const schools = await School.find();

        const formattedSchools = schools.map(school => ({
            ...school.toObject(),
            date: formatDateToDDMMYYYY(school.date)
        }));

        res.status(200).json(formattedSchools);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSchoolID = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findById(id);

        if (school) {
            const formattedSchool = {
                ...school.toObject(),
                date: formatDateToDDMMYYYY(school.date)
            };

            res.status(200).json(formattedSchool);
        } else {
            res.status(404).json({ message: 'School not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.postSchool = async (req, res) => {
    try {
        const { date, startTime, endTime, school_name, district, provinc, student_count, teacher_name, phone_teacher, faculty } = req.body;
        
        // Validate time format
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
            return res.status(400).json({ message: 'Invalid time format. Use HH:MM' });
        }

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        // Convert Buddhist Era to Gregorian date
        const [day, month, yearBE] = date.split('/');
        const yearAD = parseInt(yearBE) - 543;
        const formattedDate = moment(`${yearAD}-${month}-${day}`, 'YYYY-MM-DD').toDate();

        // Create a new school object
        const school = new School({
            date: formattedDate,
            startTime,
            endTime,
            school_name,
            district,
            provinc,
            student_count,
            teacher_name,
            phone_teacher,
            faculty
        });

        // Save the school object to the database
        const savedSchool = await school.save();
        res.status(201).json(savedSchool);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findById(id);
        if (!school) return res.status(404).json({ message: 'School not found' });

        const update = req.body;

        // Handle date update if provided
        if (update.date) {
            const [day, month, yearBE] = update.date.split('/');
            const yearAD = parseInt(yearBE) - 543;
            update.date = moment(`${yearAD}-${month}-${day}`, 'YYYY-MM-DD').toDate();
        }

        Object.assign(school, update);
        const updatedSchool = await school.save();
        res.status(200).json(updatedSchool);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findById(id);
        if (!school) return res.status(404).json({ message: 'School not found' });

        await School.findByIdAndDelete(id);
        res.status(200).json({ message: 'School deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
