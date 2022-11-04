import { PrismaClient } from '@prisma/client';
/**
 * In development, 
 * the command 'next dev' clears Node.js cache on run. 
 * This in turn initializes a new PrismaClient instance each time due to hot reloading that creates a connection to the database. 
 * This can quickly exhaust the database connections as each PrismaClient instance holds its own connection pool.
 */
declare global {
    // allow global `var` declarations
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma