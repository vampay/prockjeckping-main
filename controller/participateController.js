const express = require("express");
const Participate = require("../models/participate");
const cors = require('cors'); // นำเข้า cors

exports.getParticipate = async (req, res) => {
    try {
        const participates = await Participate.find();
        res.status(200).json(participates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getParticipateID = async (req, res) => {
    try {
        const { id } = req.params;
        const participate = await Participate.findById(id);
        if (participate) {
            res.status(200).json(participate);
        } else {
            res.status(404).json({ message: 'Participate not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.postParticipate = async (req, res) => {
    try {
        const { name, surname, course, Boarding_point } = req.body;

        // Validate required fields
        if (!name || !surname || !course || !Boarding_point) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const participate = new Participate({ name, surname, course, Boarding_point });
        const savedParticipate = await participate.save();
        res.status(201).json(savedParticipate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateParticipate = async (req, res) => {
    try {
        const { id } = req.params;
        const participate = await Participate.findById(id);

        if (!participate) {
            return res.status(404).json({ message: 'Participate not found' });
        }

        const { name, surname, course, Boarding_point } = req.body;

        // Update only fields that are provided
        if (name) participate.name = name;
        if (surname) participate.surname = surname;
        if (course) participate.course = course;
        if (Boarding_point) participate.Boarding_point = Boarding_point;

        const updatedParticipate = await participate.save();
        res.status(200).json(updatedParticipate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteParticipate = async (req, res) => {
    try {
        const { id } = req.params;
        const participate = await Participate.findById(id);

        if (!participate) {
            return res.status(404).json({ message: 'Participate not found' });
        }

        await Participate.findByIdAndDelete(id);
        res.status(200).json({ message: 'Participate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
