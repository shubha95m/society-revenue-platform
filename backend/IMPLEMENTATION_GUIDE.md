# Backend API Implementation Guide

This guide explains how to implement the 150+ API endpoints for the Society Revenue Platform.

## Project Structure

```
backend/
├── src/
│   ├── api/                    # API endpoint implementations
│   │   ├── auth/              # Authentication endpoints
│   │   ├── resident/          # Resident endpoints
│   │   ├── society/           # Society admin endpoints
│   │   ├── vendor/            # Vendor endpoints
│   │   ├── admin/             # Platform admin endpoints
│   │   └── common/            # Common/public endpoints
│   │
│   ├── lib/                   # Shared libraries
│   │   ├── auth.ts           # Auth utilities
│   │   ├── prisma.ts         # Prisma client
│   │   └── utils.ts          # Helper functions
│   │
│   ├── middleware/            # Middleware functions
│   │   ├── auth.ts           # Auth & role guards
│   │   ├── validation.ts     # Input validation
│   │   └── rateLimit.ts      # Rate limiting
│   │
│   ├── services/              # Business logic
│   │   ├── authService.ts
│   │   ├── orderService.ts
│   │   ├── voteService.ts
│   │   └── ...
│   │
│   └── types/                 # TypeScript types
│       └── index.ts
│
├── API_ENDPOINTS.md           # Complete API documentation
└── IMPLEMENTATION_GUIDE.md    # This file
```

## Implementation Approach

### Option 1: Next.js API Routes (Recommended for Full-Stack)
If using Next.js for both frontend and backend, place API routes in:
```
frontend/app/api/
```

### Option 2: Express.js (Standalone Backend)
If building a separate backend service:
```
backend/src/api/
```

## This Guide Uses: Express.js Approach

We'll create a standalone backend with Express.js for better separation of concerns.

---

## Step 1: Install Dependencies

```bash
cd backend
npm init -y

# Core dependencies
npm install express cors dotenv
npm install @prisma/client bcryptjs jose
npm install zod  # For validation

# Dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/bcryptjs @types/cors
npm install -D tsx nodemon
npm install -D prisma
```

## Step 2: TypeScript Configuration

Create `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Step 3: Package.json Scripts

Add to `backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:studio": "prisma studio"
  }
}
```

## Step 4: Main Server File

Create `backend/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDatabaseConnection } from './lib/prisma';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
  const dbConnected = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

// API Routes
import authRoutes from './api/auth/routes';
import residentRoutes from './api/resident/routes';
import societyRoutes from './api/society/routes';
import vendorRoutes from './api/vendor/routes';
import adminRoutes from './api/admin/routes';

