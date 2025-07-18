// controllers/dispute.js
const { Dispute, User, Ride } = require('../models');
const { AuditLog } = require('../models');

class DisputeController {
  static async list(req, res, next) {
    try {
      const disputes = await Dispute.findAll({
        include: [
          { model: User, as: 'complainant', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'resolver', attributes: ['id', 'name', 'email'] },
          { model: Ride }
        ]
      });
      res.json(disputes);
    } catch (err) {
      next(err);
    }
  }

  static async detail(req, res, next) {
    try {
      const { id } = req.params;
      const dispute = await Dispute.findByPk(id, {
        include: [
          { model: User, as: 'complainant', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'resolver', attributes: ['id', 'name', 'email'] },
          { model: Ride }
        ]
      });
      if (!dispute) return res.status(404).json({ message: 'Dispute not found' });
      res.json(dispute);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { rideId, description } = req.body;
      const userId = req.user.id;
      const dispute = await Dispute.create({ rideId, userId, description, status: 'open' });
      res.status(201).json(dispute);
    } catch (err) {
      next(err);
    }
  }

  static async resolve(req, res, next) {
    try {
      const { id } = req.params;
      const dispute = await Dispute.findByPk(id);
      if (!dispute) return res.status(404).json({ message: 'Dispute not found' });
      if (dispute.status === 'resolved') return res.status(400).json({ message: 'Dispute already resolved' });
      await dispute.update({ status: 'resolved', resolvedBy: req.user.id, resolvedAt: new Date() });
      // Audit log
      await AuditLog.create({
        adminId: req.user.id, // support/admin user
        action: 'resolve_dispute',
        targetId: dispute.id,
        targetType: 'dispute',
        details: { previousStatus: 'open', resolvedAt: new Date() }
      });
      res.json({ message: 'Dispute resolved' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DisputeController; 