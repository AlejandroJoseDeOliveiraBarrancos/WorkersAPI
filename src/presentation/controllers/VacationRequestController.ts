import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { CreateVacationRequestUseCase } from '../../application/use-cases/CreateVacationRequestUseCase';
import { ApproveVacationRequestUseCase } from '../../application/use-cases/ApproveVacationRequestUseCase';
import { RejectVacationRequestUseCase } from '../../application/use-cases/RejectVacationRequestUseCase';
import { GetWorkerVacationBalanceUseCase } from '../../application/use-cases/GetWorkerVacationBalanceUseCase';
import { TYPES } from '../../application/di/types';

/**
 * @swagger
 * components:
 *   schemas:
 *     VacationRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the vacation request
 *         workerId:
 *           type: string
 *           description: ID of the worker requesting vacation
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the vacation
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the vacation
 *         days:
 *           type: number
 *           description: Number of vacation days requested
 *         hours:
 *           type: number
 *           description: Number of vacation hours requested
 *         type:
 *           type: string
 *           enum: [days, hours]
 *           description: Type of vacation request
 *         reason:
 *           type: string
 *           description: Reason for the vacation request
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Current status of the vacation request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the request was created
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was approved
 *         rejectedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was rejected
 *         approvedBy:
 *           type: string
 *           description: Who approved the request
 *         totalTimeInDays:
 *           type: number
 *           description: Total vacation time in days
 *       required:
 *         - workerId
 *         - startDate
 *         - endDate
 *         - days
 *         - hours
 *         - type
 *         - reason
 *     VacationBalance:
 *       type: object
 *       properties:
 *         workerId:
 *           type: string
 *           description: ID of the worker
 *         totalDays:
 *           type: number
 *           description: Total vacation days available
 *         usedDays:
 *           type: number
 *           description: Number of vacation days used
 *         availableDays:
 *           type: number
 *           description: Number of vacation days remaining
 *         pendingRequests:
 *           type: number
 *           description: Number of pending vacation requests
 */

@injectable()
export class VacationRequestController {
  constructor(
    @inject(TYPES.CreateVacationRequestUseCase) private createVacationRequestUseCase: CreateVacationRequestUseCase,
    @inject(TYPES.ApproveVacationRequestUseCase) private approveVacationRequestUseCase: ApproveVacationRequestUseCase,
    @inject(TYPES.RejectVacationRequestUseCase) private rejectVacationRequestUseCase: RejectVacationRequestUseCase,
    @inject(TYPES.GetWorkerVacationBalanceUseCase) private getWorkerVacationBalanceUseCase: GetWorkerVacationBalanceUseCase
  ) {}

  /**
   * @swagger
   * /api/vacation-requests:
   *   post:
   *     summary: Create a new vacation request
   *     description: Creates a new vacation request for a worker
   *     tags: [Vacation Requests]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               workerId:
   *                 type: string
   *                 description: ID of the worker requesting vacation
   *               startDate:
   *                 type: string
   *                 format: date
   *                 description: Start date of the vacation
   *               endDate:
   *                 type: string
   *                 format: date
   *                 description: End date of the vacation
   *               days:
   *                 type: number
   *                 description: Number of vacation days requested
   *               hours:
   *                 type: number
   *                 description: Number of vacation hours requested
   *               type:
   *                 type: string
   *                 enum: [days, hours]
   *                 description: Type of vacation request
   *               reason:
   *                 type: string
   *                 description: Reason for the vacation request
   *             required:
   *               - workerId
   *               - startDate
   *               - endDate
   *               - type
   *               - reason
   *     responses:
   *       201:
   *         description: Vacation request created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VacationRequest'
   *       400:
   *         description: Bad request - missing required fields or validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async createVacationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { workerId, startDate, endDate, days, hours, type, reason } = req.body;

      // Validate required fields
      if (!workerId || !startDate || !endDate || !type || !reason) {
        res.status(400).json({
          error: 'Missing required fields: workerId, startDate, endDate, type, reason'
        });
        return;
      }

      // Validate type-specific fields
      if (type === 'days' && (!days || days <= 0)) {
        res.status(400).json({
          error: 'Days must be greater than 0 when type is "days"'
        });
        return;
      }

      if (type === 'hours' && (!hours || hours <= 0)) {
        res.status(400).json({
          error: 'Hours must be greater than 0 when type is "hours"'
        });
        return;
      }

      const request = {
        workerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days: days || 0,
        hours: hours || 0,
        type,
        reason
      };

      const result = await this.createVacationRequestUseCase.execute(request);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating vacation request:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * @swagger
   * /api/vacation-requests/{id}/approve:
   *   put:
   *     summary: Approve a vacation request
   *     description: Approves a pending vacation request
   *     tags: [Vacation Requests]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Vacation request ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               approvedBy:
   *                 type: string
   *                 description: Name or ID of the person approving the request
   *             required:
   *               - approvedBy
   *     responses:
   *       200:
   *         description: Vacation request approved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VacationRequest'
   *       400:
   *         description: Bad request - missing required fields or validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Vacation request not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async approveVacationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;

      if (!id) {
        res.status(400).json({
          error: 'Vacation request ID is required'
        });
        return;
      }

      if (!approvedBy) {
        res.status(400).json({
          error: 'Approved by field is required'
        });
        return;
      }

      const request = {
        vacationRequestId: id,
        approvedBy
      };

      const result = await this.approveVacationRequestUseCase.execute(request);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error approving vacation request:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * @swagger
   * /api/vacation-requests/{id}/reject:
   *   put:
   *     summary: Reject a vacation request
   *     description: Rejects a pending vacation request
   *     tags: [Vacation Requests]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Vacation request ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rejectedBy:
   *                 type: string
   *                 description: Name or ID of the person rejecting the request
   *             required:
   *               - rejectedBy
   *     responses:
   *       200:
   *         description: Vacation request rejected successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VacationRequest'
   *       400:
   *         description: Bad request - missing required fields or validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Vacation request not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async rejectVacationRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rejectedBy } = req.body;

      if (!id) {
        res.status(400).json({
          error: 'Vacation request ID is required'
        });
        return;
      }

      if (!rejectedBy) {
        res.status(400).json({
          error: 'Rejected by field is required'
        });
        return;
      }

      const request = {
        vacationRequestId: id,
        rejectedBy
      };

      const result = await this.rejectVacationRequestUseCase.execute(request);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error rejecting vacation request:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * @swagger
   * /api/workers/{workerId}/vacation-balance:
   *   get:
   *     summary: Get worker vacation balance
   *     description: Retrieves the vacation balance for a specific worker
   *     tags: [Vacation Requests]
   *     parameters:
   *       - in: path
   *         name: workerId
   *         required: true
   *         schema:
   *           type: string
   *         description: Worker ID
   *     responses:
   *       200:
   *         description: Vacation balance retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VacationBalance'
   *       404:
   *         description: Worker not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getWorkerVacationBalance(req: Request, res: Response): Promise<void> {
    try {
      const { workerId } = req.params;

      if (!workerId) {
        res.status(400).json({
          error: 'Worker ID is required'
        });
        return;
      }

      const result = await this.getWorkerVacationBalanceUseCase.execute(workerId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting worker vacation balance:', error);
      res.status(404).json({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
} 