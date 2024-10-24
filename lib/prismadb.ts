/**
 * !Problem:
 * While developing with Next.js, users may encounter the following warning:
 * This occurs because the `next dev` command clears the Node.js cache,
 * causing a new PrismaClient instance to be initialized with each hot reload.
 * Each instance creates its own database connection pool, which can quickly exhaust the available database connections.
 */

/**
 * ?Solution:
 * To resolve this issue, instantiate a single PrismaClient instance and save it on the `globalThis` object.
 * This way, you can check whether the PrismaClient instance already exists on `globalThis` before creating a new one.
 * If it exists, reuse the existing instance to avoid multiple PrismaClient instances.
 */

//* The folowing code is from https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
//* For best practice to handle prisma client in production

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismadb = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismadb

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismadb