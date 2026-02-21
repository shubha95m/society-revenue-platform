import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyToken } from '../lib/auth';

const router = Router();

// Authentication middleware (society admin only)
async function requireAuth(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'No authorization token provided' },
      });
    }

    const token = authHeader.substring(7);
    const session = await verifyToken(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
      });
    }

    if (session.role !== 'society_admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Society admin access required' },
      });
    }

    (req as any).session = session;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
}

// Helper function to generate reference number
async function generateReferenceNumber(entryType: string): Promise<string> {
  const count = await prisma.ledger_entries.count();
  const year = new Date().getFullYear();
  const prefix = entryType === 'income' ? 'INC' : 'EXP';
  return `${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
}

// GET /api/ledger/entries - List ledger entries with filters
router.get('/entries', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { entry_type, category, start_date, end_date } = req.query;

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Build where clause with filters
    const whereClause: any = { society_id: society.id };

    if (entry_type) {
      whereClause.entry_type = entry_type;
    }

    if (category) {
      whereClause.category = category;
    }

    if (start_date || end_date) {
      whereClause.transaction_date = {};
      if (start_date) {
        whereClause.transaction_date.gte = new Date(start_date as string);
      }
      if (end_date) {
        whereClause.transaction_date.lte = new Date(end_date as string);
      }
    }

    const entries = await prisma.ledger_entries.findMany({
      where: whereClause,
      orderBy: { transaction_date: 'desc' },
    });

    res.json({
      success: true,
      data: { entries },
    });
  } catch (error: any) {
    console.error('List ledger entries error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/ledger/entries/:id - Get entry details
router.get('/entries/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const entry = await prisma.ledger_entries.findUnique({
      where: { id },
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: { code: 'ENTRY_NOT_FOUND', message: 'Ledger entry not found' },
      });
    }

    // Get society info to verify ownership
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Verify entry belongs to this society
    if (entry.society_id !== society.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only view entries from your society' },
      });
    }

    res.json({
      success: true,
      data: { entry },
    });
  } catch (error: any) {
    console.error('Get ledger entry error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// POST /api/ledger/entries - Create ledger entry
router.post('/entries', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { entry_type, category, amount, description, transaction_date, payment_method } = req.body;

    // Validation
    if (!entry_type || !category || !amount || !transaction_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Entry type, category, amount, and transaction date are required',
        },
      });
    }

    if (entry_type !== 'income' && entry_type !== 'expense') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Entry type must be either "income" or "expense"',
        },
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Amount must be greater than 0',
        },
      });
    }

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Generate reference number
    const referenceNumber = await generateReferenceNumber(entry_type);

    // Create ledger entry
    const entry = await prisma.ledger_entries.create({
      data: {
        id: crypto.randomUUID(),
        society_id: society.id,
        entry_type,
        category,
        amount,
        description: description || '',
        reference_number: referenceNumber,
        transaction_date: new Date(transaction_date),
        payment_method: payment_method || null,
        created_by: session.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: { entry },
    });
  } catch (error: any) {
    console.error('Create ledger entry error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// PATCH /api/ledger/entries/:id - Update entry
router.patch('/entries/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { entry_type, category, amount, description, transaction_date, payment_method } = req.body;

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Check if entry exists and belongs to this society
    const existingEntry = await prisma.ledger_entries.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: { code: 'ENTRY_NOT_FOUND', message: 'Ledger entry not found' },
      });
    }

    if (existingEntry.society_id !== society.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only update entries from your society' },
      });
    }

    // Validation
    if (entry_type && entry_type !== 'income' && entry_type !== 'expense') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Entry type must be either "income" or "expense"',
        },
      });
    }

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Amount must be greater than 0',
        },
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (entry_type) updateData.entry_type = entry_type;
    if (category) updateData.category = category;
    if (amount !== undefined) updateData.amount = amount;
    if (description !== undefined) updateData.description = description;
    if (transaction_date) updateData.transaction_date = new Date(transaction_date);
    if (payment_method !== undefined) updateData.payment_method = payment_method;

    // Update entry
    const entry = await prisma.ledger_entries.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      data: { entry },
    });
  } catch (error: any) {
    console.error('Update ledger entry error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// DELETE /api/ledger/entries/:id - Delete entry
router.delete('/entries/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Check if entry exists and belongs to this society
    const existingEntry = await prisma.ledger_entries.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: { code: 'ENTRY_NOT_FOUND', message: 'Ledger entry not found' },
      });
    }

    if (existingEntry.society_id !== society.id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You can only delete entries from your society' },
      });
    }

    // Delete entry
    await prisma.ledger_entries.delete({
      where: { id },
    });

    res.json({
      success: true,
      data: { message: 'Ledger entry deleted successfully' },
    });
  } catch (error: any) {
    console.error('Delete ledger entry error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/ledger/summary - Get financial summary
router.get('/summary', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    // Get total income
    const incomeResult = await prisma.ledger_entries.aggregate({
      where: {
        society_id: society.id,
        entry_type: 'income',
      },
      _sum: {
        amount: true,
      },
    });

    // Get total expenses
    const expenseResult = await prisma.ledger_entries.aggregate({
      where: {
        society_id: society.id,
        entry_type: 'expense',
      },
      _sum: {
        amount: true,
      },
    });

    const totalIncome = Number(incomeResult._sum.amount) || 0;
    const totalExpenses = Number(expenseResult._sum.amount) || 0;
    const netBalance = totalIncome - totalExpenses;

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          netBalance,
        },
      },
    });
  } catch (error: any) {
    console.error('Get financial summary error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

// GET /api/ledger/reports - Generate financial reports
router.get('/reports', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).session;
    const { report_type, month, year } = req.query;

    // Get society info
    const society = await prisma.societies.findFirst({
      where: { admin_email: session.email },
    });

    if (!society) {
      return res.status(404).json({
        success: false,
        error: { code: 'SOCIETY_NOT_FOUND', message: 'Society not found' },
      });
    }

    let reportData: any = {};

    if (report_type === 'by_month') {
      // Monthly report
      if (!month || !year) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Month and year are required for monthly reports',
          },
        });
      }

      const monthNum = parseInt(month as string);
      const yearNum = parseInt(year as string);
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);

      const entries = await prisma.ledger_entries.findMany({
        where: {
          society_id: society.id,
          transaction_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { transaction_date: 'asc' },
      });

      const income = entries.filter(e => e.entry_type === 'income');
      const expenses = entries.filter(e => e.entry_type === 'expense');

      const totalIncome = income.reduce((sum, e) => sum + Number(e.amount), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

      reportData = {
        period: {
          month: monthNum,
          year: yearNum,
          startDate,
          endDate,
        },
        summary: {
          totalIncome,
          totalExpenses,
          netBalance: totalIncome - totalExpenses,
          totalTransactions: entries.length,
        },
        entries,
      };
    } else if (report_type === 'by_category') {
      // Category-wise report
      const entries = await prisma.ledger_entries.findMany({
        where: { society_id: society.id },
      });

      const categoryBreakdown: any = {};

      entries.forEach(entry => {
        if (!categoryBreakdown[entry.category]) {
          categoryBreakdown[entry.category] = {
            income: 0,
            expense: 0,
            count: 0,
          };
        }

        if (entry.entry_type === 'income') {
          categoryBreakdown[entry.category].income += Number(entry.amount);
        } else {
          categoryBreakdown[entry.category].expense += Number(entry.amount);
        }
        categoryBreakdown[entry.category].count += 1;
      });

      reportData = {
        categoryBreakdown,
        summary: {
          totalCategories: Object.keys(categoryBreakdown).length,
          totalTransactions: entries.length,
        },
      };
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Report type must be either "by_month" or "by_category"',
        },
      });
    }

    res.json({
      success: true,
      data: { report: reportData },
    });
  } catch (error: any) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