app.use('/api/auth', authRoutes);
app.use('/api/resident', residentRoutes);
app.use('/api/society', societyRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/health`);
});
```

## Step 5: Express Middleware Adapters

Create `backend/src/middleware/expressAuth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { AuthSession, UserRole, ErrorCode } from '../types';
import { verifyToken, refreshToken, updateLastActivity, hasRole } from '../lib/auth';

// Extend Express Request type
export interface AuthRequest extends Request {
  session?: AuthSession;
}

// Authentication middleware
export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.session_token;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: 'No authentication token provided',
        },
      });
    }

    // Verify token
    const session = await verifyToken(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.SESSION_EXPIRED,
          message: 'Session expired. Please login again.',
        },
      });
    }

    // Update activity
    const updatedSession = updateLastActivity(session);

    // Check for refresh
    const refreshResult = await refreshToken(updatedSession);
    if (refreshResult) {
      res.setHeader('X-Refreshed-Token', refreshResult.token);
      res.cookie('session_token', refreshResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      req.session = refreshResult.session;
    } else {
      req.session = updatedSession;
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Authentication error',
      },
    });
  }
}

// Role guard factory
export function requireRoles(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.session) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message: 'Authentication required',
        },
      });
    }

    if (!hasRole(req.session, allowedRoles)) {
      return res.status(403).json({
        success: false,
        error: {
          code: ErrorCode.FORBIDDEN,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        },
      });
    }

    next();
  };
}

// Specific role guards
export const requirePlatformAdmin = requireRoles('platform_admin');
export const requireSocietyAdmin = requireRoles('society_admin', 'platform_admin');
export const requireResident = requireRoles('resident', 'society_admin', 'platform_admin');
export const requireVendor = requireRoles('vendor', 'platform_admin');
```

## Step 6: Endpoint Pattern

Each endpoint follows this pattern:

```typescript
// backend/src/api/[service]/[endpoint].ts

import { Router } from 'express';
import { AuthRequest, authenticate, requireResident } from '../../middleware/expressAuth';
import { prisma } from '../../lib/prisma';
import { ApiResponse } from '../../types';

const router = Router();

// GET /api/resident/orders
router.get('/orders', authenticate, requireResident, async (req: AuthRequest, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const session = req.session!;

    // Get orders
    const orders = await prisma.order.findMany({
      where: {
        residentId: session.residentId,
        ...(status && { status: status as string }),
      },
      include: {
        vendor: {
          select: {
            businessName: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.order.count({
      where: {
        residentId: session.residentId,
        ...(status && { status: status as string }),
      },
    });

    res.json<ApiResponse>({
      success: true,
      data: orders,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        hasMore: total > Number(page) * Number(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json<ApiResponse>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch orders',
      },
    });
  }
});

export default router;
```

## Step 7: Service Files (Business Logic)

Create service files to keep controllers thin:

```typescript
// backend/src/services/orderService.ts

import { prisma } from '../lib/prisma';
import { CreateOrderDto } from '../types';

export class OrderService {
  async createOrder(residentId: string, societyId: string, data: CreateOrderDto) {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate platform commission
    const platformCommissionAmount = data.totalAmount * 0.05; // 5%
    const vendorPayoutAmount = data.totalAmount - platformCommissionAmount;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        societyId,
        residentId,
        vendorId: data.vendorId,
        serviceId: data.serviceId,
        contractId: data.contractId,
        serviceName: data.serviceName,
        description: data.description,
        quantity: data.quantity || 1,
        unit: data.unit,
        unitPrice: data.unitPrice,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount || 0,
        discountAmount: data.discountAmount || 0,
        totalAmount: data.totalAmount,
        platformCommissionPercentage: 5.0,
        platformCommissionAmount,
        vendorPayoutAmount,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        scheduledTimeSlot: data.scheduledTimeSlot,
        deliveryAddress: data.deliveryAddress,
        specialInstructions: data.specialInstructions,
        status: 'pending',
      },
      include: {
        vendor: {
          select: {
            businessName: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        transactionNumber: `TXN-${Date.now()}`,
        societyId,
        residentId,
        vendorId: data.vendorId,
        orderId: order.id,
        type: 'service_revenue',
        description: `Payment for ${data.serviceName}`,
        amount: data.totalAmount,
        platformCommission: platformCommissionAmount,
        status: 'pending',
        paymentMethod: 'online', // TODO: Get from request
      },
    });

    return order;
  }

  async updateOrderStatus(orderId: string, status: string, userId: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(status === 'confirmed' && { confirmedAt: new Date() }),
        ...(status === 'in_progress' && { startedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date() }),
        ...(status === 'cancelled' && { cancelledAt: new Date() }),
      },
    });

    return order;
  }

  async rateOrder(orderId: string, rating: number, feedback?: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        residentRating: rating,
        residentFeedback: feedback,
        ratedAt: new Date(),
      },
    });

    // Update vendor's average rating
    const vendorOrders = await prisma.order.findMany({
      where: {
        vendorId: order.vendorId,
        residentRating: { not: null },
      },
      select: {
        residentRating: true,
      },
    });

    const avgRating =
      vendorOrders.reduce((sum, o) => sum + (o.residentRating || 0), 0) / vendorOrders.length;

    await prisma.vendor.update({
      where: { id: order.vendorId },
      data: {
        averageRating: avgRating,
        totalRatings: vendorOrders.length,
      },
    });

    return order;
  }
}
```

## Step 8: Validation with Zod

Create `backend/src/middleware/validation.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ErrorCode } from '../types';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: ErrorCode.VALIDATION_ERROR,
            message: 'Validation failed',
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
}

// Example schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createOrderSchema = z.object({
  vendorId: z.string().uuid(),
  serviceId: z.string().uuid(),
  serviceName: z.string(),
  quantity: z.number().positive().optional(),
  unitPrice: z.number().positive(),
  totalAmount: z.number().positive(),
  scheduledDate: z.string().optional(),
  deliveryAddress: z.string().optional(),
});
```

## Step 9: Rate Limiting

Create `backend/src/middleware/rateLimit.ts`:

```typescript
import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 5 requests per minute for auth endpoints
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts. Please try again later.',
    },
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10, // 10 uploads per minute
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many upload requests. Please try again later.',
    },
  },
});
```

## Step 10: Environment Variables

Create `backend/.env`:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/society_revenue_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production-use-random-string"

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# File Upload (AWS S3 / CloudFlare R2)
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
S3_BUCKET="society-revenue-uploads"
S3_REGION="us-east-1"

# Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Platform Settings
PLATFORM_COMMISSION_PERCENTAGE=5.0
```

## Implementation Progress

### ✅ Completed
- Type definitions
- Authentication utilities
- Middleware (auth, role guards)
- Database client (Prisma)
- API documentation (150+ endpoints)

### 🚧 To Implement
1. **Authentication Endpoints** (5 endpoints)
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout
   - GET /api/auth/session
   - POST /api/auth/refresh

2. **Resident Endpoints** (30+ endpoints)
3. **Society Admin Endpoints** (60+ endpoints)
4. **Vendor Endpoints** (25+ endpoints)
5. **Platform Admin Endpoints** (20+ endpoints)
6. **Common Endpoints** (10+ endpoints)

## Next Steps

1. **Set up Express server** (follow steps above)
2. **Implement authentication endpoints** (use patterns provided)
3. **Implement one complete service** (e.g., orders) as a reference
4. **Use the same pattern** for all other endpoints
5. **Add tests** for each endpoint
6. **Deploy** to production

## Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Generate Prisma client
npm run prisma:generate

# 4. Push database schema
npm run prisma:push

# 5. Start development server
npm run dev
```

Server will run on: http://localhost:4000

## Testing Endpoints

Use tools like:
- **Postman**: Import the API collection
- **Thunder Client** (VS Code extension)
- **curl**: Command line testing
- **Jest + Supertest**: Automated tests

Example curl:
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get orders (with auth token)
curl -X GET http://localhost:4000/api/resident/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npm run prisma:generate
EXPOSE 4000
CMD ["npm", "start"]
```

---

This completes the implementation guide. Follow the patterns demonstrated to implement all 150+ endpoints!
